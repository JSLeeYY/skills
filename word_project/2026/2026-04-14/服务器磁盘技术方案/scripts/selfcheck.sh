#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FILES=(
  "$SCRIPT_DIR/lib/common.sh"
  "$SCRIPT_DIR/lib/validate.sh"
  "$SCRIPT_DIR/node1_02_migrate_mysql.sh"
  "$SCRIPT_DIR/node2_02_migrate_mysql.sh"
  "$SCRIPT_DIR/node3_02_migrate_mysql.sh"
  "$SCRIPT_DIR/node1_04_apply_logs_migration.sh"
  "$SCRIPT_DIR/node2_04_apply_logs_migration.sh"
  "$SCRIPT_DIR/node3_04_apply_logs_migration.sh"
  "$SCRIPT_DIR/node1_99_rollback_all.sh"
  "$SCRIPT_DIR/node2_99_rollback_all.sh"
  "$SCRIPT_DIR/node3_99_rollback_all.sh"
)

for f in "${FILES[@]}"; do
  bash -n "$f"
  echo "OK syntax: $f"
done

echo "All syntax checks passed."
