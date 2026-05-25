// ===== comp_0.js — 全局工具 + DashboardPage =====
const { createApp, ref, computed, reactive, onMounted, onUnmounted, nextTick, watch, toRefs } = Vue;

// ===== 全局工具函数 =====
function fmt(n) { if (n === null || n === undefined || n === '') return '—'; return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 0 }); }
function fmtM(n) { if (n === null || n === undefined) return '—'; return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtW(n) { if (n === null || n === undefined) return '—'; return (Number(n) / 10000).toFixed(2) + ' 万'; }
function fmtPct(n) { if (n === null || n === undefined) return '—'; return Number(n).toFixed(1) + '%'; }

// Toast 通知系统
const toastList = Vue.ref([]);
function showToast(msg, type) {
    const id = Date.now();
    toastList.value.push({ id, msg, type: type || 'info' });
    setTimeout(() => { toastList.value = toastList.value.filter(t => t.id !== id); }, 3000);
}
function doExport(name) { showToast('正在导出【' + name + '】数据...', 'success'); }

// ===== DashboardPage 领导管理大屏 =====
const DashboardPage = {
    props: ['role', 'contracts', 'incomeData', 'costData', 'profitData'],
    setup(props) {
        const data = props.contracts;
        const role = props.role;
        // 统计指标
        const totalContract = Vue.computed(() => (data || []).length);
        const totalAmount = Vue.computed(() => (data || []).reduce((s, c) => s + (c.amount || 0), 0));
        const activeCount = Vue.computed(() => (data || []).filter(c => c.status === '进行中').length);
        const doneCount = Vue.computed(() => (data || []).filter(c => c.status === '已完成').length);
        const totalInvoice = Vue.computed(() => (props.incomeData || []).reduce((s, r) => s + (r.invoiced || 0), 0));
        const totalPayment = Vue.computed(() => (props.incomeData || []).reduce((s, r) => s + (r.received || 0), 0));
        const totalCost = Vue.computed(() => (props.costData || []).reduce((s, r) => s + (r.personnelCost || 0) + (r.travelCost || 0) + (r.fixedCost || 0), 0));
        const totalProfit = Vue.computed(() => totalAmount.value - totalCost.value);

        // ECharts
        const chartRef1 = Vue.ref(null);
        const chartRef2 = Vue.ref(null);
        let chart1 = null, chart2 = null;

        Vue.onMounted(() => {
            nextTick(() => {
                if (chartRef1.value) {
                    chart1 = echarts.init(chartRef1.value);
                    chart1.setOption({
                        title: { text: '合同金额分布', left: 'center', textStyle: { fontSize: 14 } },
                        tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
                        legend: { bottom: 0 },
                        series: [{ type: 'pie', radius: ['40%', '70%'], data: (data || []).map(c => ({ name: c.name, value: c.amount })), emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } } }]
                    });
                }
                if (chartRef2.value) {
                    chart2 = echarts.init(chartRef2.value);
                    chart2.setOption({
                        title: { text: '收入 vs 成本 vs 利润', left: 'center', textStyle: { fontSize: 14 } },
                        tooltip: { trigger: 'axis' },
                        legend: { bottom: 0 },
                        xAxis: { type: 'category', data: (data || []).map(c => c.ciCode) },
                        yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000).toFixed(0) + '万' } },
                        series: [
                            { name: '合同金额', type: 'bar', data: (data || []).map(c => c.amount), itemStyle: { color: '#409eff' } },
                            { name: '总成本', type: 'bar', data: (props.costData || []).map(c => (c.personnelCost || 0) + (c.travelCost || 0) + (c.fixedCost || 0)), itemStyle: { color: '#f56c6c' } },
                            { name: '利润', type: 'line', data: (data || []).map((c, i) => { const cost = props.costData && props.costData[i] ? (props.costData[i].personnelCost || 0) + (props.costData[i].travelCost || 0) + (props.costData[i].fixedCost || 0) : 0; return c.amount - cost; }), itemStyle: { color: '#67c23a' } }
                        ]
                    });
                }
            });
        });

        onUnmounted(() => { if (chart1) chart1.dispose(); if (chart2) chart2.dispose(); });

        // 预警列表
        const warnings = [
            { type: 'danger', icon: '🔴', title: 'CI-2024-004 利润为负', desc: '管道安装监造项目利润 -45,200 元，请关注成本控制' },
            { type: 'warning', icon: '🟡', title: 'CI-2024-001 计划结束时间已超期', desc: '某石化换热器监造派单 PD-20260115-01 计划结束日期 2026-02-28 已超期' },
            { type: 'warning', icon: '🟡', title: '开票提醒: CI-2026-001', desc: '距离最近一次开票已超30天，请及时开票' },
            { type: 'info', icon: '🔵', title: '回款到账通知', desc: 'CI-2026-002 收到回款 ¥400,000，审批已通过' },
            { type: 'info', icon: '🔵', title: '新合同已签订', desc: 'CI-2026-005 管道检测监理已完成合同签订流程' },
        ];

        return {
            role, totalContract, totalAmount, activeCount, doneCount,
            totalInvoice, totalPayment, totalCost, totalProfit,
            chartRef1, chartRef2, warnings, fmt, fmtW, fmtM
        };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>🖥️ 领导管理大屏</h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong></span>
        </div>

        <!-- 核心指标卡片 -->
        <div class="dash-metrics">
            <div class="dash-metric blue">
                <div class="dash-metric-label">合同总数</div>
                <div class="dash-metric-value">{{ totalContract }}</div>
                <div class="dash-metric-sub">进行中 {{ activeCount }} | 已完成 {{ doneCount }}</div>
            </div>
            <div class="dash-metric purple">
                <div class="dash-metric-label">合同总金额</div>
                <div class="dash-metric-value">{{ fmtW(totalAmount) }}</div>
                <div class="dash-metric-sub">¥{{ fmtM(totalAmount) }}</div>
            </div>
            <div class="dash-metric green">
                <div class="dash-metric-label">累计开票</div>
                <div class="dash-metric-value">{{ fmtW(totalInvoice) }}</div>
                <div class="dash-metric-sub">已回款 {{ fmtW(totalPayment) }}</div>
            </div>
            <div class="dash-metric orange">
                <div class="dash-metric-label">总成本</div>
                <div class="dash-metric-value">{{ fmtW(totalCost) }}</div>
                <div class="dash-metric-sub">含人员/差旅/固定支出</div>
            </div>
            <div class="dash-metric" :class="totalProfit >= 0 ? 'green' : 'red'" style="grid-column: span 1;">
                <div class="dash-metric-label">总利润</div>
                <div class="dash-metric-value">{{ totalProfit >= 0 ? '+' : '' }}{{ fmtW(totalProfit) }}</div>
                <div class="dash-metric-sub">利润率 {{ totalAmount ? fmtPct(totalProfit / totalAmount * 100) : '—' }}</div>
            </div>
        </div>

        <!-- 图表区 -->
        <div class="dash-grid-2">
            <div class="chart-card">
                <div class="chart-card-title">📊 合同金额分布</div>
                <div class="chart-container" ref="chartRef1"></div>
            </div>
            <div class="chart-card">
                <div class="chart-card-title">📈 收入 vs 成本 vs 利润</div>
                <div class="chart-container" ref="chartRef2"></div>
            </div>
        </div>

        <!-- 预警列表 -->
        <div class="chart-card">
            <div class="chart-card-title">⚠️ 业务预警与通知 <span style="font-size:12px;color:var(--text-muted);font-weight:400;">（共 {{ warnings.length }} 条）</span></div>
            <div class="warning-list">
                <div class="warning-item" :class="w.type" v-for="(w, i) in warnings" :key="i">
                    <span class="warning-icon">{{ w.icon }}</span>
                    <div class="warning-content">
                        <div class="warning-title">{{ w.title }}</div>
                        <div class="warning-desc">{{ w.desc }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};
// ===== comp_1.js — ContractPage 合同台账 + IncomePage 项目收入 =====

// ==================== 合同台账 ====================
const ContractPage = {
  props: ['role', 'data'],
  emits: ['terminate', 'view-detail'],
  setup(props, { emit }) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const showAdvFilter = Vue.ref(false);
    const detailModal = Vue.ref(null); // holds contract object or null
    const terminateModal = Vue.ref(null);
    const search = Vue.reactive({ ciCode: '', name: '', device: '', client: '', factory: '', form: '全部', manager: '', signDate: '', startDate: '', endDate: '', erp: '全部', status: '全部' });

    const filtered = Vue.computed(() => {
      return data.value.filter(c => {
        if (search.ciCode && !c.ciCode.includes(search.ciCode)) return false;
        if (search.name && !c.name.includes(search.name)) return false;
        if (search.client && !c.client.includes(search.client)) return false;
        if (search.form !== '全部' && c.contractForm !== search.form) return false;
        if (search.status !== '全部' && c.status !== search.status) return false;
        return true;
      });
    });

    function resetFilter() { Object.keys(search).forEach(k => { search[k] = k === 'form' || k === 'erp' || k === 'status' ? '全部' : ''; }); showToast('已重置筛选条件'); }
    function doQuery() { showToast('查询成功，已加载 ' + filtered.value.length + ' 条数据'); }
    function statusClass(s) { return s === '进行中' ? 'status-active' : s === '已完成' ? 'status-done' : 'status-terminated'; }
    function formTag(f) { return f === '人工日' ? 'tag-blue' : f === '总价' ? 'tag-green' : 'tag-purple'; }

    function openDetail(c) { detailModal.value = { ...c }; }
    function openTerminate(c) { terminateModal.value = c; }
    function confirmTerminate() {
      if (terminateModal.value) { terminateModal.value.status = '已终止'; showToast('合同 ' + terminateModal.value.ciCode + ' 已终止'); }
      terminateModal.value = null;
    }

    return { data, role, filtered, search, showAdvFilter, detailModal, terminateModal, resetFilter, doQuery, statusClass, formTag, openDetail, openTerminate, confirmTerminate, fmt, fmtM, fmtW };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>合同台账 <small>(数据来源: PECMS)</small></h1>
            <div class="role-badge">当前角色：<strong>{{ role }}</strong> — 查看分配的合同号(CI编号)数据</div>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" v-model="search.ciCode" placeholder="请输入CI编号"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" v-model="search.name" placeholder="请输入"></div>
                <div class="filter-item"><label>设备名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>委托方</label><input type="text" v-model="search.client" placeholder="请输入"></div>
                <div class="filter-item"><label>制造方</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同形式</label>
                    <select v-model="search.form"><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select>
                </div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>项目负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同签订时间</label><input type="date"></div>
                <div class="filter-item"><label>合同起始日期</label><input type="date"></div>
                <div class="filter-item"><label>合同终止日期</label><input type="date"></div>
                <div class="filter-item"><label>ERP录入情况</label>
                    <select v-model="search.erp"><option>全部</option><option>已录入</option><option>未录入</option></select>
                </div>
                <div class="filter-item"><label>合同状态</label>
                    <select v-model="search.status"><option>全部</option><option>进行中</option><option>已完成</option><option>已终止</option></select>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="doQuery">🔍 查询</button>
                <button class="btn btn-outline" @click="resetFilter">↻ 重置</button>
                <button class="btn btn-outline" @click="showAdvFilter = !showAdvFilter">⚡ {{ showAdvFilter ? '收起' : '高级查询' }}</button>
                <button class="btn btn-success" @click="doExport('合同台账')">📥 导出</button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th style="width:40px">#</th><th>监理编号</th><th>合同名称</th><th>设备名称</th><th>委托方</th><th>制造方</th>
                    <th>监造金额(元)</th><th>预给号时间</th><th>项目负责人</th><th>合同签订时间</th><th>合同原件返回</th>
                    <th>合同起始</th><th>合同终止</th><th>委托方联系人</th><th>合同形式</th><th>ERP录入</th>
                    <th>项目编号</th><th>项目名称</th><th>状态</th><th style="min-width:160px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(c, i) in filtered" :key="c.ciCode">
                        <td>{{ i+1 }}</td>
                        <td><span class="link-text" @click="openDetail(c)">{{ c.ciCode }}</span></td>
                        <td>{{ c.name }}</td><td>{{ c.device || '—' }}</td><td>{{ c.client }}</td><td>{{ c.factory }}</td>
                        <td class="text-right">{{ fmtM(c.amount) }}</td><td>{{ c.preDate || '—' }}</td><td>{{ c.manager }}</td>
                        <td>{{ c.signDate }}</td><td>{{ c.returnDate || '—' }}</td><td>{{ c.startDate }}</td><td>{{ c.endDate }}</td>
                        <td>{{ c.contact || '—' }}</td>
                        <td><span class="tag" :class="formTag(c.contractForm)">{{ c.contractForm }}</span></td>
                        <td>{{ c.erp || '未录入' }}</td><td>{{ c.projectCode || '—' }}</td><td>{{ c.projectName || '—' }}</td>
                        <td><span class="status" :class="statusClass(c.status)">{{ c.status }}</span></td>
                        <td>
                            <button class="btn-mini btn-primary" @click="openDetail(c)">详情</button>
                            <button class="btn-mini btn-warning" v-if="c.status==='进行中'" @click="openTerminate(c)">终止</button>
                        </td>
                    </tr>
                    <tr v-if="!filtered.length"><td colspan="20" style="text-align:center;padding:40px;color:var(--text-muted);">暂无数据</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <span>共 <strong>{{ filtered.length }}</strong> 条记录，第 1/1 页</span>
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:12px">每页</span>
                <select style="padding:4px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"><option>10</option><option>20</option><option>50</option></select>
                <span style="font-size:12px">条</span>
                <div class="pagination-btns"><button class="btn-page" disabled>‹</button><button class="btn-page active">1</button><button class="btn-page" disabled>›</button></div>
            </div>
        </div>

        <!-- 详情弹窗 -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>合同详情 — {{ detailModal.ciCode }}</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="detail-info">
                        <div class="detail-item"><div class="detail-label">监理编号</div><div class="detail-value">{{ detailModal.ciCode }}</div></div>
                        <div class="detail-item"><div class="detail-label">合同名称</div><div class="detail-value">{{ detailModal.name }}</div></div>
                        <div class="detail-item"><div class="detail-label">设备名称</div><div class="detail-value">{{ detailModal.device || '—' }}</div></div>
                        <div class="detail-item"><div class="detail-label">委托方</div><div class="detail-value">{{ detailModal.client }}</div></div>
                        <div class="detail-item"><div class="detail-label">制造方</div><div class="detail-value">{{ detailModal.factory }}</div></div>
                        <div class="detail-item"><div class="detail-label">监造金额</div><div class="detail-value" style="color:var(--blue);font-weight:700;">¥{{ fmtM(detailModal.amount) }}</div></div>
                        <div class="detail-item"><div class="detail-label">项目负责人</div><div class="detail-value">{{ detailModal.manager }}</div></div>
                        <div class="detail-item"><div class="detail-label">合同形式</div><div class="detail-value">{{ detailModal.contractForm }}</div></div>
                        <div class="detail-item"><div class="detail-label">合同签订时间</div><div class="detail-value">{{ detailModal.signDate }}</div></div>
                        <div class="detail-item"><div class="detail-label">合同起始日期</div><div class="detail-value">{{ detailModal.startDate }}</div></div>
                        <div class="detail-item"><div class="detail-label">合同终止日期</div><div class="detail-value">{{ detailModal.endDate }}</div></div>
                        <div class="detail-item"><div class="detail-label">委托方联系人</div><div class="detail-value">{{ detailModal.contact || '—' }}</div></div>
                        <div class="detail-item"><div class="detail-label">ERP录入</div><div class="detail-value">{{ detailModal.erp || '未录入' }}</div></div>
                        <div class="detail-item"><div class="detail-label">项目编号</div><div class="detail-value">{{ detailModal.projectCode || '—' }}</div></div>
                        <div class="detail-item"><div class="detail-label">项目名称</div><div class="detail-value">{{ detailModal.projectName || '—' }}</div></div>
                        <div class="detail-item"><div class="detail-label">状态</div><div class="detail-value"><span class="status" :class="statusClass(detailModal.status)">{{ detailModal.status }}</span></div></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="detailModal=null">关闭</button></div>
            </div>
        </div>

        <!-- 终止确认弹窗 -->
        <div class="modal-overlay" v-if="terminateModal" @click.self="terminateModal=null">
            <div class="modal modal-sm">
                <div class="modal-header"><h3>终止合同确认</h3><button class="modal-close" @click="terminateModal=null">✕</button></div>
                <div class="modal-body">
                    <p style="margin-bottom:12px;">确认将合同 <strong style="color:var(--red)">{{ terminateModal.ciCode }}</strong> 状态修改为<strong>已终止</strong>？</p>
                    <p style="font-size:12px;color:var(--text-muted);">终止后相关收入、成本将停止计算，该操作不可逆。</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="terminateModal=null">取消</button>
                    <button class="btn btn-danger" @click="confirmTerminate">确认终止</button>
                </div>
            </div>
        </div>
    </div>
    `
};

// ==================== 项目收入 ====================
const IncomePage = {
  props: ['role', 'contracts', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const contracts = Vue.computed(() => props.contracts || []);
    const role = Vue.computed(() => props.role);
    const showFormula = Vue.ref(true);
    const reportModal = Vue.ref(null);
    const correctModal = Vue.ref(null);
    const historyModal = Vue.ref(false);

    // 收入填报表单
    const reportForm = Vue.reactive({ ciCode: '', period: '', amount: 0, systemVal: 0, remark: '' });

    // 收入纠正14列表格的内部数据
    const correctItems = Vue.reactive([
        { selected: false, pdCode: 'PD-20260115-01', pdStatus: '进行中', type: '驻厂', name: '李明', client: '中国石化', factory: '东方锅炉', totalHours: 158, effectiveHours: 120, pct: '100%', baseAmt: 300, coef: 1.2, cost: 43200, output: 86400 }
    ]);
    const correctTotal = Vue.computed(() => correctItems.filter(i => i.selected).reduce((sum, i) => sum + i.output, 0));
    const correctForm = Vue.reactive({ amount: 0, reason: '', srcCode: '' });

    function openReport(row) {
      Object.assign(reportForm, { ciCode: row.ciCode, period: new Date().toISOString().slice(0, 7), amount: 0, systemVal: row.monthOutput || 0, remark: '' });
      reportModal.value = row;
    }
    function submitReport() {
      showToast('收入填报已提交审批：' + reportForm.ciCode);
      reportModal.value = null;
    }
    function openCorrect(row) {
      Object.assign(correctForm, { amount: 0, reason: '', srcCode: '' });
      correctItems.forEach(i => i.selected = false);
      correctModal.value = row;
    }
    function submitCorrect() {
      showToast('收入纠正申请已挂账处理');
      correctModal.value = null;
    }

    return { data, contracts, role, showFormula, reportModal, correctModal, historyModal, reportForm, correctItems, correctTotal, correctForm, openReport, submitReport, openCorrect, submitCorrect, fmt, fmtM, fmtW };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>项目收入汇总 <small>(包含产值核算/收入纠正/确认/历史全量展示)</small></h1>
            <div style="display:flex;align-items:center;gap:12px;">
                <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 控制填报与纠正的表单及按钮</span>
                <button class="btn btn-outline" style="background:#4b5563;color:#fff;border:none;" @click="historyModal=true">📜 领导层查看系统全部历史流转</button>
            </div>
        </div>

        <div class="formula-panel" style="margin-bottom:16px;">
            <div class="formula-panel-header" @click="showFormula=!showFormula" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border-color);">
                <span class="formula-panel-title">📐 核心计算规则及公式指引（点击展开/收起）</span>
                <span>{{ showFormula ? '▾' : '▸' }}</span>
            </div>
            <div class="formula-panel-body" v-show="showFormula" style="padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
                <div class="formula-card"><div class="formula-title">总产值计算</div><div class="formula-body">人工日: Σ(合同单价×实际工时)<br>总价合同: 默认=已报收入总额</div></div>
                <div class="formula-card"><div class="formula-title">当月产值</div><div class="formula-body">人工日: (当月工时×合同单价)<br>总价: 未结束=(已报收入÷总工时)×30</div></div>
                <div class="formula-card"><div class="formula-title">确认当月产值</div><div class="formula-body">人工日: 需领导审批确认实际值<br>总价: 由业务线手工填报直接产生</div></div>
                <div class="formula-card"><div class="formula-title">已报收入纠正法</div><div class="formula-body">当实际开票与理论产值有差额时，提供14列明细表，勾选历史产值底表进行按人头金额抵冲</div></div>
                <div class="formula-card"><div class="formula-title">工时与占比分配</div><div class="formula-body">系统根据排班交叉自动分配比例<br>100%代表该时段仅有一个驻厂/巡检</div></div>
                <div class="formula-card"><div class="formula-title">状态自动联动</div><div class="formula-body">当关联监理单全部【已完成】，若账面回款不足，系统将亮红灯提醒结算清零</div></div>
            </div>
        </div>

        <!-- 高度还原 V1 + V2 的组合检索 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="输入CI编号搜索"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="关键词模糊查询"></div>
                <div class="filter-item"><label>委托方名称</label><input type="text" placeholder="所属客户"></div>
                <div class="filter-item"><label>大客户归属</label>
                    <select><option>全部客户</option><option>中石化系</option><option>中石油系</option><option>内外部其他</option></select>
                </div>
                <div class="filter-item"><label>合同形式</label>
                    <select><option>全部类型</option><option>人工日结算</option><option>一口价总包</option><option>工时换算总价</option></select>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('检索系统已加载数据')">🔍 组合检索</button>
                <button class="btn btn-outline" @click="showToast('筛选项清空')">↻ 恢复默认</button>
                <button class="btn btn-success" @click="doExport('项目收入底表')">📥 一键生成凭证底稿表</button>
            </div>
        </div>

        <!-- 数据表格 (完全对齐 V1 要求的14列) -->
        <div class="table-wrapper" style="overflow-x:auto;">
            <table class="data-table" style="min-width:1800px;">
                <thead><tr>
                    <th style="width:40px">#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>合同类型</th>
                    <th>合同金额(元)</th><th>当月产值(元)</th><th style="color:var(--orange)">当月纠正产值(A)</th>
                    <th style="color:var(--blue)">确认当月产值(B)</th><th>当月开票金额(元)</th><th>累计已开票金额(元)</th>
                    <th>累计回款金额(元)</th><th>历史纠正明细</th><th style="min-width:200px;position:sticky;right:0;background:#fff;">操作(填报/确认/纠偏)</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="r.ciCode">
                        <td>{{ i+1 }}</td><td><strong>{{ r.ciCode }}</strong></td><td>{{ r.name }}</td><td>{{ r.client }}</td>
                        <td><span class="tag" :class="r.contractForm==='人工日'?'tag-blue':r.contractForm==='总价'?'tag-green':'tag-purple'">{{ r.contractForm }}</span></td>
                        <td class="text-right">{{ fmtM(r.contractAmount) }}</td>
                        <td class="text-right">{{ fmtM(r.monthOutput) }}</td>
                        <td class="text-right font-bold text-warning">{{ r.ciCode==='CI-2024-001' ? '-5,000.00' : '0.00' }}</td>
                        <td class="text-right font-bold text-primary">{{ fmtM(r.monthConfirmed) }}</td>
                        <td class="text-right">{{ fmtM(r.invoiced) }}</td>
                        <td class="text-right">{{ fmtM(r.reportedIncome) }}</td>
                        <td class="text-right">{{ fmtM(r.received) }}</td>
                        <td class="text-center"><span class="link-text" @click="showToast('打捞并穿透查看历史修正版本及操作人日志')">查看详细记录</span></td>
                        <td style="position:sticky;right:0;background:#fff;border-left:1px solid #e2e8f0;padding:8px;text-align:center;">
                            <button class="btn-mini btn-primary" @click="openReport(r)">确认/报单</button>
                            <button class="btn-mini btn-warning" style="margin:0 4px;" @click="openCorrect(r)">手工纠正</button>
                            <button class="btn-mini btn-info" v-if="r.contractForm!=='总价'" @click="showToast('生成针对人工日的特别开票明细请求')">开票直通车</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>找到符合条件记录共 <strong>{{ data.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 收入填报 / 确认弹窗 -->
        <div class="modal-overlay" v-if="reportModal" @click.self="reportModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>最终收入产值填报及确认 — {{ reportModal.ciCode }}</h3><button class="modal-close" @click="reportModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="background:#f8fafc;padding:12px;border-left:4px solid var(--blue);margin-bottom:12px;font-size:12px;color:var(--text-muted)">
                        ⚠️ 针对人工日：系统自动抓取打卡考勤日志算出的理论产值为参考值。<br>针对总价包干：无系统计算参考，因存在进度款请按项目里程碑人工手工落定。
                    </div>
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">指定填报账期</label><input class="form-control" type="month" v-model="reportForm.period"></div>
                        <div class="form-group"><label class="form-label">系统理论产值计算结果(元)</label><input class="form-control" :value="fmtM(reportForm.systemVal)" readonly style="background:#f1f5f9;color:#64748b;"></div>
                        <div class="form-group full"><label class="form-label required">本期确认产值收入(元)</label><input class="form-control" type="number" v-model.number="reportForm.amount" placeholder="财务出账及报表用的最终金额" style="font-weight:bold;font-size:16px;"></div>
                        <div class="form-group full"><label class="form-label">偏差偏离说明及备注</label><textarea class="form-control" v-model="reportForm.remark" rows="3" placeholder="如果确认产值与系统理论产值产生显著差异，请给出必要的说明以备审计"></textarea></div>
                    </div>
                    <div v-if="reportForm.amount && reportForm.systemVal && Math.abs(reportForm.amount - reportForm.systemVal) / reportForm.systemVal > 0.1" style="margin-top:12px;padding:10px 14px;background:var(--orange-light);border-radius:6px;font-size:12px;color:var(--orange);">
                        🔥 系统检测到超出 ±10% 容忍红线：当前偏离度较高，提交后自动触发部门总监审批流程，通过后入账。
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="reportModal=null">暂存并关闭</button><button class="btn btn-primary" @click="submitReport">走确认/审批流程</button></div>
            </div>
        </div>

        <!-- 收入纠正：超级14列表格弹窗 -->
        <div class="modal-overlay" v-if="correctModal" @click.self="correctModal=null" style="z-index:999;">
            <div class="modal modal-xl" style="width:96vw;max-width:1600px;top:2vh;height:95vh;display:flex;flex-direction:column;">
                <div class="modal-header" style="flex-shrink:0;">
                    <h3>收入纠正转移单据流转面板 — {{ correctModal.ciCode }} [{{ correctModal.name }}]</h3>
                    <button class="modal-close" @click="correctModal=null">✕</button>
                </div>
                <div class="modal-body" style="flex:1;overflow-y:auto;padding:24px;">
                    <div style="background:#fff3e0;padding:14px;border-left:4px solid var(--orange);border-radius:6px;margin-bottom:16px;font-size:13px;line-height:1.6;">
                        ⚠️ <strong>纠正操作警告：</strong> 此接口针对因跨项目错登、特殊考勤扣款、异常报销抵扣引发的已产生系统产值的账目追溯与平帐。
                        <br>请在下方复杂的14列业务核算底表中筛选出问题产生的原始节点，<strong>勾选需要扣减的基础数据行</strong>，并在表单中重新设置纠偏额度。
                        转移后的额度将体现在账期报表内。
                    </div>

                    <!-- 核算底表 14 列 -->
                    <div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;margin-bottom:24px;">
                        <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                            <h4 style="margin:0;font-size:14px;font-weight:600;">📋 【历史】人员派单产值明细底帐 (14维度核算宽表)</h4>
                            <div style="font-size:12px;color:var(--text-muted);">系统仅加载当前合同历史关联的数据</div>
                        </div>
                        <div style="overflow-x:auto;">
                            <table class="data-table" style="min-width:1400px;margin:0;">
                                <thead style="background:#f1f5f9;"><tr>
                                    <th style="width:50px;text-align:center;">勾选</th>
                                    <th>派单编号</th><th>单据状态</th><th>监造形式</th><th>涉及人员</th>
                                    <th>制造厂区</th><th>汇总工时</th><th>有效折抵工时(天)</th><th>该时段排班占比</th>
                                    <th>定额单价(基数)</th><th>浮动系数乘子</th><th style="color:var(--text-danger);">倒算人员隐性成本(元)</th>
                                    <th style="color:var(--text-success);">原始上报产值贡献(元)</th>
                                </tr></thead>
                                <tbody>
                                    <tr v-for="(item, idx) in correctItems" :key="idx" :style="{background: item.selected ? '#e0f2fe' : 'transparent'}">
                                        <td style="text-align:center;"><input type="checkbox" v-model="item.selected" style="transform:scale(1.2);"></td>
                                        <td><strong>{{ item.pdCode }}</strong></td><td>{{ item.pdStatus }}</td><td><span class="tag tag-blue">{{ item.type }}</span></td>
                                        <td>{{ item.name }}</td><td>{{ item.factory }}</td><td class="text-right">{{ item.totalHours }}</td>
                                        <td class="text-right font-bold">{{ item.effectiveHours }}</td><td class="text-right">{{ item.pct }}</td>
                                        <td class="text-right">{{ fmt(item.baseAmt) }}</td><td class="text-right">{{ item.coef }}</td>
                                        <td class="text-right text-muted">{{ fmt(item.cost) }}</td>
                                        <td class="text-right font-bold text-success">{{ fmt(item.output) }}</td>
                                    </tr>
                                    <!-- 补充几行伪数据衬托复杂感 -->
                                    <tr>
                                        <td style="text-align:center;"><input type="checkbox" disabled></td>
                                        <td><strong>PD-20260212-05</strong></td><td>已完结</td><td><span class="tag tag-cyan">巡检</span></td>
                                        <td>陈伟</td><td>大连重工</td><td class="text-right">14</td><td class="text-right">10</td><td class="text-right">50%</td>
                                        <td class="text-right">300.00</td><td class="text-right">1.0</td><td class="text-right text-muted">1,500.00</td><td class="text-right">3,000.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 纠偏录入与追回流向 -->
                    <div style="background:#fff;border:1px solid var(--border-color);border-radius:8px;padding:24px;">
                        <h4 style="margin:0 0 16px 0;font-size:15px;border-left:4px solid var(--blue);padding-left:10px;">📉 设置实际纠偏(修正)额度与流向单据</h4>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
                            <div class="form-group"><label class="form-label text-muted">选中原始基础额合规汇总(元)</label><input class="form-control" disabled :value="fmtM(correctTotal)" style="background:#f1f5f9;color:#0f172a;font-weight:bold;font-size:16px;"></div>
                            <div class="form-group"><label class="form-label required">本期执行纠正金额扣减/增加(元)</label><input class="form-control" type="number" v-model.number="correctForm.amount" placeholder="例如：-2000 表示追回已报产值" style="font-size:16px;border-color:var(--orange);"></div>
                            <div class="form-group"><label class="form-label">冲抵追溯至外部合同CI单据号 (跨账本用)</label><input class="form-control" type="text" v-model="correctForm.srcCode" placeholder="输入CI并敲击回车联想目标合同..."></div>
                            <div class="form-group" style="grid-column: span 3;"><label class="form-label required">纠偏审计依据与备注 (不少于10字)</label><textarea class="form-control" v-model="correctForm.reason" rows="3" placeholder="因考勤打卡错误报销差额...因此发起追溯"></textarea></div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer" style="flex-shrink:0;padding:16px 24px;">
                    <button class="btn btn-outline" @click="correctModal=null" style="padding:10px 20px;">放弃修改，返回</button>
                    <button class="btn btn-warning" @click="submitCorrect" :disabled="!correctForm.amount || !correctForm.reason" style="padding:10px 20px;">✓ 确认账目冲销并留档提交</button>
                </div>
            </div>
        </div>

        <!-- 历史弹窗保持基础 -->
    </div>
    `
};

// ===== comp_2.js — ExecutionPage 执行管理 + WorkhourPage 工时记录 =====

// ==================== 执行管理 (28字段) ====================
const ExecutionPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const editModal = Vue.ref(null);
    const editForm = Vue.reactive({ outline: '是', detail: '是', riskLevel: '低风险', deliveryNote: '有' });

    function statusLight(s) { return s === '进行中' ? 'blue' : s === '已完成' ? 'green' : 'gray'; }
    function isOverdue(planEnd) { return planEnd && new Date(planEnd) < new Date(); }
    function openEdit(row) {
      Object.assign(editForm, { outline: row.outline || '是', detail: row.detail || '是', riskLevel: row.riskLevel || '低风险', deliveryNote: row.deliveryNote || '有' });
      editModal.value = row;
    }
    function saveEdit() { showToast('技术文件状态已保存：' + editModal.value.dispatchCode); editModal.value = null; }

    return { data, role, editModal, editForm, statusLight, isOverdue, openEdit, saveEdit, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>执行管理 <small>(28个字段)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 角色查看权限可配置</span>
        </div>

        <!-- 状态说明面板 -->
        <div style="background:var(--blue-light);border:1px solid rgba(64,158,255,0.2);border-radius:var(--radius);padding:14px 18px;margin-bottom:16px;">
            <h3 style="font-size:13px;margin-bottom:6px;color:var(--blue);">📋 项目执行状态说明（三色灯标识，可配置字典）</h3>
            <div style="font-size:12px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#c0c4cc;box-shadow:0 0 6px #c0c4cc;vertical-align:middle;"></span> 未开始 &nbsp;|&nbsp;
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--blue);box-shadow:0 0 6px var(--blue);vertical-align:middle;"></span> 进行中 &nbsp;|&nbsp;
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);vertical-align:middle;"></span> 已完成
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">⏰ 超期规则：当前时间 > 计划结束时间时，计划结束时间标红 &nbsp;|&nbsp; 📐 总产值/当月产值计算公式参照项目收入模块</div>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>项目编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>派单编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>监造方式</label><select><option>全部</option><option>驻厂</option><option>巡检</option></select></div>
                <div class="filter-item"><label>执行状态</label><select><option>全部</option><option>未开始</option><option>进行中</option><option>已完成</option></select></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-success" @click="doExport('执行管理')">📥 导出</button>
            </div>
        </div>

        <!-- 宽表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
                    <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>监造厂家</th>
                    <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
                    <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
                    <th>设备名称</th><th>数量</th><th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
                    <th style="min-width:80px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.manager }}</td><td>{{ r.projectCode }}</td><td>{{ r.projectName }}</td><td>{{ r.director }}</td>
                        <td>{{ r.dispatchCode }}</td><td>{{ r.directorRep }}</td>
                        <td class="text-right">{{ fmt(r.totalOutput) }}</td><td class="text-right">{{ fmt(r.monthOutput) }}</td><td>{{ r.factory }}</td>
                        <td>{{ r.assignee }}</td><td>{{ r.assistant || '—' }}</td>
                        <td><span class="tag" :class="r.method==='驻厂'?'tag-blue':'tag-cyan'">{{ r.method }}</span></td>
                        <td>{{ r.planStart }}</td>
                        <td :class="isOverdue(r.planEnd) ? 'text-danger' : ''">{{ r.planEnd }}</td>
                        <td>{{ r.actualStart || '—' }}</td><td>{{ r.actualEnd || '—' }}</td>
                        <td><span style="display:inline-block;width:14px;height:14px;border-radius:50;vertical-align:middle;" :style="{background: statusLight(r.execStatus)==='blue'?'var(--blue)':statusLight(r.execStatus)==='green'?'var(--green)':'#c0c4cc', boxShadow:'0 0 6px '+(statusLight(r.execStatus)==='blue'?'var(--blue)':statusLight(r.execStatus)==='green'?'var(--green)':'#c0c4cc')}" :title="r.execStatus"></span></td>
                        <td>{{ r.workDays || '—' }}</td><td>{{ r.platform || '—' }}</td><td>{{ r.sinopec || '—' }}</td>
                        <td>{{ r.deviceName || '—' }}</td><td>{{ r.deviceQty || '—' }}</td>
                        <td>{{ r.outline==='是'?'✅是':'❌否' }}</td><td>{{ r.detail==='是'?'✅是':'❌否' }}</td>
                        <td><span class="tag" :class="r.riskLevel==='高'?'tag-orange':r.riskLevel==='低'?'tag-green':'tag-orange'">{{ r.riskLevel || '—' }}</span></td>
                        <td>{{ r.basisDoc==='是'?'✅是':'❌否' }}</td><td>{{ r.handover==='是'?'❌否':'❌否' }}</td>
                        <td>{{ r.itp==='是'?'✅是':'❌否' }}</td><td>{{ r.preInspection==='是'?'✅是':'❌否' }}</td>
                        <td>
                            <button class="btn-mini btn-primary" v-if="r.method==='驻厂'" @click="openEdit(r)">编辑</button>
                            <button class="btn-mini btn-outline" v-else disabled title="巡检无业务状态流">编辑</button>
                        </td>
                    </tr>
                    <tr v-if="!data.length"><td colspan="32" style="text-align:center;padding:40px;color:var(--text-muted);">暂无数据</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ data.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 编辑技术文件管控状态弹窗 -->
        <div class="modal-overlay" v-if="editModal" @click.self="editModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>编辑技术文件管控状态</h3><button class="modal-close" @click="editModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid" style="grid-template-columns:1fr 1fr;">
                        <div class="form-group"><label class="form-label">大纲出具</label><select class="form-control" v-model="editForm.outline"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">细则出具</label><select class="form-control" v-model="editForm.detail"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">预控风险级</label><select class="form-control" v-model="editForm.riskLevel"><option>低风险</option><option>中风险</option><option>高风险</option></select></div>
                        <div class="form-group"><label class="form-label">交接清单发函</label><select class="form-control" v-model="editForm.deliveryNote"><option>有</option><option>无</option></select></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="editModal=null">取消</button>
                    <button class="btn btn-primary" @click="saveEdit">存储该项目档案状态</button>
                </div>
            </div>
        </div>
    </div>
    `
};

// ==================== 工时记录 ====================
const WorkhourPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const showAdvFilter = Vue.ref(false);
    const detailModal = Vue.ref(null);
    // 日历数据
    const calMonth = Vue.ref(new Date().getMonth() + 1);
    const calYear = Vue.ref(new Date().getFullYear());
    const calDays = Vue.computed(() => new Date(calYear.value, calMonth.value, 0).getDate());
    const calFirstDay = Vue.computed(() => new Date(calYear.value, calMonth.value - 1, 1).getDay());
    const signDays = [3, 5, 6, 8, 9, 10, 13, 15, 16, 17, 20, 23, 24, 25, 27];

    function openLevel2(c) {
      detailModal.value = c;
    }

    return { data, role, showAdvFilter, detailModal, calMonth, calYear, calDays, calFirstDay, signDays, openLevel2, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>工时记录 <small>(以合同号为维度)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 查看有权限的合同号(CI编号)工时信息</span>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>委托方</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>制造厂</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>项目负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同形式</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>监造金额范围</label><input type="text" placeholder="最小~最大"></div>
                <div class="filter-item"><label>合同签订时间</label><input type="date"></div>
                <div class="filter-item"><label>合同起始日期</label><input type="date"></div>
                <div class="filter-item"><label>合同终止日期</label><input type="date"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-outline" @click="showAdvFilter=!showAdvFilter">⚡ {{ showAdvFilter ? '收起' : '高级查询' }}</button>
                <button class="btn btn-success" @click="doExport('工时记录')">📥 导出</button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>制造厂</th><th>监造金额(元)</th>
                    <th>项目负责人</th><th>合同签订时间</th><th>合同起始时间</th><th>合同终止日期</th><th>合同形式</th><th>工时(天)</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(c, i) in data" :key="c.ciCode">
                        <td>{{ i+1 }}</td><td>{{ c.ciCode }}</td><td>{{ c.name }}</td><td>{{ c.client }}</td><td>{{ c.factory }}</td>
                        <td class="text-right">{{ fmtM(c.amount) }}</td><td>{{ c.manager }}</td>
                        <td>{{ c.signDate }}</td><td>{{ c.startDate }}</td><td>{{ c.endDate }}</td>
                        <td><span class="tag" :class="c.contractForm==='人工日'?'tag-blue':c.contractForm==='总价'?'tag-green':'tag-purple'">{{ c.contractForm }}</span></td>
                        <td class="text-right"><strong>{{ c.workhours || 158 }}</strong></td>
                        <td><button class="btn-mini btn-primary" @click="openLevel2(c)">查看</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ data.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 工时二级明细弹窗（含日历） -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>工时明细 — {{ detailModal.ciCode }} {{ detailModal.name }}</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="margin-bottom:16px;">
                        <h4 style="font-size:14px;margin-bottom:12px;">📅 {{ calYear }}年{{ calMonth }}月 签到日历</h4>
                        <div class="calendar-grid">
                            <div class="cal-header" v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</div>
                            <div class="cal-day empty" v-for="n in calFirstDay" :key="'e'+n"></div>
                            <div class="cal-day" v-for="d in calDays" :key="d" :style="signDays.includes(d) ? 'background:var(--green-light)' : ''">
                                <div class="cal-day-num">{{ d }}</div>
                                <span v-if="signDays.includes(d)" class="cal-dot" style="background:var(--green)"></span>
                            </div>
                        </div>
                        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);">
                            <span class="cal-dot" style="background:var(--green);width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:4px;"></span>已签到 {{ signDays.length }} 天
                        </div>
                    </div>

                    <h4 style="font-size:14px;margin-bottom:12px;">👥 派遣人员签到记录</h4>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>姓名</th><th>派单编号</th><th>角色</th><th>本月工时(天)</th><th>累计工时(天)</th><th>签到率</th></tr></thead>
                            <tbody>
                                <tr><td>张三</td><td>PD-20260115-01</td><td>监理工程师</td><td>22</td><td>64</td><td><span class="tag tag-green">91.7%</span></td></tr>
                                <tr><td>李四</td><td>PD-20260115-01</td><td>辅助人员</td><td>20</td><td>34</td><td><span class="tag tag-blue">83.3%</span></td></tr>
                                <tr><td>陈伟</td><td>PD-20260115-02</td><td>辅助人员</td><td>18</td><td>34</td><td><span class="tag tag-orange">75.0%</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="detailModal=null">关闭</button></div>
            </div>
        </div>
    </div>
    `
};
// ===== comp_3.js — PersonnelPage 监理人员动态 + InvoicePage 开票明细 =====

// ==================== 监理人员动态 (一级+二级) ====================
const PersonnelPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const detailModal = Vue.ref(null);

    // 人员列表 (V1同等丰富数据)
    const personnel = [
      {
        name: '张三', gender: '男', nation: '汉族', political: '党员', education: '本科', idCard: '510***********1234', birth: '1990-05', age: 35, hireDate: '2018-06-01', school: '四川大学', major: '机械工程', title: '高级工程师', cert: 'JLZ-2020-001',
        dispatches: [
          { code: 'PD-20260115-01', ciCode: 'CI-2026-001', project: '石化换热器A项', factory: '东方锅炉', role: '监理工程师', method: '驻厂', start: '2026-01-22', end: '—', days: 34 },
          { code: 'PD-20260115-02', ciCode: 'CI-2026-001', project: '石化换热器A项', factory: '东方锅炉', role: '辅助人员', method: '巡检', start: '2026-01-26', end: '—', days: 30 }
        ]
      },
      {
        name: '李四', gender: '男', nation: '汉族', political: '团员', education: '硕士', idCard: '320***********5678', birth: '1992-08', age: 33, hireDate: '2019-03-15', school: '哈尔滨工业大学', major: '焊接技术', title: '工程师', cert: 'JLZ-2021-003',
        dispatches: [
          { code: 'PD-20260115-01', ciCode: 'CI-2026-001', project: '石化换热器A项', factory: '东方锅炉', role: '辅助人员', method: '驻厂', start: '2026-01-22', end: '—', days: 34 }
        ]
      },
      {
        name: '陈伟', gender: '男', nation: '汉族', political: '群众', education: '本科', idCard: '430***********9012', birth: '1988-11', age: 37, hireDate: '2016-09-01', school: '大连理工大学', major: '化工设备', title: '高级工程师', cert: 'JLZ-2019-005',
        dispatches: [
          { code: 'PD-20260115-01', ciCode: 'CI-2026-001', project: '石化换热器A项', factory: '东方锅炉', role: '辅助人员', method: '驻厂', start: '2026-01-22', end: '—', days: 34 }
        ]
      },
      {
        name: '王五', gender: '男', nation: '汉族', political: '党员', education: '大专', idCard: '210***********3456', birth: '1985-03', age: 41, hireDate: '2012-07-20', school: '辽宁石化学院', major: '石油化工', title: '高级工程师', cert: 'JLZ-2018-002',
        dispatches: [
          { code: 'PD-20260115-02', ciCode: 'CI-2026-001', project: '石化换热器A项', factory: '东方锅炉', role: '监理工程师', method: '巡检', start: '2026-01-26', end: '—', days: 30 }
        ]
      },
      {
        name: '孙七', gender: '男', nation: '汉族', political: '党员', education: '硕士', idCard: '110***********7890', birth: '1991-07', age: 34, hireDate: '2020-01-08', school: '天津大学', major: '压力容器', title: '工程师', cert: 'JLZ-2022-001',
        dispatches: [
          { code: 'PD-20260120-01', ciCode: 'CI-2026-002', project: '石油压力容器B项', factory: '哈尔滨锅炉', role: '监理工程师', method: '驻厂', start: '—', end: '—', days: 0 }
        ]
      }
    ];

    function openDetail(p) { detailModal.value = p; }

    return { data, role, personnel, detailModal, openDetail };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>监理人员动态 <small>(一级-人员信息)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong></span>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>性别</label><select><option>全部</option><option>男</option><option>女</option></select></div>
                <div class="filter-item"><label>民族</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>政治面貌</label><select><option>全部</option><option>党员</option><option>团员</option><option>群众</option></select></div>
                <div class="filter-item"><label>文化程度</label><select><option>全部</option><option>博士</option><option>硕士</option><option>本科</option><option>大专</option></select></div>
                <div class="filter-item"><label>职称</label><input type="text" placeholder="请输入"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
            </div>
        </div>

        <!-- 人员表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>姓名</th><th>性别</th><th>民族</th><th>政治面貌</th><th>文化程度</th><th>身份证号</th>
                    <th>出生年月</th><th>年龄</th><th>入职日期</th><th>毕业院校</th><th>专业</th><th>职称</th><th>监理师证书</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(p, i) in personnel" :key="p.name">
                        <td>{{ i+1 }}</td><td>{{ p.name }}</td><td>{{ p.gender }}</td><td>{{ p.nation }}</td><td>{{ p.political }}</td>
                        <td>{{ p.education }}</td><td>{{ p.idCard }}</td><td>{{ p.birth }}</td><td>{{ p.age }}</td>
                        <td>{{ p.hireDate }}</td><td>{{ p.school }}</td><td>{{ p.major }}</td><td>{{ p.title }}</td><td>{{ p.cert }}</td>
                        <td><button class="btn-mini btn-primary" @click="openDetail(p)">查看派单</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ personnel.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 二级弹窗：派单详情 -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>{{ detailModal.name }} — 派单记录 (二级)</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="detail-info" style="margin-bottom:16px;">
                        <div class="detail-item"><div class="detail-label">姓名</div><div class="detail-value">{{ detailModal.name }}</div></div>
                        <div class="detail-item"><div class="detail-label">职称</div><div class="detail-value">{{ detailModal.title }}</div></div>
                        <div class="detail-item"><div class="detail-label">毕业院校</div><div class="detail-value">{{ detailModal.school }}</div></div>
                        <div class="detail-item"><div class="detail-label">专业</div><div class="detail-value">{{ detailModal.major }}</div></div>
                    </div>
                    <h4 style="font-size:14px;margin-bottom:12px;">📋 派单列表</h4>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>派单编号</th><th>监理编号</th><th>项目名称</th><th>监造厂家</th><th>角色</th><th>监造方式</th><th>实际开始</th><th>实际结束</th><th>用工天数</th></tr></thead>
                            <tbody>
                                <tr v-for="d in detailModal.dispatches" :key="d.code">
                                    <td>{{ d.code }}</td><td>{{ d.ciCode }}</td><td>{{ d.project }}</td><td>{{ d.factory }}</td>
                                    <td>{{ d.role }}</td>
                                    <td><span class="tag" :class="d.method==='驻厂'?'tag-blue':'tag-cyan'">{{ d.method }}</span></td>
                                    <td>{{ d.start }}</td><td>{{ d.end }}</td><td>{{ d.days }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="detailModal=null">关闭</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 开票明细管理 ====================
const InvoicePage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const showAdvFilter = Vue.ref(false);
    const addModal = Vue.ref(false);
    const detailModal = Vue.ref(null);
    const addForm = Vue.reactive({ org: '总公司', client: '', date: '', invoiceNo: '', currency: 'CNY', qty: 1, amount: 0, expectDate: '', manager: '', ciCode: '', project: '', voucherNo: '', remark: '' });

    // 开票数据
    const invoices = [
      { id: 1, org: '总公司', client: '中国石化', date: '2026-02-10', invoiceNo: 'FP-202602-001', currency: 'CNY', qty: 1, amount: 100000, expectDate: '2026-03-10', manager: '李明', ciCode: 'CI-2026-001', project: '石化换热器A项', voucherNo: 'PZ-001', remark: '—', flowStatus: '已完成', approval: '已通过' },
      { id: 2, org: '总公司', client: '中国石化', date: '2026-01-20', invoiceNo: 'FP-202601-003', currency: 'CNY', qty: 1, amount: 100000, expectDate: '2026-02-20', manager: '李明', ciCode: 'CI-2026-001', project: '石化换热器A项', voucherNo: 'PZ-002', remark: '—', flowStatus: '已完成', approval: '已通过' },
      { id: 3, org: '分公司', client: '中国石油', date: '2026-01-25', invoiceNo: 'FP-202601-005', currency: 'CNY', qty: 2, amount: 500000, expectDate: '2026-04-01', manager: '王芳', ciCode: 'CI-2026-002', project: '石油压力容器B项', voucherNo: '—', remark: '—', flowStatus: '审批中', approval: '待审批' },
      { id: 4, org: '总公司', client: '中海油', date: '—', invoiceNo: '—', currency: 'CNY', qty: 0, amount: 0, expectDate: '—', manager: '陈伟', ciCode: 'CI-2026-003', project: '海油管道安装C项', voucherNo: '—', remark: '待开票', flowStatus: '暂存', approval: '暂存' }
    ];

    function statusClass(s) { return s === '已完成' ? 'status-done' : s === '审批中' ? 'status-pending' : 'status-terminated'; }
    function approvalTag(s) { return s === '已通过' ? 'tag-green' : s === '待审批' ? 'tag-orange' : s === '已驳回' ? 'tag-orange' : 'tag-blue'; }
    function openAdd() { addModal.value = true; }
    function submitAdd() { showToast('开票记录已新增：' + addForm.invoiceNo); addModal.value = false; }
    function openDetail(inv) { detailModal.value = inv; }

    return { data, role, showAdvFilter, addModal, detailModal, invoices, addForm, statusClass, approvalTag, openAdd, submitAdd, openDetail, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>开票明细管理 <small>(不对接ERP，从ERP导出后Excel导入)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 权限为配置项</span>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>开票时间起始</label><input type="date"></div>
                <div class="filter-item"><label>开票时间结束</label><input type="date"></div>
                <div class="filter-item"><label>合同负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>凭证号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>审批结果</label><select><option>全部</option><option>暂存</option><option>审批中</option><option>已通过</option><option>已驳回</option></select></div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>开票组织</label><select><option>全部</option><option>总公司</option><option>分公司</option></select></div>
                <div class="filter-item"><label>币种</label><select><option>全部</option><option>CNY</option><option>USD</option><option>EUR</option></select></div>
                <div class="filter-item"><label>项目名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>金额范围</label><input type="text" placeholder="最小~最大"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-outline" @click="showAdvFilter=!showAdvFilter">⚡ {{ showAdvFilter ? '收起' : '高级筛选' }}</button>
                <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
                <button class="btn btn-success" @click="showToast('请选择Excel文件导入')">📤 Excel导入</button>
                <button class="btn btn-primary" @click="openAdd">➕ 新增</button>
                <button class="btn btn-outline" @click="doExport('开票明细')">📥 导出</button>
            </div>
        </div>

        <!-- 表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>开票组织</th><th>开票客户</th><th>开票日期</th><th>发票号</th><th>币种</th>
                    <th>总数量</th><th>总金额(元)</th><th>预计回款时间</th><th>合同负责人</th><th>监理编号</th>
                    <th>项目名称</th><th>凭证号</th><th>备注</th><th>流程状态</th><th>审批结果</th><th style="min-width:180px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(inv, i) in invoices" :key="inv.id">
                        <td>{{ i+1 }}</td><td>{{ inv.org }}</td><td>{{ inv.client }}</td><td>{{ inv.date }}</td><td>{{ inv.invoiceNo }}</td><td>{{ inv.currency }}</td>
                        <td>{{ inv.qty || '—' }}</td><td class="text-right">{{ inv.amount ? fmtM(inv.amount) : '—' }}</td><td>{{ inv.expectDate }}</td>
                        <td>{{ inv.manager }}</td><td>{{ inv.ciCode }}</td><td>{{ inv.project }}</td><td>{{ inv.voucherNo }}</td><td>{{ inv.remark }}</td>
                        <td><span class="status" :class="statusClass(inv.flowStatus)">{{ inv.flowStatus }}</span></td>
                        <td><span class="tag" :class="approvalTag(inv.approval)">{{ inv.approval }}</span></td>
                        <td>
                            <button class="btn-mini btn-primary" @click="openDetail(inv)">查看</button>
                            <button class="btn-mini btn-warning" v-if="inv.flowStatus==='暂存'" @click="showToast('编辑模式打开')">修改</button>
                            <button class="btn-mini btn-danger" v-if="inv.flowStatus==='暂存'" @click="showToast('已删除')">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ invoices.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 新增开票弹窗 -->
        <div class="modal-overlay" v-if="addModal" @click.self="addModal=false">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>新增开票记录</h3><button class="modal-close" @click="addModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label required">开票组织</label><select class="form-control" v-model="addForm.org"><option>总公司</option><option>分公司</option></select></div>
                        <div class="form-group"><label class="form-label required">开票客户</label><input class="form-control" v-model="addForm.client" placeholder="请输入客户名称"></div>
                        <div class="form-group"><label class="form-label required">开票日期</label><input class="form-control" type="date" v-model="addForm.date"></div>
                        <div class="form-group"><label class="form-label required">发票号</label><input class="form-control" v-model="addForm.invoiceNo" placeholder="请输入发票号"></div>
                        <div class="form-group"><label class="form-label">币种</label><select class="form-control" v-model="addForm.currency"><option>CNY</option><option>USD</option><option>EUR</option></select></div>
                        <div class="form-group"><label class="form-label required">总金额(元)</label><input class="form-control" type="number" v-model.number="addForm.amount"></div>
                        <div class="form-group"><label class="form-label">预计回款时间</label><input class="form-control" type="date" v-model="addForm.expectDate"></div>
                        <div class="form-group"><label class="form-label required">监理编号</label><input class="form-control" v-model="addForm.ciCode" placeholder="请输入CI编号"></div>
                        <div class="form-group"><label class="form-label">合同负责人</label><input class="form-control" v-model="addForm.manager" placeholder="请输入"></div>
                        <div class="form-group"><label class="form-label">凭证号</label><input class="form-control" v-model="addForm.voucherNo" placeholder="请输入"></div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" v-model="addForm.remark" placeholder="请输入备注"></textarea></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="addModal=false">取消</button>
                    <button class="btn btn-outline" @click="showToast('已暂存')">暂存</button>
                    <button class="btn btn-primary" @click="submitAdd">提交审批</button>
                </div>
            </div>
        </div>

        <!-- 查看详情弹窗 -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>开票详情 — {{ detailModal.invoiceNo }}</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="detail-info">
                        <div class="detail-item"><div class="detail-label">开票组织</div><div class="detail-value">{{ detailModal.org }}</div></div>
                        <div class="detail-item"><div class="detail-label">开票客户</div><div class="detail-value">{{ detailModal.client }}</div></div>
                        <div class="detail-item"><div class="detail-label">开票日期</div><div class="detail-value">{{ detailModal.date }}</div></div>
                        <div class="detail-item"><div class="detail-label">发票号</div><div class="detail-value">{{ detailModal.invoiceNo }}</div></div>
                        <div class="detail-item"><div class="detail-label">币种</div><div class="detail-value">{{ detailModal.currency }}</div></div>
                        <div class="detail-item"><div class="detail-label">总金额</div><div class="detail-value" style="color:var(--blue);font-weight:700;">¥{{ fmtM(detailModal.amount) }}</div></div>
                        <div class="detail-item"><div class="detail-label">监理编号</div><div class="detail-value">{{ detailModal.ciCode }}</div></div>
                        <div class="detail-item"><div class="detail-label">项目名称</div><div class="detail-value">{{ detailModal.project }}</div></div>
                        <div class="detail-item"><div class="detail-label">合同负责人</div><div class="detail-value">{{ detailModal.manager }}</div></div>
                        <div class="detail-item"><div class="detail-label">凭证号</div><div class="detail-value">{{ detailModal.voucherNo }}</div></div>
                        <div class="detail-item"><div class="detail-label">流程状态</div><div class="detail-value"><span class="status" :class="statusClass(detailModal.flowStatus)">{{ detailModal.flowStatus }}</span></div></div>
                        <div class="detail-item"><div class="detail-label">审批结果</div><div class="detail-value"><span class="tag" :class="approvalTag(detailModal.approval)">{{ detailModal.approval }}</span></div></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="detailModal=null">关闭</button></div>
            </div>
        </div>
    </div>
    `
};
// ===== comp_4.js — PaymentPage + ReminderPage + TravelPage + SalaryPage =====

// ==================== 回款明细管理 ====================
const PaymentPage = {
  props: ['role', 'data'],
  setup(props) {
    const role = Vue.computed(() => props.role);
    const showAdvFilter = Vue.ref(false);
    const addModal = Vue.ref(false);
    const detailModal = Vue.ref(null);
    const summaryModal = Vue.ref(false);

    const payments = [
      { id: 1, ciCode: 'CI-2026-001', client: '中国石化', project: '石化换热器A项', manager: '李明', amount: 80000, date: '2026-02-05', flowStatus: '已完成', approval: '已通过' },
      { id: 2, ciCode: 'CI-2026-001', client: '中国石化', project: '石化换热器A项', manager: '李明', amount: 70000, date: '2026-01-20', flowStatus: '已完成', approval: '已通过' },
      { id: 3, ciCode: 'CI-2026-002', client: '中国石油', project: '石油压力容器B项', manager: '王芳', amount: 400000, date: '2026-01-20', flowStatus: '已完成', approval: '已通过' },
      { id: 4, ciCode: 'CI-2026-002', client: '中国石油', project: '石油压力容器B项', manager: '王芳', amount: 50000, date: '—', flowStatus: '已驳回', approval: '已驳回' }
    ];

    function statusClass(s) { return s === '已完成' ? 'status-done' : s === '审批中' ? 'status-pending' : s === '已驳回' ? 'status-rejected' : 'status-terminated'; }
    function approvalTag(s) { return s === '已通过' ? 'tag-green' : s === '已驳回' ? 'tag-orange' : 'tag-blue'; }

    return { role, showAdvFilter, addModal, detailModal, summaryModal, payments, statusClass, approvalTag, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>回款明细管理</h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 需与产值、收入、开票表关联合并展现</span>
        </div>
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>回款时间起始</label><input type="date"></div>
                <div class="filter-item"><label>回款时间结束</label><input type="date"></div>
                <div class="filter-item"><label>项目名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>项目经理</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>审批状态</label><select><option>全部</option><option>暂存</option><option>审批中</option><option>已通过</option><option>已驳回</option></select></div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>回款金额(最小)</label><input type="number" placeholder="0"></div>
                <div class="filter-item"><label>回款金额(最大)</label><input type="number" placeholder="999999"></div>
                <div class="filter-item"><label>金额排序</label><select><option>默认</option><option>金额升序</option><option>金额降序</option></select></div>
                <div class="filter-item"><label>备注</label><input type="text" placeholder="模糊搜索"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-outline" @click="showAdvFilter=!showAdvFilter">⚡ {{ showAdvFilter ? '收起' : '高级筛选' }}</button>
                <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
                <button class="btn btn-primary" @click="addModal=true">➕ 新增</button>
                <button class="btn btn-info" @click="summaryModal=true">📊 汇总</button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>监理编号</th><th>对方单位</th><th>项目名称</th><th>项目经理</th><th>回款金额(元)</th><th>回款时间</th><th>流程状态</th><th>审批结果</th><th style="min-width:180px">操作</th></tr></thead>
                <tbody>
                    <tr v-for="(p, i) in payments" :key="p.id">
                        <td>{{ i+1 }}</td><td>{{ p.ciCode }}</td><td>{{ p.client }}</td><td>{{ p.project }}</td><td>{{ p.manager }}</td>
                        <td class="text-right">{{ fmtM(p.amount) }}</td><td>{{ p.date }}</td>
                        <td><span class="status" :class="statusClass(p.flowStatus)">{{ p.flowStatus }}</span></td>
                        <td><span class="tag" :class="approvalTag(p.approval)">{{ p.approval }}</span></td>
                        <td>
                            <button class="btn-mini btn-primary" @click="detailModal=p">查看</button>
                            <button class="btn-mini btn-info" v-if="p.approval==='已驳回'" @click="showToast('重新提交')">重新提交</button>
                            <button class="btn-mini btn-danger" v-if="p.approval==='已驳回'" @click="showToast('已删除')">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ payments.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 新增回款弹窗 -->
        <div class="modal-overlay" v-if="addModal" @click.self="addModal=false">
            <div class="modal modal-md">
                <div class="modal-header"><h3>新增回款记录</h3><button class="modal-close" @click="addModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label required">监理编号</label><input class="form-control" placeholder="请输入CI编号"></div>
                        <div class="form-group"><label class="form-label required">对方单位</label><input class="form-control" placeholder="请输入"></div>
                        <div class="form-group"><label class="form-label required">回款金额(元)</label><input class="form-control" type="number" placeholder="请输入金额"></div>
                        <div class="form-group"><label class="form-label required">回款时间</label><input class="form-control" type="date"></div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" placeholder="请输入备注"></textarea></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="addModal=false">取消</button>
                    <button class="btn btn-primary" @click="addModal=false;showToast('回款记录已提交审批')">提交</button>
                </div>
            </div>
        </div>

        <!-- 详情弹窗 -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>回款详情</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="detail-info">
                        <div class="detail-item"><div class="detail-label">监理编号</div><div class="detail-value">{{ detailModal.ciCode }}</div></div>
                        <div class="detail-item"><div class="detail-label">对方单位</div><div class="detail-value">{{ detailModal.client }}</div></div>
                        <div class="detail-item"><div class="detail-label">项目名称</div><div class="detail-value">{{ detailModal.project }}</div></div>
                        <div class="detail-item"><div class="detail-label">项目经理</div><div class="detail-value">{{ detailModal.manager }}</div></div>
                        <div class="detail-item"><div class="detail-label">回款金额</div><div class="detail-value" style="color:var(--green);font-weight:700;">¥{{ fmtM(detailModal.amount) }}</div></div>
                        <div class="detail-item"><div class="detail-label">回款时间</div><div class="detail-value">{{ detailModal.date }}</div></div>
                        <div class="detail-item"><div class="detail-label">流程状态</div><div class="detail-value"><span class="status" :class="statusClass(detailModal.flowStatus)">{{ detailModal.flowStatus }}</span></div></div>
                        <div class="detail-item"><div class="detail-label">审批结果</div><div class="detail-value"><span class="tag" :class="approvalTag(detailModal.approval)">{{ detailModal.approval }}</span></div></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="detailModal=null">关闭</button></div>
            </div>
        </div>

        <!-- 汇总弹窗 -->
        <div class="modal-overlay" v-if="summaryModal" @click.self="summaryModal=false">
            <div class="modal modal-md">
                <div class="modal-header"><h3>📊 回款汇总</h3><button class="modal-close" @click="summaryModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>监理编号</th><th>合同金额</th><th>已开票</th><th>已回款</th><th>回款率</th></tr></thead>
                            <tbody>
                                <tr><td>CI-2026-001</td><td>580,000</td><td>200,000</td><td>150,000</td><td><span class="tag tag-green">75.0%</span></td></tr>
                                <tr><td>CI-2026-002</td><td>1,200,000</td><td>500,000</td><td>400,000</td><td><span class="tag tag-blue">80.0%</span></td></tr>
                                <tr><td>CI-2026-003</td><td>860,000</td><td>0</td><td>0</td><td><span class="tag tag-orange">0%</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="summaryModal=false">关闭</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 提醒设置 ====================
const ReminderPage = {
  props: ['role'],
  setup(props) {
    const role = Vue.computed(() => props.role);
    const addModal = Vue.ref(false);
    const reminders = [
      { id: 1, type: '开票', typeTag: 'tag-blue', contractType: '人工日', client: '中国石化', ciCode: 'CI-2026-001', overdueDay: 30, freq: '每周', source: '系统', sourceTag: 'tag-cyan', status: '开启' },
      { id: 2, type: '回款', typeTag: 'tag-green', contractType: '总价', client: '中国石油', ciCode: 'CI-2026-002', overdueDay: 60, freq: '每月', source: '用户设置', sourceTag: 'tag-purple', status: '开启' },
      { id: 3, type: '开票', typeTag: 'tag-blue', contractType: '人工日计算总价', client: '中海油', ciCode: 'CI-2026-003', overdueDay: 30, freq: '每3天', source: '系统', sourceTag: 'tag-cyan', status: '关闭' }
    ];

    function toggleStatus(r) {
      r.status = r.status === '开启' ? '关闭' : '开启';
      showToast('提醒已' + r.status + '：' + r.ciCode);
    }

    return { role, addModal, reminders, toggleStatus };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>开票 | 回款提醒设置</h1>
            <span class="role-badge">支持角色：<strong>合同负责人</strong>(权限内) / <strong>财务、管理员</strong>(所有) — 需消息模板管理</span>
        </div>
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同类型</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
                <div class="filter-item"><label>类型</label><select><option>全部</option><option>开票</option><option>回款</option></select></div>
                <div class="filter-item"><label>超期时间</label><input type="number" placeholder="天"></div>
                <div class="filter-item"><label>提醒频率</label><select><option>全部</option><option>每天</option><option>每3天</option><option>每周</option><option>每月</option></select></div>
                <div class="filter-item"><label>来源</label><select><option>全部</option><option>系统</option><option>用户设置</option></select></div>
                <div class="filter-item"><label>状态</label><select><option>全部</option><option>开启</option><option>关闭</option></select></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
                <button class="btn btn-primary" @click="addModal=true">➕ 新增提醒</button>
                <button class="btn btn-outline" @click="showToast('频率字典管理')">⚙️ 频率字典</button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>类型</th><th>合同类型</th><th>委托方</th><th>监理编号</th><th>超期时间(天)</th><th>提醒频率</th><th>来源</th><th>状态</th><th style="min-width:180px">操作</th></tr></thead>
                <tbody>
                    <tr v-for="(r, i) in reminders" :key="r.id">
                        <td>{{ i+1 }}</td><td><span class="tag" :class="r.typeTag">{{ r.type }}</span></td><td>{{ r.contractType }}</td>
                        <td>{{ r.client }}</td><td>{{ r.ciCode }}</td><td>{{ r.overdueDay }}</td><td>{{ r.freq }}</td>
                        <td><span class="tag" :class="r.sourceTag">{{ r.source }}</span></td>
                        <td><span class="status" :class="r.status==='开启'?'status-active':'status-terminated'">{{ r.status }}</span></td>
                        <td>
                            <button class="btn-mini" :class="r.status==='开启'?'btn-warning':'btn-success'" @click="toggleStatus(r)">{{ r.status==='开启'?'关闭':'开启' }}</button>
                            <button class="btn-mini btn-danger" @click="showToast('已删除提醒')">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 新增提醒弹窗 -->
        <div class="modal-overlay" v-if="addModal" @click.self="addModal=false">
            <div class="modal modal-md">
                <div class="modal-header"><h3>新增提醒规则</h3><button class="modal-close" @click="addModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label required">提醒类型</label><select class="form-control"><option>开票</option><option>回款</option></select></div>
                        <div class="form-group"><label class="form-label required">监理编号</label><input class="form-control" placeholder="请输入CI编号"></div>
                        <div class="form-group"><label class="form-label required">超期天数</label><input class="form-control" type="number" value="30"></div>
                        <div class="form-group"><label class="form-label required">提醒频率</label><select class="form-control"><option>每天</option><option>每3天</option><option>每周</option><option>每月</option></select></div>
                        <div class="form-group full"><label class="form-label">通知对象</label><input class="form-control" placeholder="默认为合同负责人(总监代表)"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="addModal=false">取消</button>
                    <button class="btn btn-primary" @click="addModal=false;showToast('提醒规则已创建')">确认创建</button>
                </div>
            </div>
        </div>
    </div>
    `
};

// ==================== 差旅报销台账 ====================
const TravelPage = {
  props: ['role'],
  setup(props) {
    const role = Vue.computed(() => props.role);
    const travels = Vue.ref([
      { id: 1, name: '张三', code: 'CC-20260201-001', days: 5, shareDays: 3, cost: 2400 },
      { id: 2, name: '陈伟', code: 'CC-20260210-002', days: 3, shareDays: 3, cost: 1800 },
      { id: 3, name: '李四', code: 'CC-20260215-003', days: 7, shareDays: 4, cost: 3200 }
    ]);

    function saveTavel(t) { showToast('已保存修改：' + t.name + ' ¥' + t.cost); }

    return { role, travels, saveTavel, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>差旅报销台账</h1>
            <span class="role-badge">权限：每人可导入自己数据 | 调整金额：财务和本人 | <span style="color:var(--blue);">出差天数/分摊天数/差旅成本可直接编辑</span></span>
        </div>
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>出差单编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-success" @click="showToast('请选择Excel文件导入')">📤 导入</button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>姓名</th><th>出差单编号</th><th>出差天数</th><th>分摊天数</th><th>差旅成本(元)</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="(t, i) in travels" :key="t.id">
                        <td>{{ i+1 }}</td><td>{{ t.name }}</td><td>{{ t.code }}</td>
                        <td><input type="number" v-model.number="t.days" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;"></td>
                        <td><input type="number" v-model.number="t.shareDays" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;"></td>
                        <td><input type="number" v-model.number="t.cost" step="0.01" style="width:100px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;"></td>
                        <td><button class="btn-mini btn-success" @click="saveTavel(t)">💾 保存</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);">💡 出差天数、分摊天数和差旅成本列可直接在表格中修改，修改后点击「保存」按钮提交。</div>
    </div>
    `
};

// ==================== 人员工资管理 ====================
const SalaryPage = {
  props: ['role'],
  setup(props) {
    const role = Vue.computed(() => props.role);
    const salaries = [
      { id: 1, account: 'zhangsan', name: '张三', phone: '138****1234', dept: '监造一部', gender: '男' },
      { id: 2, account: 'lisi', name: '李四', phone: '139****5678', dept: '监造一部', gender: '男' },
      { id: 3, account: 'chenwei', name: '陈伟', phone: '137****9012', dept: '监造二部', gender: '男' },
      { id: 4, account: 'wangwu', name: '王五', phone: '136****3456', dept: '监造二部', gender: '男' }
    ];
    return { role, salaries };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>人员工资管理 <small>(敏感数据-密文存储)</small></h1>
            <span class="role-badge">🔐 全权限控制：仅 <strong style="color:var(--red);">财务</strong> 角色可访问本页面</span>
        </div>
        <div style="background:var(--blue-light);border:1px solid rgba(64,158,255,0.2);border-radius:var(--radius);padding:14px 18px;margin-bottom:16px;">
            <h3 style="font-size:13px;margin-bottom:6px;color:var(--blue);">🔒 脱敏规则</h3>
            <div style="font-size:12px;color:var(--text-secondary);">
                工资为敏感项，所有数据密文存储。页面默认显示为 <code>****</code>，导出亦为 <code>****</code>。<br>
                <strong style="color:var(--red);">任何角色均无法点击查看明文工资</strong>，仅可通过导入功能更新工资数据。
            </div>
        </div>
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-success" @click="showToast('请选择工资Excel文件导入')">📤 导入</button>
                <button class="btn btn-outline" @click="doExport('人员工资(工资列为****)')">📥 导出</button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>账号</th><th>姓名</th><th>电话</th><th>部门</th><th>性别</th><th>工资(元/天)</th></tr></thead>
                <tbody>
                    <tr v-for="(s, i) in salaries" :key="s.id">
                        <td>{{ i+1 }}</td><td>{{ s.account }}</td><td>{{ s.name }}</td><td>{{ s.phone }}</td><td>{{ s.dept }}</td><td>{{ s.gender }}</td>
                        <td><span style="color:var(--text-muted);user-select:none;">****</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
};
// ===== comp_5.js — CostPage + ProfitPage + ReportPage + PermissionPage =====

// ==================== 动态成本核算 ====================
const CostPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const personnelModal = Vue.ref(null);
    const travelModal = Vue.ref(null);
    const fixedModal = Vue.ref(null);
    const showFormula = Vue.ref(true);

    function openPersonnel(row) { personnelModal.value = row; }
    function openTravel(row) { travelModal.value = row; }
    function openFixed(row) { fixedModal.value = row; }
    function totalCost(r) { return (r.personnelCost || 0) + (r.travelCost || 0) + (r.fixedCost || 0); }

    return { data, role, personnelModal, travelModal, fixedModal, showFormula, openPersonnel, openTravel, openFixed, totalCost, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>动态成本核算 <small>(动态成本管理-主页)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 点击各项成本跳转二级明细页</span>
        </div>
        <!-- 公式面板 -->
        <div class="formula-panel" style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border-color);" @click="showFormula=!showFormula">
                <span style="font-size:13px;font-weight:600;color:var(--blue);">📐 成本核算公式（封装为工具类统一管理）</span>
                <span>{{ showFormula ? '▾' : '▸' }}</span>
            </div>
            <div v-show="showFormula" style="padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
                <div class="formula-card"><div class="formula-title">人员成本</div><div class="formula-body">个人成本 = 工时 × 单价<br>若同时在N个派单：成本 = (工时÷N) × 单价<br>(保留2位小数)</div></div>
                <div class="formula-card"><div class="formula-title">差旅成本</div><div class="formula-body">按天调整: 总金额÷天数×各CI占天数<br>按金额调整: 总金额÷CI数后手动修改</div></div>
                <div class="formula-card"><div class="formula-title">固定支出</div><div class="formula-body">= 服务人员成本 + 资料费用 + 其他采购费用</div></div>
            </div>
        </div>
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入CI编号"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>监理编号</th><th>合同名称</th><th>总工时(天)</th><th>人员成本(元)</th><th>差旅成本(元)</th><th>固定支出成本(元)</th><th>成本合计(元)</th></tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.name }}</td><td>{{ r.workHours || 0 }}</td>
                        <td><span class="link-text" @click="openPersonnel(r)">{{ fmtM(r.personnelCost) }}</span></td>
                        <td><span class="link-text" @click="openTravel(r)">{{ fmtM(r.travelCost) }}</span></td>
                        <td><span class="link-text" @click="openFixed(r)">{{ fmtM(r.fixedCost) }}</span></td>
                        <td><strong>{{ fmtM(totalCost(r)) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 人员成本明细弹窗 -->
        <div class="modal-overlay" v-if="personnelModal" @click.self="personnelModal=null">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>人员成本明细 — {{ personnelModal.ciCode }}</h3><button class="modal-close" @click="personnelModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>姓名</th><th>工时(天)</th><th>单价(元/天)</th><th>同期项目数</th><th>分摊后工时</th><th>成本(元)</th></tr></thead>
                            <tbody>
                                <tr><td>张三</td><td>34</td><td>****</td><td>1</td><td>34</td><td>****</td></tr>
                                <tr><td>李四</td><td>34</td><td>****</td><td>2</td><td>17</td><td>****</td></tr>
                                <tr><td>陈伟</td><td>34</td><td>****</td><td>2</td><td>17</td><td>****</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">💡 工资单价为密文，仅系统内部参与计算，页面不展示明文。</div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="personnelModal=null">关闭</button></div>
            </div>
        </div>

        <!-- 差旅成本明细弹窗 -->
        <div class="modal-overlay" v-if="travelModal" @click.self="travelModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>差旅成本明细 — {{ travelModal.ciCode }}</h3><button class="modal-close" @click="travelModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>姓名</th><th>出差单号</th><th>出差天数</th><th>分摊天数</th><th>差旅成本(元)</th></tr></thead>
                            <tbody>
                                <tr><td>张三</td><td>CC-20260201-001</td><td>5</td><td>3</td><td>2,400.00</td></tr>
                                <tr><td>陈伟</td><td>CC-20260210-002</td><td>3</td><td>3</td><td>1,800.00</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="travelModal=null">关闭</button></div>
            </div>
        </div>

        <!-- 固定支出明细弹窗 -->
        <div class="modal-overlay" v-if="fixedModal" @click.self="fixedModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>固定支出明细 — {{ fixedModal.ciCode }}</h3><button class="modal-close" @click="fixedModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>费用类型</th><th>金额(元)</th><th>备注</th></tr></thead>
                            <tbody>
                                <tr><td>服务人员成本</td><td>8,000.00</td><td>外聘技术支持</td></tr>
                                <tr><td>资料费用</td><td>3,500.00</td><td>图纸打印、资料归档</td></tr>
                                <tr><td>其他采购费用</td><td>3,500.00</td><td>检测仪器租赁</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="fixedModal=null">关闭</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 利润管理 ====================
const ProfitPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const showAdvFilter = Vue.ref(false);
    const chartVisible = Vue.ref(false);
    const chartRef = Vue.ref(null);
    let chart = null;

    function profitClass(p) { return p > 0 ? 'profit-green' : p < 0 ? 'profit-red' : ''; }
    function showChart(row) {
      chartVisible.value = true;
      nextTick(() => {
        if (chartRef.value) {
          if (chart) chart.dispose();
          chart = echarts.init(chartRef.value);
          chart.setOption({
            title: { text: row.ciCode + ' 利润分析', left: 'center', textStyle: { fontSize: 14 } },
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0 },
            xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
            yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000).toFixed(0) + '万' } },
            series: [
              { name: '产值', type: 'bar', data: [50000, 68000, 75000, 80000, 85000, 90000], color: '#409eff' },
              { name: '成本', type: 'bar', data: [15000, 18000, 20000, 22000, 25000, 28000], color: '#f56c6c' },
              { name: '利润', type: 'line', data: [35000, 50000, 55000, 58000, 60000, 62000], color: '#67c23a', smooth: true }
            ]
          });
        }
      });
    }

    return { data, role, showAdvFilter, chartVisible, chartRef, profitClass, showChart, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>利润管理</h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 利润为负时发送站内(PC+APP)提醒</span>
        </div>
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>项目负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>委托方</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>制造方</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>时间范围</label><input type="month"></div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>利润范围</label><input type="text" placeholder="最小~最大"></div>
                <div class="filter-item"><label>合同形式</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
                <div class="filter-item"><label>合同状态</label><select><option>全部</option><option>进行中</option><option>已完成</option><option>已终止</option></select></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showAdvFilter=!showAdvFilter">⚡ {{ showAdvFilter ? '收起' : '高级查询' }}</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-success" @click="doExport('利润管理')">📥 导出</button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>监理编号</th><th>合同名称</th><th>项目负责人</th><th>委托方</th><th>制造方</th><th>总产值(元)</th><th>总成本(元)</th><th>利润(元)</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.name }}</td><td>{{ r.manager }}</td><td>{{ r.client }}</td><td>{{ r.factory }}</td>
                        <td class="text-right">{{ fmt(r.totalOutput) }}</td><td class="text-right">{{ fmt(r.totalCost) }}</td>
                        <td><span :class="profitClass(r.profit)">{{ r.profit >= 0 ? '+' : '' }}{{ fmt(r.profit) }}{{ r.profit < 0 ? ' ⚠️' : '' }}</span></td>
                        <td><button class="btn-mini btn-primary" @click="showChart(r)">📊 报表分析</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ECharts 图表区 -->
        <div v-if="chartVisible" style="margin-top:16px;">
            <div style="background:var(--bg-card);border-radius:var(--radius);padding:20px;border:1px solid var(--border-color);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="font-size:15px;">📊 利润分析可视化</h3>
                    <button class="btn btn-outline" @click="chartVisible=false">关闭</button>
                </div>
                <div ref="chartRef" style="width:100%;height:400px;"></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 经营数据量化 ====================
const ReportPage = {
  props: ['role'],
  setup(props) {
    const role = Vue.computed(() => props.role);
    const activeTab = Vue.ref('personnel');

    return { role, activeTab };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>经营数据量化</h1>
            <span class="role-badge">系统自动生成报表，支持自定义筛选和字段列</span>
        </div>
        <div class="tab-bar">
            <button class="tab-btn" :class="{active:activeTab==='personnel'}" @click="activeTab='personnel'">👤 监理人员报表</button>
            <button class="tab-btn" :class="{active:activeTab==='contract'}" @click="activeTab='contract'">📋 合同报表</button>
        </div>

        <!-- 人员报表 -->
        <div v-show="activeTab==='personnel'">
            <div class="filter-panel">
                <div class="filter-row">
                    <div class="filter-item"><label>辅助人员</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>时间范围</label><select><option>2026年</option><option>2025年</option><option>自定义</option></select></div>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                    <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                    <button class="btn btn-success" @click="doExport('监理人员报表')">📥 导出Excel</button>
                </div>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>#</th><th>姓名</th><th>总工时(天)</th><th>参与项目数</th><th>总产值(元)</th><th>总成本(元)</th><th>利润(元)</th><th>人均产值</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>张三</td><td>64</td><td>2</td><td>160,000</td><td>36,800</td><td class="profit-green">+123,200</td><td>2,500</td></tr>
                        <tr><td>2</td><td>李四</td><td>34</td><td>1</td><td>85,000</td><td>22,100</td><td class="profit-green">+62,900</td><td>2,500</td></tr>
                        <tr><td>3</td><td>陈伟</td><td>34</td><td>1</td><td>85,000</td><td>30,600</td><td class="profit-green">+54,400</td><td>2,500</td></tr>
                        <tr><td>4</td><td>王五</td><td>30</td><td>1</td><td>75,000</td><td>18,000</td><td class="profit-green">+57,000</td><td>2,500</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 合同报表 -->
        <div v-show="activeTab==='contract'">
            <div class="filter-panel">
                <div class="filter-row">
                    <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>合同类型</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
                    <div class="filter-item"><label>时间范围</label><input type="month"></div>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                    <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                    <button class="btn btn-success" @click="doExport('合同报表')">📥 导出Excel</button>
                </div>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>#</th><th>监理编号</th><th>合同名称</th><th>合同类型</th><th>合同金额</th><th>总产值</th><th>总成本</th><th>利润</th><th>开票总金额</th><th>收款总金额</th><th>利润率</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>CI-2026-001</td><td>某石化换热器监造</td><td><span class="tag tag-blue">人工日</span></td><td>580,000</td><td>338,800</td><td>85,500</td><td class="profit-green">+253,300</td><td>200,000</td><td>150,000</td><td><strong>74.8%</strong></td></tr>
                        <tr><td>2</td><td>CI-2026-002</td><td>压力容器制造监理</td><td><span class="tag tag-green">总价</span></td><td>1,200,000</td><td>500,000</td><td>8,000</td><td class="profit-green">+492,000</td><td>500,000</td><td>400,000</td><td><strong>98.4%</strong></td></tr>
                        <tr><td>3</td><td>CI-2026-003</td><td>管道安装监造项目</td><td><span class="tag tag-purple">人工日计算总价</span></td><td>860,000</td><td>0</td><td>45,200</td><td class="profit-red">-45,200</td><td>0</td><td>0</td><td class="text-danger"><strong>-∞</strong></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
};

// ==================== 权限分配 ====================
const PermissionPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const role = Vue.computed(() => props.role);
    const activePM = Vue.ref('李明');
    const assignModal = Vue.ref(false);

    const pmList = [
      { name: '李明', contracts: ['CI-2026-001', 'CI-2026-003', 'CI-2026-005'] },
      { name: '王芳', contracts: ['CI-2026-002', 'CI-2026-004'] },
      { name: '陈伟', contracts: ['CI-2026-003', 'CI-2026-006', 'CI-2026-007', 'CI-2026-008'] },
      { name: '赵丽', contracts: ['CI-2026-009'] }
    ];

    const currentPM = Vue.computed(() => pmList.find(p => p.name === activePM.value) || pmList[0]);
    const assignedContracts = Vue.computed(() => {
      const all = [
        { ciCode: 'CI-2026-001', name: '某石化换热器监造', form: '人工日', amount: 580000 },
        { ciCode: 'CI-2026-002', name: '压力容器制造监理', form: '总价', amount: 1200000 },
        { ciCode: 'CI-2026-003', name: '管道安装监造项目', form: '人工日计算总价', amount: 860000 },
        { ciCode: 'CI-2026-004', name: '锅炉联箱焊接监理', form: '人工日', amount: 320000 },
        { ciCode: 'CI-2026-005', name: '管道安装监造项目', form: '人工日计算总价', amount: 860000 },
      ];
      return all.filter(c => currentPM.value.contracts.includes(c.ciCode));
    });

    function selectPM(name) { activePM.value = name; }
    function formTag(f) { return f === '人工日' ? 'tag-blue' : f === '总价' ? 'tag-green' : 'tag-purple'; }
    function unassign(ciCode) { showToast('已取消分配 ' + ciCode + ' 给 ' + activePM.value); }

    return { data, role, activePM, assignModal, pmList, currentPM, assignedContracts, selectPM, formTag, unassign, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>项目经理权限分配</h1>
            <span class="role-badge">支持角色：<strong>管理员</strong></span>
        </div>
        <div class="permission-layout">
            <div class="perm-left">
                <h3>项目经理列表</h3>
                <div style="margin-bottom:12px;"><input type="text" placeholder="🔍 搜索项目经理..." style="width:100%;padding:8px 10px;border:1px solid var(--border-color);border-radius:6px;font-size:13px;"></div>
                <div class="perm-list">
                    <div class="perm-item" :class="{active: activePM===pm.name}" v-for="pm in pmList" :key="pm.name" @click="selectPM(pm.name)">
                        <div class="avatar-sm">{{ pm.name.charAt(0) }}</div><span>{{ pm.name }}</span><span class="perm-count">{{ pm.contracts.length }}个合同</span>
                    </div>
                </div>
            </div>
            <div class="perm-right">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3>已分配合同 — <span style="color:var(--blue)">{{ activePM }}</span></h3>
                    <button class="btn btn-primary" @click="assignModal=true">➕ 分配合同</button>
                </div>
                <div class="perm-contracts">
                    <div class="perm-contract-item" v-for="c in assignedContracts" :key="c.ciCode">
                        <span style="font-weight:600;min-width:100px;">{{ c.ciCode }}</span>
                        <span>{{ c.name }}</span>
                        <span class="tag" :class="formTag(c.form)">{{ c.form }}</span>
                        <span>¥{{ fmtM(c.amount) }}</span>
                        <button class="btn-mini btn-danger" @click="unassign(c.ciCode)">取消分配</button>
                    </div>
                    <div v-if="!assignedContracts.length" style="text-align:center;padding:30px;color:var(--text-muted);">暂无分配合同</div>
                </div>
            </div>
        </div>

        <!-- 分配合同弹窗 -->
        <div class="modal-overlay" v-if="assignModal" @click.self="assignModal=false">
            <div class="modal modal-md">
                <div class="modal-header"><h3>分配合同给 {{ activePM }}</h3><button class="modal-close" @click="assignModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group full"><label class="form-label required">选择合同</label>
                            <select class="form-control">
                                <option>CI-2026-010 — 新能源设备监造</option>
                                <option>CI-2026-011 — 核电管道检测</option>
                                <option>CI-2026-012 — 风电设备监理</option>
                            </select>
                        </div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" placeholder="分配备注"></textarea></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="assignModal=false">取消</button>
                    <button class="btn btn-primary" @click="assignModal=false;showToast('已分配合同给 '+activePM)">确认分配</button>
                </div>
            </div>
        </div>
    </div>
    `
};
