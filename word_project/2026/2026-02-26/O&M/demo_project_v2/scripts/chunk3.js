// ==================== 执行管理 ====================
const ExecutionPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, computed } = Vue;
        const data = computed(() => props.data || []);

        const editModal = ref(null);
        function openEdit(r) { editModal.value = r; }

        return { data, fmt, editModal, openEdit };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>执行管理 <small>(28个字段)</small></h1>
            <div class="role-badge">当前角色：<strong>项目经理</strong> — 角色查看权限可配置</div>
        </div>
        
        <div class="info-panel">
            <h3>📋 项目执行状态说明（三色灯标识，可配置字典）</h3>
            <div class="legend-row">
                <span class="status-light gray"></span> 未开始：当前时间≤实际开始时间或无实际开始时间 &nbsp;|&nbsp;
                <span class="status-light blue"></span> 进行中：实际开始≤当前时间＜实际结束 &nbsp;|&nbsp;
                <span class="status-light green"></span> 已完成：当前时间≥实际结束时间
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">⏰ 超期规则：当前时间 > 计划结束时，计划结束标红 | 📐 产值计算参照收入模块</div>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
                    <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>监造厂家</th>
                    <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
                    <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>平台</th><th>中石化</th>
                    <th>设备名称</th><th>数量</th>
                    <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
                    <th style="min-width:80px">操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(r,i) in data" :key="r.pdCode">
                        <td>{{ i+1 }}</td><td>{{ r.ciCode }}</td><td>李明</td><td>PRJ-001</td><td>石化工程</td><td>周磊</td>
                        <td>{{ r.pdCode }}</td><td>周磊</td>
                        <td class="text-right">{{ fmt(r.output*1.2) }}</td><td class="text-right">{{ fmt(r.output*0.1) }}</td><td>东方锅炉</td>
                        <td>{{ r.name }}</td><td>王五</td><td><span class="tag" :class="r.type==='驻厂'?'tag-blue':'tag-cyan'">{{ r.type }}</span></td>
                        <td>2026-01-20</td><td :class="{'text-danger': i===0}">2026-02-28</td>
                        <td>2026-01-22</td><td>—</td>
                        <td><span class="status-light" :class="i===2?'gray':'blue'"></span></td><td>34</td>
                        <td>是</td><td>是</td><td>换热器</td><td>4</td>
                        <template v-if="r.type==='驻厂'">
                            <td>✅是</td><td>✅是</td><td><span class="tag tag-orange">中</span></td><td>✅是</td><td>❌否</td><td>✅是</td><td>✅是</td>
                        </template>
                        <template v-else>
                            <td colspan="7" class="text-muted text-center">—</td>
                        </template>
                        <td>
                            <button class="btn-mini btn-primary" v-if="r.type==='驻厂'" @click="openEdit(r)">编辑</button>
                            <button class="btn-mini btn-outline" v-else disabled title="巡检无业务状态流">编辑</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 执行编辑弹窗 -->
        <div class="modal-overlay" v-if="editModal" @click.self="editModal=null">
            <div class="modal modal-md">
                <div class="modal-header"><h3>编辑业务状态流 - {{ editModal.pdCode }}</h3><button class="modal-close" @click="editModal=null">✕</button></div>
                <div class="modal-body">
                    <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">编辑驻厂监造的业务状态流字段（巡检无数据）</div>
                    <div class="form-grid">
                        <div class="form-group"><label class="form-label">大纲是否已编制审核</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">细则是否已编制审核</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">风险评估报告风险等级</label><select class="form-control"><option>低</option><option selected>中</option><option>高</option></select></div>
                        <div class="form-group"><label class="form-label">依据性文件现场是否拿到</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">监理工程师交接申请</label><select class="form-control"><option>有</option><option selected>无</option></select></div>
                        <div class="form-group"><label class="form-label">ITP是否已确认并发给委托方</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group"><label class="form-label">预检会是否召开并有会议纪要</label><select class="form-control"><option>是</option><option>否</option></select></div>
                        <div class="form-group full"><label class="form-label">备注</label><textarea class="form-control"></textarea></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline" @click="editModal=null">取消</button><button class="btn btn-primary" @click="editModal=null;showToast('保存成功')">保存</button></div>
            </div>
        </div>
    </div>
    `
};

// ==================== 工时记录 ====================
const WorkhourPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, computed } = Vue;
        const data = computed(() => props.data || []);

        const level2Modal = ref(null);
        function openLevel2(r) { level2Modal.value = r; }

        return { data, fmtM, level2Modal, openLevel2 };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>工时记录 <small>(以合同号为维度 - 方案一)</small></h1>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>制造厂</th><th>监造金额(元)</th>
                    <th>项目负责人</th><th>合同签订时间</th><th>合同起始时间</th><th>合同终止日期</th><th>合同形式</th><th>工时(天)</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr v-for="(c,i) in data" :key="c.ciCode">
                        <td>{{ i+1 }}</td><td>{{ c.ciCode }}</td><td>{{ c.name }}</td><td>{{ c.client }}</td><td>{{ c.factory }}</td>
                        <td class="text-right">{{ fmtM(c.amount) }}</td><td>{{ ['李明','王芳','陈伟'][i%3] }}</td>
                        <td>2026-01-15</td><td>2026-01-20</td><td>2026-12-31</td>
                        <td><span class="tag" :class="c.contractForm==='人工日'?'tag-blue':'tag-green'">{{ c.contractForm }}</span></td>
                        <td class="text-right font-bold">{{ c.contractForm==='人工日'? 158 : 0 }}</td>
                        <td><button class="btn-mini btn-primary" @click="openLevel2(c)">查看明细</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 二级弹窗 -->
        <div class="modal-overlay" v-if="level2Modal" @click.self="level2Modal=null" style="z-index:999;">
            <div class="modal modal-xl">
                <div class="modal-header"><h3>工时明细展示 (以人员派单维度) - {{ level2Modal.ciCode }}</h3><button class="modal-close" @click="level2Modal=null">✕</button></div>
                <div class="modal-body">
                    <p style="margin-bottom:12px;font-size:12px;color:var(--text-muted)">此层级为人员派单维度的工时汇总，可穿透查看具体某人的日历打卡情况。</p>
                    <table class="data-table">
                        <thead style="background:#f8fafc"><tr>
                            <th>姓名</th><th>派单编号</th><th>有效折抵工时(天)</th><th>异常打卡(次)</th><th>最后打卡</th>
                        </tr></thead>
                        <tbody>
                            <tr><td>李明</td><td>PD-20260115-01</td><td class="font-bold">120</td><td class="text-danger">2</td><td>2026-02-28</td></tr>
                            <tr><td>王五</td><td>PD-20260212-05</td><td class="font-bold">38</td><td class="text-success">0</td><td>2026-02-27</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
};

// ==================== 监理人员动态 ====================
const PersonnelPage = {
    props: ['role', 'data'],
    setup(props) {
        const { ref, reactive } = Vue;
        const level2Modal = ref(null);
        function openLevel2() { level2Modal.value = true; }

        const level3Modal = ref(null);
        const days = Array.from({ length: 35 }, (_, i) => ({ n: (i < 3 ? 0 : i - 2 > 28 ? 0 : i - 2), s: i % 7 === 0 ? '休' : (i % 5 === 0 ? '异常' : '正常') }));
        function openLevel3() { level3Modal.value = true; }

        return { level2Modal, openLevel2, level3Modal, openLevel3, days };
    },
    template: `
    <div>
        <div class="page-title-row">
            <h1>监理人员动态 <small>(一级-人员信息)</small></h1>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead><tr>
                    <th>#</th><th>姓名</th><th>性别</th><th>民族</th><th>政治面貌</th><th>文化程度</th><th>身份证号</th>
                    <th>出生年月</th><th>年龄</th><th>入职日期</th><th>毕业院校</th><th>专业</th><th>职称</th><th>监理师证书</th><th>操作</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>1</td><td>张三</td><td>男</td><td>汉族</td><td>党员</td><td>本科</td><td>510***********1234</td>
                        <td>1990-05</td><td>35</td><td>2018-06-01</td><td>四川大学</td><td>机械工程</td><td>高工</td><td>JLZ-2020-001</td>
                        <td><button class="btn-mini btn-primary" @click="openLevel2">查看派单</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 二级弹窗：所有派单 -->
        <div class="modal-overlay" v-if="level2Modal" @click.self="level2Modal=false" style="z-index:999;">
            <div class="modal modal-xl">
                <div class="modal-header"><h3>张三 - 所属项目派单列表 (以人员为维度)</h3><button class="modal-close" @click="level2Modal=false">✕</button></div>
                <div class="modal-body">
                    <table class="data-table">
                        <thead style="background:#f8fafc"><tr>
                            <th>派单号</th><th>监理编号</th><th>状态</th><th>工时</th><th>操作</th>
                        </tr></thead>
                        <tbody>
                            <tr><td>PD-20260115-01</td><td>CI-2026-001</td><td><span class="status status-active">进行中</span></td><td>120</td><td><button class="btn-mini btn-primary" @click="openLevel3">打卡日历</button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 三级弹窗：打卡日历 -->
        <div class="modal-overlay" v-if="level3Modal" @click.self="level3Modal=false" style="z-index:1000;">
            <div class="modal modal-lg">
                <div class="modal-header"><h3>张三 - (PD-20260115-01) 2026年2月 打卡日历</h3><button class="modal-close" @click="level3Modal=false">✕</button></div>
                <div class="modal-body">
                    <div class="calendar-grid">
                        <div class="cal-header">日</div><div class="cal-header">一</div><div class="cal-header">二</div><div class="cal-header">三</div><div class="cal-header">四</div><div class="cal-header">五</div><div class="cal-header">六</div>
                        <div v-for="(d,i) in days" :key="i" class="cal-day" :class="{empty: d.n===0}" style="border:1px solid #e2e8f0;">
                            <template v-if="d.n!==0">
                                <div class="cal-day-num">{{ d.n }}</div>
                                <div style="font-size:10px;" :class="d.s==='正常'?'text-success':d.s==='异常'?'text-danger':'text-muted'">{{ d.s }}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};
