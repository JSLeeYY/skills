
import xlrd

wb = xlrd.open_workbook('三方2026年2月科研经营月报.xls')
ws = wb.sheet_by_name('202602')
print(f"共{ws.nrows}行 x {ws.ncols}列")

# 打印前10行
for ri in range(min(10, ws.nrows)):
    row = ws.row_values(ri)
    print(f"\n行{ri+1}:")
    for ci, val in enumerate(row):
        if val != '' and val is not None:
            print(f"  列{ci+1}({chr(65+ci)}): {val}")

print("\n========== 最后5行 ==========")
for ri in range(max(ws.nrows-5, 0), ws.nrows):
    row = ws.row_values(ri)
    print(f"\n行{ri+1}:")
    for ci, val in enumerate(row):
        if val != '' and val is not None:
            print(f"  列{ci+1}({chr(65+ci)}): {val}")
