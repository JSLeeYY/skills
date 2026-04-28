// ===== comp_4.js — PaymentPage + ReminderPage + TravelPage + SalaryPage =====

// ==================== 回款明细管理 ====================
const PaymentPage = {
  props: ['role', 'data'],
  setup(props) {
    const role = computed(() => props.role);
    const showAdvFilter = ref(false);
    const addModal = ref(false);
    const detailModal = ref(null);
    const summaryModal = ref(false);

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
    const role = computed(() => props.role);
    const addModal = ref(false);
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
    const role = computed(() => props.role);
    const travels = ref([
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
    const role = computed(() => props.role);
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
