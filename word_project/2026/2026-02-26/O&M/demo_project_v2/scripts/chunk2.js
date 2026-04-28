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
