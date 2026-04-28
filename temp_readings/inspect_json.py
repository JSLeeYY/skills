# -*- coding: utf-8 -*-
import json
import io

path = u"D:\\Desktop\\三方平台项目\\三期需求\\extraction.json"
target = u"(巡检)监造任务交底单.docx"

with io.open(path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

if target in data:
    print("Found target.")
    content = data[target]
    if isinstance(content, dict):
        print("Keys: " + str(content.keys()))
        if "Text" in content:
            print("Preview Text: " + content["Text"][:200])
else:
    print("Target not found.")
