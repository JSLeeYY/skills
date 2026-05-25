#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ORIG_DATADIR="/data/mysql57/data"
TARGET_DATADIR="/filedata/node3/mysql/mysql57_3603"
MYSQL_USER="mysql"
MYSQL_GROUP="mysql"
MYSQL_BIN="/usr/local/mysql/bin/mysqld"
MYSQL_SAFE_BIN="/usr/local/mysql/bin/mysqld_safe"
MYSQL_PORT="3603"
MYSQL_PID_PATTERN="/usr/local/mysql/bin/mysqld"
META_DIR="/filedata/node3/meta"
STATE_FILE="$META_DIR/manifests/migration_state.tsv"
FSTAB_FILE="/etc/fstab"
TS="$(date '+%Y%m%d%H%M%S')"
BACKUP_DIR="${ORIG_DATADIR}.bak_${TS}"

parse_dry_run_flag "$@"
require_root
require_cmd rsync
require_cmd mount
require_cmd ss
require_cmd pgrep
state_file_header "$STATE_FILE"
setup_run_log "$META_DIR/logs/node3_mysql_migrate_${TS}.log"

[ -d "$ORIG_DATADIR" ] || fail "原始 datadir 不存在: $ORIG_DATADIR"
ensure_not_mounted "$TARGET_DATADIR"
mkdir -p "$TARGET_DATADIR"

log_run "停止 MySQL 进程"
run_cmd "pkill -f '$MYSQL_BIN' || true"
run_cmd "pkill -f '$MYSQL_SAFE_BIN' || true"
sleep 5
if [ "$DRY_RUN" -eq 0 ] && pgrep -f "$MYSQL_PID_PATTERN" >/dev/null 2>&1; then
  fail "MySQL 停止失败，拒绝继续"
fi

log_run "同步数据到共享盘"
run_cmd "rsync -aHAX --numeric-ids '$ORIG_DATADIR/' '$TARGET_DATADIR/'"
run_cmd "chown -R '$MYSQL_USER:$MYSQL_GROUP' '$TARGET_DATADIR'"

log_run "备份原目录并挂载 bind"
run_cmd "mv '$ORIG_DATADIR' '$BACKUP_DIR'"
run_cmd "mkdir -p '$ORIG_DATADIR'"
run_cmd "chown '$MYSQL_USER:$MYSQL_GROUP' '$ORIG_DATADIR'"
run_cmd "mount --bind '$TARGET_DATADIR' '$ORIG_DATADIR'"
if [ "$DRY_RUN" -eq 0 ]; then
  mount_is_bound_to "$TARGET_DATADIR" "$ORIG_DATADIR" || fail "bind mount 校验失败"
  safe_append_fstab_bind "$TARGET_DATADIR" "$ORIG_DATADIR" "$FSTAB_FILE"
  append_state "$STATE_FILE" "mysql" "bind" "$ORIG_DATADIR" "$TARGET_DATADIR" "$BACKUP_DIR"
fi

log_run "启动 MySQL"
run_cmd "nohup '$MYSQL_SAFE_BIN' --datadir='$ORIG_DATADIR' --pid-file='$ORIG_DATADIR/$(hostname).novalocal.pid' >/tmp/node3_mysql_start.log 2>&1 &"
if [ "$DRY_RUN" -eq 0 ]; then
  wait_for_pid_match "$MYSQL_PID_PATTERN" 12 5 || fail "MySQL 进程未拉起"
  wait_for_port_listen "$MYSQL_PORT" 12 5 || fail "MySQL 端口 $MYSQL_PORT 未监听"
  mount_is_bound_to "$TARGET_DATADIR" "$ORIG_DATADIR" || fail "启动后 bind mount 丢失"
fi

log_run "node3 MySQL 迁移完成"
