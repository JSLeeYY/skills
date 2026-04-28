#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新SRS文档
根据确认签批文档中的实际实现描述，更新SRS对应章节内容
"""

import sys
import os
import re
from datetime import datetime

def parse_confirmation_doc(doc_path):
    """
    解析确认签批文档，提取已确认的功能点

    Returns:
        list: 已确认的功能点列表，每项包含 {func_id, srs_original, actual_impl, diff}
    """
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()

    confirmed_items = []

    # 匹配功能点块
    pattern = r'### 功能点\d+ — (.+?)\n\n\*\*【功能编号】\*\*：(.+?)\n\n\*\*【SRS原文描述】\*\*：\n\n> (.+?)\n\n\*\*【实际实现描述】\*\*：\n\n(.+?)\n\n\*\*【差异说明】\*\*：\n\n(.+?)\n\n\*\*【您的确认】\*\*：(.+?)\n'

    matches = re.finditer(pattern, content, re.DOTALL)

    for match in matches:
        func_name = match.group(1).strip()
        func_id = match.group(2).strip()
        srs_original = match.group(3).strip()
        actual_impl = match.group(4).strip()
        diff = match.group(5).strip()
        confirmation = match.group(6).strip()

        # 只处理已确认的项
        if '同意' in confirmation or '✓' in confirmation or '☑' in confirmation:
            confirmed_items.append({
                'func_name': func_name,
                'func_id': func_id,
                'srs_original': srs_original,
                'actual_impl': actual_impl,
                'diff': diff
            })

    return confirmed_items

def update_srs_content(srs_path, confirmed_items, backup=True):
    """
    更新SRS文档内容

    Args:
        srs_path: SRS文档路径
        confirmed_items: 已确认的功能点列表
        backup: 是否备份原文件
    """
    with open(srs_path, 'r', encoding='utf-8') as f:
        srs_content = f.read()

    # 备份原文件
    if backup:
        backup_path = f"{srs_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(srs_content)
        print(f"[OK] 已备份原SRS文档: {backup_path}")

    # 更新内容
    updated_content = srs_content
    update_count = 0

    for item in confirmed_items:
        # 查找并替换SRS原文描述为实际实现描述
        if item['srs_original'] in updated_content:
            updated_content = updated_content.replace(
                item['srs_original'],
                item['actual_impl']
            )
            update_count += 1
            print(f"[OK] 已更新功能点: {item['func_id']} - {item['func_name']}")
        else:
            print(f"[WARNING] 未找到匹配内容: {item['func_id']} - {item['func_name']}")

    # 写入更新后的内容
    with open(srs_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"\n[OK] SRS文档更新完成，共更新 {update_count} 个功能点")
    return update_count

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法: python update_srs.py <确认文档路径> <SRS文档路径> [--no-backup]")
        print("示例: python update_srs.py ./需求确认签批/20260318_动态成本核算_完整功能确认.md ./Operations_and_Management_SRS_Final_V11.md")
        sys.exit(1)

    confirmation_doc = sys.argv[1]
    srs_doc = sys.argv[2]
    backup = '--no-backup' not in sys.argv

    # 检查文件是否存在
    if not os.path.exists(confirmation_doc):
        print(f"错误: 确认文档不存在: {confirmation_doc}")
        sys.exit(1)

    if not os.path.exists(srs_doc):
        print(f"错误: SRS文档不存在: {srs_doc}")
        sys.exit(1)

    # 解析确认文档
    print("正在解析确认文档...")
    confirmed_items = parse_confirmation_doc(confirmation_doc)
    print(f"[OK] 找到 {len(confirmed_items)} 个已确认的功能点")

    # 更新SRS文档
    print("\n正在更新SRS文档...")
    update_srs_content(srs_doc, confirmed_items, backup)
