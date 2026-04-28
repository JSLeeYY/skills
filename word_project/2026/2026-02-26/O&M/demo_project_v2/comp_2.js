// ===== comp_2.js — ExecutionPage 执行管理 + WorkhourPage 工时记录 =====

// ==================== 执行管理 (28字段) ====================
const ExecutionPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const editModal = ref(null);
    const editForm = reactive({ outline: '是', detail: '是', riskLevel: '低风险', deliveryNote: '有' });

    function statusLight(s) { return s === '进行中' ? 'blue' : s === '已完成' ? 'green' : 'gray'; }
    function isOverdue(planEnd) { return planEnd && new Date(planEnd) < new Date(); }
    function openEdit(row) {
      Object.assign(editForm, { outline: row.outline || '是', detail: row.detail || '是', riskLevel: row.riskLevel || '低风险', deliveryNote: row.deliveryNote || '有' });
      editModal.value = row;
    }
    function saveEdit() { showToast('技术文件状态已保存：' + editModal.value.dispatchCode); editModal.value = null; }

    return { data, role, editModal, editForm, statusLight, isOverdue, openEdit, saveEdit, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>执行管理 <small>(28个字段)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 角色查看权限可配置</span>
        </div>

        <!-- 状态说明面板 -->
        <div style="background:var(--blue-light);border:1px solid rgba(64,158,255,0.2);border-radius:var(--radius);padding:14px 18px;margin-bottom:16px;">
            <h3 style="font-size:13px;margin-bottom:6px;color:var(--blue);">📋 项目执行状态说明（三色灯标识，可配置字典）</h3>
            <div style="font-size:12px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#c0c4cc;box-shadow:0 0 6px #c0c4cc;vertical-align:middle;"></span> 未开始 &nbsp;|&nbsp;
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--blue);box-shadow:0 0 6px var(--blue);vertical-align:middle;"></span> 进行中 &nbsp;|&nbsp;
                <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);vertical-align:middle;"></span> 已完成
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">⏰ 超期规则：当前时间 > 计划结束时间时，计划结束时间标红 &nbsp;|&nbsp; 📐 总产值/当月产值计算公式参照项目收入模块</div>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>项目编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>派单编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>监造方式</label><select><option>全部</option><option>驻厂</option><option>巡检</option></select></div>
                <div class="filter-item"><label>执行状态</label><select><option>全部</option><option>未开始</option><option>进行中</option><option>已完成</option></select></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-success" @click="doExport('执行管理')">📥 导出</button>
            </div>
        </div>

        <!-- 宽表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
                    <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>监造厂家</th>
                    <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
                    <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
                    <th>设备名称</th><th>数量</th><th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
                    <th style="min-width:80px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r, i) in data" :key="i">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>{{ r.manager }}</td><td>{{ r.projectCode }}</td><td>{{ r.projectName }}</td><td>{{ r.director }}</td>
                        <td>{{ r.dispatchCode }}</td><td>{{ r.directorRep }}</td>
                        <td class="text-right">{{ fmt(r.totalOutput) }}</td><td class="text-right">{{ fmt(r.monthOutput) }}</td><td>{{ r.factory }}</td>
                        <td>{{ r.assignee }}</td><td>{{ r.assistant || '—' }}</td>
                        <td><span class="tag" :class="r.method==='驻厂'?'tag-blue':'tag-cyan'">{{ r.method }}</span></td>
                        <td>{{ r.planStart }}</td>
                        <td :class="isOverdue(r.planEnd) ? 'text-danger' : ''">{{ r.planEnd }}</td>
                        <td>{{ r.actualStart || '—' }}</td><td>{{ r.actualEnd || '—' }}</td>
                        <td><span style="display:inline-block;width:14px;height:14px;border-radius:50;vertical-align:middle;" :style="{background: statusLight(r.execStatus)==='blue'?'var(--blue)':statusLight(r.execStatus)==='green'?'var(--green)':'#c0c4cc', boxShadow:'0 0 6px '+(statusLight(r.execStatus)==='blue'?'var(--blue)':statusLight(r.execStatus)==='green'?'var(--green)':'#c0c4cc')}" :title="r.execStatus"></span></td>
                        <td>{{ r.workDays || '—' }}</td><td>{{ r.platform || '—' }}</td><td>{{ r.sinopec || '—' }}</td>
                        <td>{{ r.deviceName || '—' }}</td><td>{{ r.deviceQty || '—' }}</td>
                        <td>{{ r.outline==='是'?'✅是':'❌否' }}</td><td>{{ r.detail==='是'?'✅是':'❌否' }}</td>
                        <td><span class="tag" :class="r.riskLevel==='高'?'tag-orange':r.riskLevel==='低'?'tag-green':'tag-orange'">{{ r.riskLevel || '—' }}</span></td>
                        <td>{{ r.basisDoc==='是'?'✅是':'❌否' }}</td><td>{{ r.handover==='是'?'❌否':'❌否' }}</td>
                        <td>{{ r.itp==='是'?'✅是':'❌否' }}</td><td>{{ r.preInspection==='是'?'✅是':'❌否' }}</td>
                        <td>
                            <button class="btn-mini btn-primary" v-if="r.method==='驻厂'" @click="openEdit(r)">编辑</button>
                            <button class="btn-mini btn-outline" v-else disabled title="巡检无业务状态流">编辑</button>
                        </td>
                    </tr>
                    <tr v-if="!data.length"><td colspan="32" style="text-align:center;padding:40px;color:var(--text-muted);">暂无数据</td></tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ data.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 编辑技术文件管控状态弹窗 -->
        <div class="modal-overlay" v-if="editModal" @click.self="editModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>编辑技术文件管控状态</h3><button class="modal-close" @click="editModal=null">✕</button></div>
                <div class="modal-body">
                    <div class="form-grid" style="grid-template-columns:1fr 1fr;">
                        <div class="form-group"><label class="form-label">大纲出具</label><select class="form-control" v-model="editForm.outline"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">细则出具</label><select class="form-control" v-model="editForm.detail"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">预控风险级</label><select class="form-control" v-model="editForm.riskLevel"><option>低风险</option><option>中风险</option><option>高风险</option></select></div>
                        <div class="form-group"><label class="form-label">交接清单发函</label><select class="form-control" v-model="editForm.deliveryNote"><option>有</option><option>无</option></select></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" @click="editModal=null">取消</button>
                    <button class="btn btn-primary" @click="saveEdit">存储该项目档案状态</button>
                </div>
            </div>
        </div>
    </div>
    `
};

// ==================== 工时记录 ====================
const WorkhourPage = {
  props: ['role', 'data'],
  setup(props) {
    const data = computed(() => props.data || []);
    const role = computed(() => props.role);
    const showAdvFilter = ref(false);
    const detailModal = ref(null);
    // 日历数据
    const calMonth = ref(new Date().getMonth() + 1);
    const calYear = ref(new Date().getFullYear());
    const calDays = computed(() => new Date(calYear.value, calMonth.value, 0).getDate());
    const calFirstDay = computed(() => new Date(calYear.value, calMonth.value - 1, 1).getDay());
    const signDays = [3, 5, 6, 8, 9, 10, 13, 15, 16, 17, 20, 23, 24, 25, 27];

    function openLevel2(c) {
      detailModal.value = c;
    }

    return { data, role, showAdvFilter, detailModal, calMonth, calYear, calDays, calFirstDay, signDays, openLevel2, fmt, fmtM };
  },
  template: `
    <div>
        <div class="page-title-row">
            <h1>工时记录 <small>(以合同号为维度)</small></h1>
            <span class="role-badge">当前角色：<strong>{{ role }}</strong> — 查看有权限的合同号(CI编号)工时信息</span>
        </div>

        <!-- 筛选面板 -->
        <div class="filter-panel">
            <div class="filter-row">
                <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>委托方</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>制造厂</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>项目负责人</label><input type="text" placeholder="请输入"></div>
                <div class="filter-item"><label>合同形式</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
            </div>
            <div class="filter-row" v-show="showAdvFilter">
                <div class="filter-item"><label>监造金额范围</label><input type="text" placeholder="最小~最大"></div>
                <div class="filter-item"><label>合同签订时间</label><input type="date"></div>
                <div class="filter-item"><label>合同起始日期</label><input type="date"></div>
                <div class="filter-item"><label>合同终止日期</label><input type="date"></div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary" @click="showToast('查询成功')">🔍 查询</button>
                <button class="btn btn-outline" @click="showToast('已重置')">↻ 重置</button>
                <button class="btn btn-outline" @click="showAdvFilter=!showAdvFilter">⚡ {{ showAdvFilter ? '收起' : '高级查询' }}</button>
                <button class="btn btn-success" @click="doExport('工时记录')">📥 导出</button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>制造厂</th><th>监造金额(元)</th>
                    <th>项目负责人</th><th>合同签订时间</th><th>合同起始时间</th><th>合同终止日期</th><th>合同形式</th><th>工时(天)</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(c, i) in data" :key="c.ciCode">
                        <td>{{ i+1 }}</td><td>{{ c.ciCode }}</td><td>{{ c.name }}</td><td>{{ c.client }}</td><td>{{ c.factory }}</td>
                        <td class="text-right">{{ fmtM(c.amount) }}</td><td>{{ c.manager }}</td>
                        <td>{{ c.signDate }}</td><td>{{ c.startDate }}</td><td>{{ c.endDate }}</td>
                        <td><span class="tag" :class="c.contractForm==='人工日'?'tag-blue':c.contractForm==='总价'?'tag-green':'tag-purple'">{{ c.contractForm }}</span></td>
                        <td class="text-right"><strong>{{ c.workhours || 158 }}</strong></td>
                        <td><button class="btn-mini btn-primary" @click="openLevel2(c)">查看</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination"><span>共 <strong>{{ data.length }}</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>

        <!-- 工时二级明细弹窗（含日历） -->
        <div class="modal-overlay" v-if="detailModal" @click.self="detailModal=null">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>工时明细 — {{ detailModal.ciCode }} {{ detailModal.name }}</h3><button class="modal-close" @click="detailModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="margin-bottom:16px;">
                        <h4 style="font-size:14px;margin-bottom:12px;">📅 {{ calYear }}年{{ calMonth }}月 签到日历</h4>
                        <div class="calendar-grid">
                            <div class="cal-header" v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</div>
                            <div class="cal-day empty" v-for="n in calFirstDay" :key="'e'+n"></div>
                            <div class="cal-day" v-for="d in calDays" :key="d" :style="signDays.includes(d) ? 'background:var(--green-light)' : ''">
                                <div class="cal-day-num">{{ d }}</div>
                                <span v-if="signDays.includes(d)" class="cal-dot" style="background:var(--green)"></span>
                            </div>
                        </div>
                        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);">
                            <span class="cal-dot" style="background:var(--green);width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:4px;"></span>已签到 {{ signDays.length }} 天
                        </div>
                    </div>

                    <h4 style="font-size:14px;margin-bottom:12px;">👥 派遣人员签到记录</h4>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead><tr><th>姓名</th><th>派单编号</th><th>角色</th><th>本月工时(天)</th><th>累计工时(天)</th><th>签到率</th></tr></thead>
                            <tbody>
                                <tr><td>张三</td><td>PD-20260115-01</td><td>监理工程师</td><td>22</td><td>64</td><td><span class="tag tag-green">91.7%</span></td></tr>
                                <tr><td>李四</td><td>PD-20260115-01</td><td>辅助人员</td><td>20</td><td>34</td><td><span class="tag tag-blue">83.3%</span></td></tr>
                                <tr><td>陈伟</td><td>PD-20260115-02</td><td>辅助人员</td><td>18</td><td>34</td><td><span class="tag tag-orange">75.0%</span></td></tr>
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
