#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="/filedata/node1"
OUT_FILE="$BASE_DIR/meta/manifests/discovered_logs.tsv"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
require_root() { [ "$(id -u)" -eq 0 ] || { echo '请使用 root 执行'; exit 1; }; }

describe_path() {
  case "$1" in
    /var/log) echo "系统日志根目录" ;;
    /var/log/messages) echo "CentOS 综合系统日志" ;;
    /var/log/secure) echo "安全认证日志" ;;
    /var/log/cron) echo "定时任务日志" ;;
    /var/log/audit) echo "审计日志" ;;
    *nginx*) echo "Nginx 访问/错误日志" ;;
    *tomcat*|*catalina*) echo "Tomcat 运行日志" ;;
    *nohup.out) echo "Java/脚本后台输出日志" ;;
    *) echo "待人工识别日志用途" ;;
  esac
}

require_root
mkdir -p "$(dirname "$OUT_FILE")"
printf 'approved\ttype\tpath\tservice\tdescription\ttarget_subdir\tmethod\n' > "$OUT_FILE"

for p in /var/log /var/log/messages /var/log/secure /var/log/cron /var/log/audit; do
  [ -e "$p" ] || continue
  t="dir"; [ -f "$p" ] && t="file"
  printf 'N\t%s\t%s\tsystem\t%s\tsystem/%s\t%s\n' "$t" "$p" "$(describe_path "$p")" "$(basename "$p")" "$( [ "$t" = dir ] && echo bind || echo symlink )" >> "$OUT_FILE"
done

find /opt /data /usr/local -xdev \( -type d \( -iname log -o -iname logs \) -o -type f \( -iname '*.log' -o -name 'nohup.out' -o -name 'catalina.out' \) \) 2>/dev/null | while read -r p; do
  case "$p" in
    /var/lib/docker/*) continue ;;
  esac
  t="dir"; [ -f "$p" ] && t="file"
  svc=$(echo "$p" | awk -F/ '{print $3}')
  [ -n "$svc" ] || svc="misc"
  printf 'N\t%s\t%s\t%s\t%s\tservices/%s\t%s\n' "$t" "$p" "$svc" "$(describe_path "$p")" "$svc" "$( [ "$t" = dir ] && echo bind || echo symlink )" >> "$OUT_FILE"
done

log "已生成 $OUT_FILE，请复制为 approved_logs.tsv 后人工审核 approved 列"
