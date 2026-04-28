
# 提取V1各菜单的核心内容：列名、按钮、弹窗标题
import re

with open('demo_project/pages.js', 'r', encoding='utf-8') as f:
    text = f.read()

with open('demo_project/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('demo_project/app.js', 'r', encoding='utf-8') as f:
    appjs = f.read()

# 合并所有JS/HTML
all_code = text + html + appjs

# 按菜单提取表头th
print("=" * 60)
print("V1 各菜单 表头列 <th> 提取")
print("=" * 60)

# 找 page-xxx 区域
page_ids = ['contract', 'income', 'execution', 'personnel', 'workhour',
            'invoice', 'payment', 'reminder', 'cost', 'travel', 'salary',
            'profit', 'report', 'permission']

# 合并全部代码
combined = all_code

for pid in page_ids:
    # 简单找最近的th行
    # 搜索在该页面定义中出现的th内容
    pattern = rf'page-{pid}.*?(?=page-(?!{pid})|$)'
    m = re.search(pattern, combined, re.DOTALL)
    if m:
        chunk = m.group(0)[:8000]
        ths = re.findall(r'<th[^>]*>(.*?)</th>', chunk)
        ths = [re.sub(r'<.*?>', '', t).strip() for t in ths]
        ths = [t for t in ths if t and len(t) < 30]
        # 找按钮
        btns = re.findall(r'(?:btn-label|btn[^"]*">|onclick="[^"]+">)([^<]{2,20})<', chunk)
        # 找弹窗标题
        modal_titles = re.findall(r'openModal\([\'"]([^\'"]+)[\'"]', chunk)
        modal_titles += re.findall(r'openWideModal\([\'"]([^\'"]+)[\'"]', chunk)
        
        print(f"\n【{pid}】")
        print(f"  列头(th): {ths}")
        print(f"  弹窗标题: {list(set(modal_titles))[:8]}")
    else:
        print(f"\n【{pid}】 未找到")

print("\n\nDone.")
