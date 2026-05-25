// ===== 全局工具与组件配置 =====
const { createApp, ref, computed, reactive, onMounted, onUnmounted, nextTick, watch, toRefs } = Vue;

// 工具函数
function fmt(n) { if (n == null || n === '') return '—'; return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 0 }); }
function fmtM(n) { if (n == null) return '—'; return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtW(n) { if (n == null) return '—'; return (Number(n) / 10000).toFixed(2) + ' 万'; }
function fmtPct(n) { if (n == null) return '—'; return Number(n).toFixed(1) + '%'; }

const toastList = ref([]);
function showToast(msg, type = 'info') {
    const id = Date.now();
    toastList.value.push({ id, msg, type });
    setTimeout(() => { toastList.value = toastList.value.filter(t => t.id !== id); }, 3000);
}
function doExport(name) { showToast('正在全量导出【' + name + '】核算底稿...', 'success'); }

// ==================== Dashboard ====================
const DashboardPage = {
    props: ['role', 'contracts', 'incomeData', 'costData', 'profitData'],
    setup(props) {
        const data = props.contracts || [];
        const role = props.role;
        const totalContract = computed(() => data.length);
        const totalAmount = computed(() => data.reduce((s, c) => s + (c.amount || 0), 0));
        const activeCount = computed(() => data.filter(c => c.status === '进行中').length);
        const doneCount = computed(() => data.filter(c => c.status === '已完成').length);
        const totalInvoice = computed(() => (props.incomeData || []).reduce((s, r) => s + (r.invoiced || 0), 0));
        const totalPayment = computed(() => (props.incomeData || []).reduce((s, r) => s + (r.received || 0), 0));
        const totalCost = computed(() => (props.costData || []).reduce((s, r) => s + (r.personnelCost || 0) + (r.travelCost || 0) + (r.fixedCost || 0), 0));
        const totalProfit = computed(() => totalAmount.value - totalCost.value);

        const chartRef1 = ref(null);
        const chartRef2 = ref(null);
        let chart1 = null, chart2 = null;

        onMounted(() => {
            nextTick(() => {
                if (chartRef1.value && typeof echarts !== 'undefined') {
                    chart1 = echarts.init(chartRef1.value);
                    chart1.setOption({
                        title: { text: '合同产值分布', textStyle: { fontSize: 13 }, left: 'center' },
                        tooltip: { trigger: 'item', formatter: '{b}: ¥{c}万' },
                        series: [{ type: 'pie', radius: ['40%', '70%'], data: data.map(c => ({ name: c.name, value: (c.amount / 10000).toFixed(2) })) }]
                    });
                }
                if (chartRef2.value && typeof echarts !== 'undefined') {
                    chart2 = echarts.init(chartRef2.value);
                    chart2.setOption({
                        title: { text: '合同 vs 利润(万)', textStyle: { fontSize: 13 } },
                        tooltip: { trigger: 'axis' },
                        xAxis: { type: 'category', data: data.map(c => c.ciCode) },
                        yAxis: { type: 'value' },
                        series: [
                            { type: 'bar', name: '合同额', data: data.map(c => (c.amount / 10000).toFixed(2)) },
                            { type: 'line', name: '预估利润', data: data.map(c => (c.amount * 0.4 / 10000).toFixed(2)) }
                        ]
                    });
                }
            });
        });

        const warnings = [
            { type: 'danger', icon: '🔴', title: 'CI-2024-004 利润为负', desc: '该管道监造项目当期核算亏损 -45,200 元' },
            { type: 'warning', icon: '🟡', title: '待开票超期提醒', desc: 'CI-2026-001 超过30天未开票' },
            { type: 'info', icon: '🔵', title: '大额回款到账', desc: '收到回款 ¥400,000，财务审批完毕' }
        ];

        return { role, totalContract, totalAmount, activeCount, doneCount, totalInvoice, totalPayment, totalCost, totalProfit, chartRef1, chartRef2, warnings, fmt, fmtW, fmtM };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>🖥️ 经营战情中心(大盘)</h1>
            <span class="role-badge">系统全局视图：<strong>{{ role }}</strong></span>
        </div>

        <div class="dash-metrics">
            <div class="dash-metric blue">
                <div class="dash-metric-label">履约合同数</div>
                <div class="dash-metric-value">{{ totalContract }}</div>
                <div class="dash-metric-sub">进行中 {{ activeCount }} | 已完成 {{ doneCount }}</div>
            </div>
            <div class="dash-metric purple">
                <div class="dash-metric-label">合同总金额</div>
                <div class="dash-metric-value">{{ fmtW(totalAmount) }}</div>
                <div class="dash-metric-sub">¥{{ fmtM(totalAmount) }}</div>
            </div>
            <div class="dash-metric green">
                <div class="dash-metric-label">累计确认资金池</div>
                <div class="dash-metric-value">{{ fmtW(totalPayment) }}</div>
                <div class="dash-metric-sub">开票 {{ fmtW(totalInvoice) }}</div>
            </div>
            <div class="dash-metric orange">
                <div class="dash-metric-label">动态成本摊销池</div>
                <div class="dash-metric-value">{{ fmtW(totalCost) }}</div>
                <div class="dash-metric-sub">本/异地双向聚合支出</div>
            </div>
            <div class="dash-metric" :class="totalProfit >= 0 ? 'green' : 'red'">
                <div class="dash-metric-label">当期边际利润总额</div>
                <div class="dash-metric-value">{{ totalProfit >= 0 ? '+' : '' }}{{ fmtW(totalProfit) }}</div>
                <div class="dash-metric-sub">综合毛利 {{ totalAmount ? fmtPct(totalProfit / totalAmount * 100) : '—' }}</div>
            </div>
        </div>

        <div class="dash-grid-2">
            <div class="chart-card"><div class="chart-container" ref="chartRef1"></div></div>
            <div class="chart-card"><div class="chart-container" ref="chartRef2"></div></div>
        </div>

        <div class="chart-card">
            <div class="chart-card-title">⚠️ 全局风险阻断 / 警报引擎拦截</div>
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
