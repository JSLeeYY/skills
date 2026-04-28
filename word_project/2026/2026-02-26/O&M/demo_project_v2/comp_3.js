// ===== comp_3.js — PersonnelPage 监理人员动态 + InvoicePage 开票明细 =====

// ==================== 监理人员动态 (一级+二级) ====================
const PersonnelPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const detailModal = ref(null);

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
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const showAdvFilter = ref(false);
    const addModal = ref(false);
    const detailModal = ref(null);
    const addForm = reactive({ org: '总公司', client: '', date: '', invoiceNo: '', currency: 'CNY', qty: 1, amount: 0, expectDate: '', manager: '', ciCode: '', project: '', voucherNo: '', remark: '' });

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
