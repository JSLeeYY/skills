#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

FSTAB_FILE="/etc/fstab"
META_DIR="/filedata/node2/meta"
STATE_FILE="$META_DIR/manifests/migration_state.tsv"
TS="$(date '+%Y%m%d%H%M%S')"

parse_dry_run_flag "$@"
require_root
require_cmd rsync
require_cmd mount
require_cmd ss
require_cmd pgrep
state_file_header "$STATE_FILE"
setup_run_log "$META_DIR/logs/node2_mysql_migrate_${TS}.log"

migrate_one() {
  local name="$1"
  local datadir="$2"
  local target="$3"
  local start_cmd="$4"
  local stop_pattern="$5"
  local pid_pattern="$6"
  local port="$7"
  local backup_dir="${datadir}.bak_${TS}_${name}"
  local owner

  [ -d "$datadir" ] || fail "原始 datadir 不存在: $datadir"
  ensure_not_mounted "$target"
  mkdir -p "$target"
  owner=$(stat -c '%U:%G' "$datadir")

  log_run "停止实例 $name"
  run_cmd "pkill -f '$stop_pattern' || true"
  sleep 5
  if [ "$DRY_RUN" -eq 0 ] && pgrep -f "$pid_pattern" >/dev/null 2>&1; then
    fail "实例 $name 停止失败"
  fi

  log_run "同步实例 $name 数据"
  run_cmd "rsync -aHAX --numeric-ids '$datadir/' '$target/'"
  run_cmd "chown -R '$owner' '$target'"

  log_run "切换实例 $name 到共享盘"
  run_cmd "mv '$datadir' '$backup_dir'"
  run_cmd "mkdir -p '$datadir'"
  run_cmd "chown '$owner' '$datadir'"
  run_cmd "mount --bind '$target' '$datadir'"

  if [ "$DRY_RUN" -eq 0 ]; then
    mount_is_bound_to "$target" "$datadir" || fail "实例 $name bind mount 校验失败"
    safe_append_fstab_bind "$target" "$datadir" "$FSTAB_FILE"
    append_state "$STATE_FILE" "mysql" "bind" "$datadir" "$target" "$backup_dir"
  fi

  log_run "启动实例 $name"
  run_cmd "nohup bash -c \"$start_cmd\" >/tmp/${name}_mysql_start.log 2>&1 &"
  if [ "$DRY_RUN" -eq 0 ]; then
    wait_for_pid_match "$pid_pattern" 12 5 || fail "实例 $name 进程未拉起"
    wait_for_port_listen "$port" 12 5 || fail "实例 $name 端口 $port 未监听"
    mount_is_bound_to "$target" "$datadir" || fail "实例 $name 启动后 bind mount 丢失"
  fi
}

mkdir -p "$META_DIR/manifests" "$META_DIR/rollback" "$META_DIR/logs"
migrate_one "mysql3308" "/opt/mysql/mydata/3308/data" "/filedata/node2/mysql/mysql3308" "/opt/mysql/mysql/base/bin/mysqld_safe --defaults-file=/opt/mysql/my.conf --user=root" "/opt/mysql/mysql/base/bin/mysqld|/opt/mysql/mysql/base/bin/mysqld_safe" "/opt/mysql/mysql/base/bin/mysqld.*3308|/opt/mysql/mysql/base/bin/mysqld_safe.*my.conf|/opt/mysql/mydata/3308/data" "3308"
migrate_one "weaver3306" "/usr/local/weaver_mysql/data" "/filedata/node2/mysql/weaver3306" "/usr/local/weaver_mysql/base/bin/mysqld_safe --datadir=/usr/local/weaver_mysql/data --pid-file=/usr/local/weaver_mysql/data/$(hostname).pid" "/usr/local/weaver_mysql/base/bin/mysqld|/usr/local/weaver_mysql/base/bin/mysqld_safe" "/usr/local/weaver_mysql/base/bin/mysqld|/usr/local/weaver_mysql/base/bin/mysqld_safe|/usr/local/weaver_mysql/data" "3306"

log_run "node2 双 MySQL 迁移完成"
