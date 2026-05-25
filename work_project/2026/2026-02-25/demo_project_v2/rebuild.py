# -*- coding: utf-8 -*-
"""
V2 全面重建脚本
直接复制V1的style.css（1191行完整版），然后基于V11需求文档重写所有Vue组件
"""
import os, shutil

base_v1 = r'D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project'
base_v2 = r'D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project_v2'

# Step 1: 直接复制 V1 的完整 style.css 到 V2
shutil.copy2(os.path.join(base_v1, 'style.css'), os.path.join(base_v2, 'style.css'))
print("✅ V1 style.css (1191 lines) copied to V2!")

# Step 2: 追加 V2 专用额外样式（Vue 弹窗需要的）
v2_extra_css = """
/* ===== V2 Extra Styles ===== */
.main-content.expanded { margin-left: var(--sidebar-collapsed); }

/* Vue modal-overlay 直接显示 (V1用display:none+active切换, V2用v-if) */
.modal-overlay { display: flex !important; }

/* 角色切换下拉 */
.role-switcher { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 11px; padding: 2px 4px; border-radius: 4px; cursor: pointer; max-width: 28px; }

/* 日历 */
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-header { font-size: 11px; font-weight: 600; color: var(--text-muted); text-align: center; padding: 6px; }
.cal-day { min-height: 38px; border-radius: var(--radius-sm); padding: 4px; position: relative; cursor: pointer; transition: var(--transition); }
.cal-day:hover { background: var(--blue-light); }
.cal-day-num { font-size: 12px; font-weight: 500; }
.cal-day.empty { background: transparent; cursor: default; }
.cal-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin: 1px; }

/* Dashboard metric big cards */
.dash-metrics { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 16px; margin-bottom: 20px; }
.dash-metric { background: linear-gradient(135deg, #1a2236, #243149); color: #fff; border-radius: var(--radius-lg); padding: 20px 22px; box-shadow: var(--shadow-md); position: relative; overflow: hidden; }
.dash-metric::before { content: ''; position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.05); }
.dash-metric-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
.dash-metric-value { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
.dash-metric-sub { font-size: 11px; color: rgba(255,255,255,0.5); }
.dash-metric.blue { background: linear-gradient(135deg, #1a6fc4, #2e88e0); }
.dash-metric.green { background: linear-gradient(135deg, #2d7a2d, #4caf50); }
.dash-metric.orange { background: linear-gradient(135deg, #c87715, #e6a23c); }
.dash-metric.purple { background: linear-gradient(135deg, #5a3fc0, #7c5cfc); }

.dash-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.chart-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 20px; margin-bottom: 20px; }
.chart-card-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; }
.chart-container { width: 100%; height: 280px; }

.warning-list { display: flex; flex-direction: column; gap: 10px; }
.warning-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--radius); border-left: 4px solid; cursor: pointer; transition: var(--transition); }
.warning-item:hover { transform: translateX(4px); }
.warning-item.danger { border-color: var(--red); background: var(--red-light); }
.warning-item.warning { border-color: var(--orange); background: var(--orange-light); }
.warning-item.info { border-color: var(--blue); background: var(--blue-light); }
.warning-icon { font-size: 20px; flex-shrink: 0; }
.warning-content { flex: 1; }
.warning-title { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
.warning-desc { font-size: 12px; color: var(--text-muted); }

/* Form Grid for modals */
.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1 / -1; }
.form-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.form-label.required::after { content: ' *'; color: var(--red); }
.form-control { padding: 8px 11px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 13px; font-family: inherit; outline: none; transition: var(--transition); width: 100%; }
.form-control:focus { border-color: var(--blue); box-shadow: 0 0 0 2px rgba(64,158,255,0.12); }
textarea.form-control { resize: vertical; min-height: 80px; }

/* Profit colors */
.profit-green { color: var(--green); font-weight: 700; }
.profit-orange { color: var(--orange); font-weight: 700; }
.profit-red { color: var(--red); font-weight: 700; background: var(--red-light); padding: 2px 6px; border-radius: 4px; }

/* Detail info grid */
.detail-info { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 14px; }
.detail-item { display: flex; flex-direction: column; gap: 3px; }
.detail-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }
.detail-value { font-size: 13px; font-weight: 500; }

/* Highlight income */
.highlight-income { background: rgba(64,158,255,0.06); border-radius: var(--radius); padding: 14px 16px; margin-bottom: 14px; }

.tooltip-trigger { position: relative; }
.tooltip-trigger .tooltip { display: none; position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background: rgba(30,42,54,0.95); color: #fff; font-size: 12px; padding: 8px 12px; border-radius: var(--radius-sm); white-space: nowrap; z-index: 999; }
.tooltip-trigger:hover .tooltip { display: block; }

/* Summary cards */
.summary-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 16px; margin-bottom: 20px; }
.summary-card { background: var(--bg-card); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 16px; transition: var(--transition); cursor: default; }
.summary-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.summary-icon { width: 48px; height: 48px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 22px; }
.summary-icon.blue { background: var(--blue-light); }
.summary-icon.green { background: var(--green-light); }
.summary-icon.orange { background: var(--orange-light); }
.summary-icon.purple { background: var(--purple-light); }
.summary-icon.red { background: var(--red-light); }
.summary-info { flex: 1; }
.summary-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.summary-value { font-size: 22px; font-weight: 700; }

/* Toast */
.toast-container { position: fixed; top: 20px; right: 20px; z-index: 2000; display: flex; flex-direction: column; gap: 8px; }
.toast { background: #1e2a3a; color: #fff; padding: 12px 24px; border-radius: var(--radius); font-size: 13px; box-shadow: var(--shadow-lg); animation: toastIn 0.3s ease; }
@keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

@media (max-width:900px) { .dash-grid-2 { grid-template-columns: 1fr; } }
"""

with open(os.path.join(base_v2, 'style.css'), 'a', encoding='utf-8') as f:
    f.write(v2_extra_css)
print("✅ V2 extra CSS appended!")
print("✅ Step 1 complete: Style fully aligned with V1 + V2 extensions!")
