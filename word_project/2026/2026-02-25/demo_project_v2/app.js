
const app = createApp({
    setup() {
        // ===== 响应式状态 =====
        const currentPage = ref('dashboard');
        const sidebarCollapsed = ref(false);
        const currentRole = ref('项目经理');
        const showNotification = ref(false);

        // 数据引用
        const contracts = ref(mockContracts);
        const incomeData = ref(mockIncomeData);
        const executionData = ref(mockExecutionData);
        const costData = ref(mockCostData);
        const profitData = ref(mockProfitData);

        // ===== 侧边栏菜单 =====
        const menus = [
            { key: 'dashboard', icon: '🖥️', label: '领导管理大屏' },
            { key: 'contract', icon: '📄', label: '合同台账' },
            { key: 'income', icon: '💰', label: '项目收入' },
            { key: 'execution', icon: '🔧', label: '执行管理' },
            { key: 'workhour', icon: '⏱️', label: '工时记录' },
            { key: 'personnel', icon: '👥', label: '监理人员动态' },
            { key: 'invoice', icon: '🧾', label: '开票明细管理' },
            { key: 'payment', icon: '💳', label: '回款明细管理' },
            { key: 'reminder', icon: '🔔', label: '提醒设置' },
            { key: 'travel', icon: '✈️', label: '差旅报销台账' },
            { key: 'salary', icon: '💵', label: '人员工资管理' },
            { key: 'cost', icon: '📊', label: '动态成本核算' },
            { key: 'profit', icon: '📈', label: '利润管理' },
            { key: 'report', icon: '📋', label: '经营数据量化' },
            { key: 'permission', icon: '🔐', label: '权限分配' }
        ];

        // ===== 通知面板 =====
        const notifications = [
            { id: 1, type: 'warning', title: '利润预警', content: 'CI-2024-003 管道安装监造项目利润为负(-¥45,200)，请关注!', time: '2分钟前', read: false },
            { id: 2, type: 'info', title: '回款到账', content: 'CI-2024-002 收到回款 ¥400,000', time: '1小时前', read: false },
            { id: 3, type: 'success', title: '审批通过', content: '开票 FP-202602-001 审批已通过', time: '3小时前', read: true },
            { id: 4, type: 'info', title: '开票提醒', content: 'CI-2024-001 已超30天未开票，请及时处理', time: '1天前', read: true },
            { id: 5, type: 'warning', title: '执行超期', content: 'PD-20240115-01 计划结束时间已超期', time: '2天前', read: true }
        ];
        const unreadCount = computed(() => notifications.filter(n => !n.read).length);
        function markRead(n) { n.read = true; }

        function switchPage(key) { currentPage.value = key; }
        function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value; }

        return {
            currentPage, sidebarCollapsed, currentRole, showNotification,
            contracts, incomeData, executionData, costData, profitData,
            menus, notifications, unreadCount, markRead,
            switchPage, toggleSidebar, toastList
        };
    }
});

// ===== 注册全局属性 =====
app.config.globalProperties.fmt = fmt;
app.config.globalProperties.fmtM = fmtM;
app.config.globalProperties.fmtW = fmtW;
app.config.globalProperties.fmtPct = fmtPct;
app.config.globalProperties.showToast = showToast;
app.config.globalProperties.doExport = doExport;

// ===== 注册组件 =====
app.component('dashboard-page', DashboardPage);
app.component('contract-page', ContractPage);
app.component('income-page', IncomePage);
app.component('execution-page', ExecutionPage);
app.component('workhour-page', WorkhourPage);
app.component('personnel-page', PersonnelPage);
app.component('invoice-page', InvoicePage);
app.component('payment-page', PaymentPage);
app.component('reminder-page', ReminderPage);
app.component('travel-page', TravelPage);
app.component('salary-page', SalaryPage);
app.component('cost-page', CostPage);
app.component('profit-page', ProfitPage);
app.component('report-page', ReportPage);
app.component('permission-page', PermissionPage);

// ===== 挂载 =====
app.mount('#app');
