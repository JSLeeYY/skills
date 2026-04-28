#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"
# shellcheck source=./lib/validate.sh
source "$SCRIPT_DIR/lib/validate.sh"

BASE_DIR="/filedata/node1"
APPROVED_FILE="$BASE_DIR/meta/manifests/approved_logs.tsv"
STATE_FILE="$BASE_DIR/meta/manifests/migration_state.tsv"
FSTAB_FILE="/etc/fstab"
TS="$(date '+%Y%m%d%H%M%S')"
META_LOG_DIR="$BASE_DIR/meta/logs"

parse_dry_run_flag "$@"
require_root
require_cmd rsync
require_cmd mount
state_file_header "$STATE_FILE"
setup_run_log "$META_LOG_DIR/node1_logs_apply_${TS}.log"

[ -f "$APPROVED_FILE" ] || fail "未找到 $APPROVED_FILE"
validate_tsv_header "$APPROVED_FILE" || fail "approved_logs.tsv 表头不合法"
validate_no_parent_child_conflicts "$APPROVED_FILE" || fail "approved_logs.tsv 存在父子路径冲突"

apply_one() {
  local type="$1" path="$2" target_subdir="$3" method="$4"
  local target="$BASE_DIR/logs/$target_subdir"
  local backup="${path}.bak_${TS}"
  local owner

  validate_type "$type" || fail "type 非法: $type"
  validate_method "$method" || fail "method 非法: $method"
  validate_existing_path "$path" || { log_run "跳过不存在路径: $path"; return 0; }
  validate_not_dangerous_root "$path" || fail "危险路径禁止迁移: $path"

  owner=$(stat -c '%U:%G' "$path")
  mkdir -p "$(dirname "$target")"

  if [ "$type" = "dir" ] && [ "$method" = "bind" ]; then
    log_run "迁移目录日志 $path -> $target"
    run_cmd "mkdir -p '$target'"
    run_cmd "rsync -a '$path/' '$target/'"
    run_cmd "chown -R '$owner' '$target'"
    run_cmd "mv '$path' '$backup'"
    run_cmd "mkdir -p '$path'"
    run_cmd "chown '$owner' '$path'"
    run_cmd "mount --bind '$target' '$path'"
    if [ "$DRY_RUN" -eq 0 ]; then
      mount_is_bound_to "$target" "$path" || fail "日志目录 bind mount 校验失败: $path"
      safe_append_fstab_bind "$target" "$path" "$FSTAB_FILE"
      append_state "$STATE_FILE" "log" "bind" "$path" "$target" "$backup"
    fi
  else
    log_run "迁移单文件日志 $path -> $target/$(basename "$path")"
    run_cmd "mkdir -p '$target'"
    run_cmd "cp -a '$path' '$target/$(basename "$path")'"
    run_cmd "mv '$path' '$backup'"
    run_cmd "ln -s '$target/$(basename "$path")' '$path'"
    if [ "$DRY_RUN" -eq 0 ]; then
      [ -L "$path" ] || fail "单文件日志软链接校验失败: $path"
      append_state "$STATE_FILE" "log" "symlink" "$path" "$target/$(basename "$path")" "$backup"
    fi
  fi
}

tail -n +2 "$APPROVED_FILE" | while IFS=$'\t' read -r approved type path service description target_subdir method; do
  [ "$approved" = "Y" ] || continue
  apply_one "$type" "$path" "$target_subdir" "$method"
done

log_run "node1 日志迁移完成"
