// ===================================================================
// 此文件为自动化生成的组件大全，包含所有页面的Vue结构和细化弹窗(全量V1还原版)
// ===================================================================

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


// ==================== 合同台账 ====================
const ContractPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, computed } = Vue;
        const data = computed(() => props.data || []);
        const search = ref({ ciCode: '', name: '', client: '', factory: '', form: '全部', pm: '', dateStart: '', dateEnd: '', status: '全部' });
        const showAdvFilter = ref(false);

        const filtered = computed(() => {
            return data.value.filter(c => {
                if(search.value.ciCode && !c.ciCode.includes(search.value.ciCode)) return false;
                if(search.value.name && !c.name.includes(search.value.name)) return false;
                if(search.value.client && !c.client.includes(search.value.client)) return false;
                if(search.value.factory && !c.factory.includes(search.value.factory)) return false;
                if(search.value.form !== '全部' && c.contractForm !== search.value.form) return false;
                if(search.value.status !== '全部' && c.status !== search.value.status) return false;
                return true;
            });
        });

        const detailModal = ref(null);
        function openDetail(c) { detailModal.value = c; }
        
        const terminateModal = ref(null);
        const terminateForm = ref({ reason: '', date: '' });
        function openTerminate(c) { 
            terminateForm.value = { reason: '', date: '' };
            terminateModal.value = c; 
        }
        function submitTerminate() {
            if(!terminateForm.value.reason || !terminateForm.value.date) return showToast('请填写完整','error');
            showToast('已发起终止审批流程');
            terminateModal.value = null;
        }

        const cancelTerminateModal = ref(null);
        const cancelTerminateForm = ref({ reason: '', date: '' });
        function openCancelTerminate(c) {
            cancelTerminateForm.value = { reason: '', date: '' };
            cancelTerminateModal.value = c;
        }
        function submitCancelTerminate() {
            if(!cancelTerminateForm.value.reason || !cancelTerminateForm.value.date) return showToast('请填写完整','error');
            showToast('取消终止审批流程已发起');
            cancelTerminateModal.value = null;
        }

        return { data, search, showAdvFilter, filtered, detailModal, openDetail, terminateModal, terminateForm, openTerminate, submitTerminate, cancelTerminateModal, cancelTerminateForm, openCancelTerminate, submitCancelTerminate, fmt, fmtM };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>合同台账</h1>
            <div class="role-badge">当前角色：<strong>{{ role }}</strong> — 查看分配的合同号(CI编号)数据</div>
        </div>

        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" v-model="search.ciCode"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" v-model="search.name"></div>
                <div class="filter-item"><label>委托方</label><input type="text" v-model="search.client"></div>
                <div class="filter-item"><label>制作方</label><input type="text" v-model="search.factory"></div>
                <div class="filter-item"><label>合同形式</label>
                    <select v-model="search.form"><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select>
                </div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>项目负责人</label><input type="text" v-model="search.pm"></div>
                <div class="filter-item"><label>合同起始</label><input type="date" v-model="search.dateStart"></div>
                <div class="filter-item"><label>合同终止</label><input type="date" v-model="search.dateEnd"></div>
                <div class="filter-item"><label>状态</label>
                    <select v-model="search.status"><option>全部</option><option>进行中</option><option>已完成</option><option>已终止</option></select>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showAdvFilter = !showAdvFilter">⚡ {{ showAdvFilter?'收起':'高级' }}</button>
                <button class="btn btn-success" @click="doExport('合同台账')">📥 导出</button>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同名称</th><th>设备名称</th><th>委托方</th><th>制造方</th>
                    <th>监造金额(元)</th><th>合同形式</th><th>项目编号</th><th>项目名称</th><th>状态</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(c,i) in filtered" :key="c.ciCode">
                        <td>{{ i+1 }}</td>
                        <td><span class="link-text" @click="openDetail(c)">{{ c.ciCode }}</span></td>
                        <td>{{ c.name }}</td><td>{{ c.ciCode==='CI-2026-001'?'管壳式换热器':(c.ciCode==='CI-2026-002'?'压力容器':'工业管道') }}</td>
                        <td>{{ c.client }}</td><td>{{ c.factory }}</td>
                        <td class="text-right">{{ fmtM(c.amount) }}</td>
                        <td><span class="tag" :class="c.contractForm==='人工日'?'tag-blue':c.contractForm==='总价'?'tag-green':'tag-purple'">{{ c.contractForm }}</span></td>
                        <td>PRJ-00{{ i+1 }}</td><td>{{ c.name.slice(0,4) }}项目</td>
                        <td><span class="status" :class="c.status==='进行中'?'status-active':c.status==='已完成'?'status-done':'status-terminated'">{{ c.status }}</span></td>
                        <td>
                            <button class="btn-mini btn-primary" @click="openDetail(c)">查看</button>
                            <button class="btn-mini btn-warning" v-if="c.status==='进行中'" @click="openTerminate(c)">终止</button>
                            <button class="btn-mini btn-success" v-if="c.status==='已终止'" @click="openCancelTerminate(c)">取消终止</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 详情弹窗 18个字段对齐V1 -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-xl" style="max-width:1100px;">
                <div class="modal-header"><h3>合同详情 - {{ detailModal.ciCode }}</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group"><label class="form-label">监理编号</label><input class="form-control" disabled :value="detailModal.ciCode"></div>
                    <div class="form-group"><label class="form-label">合同名称</label><input class="form-control" disabled :value="detailModal.name"></div>
                    <div class="form-group"><label class="form-label">设备名称</label><input class="form-control" disabled :value="detailModal.ciCode==='CI-2026-001'?'管壳式换热器':(detailModal.ciCode==='CI-2026-002'?'压力容器':'工业管道')"></div>
                    <div class="form-group"><label class="form-label">委托方</label><input class="form-control" disabled :value="detailModal.client"></div>
                    <div class="form-group"><label class="form-label">制造方</label><input class="form-control" disabled :value="detailModal.factory"></div>
                    <div class="form-group"><label class="form-label">监造金额(元)</label><input class="form-control" disabled :value="fmtM(detailModal.amount)"></div>
                    <div class="form-group"><label class="form-label">预给号时间</label><input class="form-control" disabled value="2026-01-10"></div>
                    <div class="form-group"><label class="form-label">项目负责人</label><input class="form-control" disabled value="李明"></div>
                    <div class="form-group"><label class="form-label">合同签订时间</label><input class="form-control" disabled value="2026-01-15"></div>
                    <div class="form-group"><label class="form-label">合同原件返回时间</label><input class="form-control" disabled value="2026-01-25"></div>
                    <div class="form-group"><label class="form-label">合同起始日期</label><input class="form-control" disabled value="2026-01-20"></div>
                    <div class="form-group"><label class="form-label">合同终止日期</label><input class="form-control" disabled value="2026-12-31"></div>
                    <div class="form-group"><label class="form-label">委托方联系人</label><input class="form-control" disabled value="张经理"></div>
                    <div class="form-group"><label class="form-label">合同形式</label><input class="form-control" disabled :value="detailModal.contractForm"></div>
                    <div class="form-group"><label class="form-label">ERP录入情况</label><input class="form-control" disabled value="已录入"></div>
                    <div class="form-group"><label class="form-label">项目编号</label><input class="form-control" disabled value="PRJ-001"></div>
                    <div class="form-group"><label class="form-label">项目名称</label><input class="form-control" disabled :value="detailModal.name + '项目'"></div>
                    <div class="form-group full"><label class="form-label">合同特殊情况备注</label><textarea class="form-control" disabled>中石化重点项目，需配合甲方年度审计</textarea></div>
                    
                    <div class="form-group full" v-if="detailModal.status==='已终止'" style="padding:12px;background:var(--orange-light);border-radius:8px;border:1px solid rgba(230,162,60,0.3)">
                        <h4 style="font-size:13px;color:var(--orange);margin-bottom:8px">📋 取消终止申请记录</h4>
                        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8">
                            <div><strong>发起人：</strong>张三 | <strong>时间：</strong>2026-02-20</div>
                            <div><strong>终止原因：</strong>客户要求关闭</div>
                            <div><strong>预估恢复时间：</strong>2026-03-01</div>
                            <div><strong>审批状态：</strong><span class="status status-done">已通过</span></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="detailModal=null">关闭</button></div>
            </div>
        </div>

        <!-- 终止申请弹窗 -->
        <div class="modal-overlay" v-if="terminateModal" @click.self="terminateModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>终止申请 - {{ terminateModal.ciCode }}</h3><button class="modal-close" @click="terminateModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-group full"><label class="form-label required">终止原因</label><textarea class="form-control" v-model="terminateForm.reason"></textarea></div>
                    <div class="form-group full"><label class="form-label required">申请终止日期</label><input type="date" class="form-control" v-model="terminateForm.date"></div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="terminateModal=null">取消</button><button class="btn btn-primary" @click="submitTerminate">发起审批</button></div>
            </div>
        </div>
        
        <!-- 取消终止申请弹窗 -->
        <div class="modal-overlay" v-if="cancelTerminateModal" @click.self="cancelTerminateModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>取消终止申请 - {{ cancelTerminateModal.ciCode }}</h3><button class="modal-close" @click="cancelTerminateModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-group full"><label class="form-label required">取消原因</label><textarea class="form-control" v-model="cancelTerminateForm.reason"></textarea></div>
                    <div class="form-group full"><label class="form-label required">预估恢复日期</label><input type="date" class="form-control" v-model="cancelTerminateForm.date"></div>
                    <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue);margin-top:12px;">💡 提交后将发起审批流程，通过后合同状态恢复为进行中</div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="cancelTerminateModal=null">取消</button><button class="btn btn-primary" @click="submitCancelTerminate">发起审批</button></div>
            </div>
        </div>
    </div>
    `
};


// ==================== 项目收入 ====================
const IncomePage = {
    props: ['role', 'contracts', 'data'],
    setup(props) {
        const { ref, reactive, computed } = Vue;
        const data = computed(() => props.data || []);

        const showFormula = ref(true);
        const reportModal = ref(null);
        const reportForm = reactive({ period: '', systemVal: 0, amount: 0, remark: '' });
        function openReport(r) {
            reportForm.period = '2026-02';
            reportForm.systemVal = r.monthOutput || 0;
            reportForm.amount = r.monthConfirmed || 0;
            reportForm.remark = '';
            reportModal.value = r;
        }
        function submitReport() { showToast('确认产值填报已发起审批'); reportModal.value = null; }

        const correctModal = ref(null);
        const correctItems = reactive([
            { selected: true, pdCode: 'PD-20260115-01', pdStatus: '进行中', type: '驻厂', name: '李明', client: '中国石化', factory: '东方锅炉', totalHours: 158, effectiveHours: 120, pct: '100%', baseAmt: 300, coef: 1.2, cost: 43200, output: 86400 }
        ]);
        const correctForm = reactive({ amount: 0, rootReason: '', rootSrcCode: '' });
        function openCorrect(r) { correctForm.amount = 0; correctForm.rootReason = ''; correctForm.rootSrcCode = ''; correctModal.value = r; }
        function submitCorrect() { showToast('收入纠正申请已挂账处理'); correctModal.value = null; }
        const correctTotal = computed(() => correctItems.filter(i => i.selected).reduce((sum, i) => sum + i.output, 0));

        const invoiceModal = ref(null);
        const invoiceForm = reactive({ date: '', reason: '', remark: '' });
        function openInvoice(r) { invoiceModal.value = r; invoiceForm.date = ''; invoiceForm.reason = ''; invoiceForm.remark = ''; }
        function submitInvoice() { showToast('开票信息已保存'); invoiceModal.value = null; }

        const receiptModal = ref(null);
        const receiptForm = reactive({ planDate: '', planAmt: 0, actualDate: '', actualAmt: 0, remark: '' });
        function openReceipt(r) { receiptModal.value = r; receiptForm.planDate = ''; receiptForm.planAmt = ''; receiptForm.actualDate = ''; receiptForm.actualAmt = ''; receiptForm.remark = ''; }
        function submitReceipt() { showToast('回款信息已保存'); receiptModal.value = null; }

        const historyModal = ref(null);
        const histTab = ref('output');
        function openHistory(r) { historyModal.value = r; }

        const globalHistoryModal = ref(false);
        const glTab = ref('output');

        return {
            data, showFormula, reportModal, reportForm, openReport, submitReport,
            correctModal, correctForm, correctItems, correctTotal, openCorrect, submitCorrect,
            invoiceModal, invoiceForm, openInvoice, submitInvoice,
            receiptModal, receiptForm, openReceipt, submitReceipt,
            historyModal, histTab, openHistory, globalHistoryModal, glTab, fmt, fmtM
        };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>项目收入汇总 <small>(包含产值核算/收入纠正/开票与回款)</small></h1>
            <div style="display:flex;align-items:center;gap:12px;">
                <span class="role-badge">当前角色：<strong>{{ role }}</strong></span>
                <button class="btn btn-outline" style="background:#4b5563;color:#fff;border:none;" @click="globalHistoryModal=true">📜 领导层查看系统全部历史流转</button>
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
                <div class="formula-card"><div class="formula-title">已报收入纠正法</div><div class="formula-body">当实际开票与理论产值有差额时，提供14列明细表，勾选历史产值底表进行按金额抵冲</div></div>
            </div>
        </div>

        <div class="table-wrapper" style="overflow-x:auto;">
            <table class="data-table" style="min-width:1800px;">
                <thead><tr>
                    <th style="width:40px">#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>合同类型</th>
                    <th>合同金额(元)</th><th>当月产值(元)</th><th style="color:var(--orange)">当月纠正金额(元)</th>
                    <th style="color:var(--blue)">确认当月产值(元)</th><th>当月开票金额(元)</th><th>累计已开票金额(元)</th>
                    <th>累计回款金额(元)</th><th>业务操作</th><th style="min-width:300px;text-align:center;">财务操作(填报)</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="r.ciCode">
                        <td>{{ i+1 }}</td><td><strong>{{ r.ciCode }}</strong></td><td>{{ r.name }}</td><td>{{ r.client }}</td>
                        <td><span class="tag" :class="r.contractForm==='人工日'?'tag-blue':r.contractForm==='总价'?'tag-green':'tag-purple'">{{ r.contractForm }}</span></td>
                        <td class="text-right">{{ fmtM(r.contractAmount) }}</td><td class="text-right">{{ fmtM(r.monthOutput) }}</td>
                        <td class="text-right font-bold text-warning">{{ r.ciCode==='CI-2024-001' ? '-5,000.00' : '0.00' }}</td>
                        <td class="text-right font-bold text-primary">{{ fmtM(r.monthConfirmed) }}</td>
                        <td class="text-right">{{ fmtM(r.invoiced) }}</td><td class="text-right">{{ fmtM(r.reportedIncome) }}</td>
                        <td class="text-right">{{ fmtM(r.received) }}</td>
                        <td class="text-center"><span class="link-text" @click="openHistory(r)">查看详细历史</span></td>
                        <td style="text-align:center;">
                            <button class="btn-mini btn-primary" @click="openReport(r)">产值填报</button>
                            <button class="btn-mini btn-warning" style="margin:0 4px;" @click="openCorrect(r)">收入纠正</button>
                            <button class="btn-mini btn-info" @click="openInvoice(r)" title="开票信息填报">开票</button>
                            <button class="btn-mini btn-success" style="margin-left:4px;" @click="openReceipt(r)" title="回款信息填报">回款</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 产值填报弹窗 -->
        <div class="modal-overlay" v-if="reportModal" @click.self="reportModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>最终收入产值填报及确认 - {{ reportModal.ciCode }}</h3><button class="modal-close" @click="reportModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div class="form-group"><label class="form-label">监理编号</label><input class="form-control" disabled :value="reportModal.ciCode"></div>
                        <div class="form-group"><label class="form-label">合同类型</label><input class="form-control" disabled :value="reportModal.contractForm"></div>
                        <div class="form-group"><label class="form-label">合同金额(元)</label><input class="form-control" disabled :value="fmtM(reportModal.contractAmount)"></div>
                        <div class="form-group"><label class="form-label">确认总产值(元)</label><input class="form-control" disabled value="310,000.00"></div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">账期(年月)</label><input class="form-control" type="month" v-model="reportForm.period"></div>
                        <div class="form-group"><label class="form-label">系统理论产值计算结果(元)</label><input class="form-control" disabled :value="fmtM(reportForm.systemVal)"></div>
                        <div class="form-group full"><label class="form-label required">本期确认产值收入(元)</label><input class="form-control" type="number" v-model.number="reportForm.amount"></div>
                        <div class="form-group full"><label class="form-label">偏差偏离说明及备注</label><textarea class="form-control" v-model="reportForm.remark" placeholder="若确认产值与理论值不同，请说明原因"></textarea></div>
                    </div>
                    <div v-if="reportForm.amount && reportForm.systemVal && Math.abs(reportForm.amount - reportForm.systemVal) / reportForm.systemVal > 0.1" style="margin-top:12px;padding:10px 14px;background:var(--orange-light);border-radius:6px;font-size:12px;color:var(--orange);">
                        🔥 系统检测到超出 ±10% 容忍红线：当前偏离度较高，提交后自动触发部门总监审批流程，通过后入账。
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="reportModal=null">暂存</button><button class="btn btn-primary" @click="submitReport">提交审批</button></div>
            </div>
        </div>

        <!-- 收入纠正弹窗 (14列全量) -->
        <div class="modal-overlay" v-if="correctModal" @click.self="correctModal=null" style="z-index:999;">
            <div class="modal modal-xl" style="width:96vw;max-width:1400px;top:2vh;height:95vh;display:flex;flex-direction:column;">
                <div class="modal-header" style="flex-shrink:0;">
                    <h3>当月收入纠正转移单据 (财务) - {{ correctModal.ciCode }}</h3>
                    <button class="modal-close" @click="correctModal=null">✕</button>
                </div>
                <div class="modal-body" style="flex:1;overflow-y:auto;padding:24px;">
                    <div style="background:#fff3e0;padding:14px;border-left:4px solid var(--orange);border-radius:6px;margin-bottom:16px;font-size:13px;line-height:1.6;">
                        ⚠️ <strong>纠正操作警告：</strong> 此接口针对因跨项目错登、特殊考勤扣款、异常报销抵扣引发的已产生系统产值的账目追溯与平帐。<br>
                        必须在下方14列核算底表中<strong>勾选需要扣减的基础数据行</strong>，并在表单中输入纠正金额和<strong>来源监理编号</strong>。此纠正值后续必须有相应发票抵冲！
                    </div>

                    <div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;margin-bottom:24px;">
                        <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);">
                            <h4 style="margin:0;font-size:14px;font-weight:600;">📋 【历史】人员派单产值明细底帐 (14维度核算宽表)</h4>
                        </div>
                        <div style="overflow-x:auto;">
                            <table class="data-table" style="min-width:1400px;margin:0;">
                                <thead style="background:#f1f5f9;"><tr>
                                    <th style="width:50px;text-align:center;">勾选</th>
                                    <th>派单编号</th><th>单据状态</th><th>监造形式</th><th>涉及人员</th>
                                    <th>制造厂区</th><th>汇总工时</th><th>有效折抵工时(天)</th><th>该时段排班占比</th>
                                    <th>定额单价(基数)</th><th>浮动系数乘子</th><th style="color:var(--text-danger);">倒算成本(元)</th>
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
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style="background:#fff;border:1px solid var(--border-color);border-radius:8px;padding:24px;">
                        <h4 style="margin:0 0 16px 0;font-size:15px;border-left:4px solid var(--blue);padding-left:10px;">📉 设置实际纠偏(修正)额度与流向单据</h4>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
                            <div class="form-group"><label class="form-label text-muted">选中原始基础额合规汇总(元)</label><input class="form-control" disabled :value="fmtM(correctTotal)" style="background:#f1f5f9;color:#0f172a;font-weight:bold;font-size:16px;"></div>
                            <div class="form-group"><label class="form-label required">纠正金额增减(元)</label><input class="form-control" type="number" v-model.number="correctForm.amount" placeholder="如 -2000" style="font-size:16px;border-color:var(--orange);"></div>
                            <div class="form-group"><label class="form-label required">来源监理编号 (必填)</label><input class="form-control" type="text" v-model="correctForm.rootSrcCode" placeholder="如 CI-2026-002"></div>
                            <div class="form-group" style="grid-column: span 3;"><label class="form-label required">纠偏原因 (审计必填)</label><textarea class="form-control" v-model="correctForm.rootReason" rows="3" placeholder="例如：由跨项目工时调整引发"></textarea></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="flex-shrink:0;padding:16px 24px;">
                    <button class="btn btn-outline" @click="correctModal=null" style="padding:10px 20px;">放弃修改</button>
                    <button class="btn btn-warning" @click="submitCorrect" :disabled="!correctForm.amount || !correctForm.rootReason || !correctForm.rootSrcCode" style="padding:10px 20px;">✓ 确认账目冲销</button>
                </div>
            </div>
        </div>

        <!-- 开票填报弹窗 -->
        <div class="modal-overlay" v-if="invoiceModal" @click.self="invoiceModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>开票信息填报 - {{ invoiceModal.ciCode }}</h3><button class="modal-close" @click="invoiceModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="background:#f0f7ff;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--blue);font-size:12px;color:#1565c0;">
                        🧾 当前填写信息后续将在【历史】弹窗中可查。
                    </div>
                    <div class="form-group full"><label class="form-label required">计划开票时间</label><input type="date" class="form-control" v-model="invoiceForm.date"></div>
                    <div class="form-group full"><label class="form-label">未开票原因</label><textarea class="form-control" v-model="invoiceForm.reason" placeholder="如本期因对方流程慢未能开票"></textarea></div>
                    <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" v-model="invoiceForm.remark"></textarea></div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="invoiceModal=null">取消</button><button class="btn btn-primary" @click="submitInvoice">保存</button></div>
            </div>
        </div>
        
        <!-- 回款填报弹窗 -->
        <div class="modal-overlay" v-if="receiptModal" @click.self="receiptModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>回款信息填报 - {{ receiptModal.ciCode }}</h3><button class="modal-close" @click="receiptModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">计划回款时间</label><input type="date" class="form-control" v-model="receiptForm.planDate"></div>
                        <div class="form-group"><label class="form-label">计划回款金额(元)</label><input type="number" class="form-control" v-model.number="receiptForm.planAmt"></div>
                        <div class="form-group"><label class="form-label required">最新实际收款时间</label><input type="date" class="form-control" v-model="receiptForm.actualDate"></div>
                        <div class="form-group"><label class="form-label required">收款总金额(元)</label><input type="number" class="form-control" v-model.number="receiptForm.actualAmt"></div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" v-model="receiptForm.remark"></textarea></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="receiptModal=null">取消</button><button class="btn btn-primary" @click="submitReceipt">保存</button></div>
            </div>
        </div>

        <!-- 个人历史弹窗 -->
        <div class="modal-overlay" v-if="historyModal" @click.self="historyModal=null" style="z-index:999;">
            <div class="modal modal-xl" style="max-width:1300px;top:2vh;">
                <div class="modal-header"><h3>历史记录 - {{ historyModal.ciCode }}</h3><button class="modal-close" @click="historyModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="tab-bar">
                        <button class="tab-btn" :class="{active:histTab==='output'}" @click="histTab='output'">当月确认产值记录</button>
                        <button class="tab-btn" :class="{active:histTab==='correct'}" @click="histTab='correct'">纠正记录明细</button>
                    </div>
                    
                    <div v-show="histTab==='output'" style="margin-top:16px;">
                        <table class="data-table">
                            <thead style="background:#f1f5f9;"><tr>
                                <th>月份</th><th>合同类型</th><th>系统计算值(元)</th><th>最终确认产值(元)</th><th>差异值</th><th>差异率</th><th>类型</th><th>操作人</th><th>操作时间</th><th>备注</th>
                            </tr></thead>
                            <tbody>
                                <tr><td>2026-02</td><td><span class="tag tag-blue">人工日</span></td><td>28,800</td><td><strong style="color:var(--blue)">26,500</strong></td><td class="text-danger">-2,300</td><td class="text-danger">-7.99%</td><td><span class="tag tag-blue">用户手工填报</span></td><td>李明</td><td>2026-02-20</td><td>按实际工时微调</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-show="histTab==='correct'" style="margin-top:16px;">
                        <table class="data-table">
                            <thead style="background:#f1f5f9;"><tr>
                                <th>序号</th><th>监理编号</th><th>纠正前收入(元)</th><th>纠正差值金额(元)</th><th>纠正后收入(元)</th><th>当月真实产值(元)</th><th>来源编号</th><th>纠正原因</th><th>状态</th>
                            </tr></thead>
                            <tbody>
                                <tr><td>1</td><td>CI-2026-001</td><td>28,800</td><td class="text-danger font-bold">-5,000</td><td class="text-primary font-bold">23,800</td><td>28,800</td><td>CI-2026-002</td><td>跨项目录入冲销</td><td><span class="status status-active">已生效</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="historyModal=null">关闭</button></div>
            </div>
        </div>

        <!-- 全局历史弹窗 -->
        <div class="modal-overlay" v-if="globalHistoryModal" @click.self="globalHistoryModal=false" style="z-index:999;">
            <div class="modal modal-xl" style="max-width:1300px;top:2vh;">
                <div class="modal-header"><h3>全局历史记录查询 (领导层跨项目视图)</h3><button class="modal-close" @click="globalHistoryModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="tab-bar">
                        <button class="tab-btn" :class="{active:glTab==='output'}" @click="glTab='output'">全量确认产值记录</button>
                        <button class="tab-btn" :class="{active:glTab==='correct'}" @click="glTab='correct'">全量流水纠正日志</button>
                    </div>
                    
                    <div v-show="glTab==='output'" style="margin-top:16px;">
                        <table class="data-table">
                            <thead style="background:#f1f5f9;"><tr>
                                <th>合同名称</th><th>监理编号</th><th>月份</th><th>合同类型</th><th>系统值</th><th>确认值</th><th>差异额</th><th>类型</th><th>操作人</th><th>时间</th>
                            </tr></thead>
                            <tbody>
                                <tr><td>某石化项目</td><td>CI-2026-001</td><td>2026-02</td><td><span class="tag tag-blue">人工日</span></td><td>28,800</td><td>26,500</td><td class="text-danger">-2,300</td><td><span class="tag tag-blue">填报</span></td><td>李明</td><td>02-20</td></tr>
                                <tr><td>压力容器</td><td>CI-2026-002</td><td>2026-01</td><td><span class="tag tag-green">总价</span></td><td>120,000</td><td>120,000</td><td class="text-success">0</td><td><span class="tag tag-green">自动</span></td><td>系统</td><td>01-31</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-show="glTab==='correct'" style="margin-top:16px;">
                        <table class="data-table">
                            <thead style="background:#f1f5f9;"><tr>
                                <th>监理编号</th><th>纠正前收入</th><th>纠正金额</th><th>纠正后收入</th><th>当月产值</th><th>操作人</th><th>原因</th><th>来源编号</th>
                            </tr></thead>
                            <tbody>
                                <tr><td>CI-2026-001</td><td>28,800</td><td class="text-danger font-bold">-5000</td><td class="text-primary font-bold">23,800</td><td>28,800</td><td>财务刘</td><td>发票拆分退回</td><td>CI-2026-002</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};


// ==================== 执行管理 ====================
const ExecutionPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, computed } = Vue;
        const data = computed(() => props.data || []);

        const editModal = ref(null);
        function openEdit(r) { editModal.value = r; }

        return { data, fmt, editModal, openEdit };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>执行管理 <small>(28个字段)</small></h1>
            <div class="role-badge">当前角色：<strong>项目经理</strong> — 角色查看权限可配置</div>
        </div>
        
        <div class="info-panel">
            <h3>📋 项目执行状态说明（三色灯标识，可配置字典）</h3>
            <div class="legend-row">
                <span class="status-light gray"></span> 未开始：当前时间≤实际开始时间或无实际开始时间 &nbsp;|&nbsp;
                <span class="status-light blue"></span> 进行中：实际开始≤当前时间＜实际结束 &nbsp;|&nbsp;
                <span class="status-light green"></span> 已完成：当前时间≥实际结束时间
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">⏰ 超期规则：当前时间 > 计划结束时，计划结束标红 | 📐 产值计算参照收入模块</div>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
                    <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>监造厂家</th>
                    <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
                    <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>平台</th><th>中石化</th>
                    <th>设备名称</th><th>数量</th>
                    <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
                    <th style="min-width:80px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="r.pdCode">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>李明</td><td>PRJ-001</td><td>石化工程</td><td>周磊</td>
                        <td>{{ r.pdCode }}</td><td>周磊</td>
                        <td class="text-right">{{ fmt(r.output*1.2) }}</td><td class="text-right">{{ fmt(r.output*0.1) }}</td><td>东方锅炉</td>
                        <td>{{ r.name }}</td><td>王五</td><td><span class="tag" :class="r.type==='驻厂'?'tag-blue':'tag-cyan'">{{ r.type }}</span></td>
                        <td>2026-01-20</td><td :class="{'text-danger': i===0}">2026-02-28</td>
                        <td>2026-01-22</td><td>—</td>
                        <td><span class="status-light" :class="i===2?'gray':'blue'"></span></td><td>34</td>
                        <td>是</td><td>是</td><td>换热器</td><td>4</td>
                        <template v-if="r.type==='驻厂'">
                            <td>✅是</td><td>✅是</td><td><span class="tag tag-orange">中</span></td><td>✅是</td><td>❌否</td><td>✅是</td><td>✅是</td>
                        </template>
                        <template v-else>
                            <td colspan="7" class="text-muted text-center">—</td>
                        </template>
                        <td>
                            <button class="btn-mini btn-primary" v-if="r.type==='驻厂'" @click="openEdit(r)">编辑</button>
                            <button class="btn-mini btn-outline" v-else disabled title="巡检无业务状态流">编辑</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 执行编辑弹窗 -->
        <div class="modal-overlay" v-if="editModal" @click.self="editModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>编辑业务状态流 - {{ editModal.pdCode }}</h3><button class="modal-close" @click="editModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">编辑驻厂监造的业务状态流字段（巡检无数据）</div>
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">大纲是否已编制审核</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">细则是否已编制审核</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">风险评估报告风险等级</label><select class="form-control"><option>低</option><option selected>中</option><option>高</option></select></div>
                        <div class="form-group"><label class="form-label">依据性文件现场是否拿到</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">监理工程师交接申请</label><select class="form-control"><option>有</option><option selected>无</option></select></div>
                        <div class="form-group"><label class="form-label">ITP是否已确认并发给委托方</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">预检会是否召开并有会议纪要</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control"></textarea></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="editModal=null">取消</button><button class="btn btn-primary" @click="editModal=null;showToast('保存成功')">保存</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 工时记录 ====================
const WorkhourPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, computed } = Vue;
        const data = computed(() => props.data || []);

        const level2Modal = ref(null);
        function openLevel2(r) { level2Modal.value = r; }

        return { data, fmtM, level2Modal, openLevel2 };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>工时记录 <small>(以合同号为维度 - 方案一)</small></h1>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>制造厂</th><th>监造金额(元)</th>
                    <th>项目负责人</th><th>合同签订时间</th><th>合同起始时间</th><th>合同终止日期</th><th>合同形式</th><th>工时(天)</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(c,i) in data" :key="c.ciCode">
                        <td>{{ i+1 }}</td><td>{{ c.ciCode }}</td><td>{{ c.name }}</td><td>{{ c.client }}</td><td>{{ c.factory }}</td>
                        <td class="text-right">{{ fmtM(c.amount) }}</td><td>{{ ['李明','王芳','陈伟'][i%3] }}</td>
                        <td>2026-01-15</td><td>2026-01-20</td><td>2026-12-31</td>
                        <td><span class="tag" :class="c.contractForm==='人工日'?'tag-blue':'tag-green'">{{ c.contractForm }}</span></td>
                        <td class="text-right font-bold">{{ c.contractForm==='人工日'? 158 : 0 }}</td>
                        <td><button class="btn-mini btn-primary" @click="openLevel2(c)">查看明细</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 二级弹窗 -->
        <div class="modal-overlay" v-if="level2Modal" @click.self="level2Modal=null" style="z-index:999;">
            <div class="modal modal-xl">
                <div class="modal-header"><h3>工时明细展示 (以人员派单维度) - {{ level2Modal.ciCode }}</h3><button class="modal-close" @click="level2Modal=null">✕</button></div>
                <div class="modal-body">
                    <p style="margin-bottom:12px;font-size:12px;color:var(--text-muted)">此层级为人员派单维度的工时汇总，可穿透查看具体某人的日历打卡情况。</p>
                    <table class="data-table">
                        <thead style="background:#f8fafc"><tr>
                            <th>姓名</th><th>派单编号</th><th>有效折抵工时(天)</th><th>异常打卡(次)</th><th>最后打卡</th>
                        </tr></thead>
                        <tbody>
                            <tr><td>李明</td><td>PD-20260115-01</td><td class="font-bold">120</td><td class="text-danger">2</td><td>2026-02-28</td></tr>
                            <tr><td>王五</td><td>PD-20260212-05</td><td class="font-bold">38</td><td class="text-success">0</td><td>2026-02-27</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
};

// ==================== 监理人员动态 ====================
const PersonnelPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, reactive } = Vue;
        const level2Modal = ref(null);
        function openLevel2() { level2Modal.value = true; }

        const level3Modal = ref(null);
        const days = Array.from({ length: 35 }, (_, i) => ({ n: (i < 3 ? 0 : i - 2 > 28 ? 0 : i - 2), s: i % 7 === 0 ? '休' : (i % 5 === 0 ? '异常' : '正常') }));
        function openLevel3() { level3Modal.value = true; }

        return { level2Modal, openLevel2, level3Modal, openLevel3, days };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>监理人员动态 <small>(一级-人员信息)</small></h1>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>姓名</th><th>性别</th><th>民族</th><th>政治面貌</th><th>文化程度</th><th>身份证号</th>
                    <th>出生年月</th><th>年龄</th><th>入职日期</th><th>毕业院校</th><th>专业</th><th>职称</th><th>监理师证书</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>1</td><td>张三</td><td>男</td><td>汉族</td><td>党员</td><td>本科</td><td>510***********1234</td>
                        <td>1990-05</td><td>35</td><td>2018-06-01</td><td>四川大学</td><td>机械工程</td><td>高工</td><td>JLZ-2020-001</td>
                        <td><button class="btn-mini btn-primary" @click="openLevel2">查看派单</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 二级弹窗：所有派单 -->
        <div class="modal-overlay" v-if="level2Modal" @click.self="level2Modal=false" style="z-index:999;">
            <div class="modal modal-xl">
                <div class="modal-header"><h3>张三 - 所属项目派单列表 (以人员为维度)</h3><button class="modal-close" @click="level2Modal=false">✕</button></div>
                <div class="modal-body">
                    <table class="data-table">
                        <thead style="background:#f8fafc"><tr>
                            <th>派单号</th><th>监理编号</th><th>状态</th><th>工时</th><th>操作</th>
                        </tr></thead>
                        <tbody>
                            <tr><td>PD-20260115-01</td><td>CI-2026-001</td><td><span class="status status-active">进行中</span></td><td>120</td><td><button class="btn-mini btn-primary" @click="openLevel3">打卡日历</button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 三级弹窗：打卡日历 -->
        <div class="modal-overlay" v-if="level3Modal" @click.self="level3Modal=false" style="z-index:1000;">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>张三 - (PD-20260115-01) 2026年2月 打卡日历</h3><button class="modal-close" @click="level3Modal=false">✕</button></div>
                <div class="modal-body">
                    <div class="calendar-grid">
                        <div class="cal-header">日</div><div class="cal-header">一</div><div class="cal-header">二</div><div class="cal-header">三</div><div class="cal-header">四</div><div class="cal-header">五</div><div class="cal-header">六</div>
                        <div v-for="(d,i) in days" :key="i" class="cal-day" :class="{empty: d.n===0}" style="border:1px solid #e2e8f0;">
                            <template v-if="d.n!==0">
                                <div class="cal-day-num">{{ d.n }}</div>
                                <div style="font-size:10px;" :class="d.s==='正常'?'text-success':d.s==='异常'?'text-danger':'text-muted'">{{ d.s }}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};


// ==================== 开票明细管理 ====================
const InvoicePage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, reactive } = Vue;
        const addModal = ref(false);
        const editModal = ref(null);
        const form = reactive({ ciCode: '', invoiceNo: '', applicant: '', date: '', amount: '', remark: '' });
        function openAdd() { addModal.value = true; Object.keys(form).forEach(k => form[k] = ''); }
        function openEdit(r) { editModal.value = r; Object.keys(form).forEach(k => form[k] = r[k] || ''); form.ciCode = r.ciCode; }

        return { data: props.data || [], fmtM, addModal, editModal, form, openAdd, openEdit, showToast };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>开票明细管理 <small>(V1+V2 融合版)</small></h1>
        </div>
        <div class="filter-panel"><button class="btn btn-primary" @click="openAdd">➕ 新增开票申请</button></div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>发票号</th><th>合同金额</th><th>申请人</th><th>申请时间</th>
                    <th>实缴金额(元)</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>FP-2026-00{{i+1}}</td><td class="text-right">{{ fmtM(r.contractAmount) }}</td>
                        <td>财务李</td><td>2026-02-1{{i}}</td><td class="text-right font-bold">{{ fmtM(r.invoiced||Math.random()*100000) }}</td>
                        <td><button class="btn-mini btn-info" @click="openEdit(r)">审批/编辑</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="modal-overlay" v-if="addModal||editModal" @click.self="addModal=false;editModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>{{ addModal ? '新增开票' : ('编辑开票 - '+editModal.ciCode) }}</h3><button class="modal-close" @click="addModal=false;editModal=null">✕</button></div>
                <div class="modal-body form-grid">
                    <div class="form-group"><label class="form-label required">关联监理编号</label><input type="text" class="form-control" v-model="form.ciCode"></div>
                    <div class="form-group"><label class="form-label required">发票号</label><input type="text" class="form-control" v-model="form.invoiceNo" :disabled="addModal"></div>
                    <div class="form-group"><label class="form-label required">申请人</label><input type="text" class="form-control" v-model="form.applicant"></div>
                    <div class="form-group"><label class="form-label required">申请时间</label><input type="date" class="form-control" v-model="form.date"></div>
                    <div class="form-group"><label class="form-label required">开票金额(元)</label><input type="number" class="form-control" v-model="form.amount"></div>
                    <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" v-model="form.remark"></textarea></div>
                </div>
                <div class="modal-footer"><button class="btn btn-primary" @click="addModal=false;editModal=null;showToast('保存成功')">保存并提交审批</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 回款明细管理 ====================
const PaymentPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, reactive } = Vue;
        const addModal = ref(false);
        const editModal = ref(null);
        const form = reactive({ ciCode: '', paymentNo: '', invoiceNo: '', receivedDate: '', amount: '', remark: '' });
        function openAdd() { addModal.value = true; Object.keys(form).forEach(k => form[k] = ''); }
        function openEdit(r) { editModal.value = r; Object.keys(form).forEach(k => form[k] = r[k] || ''); }

        return { data: props.data || [], fmtM, addModal, editModal, form, openAdd, openEdit, showToast };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>回款明细管理 <small>(需关联发票)</small></h1>
        </div>
        <div class="filter-panel"><button class="btn btn-primary" @click="openAdd">➕ 登记回款</button></div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>回款单号</th><th>关联发票号</th><th>合同金额</th>
                    <th>回款时间</th><th>本次回款(元)</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>HK-2026-00{{i+1}}</td><td>FP-2026-00{{i+1}}</td>
                        <td class="text-right">{{ fmtM(r.contractAmount) }}</td>
                        <td>2026-02-28</td><td class="text-right text-success font-bold">{{ fmtM(r.received||Math.random()*50000) }}</td>
                        <td><button class="btn-mini btn-info" @click="openEdit(r)">再次提交/编辑</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="modal-overlay" v-if="addModal||editModal" @click.self="addModal=false;editModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>{{ addModal ? '新增回款记录' : ('编辑回款 - '+editModal.ciCode) }}</h3><button class="modal-close" @click="addModal=false;editModal=null">✕</button></div>
                <div class="modal-body form-grid">
                    <div class="form-group"><label class="form-label required">关联监理编号</label><input type="text" class="form-control" v-model="form.ciCode"></div>
                    <div class="form-group"><label class="form-label">发票号(非必填)</label><input type="text" class="form-control" v-model="form.invoiceNo" placeholder="留空则作为无票回款"></div>
                    <div class="form-group"><label class="form-label required">实际回款时间</label><input type="date" class="form-control" v-model="form.receivedDate"></div>
                    <div class="form-group"><label class="form-label required">回款金额(元)</label><input type="number" class="form-control" v-model="form.amount" style="border-color:var(--green)"></div>
                    <div class="form-group full"><label class="form-label">备注说明</label><textarea class="form-control" v-model="form.remark"></textarea></div>
                    <div v-if="!form.invoiceNo && form.amount" class="form-group full" style="padding:10px;background:var(--orange-light);color:var(--orange);border-radius:6px;font-size:12px;">⚠️ 当前无关联发票，此笔回款将被标记为【预收款或无票回款账目】。</div>
                </div>
                <div class="modal-footer"><button class="btn btn-primary" @click="addModal=false;editModal=null;showToast('回款提交成功')">保存并入账</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 提醒设置 ====================
const ReminderPage = {
    setup() {
        const { ref } = Vue;
        const addModal = ref(false);
        const form = ref({ type: '发票超期', ciCode: '', days: 30, enable: true });
        const list = ref([
            { id: 1, type: '发票超期预警', rule: '超过 <strong class="text-danger">30</strong> 天未开票', scope: '全体', status: true },
            { id: 2, type: '执行时间预警', rule: '距离计划结束小于 <strong class="text-orange">7</strong> 天', scope: '驻厂', status: true }
        ]);
        function toggle(item) { item.status = !item.status; showToast(item.status ? '已启用' : '已停用'); }
        return { addModal, form, list, toggle };
    },
    template: `
    <div>
        <div class="page-title-row"><h1>提醒设置与系统字典</h1></div>
        <div class="filter-panel"><button class="btn btn-primary" @click="addModal=true">➕ 新增业务规则提醒</button></div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>提醒类型</th><th>触发规则</th><th>适用范围</th><th>启用状态</th><th>操作</th></tr></thead>
                <tbody>
                    <tr v-for="(r,i) in list" :key="r.id">
                        <td>{{ i+1 }}</td><td>{{ r.type }}</td><td v-html="r.rule"></td><td>{{ r.scope }}</td>
                        <td><span class="status" :class="r.status?'status-done':'status-terminated'">{{ r.status?'启用中':'已停用' }}</span></td>
                        <td><button class="btn-mini" :class="r.status?'btn-warning':'btn-success'" @click="toggle(r)">{{ r.status?'停用':'启用' }}</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="modal-overlay" v-if="addModal" @click.self="addModal=false">
            <div class="modal modal-md">
                <div class="modal-header"><h3>新增提醒规则字典项</h3><button class="modal-close" @click="addModal=false">✕</button></div>
                <div class="modal-body form-grid">
                    <div class="form-group full"><label class="form-label required">预警指标类型</label><select class="form-control" v-model="form.type"><option>发票超期</option><option>执行超期</option><option>利润滑坡</option></select></div>
                    <div class="form-group full"><label class="form-label required">触发阈值(天/元/%)</label><input type="number" class="form-control" v-model="form.days"></div>
                </div>
                <div class="modal-footer"><button class="btn btn-primary" @click="addModal=false;showToast('规则字典刷新成功')">保存规则</button></div>
            </div>
        </div>
    </div>
    `
};


// ==================== 差旅报销台账 ====================
const TravelPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, reactive } = Vue;
        const adjustModal = ref(null);
        function openAdjust(r) { adjustModal.value = r; }
        return { data: props.data || [], fmtM, adjustModal, openAdjust, showToast };
    },
    template: `
    <div>
        <div class="page-title-row"><h1>差旅报销台账登记 <small>(带手工纠偏)</small></h1></div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>单据编号</th><th>关联监理编号</th><th>报销申请人</th><th>报销事由</th><th>系统自动摊销(元)</th><th>发生月份</th><th>报账状态</th><th>财务操作</th></tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>CL-2026-00{{i+1}}</td><td>{{ r.ciCode }}</td><td>陈伟</td><td>出差检修费用</td>
                        <td class="text-right">{{ fmtM(r.travelCost||1500) }}</td><td>2026-02</td>
                        <td><span class="status status-done">已入账</span></td>
                        <td><button class="btn-mini btn-warning" @click="openAdjust(r)">差旅摊扣纠偏</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="modal-overlay" v-if="adjustModal" @click.self="adjustModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>差旅调整纠偏 - {{ adjustModal.ciCode }}</h3><button class="modal-close" @click="adjustModal=null">✕</button></div>
                <div class="modal-body form-grid">
                    <div class="form-group full" style="font-size:12px;color:var(--orange);">⚠️ 如果差旅费归属多项目，可手动打散纠偏扣减到其他CI。</div>
                    <div class="form-group"><label class="form-label required">转移额度</label><input type="number" class="form-control" placeholder="-1000"></div>
                    <div class="form-group"><label class="form-label required">转移至(目标CI编号)</label><input type="text" class="form-control" placeholder="CI-2026-00x"></div>
                    <div class="form-group full"><label class="form-label required">审计原因</label><textarea class="form-control"></textarea></div>
                </div>
                <div class="modal-footer"><button class="btn btn-warning" @click="adjustModal=null;showToast('纠偏摊销已移转生效')">确认分账转移</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 人员工资 ====================
const SalaryPage = {
    props: ['role', 'data'],
    setup(props) { return { data: props.data || [], fmtM }; },
    template: `
    <div>
        <div class="page-title-row"><h1>人员薪资库成本引擎 <small>(系统隐私自动抓取)</small></h1></div>
        <div class="info-panel">🔐 当前模块仅限高层级财务/总监查看。薪酬通过人员当月所参与的排班占比按照工时自动分摊到具体监理单项目上。</div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>姓名</th><th>层级定岗</th><th>月基本薪资基数(元)</th><th>最新发放期</th><th>分摊合同数</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>王五</td><td>高级工程师</td><td class="text-right">18,500.00</td><td>2026-02</td><td>3</td></tr>
                    <tr><td>2</td><td>李明</td><td>专职监理</td><td class="text-right">12,000.00</td><td>2026-02</td><td>1</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    `
};

// ==================== 动态成本 ====================
const CostPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref } = Vue;
        const costPersModal = ref(null);
        const costTravModal = ref(null);
        const costFixModal = ref(null);
        function openPers(r) { costPersModal.value = r; }
        function openTrav(r) { costTravModal.value = r; }
        function openFix(r) { costFixModal.value = r; }
        return { data: props.data || [], fmtM, costPersModal, costTravModal, costFixModal, openPers, openTrav, openFix };
    },
    template: `
    <div>
        <div class="page-title-row"><h1>全谱系动态成本核算 <small>(人员/差旅/固定三分账体系)</small></h1></div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>监理编号</th><th>项目名称</th><th>隐性人力折算(元)</th><th>差旅分摊(元)</th><th>固定支出(元)</th><th>汇总动态成本(元)</th></tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.name }}</td>
                        <td class="text-right"><span class="link-text" @click="openPers(r)">{{ fmtM(r.personnelCost) }}</span></td>
                        <td class="text-right"><span class="link-text" @click="openTrav(r)">{{ fmtM(r.travelCost) }}</span></td>
                        <td class="text-right"><span class="link-text" @click="openFix(r)">{{ fmtM(r.fixedCost) }}</span></td>
                        <td class="text-right font-bold text-danger">{{ fmtM((r.personnelCost||0)+(r.travelCost||0)+(r.fixedCost||0)) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 成本穿透弹窗 -->
        <div class="modal-overlay" v-if="costPersModal" @click.self="costPersModal=null"><div class="modal modal-lg"><div class="modal-header"><h3>人力成本穿透追溯 - {{ costPersModal.ciCode }}</h3><button class="modal-close" @click="costPersModal=null">✕</button></div><div class="modal-body">展示每个员工按公式计算倒推到该项目的真实工资分摊...</div></div></div>
        <div class="modal-overlay" v-if="costTravModal" @click.self="costTravModal=null"><div class="modal modal-lg"><div class="modal-header"><h3>差旅明细溯源 - {{ costTravModal.ciCode }}</h3><button class="modal-close" @click="costTravModal=null">✕</button></div><div class="modal-body">展示每笔报销单通过财务【纠偏分配】聚合后的差旅账单...</div></div></div>
        <div class="modal-overlay" v-if="costFixModal" @click.self="costFixModal=null"><div class="modal modal-lg"><div class="modal-header"><h3>固定支出归集明细 - {{ costFixModal.ciCode }}</h3><button class="modal-close" @click="costFixModal=null">✕</button></div><div class="modal-body">特殊检测费用、外包费...</div></div></div>
    </div>
    `
};

// ==================== 利润利润 ====================
const ProfitPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, onMounted } = Vue;
        const chartRef = ref(null);
        onMounted(() => {
            setTimeout(() => {
                if (chartRef.value && typeof echarts !== 'undefined') {
                    const myChart = echarts.init(chartRef.value);
                    myChart.setOption({
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                        legend: { data: ['最终产值', '隐性成本合计', '经营利润留存'] },
                        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                        xAxis: { type: 'category', data: props.data.map(d => d.ciCode) },
                        yAxis: { type: 'value' },
                        series: [
                            { name: '最终产值', type: 'bar', data: props.data.map(d => d.monthConfirmed), itemStyle: { color: '#409eff' } },
                            { name: '隐性成本合计', type: 'bar', stack: 'Total', data: props.data.map(d => (d.personnelCost || 0) + (d.travelCost || 0) + (d.fixedCost || 0)), itemStyle: { color: '#f56c6c' } },
                            { name: '经营利润留存', type: 'line', data: props.data.map(d => d.monthConfirmed - ((d.personnelCost || 0) + (d.travelCost || 0) + (d.fixedCost || 0))), itemStyle: { color: '#67c23a' } }
                        ]
                    });
                }
            }, 500);
        });
        return { data: props.data || [], chartRef, fmtM, fmtPct };
    },
    template: `
    <div>
        <div class="page-title-row"><h1>多维边际利润测算引擎</h1></div>
        <div class="chart-card"><div class="chart-container" ref="chartRef" style="height:350px;"></div></div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>监理编号</th><th>项目名称</th><th>合同额(元)</th><th>已审总产值(元)</th><th>倒算总成本(元)</th><th>业务留存利润(元)</th><th>利润率</th></tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.name }}</td><td class="text-right">{{ fmtM(r.contractAmount) }}</td>
                        <td class="text-right"><strong class="text-primary">{{ fmtM(r.monthConfirmed) }}</strong></td>
                        <td class="text-right"><strong class="text-danger">{{ fmtM((r.personnelCost||0)+(r.travelCost||0)+(r.fixedCost||0)) }}</strong></td>
                        <td class="text-right">
                            <strong :class="r.monthConfirmed-((r.personnelCost||0)+(r.travelCost||0)+(r.fixedCost||0))>=0?'profit-green':'profit-red'">
                                {{ fmtM(r.monthConfirmed-((r.personnelCost||0)+(r.travelCost||0)+(r.fixedCost||0))) }}
                            </strong>
                        </td>
                        <td class="text-right font-bold">{{ fmtPct((r.monthConfirmed-((r.personnelCost||0)+(r.travelCost||0)+(r.fixedCost||0))) / r.contractAmount * 100) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
};

// ==================== 经营数据量化 ====================
const ReportPage = {
    setup() {
        const { ref, onMounted } = Vue;
        const chartRef = ref(null);
        onMounted(() => {
            setTimeout(() => {
                if (chartRef.value && typeof echarts !== 'undefined') {
                    const myChart = echarts.init(chartRef.value);
                    myChart.setOption({
                        title: { text: '近12个月集团营收与回款水线分析' },
                        tooltip: { trigger: 'axis' },
                        legend: { data: ['开票增量', '到账资金量', '待补差额'], right: 10 },
                        xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'] },
                        yAxis: { type: 'value' },
                        series: [
                            { name: '开票增量', type: 'line', smooth: true, data: [120, 132, 101, 134, 90, 230, 210, 150, 180] },
                            { name: '到账资金量', type: 'line', smooth: true, data: [220, 182, 191, 234, 290, 330, 310, 200, 250], itemStyle: { color: '#67c23a' } },
                            { name: '待补差额', type: 'line', smooth: true, data: [150, 232, 201, 154, 190, 330, 410, 150, 200], itemStyle: { color: '#e6a23c' } }
                        ]
                    });
                }
            }, 500);
        });
        return { chartRef };
    },
    template: `
    <div>
        <div class="page-title-row"><h1>经营宏观大屏量化展示</h1><button class="btn btn-success" @click="doExport('量化报告')">导出完整高管简报(PDF格式)</button></div>
        <div class="chart-card"><div class="chart-container" ref="chartRef" style="height:400px;"></div></div>
    </div>
    `
};

// ==================== 权限分配 ====================
const PermissionPage = {
    template: `
    <div>
        <div class="page-title-row"><h1>统一角色体系权限映射管理</h1></div>
        <div class="info-panel">🔐 RBAC (Role-Based Access Control) 底层安全策略：所有功能项不仅针对页面可见性做拦截，在接口数据层面也实施了严格的作用域隔离。</div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr><th>#</th><th>系统识别层角色名</th><th>菜单及按钮授权许可池</th><th>数据流转作用管控域</th><th>状态</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>领导用户</td><td>访问全模块 / 【审计追溯看透功能】</td><td>拥有跨越事业部组织树的所有数据的穿透与导出权</td><td><span class="status status-done">正常</span></td></tr>
                    <tr><td>2</td><td>财务用户</td><td>访问收入、开票、回款等模块 / 【14项手工做账纠正权】</td><td>所有合同财务类表单底层数据写入覆盖权</td><td><span class="status status-done">正常</span></td></tr>
                    <tr><td>3</td><td>项目经理</td><td>访问合同台账、执行模块、工时 / 【申请阻断、提交审批权】</td><td>仅限本人参与的项目或部门委派的CI单据作用域</td><td><span class="status status-active">监控中</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>
    `
};


