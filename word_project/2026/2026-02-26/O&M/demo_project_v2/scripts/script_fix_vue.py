import os
import re

base_dir = r"D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project_v2"

# 1. Update app.js to define missing global functions
app_js_path = os.path.join(base_dir, "app.js")
with open(app_js_path, "r", encoding="utf-8") as f:
    app_js = f.read()

global_funcs = """
// ===== 全局工具函数 =====
const fmt = (num) => num ? Number(num).toLocaleString('zh-CN', {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00';
const fmtM = fmt;
const fmtW = (num) => num ? (Number(num)/10000).toLocaleString('zh-CN', {minimumFractionDigits:2, maximumFractionDigits:2}) + '万' : '0.00万';
const fmtPct = (num) => num ? Number(num).toLocaleString('zh-CN', {minimumFractionDigits:1, maximumFractionDigits:1}) + '%' : '0.0%';
const toastList = Vue.reactive([]);
let toastId = 0;
const showToast = (msg) => {
    const id = toastId++;
    toastList.push({ id, msg });
    setTimeout(() => {
        const index = toastList.findIndex(t => t.id === id);
        if(index > -1) toastList.splice(index, 1);
    }, 3000);
};
const doExport = (name) => showToast('📥 正在生成并导出 ' + name + ' 数据报表...');
"""
if "const fmt = " not in app_js:
    app_js = global_funcs + "\n" + app_js
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(app_js)

# 2. Fix Vue functions in components.js
components_path = os.path.join(base_dir, "components.js")
with open(components_path, "r", encoding="utf-8") as f:
    comps = f.read()

# Replace all Vue Composition API hooks to have Vue. prefix
comps = re.sub(r'(?<!Vue\.)\b(ref|computed|reactive|onMounted|watch)\b\(', r'Vue.\1(', comps)
# Ensure setup functions have correct returns format
with open(components_path, "w", encoding="utf-8") as f:
    f.write(comps)
