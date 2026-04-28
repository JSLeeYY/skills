# -*- coding: utf-8 -*-
from pypdf import PdfReader

reader = PdfReader(r'D:\Desktop' + '\\' + '\u6570\u636e\u5e93\u7ed3\u6784\u5bf9\u6bd4\u62a5\u544a.pdf')
print('Total pages: {}'.format(len(reader.pages)))
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    print('=== Page {} ==='.format(i+1))
    if text:
        print(text)
    print()
