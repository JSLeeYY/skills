#!/usr/bin/env bash
set -euo pipefail

DEVICE="/dev/sdb"
P1="/dev/sdb1"
P2="/dev/sdb2"
P3="/dev/sdb3"
M1="/filedata/node1"
M2="/filedata/node2"
M3="/filedata/node3"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
fail() { log "ERROR: $*"; exit 1; }
require_root() { [ "$(id -u)" -eq 0 ] || fail "请使用 root 执行"; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "缺少命令: $1"; }

require_root
require_cmd parted
require_cmd mkfs.ext4
require_cmd blkid
require_cmd mount
require_cmd umount

log "高风险操作：该脚本会重建 $DEVICE 分区表"
log "执行前请确认旧 /filedata 上无生产有效数据，且 Node1/Node2 未挂载该共享盘"

if mountpoint -q /filedata; then
  umount /filedata || fail "无法卸载 /filedata"
  log "已卸载旧 /filedata"
fi

mkdir -p "$M1" "$M2" "$M3"

parted -s "$DEVICE" mklabel gpt
parted -s "$DEVICE" mkpart primary ext4 1MiB 500GiB
parted -s "$DEVICE" mkpart primary ext4 500GiB 1300GiB
parted -s "$DEVICE" mkpart primary ext4 1300GiB 100%

mkfs.ext4 -F -L FILEDATA_NODE1 "$P1"
mkfs.ext4 -F -L FILEDATA_NODE2 "$P2"
mkfs.ext4 -F -L FILEDATA_NODE3 "$P3"

mount "$P3" "$M3"
log "已挂载 $P3 -> $M3"

mkdir -p \
  "$M3/mysql/mysql57_3603" \
  "$M3/logs/services" \
  "$M3/logs/system" \
  "$M3/meta/manifests" \
  "$M3/meta/rollback" \
  "$M3/meta/logs"

UUID1=$(blkid -s UUID -o value "$P1")
UUID2=$(blkid -s UUID -o value "$P2")
UUID3=$(blkid -s UUID -o value "$P3")

cat > /tmp/node1.fstab.sample <<EOF
UUID=$UUID1  /filedata/node1  ext4  defaults,noatime,nodiratime  0 2
EOF
cat > /tmp/node2.fstab.sample <<EOF
UUID=$UUID2  /filedata/node2  ext4  defaults,noatime,nodiratime  0 2
EOF
cat > /tmp/node3.fstab.sample <<EOF
UUID=$UUID3  /filedata/node3  ext4  defaults,noatime,nodiratime  0 2
EOF

log "分区与 node3 初始化完成"
log "node1/node2/node3 的 fstab 示例位于 /tmp/*.fstab.sample"
