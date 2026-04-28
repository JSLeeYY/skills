import importlib

modules = [
    ('defusedxml',    'XML安全解析 (docx/pptx)'),
    ('pandas',        'Excel数据分析'),
    ('openpyxl',      'Excel读写引擎'),
    ('docx',          'Word文档处理 (python-docx)'),
    ('pptx',          'PPT文档处理 (python-pptx)'),
    ('markitdown',    'Office文档转Markdown'),
    ('pypdf',         'PDF基本操作'),
    ('pdfplumber',    'PDF表格/文本提取'),
    ('reportlab',     'PDF生成'),
    ('PIL',           '图像处理 (Pillow)'),
    ('matplotlib',    '数据可视化'),
    ('imageio',       'GIF帧处理'),
    ('numpy',         '数值计算'),
    ('pdf2image',     'PDF转图片'),
    ('pytesseract',   'OCR文字识别'),
    ('playwright',    'Web自动化测试'),
    ('requests',      'HTTP请求'),
]

print("========================================")
print("  Python Libraries Verification")
print("========================================")
ok = 0
fail = 0
for mod, desc in modules:
    try:
        importlib.import_module(mod)
        print(f"[OK]   {mod:<15} => {desc}")
        ok += 1
    except ImportError as e:
        print(f"[FAIL] {mod:<15} => {desc} ({e})")
        fail += 1

print(f"\nResult: {ok}/{ok+fail} modules OK")
