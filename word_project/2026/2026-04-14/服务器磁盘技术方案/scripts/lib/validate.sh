#!/usr/bin/env bash
set -euo pipefail

DANGEROUS_ROOTS=(/ /var /opt /usr /data /usr/local /etc /bin /sbin /lib /lib64)

validate_existing_path() {
  local path="$1"
  [ -e "$path" ] || return 1
}

validate_not_dangerous_root() {
  local path="$1"
  for item in "${DANGEROUS_ROOTS[@]}"; do
    [ "$path" = "$item" ] && return 1
  done
  return 0
}

validate_tsv_header() {
  local file="$1"
  local header
  header=$(head -n 1 "$file")
  [ "$header" = $'approved\ttype\tpath\tservice\tdescription\ttarget_subdir\tmethod' ]
}

validate_method() {
  case "$1" in
    bind|symlink) return 0 ;;
    *) return 1 ;;
  esac
}

validate_type() {
  case "$1" in
    dir|file) return 0 ;;
    *) return 1 ;;
  esac
}

validate_no_parent_child_conflicts() {
  local approved_file="$1"
  local tmp
  tmp=$(mktemp)
  tail -n +2 "$approved_file" | awk -F'\t' '$1=="Y" {print $3}' | sort > "$tmp"
  while IFS= read -r path1; do
    [ -n "$path1" ] || continue
    while IFS= read -r path2; do
      [ -n "$path2" ] || continue
      [ "$path1" = "$path2" ] && continue
      case "$path2" in
        "$path1"/*)
          rm -f "$tmp"
          return 1
          ;;
      esac
    done < "$tmp"
  done < "$tmp"
  rm -f "$tmp"
  return 0
}

validate_node2_not_docker_path() {
  local path="$1"
  case "$path" in
    /var/lib/docker/*|*/docker/overlay2/*|*/containers/*) return 1 ;;
    *) return 0 ;;
  esac
}
