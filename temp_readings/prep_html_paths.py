# -*- coding: utf-8 -*-
import base64

dir_path = u"D:\\Desktop\\三方平台项目\\三期需求\\需求分析报告"
out_path = u"D:\\Desktop\\三方平台项目\\三期需求\\extraction_word_html.json"

with open("d:\\DevelopmentLocation\\agent skill\\skills\\temp_readings\\paths_html_extract.txt", "w") as f:
    f.write(base64.b64encode(dir_path.encode('utf-16le')).decode('ascii') + "\n")
    f.write(base64.b64encode(out_path.encode('utf-16le')).decode('ascii'))
