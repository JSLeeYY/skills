// ===== comp_1.js — ContractPage 合同台账 + IncomePage 项目收入 =====

// ==================== 合同台账 ====================
const ContractPage = {
  props: ['role', 'data'],
  emits: ['terminate', 'view-detail'],
  setup(props, { emit }) {
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const showAdvFilter = ref(false);
    const detailModal = ref(null); // holds contract object or null
    const terminateModal = ref(null);
    const search = reactive({ ciCode: '', name: '', device: '', client: '', factory: '', form: '全部', manager: '', signDate: '', startDate: '', endDate: '', erp: '全部', status: '全部' });

    const filtered = computed(() => {
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
    const data = computed(() => props.data || []);
    const contracts = computed(() => props.contracts || []);
    const role = computed(() => props.role);
    const showFormula = ref(true);
    const reportModal = ref(null);
    const correctModal = ref(null);
    const historyModal = ref(false);

    // 收入填报表单
    const reportForm = reactive({ ciCode: '', period: '', amount: 0, systemVal: 0, remark: '' });

    function openReport(row) {
      Object.assign(reportForm, { ciCode: row.ciCode, period: new Date().toISOString().slice(0, 7), amount: 0, systemVal: row.monthOutput || 0, remark: '' });
      reportModal.value = row;
    }
    function submitReport() {
      showToast('收入填报已提交审批：' + reportForm.ciCode + ' ' + reportForm.period + ' ¥' + fmt(reportForm.amount));
      reportModal.value = null;
    }
    function openCorrect(row) { correctModal.value = row; }
    function submitCorrect() { showToast('收入纠正已提交：' + correctModal.value.ciCode); correctModal.value = null; }

    return { data, contracts, role, showFormula, reportModal, correctModal, historyModal, reportForm, openReport, submitReport, openCorrect, submitCorrect, fmt, fmtM, fmtW };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>项目收入</h1>
            <div style="display:flex;align-items:center;gap:12px;">
                <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 填报与纠正权限可配置</span>
                <button class="btn btn-outline" style="background:#4b5563;color:#fff;border:none;" @click="historyModal=true">📜 领导层全局历史</button>
            </div>
        </div>

        <!-- 计算规则面板 -->
        <div class="formula-panel" style="margin-bottom:16px;">
            <div class="formula-panel-header" @click="showFormula=!showFormula" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border-color);">
                <span class="formula-panel-title">📐 核心计算规则（点击展开/收起）</span>
                <span>{{ showFormula ? '▾' : '▸' }}</span>
            </div>
            <div class="formula-panel-body" v-show="showFormula" style="padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
                <div class="formula-card"><div class="formula-title">总产值</div><div class="formula-body">人工日: Σ(合同单价×实际工时)<br>总价合同: =已报收入</div></div>
                <div class="formula-card"><div class="formula-title">当月产值</div><div class="formula-body">人工日: 当月工时×合同单价<br>总价(未结束): (已报收入÷总工时)×30<br>总价(已结束): (总收入÷总工时)×30</div></div>
                <div class="formula-card"><div class="formula-title">确认总产值</div><div class="formula-body">= Σ当月确认产值累加<br>(三种合同类型一致)</div></div>
                <div class="formula-card"><div class="formula-title">当月确认产值</div><div class="formula-body">人工日/人工日总价: 按时间区间填写<br>总价: 直接填写(无系统计算)</div></div>
                <div class="formula-card"><div class="formula-title">已报收入</div><div class="formula-body">默认: 开票金额合计<br>纠正后: 开票金额+当月收入</div></div>
                <div class="formula-card"><div class="formula-title">开票状态</div><div class="formula-body">未开票: 实际开票=0<br>部分开票: 0&lt;金额&lt;合同金额<br>全部开票: 金额=合同金额</div></div>
                <div class="formula-card"><div class="formula-title">工时分配规则</div><div class="formula-body"><strong>产值</strong>: 多项目不平均分<br><strong>成本</strong>: 按同时段项目数平均分</div></div>
                <div class="formula-card"><div class="formula-title">合同状态联动</div><div class="formula-body">合同"已完成"时：若已报收入未达合同金额，系统自动补齐</div></div>
            </div>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>委托方</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>委托方类别</label>
                    <select><option>全部</option><option>中石化</option><option>中石油</option><option>中海油</option><option>其他</option></select>
                </div>
                <div class="filter-item"><label>合同类型</label>
                    <select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-success" @click="doExport('项目收入')">📥 导出</button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>合同类型</th><th>合同金额(元)</th>
                    <th>总产值(元)</th><th>当月产值(元)</th><th>确认总产值(元)</th><th>当月确认产值(元)</th>
                    <th>已报收入(元)</th><th>开票金额(元)</th><th>收款金额(元)</th><th>开票状态</th>
                    <th style="min-width:200px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="r.ciCode">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.name }}</td><td>{{ r.client }}</td>
                        <td><span class="tag" :class="r.contractForm==='人工日'?'tag-blue':r.contractForm==='总价'?'tag-green':'tag-purple'">{{ r.contractForm }}</span></td>
                        <td class="text-right">{{ fmtM(r.contractAmount) }}</td>
                        <td class="text-right">{{ fmtM(r.totalOutput) }}</td>
                        <td class="text-right">{{ fmtM(r.monthOutput) }}</td>
                        <td class="text-right">{{ fmtM(r.confirmedOutput) }}</td>
                        <td class="text-right">{{ fmtM(r.monthConfirmed) }}</td>
                        <td class="text-right">{{ fmtM(r.reportedIncome) }}</td>
                        <td class="text-right">{{ fmtM(r.invoiced) }}</td>
                        <td class="text-right">{{ fmtM(r.received) }}</td>
                        <td><span class="status" :class="r.invoiceStatus==='全部开票'?'status-done':r.invoiceStatus==='部分开票'?'status-pending':'status-terminated'">{{ r.invoiceStatus }}</span></td>
                        <td>
                            <button class="btn-mini btn-primary" @click="openReport(r)">填报</button>
                            <button class="btn-mini btn-warning" @click="openCorrect(r)">纠正</button>
                            <button class="btn-mini btn-info" @click="showToast('查看 '+r.ciCode+' 历史记录')">历史</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <span>共 <strong>{{ data.length }}</strong> 条</span>
            <div class="pagination-btns"><button class="btn-page active">1</button></div>
        </div>

        <!-- 收入填报弹窗 -->
        <div class="modal-overlay" v-if="reportModal" @click.self="reportModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>收入填报 — {{ reportModal.ciCode }}</h3><button class="modal-close" @click="reportModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">监理编号</label><input class="form-control" :value="reportForm.ciCode" readonly></div>
                        <div class="form-group"><label class="form-label required">填报期间</label><input class="form-control" type="month" v-model="reportForm.period"></div>
                        <div class="form-group"><label class="form-label">系统计算值</label><input class="form-control" :value="fmtM(reportForm.systemVal)" readonly></div>
                        <div class="form-group"><label class="form-label required">当月确认产值(元)</label><input class="form-control" type="number" v-model.number="reportForm.amount" placeholder="请输入金额"></div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control" v-model="reportForm.remark" placeholder="如有差异请说明原因"></textarea></div>
                    </div>
                    <div v-if="reportForm.amount && reportForm.systemVal && Math.abs(reportForm.amount - reportForm.systemVal) / reportForm.systemVal > 0.1" style="margin-top:12px;padding:10px 14px;background:var(--orange-light);border-radius:6px;font-size:12px;color:var(--orange);">
                        ⚠️ 填报值与系统计算值偏差超过10%，提交后将进入审批流程
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="reportModal=null">取消</button>
                    <button class="btn btn-primary" @click="submitReport">提交审批</button>
                </div>
            </div>
        </div>

        <!-- 收入纠正弹窗 -->
        <div class="modal-overlay" v-if="correctModal" @click.self="correctModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>收入纠正 — {{ correctModal.ciCode }}</h3><button class="modal-close" @click="correctModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">当前已报收入</label><input class="form-control" :value="fmtM(correctModal.reportedIncome)" readonly></div>
                        <div class="form-group"><label class="form-label required">纠正后金额(元)</label><input class="form-control" type="number" placeholder="请输入纠正金额"></div>
                        <div class="form-group full"><label class="form-label required">纠正原因</label><textarea class="form-control" placeholder="请详细说明纠正原因（必填）"></textarea></div>
                    </div>
                    <div style="margin-top:12px;padding:10px 14px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue);">
                        ℹ️ 纠正后的差额将记录为当月收入，后期需抵冲调整
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="correctModal=null">取消</button>
                    <button class="btn btn-warning" @click="submitCorrect">提交纠正</button>
                </div>
            </div>
        </div>

        <!-- 全局历史弹窗 -->
        <div class="modal-overlay" v-if="historyModal" @click.self="historyModal=false">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>📜 领导层全局收入历史</h3><button class="modal-close" @click="historyModal=false">✕</button></div>
                <div class="modal-body">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>操作时间</th><th>监理编号</th><th>操作类型</th><th>操作人</th><th>金额</th><th>备注</th></tr></thead>
                            <tbody>
                                <tr><td>2026-02-28 14:30</td><td>CI-2024-001</td><td><span class="tag tag-blue">填报</span></td><td>李明</td><td class="text-right">18,400</td><td>2月产值确认</td></tr>
                                <tr><td>2026-02-15 10:20</td><td>CI-2024-002</td><td><span class="tag tag-orange">纠正</span></td><td>王芳</td><td class="text-right">-5,000</td><td>1月多报，本月抵冲</td></tr>
                                <tr><td>2026-01-31 16:45</td><td>CI-2024-001</td><td><span class="tag tag-blue">填报</span></td><td>李明</td><td class="text-right">22,000</td><td>1月产值确认</td></tr>
                                <tr><td>2026-01-20 09:10</td><td>CI-2024-003</td><td><span class="tag tag-blue">填报</span></td><td>陈伟</td><td class="text-right">120,000</td><td>总价合同首月</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="historyModal=false">关闭</button></div>
            </div>
        </div>
    </div>
    `
};
