import os
import re

base_dir = r"D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project_v2"

new_income_page = """const IncomePage = {
  props: ['role', 'contracts', 'data'],
  setup(props) {
    const data = Vue.computed(() => props.data || []);
    const contracts = Vue.computed(() => props.contracts || []);
    const role = Vue.computed(() => props.role);
    const showFormula = Vue.ref(true);
    const reportModal = Vue.ref(null);
    const correctModal = Vue.ref(null);
    const historyModal = Vue.ref(false);

    // 收入填报表单
    const reportForm = Vue.reactive({ ciCode: '', period: '', amount: 0, systemVal: 0, remark: '' });

    // 收入纠正14列表格的内部数据
    const correctItems = Vue.reactive([
        { selected: false, pdCode: 'PD-20260115-01', pdStatus: '进行中', type: '驻厂', name: '李明', client: '中国石化', factory: '东方锅炉', totalHours: 158, effectiveHours: 120, pct: '100%', baseAmt: 300, coef: 1.2, cost: 43200, output: 86400 }
    ]);
    const correctTotal = Vue.computed(() => correctItems.filter(i => i.selected).reduce((sum, i) => sum + i.output, 0));
    const correctForm = Vue.reactive({ amount: 0, reason: '', srcCode: '' });

    function openReport(row) {
      Object.assign(reportForm, { ciCode: row.ciCode, period: new Date().toISOString().slice(0, 7), amount: 0, systemVal: row.monthOutput || 0, remark: '' });
      reportModal.value = row;
    }
    function submitReport() {
      showToast('收入填报已提交审批：' + reportForm.ciCode);
      reportModal.value = null;
    }
    function openCorrect(row) {
      Object.assign(correctForm, { amount: 0, reason: '', srcCode: '' });
      correctItems.forEach(i => i.selected = false);
      correctModal.value = row;
    }
    function submitCorrect() {
      showToast('收入纠正申请已挂账处理');
      correctModal.value = null;
    }

    return { data, contracts, role, showFormula, reportModal, correctModal, historyModal, reportForm, correctItems, correctTotal, correctForm, openReport, submitReport, openCorrect, submitCorrect, fmt, fmtM, fmtW };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>项目收入汇总 <small>(包含产值核算/收入纠正/确认/历史全量展示)</small></h1>
            <div style="display:flex;align-items:center;gap:12px;">
                <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 控制填报与纠正的表单及按钮</span>
                <button class="btn btn-outline" style="background:#4b5563;color:#fff;border:none;" @click="historyModal=true">📜 领导层查看系统全部历史流转</button>
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
                <div class="formula-card"><div class="formula-title">确认当月产值</div><div class="formula-body">人工日: 需领导审批确认实际值<br>总价: 由业务线手工填报直接产生</div></div>
                <div class="formula-card"><div class="formula-title">已报收入纠正法</div><div class="formula-body">当实际开票与理论产值有差额时，提供14列明细表，勾选历史产值底表进行按人头金额抵冲</div></div>
                <div class="formula-card"><div class="formula-title">工时与占比分配</div><div class="formula-body">系统根据排班交叉自动分配比例<br>100%代表该时段仅有一个驻厂/巡检</div></div>
                <div class="formula-card"><div class="formula-title">状态自动联动</div><div class="formula-body">当关联监理单全部【已完成】，若账面回款不足，系统将亮红灯提醒结算清零</div></div>
            </div>
        </div>

        <!-- 高度还原 V1 + V2 的组合检索 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="输入CI编号搜索"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="关键词模糊查询"></div>
                <div class="filter-item"><label>委托方名称</label><input type="text" placeholder="所属客户"></div>
                <div class="filter-item"><label>大客户归属</label>
                    <select><option>全部客户</option><option>中石化系</option><option>中石油系</option><option>内外部其他</option></select>
                </div>
                <div class="filter-item"><label>合同形式</label>
                    <select><option>全部类型</option><option>人工日结算</option><option>一口价总包</option><option>工时换算总价</option></select>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('检索系统已加载数据')">🔍 组合检索</button>
                <button class="btn btn-outline" @click="showToast('筛选项清空')">↻ 恢复默认</button>
                <button class="btn btn-success" @click="doExport('项目收入底表')">📥 一键生成凭证底稿表</button>
            </div>
        </div>

        <!-- 数据表格 (完全对齐 V1 要求的14列) -->
        <div class="table-wrapper" style="overflow-x:auto;">
            <table class="data-table" style="min-width:1800px;">
                <thead><tr>
                    <th style="width:40px">#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>合同类型</th>
                    <th>合同金额(元)</th><th>当月产值(元)</th><th style="color:var(--orange)">当月纠正产值(A)</th>
                    <th style="color:var(--blue)">确认当月产值(B)</th><th>当月开票金额(元)</th><th>累计已开票金额(元)</th>
                    <th>累计回款金额(元)</th><th>历史纠正明细</th><th style="min-width:200px;position:sticky;right:0;background:#fff;">操作(填报/确认/纠偏)</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="r.ciCode">
                        <td>{{ i+1 }}</td><td><strong>{{ r.ciCode }}</strong></td><td>{{ r.name }}</td><td>{{ r.client }}</td>
                        <td><span class="tag" :class="r.contractForm==='人工日'?'tag-blue':r.contractForm==='总价'?'tag-green':'tag-purple'">{{ r.contractForm }}</span></td>
                        <td class="text-right">{{ fmtM(r.contractAmount) }}</td>
                        <td class="text-right">{{ fmtM(r.monthOutput) }}</td>
                        <td class="text-right font-bold text-warning">{{ r.ciCode==='CI-2024-001' ? '-5,000.00' : '0.00' }}</td>
                        <td class="text-right font-bold text-primary">{{ fmtM(r.monthConfirmed) }}</td>
                        <td class="text-right">{{ fmtM(r.invoiced) }}</td>
                        <td class="text-right">{{ fmtM(r.reportedIncome) }}</td>
                        <td class="text-right">{{ fmtM(r.received) }}</td>
                        <td class="text-center"><span class="link-text" @click="showToast('打捞并穿透查看历史修正版本及操作人日志')">查看详细记录</span></td>
                        <td style="position:sticky;right:0;background:#fff;border-left:1px solid #e2e8f0;padding:8px;text-align:center;">
                            <button class="btn-mini btn-primary" @click="openReport(r)">确认/报单</button>
                            <button class="btn-mini btn-warning" style="margin:0 4px;" @click="openCorrect(r)">手工纠正</button>
                            <button class="btn-mini btn-info" v-if="r.contractForm!=='总价'" @click="showToast('生成针对人工日的特别开票明细请求')">开票直通车</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>找到符合条件记录共 <strong>{{ data.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 收入填报 / 确认弹窗 -->
        <div class="modal-overlay" v-if="reportModal" @click.self="reportModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>最终收入产值填报及确认 — {{ reportModal.ciCode }}</h3><button class="modal-close" @click="reportModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="background:#f8fafc;padding:12px;border-left:4px solid var(--blue);margin-bottom:12px;font-size:12px;color:var(--text-muted)">
                        ⚠️ 针对人工日：系统自动抓取打卡考勤日志算出的理论产值为参考值。<br>针对总价包干：无系统计算参考，因存在进度款请按项目里程碑人工手工落定。
                    </div>
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">指定填报账期</label><input class="form-control" type="month" v-model="reportForm.period"></div>
                        <div class="form-group"><label class="form-label">系统理论产值计算结果(元)</label><input class="form-control" :value="fmtM(reportForm.systemVal)" readonly style="background:#f1f5f9;color:#64748b;"></div>
                        <div class="form-group full"><label class="form-label required">本期确认产值收入(元)</label><input class="form-control" type="number" v-model.number="reportForm.amount" placeholder="财务出账及报表用的最终金额" style="font-weight:bold;font-size:16px;"></div>
                        <div class="form-group full"><label class="form-label">偏差偏离说明及备注</label><textarea class="form-control" v-model="reportForm.remark" rows="3" placeholder="如果确认产值与系统理论产值产生显著差异，请给出必要的说明以备审计"></textarea></div>
                    </div>
                    <div v-if="reportForm.amount && reportForm.systemVal && Math.abs(reportForm.amount - reportForm.systemVal) / reportForm.systemVal > 0.1" style="margin-top:12px;padding:10px 14px;background:var(--orange-light);border-radius:6px;font-size:12px;color:var(--orange);">
                        🔥 系统检测到超出 ±10% 容忍红线：当前偏离度较高，提交后自动触发部门总监审批流程，通过后入账。
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="reportModal=null">暂存并关闭</button><button class="btn btn-primary" @click="submitReport">走确认/审批流程</button></div>
            </div>
        </div>

        <!-- 收入纠正：超级14列表格弹窗 -->
        <div class="modal-overlay" v-if="correctModal" @click.self="correctModal=null" style="z-index:999;">
            <div class="modal modal-xl" style="width:96vw;max-width:1600px;top:2vh;height:95vh;display:flex;flex-direction:column;">
                <div class="modal-header" style="flex-shrink:0;">
                    <h3>收入纠正转移单据流转面板 — {{ correctModal.ciCode }} [{{ correctModal.name }}]</h3>
                    <button class="modal-close" @click="correctModal=null">✕</button>
                </div>
                <div class="modal-body" style="flex:1;overflow-y:auto;padding:24px;">
                    <div style="background:#fff3e0;padding:14px;border-left:4px solid var(--orange);border-radius:6px;margin-bottom:16px;font-size:13px;line-height:1.6;">
                        ⚠️ <strong>纠正操作警告：</strong> 此接口针对因跨项目错登、特殊考勤扣款、异常报销抵扣引发的已产生系统产值的账目追溯与平帐。
                        <br>请在下方复杂的14列业务核算底表中筛选出问题产生的原始节点，<strong>勾选需要扣减的基础数据行</strong>，并在表单中重新设置纠偏额度。
                        转移后的额度将体现在账期报表内。
                    </div>

                    <!-- 核算底表 14 列 -->
                    <div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;margin-bottom:24px;">
                        <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                            <h4 style="margin:0;font-size:14px;font-weight:600;">📋 【历史】人员派单产值明细底帐 (14维度核算宽表)</h4>
                            <div style="font-size:12px;color:var(--text-muted);">系统仅加载当前合同历史关联的数据</div>
                        </div>
                        <div style="overflow-x:auto;">
                            <table class="data-table" style="min-width:1400px;margin:0;">
                                <thead style="background:#f1f5f9;"><tr>
                                    <th style="width:50px;text-align:center;">勾选</th>
                                    <th>派单编号</th><th>单据状态</th><th>监造形式</th><th>涉及人员</th>
                                    <th>制造厂区</th><th>汇总工时</th><th>有效折抵工时(天)</th><th>该时段排班占比</th>
                                    <th>定额单价(基数)</th><th>浮动系数乘子</th><th style="color:var(--text-danger);">倒算人员隐性成本(元)</th>
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
                                    <!-- 补充几行伪数据衬托复杂感 -->
                                    <tr>
                                        <td style="text-align:center;"><input type="checkbox" disabled></td>
                                        <td><strong>PD-20260212-05</strong></td><td>已完结</td><td><span class="tag tag-cyan">巡检</span></td>
                                        <td>陈伟</td><td>大连重工</td><td class="text-right">14</td><td class="text-right">10</td><td class="text-right">50%</td>
                                        <td class="text-right">300.00</td><td class="text-right">1.0</td><td class="text-right text-muted">1,500.00</td><td class="text-right">3,000.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 纠偏录入与追回流向 -->
                    <div style="background:#fff;border:1px solid var(--border-color);border-radius:8px;padding:24px;">
                        <h4 style="margin:0 0 16px 0;font-size:15px;border-left:4px solid var(--blue);padding-left:10px;">📉 设置实际纠偏(修正)额度与流向单据</h4>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
                            <div class="form-group"><label class="form-label text-muted">选中原始基础额合规汇总(元)</label><input class="form-control" disabled :value="fmtM(correctTotal)" style="background:#f1f5f9;color:#0f172a;font-weight:bold;font-size:16px;"></div>
                            <div class="form-group"><label class="form-label required">本期执行纠正金额扣减/增加(元)</label><input class="form-control" type="number" v-model.number="correctForm.amount" placeholder="例如：-2000 表示追回已报产值" style="font-size:16px;border-color:var(--orange);"></div>
                            <div class="form-group"><label class="form-label">冲抵追溯至外部合同CI单据号 (跨账本用)</label><input class="form-control" type="text" v-model="correctForm.srcCode" placeholder="输入CI并敲击回车联想目标合同..."></div>
                            <div class="form-group" style="grid-column: span 3;"><label class="form-label required">纠偏审计依据与备注 (不少于10字)</label><textarea class="form-control" v-model="correctForm.reason" rows="3" placeholder="因考勤打卡错误报销差额...因此发起追溯"></textarea></div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer" style="flex-shrink:0;padding:16px 24px;">
                    <button class="btn btn-outline" @click="correctModal=null" style="padding:10px 20px;">放弃修改，返回</button>
                    <button class="btn btn-warning" @click="submitCorrect" :disabled="!correctForm.amount || !correctForm.reason" style="padding:10px 20px;">✓ 确认账目冲销并留档提交</button>
                </div>
            </div>
        </div>

        <!-- 历史弹窗保持基础 -->
    </div>
    `
};
"""

components_js_path = os.path.join(base_dir, "components.js")
with open(components_js_path, "r", encoding="utf-8") as f:
    comps = f.read()

# Replace the existing IncomePage block
# It starts at "const IncomePage = {" and ends at the next block or end of file
pattern = r"const IncomePage = \{.*?\n\};\n"
comps = re.sub(pattern, new_income_page + "\n", comps, flags=re.DOTALL)

with open(components_js_path, "w", encoding="utf-8") as f:
    f.write(comps)
