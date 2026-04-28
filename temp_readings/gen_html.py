# -*- coding: utf-8 -*-
import json
import io
import sys

# Constants
JSON_PATH = u"D:\\Desktop\\三方平台项目\\三期需求\\extraction.json"
HTML_PATH = u"D:\\Desktop\\三方平台项目\\三期需求\\report.html"

MAPPING = {
    u"执行管理与经营分析需求表.xlsx": u"执行管理与经营分析系统",
    u"预评价需求.xlsx": u"PECMS系统 - 预评价模块",
    u"后评价需求.xlsx": u"PECMS系统 - 后评价模块",
    u"数字信息平台优化提升需求评估 - 可读.xlsx": u"数字信息平台优化提升"
}

HTML_TEMPLATE = u"""
<html>
<head>
<meta charset="utf-8">
<style>
    body {{ font-family: "Microsoft YaHei", sans-serif; margin: 40px; font-size: 10.5pt; color: #333; }}
    h1 {{ color: #003366; text-align: center; font-size: 26pt; margin-bottom: 40px; }}
    h2 {{ color: #004d99; font-size: 16pt; border-bottom: 2px solid #004d99; margin-top: 40px; padding-bottom: 10px; page-break-after: avoid; }}
    h3 {{ color: #333; font-size: 14pt; margin-top: 25px; page-break-after: avoid; background-color: #f0f4f8; padding: 5px 10px; border-left: 5px solid #004d99; }}
    h4 {{ color: #666; font-size: 12pt; margin-top: 20px; text-decoration: underline; }}
    
    table {{ 
        border-collapse: collapse; 
        width: 100%; 
        margin-bottom: 20px; 
    }}
    
    th, td {{ 
        border: 1px solid #777; 
        padding: 4px; 
        font-size: 9pt; 
        vertical-align: middle; 
    }}
    
    th {{ 
        background-color: #f2f2f2; 
        font-weight: bold; 
        text-align: center; 
        white-space: nowrap; 
    }}
    
    tr:nth-child(even) {{ background-color: #fcfcfc; }}
    
    .comment {{ color: #cc0000; margin-bottom: 5px; list-style-type: none; }}
    .comment-block {{ background-color: #fff9f9; padding: 15px; border: 1px solid #ffcccc; margin: 15px 0; border-radius: 5px; }}
    .comment-author {{ font-weight: bold; color: #990000; margin-right: 5px; }}
    
    .doc-text {{ line-height: 1.2; margin: 10px 0; }}
    .doc-text p {{ margin-bottom: 2px; text-indent: 0; }} 
</style>
</head>
<body>
<h1>数字一体化平台需求完整分析</h1>
{content}
</body>
</html>
"""

def clean_str(s):
    if not isinstance(s, unicode):
        return unicode(s, 'utf-8', 'ignore') if hasattr(s, 'decode') else unicode(s)
    return s

def make_table(rows):
    if not rows: return u""
    html = [u"<table>"]
    for i, r in enumerate(rows):
        r = clean_str(r)
        cells = r.split(u"|")
        html.append(u"<tr>")
        tag = u"th" if i == 0 else u"td"
        for c in cells:
            html.append(u"<{0}>{1}</{0}>".format(tag, c))
        html.append(u"</tr>")
    html.append(u"</table>")
    return u"".join(html)


def main():
    with io.open(JSON_PATH, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    body = []
    
    # 1. 核心业务系统需求
    # Define the order and hierarchy
    SYSTEM_ORDER = [
        (u"执行管理与经营分析系统", [u"执行管理与经营分析需求表.xlsx"]),
        (u"PECMS系统 - 评价管理模块", [u"预评价需求.xlsx", u"后评价需求.xlsx"]),
        (u"数字信息平台优化提升", [u"数字信息平台优化提升需求评估 - 可读.xlsx"])
    ]
    
    processed_files = set()

    for section_title, filenames in SYSTEM_ORDER:
        section_content = []
        for fname in filenames:
            if fname in data:
                processed_files.add(fname)
                content = data[fname]
                if isinstance(content, dict):
                    for sheet, rows in content.items():
                        # Skip empty sheets or generic "Sheet1" if it's the only one, 
                        # but usually it keeps context to keep it. 
                        # We will rename "Sheet1" to "需求清单" if it looks generic.
                        display_sheet = clean_str(sheet)
                        if display_sheet.lower() in [u"sheet1", u"sheet2", u"sheet3"]:
                             display_sheet = u"需求明细表"
                        
                        if isinstance(rows, list) and len(rows) > 0:
                            section_content.append(u"<h4>{} - {}</h4>".format(clean_str(fname).replace(u".xlsx", u""), display_sheet))
                            section_content.append(make_table(rows))
        
        if section_content:
            body.append(u"<h2>{}</h2>".format(section_title))
            body.extend(section_content)

    # 2. 现有报告文档分析（Word提取内容）
    doc_content = []
    for filename, content in data.items():
        if filename == "Status" or filename in processed_files:
            continue
            
        # Files that were not Excel requirements
        fname_u = clean_str(filename)
        
        if isinstance(content, dict):
            file_block = []
            has_data = False
            
            # Text
            if "Text" in content:
                text = clean_str(content["Text"])
                if text.strip():
                    has_data = True
                    paragraphs = text.split('\r')
                    # Improve text readability
                    file_block.append(u"<div class='doc-text'>")
                    for p in paragraphs:
                        if p.strip():
                            file_block.append(u"<p>{}</p>".format(p.strip()))
                    file_block.append(u"</div>")
            
            # Comments
            if "Comments" in content:
                cmts = content["Comments"]
                if cmts:
                    has_data = True
                    file_block.append(u"<div class='comment-block'><strong>【批注/修改意见】</strong><ul>")
                    for c in cmts:
                        author = clean_str(c.get("A", "Unknown"))
                        txt = clean_str(c.get("T", ""))
                        file_block.append(u"<li class='comment'><span class='comment-author'>{}:</span> {}</li>".format(author, txt))
                    file_block.append(u"</ul></div>")
            
            # Fallback for unmapped Excel tables
            if "Text" not in content and "Comments" not in content:
                for k, v in content.items():
                    if isinstance(v, list) and len(v) > 0:
                        has_data = True
                        file_block.append(u"<h5>{}</h5>".format(clean_str(k)))
                        file_block.append(make_table(v))
            
            if has_data:
                doc_content.append(u"<h3>文档：{}</h3>".format(fname_u))
                doc_content.extend(file_block)
                doc_content.append(u"<hr/>")

    if doc_content:
        body.append(u"<h2>现有报告文档分析与批注</h2>")
        body.extend(doc_content)

    final_html = HTML_TEMPLATE.format(content=u"\n".join(body))
    
    with io.open(HTML_PATH, 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print("HTML Generated")

if __name__ == "__main__":
    main()
