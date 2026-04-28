// ===== comp_5.js — CostPage + ProfitPage + ReportPage + PermissionPage =====

// ==================== 动态成本核算 ====================
const CostPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const personnelModal = ref(null);
    const travelModal = ref(null);
    const fixedModal = ref(null);
    const showFormula = ref(true);

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
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const showAdvFilter = ref(false);
    const chartVisible = ref(false);
    const chartRef = ref(null);
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
    const role = computed(() => props.role);
    const activeTab = ref('personnel');

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
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const activePM = ref('李明');
    const assignModal = ref(false);

    const pmList = [
      { name: '李明', contracts: ['CI-2026-001', 'CI-2026-003', 'CI-2026-005'] },
      { name: '王芳', contracts: ['CI-2026-002', 'CI-2026-004'] },
      { name: '陈伟', contracts: ['CI-2026-003', 'CI-2026-006', 'CI-2026-007', 'CI-2026-008'] },
      { name: '赵丽', contracts: ['CI-2026-009'] }
    ];

    const currentPM = computed(() => pmList.find(p => p.name === activePM.value) || pmList[0]);
    const assignedContracts = computed(() => {
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
