import xlrd

wb = xlrd.open_workbook(r'三方2026年2月科研经营月报.xls')
sh = wb.sheet_by_index(0)
print(f'Sheet: {sh.name}, rows={sh.nrows}, cols={sh.ncols}')

with open('xls_dump.txt', 'w', encoding='utf-8') as f:
    for r in range(sh.nrows):
        row = [sh.cell_value(r, c) for c in range(sh.ncols)]
        if any(str(v).strip() for v in row):
            line = f'R{r}: ' + ' | '.join(str(v) for v in row)
            print(line)
            f.write(line + '\n')
print('Done')
