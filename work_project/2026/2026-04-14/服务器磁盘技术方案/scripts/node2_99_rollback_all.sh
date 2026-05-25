#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

STATE_FILE="/filedata/node2/meta/manifests/migration_state.tsv"
FSTAB_FILE="/etc/fstab"
ONLY_CATEGORY="${1:-all}"

require_root
[ -f "$STATE_FILE" ] || fail "未找到 $STATE_FILE"

rollback_one() {
  local category="$1" method="$2" orig="$3" target="$4" backup="$5"
  if [ "$ONLY_CATEGORY" != "all" ] && [ "$ONLY_CATEGORY" != "$category" ]; then
    return 0
  fi
  if mountpoint -q "$orig"; then
    umount "$orig" || fail "卸载失败: $orig"
  fi
  if [ -L "$orig" ]; then
    rm -f "$orig"
  fi
  if [ -e "$orig" ] && [ ! -L "$orig" ]; then
    rm -rf "$orig"
  fi
  if [ -e "$backup" ]; then
    mv "$backup" "$orig"
  else
    warn "备份不存在，无法恢复: $backup"
  fi
  if [ "$method" = "bind" ]; then
    safe_remove_fstab_bind "$target" "$orig" "$FSTAB_FILE"
  fi
}

tac "$STATE_FILE" | tail -n +2 | while IFS=$'\t' read -r category method orig target backup; do
  [ -n "$orig" ] || continue
  rollback_one "$category" "$method" "$orig" "$target" "$backup"
done

log "node2 回滚完成"
