
# -*- coding: utf-8 -*-
import pandas as pd
import os

base_path = r"D:\Desktop\三方平台项目\三期需求"
files = [
    r"执行管理与经营分析需求表.xlsx",
    r"数字信息平台优化提升需求评估 - 三期确认稿.xlsx",
    r"预评价需求.xlsx",
    r"后评价需求.xlsx"
]

print("--- Excel Structure Analysis ---")
for f in files:
    full_path = os.path.join(base_path, f)
    if os.path.exists(full_path):
        print(f"\nFile: {f}")
        try:
            xl = pd.ExcelFile(full_path)
            for sheet in xl.sheet_names:
                df = xl.parse(sheet, nrows=2) # Read first few rows to deduce headers
                print(f"  Sheet: {sheet}")
                print(f"    Columns: {list(df.columns)}")
        except Exception as e:
            print(f"    Error: {e}")
