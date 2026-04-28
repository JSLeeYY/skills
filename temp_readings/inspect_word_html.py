# -*- coding: utf-8 -*-
import json
import io

path = u"D:\\Desktop\\三方平台项目\\三期需求\\extraction_word_html.json"
target = u"PECMS平台监理周报格式修改模板.docx"

with io.open(path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

if target in data:
    print("Found HTML.")
    # Print first 500 chars to check structure
    print(data[target][:500])
else:
    print("Target not found.")
