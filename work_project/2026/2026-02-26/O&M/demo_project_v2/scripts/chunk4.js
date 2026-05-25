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
