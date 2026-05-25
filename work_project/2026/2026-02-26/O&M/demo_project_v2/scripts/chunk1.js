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
