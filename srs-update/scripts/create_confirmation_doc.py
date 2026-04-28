#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成SRS确认签批文档
根据SRS章节和实际实现描述，生成结构化的确认文档
"""

import sys
import os
from datetime import datetime

def create_confirmation_doc(module_name, srs_section, output_dir):
    """
    创建确认签批文档

    Args:
        module_name: 模块名称（如"监理人员动态"）
        srs_section: SRS章节号（如"§5"）
        output_dir: 输出目录路径
    """
    # 生成文件名：YYYYMMDD_模块名_完整功能确认.md
    date_str = datetime.now().strftime("%Y%m%d")
    filename = f"{date_str}_{module_name}_完整功能确认.md"
    filepath = os.path.join(output_dir, filename)

    # 生成文档编号
    doc_id = f"SIGN-{module_name.upper()}-{date_str}"

    # 文档模板
    content = f"""# {module_name}模块 — 完整功能确认签批文档

**文档编号**：{doc_id}
**模块名称**：{module_name}
**涉及页面**：（待填写）
**涉及文件**：（待填写）
**SRS对应章节**：{srs_section}
**文档日期**：{datetime.now().strftime("%Y-%m-%d")}
**状态**：待确认

---

## 说明

本文档逐条列出{srs_section}{module_name}模块中，SRS原文描述与实际页面实现之间的对比，请逐条确认后签字。
确认原则：以【实际实现描述】为准，确认后将以此描述更新SRS对应内容。

---

## 功能点确认

### 功能点1 — （功能名称）

**【功能编号】**：FUNC-XXX-001

**【SRS原文描述】**：

> （从SRS中复制的原文描述）

**【实际实现描述】**：

（详细描述实际页面的实现情况）

**【差异说明】**：

（说明SRS与实际实现的差异）

**【您的确认】**：□ 同意  □ 不同意

**【备注】**：

---

## 汇总总览

### 功能点实现状态汇总表

| 功能点 | 功能描述 | SRS覆盖状态 | 实现状态 |
|-------|---------|-----------|---------|
| FUNC-XXX-001 | （功能描述） | ✅ SRS已描述 | ✅ 已实现 |

**SRS需要更新的主要内容**：

1. （列出需要更新的要点）

---

**签批人**：_______________

**签批日期**：_______________
"""

    # 写入文件
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"[OK] 确认文档已创建: {filepath}")
    return filepath

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("用法: python create_confirmation_doc.py <模块名> <SRS章节> <输出目录>")
        print("示例: python create_confirmation_doc.py 监理人员动态 §5 ./需求确认签批")
        sys.exit(1)

    module_name = sys.argv[1]
    srs_section = sys.argv[2]
    output_dir = sys.argv[3]

    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)

    create_confirmation_doc(module_name, srs_section, output_dir)
