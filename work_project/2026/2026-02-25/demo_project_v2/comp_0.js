// ===== comp_0.js — 全局工具 + DashboardPage =====
const { createApp, ref, computed, reactive, onMounted, onUnmounted, nextTick, watch, toRefs } = Vue;

// ===== 全局工具函数 =====
function fmt(n) { if (n === null || n === undefined || n === '') return '—'; return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 0 }); }
function fmtM(n) { if (n === null || n === undefined) return '—'; return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtW(n) { if (n === null || n === undefined) return '—'; return (Number(n) / 10000).toFixed(2) + ' 万'; }
function fmtPct(n) { if (n === null || n === undefined) return '—'; return Number(n).toFixed(1) + '%'; }

// Toast 通知系统
const toastList = ref([]);
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
        const totalContract = computed(() => (data || []).length);
        const totalAmount = computed(() => (data || []).reduce((s, c) => s + (c.amount || 0), 0));
        const activeCount = computed(() => (data || []).filter(c => c.status === '进行中').length);
        const doneCount = computed(() => (data || []).filter(c => c.status === '已完成').length);
        const totalInvoice = computed(() => (props.incomeData || []).reduce((s, r) => s + (r.invoiced || 0), 0));
        const totalPayment = computed(() => (props.incomeData || []).reduce((s, r) => s + (r.received || 0), 0));
        const totalCost = computed(() => (props.costData || []).reduce((s, r) => s + (r.personnelCost || 0) + (r.travelCost || 0) + (r.fixedCost || 0), 0));
        const totalProfit = computed(() => totalAmount.value - totalCost.value);

        // ECharts
        const chartRef1 = ref(null);
        const chartRef2 = ref(null);
        let chart1 = null, chart2 = null;

        onMounted(() => {
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
