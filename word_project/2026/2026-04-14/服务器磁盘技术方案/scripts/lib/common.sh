#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
fail() { log "ERROR: $*"; exit 1; }
warn() { log "WARN: $*"; }
require_root() { [ "$(id -u)" -eq 0 ] || fail "请使用 root 执行"; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "缺少命令: $1"; }

DRY_RUN=0
RUN_LOG_FILE=""

parse_dry_run_flag() {
  for arg in "$@"; do
    case "$arg" in
      --dry-run) DRY_RUN=1 ;;
    esac
  done
}

run_cmd() {
  if [ "$DRY_RUN" -eq 1 ]; then
    log "[DRY-RUN] $*"
  else
    eval "$@"
  fi
}

ensure_parent_dir() {
  local file="$1"
  mkdir -p "$(dirname "$file")"
}

setup_run_log() {
  local file="$1"
  RUN_LOG_FILE="$file"
  ensure_parent_dir "$file"
  touch "$file"
}

append_run_log() {
  [ -n "$RUN_LOG_FILE" ] || return 0
  printf '[%s] %s\n' "$(date '+%F %T')" "$*" >> "$RUN_LOG_FILE"
}

log_run() {
  log "$*"
  append_run_log "$*"
}

mount_is_bound_to() {
  local source="$1"
  local target="$2"
  mount | grep -F " on $target " | grep -F "$source" >/dev/null 2>&1
}

ensure_not_mounted() {
  local path="$1"
  if mountpoint -q "$path"; then
    fail "$path 当前已挂载，请先检查现场状态"
  fi
}

safe_append_fstab_bind() {
  local source="$1"
  local target="$2"
  local fstab_file="$3"
  local line="$source  $target  none  bind  0 0"
  grep -Fq "$line" "$fstab_file" 2>/dev/null || printf '%s\n' "$line" >> "$fstab_file"
}

safe_remove_fstab_bind() {
  local source="$1"
  local target="$2"
  local fstab_file="$3"
  local tmp_file
  tmp_file="${fstab_file}.tmp.$$"
  if [ ! -f "$fstab_file" ]; then
    return 0
  fi
  grep -Fvx "$source  $target  none  bind  0 0" "$fstab_file" > "$tmp_file" || true
  cat "$tmp_file" > "$fstab_file"
  rm -f "$tmp_file"
}

state_file_header() {
  local state_file="$1"
  ensure_parent_dir "$state_file"
  if [ ! -f "$state_file" ] || [ ! -s "$state_file" ]; then
    printf 'category\tmethod\torig\ttarget\tbackup\n' > "$state_file"
  fi
}

append_state() {
  local state_file="$1"
  local category="$2"
  local method="$3"
  local orig="$4"
  local target="$5"
  local backup="$6"
  printf '%s\t%s\t%s\t%s\t%s\n' "$category" "$method" "$orig" "$target" "$backup" >> "$state_file"
}

wait_for_pid_match() {
  local pattern="$1"
  local retries="${2:-12}"
  local sleep_seconds="${3:-5}"
  local i=1
  while [ "$i" -le "$retries" ]; do
    if pgrep -f "$pattern" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$sleep_seconds"
    i=$((i+1))
  done
  return 1
}

wait_for_port_listen() {
  local port="$1"
  local retries="${2:-12}"
  local sleep_seconds="${3:-5}"
  local i=1
  while [ "$i" -le "$retries" ]; do
    if ss -lntp 2>/dev/null | grep -E ":${port}[[:space:]]" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$sleep_seconds"
    i=$((i+1))
  done
  return 1
}
