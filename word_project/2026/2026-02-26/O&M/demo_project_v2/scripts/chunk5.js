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
