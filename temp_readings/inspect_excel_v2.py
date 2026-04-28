# -*- coding: utf-8 -*-
import pandas as pd
import os
import sys

# Force utf-8 output for Windows consoles
sys.stdout.reconfigure(encoding='utf-8')

base_path = r"D:\Desktop\三方平台项目\三期需求"
files = [
    u"执行管理与经营分析需求表.xlsx",
    u"数字信息平台优化提升需求评估 - 三期确认稿.xlsx",
    u"预评价需求.xlsx",
    u"后评价需求.xlsx"
]

print("--- Excel Structure Analysis ---")
for f in files:
    full_path = os.path.join(base_path, f)
    if os.path.exists(full_path):
        print("\nFile: " + f)
        try:
            xl = pd.ExcelFile(full_path)
            for sheet in xl.sheet_names:
                df = xl.parse(sheet, nrows=2)
                print("  Sheet: " + sheet)
                cols = [str(c) for c in df.columns.tolist()]
                print("    Columns: " + ", ".join(cols))
        except Exception as e:
            print("    Error: " + str(e))
    else:
        print("File not found: " + full_path)
