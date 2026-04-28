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
        <span class="status-light green"></span> 已完成：当前时间≥实际结束时间 &nbsp;|&nbsp;
        <span class="status-light red"></span> 超期警戒：执行中但计划结束时间已过
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
        ⏰ 超期规则：当前时间 > 计划结束时间时，计划结束时间标红 &nbsp;|&nbsp;
        📐 总产值/当月产值计算公式参照项目收入模块
    </div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>当前角色</label><select id="roleSelector" onchange="filterByRole(this.value)"><option value="admin">管理员/领导</option><option value="李明">合同负责人-李明</option><option value="王芳">合同负责人-王芳</option></select></div>
        <div class="filter-item"><label>监理编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>合同负责人</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>区域经理</label><input type="text" placeholder="支持多值搜索，如：张经理、李经理"></div>
        <div class="filter-item"><label>项目编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>派单编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>监造方式</label><select><option>全部</option><option>驻厂</option><option>巡检</option></select></div>
        <div class="filter-item"><label>执行状态</label><select><option>全部</option><option>未开始</option><option>进行中</option><option>已完成</option><option>超期警戒</option></select></div>
    </div>
    <div class="filter-row">
        <div class="filter-item"><label>项目总监</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>总监代表</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>制造厂</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>计划开始时间</label><input type="date"></div>
        <div class="filter-item"><label>计划结束时间</label><input type="date"></div>
        <div class="filter-item"><label>是否使用监造平台</label><select><option>全部</option><option>是</option><option>否</option></select></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="exportExecutionData()">📥 导出</button>
        <button id="executionColPickerBtn" class="btn btn-outline" onclick="openColPicker('executionTable', executionTableColumns, 'executionColPickerBtn')" title="列显示设置">⚙️ 列设置</button>
    </div>
</div>

<!-- 原始28字段完整列表 -->
<div class="table-wrapper">
    <table class="data-table" id="executionTable">
        <thead><tr>
            <th style="position:sticky;left:0;background:#fff;z-index:11;width:40px;white-space:nowrap;overflow:hidden">#</th>
            <th style="position:sticky;left:40px;background:#fff;z-index:11;width:110px;white-space:nowrap;overflow:hidden">合同编号</th>
            <th style="position:sticky;left:150px;background:#fff;z-index:11;width:90px;white-space:nowrap;overflow:hidden;box-shadow:2px 0 4px rgba(0,0,0,0.1)">合同负责人</th>
            <th>区域经理</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
            <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>制造厂</th>
            <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束 <button class="sort-btn" onclick="sortByOverdueDays()" title="按超期天数排序">⇅</button></th>
            <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
            <th>设备名称</th><th>数量</th>
            <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
            <th>派单变更</th>
            <th style="position:sticky;right:0;background:#fff;z-index:11;min-width:80px;box-shadow:-2px 0 4px rgba(0,0,0,0.1)">操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td style="position:sticky;left:0;background:#fff;z-index:10;white-space:nowrap;overflow:hidden">1</td>
                <td style="position:sticky;left:40px;background:#fff;z-index:10;white-space:nowrap;overflow:hidden"><a href="javascript:void(0)" onclick="showContractDetail('CI-2026-001')" style="color:var(--primary);text-decoration:underline">CI-2026-001</a></td>
                <td style="position:sticky;left:150px;background:#fff;z-index:10;white-space:nowrap;overflow:hidden;box-shadow:2px 0 4px rgba(0,0,0,0.1)">李明</td>
                <td>张经理</td>
                <td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-01</td><td>周磊</td>
                <td class="text-right">220,000</td><td class="text-right">18,400</td><td>东方锅炉</td>
                <td>张三</td><td>李四, 陈伟</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td class="text-danger">2026-02-28</td>
                <td>2026-01-22</td><td>—</td>
                <td><span class="status-light red" title="超期警戒"></span></td><td>34</td>
                <td>是</td><td>是</td><td>换热器</td><td>4</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-orange">中</span></td><td>✅是</td><td>❌否</td><td>✅是</td><td>✅是</td>
                <td><span class="tag tag-gray" onclick="showChangeLog('PD-20260115-01')" style="cursor:pointer">查看变更</span></td>
                <td style="position:sticky;right:0;background:#fff;z-index:10;box-shadow:-2px 0 4px rgba(0,0,0,0.1)"><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260115-01')">编辑</button></td>
            </tr>
            <tr>
                <td style="position:sticky;left:0;background:#fff;z-index:10;white-space:nowrap;overflow:hidden">2</td>
                <td style="position:sticky;left:40px;background:#fff;z-index:10;white-space:nowrap;overflow:hidden"><a href="javascript:void(0)" onclick="showContractDetail('CI-2026-001')" style="color:var(--primary);text-decoration:underline">CI-2026-001</a></td>
                <td style="position:sticky;left:150px;background:#fff;z-index:10;white-space:nowrap;overflow:hidden;box-shadow:2px 0 4px rgba(0,0,0,0.1)">李明</td>
                <td>张经理</td>
                <td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-02</td><td>周磊</td>
                <td class="text-right">118,800</td><td class="text-right">10,400</td><td>东方锅炉</td>
                <td>王五</td><td>赵六</td><td><span class="tag tag-cyan">巡检</span></td>
                <td>2026-01-25</td><td>2026-03-15</td>
                <td>2026-01-26</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>30</td>
                <td>否</td><td>是</td><td>换热器</td><td>4</td>
                <td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td>
                <td>/</td>
                <td style="position:sticky;right:0;background:#fff;z-index:10;box-shadow:-2px 0 4px rgba(0,0,0,0.1)"><button class="btn-mini btn-outline" disabled title="巡检无业务状态流">编辑</button></td>
            </tr>
            <tr>
                <td style="position:sticky;left:0;background:#fff;z-index:10;white-space:nowrap;overflow:hidden">3</td>
                <td style="position:sticky;left:40px;background:#fff;z-index:10;white-space:nowrap;overflow:hidden"><a href="javascript:void(0)" onclick="showContractDetail('CI-2026-002')" style="color:var(--primary);text-decoration:underline">CI-2026-002</a></td>
                <td style="position:sticky;left:150px;background:#fff;z-index:10;white-space:nowrap;overflow:hidden;box-shadow:2px 0 4px rgba(0,0,0,0.1)">王芳</td>
                <td>李经理</td>
                <td>PRJ-002</td><td>石油压力容器B项</td><td>郑华</td>
                <td>PD-20260120-01</td><td>郑华</td>
                <td class="text-right">500,000</td><td class="text-right">120,000</td><td>哈尔滨锅炉</td>
                <td>孙七</td><td>吴八, 周九</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td>2027-06-30</td>
                <td>—</td><td>—</td>
                <td><span class="status-light gray" title="未开始"></span></td><td></td>
                <td>是</td><td>否</td><td>压力容器</td><td>2</td>
                <td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td><span class="tag tag-green">低</span></td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td>
                <td>/</td>
                <td style="position:sticky;right:0;background:#fff;z-index:10;box-shadow:-2px 0 4px rgba(0,0,0,0.1)"><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260120-01')">编辑</button></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination"><span>共 <strong>3</strong> 条</span><div class="pagination-btns"><button class="btn-page" onclick="showToast('已是第一页')">上一页</button><button class="btn-page active">1</button><button class="btn-page" onclick="showToast('演示：切换到第2页')">2</button><button class="btn-page" onclick="showToast('演示：切换到第3页')">3</button><button class="btn-page" onclick="showToast('演示：下一页')">下一页</button></div></div>

<!-- 以下是合同-派单层级展示方案对比演示区域 -->
<div style="margin:32px 0 16px;padding:16px;background:#fffbeb;border:2px solid #fbbf24;border-radius:8px;">
    <h3 style="margin:0 0 8px;color:#92400e;font-size:15px;">💡 合同-派单层级展示方案对比</h3>
    <p style="margin:0;font-size:13px;color:#78350f;">以下提供三种不同的合同-派单层级展示方案供参考对比，点击Tab按钮切换查看不同方案的展示效果。</p>
</div>

<!-- 方案对比Tab切换 -->
<div style="background:#fff;padding:12px 20px;border-bottom:1px solid #e0e0e0;margin-bottom:16px;">
    <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-weight:600;color:#666;">合同-派单展示方案对比：</span>
        <button class="btn btn-outline" id="tabPlanA" onclick="switchExecutionPlan('A')" style="background:#1976d2;color:#fff;border-color:#1976d2;">方案A - 可展开行</button>
        <button class="btn btn-outline" id="tabPlanB" onclick="switchExecutionPlan('B')">方案B - 主从表</button>
        <button class="btn btn-outline" id="tabPlanC" onclick="switchExecutionPlan('C')">方案C - 分组表格</button>
        <span style="margin-left:auto;font-size:12px;color:#999;">👆 点击切换查看不同方案效果</span>
    </div>
</div>

<!-- 方案A：可展开行 -->
<div id="executionPlanA" class="table-wrapper">
    <div style="padding:8px 12px;background:#e3f2fd;border-left:3px solid #1976d2;margin-bottom:12px;font-size:13px;">
        <strong>方案A说明：</strong>点击合同行展开/折叠派单明细。合同行显示汇总信息，派单行显示全部28个字段的详细数据。
    </div>
    <table class="data-table" id="executionTableA">
        <thead><tr>
            <th style="width:50px">展开</th>
            <th style="width:60px">类型</th>
            <th>合同编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
            <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>制造厂</th>
            <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
            <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
            <th>设备名称</th><th>数量</th>
            <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
            <th>派单变更</th><th style="min-width:80px">操作</th>
        </tr></thead>
        <tbody>
            <!-- 合同1 -->
            <tr class="contract-row" style="background:#f5f5f5;font-weight:600;" onclick="toggleContract('contract1')">
                <td style="cursor:pointer;text-align:center;"><span id="icon-contract1">▶</span></td>
                <td>合同</td>
                <td><a href="javascript:void(0)" onclick="event.stopPropagation();showContractDetail('CI-2026-001')" style="color:var(--primary);text-decoration:underline">CI-2026-001</a></td>
                <td>李明</td>
                <td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td colspan="3"><span class="tag tag-orange">3个派单</span></td><td>/</td>
                <td>/</td><td>/</td><td>/</td><td>/</td><td class="text-danger">2026-02-28</td>
                <td>/</td><td>/</td><td><span class="status-light red" title="最严重：超期警戒"></span></td><td>64</td><td>/</td><td>/</td>
                <td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td>
                <td><button class="btn-mini btn-outline" onclick="event.stopPropagation();showContractDetail('CI-2026-001')">详情</button></td>
            </tr>
            <!-- 派单1-1 -->
            <tr class="dispatch-row" data-contract="contract1" style="display:none;">
                <td></td>
                <td style="padding-left:20px;">└派单</td>
                <td>CI-2026-001</td><td>李明</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-01</td><td>周磊</td>
                <td class="text-right">220,000</td><td class="text-right">18,400</td><td>东方锅炉</td>
                <td>张三</td><td>李四, 陈伟</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td class="text-danger">2026-02-28</td>
                <td>2026-01-22</td><td>—</td>
                <td><span class="status-light red" title="超期警戒"></span></td><td>34</td>
                <td>是</td><td>是</td><td>换热器</td><td>4</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-orange">中</span></td><td>✅是</td><td>❌否</td><td>✅是</td><td>✅是</td>
                <td><span class="tag tag-gray" onclick="showChangeLog('PD-20260115-01')" style="cursor:pointer">查看变更</span></td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260115-01')">编辑</button></td>
            </tr>
            <!-- 派单1-2 -->
            <tr class="dispatch-row" data-contract="contract1" style="display:none;">
                <td></td>
                <td style="padding-left:20px;">└派单</td>
                <td>CI-2026-001</td><td>李明</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-02</td><td>周磊</td>
                <td class="text-right">118,800</td><td class="text-right">10,400</td><td>东方锅炉</td>
                <td>王五</td><td>赵六</td><td><span class="tag tag-cyan">巡检</span></td>
                <td>2026-01-25</td><td>2026-03-15</td>
                <td>2026-01-26</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>30</td>
                <td>否</td><td>是</td><td>换热器</td><td>4</td>
                <td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td>
                <td>/</td>
                <td><button class="btn-mini btn-outline" disabled title="巡检无业务状态流">编辑</button></td>
            </tr>
            <!-- 派单1-3 -->
            <tr class="dispatch-row" data-contract="contract1" style="display:none;">
                <td></td>
                <td style="padding-left:20px;">└派单</td>
                <td>CI-2026-001</td><td>李明</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-03</td><td>周磊</td>
                <td class="text-right">200,000</td><td class="text-right">0</td><td>东方锅炉</td>
                <td>孙七</td><td>—</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-02-01</td><td>2026-03-10</td>
                <td>—</td><td>—</td>
                <td><span class="status-light" style="background:#ffa726;" title="暂停"></span></td><td>10</td>
                <td>是</td><td>是</td><td>换热器</td><td>4</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-green">低</span></td><td>✅是</td><td>✅是</td><td>✅是</td><td>❌否</td>
                <td>/</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260115-03')">编辑</button></td>
            </tr>

            <!-- 合同2 -->
            <tr class="contract-row" style="background:#f5f5f5;font-weight:600;" onclick="toggleContract('contract2')">
                <td style="cursor:pointer;text-align:center;"><span id="icon-contract2">▶</span></td>
                <td>合同</td>
                <td><a href="javascript:void(0)" onclick="event.stopPropagation();showContractDetail('CI-2026-002')" style="color:var(--primary);text-decoration:underline">CI-2026-002</a></td>
                <td>王芳</td>
                <td>PRJ-002</td><td>石油压力容器B项</td><td>郑华</td>
                <td colspan="3"><span class="tag tag-blue">1个派单</span></td><td>/</td>
                <td>/</td><td>/</td><td>/</td><td>/</td><td>2026-04-30</td>
                <td>/</td><td>/</td><td><span class="status-light blue" title="进行中"></span></td><td>30</td><td>/</td><td>/</td>
                <td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td>
                <td><button class="btn-mini btn-outline" onclick="event.stopPropagation();showContractDetail('CI-2026-002')">详情</button></td>
            </tr>
            <!-- 派单2-1 -->
            <tr class="dispatch-row" data-contract="contract2" style="display:none;">
                <td></td>
                <td style="padding-left:20px;">└派单</td>
                <td>CI-2026-002</td><td>王芳</td><td>PRJ-002</td><td>石油压力容器B项</td><td>郑华</td>
                <td>PD-20260120-01</td><td>郑华</td>
                <td class="text-right">500,000</td><td class="text-right">120,000</td><td>哈尔滨锅炉</td>
                <td>孙七</td><td>吴八, 周九</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td>2026-04-30</td>
                <td>2026-01-22</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>30</td>
                <td>是</td><td>否</td><td>压力容器</td><td>2</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-green">低</span></td><td>✅是</td><td>✅是</td><td>✅是</td><td>✅是</td>
                <td>/</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260120-01')">编辑</button></td>
            </tr>

            <!-- 合同3 -->
            <tr class="contract-row" style="background:#f5f5f5;font-weight:600;" onclick="toggleContract('contract3')">
                <td style="cursor:pointer;text-align:center;"><span id="icon-contract3">▶</span></td>
                <td>合同</td>
                <td><a href="javascript:void(0)" onclick="event.stopPropagation();showContractDetail('CI-2026-003')" style="color:var(--primary);text-decoration:underline">CI-2026-003</a></td>
                <td>赵六</td>
                <td>PRJ-003</td><td>海油管道安装C项</td><td>王五</td>
                <td colspan="3"><span class="tag tag-gray">2个派单</span></td><td>/</td>
                <td>/</td><td>/</td><td>/</td><td>/</td><td>2026-06-15</td>
                <td>/</td><td>/</td><td><span class="status-light gray" title="未开始"></span></td><td>/</td><td>/</td><td>/</td>
                <td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td><td>/</td>
                <td><button class="btn-mini btn-outline" onclick="event.stopPropagation();showContractDetail('CI-2026-003')">详情</button></td>
            </tr>
            <!-- 派单3-1 -->
            <tr class="dispatch-row" data-contract="contract3" style="display:none;">
                <td></td>
                <td style="padding-left:20px;">└派单</td>
                <td>CI-2026-003</td><td>赵六</td><td>PRJ-003</td><td>海油管道安装C项</td><td>王五</td>
                <td>PD-20260125-01</td><td>王五</td>
                <td class="text-right">0</td><td class="text-right">0</td><td>大连重工</td>
                <td>钱十</td><td>—</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-02-01</td><td>2026-05-20</td>
                <td>2026-02-03</td><td>2026-03-01</td>
                <td><span class="status-light" style="background:#424242;" title="已终止"></span></td><td>/</td>
                <td>是</td><td>否</td><td>管道</td><td>10</td>
                <td>✅是</td><td>❌否</td><td><span class="tag tag-orange">中</span></td><td>❌否</td><td>❌否</td><td>❌否</td><td>❌否</td>
                <td>/</td>
                <td><button class="btn-mini btn-outline" disabled>编辑</button></td>
            </tr>
            <!-- 派单3-2 -->
            <tr class="dispatch-row" data-contract="contract3" style="display:none;">
                <td></td>
                <td style="padding-left:20px;">└派单</td>
                <td>CI-2026-003</td><td>赵六</td><td>PRJ-003</td><td>海油管道安装C项</td><td>王五</td>
                <td>PD-20260125-02</td><td>王五</td>
                <td class="text-right">0</td><td class="text-right">0</td><td>大连重工</td>
                <td>—</td><td>—</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-05-01</td><td>2026-06-15</td>
                <td>—</td><td>—</td>
                <td><span class="status-light gray" title="未开始"></span></td><td>/</td>
                <td>是</td><td>否</td><td>管道</td><td>10</td>
                <td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td><span class="tag tag-green">低</span></td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td>
                <td>/</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260125-02')">编辑</button></td>
            </tr>
        </tbody>
    </table>
</div>

<!-- 方案B：主从表 -->
<div id="executionPlanB" class="table-wrapper" style="display:none;">
    <div style="padding:8px 12px;background:#e8f5e9;border-left:3px solid #4caf50;margin-bottom:12px;font-size:13px;">
        <strong>方案B说明：</strong>主表显示合同汇总信息（含派单数量），点击合同编号查看派单明细（下方展开区域）
    </div>
    <table class="data-table" id="executionTableB">
        <thead><tr>
            <th style="position:sticky;left:0;background:#fff;z-index:11;width:40px">#</th>
            <th style="position:sticky;left:40px;background:#fff;z-index:11;width:110px">合同编号</th>
            <th style="position:sticky;left:150px;background:#fff;z-index:11;width:90px;box-shadow:2px 0 4px rgba(0,0,0,0.1)">合同负责人</th>
            <th>项目总监</th><th>派单数量</th><th>综合状态</th><th>状态灯</th><th>计划结束</th><th>总用工(天)</th>
            <th style="min-width:80px">操作</th>
        </tr></thead>
        <tbody>
            <tr onclick="showDispatchDetail('CI-2026-001')" style="cursor:pointer;">
                <td style="position:sticky;left:0;background:#fff;z-index:10">1</td>
                <td style="position:sticky;left:40px;background:#fff;z-index:10"><a href="javascript:void(0)" onclick="event.stopPropagation();showContractDetail('CI-2026-001')" style="color:var(--primary);text-decoration:underline">CI-2026-001</a></td>
                <td style="position:sticky;left:150px;background:#fff;z-index:10;box-shadow:2px 0 4px rgba(0,0,0,0.1)">李明</td>
                <td>周磊</td>
                <td><span class="tag tag-orange">3个派单</span></td>
                <td>1超期/1结束/1暂停</td>
                <td><span class="status-light red" title="最严重：超期警戒"></span></td>
                <td class="text-danger">2026-02-28</td>
                <td>64</td>
                <td><button class="btn-mini btn-outline" onclick="event.stopPropagation();showContractDetail('CI-2026-001')">详情</button></td>
            </tr>
            <tr onclick="showDispatchDetail('CI-2026-002')" style="cursor:pointer;">
                <td style="position:sticky;left:0;background:#fff;z-index:10">2</td>
                <td style="position:sticky;left:40px;background:#fff;z-index:10"><a href="javascript:void(0)" onclick="event.stopPropagation();showContractDetail('CI-2026-002')" style="color:var(--primary);text-decoration:underline">CI-2026-002</a></td>
                <td style="position:sticky;left:150px;background:#fff;z-index:10;box-shadow:2px 0 4px rgba(0,0,0,0.1)">王芳</td>
                <td>李四</td>
                <td><span class="tag tag-blue">1个派单</span></td>
                <td>执行中</td>
                <td><span class="status-light blue" title="进行中"></span></td>
                <td>2026-04-30</td>
                <td>30</td>
                <td><button class="btn-mini btn-outline" onclick="event.stopPropagation();showContractDetail('CI-2026-002')">详情</button></td>
            </tr>
            <tr onclick="showDispatchDetail('CI-2026-003')" style="cursor:pointer;">
                <td style="position:sticky;left:0;background:#fff;z-index:10">3</td>
                <td style="position:sticky;left:40px;background:#fff;z-index:10"><a href="javascript:void(0)" onclick="event.stopPropagation();showContractDetail('CI-2026-003')" style="color:var(--primary);text-decoration:underline">CI-2026-003</a></td>
                <td style="position:sticky;left:150px;background:#fff;z-index:10;box-shadow:2px 0 4px rgba(0,0,0,0.1)">赵六</td>
                <td>王五</td>
                <td><span class="tag tag-gray">2个派单</span></td>
                <td>1终止/1未开始</td>
                <td><span class="status-light gray" title="未开始"></span></td>
                <td>2026-06-15</td>
                <td>/</td>
                <td><button class="btn-mini btn-outline" onclick="event.stopPropagation();showContractDetail('CI-2026-003')">详情</button></td>
            </tr>
        </tbody>
    </table>

    <!-- 派单明细展开区域 -->
    <div id="dispatchDetailArea" style="display:none;margin-top:16px;padding:16px;background:#f5f5f5;border-radius:4px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <h3 style="margin:0;font-size:14px;">合同 <span id="currentContractId" style="color:var(--primary);"></span> 的派单明细（全部28字段）</h3>
            <button class="btn-mini btn-outline" onclick="closeDispatchDetail()">✕ 关闭</button>
        </div>
        <div style="overflow-x:auto;">
            <table class="data-table" style="font-size:12px;">
                <thead><tr>
                    <th>#</th><th>合同编号</th><th>合同负责人</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
                    <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>制造厂</th>
                    <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
                    <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
                    <th>设备名称</th><th>数量</th>
                    <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
                    <th>派单变更</th><th>操作</th>
                </tr></thead>
                <tbody id="dispatchDetailBody">
                    <!-- 动态填充 -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- 方案C：分组表格 -->
<div id="executionPlanC" class="table-wrapper" style="display:none;">
    <div style="padding:8px 12px;background:#fff3e0;border-left:3px solid #ff9800;margin-bottom:12px;font-size:13px;">
        <strong>方案C说明：</strong>合同信息作为分组标题行，派单直接展示在下方，层级关系最清晰，一眼看到所有派单
    </div>
    <table class="data-table" id="executionTableC">
        <!-- 合同1分组 -->
        <thead style="background:#e3f2fd;"><tr>
            <th colspan="34" style="text-align:left;padding:12px;font-size:14px;">
                <button onclick="toggleContract('contract1')" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:8px;" title="展开/收起">▼</button>
                📋 合同：<a href="javascript:void(0)" onclick="showContractDetail('CI-2026-001')" style="color:var(--primary);text-decoration:underline">CI-2026-001</a>
                │ 负责人：李明 │ 总监：周磊 │ 状态：<span class="status-light red" title="超期警戒"></span> 超期警戒 │ 派单数：3个 │ 总产值：538,800 │ 当月产值：28,800
            </th>
        </tr></thead>
        <thead><tr style="background:#f5f5f5;">
            <th style="width:40px">#</th><th>合同编号</th><th>合同负责人</th><th>区域经理</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
            <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>制造厂</th>
            <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
            <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
            <th>设备名称</th><th>数量</th>
            <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
            <th>派单变更</th><th>操作</th>
        </tr></thead>
        <tbody id="contract1">
            <tr>
                <td>1.1</td>
                <td>CI-2026-001</td><td>李明</td><td>张经理</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-01</td><td>周磊</td>
                <td class="text-right">220,000</td><td class="text-right">18,400</td><td>东方锅炉</td>
                <td>张三</td><td>李四, 陈伟</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td class="text-danger">2026-02-28</td>
                <td>2026-01-22</td><td>—</td>
                <td><span class="status-light red" title="超期警戒"></span></td><td>34</td>
                <td>是</td><td>是</td><td>换热器</td><td>4</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-orange">中</span></td><td>✅是</td><td>❌否</td><td>✅是</td><td>✅是</td>
                <td><span class="tag tag-gray" onclick="showChangeLog('PD-20260115-01')" style="cursor:pointer">查看变更</span></td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260115-01')">编辑</button></td>
            </tr>
            <tr>
                <td>1.2</td>
                <td>CI-2026-001</td><td>李明</td><td>张经理</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-02</td><td>周磊</td>
                <td class="text-right">118,800</td><td class="text-right">10,400</td><td>东方锅炉</td>
                <td>王五</td><td>赵六</td><td><span class="tag tag-cyan">巡检</span></td>
                <td>2026-01-25</td><td>2026-03-15</td>
                <td>2026-01-26</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>30</td>
                <td>否</td><td>是</td><td>换热器</td><td>4</td>
                <td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td><td><span style="color:var(--text-muted)">—</span></td>
                <td>/</td>
                <td><button class="btn-mini btn-outline" disabled title="巡检无业务状态流">编辑</button></td>
            </tr>
            <tr>
                <td>1.3</td>
                <td>CI-2026-001</td><td>李明</td><td>张经理</td><td>PRJ-001</td><td>石化换热器A项</td><td>周磊</td>
                <td>PD-20260115-03</td><td>周磊</td>
                <td class="text-right">200,000</td><td class="text-right">0</td><td>东方锅炉</td>
                <td>孙七</td><td>—</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-02-01</td><td>2026-03-10</td>
                <td>—</td><td>—</td>
                <td><span class="status-light" style="background:#ffa726;" title="暂停"></span></td><td>10</td>
                <td>是</td><td>是</td><td>换热器</td><td>4</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-green">低</span></td><td>✅是</td><td>✅是</td><td>✅是</td><td>❌否</td>
                <td>/</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260115-03')">编辑</button></td>
            </tr>
        </tbody>

        <!-- 合同2分组 -->
        <thead style="background:#e8f5e9;"><tr>
            <th colspan="34" style="text-align:left;padding:12px;font-size:14px;">
                <button onclick="toggleContract('contract2')" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:8px;" title="展开/收起">▼</button>
                📋 合同：<a href="javascript:void(0)" onclick="showContractDetail('CI-2026-002')" style="color:var(--primary);text-decoration:underline">CI-2026-002</a>
                │ 负责人：王芳 │ 总监：郑华 │ 状态：<span class="status-light blue" title="进行中"></span> 进行中 │ 派单数：1个 │ 总产值：500,000 │ 当月产值：120,000
            </th>
        </tr></thead>
        <thead><tr style="background:#f5f5f5;">
            <th style="width:40px">#</th><th>合同编号</th><th>合同负责人</th><th>区域经理</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
            <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>制造厂</th>
            <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
            <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
            <th>设备名称</th><th>数量</th>
            <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
            <th>派单变更</th><th>操作</th>
        </tr></thead>
        <tbody id="contract2">
            <tr>
                <td>2.1</td>
                <td>CI-2026-002</td><td>王芳</td><td>李经理</td><td>PRJ-002</td><td>石油压力容器B项</td><td>郑华</td>
                <td>PD-20260120-01</td><td>郑华</td>
                <td class="text-right">500,000</td><td class="text-right">120,000</td><td>哈尔滨锅炉</td>
                <td>孙七</td><td>吴八, 周九</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-01-20</td><td>2026-04-30</td>
                <td>2026-01-22</td><td>—</td>
                <td><span class="status-light blue" title="进行中"></span></td><td>30</td>
                <td>是</td><td>否</td><td>压力容器</td><td>2</td>
                <td>✅是</td><td>✅是</td><td><span class="tag tag-green">低</span></td><td>✅是</td><td>✅是</td><td>✅是</td><td>✅是</td>
                <td>/</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260120-01')">编辑</button></td>
            </tr>
        </tbody>

        <!-- 合同3分组 -->
        <thead style="background:#f3e5f5;"><tr>
            <th colspan="34" style="text-align:left;padding:12px;font-size:14px;">
                <button onclick="toggleContract('contract3')" style="background:none;border:none;cursor:pointer;font-size:16px;margin-right:8px;" title="展开/收起">▼</button>
                📋 合同：<a href="javascript:void(0)" onclick="showContractDetail('CI-2026-003')" style="color:var(--primary);text-decoration:underline">CI-2026-003</a>
                │ 负责人：赵六 │ 总监：王五 │ 状态：<span class="status-light gray" title="未开始"></span> 未开始 │ 派单数：2个 │ 总产值：0 │ 当月产值：0
            </th>
        </tr></thead>
        <thead><tr style="background:#f5f5f5;">
            <th style="width:40px">#</th><th>合同编号</th><th>合同负责人</th><th>区域经理</th><th>项目编号</th><th>项目名称</th><th>项目总监</th>
            <th>派单编号</th><th>总监代表</th><th>总产值</th><th>当月产值</th><th>制造厂</th>
            <th>派遣人员</th><th>辅助人员</th><th>监造方式</th><th>计划开始</th><th>计划结束</th>
            <th>实际开始</th><th>实际结束</th><th>状态</th><th>用工(天)</th><th>监造平台</th><th>中石化</th>
            <th>设备名称</th><th>数量</th>
            <th>大纲</th><th>细则</th><th>风险</th><th>依据文件</th><th>交接</th><th>ITP</th><th>预检会</th>
            <th>派单变更</th><th>操作</th>
        </tr></thead>
        <tbody id="contract3">
            <tr>
                <td>3.1</td>
                <td>CI-2026-003</td><td>赵六</td><td>王经理</td><td>PRJ-003</td><td>海油管道安装C项</td><td>王五</td>
                <td>PD-20260125-01</td><td>王五</td>
                <td class="text-right">0</td><td class="text-right">0</td><td>大连重工</td>
                <td>钱十</td><td>—</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-02-01</td><td>2026-05-20</td>
                <td>2026-02-03</td><td>2026-03-01</td>
                <td><span class="status-light" style="background:#424242;" title="已终止"></span></td><td>/</td>
                <td>是</td><td>否</td><td>管道</td><td>10</td>
                <td>✅是</td><td>❌否</td><td><span class="tag tag-orange">中</span></td><td>❌否</td><td>❌否</td><td>❌否</td><td>❌否</td>
                <td>/</td>
                <td><button class="btn-mini btn-outline" disabled>编辑</button></td>
            </tr>
            <tr>
                <td>3.2</td>
                <td>CI-2026-003</td><td>赵六</td><td>王经理</td><td>PRJ-003</td><td>海油管道安装C项</td><td>王五</td>
                <td>PD-20260125-02</td><td>王五</td>
                <td class="text-right">0</td><td class="text-right">0</td><td>大连重工</td>
                <td>—</td><td>—</td><td><span class="tag tag-blue">驻厂</span></td>
                <td>2026-05-01</td><td>2026-06-15</td>
                <td>—</td><td>—</td>
                <td><span class="status-light gray" title="未开始"></span></td><td>/</td>
                <td>是</td><td>否</td><td>管道</td><td>10</td>
                <td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td><span class="tag tag-green">低</span></td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td><td class="text-danger" style="font-weight:600">❌否</td>
                <td>/</td>
                <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('PD-20260125-02')">编辑</button></td>
            </tr>
        </tbody>
    </table>
</div>

<div class="pagination"><span>共 <strong>3</strong> 个合同，<strong>6</strong> 个派单</span><div class="pagination-btns"><button class="btn-page" onclick="showToast('已是第一页')">上一页</button><button class="btn-page active">1</button><button class="btn-page" onclick="showToast('演示：切换到第2页')">2</button><button class="btn-page" onclick="showToast('演示：切换到第3页')">3</button><button class="btn-page" onclick="showToast('演示：下一页')">下一页</button></div></div>
`;

// ==================== 监理人员动态 ====================
document.getElementById('page-personnel').innerHTML = `
<div class="page-title-row">
    <h1>监理人员动态 <small>(一级-人员信息)</small></h1>
    <div class="role-badge">当前角色：
        <select id="personnelRoleSelector" onchange="switchPersonnelRole(this.value)" style="padding:4px 8px;border:1px solid #ddd;border-radius:4px;background:#fff;">
            <option value="项目总监">项目总监</option>
            <option value="项目经理" selected>项目经理</option>
            <option value="总监代表">总监代表</option>
            <option value="监理人员">监理人员</option>
            <option value="执行部/领导层/管理员">执行部/领导层/管理员</option>
            <option value="区域经理">区域经理</option>
        </select>
    </div>
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
    <div class="filter-row">
        <div class="filter-item"><label>出生年月(起)</label><input type="month"></div>
        <div class="filter-item"><label>出生年月(止)</label><input type="month"></div>
        <div class="filter-item"><label>年龄(最小)</label><input type="number" placeholder="最小"></div>
        <div class="filter-item"><label>年龄(最大)</label><input type="number" placeholder="最大"></div>
        <div class="filter-item"><label>入职日期(起)</label><input type="date"></div>
        <div class="filter-item"><label>入职日期(止)</label><input type="date"></div>
    </div>
    <div class="filter-row">
        <div class="filter-item"><label>毕业院校</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>专业</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>监理师证书</label><input type="text" placeholder="请输入"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="exportPersonnelData()">📥 导出</button>
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
<div class="pagination">
    <span>共 <strong>4</strong> 条</span>
    <div class="pagination-btns">
        <button class="btn-page" disabled>上一页</button>
        <button class="btn-page active">1</button>
        <button class="btn-page">2</button>
        <button class="btn-page">下一页</button>
    </div>
</div>
`;

// ==================== 监理人员动态 - 二级页面（人员派单列表） ====================
window.personnelLevel2HTML = `
<div class="modal-overlay" id="personnelLevel2Modal" style="display:flex;" onclick="backToPersonnelLevel1()">
    <div class="modal-content" style="width:1800px !important;height:900px !important;max-width:95vw !important;max-height:95vh !important;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 style="margin:0;font-size:16px;">派单总览 - <span id="personnelName"></span></h3>
            <button class="modal-close" onclick="backToPersonnelLevel1()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="filter-panel">
                <div class="filter-row">
                    <div class="filter-item"><label>派单编号</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>监造形式</label><select><option>全部</option><option>驻厂</option><option>巡检</option></select></div>
                    <div class="filter-item"><label>辅助人员</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>制造厂</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>总监代表</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>派单状态</label><select><option>全部</option><option>未开始</option><option>进行中</option><option>已完成</option><option>超期</option></select></div>
                </div>
                <div class="filter-row">
                    <div class="filter-item"><label>计划开始(起)</label><input type="date"></div>
                    <div class="filter-item"><label>计划开始(止)</label><input type="date"></div>
                    <div class="filter-item"><label>计划结束(起)</label><input type="date"></div>
                    <div class="filter-item"><label>计划结束(止)</label><input type="date"></div>
                    <div class="filter-item"><label>发起时间(起)</label><input type="date"></div>
                    <div class="filter-item"><label>发起时间(止)</label><input type="date"></div>
                </div>
                <div class="filter-row">
                    <div class="filter-item"><label>监造结束(起)</label><input type="date"></div>
                    <div class="filter-item"><label>监造结束(止)</label><input type="date"></div>
                    <div class="filter-item"><label>剩余天数(最小)</label><input type="number" placeholder="天"></div>
                    <div class="filter-item"><label>剩余天数(最大)</label><input type="number" placeholder="天"></div>
                    <div class="filter-item"><label>工时(最小)</label><input type="number" placeholder="天"></div>
                    <div class="filter-item"><label>工时(最大)</label><input type="number" placeholder="天"></div>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
                    <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
                    <button class="btn btn-success" onclick="exportDispatchData()">📥 导出</button>
                </div>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr>
                        <th>#</th><th>派单编号</th><th>监造形式</th><th>辅助人员</th><th>制造厂</th><th>总监代表</th>
                        <th>计划开始时间</th><th>计划结束时间</th><th>发起时间</th><th>派单状态</th>
                        <th>监造结束时间</th><th>剩余时间</th><th>工时(天)</th><th>操作</th>
                    </tr></thead>
                    <tbody id="personnelDispatchList">
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <span>共 <strong id="personnelDispatchCount">0</strong> 条派单</span>
                <div class="pagination-btns">
                    <button class="btn-page" disabled>上一页</button>
                    <button class="btn-page active">1</button>
                    <button class="btn-page">下一页</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ==================== 监理人员动态 - 三级页面（工时明细弹窗） ====================
window.personnelLevel3HTML = `
<div class="modal-overlay" id="personnelLevel3Modal" style="display:none;" onclick="closePersonnelLevel3()">
    <div class="modal-content" style="width:90vw;max-height:90vh;overflow-y:auto;" onclick="event.stopPropagation()">
        <div class="modal-header">
            <h3 style="margin:0;font-size:16px;">工时明细 - <span id="level3PersonnelName"></span> - <span id="level3DispatchId"></span></h3>
            <button class="modal-close" onclick="closePersonnelLevel3()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="filter-panel" style="margin-bottom:16px;">
                <div class="filter-row">
                    <div class="filter-item"><label>开始日期</label><input type="date"></div>
                    <div class="filter-item"><label>结束日期</label><input type="date"></div>
                    <div class="filter-item"><label>签到状态</label><select><option>全部</option><option>正常</option><option>迟到</option><option>早退</option><option>缺勤</option></select></div>
                    <div class="filter-item"><label>姓名</label><input type="text" placeholder="请输入"></div>
                    <div class="filter-item"><label>工时(最小)</label><input type="number" placeholder="小时"></div>
                    <div class="filter-item"><label>工时(最大)</label><input type="number" placeholder="小时"></div>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
                    <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
                    <button class="btn btn-success" onclick="exportWorkhourData()">📥 导出</button>
                </div>
            </div>
            <div class="table-wrapper" style="margin-bottom:16px;">
                <table class="data-table">
                    <thead><tr>
                        <th>#</th><th>姓名</th><th>日期</th><th>上班时间</th><th>下班时间</th><th>签到状态</th><th>工时</th>
                    </tr></thead>
                    <tbody id="workhourDetailBody">
                    </tbody>
                </table>
            </div>
            <div id="workhourCalendar" style="background:#fff;padding:16px;border-radius:8px;border:1px solid var(--border-color);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <button class="btn btn-outline" onclick="changeCalendarMonth(-1)">← 上一月</button>
                    <h4 style="margin:0;font-size:15px;" id="calendarTitle">2026年3月</h4>
                    <button class="btn btn-outline" onclick="changeCalendarMonth(1)">下一月 →</button>
                </div>
                <div id="calendarGrid"></div>
            </div>
        </div>
    </div>
</div>
`;

// ==================== 工时记录 ====================
document.getElementById('page-workhour').innerHTML = `
<div class="page-title-row">
    <h1>工时记录 <small>(以合同号为维度 - 方案一)</small></h1>
    <div class="role-badge">当前角色：<strong>项目经理</strong> — 查看有权限的合同号(CI编号)工时信息</div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>合同编号</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>委托方</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>制造厂</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>项目经理</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item"><label>合同形式</label><select><option>全部</option><option>开口合同</option><option>总价合同</option><option>框架协议合同</option></select></div>
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
            <th>#</th><th>合同编号</th><th>合同名称</th><th>委托方</th><th>制造厂</th><th>监造金额(元)</th>
            <th>项目经理</th><th>合同签订时间</th><th>合同起始时间</th><th>合同终止日期</th><th>合同形式</th><th>工时(天)</th><th>操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>CI-2026-001</td><td>某石化换热器监造</td><td>中国石化</td><td>东方锅炉</td>
                <td class="text-right">580,000</td><td>李明</td><td>2026-01-15</td><td>2026-01-20</td><td>2026-12-31</td>
                <td><span class="tag tag-blue">开口合同</span></td><td class="text-right"><strong>158</strong></td>
                <td><button class="btn-mini btn-primary" onclick="showWorkhourLevel2('CI-2026-001','某石化换热器监造')">查看</button></td>
            </tr>
            <tr>
                <td>2</td><td>CI-2026-002</td><td>压力容器制造监理</td><td>中国石油</td><td>哈尔滨锅炉</td>
                <td class="text-right">1,200,000</td><td>王芳</td><td>2026-01-08</td><td>2026-01-15</td><td>2027-06-30</td>
                <td><span class="tag tag-green">总价合同</span></td><td class="text-right"><strong>0</strong></td>
                <td><button class="btn-mini btn-primary" onclick="showWorkhourLevel2('CI-2026-002','压力容器制造监理')">查看</button></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination">
    <div style="display:flex; align-items:center; gap:16px;">
        <span>共 <strong>2</strong> 条记录</span>
        <select style="padding:4px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; outline:none;">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
        </select>
    </div>
    <div class="pagination-btns">
        <button class="btn-page" disabled>上一页</button>
        <button class="btn-page active">1</button>
        <button class="btn-page" disabled>下一页</button>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
        前往 <input type="number" value="1" style="width:40px; text-align:center; padding:4px; border:1px solid var(--border-color); border-radius:4px; outline:none;"> 页
    </div>
</div>
`;

// ==================== 开票明细管理 ====================
document.getElementById('page-invoice').innerHTML = `
<div class="page-title-row">
    <h1>开票明细管理 <small>(不对接ERP，支持Excel导入或手工录入)</small></h1>
    <div class="role-badge">当前角色：<strong>项目经理 / 财务</strong> — 核心操作：录入即生效汇入台账集，纯数据留存</div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>合同编号</label><input type="text" placeholder="精准搜索"></div>
        <div class="filter-item"><label>开票时间起始</label><input type="date"></div>
        <div class="filter-item"><label>开票时间结束</label><input type="date"></div>
        <div class="filter-item"><label>项目经理</label><input type="text" placeholder="模糊搜索"></div>
        <div class="filter-item"><label>发票号</label><input type="text" placeholder="精确匹配"></div>
        <div class="filter-item"><label>凭证号</label><input type="text" placeholder="精确匹配"></div>
    </div>
    <div class="filter-row" id="invoiceAdvFilter" style="display:none;">
        <div class="filter-item"><label>开票组织</label><select><option>全部</option><option>总公司</option><option>分公司</option></select></div>
        <div class="filter-item"><label>币种</label><select><option>全部</option><option>CNY</option><option>USD</option><option>EUR</option></select></div>
        <div class="filter-item"><label>项目名称</label><input type="text" placeholder="模糊搜索"></div>
        <div class="filter-item"><label>开票总金额</label><input type="number" placeholder="最小金额"></div>
        <div class="filter-item"><label style="opacity:0;">至</label><input type="number" placeholder="最大金额"></div>
        <div class="filter-item"><label>备注内容</label><input type="text" placeholder="模糊搜索"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('检索成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置条件')">↻ 重置</button>
        <button class="btn btn-outline" onclick="toggleAdvFilter('invoiceAdvFilter',this)">⚡ 高级展开</button>
        <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
        <button class="btn btn-success" onclick="showImportDialog('开票明细')">📤 Excel导入</button>
        <button class="btn btn-primary" onclick="showInvoiceAddDialog()">➕ 新增开票</button>
        <button class="btn btn-outline" onclick="doExport('开票明细')">📥 导出明细</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th><th>开票组织</th><th>开票客户</th><th>开票日期</th><th>发票号</th><th>币种</th>
            <th>总数量</th><th>总金额(元)</th><th>预计回款时间</th><th>项目经理</th><th>合同编号</th>
            <th>项目名称</th><th>凭证号</th><th>填报备注</th><th style="min-width:80px;text-align:center;">操作</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td>总公司</td><td>中国石化</td><td>2026-02-10</td><td>FP-202602-001</td><td>CNY</td>
                <td>1</td><td class="text-right" style="font-weight:600;color:var(--blue)">100,000</td><td>2026-03-10</td><td>李明</td><td>CI-2026-001</td>
                <td>石化换热器A项</td><td>PZ-001</td><td style="color:var(--text-muted)">第一期进度款</td>
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看详情</button>
                </td>
            </tr>
            <tr>
                <td>2</td><td>总公司</td><td>中国石化</td><td>2026-01-20</td><td>FP-202601-003</td><td>CNY</td>
                <td>1</td><td class="text-right" style="font-weight:600;color:var(--blue)">100,000</td><td>2026-02-20</td><td>李明</td><td>CI-2026-001</td>
                <td>石化换热器A项</td><td>PZ-002</td><td style="color:var(--text-muted)">—</td>
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看详情</button>
                </td>
            </tr>
            <tr>
                <td>3</td><td>分公司</td><td>中国石油</td><td>2026-01-25</td><td>FP-202601-005</td><td>CNY</td>
                <td>2</td><td class="text-right" style="font-weight:600;color:var(--blue)">500,000</td><td>2026-04-01</td><td>王芳</td><td>CI-2026-002</td>
                <td>石油压力容器B项</td><td>—</td><td style="color:var(--text-muted)">节点二验收款</td>
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看详情</button>
                </td>
            </tr>
            <tr>
                <td>4</td><td>总公司</td><td>中海油</td><td>2026-02-28</td><td>FP-202602-008</td><td>CNY</td>
                <td>1</td><td class="text-right" style="font-weight:600;color:var(--blue)">200,000</td><td>2026-03-25</td><td>陈伟</td><td>CI-2026-003</td>
                <td>海油管道安装C项</td><td>PZ-009</td><td style="color:var(--text-muted)">—</td>
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showInvoiceDetail()">查看详情</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination">
    <div style="display:flex; align-items:center; gap:16px;">
        <span>共 <strong>4</strong> 条记录</span>
        <select style="padding:4px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; outline:none;">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
        </select>
    </div>
    <div class="pagination-btns">
        <button class="btn-page" disabled>上一页</button>
        <button class="btn-page active">1</button>
        <button class="btn-page">2</button>
        <button class="btn-page">...</button>
        <button class="btn-page">8</button>
        <button class="btn-page">下一页</button>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
        前往 <input type="number" value="1" style="width:40px; text-align:center; padding:4px; border:1px solid var(--border-color); border-radius:4px; outline:none;"> 页
    </div>
</div>
`;

// ==================== 回款明细管理 ====================
document.getElementById('page-payment').innerHTML = `
<div class="page-title-row">
    <h1>回款明细管理</h1>
    <div class="role-badge">当前角色：<strong>项目经理 / 财务</strong> — 核心操作：录入即销账，无繁杂审批</div>
</div>
<div class="filter-panel">
    <div class="filter-row">
        <div class="filter-item"><label>合同编号</label><input type="text" placeholder="精确查找"></div>
        <div class="filter-item"><label>回款时间起始</label><input type="date"></div>
        <div class="filter-item"><label>回款时间结束</label><input type="date"></div>
        <div class="filter-item"><label>项目名称</label><input type="text" placeholder="模糊查找"></div>
        <div class="filter-item"><label>项目经理</label><input type="text" placeholder="模糊查找"></div>
        <div class="filter-item"><label>备注说明</label><input type="text" placeholder="模糊搜索"></div>
    </div>
    <div class="filter-row" id="paymentAdvFilter" style="display:none;">
        <div class="filter-item"><label>回款金额(最小)</label><input type="number" placeholder="0"></div>
        <div class="filter-item"><label>回款金额(最大)</label><input type="number" placeholder="999999"></div>
        <div class="filter-item"><label>金额排序</label><select><option>倒序(默认)</option><option>金额升序</option><option>金额降序</option></select></div>
        <div class="filter-item"><label>对方单位</label><input type="text" placeholder="模糊查找"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('检索成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置条件')">↻ 重置</button>
        <button class="btn btn-outline" onclick="toggleAdvFilter('paymentAdvFilter',this)">⚡ 高级展开</button>
        <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
        <button class="btn btn-success" onclick="showImportDialog('回款明细')">📤 Excel导入</button>
        <button class="btn btn-primary" onclick="showPaymentAddDialog()">➕ 新增回款记录</button>
        <button class="btn btn-info" onclick="showPaymentSummaryDialog()" style="background:#8b5cf6;border-color:#8b5cf6">📊 多维业绩大盘汇总</button>
        <button class="btn btn-outline" onclick="doExport('回款明细台账')">📥 导出明细</button>
    </div>
</div>
<div style="background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; padding:8px 12px; border-radius:6px; font-size:12px; margin-bottom:12px; display:flex; gap:8px;">
    <span>💡 <strong>上帝视角提示：</strong></span>
    <span>回款记录列表中同步嵌入了该合同维度的【财务与造价核心指针】，方便各级领导在查阅单笔回款时，一眼望穿该项目的盈亏完结进度。</span>
</div>
<div class="table-wrapper" style="overflow-x:auto;">
    <table class="data-table" style="min-width: 1500px;">
        <thead>
            <tr>
                <th rowspan="2" style="background:#f8fafc;border-right:1px solid #e2e8f0;text-align:center;">#</th>
                <th colspan="5" style="background:#f1f5f9;text-align:center;border-right:1px solid #cbd5e1;color:#334155;">当前登记台账信息</th>
                <th colspan="7" style="background:#fefce8;text-align:center;border-right:1px solid #fde047;color:#854d0e;">🔮 项目维度上帝视角 (穿透显示)</th>
                <th rowspan="2" style="background:#f8fafc;text-align:center;color:#334155;min-width:100px;border-left:1px solid #e2e8f0;">操作区</th>
            </tr>
            <tr>
                <!-- 本次录入 -->
                <th>合同编号</th><th>对方单位</th><th>回款时间</th><th>关联发票说明</th><th style="border-right:1px solid #cbd5e1;">当次回款金额</th>
                <!-- 上帝视角穿透 -->
                <th style="background:#fffbeb;">签约总额</th><th style="background:#fffbeb;">已报产值</th><th style="background:#fffbeb;">历史总开票</th>
                <th style="background:#fffbeb;">待开票缺口</th><th style="background:#fffbeb;color:#b45309">未收款余额</th>
                <th style="background:#fffbeb;color:#1d4ed8">当次兑付率</th><th style="background:#fffbeb;color:#047857;">收款完结度</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border-right:1px solid #e2e8f0;text-align:center;">1</td>
                <td style="font-weight:600">CI-2026-001</td><td>中国石化</td><td>2026-02-05</td><td style="color:var(--text-muted);font-size:12px;">自动抵扣发票 FP-202602-001</td>
                <td class="text-right" style="border-right:1px solid #cbd5e1;font-weight:700;color:var(--green);font-size:15px;">80,000</td>
                
                <td class="text-right" style="color:var(--text-muted)">1,200,000</td>
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--text-muted)">600,000</td>
                <td class="text-right" style="color:var(--orange)">200,000</td>
                <td class="text-right" style="font-weight:600;color:#b45309;">520,000</td>
                <td class="text-right" style="font-weight:600;color:#1d4ed8;background:rgba(29,78,216,0.05)">13.3%</td>
                <td class="text-right" style="border-right:1px solid #fde047;font-weight:600;color:#047857;background:rgba(4,120,87,0.05)">6.6%</td>
                
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showPaymentDetail()">查阅水单</button>
                </td>
            </tr>
            <tr>
                <td style="border-right:1px solid #e2e8f0;text-align:center;">2</td>
                <td style="font-weight:600">CI-2026-002</td><td>中国石油</td><td>2026-01-20</td><td style="color:var(--text-muted);font-size:12px;">自动抵扣发票 FP-202601-005</td>
                <td class="text-right" style="border-right:1px solid #cbd5e1;font-weight:700;color:var(--green);font-size:15px;">400,000</td>
                
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--orange)">0</td>
                <td class="text-right" style="font-weight:600;color:#b45309;">400,000</td>
                <td class="text-right" style="font-weight:600;color:#1d4ed8;background:rgba(29,78,216,0.05)">50.0%</td>
                <td class="text-right" style="border-right:1px solid #fde047;font-weight:600;color:#047857;background:rgba(4,120,87,0.05)">50.0%</td>
                
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showPaymentDetail()">查阅水单</button>
                </td>
            </tr>
            <tr>
                <td style="border-right:1px solid #e2e8f0;text-align:center;">3</td>
                <td style="font-weight:600">CI-2026-002</td><td>中国石油</td><td>2026-03-01</td><td style="color:var(--text-muted);font-size:12px;">自动抵扣发票 FP-202601-005</td>
                <td class="text-right" style="border-right:1px solid #cbd5e1;font-weight:700;color:var(--green);font-size:15px;">400,000</td>
                
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--text-muted)">800,000</td>
                <td class="text-right" style="color:var(--orange)">0</td>
                <td class="text-right" style="font-weight:600;color:#b45309;">0</td>
                <td class="text-right" style="font-weight:600;color:#1d4ed8;background:rgba(29,78,216,0.05)">50.0%</td>
                <td class="text-right" style="border-right:1px solid #fde047;font-weight:600;color:#047857;background:rgba(4,120,87,0.05)">100.0%</td>
                
                <td style="text-align:center;">
                    <button class="btn-mini btn-primary" onclick="showPaymentDetail()">查阅水单</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination">
    <div style="display:flex; align-items:center; gap:16px;">
        <span>共 <strong>3</strong> 条记录</span>
        <select style="padding:4px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; outline:none;">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
        </select>
    </div>
    <div class="pagination-btns">
        <button class="btn-page" disabled>上一页</button>
        <button class="btn-page active">1</button>
        <button class="btn-page">2</button>
        <button class="btn-page">下一页</button>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
        前往 <input type="number" value="1" style="width:40px; text-align:center; padding:4px; border:1px solid var(--border-color); border-radius:4px; outline:none;"> 页
    </div>
</div>
`;

// ==================== 平台业绩大盘透视 ====================
document.getElementById('page-summary').innerHTML = `
<div class="page-title-row">
    <h2 style="font-size: 18px; color: var(--text-color);">📊 平台业绩与资金大盘汇总透视</h2>
</div>

<div style="font-size:13px; color:var(--text-muted); background:#f0f9ff; padding:8px 12px; border:1px solid #bae6fd; border-radius:6px; margin:16px 0;">
    💡 <strong>系统提示：</strong> 该数据看板抽取自平台业务底座，数据实时连通。
</div>
<div class="tab-bar" style="margin-bottom:16px;">
    <button class="tab-btn active" onclick="switchSummaryTab(this,'dim-manager')">🧔 按项目经理聚合</button>
    <button class="tab-btn" onclick="switchSummaryTab(this,'dim-contract')">📜 按合同立项聚合</button>
</div>

<div data-tab="dim-manager">
    <!-- 搜索栏 -->
    <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; align-items:center;">
        <input type="text" placeholder="输入项目经理姓名" style="padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; width:150px;">
        <input type="month" style="padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px;">
        <button class="btn btn-primary" style="padding:6px 16px; font-size:13px;" onclick="showToast('检索成功')">🔍 查询检索</button>
        <button class="btn btn-outline" style="padding:6px 16px; font-size:13px;">↻ 重置</button>
        <button class="btn btn-success" style="padding:6px 16px; font-size:13px; margin-left:auto;" onclick="doExport('项目经理维度大盘数据')">📥 导出当前数据</button>
    </div>
    
    <!-- 顶部KPI卡片 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px;">
        <div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size:13px;color:#ca8a04;margin-bottom:8px;">团队今年总计签约</div><div style="font-size:24px;font-weight:700;color:#a16207;">2,000,000</div>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size:13px;color:#2563eb;margin-bottom:8px;">当年累计开票总额</div><div style="font-size:24px;font-weight:700;color:#1d4ed8;">1,400,000</div>
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size:13px;color:#16a34a;margin-bottom:8px;">当年累计真金回笼</div><div style="font-size:24px;font-weight:700;color:#15803d;">980,000</div>
        </div>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size:13px;color:#dc2626;margin-bottom:8px;">悬空未收死账预警</div><div style="font-size:24px;font-weight:700;color:#b91c1c;">420,000</div>
        </div>
    </div>
    
    <div style="min-height: 400px; position:relative;">
        <div class="table-wrapper" style="margin:0;"><table class="data-table">
            <thead><tr><th>项目经理</th><th>管辖合同数</th><th>管辖总金额</th><th>累计开出票据</th><th>真金回笼款(元)</th><th>综合兑付率</th><th>未收款坏账额</th><th style="width:80px;text-align:center">操作</th></tr></thead>
            <tbody>
                <tr style="cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f0f9ff'" onmouseout="this.style.background=''" onclick="showSummaryDrawer('李明')" title="点击查看详情">
                    <td><strong>李明</strong></td><td>2</td><td>1,200,000</td><td>600,000</td><td style="color:var(--green);font-weight:600;">180,000</td><td>30.0%</td><td style="color:var(--danger-color)">420,000</td>
                    <td style="text-align:center"><button class="btn-mini btn-outline" style="color:var(--blue); border-color:var(--blue);" onclick="event.stopPropagation();showSummaryDrawer('李明')">抽屉详情 〉</button></td>
                </tr>
                <tr style="cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f0f9ff'" onmouseout="this.style.background=''" onclick="showSummaryDrawer('王芳')" title="点击查看详情">
                    <td><strong>王芳</strong></td><td>1</td><td>800,000</td><td>800,000</td><td style="color:var(--green);font-weight:600;">800,000</td><td>100%</td><td>0</td>
                    <td style="text-align:center"><button class="btn-mini btn-outline" style="color:var(--blue); border-color:var(--blue);" onclick="event.stopPropagation();showSummaryDrawer('王芳')">抽屉详情 〉</button></td>
                </tr>
            </tbody>
        </table></div>
    </div>
</div>

<div data-tab="dim-contract" style="display:none;">
    <!-- 搜索栏 -->
    <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; align-items:center;">
        <input type="text" placeholder="合同编号" style="padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; width:120px;">
        <input type="text" placeholder="对方单位(模糊过滤)" style="padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; width:150px;">
        <input type="text" placeholder="项目经理" style="padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; width:100px;">
        <button class="btn btn-primary" style="padding:6px 16px; font-size:13px;" onclick="showToast('检索成功')">🔍 查询检索</button>
        <button class="btn btn-outline" style="padding:6px 16px; font-size:13px;">↻ 重置</button>
        <button class="btn btn-success" style="padding:6px 16px; font-size:13px; margin-left:auto;" onclick="doExport('合同维度大盘数据')">📥 导出当前数据</button>
    </div>
    
    <div style="min-height: 400px; position:relative;">
        <div class="table-wrapper" style="margin:0;"><table class="data-table">
            <thead><tr><th>合同编号</th><th>对方单位</th><th>项目经理</th><th>合同规模</th><th>累计变现(回款)</th><th>回款笔数</th><th>应开未开(缺口)</th><th>结款健康度指示</th></tr></thead>
            <tbody>
                <tr><td><span class="link-text">CI-2026-001</span></td><td>中国石化</td><td>李明</td><td>1,200,000</td><td style="color:var(--green);font-weight:600;">180,000</td><td>2 笔</td><td style="color:#b45309;">200,000 (滞后)</td><td><span class="tag tag-orange">高风险悬空</span></td></tr>
                <tr><td><span class="link-text">CI-2026-002</span></td><td>中国石油</td><td>王芳</td><td>800,000</td><td style="color:var(--green);font-weight:600;">800,000</td><td>2 笔</td><td>0</td><td><span class="tag tag-green">结算完美闭环</span></td></tr>
            </tbody>
        </table></div>
        
        <div class="pagination" style="margin-top: 15px; padding:0;">
            <span>共 <strong>2</strong> 条记录</span>
        </div>
    </div>
</div>
`;

// ==================== 提醒设置 ====================
document.getElementById('page-reminder').innerHTML = `
<div class="page-title-row" style="justify-content: flex-start;">
    <h2 style="font-size: 18px; color: var(--text-color); margin-right: 20px;">智能到账与开票引擎 (提醒设置)</h2>
    <div style="font-size: 13px; color: var(--text-muted); background: #fff3cd; padding: 4px 12px; border-radius: 4px; border: 1px solid #ffeeba;">
        <span style="color: #856404;">💡 提醒引擎机制：系统后台自动计算全量合同金额数据，当触碰或超过设置的阈值时，引擎将按设定频率自动触发<b>邮件 + 系统内信</b>双重推送。</span>
    </div>
</div>

<div class="filter-panel" style="margin-top: 15px;">
    <div class="filter-row" style="margin-bottom:8px;">
        <div class="filter-item"><label>合同编号</label><input type="text" placeholder="请输入CI编号"></div>
        <div class="filter-item"><label>业务触发类型</label><select>
                <option>全部</option>
                <option>单笔开票催交</option>
                <option>应收账款回笼</option>
                <option>全局利润预警</option>
            </select></div>
        <div class="filter-item"><label>生效状态</label><select>
                <option>全部</option>
                <option selected>生效中</option>
                <option>已停用</option>
            </select></div>
        <div class="filter-item"><label>合同类型</label><select>
                <option>全部</option>
                <option>开口合同</option>
                <option>总价合同</option>
            </select></div>
    </div>
    <div class="filter-row">
        <div class="filter-item"><label>循环通知频率</label><select>
                <option>全部</option>
                <option>每天</option>
                <option>每3天</option>
                <option>每周</option>
            </select></div>
        <div class="filter-item"><label>规则来源</label><select>
                <option>全部</option>
                <option>系统默认兜底</option>
                <option>人工自定义配置</option>
            </select></div>
        <div class="filter-item"><label>超期时间阈值</label><input type="number" placeholder="天数"></div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('检索完成')">🔍 查询规则</button>
        <button class="btn btn-outline" style="margin-right:20px;">↻ 重置</button>
        <button class="btn btn-primary" style="background-color:#10b981; border-color:#10b981;" onclick="showAddReminderModal()"><span style="font-size:16px;">✛</span> 新增配置规则</button>
    </div>
</div>

<div class="table-wrapper">
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 50px;">#</th>
                <th style="width: 140px;">业务触发类别</th>
                <th style="width: 130px;">适用合同范围</th>
                <th>预警触发条件核心逻辑</th>
                <th style="width: 130px;">循环通知频率</th>
                <th style="width: 120px;">预警推送群组</th>
                <th style="width: 90px;">当前状态</th>
                <th style="width: 140px;">操作</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td><span class="tag tag-blue">单笔开票催交</span></td>
                <td>CI-2026-001</td>
                <td>当该单的【实际产值】＞【已开票金额】，且超期 <b>15天</b> 仍未全额开票即可触发。</td>
                <td>每隔 <b>3天</b> 推送一次</td>
                <td>项目经理</td>
                <td><span class="status status-active">生效中</span></td>
                <td>
                    <button class="btn-mini btn-outline" style="color:var(--danger-color);border-color:var(--danger-color)" onclick="showConfirmDialog('确认暂停该单的开票催交通知提醒？','提醒暂停通告')">⏸ 暂停</button>
                    <button class="btn-mini btn-outline" style="color:var(--blue);border-color:var(--blue)" onclick="showEditReminderModal(1, 'invoice')">⚙️ 配置</button>
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td><span class="tag tag-green">应收账款回笼</span></td>
                <td>CI-2026-002</td>
                <td>当该单的【已开票金额】＞【已回款金额】，且距离发票寄出日超 <b>30天</b> 仍未打款即可触发。</td>
                <td><b>每天</b> 循环推送</td>
                <td>财务、项目经理</td>
                <td><span class="status status-active">生效中</span></td>
                <td>
                    <button class="btn-mini btn-outline" style="color:var(--danger-color);border-color:var(--danger-color)">⏸ 暂停</button>
                    <button class="btn-mini btn-outline" style="color:var(--blue);border-color:var(--blue)" onclick="showEditReminderModal(2, 'payment')">⚙️ 配置</button>
                </td>
            </tr>
            <tr style="background-color: #fcfcfc;">
                <td>3</td>
                <td><span class="tag tag-purple">全局利润预警</span></td>
                <td><span class="tag" style="background-color:#eee; color:#666; font-family:monospace;">[平台全局规则]</span></td>
                <td>当系统底层核算出现任何一笔合同的【实时核算净利润率】 ≤ <b>3.0%</b> 即可触发。</td>
                <td>每隔 <b>7天</b> 循环上报</td>
                <td>分管系统总监、全体财务</td>
                <td><span class="status status-pending">已全局停用</span></td>
                <td>
                    <button class="btn-mini btn-outline" style="color:#10b981;border-color:#10b981">▶ 恢复运转</button>
                    <button class="btn-mini btn-outline" style="color:var(--blue);border-color:var(--blue)" onclick="showEditReminderModal(3, 'profit')">⚙️ 配置</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div class="pagination" style="margin-top: 15px;">
    <span>共 <strong>3</strong> 条提醒规则设定</span>
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
        <div class="filter-item"><label>合同编号</label><input type="text" placeholder="请输入CI编号"></div>
        <div class="filter-item"><label>合同名称</label><input type="text" placeholder="请输入"></div>
        <div class="filter-item">
            <label>人员成本(元)</label>
            <div style="display:flex;align-items:center;gap:4px;">
                <input type="number" placeholder="最小" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
                <span style="color:#999;font-size:12px;">~</span>
                <input type="number" placeholder="最大" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
            </div>
        </div>
        <div class="filter-item">
            <label>差旅成本(元)</label>
            <div style="display:flex;align-items:center;gap:4px;">
                <input type="number" placeholder="最小" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
                <span style="color:#999;font-size:12px;">~</span>
                <input type="number" placeholder="最大" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
            </div>
        </div>
        <div class="filter-item">
            <label>固定支出成本(元)</label>
            <div style="display:flex;align-items:center;gap:4px;">
                <input type="number" placeholder="最小" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
                <span style="color:#999;font-size:12px;">~</span>
                <input type="number" placeholder="最大" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
            </div>
        </div>
        <div class="filter-item">
            <label>成本合计(元)</label>
            <div style="display:flex;align-items:center;gap:4px;">
                <input type="number" placeholder="最小" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
                <span style="color:#999;font-size:12px;">~</span>
                <input type="number" placeholder="最大" style="width:90px;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
            </div>
        </div>
    </div>
    <div class="filter-actions">
        <button class="btn btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
        <button class="btn btn-outline" onclick="showToast('已重置')">↻ 重置</button>
        <button class="btn btn-success" onclick="showCostFixedAddDialog()">➕ 固定成本填报</button>
        <button class="btn btn-outline" onclick="showCostExportDialog()">📥 导出</button>
    </div>
</div>
<div class="table-wrapper">
    <table class="data-table">
        <thead><tr>
            <th>#</th>
            <th>合同编号</th>
            <th>合同名称</th>
            <th>总工时(天)</th>
            <th>人员成本(元) <span class="sort-btns" style="display:inline-flex;flex-direction:column;gap:0;margin-left:4px;vertical-align:middle;cursor:pointer;" onclick="showToast('已按人员成本升序排列')"><span style="font-size:9px;line-height:1;color:#aaa;">▲</span><span style="font-size:9px;line-height:1;color:#aaa;">▼</span></span></th>
            <th>差旅成本(元) <span class="sort-btns" style="display:inline-flex;flex-direction:column;gap:0;margin-left:4px;vertical-align:middle;cursor:pointer;" onclick="showToast('已按差旅成本升序排列')"><span style="font-size:9px;line-height:1;color:#aaa;">▲</span><span style="font-size:9px;line-height:1;color:#aaa;">▼</span></span></th>
            <th>固定支出成本(元) <span class="sort-btns" style="display:inline-flex;flex-direction:column;gap:0;margin-left:4px;vertical-align:middle;cursor:pointer;" onclick="showToast('已按固定支出升序排列')"><span style="font-size:9px;line-height:1;color:#aaa;">▲</span><span style="font-size:9px;line-height:1;color:#aaa;">▼</span></span></th>
            <th>成本合计(元) <span class="sort-btns" style="display:inline-flex;flex-direction:column;gap:0;margin-left:4px;vertical-align:middle;cursor:pointer;" onclick="showToast('已按成本合计升序排列')"><span style="font-size:9px;line-height:1;color:#aaa;">▲</span><span style="font-size:9px;line-height:1;color:#aaa;">▼</span></span></th>
        </tr></thead>
        <tbody>
            <tr>
                <td>1</td><td><span class="link-text" onclick="showContractDetail('CI-2026-001')">CI-2026-001</span></td><td>某石化换热器监造</td><td>158</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-001')">66,300.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-001')">4,200.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-001')">15,000.00</span></td>
                <td><strong>85,500.00</strong></td>
            </tr>
            <tr>
                <td>2</td><td><span class="link-text" onclick="showContractDetail('CI-2026-002')">CI-2026-002</span></td><td>压力容器制造监理</td><td>0</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-002')">0.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-002')">0.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-002')">8,000.00</span></td>
                <td><strong>8,000.00</strong></td>
            </tr>
            <tr>
                <td>3</td><td><span class="link-text" onclick="showContractDetail('CI-2026-003')">CI-2026-003</span></td><td>锅炉制造过程监理</td><td>214</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-003')">98,500.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-003')">12,800.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-003')">22,000.00</span></td>
                <td><strong>133,300.00</strong></td>
            </tr>
            <tr>
                <td>4</td><td><span class="link-text" onclick="showContractDetail('CI-2026-004')">CI-2026-004</span></td><td>海上平台结构件监造</td><td>96</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-004')">41,200.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-004')">6,500.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-004')">9,800.00</span></td>
                <td><strong>57,500.00</strong></td>
            </tr>
            <tr>
                <td>5</td><td><span class="link-text" onclick="showContractDetail('CI-2026-005')">CI-2026-005</span></td><td>核电设备制造监理</td><td>320</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-005')">156,800.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-005')">28,400.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-005')">45,000.00</span></td>
                <td><strong>230,200.00</strong></td>
            </tr>
            <tr>
                <td>6</td><td><span class="link-text" onclick="showContractDetail('CI-2026-006')">CI-2026-006</span></td><td>风电塔筒焊接监造</td><td>73</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-006')">28,900.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-006')">3,600.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-006')">6,500.00</span></td>
                <td><strong>39,000.00</strong></td>
            </tr>
            <tr>
                <td>7</td><td><span class="link-text" onclick="showContractDetail('CI-2026-007')">CI-2026-007</span></td><td>化工储罐制造监督</td><td>187</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-007')">82,600.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-007')">9,100.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-007')">18,500.00</span></td>
                <td><strong>110,200.00</strong></td>
            </tr>
            <tr>
                <td>8</td><td><span class="link-text" onclick="showContractDetail('CI-2026-008')">CI-2026-008</span></td><td>电站汽轮机组监造</td><td>256</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-008')">121,400.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-008')">18,700.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-008')">32,000.00</span></td>
                <td><strong>172,100.00</strong></td>
            </tr>
            <tr>
                <td>9</td><td><span class="link-text" onclick="showContractDetail('CI-2026-009')">CI-2026-009</span></td><td>石油管道焊接监理</td><td>44</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-009')">16,800.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-009')">2,200.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-009')">5,000.00</span></td>
                <td><strong>24,000.00</strong></td>
            </tr>
            <tr>
                <td>10</td><td><span class="link-text" onclick="showContractDetail('CI-2026-010')">CI-2026-010</span></td><td>大型起重设备监造</td><td>138</td>
                <td><span class="link-text" onclick="showCostPersonnelDialog('CI-2026-010')">59,200.00</span></td>
                <td><span class="link-text" onclick="showCostTravelDialog('CI-2026-010')">7,800.00</span></td>
                <td><span class="link-text" onclick="showCostFixedDialog('CI-2026-010')">13,500.00</span></td>
                <td><strong>80,500.00</strong></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="pagination">
    <div style="display:flex; align-items:center; gap:16px;">
        <span>共 <strong>10</strong> 条记录</span>
        <select style="padding:4px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:13px; outline:none;">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
        </select>
    </div>
    <div class="pagination-btns">
        <button class="btn-page" disabled>上一页</button>
        <button class="btn-page active">1</button>
        <button class="btn-page" onclick="showToast('已跳转到第2页')">2</button>
        <button class="btn-page" disabled>下一页</button>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
        前往 <input type="number" value="1" style="width:40px; text-align:center; padding:4px; border:1px solid var(--border-color); border-radius:4px; outline:none;"> 页
    </div>
</div>
`;

// ==================== 差旅报销台账 ====================
// 差旅报销台账内容已在 index.html 中定义，页面切换时初始化数据

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
