// ===== app.js Part 1: 核心交互 =====

// ===== 页面切换 =====
const PAGE_LABELS = {
    'permission': '全局配置 / 权限分配', 'contract': '核心业务 / 合同台账', 'income': '核心业务 / 项目收入',
    'execution': '核心业务 / 执行管理', 'personnel': '核心业务 / 监理人员动态', 'workhour': '核心业务 / 工时记录',
    'invoice': '财务管理 / 开票明细', 'payment': '财务管理 / 回款明细', 'reminder': '财务管理 / 提醒设置',
    'cost': '成本与利润 / 动态成本核算', 'travel': '成本与利润 / 差旅报销台账', 'salary': '成本与利润 / 人员工资管理',
    'profit': '成本与利润 / 利润管理', 'report': '成本与利润 / 经营数据量化'
};
function switchPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const t = document.getElementById('page-' + id); if (t) t.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const n = document.querySelector(`.nav-item[data-page="${id}"]`); if (n) n.classList.add('active');
    const bc = document.getElementById('breadcrumb');
    if (bc && PAGE_LABELS[id]) { const p = PAGE_LABELS[id].split(' / '); bc.innerHTML = `<span>${p[0]}</span> / <span>${p[1]}</span>`; }
    closeNotification();
    if (id === 'report') setTimeout(() => initReportCharts(), 300);
    if (id === 'profit') { const c = document.getElementById('profitChartContainer'); if (c) c.style.display = 'none'; }
}

// ===== Toast =====
function showToast(msg) {
    const c = document.getElementById('toastContainer'), t = document.createElement('div');
    t.className = 'toast'; t.textContent = '✅ ' + msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
}

// ===== Modal =====
function openModal(title, body, footer) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalFooter').innerHTML = footer || `<button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="showToast('操作成功');closeModal()">确定</button>`;
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalBox').style.maxWidth = '';
}
function openWideModal(title, body, footer) {
    openModal(title, body, footer); document.getElementById('modalBox').style.maxWidth = '1100px';
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

function showConfirmDialog(msg, title) {
    openModal(title || '确认操作', `<div style="text-align:center;padding:20px 0"><div style="font-size:48px;margin-bottom:16px">⚠️</div><p style="font-size:15px">${msg}</p></div>`);
}

// ===== Notification =====
function showNotification() { document.getElementById('notificationPanel').classList.add('active'); }
function closeNotification() { document.getElementById('notificationPanel').classList.remove('active'); }

// ===== 高级筛选 =====
function toggleAdvFilter(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const show = el.style.display === 'none';
    el.style.display = show ? 'flex' : 'none';
    if (btn) btn.textContent = show ? '⚡ 收起高级' : '⚡ 高级查询';
}

// ===== 权限分配 =====
function selectPM(el, name) {
    el.parentElement.querySelectorAll('.perm-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('pmName').textContent = name;
}
function buildAssignContractForm() {
    return `<div class="modal-form-group"><label>选择合同号</label><select style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px"><option>CI-2026-004 - 核电设备监造</option><option>CI-2026-006 - 锅炉改造监理</option><option>CI-2026-007 - 储罐检验监理</option></select></div><div style="font-size:12px;color:var(--text-muted);margin-top:8px">💡 选择后该合同将分配给当前项目经理</div>`;
}

// ===== 工资脱敏 =====
const salaryData = { 'zhangsan': '¥800/天', 'lisi': '¥650/天', 'chenwei': '¥900/天', 'wangwu': '¥750/天' };
let salaryIdx = 0;
function toggleSalary(el) {
    // 已禁用：任何角色均无法查看明文工资
    showToast('⚠️ 工资数据不允许查看明文', 'error');
}
// 差旅报销台账 - 内联编辑后提示
function recalcTravelCost(el) {
    showToast('数值已更新为 ' + el.value + '，点击保存按钮提交');
}

// ===== 合同台账 - 详情 =====
function showContractDetail(ci) {
    openWideModal('合同详情 - ' + ci, `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>监理编号</label><input value="${ci}" readonly></div>
            <div class="modal-form-group"><label>合同名称</label><input value="${ci === 'CI-2026-001' ? '某石化换热器监造' : ci === 'CI-2026-002' ? '压力容器制造监理' : '管道安装监造项目'}" readonly></div>
            <div class="modal-form-group"><label>设备名称</label><input value="${ci === 'CI-2026-001' ? '管壳式换热器' : ci === 'CI-2026-002' ? '压力容器' : '工业管道'}" readonly></div>
            <div class="modal-form-group"><label>委托方</label><input value="${ci === 'CI-2026-001' ? '中国石化' : ci === 'CI-2026-002' ? '中国石油' : '中海油'}" readonly></div>
            <div class="modal-form-group"><label>制造方</label><input value="${ci === 'CI-2026-001' ? '东方锅炉' : ci === 'CI-2026-002' ? '哈尔滨锅炉' : '大连重工'}" readonly></div>
            <div class="modal-form-group"><label>监造金额(元)</label><input value="${ci === 'CI-2026-001' ? '580,000' : ci === 'CI-2026-002' ? '1,200,000' : '860,000'}" readonly></div>
            <div class="modal-form-group"><label>预给号时间</label><input value="2026-01-10" readonly></div>
            <div class="modal-form-group"><label>项目负责人</label><input value="${ci === 'CI-2026-001' ? '李明' : ci === 'CI-2026-002' ? '王芳' : '陈伟'}" readonly></div>
            <div class="modal-form-group"><label>合同签订时间</label><input value="2026-01-15" readonly></div>
            <div class="modal-form-group"><label>合同原件返回时间</label><input value="2026-01-25" readonly></div>
            <div class="modal-form-group"><label>合同起始日期</label><input value="2026-01-20" readonly></div>
            <div class="modal-form-group"><label>合同终止日期</label><input value="${ci === 'CI-2026-003' ? '2026-09-30' : '2026-12-31'}" readonly></div>
            <div class="modal-form-group"><label>委托方联系人</label><input value="张经理" readonly></div>
            <div class="modal-form-group"><label>合同形式</label><input value="${ci === 'CI-2026-001' ? '人工日' : ci === 'CI-2026-002' ? '总价' : '人工日计算总价'}" readonly></div>
            <div class="modal-form-group"><label>ERP录入情况</label><input value="${ci === 'CI-2026-003' ? '未录入' : '已录入'}" readonly></div>
            <div class="modal-form-group"><label>项目编号</label><input value="PRJ-00${ci.slice(-1)}" readonly></div>
            <div class="modal-form-group"><label>项目名称</label><input value="${ci === 'CI-2026-001' ? '石化换热器A项' : ci === 'CI-2026-002' ? '石油压力容器B项' : '海油管道安装C项'}" readonly></div>
        </div>
        <div class="modal-form-group"><label>合同特殊情况备注</label><textarea readonly>${ci === 'CI-2026-001' ? '中石化重点项目，需配合甲方年度审计' : ci === 'CI-2026-003' ? '合同已终止，等待取消终止审批' : '—'}</textarea></div>
        ${ci === 'CI-2026-003' ? `<div style="margin-top:12px;padding:12px;background:var(--orange-light);border-radius:8px;border:1px solid rgba(230,162,60,0.3)">
            <h4 style="font-size:13px;color:var(--orange);margin-bottom:8px">📋 取消终止申请记录</h4>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.8">
                <div><strong>发起人：</strong>陈伟 &nbsp;|&nbsp; <strong>时间：</strong>2026-02-20 14:30</div>
                <div><strong>终止原因：</strong>客户要求恢复项目执行</div>
                <div><strong>预估恢复时间：</strong>2026-03-01</div>
                <div><strong>审批状态：</strong><span class="status status-done">已通过</span></div>
            </div>
        </div>`: ''}
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 合同台账 - 取消终止 =====
function showCancelTerminateDialog(ci) {
    openModal('取消终止申请 - ' + ci, `
        <div class="modal-form-group"><label>终止原因 <span style="color:var(--red)">*</span></label><textarea placeholder="请填写终止原因（必填）"></textarea></div>
        <div class="modal-form-group"><label>预估恢复时间 <span style="color:var(--red)">*</span></label><input type="date"></div>
        <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue)">💡 提交后将发起审批流程，按钮变更为"取消终止申请"，点击可查看申请内容和审批信息</div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="showToast('审批流程已发起');closeModal()">确定</button>`);
}

// ===== 项目收入 - 当月确认产值 =====
function showMonthlyOutputDialog(ci, type) {
    const hasSysCalc = type !== '总价';
    openModal('当月确认产值填报 - ' + ci, `
        <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="modal-form-group"><label>监理编号</label><input value="${ci}" readonly></div>
                <div class="modal-form-group"><label>合同类型</label><input value="${type}" readonly></div>
                <div class="modal-form-group"><label>合同金额</label><input value="${ci === 'CI-2026-001' ? '580,000' : '1,200,000'}" readonly></div>
                <div class="modal-form-group"><label>确认总产值</label><input value="${ci === 'CI-2026-001' ? '310,000' : '480,000'}" readonly></div>
            </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>时间区间起始</label><input type="date" value="2026-02-01"></div>
            <div class="modal-form-group"><label>时间区间结束</label><input type="date" value="2026-02-28"></div>
        </div>
        ${hasSysCalc ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>系统计算值</label><input value="28,800" readonly style="background:var(--blue-light);color:var(--blue)"></div>
            <div class="modal-form-group"><label>当月确认产值 <span style="color:var(--red)">*</span></label><input type="number" value="26500"></div>
        </div>
        <div style="padding:10px;background:var(--orange-light);border-radius:6px;font-size:12px;color:var(--orange)">
            ⚠️ 校验：确认总产值 + 当月确认产值 ≤ 合同金额<br>💡 误差超过阈值(字典配置)时需走审批流
        </div>`: `<div class="modal-form-group"><label>当月确认产值 <span style="color:var(--red)">*</span></label><input type="number" placeholder="总价合同直接填写(无系统计算)"></div>
        <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue)">💡 总价合同：无系统计算产值、无误差校验、无审批流</div>`}
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-outline" onclick="showToast('已暂存');closeModal()">暂存</button>
       <button class="btn btn-primary" onclick="showToast('已提交');closeModal()">提交</button>`);
}

// ===== 项目收入 - 收入纠正 =====
function showIncomeCorrectionDialog() {
    openModal('当月收入纠正 (财务)', `
        <div style="max-width:1300px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#fff3e0,#ffe0b2);border-radius:8px;padding:12px 16px;margin-bottom:14px;border-left:4px solid #ff9800;">
            <div style="font-size:13px;font-weight:600;color:#e65100;margin-bottom:4px;">⚠️ 纠正规则说明</div>
            <div style="font-size:12px;color:#bf360c;line-height:1.8;">
                1. 选择合同并填写纠正金额，选中的合同后续需开具相应发票抵冲<br>
                2. 已报收入 = 开票金额合计 + 当月收入（纠正后需后期开票抵冲）<br>
                3. 计算总金额时排除纠正金额<br>
                4. 纠正原因为必填项，用于责任追溯
            </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
            <input type="text" placeholder="监理编号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
            <input type="text" placeholder="合同名称" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
            <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"><option>全部合同类型</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select>
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showToast('已筛选')">查询</button>
            <button class="btn btn-outline" style="padding:5px 12px">重置</button>
        </div>
        <div class="table-wrapper" style="margin:0;overflow-x:auto;"><table class="data-table" style="min-width:1100px;">
            <thead><tr>
                <th style="width:30px"><input type="checkbox"></th>
                <th>监理编号</th><th>合同名称</th><th>合同类型</th><th>委托方</th><th>合同负责人</th>
                <th>当月产值(元)</th><th title="已报收入 = 开票合计 + 当月收入纠正 + 补齐额。悬浮查看组成明细" style="text-decoration:underline dotted;cursor:help;">已报收入(元) ℹ️</th><th>当月收入(元)</th>
                <th>开票总金额(元)</th><th>收款总金额(元)</th>
                <th>纠正金额(元)</th><th>来源监理编号</th><th>纠正原因</th>
            </tr></thead>
            <tbody>
                <tr>
                    <td><input type="checkbox" checked onchange="updateCorrectionSummary()"></td>
                    <td>CI-2026-001</td><td>某石化换热器监造</td>
                    <td><span class="tag tag-blue">人工日</span></td>
                    <td>中国石化</td><td>李明</td>
                    <td>28,800</td><td title="构成: 历史开票(171,200) + 往期纠正(30,000 来自 CI-2026-002)" style="cursor:help;color:var(--blue);font-weight:bold;">201,200</td><td>28,800</td>
                    <td>200,000</td><td>150,000</td>
                    <td><input type="number" value="30000" style="width:90px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:12px;" onchange="updateCorrectionSummary()"></td>
                    <td><select style="padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px;width:110px;">
                        <option value="">请选择来源</option><option value="CI-2026-001">本单(CI-2026-001)</option><option value="CI-2026-002" selected>CI-2026-002</option><option value="CI-2026-003">CI-2026-003</option>
                    </select></td>
                    <td><select style="padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px;width:100px;">
                        <option value="">请选择</option><option value="开票延迟" selected>开票延迟</option><option value="合同变更">合同变更</option><option value="计算误差">计算误差</option><option value="其他">其他</option>
                    </select></td>
                </tr>
                <tr>
                    <td><input type="checkbox" onchange="updateCorrectionSummary()"></td>
                    <td>CI-2026-002</td><td>压力容器制造监理</td>
                    <td><span class="tag tag-green">总价</span></td>
                    <td>中国石油</td><td>王芳</td>
                    <td>120,000</td><td title="构成: 历史开票(500,000) 无纠正" style="cursor:help;">500,000</td><td>120,000</td>
                    <td>500,000</td><td>400,000</td>
                    <td><input type="number" style="width:90px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:12px;" onchange="updateCorrectionSummary()"></td>
                    <td><select style="padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px;width:110px;">
                        <option value="">请选择来源</option><option value="CI-2026-001">CI-2026-001</option><option value="CI-2026-002">本单(CI-2026-002)</option><option value="CI-2026-003">CI-2026-003</option>
                    </select></td>
                    <td><select style="padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px;width:100px;">
                        <option value="">请选择</option><option value="开票延迟">开票延迟</option><option value="合同变更">合同变更</option><option value="计算误差">计算误差</option><option value="其他">其他</option>
                    </select></td>
                </tr>
            </tbody>
        </table></div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:var(--bg-body);border-radius:8px;border:1px solid var(--border-color);">
            <div style="font-size:12px;color:var(--text-muted);">
                已选合同：<strong id="correctionSelectedCount" style="color:var(--blue);">1</strong> 个 &nbsp;|&nbsp;
                纠正操作人：<strong style="color:var(--text-primary);">当前登录用户(财务)</strong> &nbsp;|&nbsp;
                操作时间：<strong style="color:var(--text-primary);">${new Date().toLocaleString('zh-CN')}</strong>
            </div>
            <div style="font-size:14px;">纠正金额汇总：<strong id="correctionTotal" style="color:var(--red);font-size:16px;">¥30,000.00</strong></div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">
            💡 提交后将生成纠正记录，可在「历史」弹窗中查看完整纠正轨迹。纠正金额不纳入总金额计算，但选中合同后续需开具发票抵冲。
        </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-outline" onclick="showToast('已暂存(不生效)');closeModal()">暂存</button>
       <button class="btn btn-primary" onclick="showToast('已提交(生效)');closeModal()">提交</button>`);
    document.getElementById('modalBox').style.maxWidth = '1300px';
}
function updateCorrectionSummary() {
    showToast('纠正金额已更新');
}

// ===== 项目收入 - 开票信息填报 =====
function showInvoiceInfoDialog() {
    openModal('开票信息填报', `
        <div style="background:#f0f7ff;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--blue);font-size:12px;color:#1565c0;">
            🧾 填报开票相关信息。提交后将生成历史记录，可在「历史」弹窗中查看。
        </div>
        <div class="modal-form-group"><label>计划开票时间 <span style="color:var(--red)">*</span></label><input type="date"></div>
        <div class="modal-form-group"><label>未开票原因</label><textarea placeholder="请输入未开票原因"></textarea></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入备注信息"></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('开票信息已保存');closeModal()">保存</button>`);
}
// ===== 项目收入 - 回款信息填报 =====
function showReceiptInfoDialog() {
    openModal('回款信息填报', `
        <div style="background:#f0fff4;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--green);font-size:12px;color:#2e7d32;">
            💰 填报回款相关信息。供管理者全面排查查看。提交后将生成历史记录，可在「历史」弹窗中查看。
        </div>
        <div class="modal-form-group"><label>计划回款时间</label><input type="date"></div>
        <div class="modal-form-group"><label>计划回款金额(元)</label><input type="number" placeholder="请输入计划回款金额"></div>
        <div class="modal-form-group"><label>最新收款时间 <span style="color:var(--red)">*</span></label><input type="date"></div>
        <div class="modal-form-group"><label>收款总金额(元) <span style="color:var(--red)">*</span></label><input type="number" placeholder="请输入累计收款总金额"></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入备注信息"></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('回款信息已保存');closeModal()">保存</button>`);
}

// ===== 项目收入 - 历史 =====
function showHistoryDialog(ci) {
    openModal('历史记录 - ' + ci, `
        <div style="max-width:1300px;margin:0 auto;">
        <div class="tab-bar" style="margin-bottom:12px">
            <button class="tab-btn active" onclick="switchHistTab(this,'hist-output')">当月确认产值</button>
            <button class="tab-btn" onclick="switchHistTab(this,'hist-correct')">纠正记录</button>
        </div>
        <div id="tab-hist-output">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部类型</option><option>系统计算</option><option>用户填报</option><option>系统补齐</option></select>
                <input type="text" placeholder="操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:80px;">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>默认排序</option><option>金额从大到小</option><option>金额从小到大</option></select>
                <button class="btn btn-primary" style="padding:5px 12px">查询</button>
                <button class="btn btn-outline" style="padding:5px 12px">重置</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto;"><table class="data-table" style="min-width:1050px;">
                <thead><tr>
                    <th>月份</th><th>合同类型</th>
                    <th>系统计算值(元)</th><th>确认产值(元)</th>
                    <th>差异值(元)</th><th>差异率</th>
                    <th>确认总产值快照(元)</th>
                    <th>类型</th><th>操作人</th><th>操作时间</th><th>备注</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>2026-02</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>28,800</td>
                        <td><strong style="color:var(--blue);">26,500</strong></td>
                        <td><span style="color:var(--red);font-weight:600;">-2,300</span></td>
                        <td><span style="color:var(--red);">-7.99%</span></td>
                        <td>308,800</td>
                        <td><span class="tag tag-blue">用户填报</span></td>
                        <td>李明</td>
                        <td>2026-02-20 14:32:15</td>
                        <td style="font-size:11px;color:var(--text-muted);">按实际工时调整</td>
                    </tr>
                    <tr>
                        <td>2026-01</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>28,800</td>
                        <td>28,800</td>
                        <td><span style="color:var(--green);font-weight:600;">0</span></td>
                        <td><span style="color:var(--green);">0%</span></td>
                        <td>282,300</td>
                        <td><span class="tag tag-green">系统计算</span></td>
                        <td>系统</td>
                        <td>2026-01-31 23:59:59</td>
                        <td style="font-size:11px;color:var(--text-muted);">自动结算</td>
                    </tr>
                    <tr>
                        <td>2025-12</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>25,600</td>
                        <td><strong style="color:var(--blue);">27,000</strong></td>
                        <td><span style="color:var(--orange);font-weight:600;">+1,400</span></td>
                        <td><span style="color:var(--orange);">+5.47%</span></td>
                        <td>253,500</td>
                        <td><span class="tag tag-blue">用户填报</span></td>
                        <td>李明</td>
                        <td>2025-12-28 10:15:43</td>
                        <td style="font-size:11px;color:var(--text-muted);">含加班工时</td>
                    </tr>
                </tbody>
            </table></div>
            <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">
                💡 差异值 = 确认产值 - 系统计算值 | 差异率超过字典配置阈值时走审批流 | 红色=减少 橙色=增加 绿色=无差异
            </div>
        </div>
        <div id="tab-hist-correct" style="display:none">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="text" placeholder="操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:80px;">
                <input type="text" placeholder="监理编号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:100px;">
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部类型</option><option>系统计算</option><option>系统补齐</option><option>用户纠正</option></select>
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>默认排序</option><option>金额从大到小</option><option>金额从小到大</option></select>
                <button class="btn btn-primary" style="padding:5px 12px">查询</button>
                <button class="btn btn-outline" style="padding:5px 12px">重置</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto;"><table class="data-table" style="min-width:1200px;">
                <thead><tr>
                    <th>序号</th><th>监理编号</th><th>合同名称</th><th>合同类型</th>
                    <th>纠正前收入(元)</th><th>纠正金额(元)</th><th>纠正后收入(元)</th>
                    <th>差异金额(元)</th><th>当月产值(元)</th>
                    <th>纠正原因</th><th>类型</th><th>操作人</th><th>操作时间</th><th>状态</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>CI-2026-001</td><td>某石化换热器监造</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>28,800</td>
                        <td><strong style="color:var(--red);">30,000</strong></td>
                        <td><strong style="color:var(--blue);">58,800</strong></td>
                        <td><span style="color:var(--orange);font-weight:600;">+30,000</span></td>
                        <td>28,800</td>
                        <td><span style="font-size:11px;">开票延迟，实际收入高于开票金额</span></td>
                        <td><span class="tag tag-orange">用户纠正</span></td>
                        <td>财务张</td>
                        <td>2026-02-20 09:45:32</td>
                        <td><span class="status status-active">已生效</span></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>CI-2026-001</td><td>某石化换热器监造</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>0</td>
                        <td>28,800</td>
                        <td>28,800</td>
                        <td><span style="color:var(--green);font-weight:600;">0</span></td>
                        <td>28,800</td>
                        <td><span style="font-size:11px;">—</span></td>
                        <td><span class="tag tag-green">系统计算</span></td>
                        <td>系统</td>
                        <td>2026-01-31 23:59:59</td>
                        <td><span class="status status-active">已生效</span></td>
                    </tr>
                </tbody>
            </table></div>
            <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">
                💡 纠正后收入 = 纠正前收入 + 纠正金额 | 选中合同后续需开具发票抵冲 | 所有纠正操作均留痕可溯源
            </div>
        </div>
        <div style="margin-top:12px;padding:10px 16px;background:#f0f7ff;border-radius:8px;border:1px solid #bbdefb;font-size:11px;color:#1565c0;">
            📋 <strong>数据说明</strong>：所有历史记录均不可修改或删除，确保数据完整性和可追溯性。每条记录包含操作人、精确操作时间、修改前后对比，用于责任划分和审计留痕。
        </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
    document.getElementById('modalBox').style.maxWidth = '1300px';
}
function switchHistTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.getElementById('tab-hist-output').style.display = id === 'hist-output' ? 'block' : 'none';
    document.getElementById('tab-hist-correct').style.display = id === 'hist-correct' ? 'block' : 'none';
}

// ===== 项目收入 - 全局历史记录 =====
function showGlobalHistoryDialog() {
    openModal('全局历史记录查询 (领导层视图)', `
        <div style="max-width:1300px;margin:0 auto;">
        <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin-bottom:14px;border-left:4px solid #6b7280;">
            <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:4px;">📜 全局合同历史视图</div>
            <div style="font-size:12px;color:#4b5563;">
                 此视图供管理层审阅，包含所有合同的“确认产值”和“纠正记录”完整轨迹，支持多维度组合高级查询及双向排序功能。
            </div>
        </div>
        <div class="tab-bar" style="margin-bottom:12px">
            <button class="tab-btn active" onclick="switchGlobalHistTab(this,'global-hist-output')">全量确认产值记录</button>
            <button class="tab-btn" onclick="switchGlobalHistTab(this,'global-hist-correct')">全量纠正记录</button>
        </div>
        <div id="tab-global-hist-output">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="text" placeholder="监理编号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:100px;">
                <input type="text" placeholder="合同名称" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:120px;">
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部类型</option><option>系统计算</option><option>用户填报</option><option>系统补齐</option></select>
                <input type="text" placeholder="操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:80px;">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>金额排序:默认</option><option>从大到小</option><option>从小到大</option></select>
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>编号排序:默认</option><option>A-Z</option><option>Z-A</option></select>
                <button class="btn btn-primary" style="padding:5px 12px">查询</button>
                <button class="btn btn-success" style="padding:5px 12px">📥 批量导出</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto;max-height:400px;overflow-y:auto;"><table class="data-table" style="min-width:1250px;">
                <thead style="position:sticky;top:0;background:var(--bg-card);z-index:1;"><tr>
                    <th>监理编号</th><th>合同名称</th><th>月份</th><th>合同类型</th>
                    <th>系统计算值</th><th>确认产值</th>
                    <th>差异值</th><th>差异率</th>
                    <th>总产值快照</th>
                    <th>类型</th><th>操作人</th><th>操作时间</th><th>备注</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>CI-2026-001</td><td>某石化换热器监造</td>
                        <td>2026-02</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>28,800</td><td><strong style="color:var(--blue);">26,500</strong></td>
                        <td><span style="color:var(--red);font-weight:600;">-2,300</span></td>
                        <td><span style="color:var(--red);">-7.99%</span></td>
                        <td>308,800</td><td><span class="tag tag-blue">用户填报</span></td>
                        <td>李明</td><td>2026-02-20 14:32:15</td>
                        <td style="font-size:11px;color:var(--text-muted);">按实际工时调整</td>
                    </tr>
                    <tr>
                        <td>CI-2026-002</td><td>压力容器制造监理</td>
                        <td>2026-01</td>
                        <td><span class="tag tag-green">总价</span></td>
                        <td>120,000</td><td><strong style="color:var(--blue);">120,000</strong></td>
                        <td><span style="color:var(--green);font-weight:600;">0</span></td>
                        <td><span style="color:var(--green);">0%</span></td>
                        <td>480,000</td><td><span class="tag tag-blue">用户填报</span></td>
                        <td>王芳</td><td>2026-01-31 16:20:00</td>
                        <td style="font-size:11px;color:var(--text-muted);">本月结算</td>
                    </tr>
                </tbody>
            </table></div>
        </div>
        <div id="tab-global-hist-correct" style="display:none">
            <div style="text-align:center;padding:40px;color:var(--text-muted)">全量纠正记录列表，结构与单合同一致，但拥有跨合同对比查询与导出能力...</div>
        </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭全局视图</button>`);
    document.getElementById('modalBox').style.maxWidth = '1300px';
}
function switchGlobalHistTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.getElementById('tab-global-hist-output').style.display = id === 'global-hist-output' ? 'block' : 'none';
    document.getElementById('tab-global-hist-correct').style.display = id === 'global-hist-correct' ? 'block' : 'none';
}

// ===== 执行管理 - 编辑 =====
function showExecutionEditDialog(pd) {
    openModal('编辑业务状态流 - ' + pd, `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">编辑驻厂监造的业务状态流字段（巡检无数据）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>大纲是否已编制审核</label><select><option>是</option><option>否</option></select></div>
            <div class="modal-form-group"><label>细则是否已编制审核</label><select><option>是</option><option>否</option></select></div>
            <div class="modal-form-group"><label>风险评估报告风险等级</label><select><option>低</option><option selected>中</option><option>高</option></select></div>
            <div class="modal-form-group"><label>依据性文件现场是否拿到</label><select><option>是</option><option>否</option></select></div>
            <div class="modal-form-group"><label>监理工程师交接申请</label><select><option>有</option><option selected>无</option></select></div>
            <div class="modal-form-group"><label>ITP是否已确认并发给委托方</label><select><option>是</option><option>否</option></select></div>
        </div>
        <div class="modal-form-group"><label>预检会是否召开并有会议纪要</label><select><option>是</option><option>否</option></select></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入"></textarea></div>
    `);
}
