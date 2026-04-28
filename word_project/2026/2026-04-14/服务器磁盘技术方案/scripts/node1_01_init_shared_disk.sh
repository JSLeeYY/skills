#!/usr/bin/env bash
set -euo pipefail

NODE_NAME="node1"
DEVICE_PART="/dev/sdb1"
MOUNT_POINT="/filedata/node1"
LABEL_NAME="FILEDATA_NODE1"
FS_TYPE="ext4"
BASE_DIR="$MOUNT_POINT"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
fail() { log "ERROR: $*"; exit 1; }
require_root() { [ "$(id -u)" -eq 0 ] || fail "请使用 root 执行"; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "缺少命令: $1"; }

require_root
require_cmd blkid
require_cmd mount
require_cmd mkdir
require_cmd awk

mkdir -p "$MOUNT_POINT"

if ! blkid "$DEVICE_PART" >/dev/null 2>&1; then
  fail "$DEVICE_PART 不存在或未格式化，请先在 node3 上完成分区与 mkfs"
fi

CURRENT_LABEL=$(blkid -s LABEL -o value "$DEVICE_PART" || true)
if [ "$CURRENT_LABEL" != "$LABEL_NAME" ]; then
  log "警告：$DEVICE_PART label 当前为 '$CURRENT_LABEL'，期望 '$LABEL_NAME'"
fi

if mountpoint -q "$MOUNT_POINT"; then
  log "$MOUNT_POINT 已挂载，跳过 mount"
else
  mount "$DEVICE_PART" "$MOUNT_POINT"
  log "已挂载 $DEVICE_PART -> $MOUNT_POINT"
fi

mkdir -p \
  "$BASE_DIR/mysql/mysql57_3603" \
  "$BASE_DIR/logs/services" \
  "$BASE_DIR/logs/system" \
  "$BASE_DIR/meta/manifests" \
  "$BASE_DIR/meta/rollback" \
  "$BASE_DIR/meta/logs"

chmod 755 "$BASE_DIR" "$BASE_DIR/mysql" "$BASE_DIR/logs" "$BASE_DIR/meta"
chown -R root:root "$BASE_DIR/meta"

UUID=$(blkid -s UUID -o value "$DEVICE_PART")
cat > /tmp/node1.fstab.sample <<EOF
UUID=$UUID  $MOUNT_POINT  $FS_TYPE  defaults,noatime,nodiratime  0 2
EOF

log "初始化完成"
log "fstab 示例已生成：/tmp/node1.fstab.sample"
log "请将示例内容并入 /etc/fstab 后执行 mount -a 验证"
