# -*- coding: utf-8 -*-
import base64
p1 = u"D:\\Desktop\\三方平台项目\\三期需求\\report.html"
p2 = u"D:\\Desktop\\三方平台项目\\三期需求\\数字一体化平台需求完整分析_v4.docx"


with open("d:\\DevelopmentLocation\\agent skill\\skills\\temp_readings\\paths.txt", "w") as f:
    f.write(base64.b64encode(p1.encode('utf-16le')).decode('ascii') + "\n")
    f.write(base64.b64encode(p2.encode('utf-16le')).decode('ascii'))

