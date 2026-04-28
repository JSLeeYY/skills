// ===== pages.js - 动态注入各模块详细页面内容 =====

// ==================== 执行管理 ====================
document.getElementById('page-execution').innerHTML = `
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
    <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
        ⏰ 超期规则：当前时间 > 计划结束时间时，计划结束时间标红 &nbsp;|&nbsp;
        📐 总产值/当月产值计算公式参照项目收入模块
    </div>
</div>
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
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="doExport('执行管理')">📥 导出</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>监理编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
            <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>监造厂家</th>
            <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
            <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
            <th>设备名称</th><th>数量</th>
            <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
            <th style="min-width:80px">操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>CI-2026-001</td><td>李明</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-01</td><td>周磊</td>
                <td class="text-right">220,000</td><td class="text-right">18,400</td><td>东方锅炉</td>
                <td>张三</td><td>李四, 陈伟</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td class="text-danger">2026-02-28</td>
                <td>2026-01-22</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>34</td>
                <td>是</td><td>是</td><td>换热器</td><td>4</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-orange">中</span></td><td>✅是</td><td>❌否</td><td>✅是</td><td>✅是</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260115-01')">编辑</button></td>
            </tr>
            <tr>
                <td>2</td><td>CI-2026-001</td><td>李明</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-02</td><td>周磊</td>
                <td class="text-right">118,800</td><td class="text-right">10,400</td><td>东方锅炉</td>
                <td>王五</td><td>赵六</td><td><span class="tag tag-cyan">巡检</span></td>
                <td>2026-01-25</td><td>2026-03-15</td>
                <td>2026-01-26</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>30</td>
                <td>否</td><td>是</td><td>换热器</td><td>4</td>
                <td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td>
                <td><button class="btn-mini btn-outline" disabled title="巡检无业务状态流">编辑</button></td>
            </tr>
            <tr>
                <td>3</td><td>CI-2026-002</td><td>王芳</td><td>PRJ-002</td><td>石油压力容器B项</td><td>郑华</td>
                <td>PD-20260120-01</td><td>郑华</td>
                <td class="text-right">500,000</td><td class="text-right">120,000</td><td>哈尔滨锅炉</td>
                <td>孙七</td><td>吴八, 周九</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td>2027-06-30</td>
                <td>—</td><td>—</td>
                <td><span class="status-light gray" title="未开始"></span></td><td>—</td>
                <td>是</td><td>否</td><td>压力容器</td><td>2</td>
                <td>❌否</td><td>❌否</td><td><span class="tag tag-green">低</span></td><td>❌否</td><td>❌否</td><td>❌否</td><td>❌否</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260120-01')">编辑</button></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination"><span>共 <strong>3</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>
`;

// ==================== 监理人员动态 ====================
document.getElementById('page-personnel').innerHTML = `
<div class="page-title-row">
    <h1>监理人员动态 <small>(一级-人员信息)</small></h1>
    <div class="role-badge">当前角色：<strong>项目经理</strong></div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>性别</label><select><option>全部</option><option>男</option><option>女</option></select></div>
        <div class="filter-item"><label>民族</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>政治面貌</label><select><option>全部</option><option>党员</option><option>团员</option><option>群众</option></select></div>
        <div class="filter-item"><label>文化程度</label><select><option>全部</option><option>本科</option><option>硕士</option><option>博士</option><option>大专</option></select></div>
        <div class="filter-item"><label>职称</label><input type="text" placeholder="请输入"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
    </div>
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
                <td>1990-05</td><td>35</td><td>2018-06-01</td><td>四川大学</td><td>机械工程</td><td>高级工程师</td><td>JLZ-2020-001</td>
                <td><button class="btn-mini btn-primary" onclick="showPersonnelLevel2('张三')">查看派单</button></td>
            </tr>
            <tr>
                <td>2</td><td>李四</td><td>男</td><td>汉族</td><td>团员</td><td>硕士</td><td>320***********5678</td>
                <td>1992-08</td><td>33</td><td>2019-03-15</td><td>哈尔滨工业大学</td><td>焊接技术</td><td>工程师</td><td>JLZ-2021-003</td>
                <td><button class="btn-mini btn-primary" onclick="showPersonnelLevel2('李四')">查看派单</button></td>
            </tr>
            <tr>
                <td>3</td><td>陈伟</td><td>男</td><td>汉族</td><td>群众</td><td>本科</td><td>430***********9012</td>
                <td>1988-11</td><td>37</td><td>2016-09-01</td><td>大连理工大学</td><td>化工设备</td><td>高级工程师</td><td>JLZ-2019-005</td>
                <td><button class="btn-mini btn-primary" onclick="showPersonnelLevel2('陈伟')">查看派单</button></td>
            </tr>
            <tr>
                <td>4</td><td>王五</td><td>男</td><td>汉族</td><td>党员</td><td>大专</td><td>210***********3456</td>
                <td>1985-03</td><td>41</td><td>2012-07-20</td><td>辽宁石化学院</td><td>石油化工</td><td>高级工程师</td><td>JLZ-2018-002</td>
                <td><button class="btn-mini btn-primary" onclick="showPersonnelLevel2('王五')">查看派单</button></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination"><span>共 <strong>4</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>
`;

// ==================== 工时记录 ====================
document.getElementById('page-workhour').innerHTML = `
<div class="page-title-row">
    <h1>工时记录 <small>(以合同号为维度 - 方案一)</small></h1>
    <div class="role-badge">当前角色：<strong>项目经理</strong> — 查看有权限的合同号(CI编号)工时信息</div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>委托方</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>制造厂</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>项目负责人</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>合同形式</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
    </div>
    <div class="filter-row" id="workhourAdvFilter" style="display:none;">
        <div class="filter-item"><label>监造金额范围</label><input type="text" placeholder="最小~最大"></div>
        <div class="filter-item"><label>合同签订时间</label><input type="date"></div>
        <div class="filter-item"><label>合同起始日期</label><input type="date"></div>
        <div class="filter-item"><label>合同终止日期</label><input type="date"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-outline" onclick="toggleAdvFilter('workhourAdvFilter',this)">⚡ 高级查询</button>
        <button class="btn btn-success" onclick="doExport('工时记录')">📥 导出</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>监理编号</th><th>合同名称</th><th>委托方</th><th>制造厂</th><th>监造金额(元)</th>
            <th>项目负责人</th><th>合同签订时间</th><th>合同起始时间</th><th>合同终止日期</th><th>合同形式</th><th>工时(天)</th><th>操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>CI-2026-001</td><td>某石化换热器监造</td><td>中国石化</td><td>东方锅炉</td>
                <td class="text-right">580,000</td><td>李明</td><td>2026-01-15</td><td>2026-01-20</td><td>2026-12-31</td>
                <td><span class="tag tag-blue">人工日</span></td><td class="text-right"><strong>158</strong></td>
                <td><button class="btn-mini btn-primary" onclick="showWorkhourLevel2('CI-2026-001','某石化换热器监造')">查看</button></td>
            </tr>
            <tr>
                <td>2</td><td>CI-2026-002</td><td>压力容器制造监理</td><td>中国石油</td><td>哈尔滨锅炉</td>
                <td class="text-right">1,200,000</td><td>王芳</td><td>2026-01-08</td><td>2026-01-15</td><td>2027-06-30</td>
                <td><span class="tag tag-green">总价</span></td><td class="text-right"><strong>0</strong></td>
                <td><button class="btn-mini btn-primary" onclick="showWorkhourLevel2('CI-2026-002','压力容器制造监理')">查看</button></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination"><span>共 <strong>2</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>
`;

// ==================== 开票明细管理 ====================
document.getElementById('page-invoice').innerHTML = `
<div class="page-title-row">
    <h1>开票明细管理 <small>(不对接ERP，从ERP导出后Excel导入)</small></h1>
    <div class="role-badge">当前角色：<strong>财务</strong> — 权限为配置项</div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>开票时间起始</label><input type="date"></div>
        <div class="filter-item"><label>开票时间结束</label><input type="date"></div>
        <div class="filter-item"><label>合同负责人</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>凭证号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>审批结果</label><select><option>全部</option><option>暂存</option><option>审批中</option><option>已通过</option><option>已驳回</option></select></div>
    </div>
    <div class="filter-row" id="invoiceAdvFilter" style="display:none;">
        <div class="filter-item"><label>开票组织</label><select><option>全部</option><option>总公司</option><option>分公司</option></select></div>
        <div class="filter-item"><label>币种</label><select><option>全部</option><option>CNY</option><option>USD</option><option>EUR</option></select></div>
        <div class="filter-item"><label>项目名称</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>金额范围</label><input type="text" placeholder="最小~最大"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-outline" onclick="toggleAdvFilter('invoiceAdvFilter',this)">⚡ 高级筛选</button>
        <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
        <button class="btn btn-success" onclick="showImportDialog('开票明细')">📤 Excel导入</button>
        <button class="btn btn-primary" onclick="showInvoiceAddDialog()">➕ 新增</button>
        <button class="btn btn-outline" onclick="doExport('开票明细')">📥 导出</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>开票组织</th><th>开票客户</th><th>开票日期</th><th>发票号</th><th>币种</th>
            <th>总数量</th><th>总金额(元)</th><th>预计回款时间</th><th>合同负责人</th><th>监理编号</th>
            <th>项目名称</th><th>凭证号</th><th>备注</th><th>流程状态</th><th>审批结果</th><th style="min-width:180px">操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>总公司</td><td>中国石化</td><td>2026-02-10</td><td>FP-202602-001</td><td>CNY</td>
                <td>1</td><td class="text-right">100,000</td><td>2026-03-10</td><td>李明</td><td>CI-2026-001</td>
                <td>石化换热器A项</td><td>PZ-001</td><td>—</td>
                <td><span class="status status-done">已完成</span></td><td><span class="tag tag-green">已通过</span></td>
                <td><button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看</button></td>
            </tr>
            <tr>
                <td>2</td><td>总公司</td><td>中国石化</td><td>2026-01-20</td><td>FP-202601-003</td><td>CNY</td>
                <td>1</td><td class="text-right">100,000</td><td>2026-02-20</td><td>李明</td><td>CI-2026-001</td>
                <td>石化换热器A项</td><td>PZ-002</td><td>—</td>
                <td><span class="status status-done">已完成</span></td><td><span class="tag tag-green">已通过</span></td>
                <td><button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看</button></td>
            </tr>
            <tr>
                <td>3</td><td>分公司</td><td>中国石油</td><td>2026-01-25</td><td>FP-202601-005</td><td>CNY</td>
                <td>2</td><td class="text-right">500,000</td><td>2026-04-01</td><td>王芳</td><td>CI-2026-002</td>
                <td>石油压力容器B项</td><td>—</td><td>—</td>
                <td><span class="status status-pending">审批中</span></td><td><span class="tag tag-orange">待审批</span></td>
                <td>
                    <button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看</button>
                </td>
            </tr>
            <tr>
                <td>4</td><td>总公司</td><td>中海油</td><td>—</td><td>—</td><td>CNY</td>
                <td>—</td><td class="text-right">—</td><td>—</td><td>陈伟</td><td>CI-2026-003</td>
                <td>海油管道安装C项</td><td>—</td><td>待开票</td>
                <td><span class="status status-terminated">暂存</span></td><td><span class="tag tag-blue">暂存</span></td>
                <td>
                    <button class="btn-mini btn-primary" onclick="showInvoiceEditDialog()">修改</button>
                    <button class="btn-mini btn-danger" onclick="showConfirmDialog('确认删除此条暂存数据？','删除确认')">删除</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination"><span>共 <strong>4</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>
`;

// ==================== 回款明细管理 ====================
document.getElementById('page-payment').innerHTML = `
<div class="page-title-row">
    <h1>回款明细管理</h1>
    <div class="role-badge">当前角色：<strong>财务</strong> — 需与产值、收入、开票表关联合并展现</div>
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
    <div class="filter-row" id="paymentAdvFilter" style="display:none;">
        <div class="filter-item"><label>回款金额(最小)</label><input type="number" placeholder="0"></div>
        <div class="filter-item"><label>回款金额(最大)</label><input type="number" placeholder="999999"></div>
        <div class="filter-item"><label>金额排序</label><select><option>默认</option><option>金额升序</option><option>金额降序</option></select></div>
        <div class="filter-item"><label>备注</label><input type="text" placeholder="模糊搜索"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-outline" onclick="toggleAdvFilter('paymentAdvFilter',this)">⚡ 高级筛选</button>
        <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
        <button class="btn btn-primary" onclick="showPaymentAddDialog()">➕ 新增</button>
        <button class="btn btn-info" onclick="showPaymentSummaryDialog()">📊 汇总</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>监理编号</th><th>对方单位</th><th>项目名称</th><th>项目经理</th>
            <th>回款金额(元)</th><th>回款时间</th><th>流程状态</th><th>审批结果</th><th style="min-width:180px">操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>CI-2026-001</td><td>中国石化</td><td>石化换热器A项</td><td>李明</td>
                <td class="text-right">80,000</td><td>2026-02-05</td>
                <td><span class="status status-done">已完成</span></td><td><span class="tag tag-green">已通过</span></td>
                <td><button class="btn-mini btn-primary" onclick="showPaymentDetail()">查看</button></td>
            </tr>
            <tr>
                <td>2</td><td>CI-2026-001</td><td>中国石化</td><td>石化换热器A项</td><td>李明</td>
                <td class="text-right">70,000</td><td>2026-01-20</td>
                <td><span class="status status-done">已完成</span></td><td><span class="tag tag-green">已通过</span></td>
                <td><button class="btn-mini btn-primary" onclick="showPaymentDetail()">查看</button></td>
            </tr>
            <tr>
                <td>3</td><td>CI-2026-002</td><td>中国石油</td><td>石油压力容器B项</td><td>王芳</td>
                <td class="text-right">400,000</td><td>2026-01-20</td>
                <td><span class="status status-done">已完成</span></td><td><span class="tag tag-green">已通过</span></td>
                <td><button class="btn-mini btn-primary" onclick="showPaymentDetail()">查看</button></td>
            </tr>
            <tr>
                <td>4</td><td>CI-2026-002</td><td>中国石油</td><td>石油压力容器B项</td><td>王芳</td>
                <td class="text-right">50,000</td><td>—</td>
                <td><span class="status status-rejected">已驳回</span></td><td><span class="tag tag-orange">已驳回</span></td>
                <td>
                    <button class="btn-mini btn-info" onclick="showPaymentResubmitDialog()">重新提交</button>
                    <button class="btn-mini btn-danger" onclick="showConfirmDialog('确认删除此条驳回数据？','删除确认')">删除</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination"><span>共 <strong>4</strong> 条</span><div class="pagination-btns"><button class="btn-page active">1</button></div></div>
`;

// ==================== 提醒设置 ====================
document.getElementById('page-reminder').innerHTML = `
<div class="page-title-row">
    <h1>开票 | 回款提醒设置</h1>
    <div class="role-badge">支持角色：<strong>合同负责人</strong>(权限内) / <strong>财务、管理员</strong>(所有) — 需消息模板管理</div>
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
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
        <button class="btn btn-primary" onclick="showReminderAddDialog()">➕ 新增提醒</button>
        <button class="btn btn-outline" onclick="showReminderFreqDict()">⚙️ 频率字典</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>类型</th><th>合同类型</th><th>委托方</th><th>监理编号</th><th>超期时间(天)</th>
            <th>提醒频率</th><th>来源</th><th>状态</th><th style="min-width:180px">操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td><span class="tag tag-blue">开票</span></td><td>人工日</td><td>中国石化</td><td>CI-2026-001</td><td>30</td>
                <td>每周</td><td><span class="tag tag-cyan">系统</span></td><td><span class="status status-active">开启</span></td>
                <td>
                    <button class="btn-mini btn-warning" onclick="showConfirmDialog('确认关闭此条提醒？关闭后将停止推送。','关闭确认')">关闭</button>
                    <button class="btn-mini btn-danger" onclick="showConfirmDialog('确认删除此条提醒设置？','删除确认')">删除</button>
                </td>
            </tr>
            <tr>
                <td>2</td><td><span class="tag tag-green">回款</span></td><td>总价</td><td>中国石油</td><td>CI-2026-002</td><td>60</td>
                <td>每月</td><td><span class="tag tag-purple">用户设置</span></td><td><span class="status status-active">开启</span></td>
                <td>
                    <button class="btn-mini btn-warning" onclick="showConfirmDialog('确认关闭此条提醒？','关闭确认')">关闭</button>
                    <button class="btn-mini btn-danger" onclick="showConfirmDialog('确认删除？','删除确认')">删除</button>
                </td>
            </tr>
            <tr>
                <td>3</td><td><span class="tag tag-blue">开票</span></td><td>人工日计算总价</td><td>中海油</td><td>CI-2026-003</td><td>30</td>
                <td>每3天</td><td><span class="tag tag-cyan">系统</span></td><td><span class="status status-terminated">关闭</span></td>
                <td>
                    <button class="btn-mini btn-success" onclick="showConfirmDialog('确认开启此条提醒？将按规则推送站内消息至合同负责人(总监代表)。','开启确认')">开启</button>
                    <button class="btn-mini btn-danger" onclick="showConfirmDialog('确认删除？','删除确认')">删除</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;

// ==================== 动态成本核算 ====================
document.getElementById('page-cost').innerHTML = `
<div class="page-title-row">
    <h1>动态成本核算 <small>(动态成本管理-主页)</small></h1>
    <div class="role-badge">当前角色：<strong>项目经理</strong> — 点击各项成本跳转二级明细页</div>
</div>
<div class="formula-panel">
    <h3>📐 成本核算公式（封装为工具类统一管理）</h3>
    <div class="formula-grid">
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
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>监理编号</th><th>合同名称</th><th>总工时(天)</th>
            <th>人员成本(元)</th><th>差旅成本(元)</th><th>固定支出成本(元)</th><th>成本合计(元)</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>CI-2026-001</td><td>某石化换热器监造</td><td>158</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-001')">66,300.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-001')">4,200.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-001')">15,000.00</span></td>
                <td><strong>85,500.00</strong></td>
            </tr>
            <tr>
                <td>2</td><td>CI-2026-002</td><td>压力容器制造监理</td><td>0</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-002')">0.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-002')">0.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-002')">8,000.00</span></td>
                <td><strong>8,000.00</strong></td>
            </tr>
        </tbody>
    </table>
</div>
`;

// ==================== 差旅报销台账 ====================
document.getElementById('page-travel').innerHTML = `
<div class="page-title-row">
    <h1>差旅报销台账</h1>
    <div class="role-badge">权限：每人可导入自己数据 | 调整金额：财务和本人(本人仅按天数调整) | <span style="color:var(--blue);">出差天数/分摊天数/差旅成本可直接编辑</span></div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>出差单编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="showImportDialog('差旅报销')">📤 导入</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr><th>#</th><th>姓名</th><th>出差单编号</th><th>出差天数</th><th>分摊天数</th><th>差旅成本(元)</th><th>操作</th></tr></thead>
        <tbody>
            <tr><td>1</td><td>张三</td><td>CC-20260201-001</td>
                <td><input type="number" value="5" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="recalcTravelCost(this)"></td>
                <td><input type="number" value="3" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="recalcTravelCost(this)"></td>
                <td><input type="number" value="2400.00" step="0.01" style="width:100px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="showToast('差旅成本已更新为 ￥' + this.value)"></td>
                <td><button class="btn-mini btn-success" onclick="showToast('已保存修改')">💾 保存</button></td></tr>
            <tr><td>2</td><td>陈伟</td><td>CC-20260210-002</td>
                <td><input type="number" value="3" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="recalcTravelCost(this)"></td>
                <td><input type="number" value="3" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="recalcTravelCost(this)"></td>
                <td><input type="number" value="1800.00" step="0.01" style="width:100px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="showToast('差旅成本已更新为 ￥' + this.value)"></td>
                <td><button class="btn-mini btn-success" onclick="showToast('已保存修改')">💾 保存</button></td></tr>
            <tr><td>3</td><td>李四</td><td>CC-20260215-003</td>
                <td><input type="number" value="7" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="recalcTravelCost(this)"></td>
                <td><input type="number" value="4" min="0" style="width:60px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="recalcTravelCost(this)"></td>
                <td><input type="number" value="3200.00" step="0.01" style="width:100px;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="showToast('差旅成本已更新为 ￥' + this.value)"></td>
                <td><button class="btn-mini btn-success" onclick="showToast('已保存修改')">💾 保存</button></td></tr>
        </tbody>
    </table>
</div>
<div style="margin-top:8px;font-size:12px;color:var(--text-muted);">💡 出差天数、分摊天数和差旅成本列可直接在表格中修改，修改后点击「保存」按钮提交。无需跳转或刷新页面。</div>
`;

// ==================== 人员工资管理 ====================
document.getElementById('page-salary').innerHTML = `
<div class="page-title-row">
    <h1>人员工资管理 <small>(敏感数据-密文存储)</small></h1>
    <div class="role-badge">🔐 全权限控制：仅 <strong style="color:var(--red);">财务</strong> 角色可访问本页面</div>
</div>
<div class="info-panel">
    <h3>🔒 脱敏规则</h3>
    <div style="font-size:12px;color:var(--text-secondary);">
        工资为敏感项，所有数据密文存储。页面默认显示为 <code>****</code>，导出亦为 <code>****</code>。<br>
        <strong style="color:var(--red);">任何角色均无法点击查看明文工资</strong>，仅可通过导入功能更新工资数据。导入时若工资与已有记录不符，则记录已有数据为历史工资。
    </div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="showImportDialog('人员工资(支持单条/多条)')">📤 导入</button>
        <button class="btn btn-outline" onclick="doExport('人员工资(工资列为****)')">📥 导出</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr><th>#</th><th>账号</th><th>姓名</th><th>电话</th><th>部门</th><th>性别</th><th>工资(元/天)</th></tr></thead>
        <tbody>
            <tr><td>1</td><td>zhangsan</td><td>张三</td><td>138****1234</td><td>监造一部</td><td>男</td>
                <td><span class="salary-mask" style="color:var(--text-muted);user-select:none;">****</span></td></tr>
            <tr><td>2</td><td>lisi</td><td>李四</td><td>139****5678</td><td>监造一部</td><td>男</td>
                <td><span class="salary-mask" style="color:var(--text-muted);user-select:none;">****</span></td></tr>
            <tr><td>3</td><td>chenwei</td><td>陈伟</td><td>137****9012</td><td>监造二部</td><td>男</td>
                <td><span class="salary-mask" style="color:var(--text-muted);user-select:none;">****</span></td></tr>
            <tr><td>4</td><td>wangwu</td><td>王五</td><td>136****3456</td><td>监造二部</td><td>男</td>
                <td><span class="salary-mask" style="color:var(--text-muted);user-select:none;">****</span></td></tr>
        </tbody>
    </table>
</div>
`;

// ==================== 利润管理 ====================
document.getElementById('page-profit').innerHTML = `
<div class="page-title-row">
    <h1>利润管理</h1>
    <div class="role-badge">当前角色：<strong>项目经理</strong> — 利润为负时发送站内(PC+APP)提醒</div>
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
    <div class="filter-row" id="profitAdvFilter" style="display:none;">
        <div class="filter-item"><label>利润范围</label><input type="text" placeholder="最小~最大"></div>
        <div class="filter-item"><label>合同形式</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
        <div class="filter-item"><label>合同状态</label><select><option>全部</option><option>进行中</option><option>已完成</option><option>已终止</option></select></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="toggleAdvFilter('profitAdvFilter',this)">⚡ 高级查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="doExport('利润管理')">📥 导出</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>监理编号</th><th>合同名称</th><th>项目负责人</th><th>委托方</th><th>制造方</th>
            <th>总产值(元)</th><th>总成本(元)</th><th>利润(元)</th><th>操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>CI-2026-001</td><td>某石化换热器监造</td><td>李明</td><td>中国石化</td><td>东方锅炉</td>
                <td>338,800</td><td>85,500</td>
                <td><span class="profit-positive">+253,300</span></td>
                <td><button class="btn-mini btn-primary" onclick="showProfitChart('CI-2026-001')">📊 报表分析</button></td>
            </tr>
            <tr>
                <td>2</td><td>CI-2026-002</td><td>压力容器制造监理</td><td>王芳</td><td>中国石油</td><td>哈尔滨锅炉</td>
                <td>500,000</td><td>8,000</td>
                <td><span class="profit-positive">+492,000</span></td>
                <td><button class="btn-mini btn-primary" onclick="showProfitChart('CI-2026-002')">📊 报表分析</button></td>
            </tr>
            <tr>
                <td>3</td><td>CI-2026-003</td><td>管道安装监造项目</td><td>陈伟</td><td>中海油</td><td>大连重工</td>
                <td>0</td><td>45,200</td>
                <td><span class="profit-negative">-45,200 ⚠️</span></td>
                <td><button class="btn-mini btn-primary" onclick="showProfitChart('CI-2026-003')">📊 报表分析</button></td>
            </tr>
        </tbody>
    </table>
</div>
<div id="profitChartContainer" style="display:none;margin-top:16px;">
    <div style="background:var(--bg-card);border-radius:var(--radius);padding:20px;border:1px solid var(--border-color);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:15px;">📊 利润分析可视化</h3>
            <div style="display:flex;gap:8px;">
                <select id="profitChartType" onchange="updateProfitChart()" style="padding:5px 10px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
                    <option value="bar">柱状图</option><option value="line">折线图</option>
                </select>
                <button class="btn btn-outline" onclick="document.getElementById('profitChartContainer').style.display='none'">关闭</button>
            </div>
        </div>
        <div id="profitEchart" style="width:100%;height:400px;"></div>
    </div>
</div>
`;

// ==================== 经营数据量化 ====================
document.getElementById('page-report').innerHTML = `
<div class="page-title-row">
    <h1>经营数据量化</h1>
    <div class="role-badge">系统自动生成报表，支持自定义筛选和字段列</div>
</div>
<div class="tab-bar">
    <button class="tab-btn active" onclick="switchReportTab(this,'report-personnel')">👤 监理人员报表</button>
    <button class="tab-btn" onclick="switchReportTab(this,'report-contract')">📋 合同报表</button>
</div>
<div class="tab-content active" id="tab-report-personnel">
    <div class="filter-panel">
        <div class="filter-row">
            <div class="filter-item"><label>辅助人员</label><input type="text" placeholder="请输入"></div>
            <div class="filter-item"><label>时间范围</label><select><option>2026年</option><option>2025年</option><option>自定义时间段</option></select></div>
        </div>
        <div class="filter-actions">
            <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
            <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
            <button class="btn btn-success" onclick="doExport('监理人员报表')">📥 导出Excel</button>
        </div>
    </div>
    <div class="table-wrapper">
        <table class="data-table">
            <thead><tr><th>#</th><th>姓名</th><th>总工时(天)</th><th>参与项目数</th><th>总产值(元)</th><th>总成本(元)</th><th>利润(元)</th><th>人均产值</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>张三</td><td>64</td><td>2</td><td>160,000</td><td>36,800</td><td class="profit-positive">+123,200</td><td>2,500</td></tr>
                <tr><td>2</td><td>李四</td><td>34</td><td>1</td><td>85,000</td><td>22,100</td><td class="profit-positive">+62,900</td><td>2,500</td></tr>
                <tr><td>3</td><td>陈伟</td><td>34</td><td>1</td><td>85,000</td><td>30,600</td><td class="profit-positive">+54,400</td><td>2,500</td></tr>
                <tr><td>4</td><td>王五</td><td>30</td><td>1</td><td>75,000</td><td>18,000</td><td class="profit-positive">+57,000</td><td>2,500</td></tr>
            </tbody>
        </table>
    </div>
    <div id="personnelReportChart" style="width:100%;height:350px;margin-top:16px;background:var(--bg-card);border-radius:var(--radius);border:1px solid var(--border-color);"></div>
</div>
<div class="tab-content" id="tab-report-contract">
    <div class="filter-panel">
        <div class="filter-row">
            <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
            <div class="filter-item"><label>合同类型</label><select><option>全部</option><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
            <div class="filter-item"><label>时间范围</label><input type="month"></div>
        </div>
        <div class="filter-actions">
            <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
            <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
            <button class="btn btn-success" onclick="doExport('合同报表(自定义列)')">📥 导出Excel</button>
        </div>
    </div>
    <div class="table-wrapper">
        <table class="data-table">
            <thead><tr><th>#</th><th>监理编号</th><th>合同名称</th><th>合同类型</th><th>合同金额</th><th>总产值</th><th>总成本</th><th>利润</th><th>开票总金额</th><th>收款总金额</th><th>利润率</th></tr></thead>
            <tbody>
                <tr><td>1</td><td>CI-2026-001</td><td>某石化换热器监造</td><td><span class="tag tag-blue">人工日</span></td><td>580,000</td><td>338,800</td><td>85,500</td><td class="profit-positive">+253,300</td><td>200,000</td><td>150,000</td><td><strong>74.8%</strong></td></tr>
                <tr><td>2</td><td>CI-2026-002</td><td>压力容器制造监理</td><td><span class="tag tag-green">总价</span></td><td>1,200,000</td><td>500,000</td><td>8,000</td><td class="profit-positive">+492,000</td><td>500,000</td><td>400,000</td><td><strong>98.4%</strong></td></tr>
                <tr><td>3</td><td>CI-2026-003</td><td>管道安装监造项目</td><td><span class="tag tag-purple">人工日计算总价</span></td><td>860,000</td><td>0</td><td>45,200</td><td class="profit-negative">-45,200</td><td>0</td><td>0</td><td class="text-danger"><strong>-∞</strong></td></tr>
            </tbody>
        </table>
    </div>
    <div id="contractReportChart" style="width:100%;height:350px;margin-top:16px;background:var(--bg-card);border-radius:var(--radius);border:1px solid var(--border-color);"></div>
</div>
`;
