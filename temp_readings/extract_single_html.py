# -*- coding: utf-8 -*-
import json
import io
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

path = u"D:\\Desktop\\三方平台项目\\三期需求\\extraction_word_html.json"
out_html = u"D:\\Desktop\\weekly_report_extracted.html"

with io.open(path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Find the key (fuzzy match if needed, but should be exact if encoding matches)
target_key = None
for k in data.keys():
    if u"周报" in k:
        target_key = k
        break

if target_key:
    print("Found: " + target_key)
    html_content = data[target_key]
    
    # Wrap in a nice page
    full_page = u"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: "Microsoft YaHei", sans-serif; background: #eee; padding: 20px; }}
            .report-container {{ 
                width: 210mm; 
                min-height: 297mm; 
                background: white; 
                margin: 0 auto; 
                padding: 20mm; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1); 
            }}
            table {{ border-collapse: collapse; width: 100%; margin-bottom: 20px; }}
            td, th {{ border: 1px solid black; padding: 5px; font-size: 12px; }}
            img {{ max-width: 100%; height: auto; }}
            p {{ margin: 5px 0; }}
        </style>
    </head>
    <body>
        <div class="report-container">
            {content}
        </div>
    </body>
    </html>
    """.format(content=html_content.replace(u"{", u"{{").replace(u"}", u"}}")) 
    # HTML might have braces within styles or scripts, simplistic escaping might break if heavy Script/Style usage
    # But Word exported HTML usually puts styles in head, we extracted body. Body usually safe(ish).
    # Better: just use format with named arg and careful escaping or string concatenation
    
    full_page = u"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: "Microsoft YaHei", sans-serif; background: #eee; padding: 20px; }
            .report-container { 
                width: 210mm; 
                min-height: 297mm; 
                background: white; 
                margin: 0 auto; 
                padding: 20mm; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1); 
            }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            td, th { border: 1px solid black; padding: 5px; font-size: 12px; }
            img { max-width: 100%; height: auto; }
            p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="report-container">
    """ + html_content + u"""
        </div>
    </body>
    </html>
    """

    
    with io.open(out_html, 'w', encoding='utf-8') as f_out:
        f_out.write(full_page)
    print("Saved to " + out_html)
else:
    print("Not found")
