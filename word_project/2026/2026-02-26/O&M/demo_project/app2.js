// ===== app2.js - 弹窗续集 + ECharts + 导出 + 初始化 =====

// ===== 监理人员 - 二级页面(派单汇总) =====
function showPersonnelLevel2(name) {
    openWideModal('派单汇总 - ' + name, `
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px;">
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">派单编号</label><input type="text" placeholder="请输入" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">监造形式</label><select style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部</option><option>驻厂</option><option>巡检</option></select></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">辅助人员</label><input type="text" placeholder="请输入" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">制造厂</label><input type="text" placeholder="请输入" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">总监代表</label><input type="text" placeholder="请输入" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">派单状态</label><select style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部</option><option>进行中</option><option>已完成</option><option>待派遣</option></select></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">计划开始(起)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">计划开始(止)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">计划结束(起)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">计划结束(止)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">发起时间(起)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">发起时间(止)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">监造结束(起)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">监造结束(止)</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">剩余天数(最小)</label><input type="number" placeholder="天" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">剩余天数(最大)</label><input type="number" placeholder="天" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">工时(最小)</label><input type="number" placeholder="天" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
            <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">工时(最大)</label><input type="number" placeholder="天" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
            <button class="btn btn-primary" style="padding:5px 16px">🔍 查询</button>
            <button class="btn btn-outline" style="padding:5px 16px">↻ 重置</button>
            <button class="btn btn-success" style="padding:5px 16px">📥 导出</button>
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr><th>派单编号</th><th>监造形式</th><th>辅助人员</th><th>制造厂</th><th>总监代表</th><th>计划开始</th><th>计划结束</th><th>发起时间</th><th>派单状态</th><th>监造结束</th><th>剩余时间</th><th>工时</th><th>操作</th></tr></thead>
            <tbody>
                <tr><td>PD-20260115-01</td><td><span class="tag tag-blue">驻厂</span></td><td>李四, 陈伟</td><td>东方锅炉</td><td>周磊</td><td>2026-01-20</td><td class="text-danger">2026-02-28</td><td>2026-01-15</td><td><span class="status status-active">进行中</span></td><td>—</td><td>3天</td><td>34</td><td><button class="btn-mini btn-primary" onclick="showPersonnelLevel3('${name}','PD-20260115-01')">查看</button></td></tr>
                <tr><td>PD-20260115-02</td><td><span class="tag tag-cyan">巡检</span></td><td>赵六</td><td>东方锅炉</td><td>周磊</td><td>2026-01-25</td><td>2026-03-15</td><td>2026-01-15</td><td><span class="status status-active">进行中</span></td><td>—</td><td>18天</td><td>30</td><td><button class="btn-mini btn-primary" onclick="showPersonnelLevel3('${name}','PD-20260115-02')">查看</button></td></tr>
            </tbody>
        </table></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding:12px;background:#f8f9fa;border-radius:6px;">
            <span style="font-size:13px;color:#666;">共 <strong style="color:#1976d2;">2</strong> 条派单记录</span>
            <div style="display:flex;gap:8px;align-items:center;">
                <button class="btn-page" disabled style="padding:4px 12px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;cursor:not-allowed;">上一页</button>
                <button class="btn-page active" style="padding:4px 12px;font-size:12px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;cursor:pointer;">1</button>
                <button class="btn-page" style="padding:4px 12px;font-size:12px;border:1px solid #ddd;background:#fff;color:#666;border-radius:4px;cursor:pointer;">2</button>
                <button class="btn-page" style="padding:4px 12px;font-size:12px;border:1px solid #ddd;background:#fff;color:#666;border-radius:4px;cursor:pointer;">3</button>
                <button class="btn-page" style="padding:4px 12px;font-size:12px;border:1px solid #ddd;background:#fff;color:#666;border-radius:4px;cursor:pointer;">下一页</button>
            </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">返回</button>`);
}

// ===== 监理人员 - 三级页面(打卡记录与日历) =====
// source: 'workhour' | 'personnel'(default), ci/ciName 用于从工时记录返回
function showPersonnelLevel3(name, pd, source, ci, ciName) {
    const isFromWorkhour = source === 'workhour';
    const backBtn = isFromWorkhour
        ? `<button class="btn btn-outline" onclick="showWorkhourLevel2('${ci || ''}','${ciName || ''}')">← 返回派单列表</button>`
        : `<button class="btn btn-outline" onclick="showPersonnelLevel2('${name}')">← 返回派单汇总</button>`;

    // 模拟多个辅助人员
    const assistants = ['李四', '陈伟'];
    const currentAssistant = name;

    openModal('打卡记录与日历 - ' + name + ' (' + pd + ')', `
        <!-- 人员切换按钮组 -->
        <div style="display:flex;gap:8px;margin-bottom:16px;align-items:center;">
            <span style="font-size:13px;color:#666;font-weight:600;">辅助人员：</span>
            ${assistants.map(a => `<button class="btn ${a === currentAssistant ? 'btn-primary' : 'btn-outline'}" style="padding:4px 16px;font-size:12px;" onclick="showPersonnelLevel3('${a}','${pd}','${source || ''}','${ci || ''}','${ciName || ''}')">${a}</button>`).join('')}
        </div>

        <!-- 人员信息摘要（添加点击筛选功能） -->
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px;">
            <div style="background:linear-gradient(135deg,#e8f4fd,#d1ecf9);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#5b8db8;margin-bottom:4px;">人员姓名</div>
                <div style="font-size:15px;font-weight:700;color:#1a6fb5;">${name}</div>
            </div>
            <div style="background:linear-gradient(135deg,#ede7f6,#d9ccf0);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#7e57c2;margin-bottom:4px;">派单编号</div>
                <div style="font-size:13px;font-weight:600;color:#5e35b1;">${pd}</div>
            </div>
            <div onclick="filterAttendance('出勤')" style="background:linear-gradient(135deg,#e8fdf0,#d1f9e0);border-radius:10px;padding:14px;text-align:center;cursor:pointer;" title="点击筛选出勤记录">
                <div style="font-size:11px;color:#4a9d6b;margin-bottom:4px;">本月出勤</div>
                <div style="font-size:18px;font-weight:700;color:#2d7d4f;">15 天</div>
            </div>
            <div onclick="filterAttendance('休息')" style="background:linear-gradient(135deg,#fff3e0,#ffe8cc);border-radius:10px;padding:14px;text-align:center;cursor:pointer;" title="点击筛选休息记录">
                <div style="font-size:11px;color:#c77c2a;margin-bottom:4px;">本月休息</div>
                <div style="font-size:18px;font-weight:700;color:#e68a00;">6 天</div>
            </div>
            <div onclick="filterAttendance('异常')" style="background:linear-gradient(135deg,#fce4ec,#f8bbd0);border-radius:10px;padding:14px;text-align:center;cursor:pointer;" title="点击筛选异常记录">
                <div style="font-size:11px;color:#c62828;margin-bottom:4px;">异常记录</div>
                <div style="font-size:18px;font-weight:700;color:#d32f2f;">2 天</div>
            </div>
        </div>

        <!-- 打卡列表搜索条件 -->
        <div style="background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:16px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">开始日期</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">结束日期</label><input type="date" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">打卡类型</label><select id="attendanceTypeFilter" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"><option value="">全部</option><option value="监理打卡">监理打卡</option><option value="出勤打卡">出勤打卡</option><option value="外勤打卡">外勤打卡</option><option value="休息">休息</option><option value="请假">请假</option><option value="未打卡">未打卡</option></select></div>
                <div style="display:flex;align-items:flex-end;gap:4px;"><button class="btn btn-primary" style="padding:5px 12px;font-size:12px;">查询</button><button class="btn btn-outline" style="padding:5px 12px;font-size:12px;">重置</button></div>
            </div>
        </div>

        <!-- 双栏布局：打卡列表 + 工时日历 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:16px;">
            <!-- 左侧：打卡列表 -->
            <div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;">
                <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);">
                    <h4 style="font-size:13px;font-weight:600;color:#334155;margin:0;">📋 打卡记录列表</h4>
                </div>
                <div style="max-height:400px;overflow-y:auto;">
                    <table class="data-table">
                        <thead><tr><th>日期</th><th>上班</th><th>下班</th><th>打卡类型</th><th>状态</th><th>工时</th></tr></thead>
                        <tbody id="attendanceList">
                            <tr onclick="showAttendanceDetail('2026-02-25','监理打卡')" style="cursor:pointer;">
                                <td>2026-02-25</td><td>08:30</td><td>17:30</td>
                                <td><span class="tag tag-blue">监理打卡</span></td>
                                <td><span class="tag tag-green">正常</span></td>
                                <td style="font-weight:600;">8h</td>
                            </tr>
                            <tr onclick="showAttendanceDetail('2026-02-24','出勤打卡')" style="cursor:pointer;">
                                <td>2026-02-24</td><td>08:25</td><td>17:35</td>
                                <td><span class="tag tag-cyan">出勤打卡</span></td>
                                <td><span class="tag tag-green">正常</span></td>
                                <td style="font-weight:600;">8h</td>
                            </tr>
                            <tr onclick="showAttendanceDetail('2026-02-23','休息')" style="cursor:pointer;background:#fffbeb;">
                                <td>2026-02-23</td><td>—</td><td>—</td>
                                <td><span class="tag tag-gray">休息</span></td>
                                <td><span class="tag tag-orange">休息</span></td>
                                <td>0h</td>
                            </tr>
                            <tr onclick="showAttendanceDetail('2026-02-22','请假')" style="cursor:pointer;background:#fff3e0;">
                                <td>2026-02-22</td><td>—</td><td>—</td>
                                <td><span class="tag tag-orange">请假</span></td>
                                <td><span class="tag tag-orange">事假</span></td>
                                <td>0h</td>
                            </tr>
                            <tr onclick="showAttendanceDetail('2026-02-21','外勤打卡')" style="cursor:pointer;">
                                <td>2026-02-21</td><td>08:20</td><td>17:40</td>
                                <td><span class="tag tag-purple">外勤打卡</span></td>
                                <td><span class="tag tag-green">正常</span></td>
                                <td style="font-weight:600;">8h</td>
                            </tr>
                            <tr onclick="showAttendanceDetail('2026-02-20','未打卡')" style="cursor:pointer;background:#ffebee;">
                                <td>2026-02-20</td><td>—</td><td>—</td>
                                <td><span class="tag tag-red">未打卡</span></td>
                                <td><span class="tag tag-red">异常</span></td>
                                <td>0h</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 分页 -->
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f8f9fa;border-top:1px solid var(--border-color);">
                    <span style="font-size:12px;color:#666;">共 <strong>20</strong> 条记录</span>
                    <div style="display:flex;gap:4px;">
                        <button class="btn-page" disabled style="padding:3px 10px;font-size:11px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;cursor:not-allowed;">上一页</button>
                        <button class="btn-page active" style="padding:3px 10px;font-size:11px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;">1</button>
                        <button class="btn-page" style="padding:3px 10px;font-size:11px;border:1px solid #ddd;background:#fff;color:#666;border-radius:4px;cursor:pointer;">2</button>
                        <button class="btn-page" style="padding:3px 10px;font-size:11px;border:1px solid #ddd;background:#fff;color:#666;border-radius:4px;cursor:pointer;">下一页</button>
                    </div>
                </div>
            </div>

            <!-- 右侧：工时日历 -->
            <div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;">
                <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);">
                    <h4 style="font-size:13px;font-weight:600;color:#334155;margin:0;">📅 工时日历 (2026年2月)</h4>
                </div>
                <div style="padding:16px;">
                    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:12px;">
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">一</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">二</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">三</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">四</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">五</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">六</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">日</div>
                        ${buildCalendarDays()}
                    </div>
                    <div style="margin-top:12px;display:flex;gap:12px;align-items:center;font-size:11px;color:var(--text-muted);flex-wrap:wrap;">
                        <span>图例：</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:14px;height:14px;border-radius:3px;background:#bde0fe;"></span> 单派单</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:14px;height:14px;border-radius:3px;background:#5baadc;"></span> 多派单</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:14px;height:14px;border-radius:3px;background:#f5f5f5;"></span> 休息日</span>
                    </div>
                    <!-- 日期派单信息展示区域 -->
                    <div id="dateDispatchInfo" style="border:1px solid var(--border-color);border-radius:8px;padding:12px;background:#f0f9ff;display:none;margin-top:12px;">
                        <h4 style="font-size:13px;font-weight:600;color:#1976d2;margin:0 0 8px 0;">📅 <span id="dateDispatchDate"></span> 派单信息</h4>
                        <div id="dateDispatchContent"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 打卡详情展示区域 -->
        <div id="attendanceDetail" style="border:1px solid var(--border-color);border-radius:10px;padding:16px;background:#fafbfc;display:none;">
            <h4 style="font-size:13px;font-weight:600;color:#334155;margin:0 0 12px 0;">📍 打卡详细信息</h4>
            <div id="attendanceDetailContent"></div>
        </div>
    `, backBtn);
    // 设置为近全屏宽度
    document.getElementById('modalBox').style.maxWidth = '1300px';
}

// 显示打卡详细信息
function showAttendanceDetail(date, type) {
    const detailDiv = document.getElementById('attendanceDetail');
    const contentDiv = document.getElementById('attendanceDetailContent');

    // 模拟不同类型的打卡详情数据
    let detailHTML = '';

    if (type === '监理打卡') {
        detailHTML = `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:12px;">
                <div><strong>打卡日期：</strong>${date}</div>
                <div><strong>打卡类型：</strong><span class="tag tag-blue">监理打卡</span></div>
                <div><strong>上班打卡：</strong>08:30 (正常)</div>
                <div><strong>下班打卡：</strong>17:30 (正常)</div>
                <div><strong>打卡地址：</strong>东方锅炉制造厂 (四川省自贡市)</div>
                <div><strong>派单地址：</strong>东方锅炉制造厂</div>
                <div style="grid-column:1/-1;"><strong>备注：</strong>现场监理，设备验收正常</div>
                <div style="grid-column:1/-1;background:#e3f2fd;padding:8px;border-radius:4px;margin-top:8px;">
                    <strong style="color:#1976d2;">✓ 关联派单信息</strong><br>
                    派单编号：PD-20260115-01 | 制造厂：东方锅炉 | 监造形式：驻厂
                </div>
            </div>`;
    } else if (type === '出勤打卡') {
        detailHTML = `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:12px;">
                <div><strong>打卡日期：</strong>${date}</div>
                <div><strong>打卡类型：</strong><span class="tag tag-cyan">出勤打卡</span></div>
                <div><strong>上班打卡：</strong>08:25 (正常)</div>
                <div><strong>下班打卡：</strong>17:35 (正常)</div>
                <div><strong>打卡地址：</strong>公司本部 (北京市朝阳区)</div>
                <div><strong>地理围栏：</strong>✓ 在围栏内</div>
                <div style="grid-column:1/-1;"><strong>备注：</strong>办公室工作</div>
            </div>`;
    } else if (type === '外勤打卡') {
        detailHTML = `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:12px;">
                <div><strong>打卡日期：</strong>${date}</div>
                <div><strong>打卡类型：</strong><span class="tag tag-purple">外勤打卡</span></div>
                <div><strong>上班打卡：</strong>08:20 (正常)</div>
                <div><strong>下班打卡：</strong>17:40 (正常)</div>
                <div><strong>打卡地址：</strong>上海市浦东新区</div>
                <div><strong>备注：</strong>客户拜访</div>
                <div style="grid-column:1/-1;background:#f3e5f5;padding:8px;border-radius:4px;margin-top:8px;">
                    <strong style="color:#7e57c2;">📋 外勤申请信息</strong><br>
                    申请单号：WQ-2026-0221-001 | 外勤地点：上海市浦东新区<br>
                    外勤事由：客户技术交流 | 审批状态：已通过
                </div>
            </div>`;
    } else if (type === '请假') {
        detailHTML = `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:12px;">
                <div><strong>日期：</strong>${date}</div>
                <div><strong>状态：</strong><span class="tag tag-orange">请假</span></div>
                <div style="grid-column:1/-1;background:#fff3e0;padding:8px;border-radius:4px;margin-top:8px;">
                    <strong style="color:#f57c00;">📄 请假申请信息</strong><br>
                    申请单号：QJ-2026-0222-001 | 请假类型：事假<br>
                    请假时间：2026-02-22 全天 | 请假事由：个人事务<br>
                    审批状态：已通过 | 审批人：张经理
                </div>
            </div>`;
    } else if (type === '休息') {
        detailHTML = `
            <div style="font-size:12px;">
                <div><strong>日期：</strong>${date}</div>
                <div style="margin-top:8px;"><strong>状态：</strong><span class="tag tag-gray">休息日</span></div>
                <div style="margin-top:8px;color:#666;">周末休息，无需打卡</div>
            </div>`;
    } else if (type === '未打卡') {
        detailHTML = `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:12px;">
                <div><strong>日期：</strong>${date}</div>
                <div><strong>状态：</strong><span class="tag tag-red">未打卡</span></div>
                <div style="grid-column:1/-1;background:#ffebee;padding:8px;border-radius:4px;margin-top:8px;">
                    <strong style="color:#c62828;">⚠️ 异常信息</strong><br>
                    该日期应打卡但未打卡，请及时补卡或说明原因
                </div>
            </div>`;
    }

    contentDiv.innerHTML = detailHTML;
    detailDiv.style.display = 'block';
}

// 筛选打卡记录
function filterAttendance(type) {
    const filterSelect = document.getElementById('attendanceTypeFilter');
    if (!filterSelect) return;

    if (type === '出勤') {
        filterSelect.value = '监理打卡'; // 出勤包含监理打卡和出勤打卡
    } else if (type === '休息') {
        filterSelect.value = '休息';
    } else if (type === '异常') {
        filterSelect.value = '未打卡';
    }

    // 触发筛选（这里简化处理，实际应该重新加载数据）
    showToast(`已筛选${type}记录`);
}

function buildCalendarDays() {
    const days = [];
    days.push('<div></div>'.repeat(6));
    for (let d = 1; d <= 28; d++) {
        const isWeekend = (d % 7 === 1 || d % 7 === 0);
        const hasWork = !isWeekend && d <= 25;
        const multiPD = d >= 16 && d <= 20 && hasWork;
        const bg = multiPD ? 'rgba(64,158,255,0.5)' : hasWork ? 'rgba(64,158,255,0.2)' : 'transparent';
        const title = multiPD ? 'PD-20260115-01, PD-20260115-02' : hasWork ? 'PD-20260115-01' : '';
        const onclick = hasWork ? `onclick="showDateDispatch('2026-02-${String(d).padStart(2, '0')}','${title}')"` : '';
        days.push(`<div style="text-align:center;padding:6px 2px;border-radius:4px;background:${bg};cursor:${hasWork ? 'pointer' : 'default'}" title="${title}" ${onclick}>${d}</div>`);
    }
    return days.join('');
}

// ===== 工时记录 - 二级 =====
function showWorkhourLevel2(ci, name) {
    const isCI001 = ci === 'CI-2026-001';
    openWideModal('派单列表 - ' + ci + ' (' + name + ')', `
        <!-- 合同摘要信息 -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;">
            <div style="background:linear-gradient(135deg,#e8f4fd,#d1ecf9);border-radius:10px;padding:16px;text-align:center;">
                <div style="font-size:12px;color:#5b8db8;margin-bottom:6px;">合同编号</div>
                <div style="font-size:16px;font-weight:700;color:#1a6fb5;">${ci}</div>
            </div>
            <div style="background:linear-gradient(135deg,#e8fdf0,#d1f9e0);border-radius:10px;padding:16px;text-align:center;">
                <div style="font-size:12px;color:#4a9d6b;margin-bottom:6px;">合同名称</div>
                <div style="font-size:14px;font-weight:600;color:#2d7d4f;">${name}</div>
            </div>
            <div style="background:linear-gradient(135deg,#fff3e0,#ffe8cc);border-radius:10px;padding:16px;text-align:center;">
                <div style="font-size:12px;color:#c77c2a;margin-bottom:6px;">派单数量</div>
                <div style="font-size:20px;font-weight:700;color:#e68a00;">${isCI001 ? '2' : '0'}</div>
            </div>
            <div style="background:linear-gradient(135deg,#ede7f6,#d9ccf0);border-radius:10px;padding:16px;text-align:center;">
                <div style="font-size:12px;color:#7e57c2;margin-bottom:6px;">累计工时(天)</div>
                <div style="font-size:20px;font-weight:700;color:#5e35b1;">${isCI001 ? '158' : '0'}</div>
            </div>
        </div>
        ${isCI001 ? `
        <!-- 统计汇总行 -->
        <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
            <div style="flex:1;min-width:140px;background:#f0f7ff;border:1px solid #d4e8fc;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:22px;">👷</span>
                <div><div style="font-size:11px;color:#6b7b8d;">驻厂派单</div><div style="font-size:16px;font-weight:700;color:#1a6fb5;">1 个</div></div>
            </div>
            <div style="flex:1;min-width:140px;background:#f0fdf4;border:1px solid #d4f5e0;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:22px;">🔍</span>
                <div><div style="font-size:11px;color:#6b8d7b;">巡检派单</div><div style="font-size:16px;font-weight:700;color:#2d7d4f;">1 个</div></div>
            </div>
            <div style="flex:1;min-width:140px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:22px;">⏰</span>
                <div><div style="font-size:11px;color:#92780c;">即将超期</div><div style="font-size:16px;font-weight:700;color:#b45309;">1 个</div></div>
            </div>
            <div style="flex:1;min-width:140px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:22px;">📊</span>
                <div><div style="font-size:11px;color:#7c6b9a;">涉及人员</div><div style="font-size:16px;font-weight:700;color:#5e35b1;">5 人</div></div>
            </div>
        </div>

        <!-- 二级弹窗搜索条件（支持复合查询） -->
        <div style="background:#f8fafc;padding:14px 16px;border-radius:8px;margin-bottom:16px;border:1px solid var(--border-color);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">🔎 筛选条件 <span style="font-size:11px;font-weight:normal;color:#94a3b8;">（文本框支持多值复合查询，用顿号 、 或逗号 , 分隔）</span></span>
                <div style="display:flex;gap:6px;">
                    <button class="btn btn-primary" style="padding:5px 16px;font-size:12px;">🔍 查询</button>
                    <button class="btn btn-outline" style="padding:5px 16px;font-size:12px;">↻ 重置</button>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px 12px;">
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">派单编号</label><input type="text" placeholder="如：PD-001、PD-002" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">监造形式</label><select style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部</option><option>驻厂</option><option>巡检</option></select></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">辅助人员</label><input type="text" placeholder="如：张三、李四、王五" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">区域经理</label><input type="text" placeholder="如：刘强、陈敏" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">制造厂</label><input type="text" placeholder="如：东方锅炉、上海电气" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">总监代表</label><input type="text" placeholder="如：周磊、吴九" style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">派单状态</label><select style="width:100%;padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部</option><option>进行中</option><option>已完成</option><option>待派遣</option><option>异常/超期</option></select></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">计划开始时间</label><div style="display:flex;gap:4px;"><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"><span style="line-height:28px;color:#999;">~</span><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"></div></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">计划结束时间</label><div style="display:flex;gap:4px;"><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"><span style="line-height:28px;color:#999;">~</span><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"></div></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">发起时间</label><div style="display:flex;gap:4px;"><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"><span style="line-height:28px;color:#999;">~</span><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"></div></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">监造结束时间</label><div style="display:flex;gap:4px;"><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"><span style="line-height:28px;color:#999;">~</span><input type="date" style="flex:1;padding:4px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:11px"></div></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">剩余时间(天)</label><div style="display:flex;gap:4px;"><input type="number" placeholder="最小" style="flex:1;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:50%"><span style="line-height:28px;color:#999;">~</span><input type="number" placeholder="最大" style="flex:1;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:50%"></div></div>
                <div><label style="font-size:11px;color:#666;display:block;margin-bottom:2px;">工时区间(天)</label><div style="display:flex;gap:4px;"><input type="number" placeholder="最小" style="flex:1;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:50%"><span style="line-height:28px;color:#999;">~</span><input type="number" placeholder="最大" style="flex:1;padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:50%"></div></div>
            </div>
        </div>

        <!-- 派单明细表格 -->
        <div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;">
            <div style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <h4 style="font-size:14px;font-weight:600;color:#334155;margin:0;">📋 派单明细</h4>
                <div style="display:flex;align-items:center;gap:10px;">
                    <!-- 导出按钮组 -->
                    <div style="position:relative;display:inline-block;" id="exportBtnGroup">
                        <button class="btn btn-primary" style="padding:5px 14px;font-size:12px;display:flex;align-items:center;gap:4px;" onclick="document.getElementById('exportDropdown').style.display = document.getElementById('exportDropdown').style.display === 'block' ? 'none' : 'block';">
                            📥 导出数据 <span style="font-size:10px;">▼</span>
                        </button>
                        <div id="exportDropdown" style="display:none;position:absolute;right:0;top:100%;margin-top:4px;background:#fff;border:1px solid var(--border-color);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.12);z-index:999;min-width:260px;overflow:hidden;">
                            <div style="padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:12px;font-weight:600;color:#334155;background:#f8fafc;">选择导出方式</div>
                            <div style="padding:4px;">
                                <div onclick="showToast('正在生成【汇总+明细】Excel文件，请稍候...');document.getElementById('exportDropdown').style.display='none';" style="padding:10px 14px;cursor:pointer;border-radius:6px;font-size:12px;display:flex;align-items:flex-start;gap:10px;transition:background 0.15s;" onmouseover="this.style.background='#f0f7ff'" onmouseout="this.style.background='transparent'">
                                    <span style="font-size:20px;flex-shrink:0;">📊</span>
                                    <div>
                                        <div style="font-weight:600;color:#1a6fb5;margin-bottom:2px;">导出汇总+明细 (Excel)</div>
                                        <div style="color:#94a3b8;font-size:11px;line-height:1.4;">Sheet1: 派单列表汇总信息<br>Sheet2: 各派单辅助人员工时明细</div>
                                    </div>
                                </div>
                                <div onclick="showToast('正在生成【仅明细】Excel文件，请稍候...');document.getElementById('exportDropdown').style.display='none';" style="padding:10px 14px;cursor:pointer;border-radius:6px;font-size:12px;display:flex;align-items:flex-start;gap:10px;transition:background 0.15s;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='transparent'">
                                    <span style="font-size:20px;flex-shrink:0;">👤</span>
                                    <div>
                                        <div style="font-weight:600;color:#2d7d4f;margin-bottom:2px;">导出人员工时明细 (Excel)</div>
                                        <div style="color:#94a3b8;font-size:11px;line-height:1.4;">按人员维度展开，每人一行<br>含派单编号、姓名、每日打卡、工时小计</div>
                                    </div>
                                </div>
                                <div onclick="showToast('正在生成CSV文件，请稍候...');document.getElementById('exportDropdown').style.display='none';" style="padding:10px 14px;cursor:pointer;border-radius:6px;font-size:12px;display:flex;align-items:flex-start;gap:10px;transition:background 0.15s;" onmouseover="this.style.background='#fffbeb'" onmouseout="this.style.background='transparent'">
                                    <span style="font-size:20px;flex-shrink:0;">📄</span>
                                    <div>
                                        <div style="font-weight:600;color:#b45309;margin-bottom:2px;">导出列表数据 (CSV)</div>
                                        <div style="color:#94a3b8;font-size:11px;line-height:1.4;">仅导出当前列表展示的派单信息<br>适合二次加工或导入其他系统</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 交互指引 -->
                    <div style="background:#eaf2fb;padding:4px 8px;border-radius:4px;border:1px solid #b6d4fe;color:#084298;font-size:12px;">
                        👉 <strong>交互指引：</strong>请直接点击辅助人员姓名，穿透查看其【每日打卡明细与日历】
                    </div>
                </div>
            </div>
            <div style="overflow-x:auto;">
                <table class="data-table" style="min-width:1300px;">
                    <thead><tr>
                        <th style="width:140px;">派单编号</th><th style="width:70px;">监造形式</th><th style="min-width:180px;">辅助人员 <span style="font-size:12px;font-weight:normal;color:#666;">(点击姓名查考勤)</span></th>
                        <th>区域经理</th><th>制造厂</th><th>总监代表</th><th>计划开始</th><th style="min-width:90px;">计划结束</th>
                        <th>发起时间</th><th>派单状态</th><th>监造结束</th><th>剩余时间</th><th style="width:60px;">工时</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>PD-20260115-01</strong></td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('张三','PD-20260115-01','workhour','${ci}','${name}')">👤 张三</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('李四','PD-20260115-01','workhour','${ci}','${name}')">👤 李四</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('陈伟','PD-20260115-01','workhour','${ci}','${name}')">👤 陈伟</span>
                            </td>
                            <td>刘强</td><td>东方锅炉</td><td>周磊</td><td>2026-01-20</td>
                            <td class="text-danger" style="font-weight:600;">2026-02-28 ⚠️</td>
                            <td>2026-01-15</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td style="color:var(--orange);font-weight:600;">3天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">98</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260115-02</strong></td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('王五','PD-20260115-02','workhour','${ci}','${name}')">👤 王五</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('赵六','PD-20260115-02','workhour','${ci}','${name}')">👤 赵六</span>
                            </td>
                            <td>刘强</td><td>东方锅炉</td><td>周磊</td><td>2026-01-25</td>
                            <td>2026-03-15</td><td>2026-01-15</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td>18天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">60</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260215-03</strong></td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('孙七','PD-20260215-03','workhour','${ci}','${name}')">👤 孙七</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('周八','PD-20260215-03','workhour','${ci}','${name}')">👤 周八</span>
                            </td>
                            <td>陈敏</td><td>哈尔滨电气</td><td>吴九</td><td>2026-02-10</td>
                            <td>2026-05-20</td>
                            <td>2026-02-05</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td>80天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">45</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260218-04</strong></td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('吴十','PD-20260218-04','workhour','${ci}','${name}')">👤 吴十</span>
                            </td>
                            <td>张伟</td><td>上海电气</td><td>郑十一</td><td>2026-02-15</td>
                            <td>2026-04-10</td><td>2026-02-10</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td>50天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">24</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260301-05</strong></td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('王小明','PD-20260301-05','workhour','${ci}','${name}')">👤 王小明</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('李大雷','PD-20260301-05','workhour','${ci}','${name}')">👤 李大雷</span>
                            </td>
                            <td>刘强</td><td>东方锅炉</td><td>周磊</td><td>2026-03-05</td>
                            <td class="text-danger" style="font-weight:600;">2026-04-01 ⚠️</td>
                            <td>2026-03-01</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td style="color:var(--orange);font-weight:600;">16天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">32</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260310-06</strong></td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('刘备','PD-20260310-06','workhour','${ci}','${name}')">👤 刘备</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('关羽','PD-20260310-06','workhour','${ci}','${name}')">👤 关羽</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('张飞','PD-20260310-06','workhour','${ci}','${name}')">👤 张飞</span>
                            </td>
                            <td>陈敏</td><td>哈尔滨电气</td><td>吴九</td><td>2026-03-15</td>
                            <td>2026-06-30</td><td>2026-03-10</td>
                            <td><span class="status status-active">待派遣</span></td>
                            <td>—</td><td>107天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">0</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260105-07</strong></td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('郭嘉','PD-20260105-07','workhour','${ci}','${name}')">👤 郭嘉</span>
                            </td>
                            <td>张伟</td><td>上海电气</td><td>郑十一</td><td>2026-01-10</td>
                            <td>2026-02-10</td>
                            <td>2026-01-05</td>
                            <td><span class="status tag-green">已完成</span></td>
                            <td>2026-02-10</td><td>—</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">240</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260220-08</strong></td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('诸葛亮','PD-20260220-08','workhour','${ci}','${name}')">👤 诸葛亮</span>
                            </td>
                            <td>刘强</td><td>东方锅炉</td><td>周磊</td><td>2026-02-25</td>
                            <td class="text-danger" style="font-weight:600;">2026-03-20 ⚠️</td><td>2026-02-20</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td style="color:var(--orange);font-weight:600;">4天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">56</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260305-09</strong></td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('曹操','PD-20260305-09','workhour','${ci}','${name}')">👤 曹操</span>、
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('司马懿','PD-20260305-09','workhour','${ci}','${name}')">👤 司马懿</span>
                            </td>
                            <td>陈敏</td><td>哈尔滨电气</td><td>吴九</td><td>2026-03-10</td>
                            <td>2026-05-10</td>
                            <td>2026-03-05</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td>55天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">64</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260312-10</strong></td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td style="line-height:1.8;">
                                <span class="link-text" style="color:var(--blue);text-decoration:underline;cursor:pointer;" onclick="showPersonnelLevel3('周瑜','PD-20260312-10','workhour','${ci}','${name}')">👤 周瑜</span>
                            </td>
                            <td>张伟</td><td>上海电气</td><td>郑十一</td><td>2026-03-18</td>
                            <td>2026-04-30</td><td>2026-03-12</td>
                            <td><span class="status status-active">待派遣</span></td>
                            <td>—</td><td>45天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">0</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style="background:#f0f7ff;font-weight:600;">
                            <td colspan="12" style="text-align:right;padding-right:20px;">合计工时</td>
                            <td style="font-size:18px;color:var(--blue);">619</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <!-- 分页组件 -->
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:#f8f9fa;border-top:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:16px;">
                    <span style="font-size:13px;color:#666;">共 <strong style="color:#1976d2;">10</strong> 条记录</span>
                    <select style="padding:4px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px; outline:none;">
                        <option>10 条/页</option>
                        <option>20 条/页</option>
                        <option>50 条/页</option>
                    </select>
                </div>
                <div style="display:flex;gap:4px;align-items:center;">
                    <button class="btn-page" disabled style="padding:4px 12px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;cursor:not-allowed;">上一页</button>
                    <button class="btn-page active" style="padding:4px 12px;font-size:12px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;cursor:pointer;">1</button>
                    <button class="btn-page" disabled style="padding:4px 12px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;cursor:not-allowed;">下一页</button>
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#666;">
                    前往 <input type="number" value="1" style="width:40px; text-align:center; padding:4px; border:1px solid var(--border-color); border-radius:4px; outline:none;"> 页
                </div>
            </div>
        </div>
        ` : `
        <div style="text-align:center;padding:60px 20px;">
            <div style="font-size:56px;margin-bottom:16px;opacity:0.5;">📭</div>
            <div style="font-size:16px;color:var(--text-muted);margin-bottom:8px;">暂无派单记录</div>
            <div style="font-size:13px;color:var(--text-muted);">该合同尚未创建任何派单</div>
        </div>
        `}
    `, `<button class="btn btn-outline" onclick="closeModal()">返回</button>`);
}

// ===== 开票 - 新增 ======================================
function showInvoiceAddDialog() {
    openModal('新增开票记录', `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; padding:8px 12px; border-radius:6px; font-size:12px; margin-bottom:16px;">
            ✅ <strong>管控说明：</strong> 纯新增业务动作不强制流转审批，提交后将立即生效汇入历史总账。
        </div>
        <div style="margin-bottom:12px;display:flex;align-items:center;background:#f8fafc;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;font-size:12px;">
            <span style="font-weight:600;margin-right:8px;color:#475569">🎭 模拟当前账号角色：</span>
            <label style="margin-right:12px;cursor:pointer"><input type="radio" name="simRoleInv" value="pm" checked onchange="document.getElementById('invContractSelect').innerHTML='<option>CI-2026-001 (我的负责合同)</option>'"> 项目经理(仅己方合同)</label>
            <label style="cursor:pointer"><input type="radio" name="simRoleInv" value="cw" onchange="document.getElementById('invContractSelect').innerHTML='<option>--看全量账本--</option><option>CI-2026-001 (李明)</option><option>CI-2026-002 (王芳)</option><option>CI-2026-003 (陈伟)</option>'"> 财务人员(看全量合同)</label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>合同编号 <span style="color:red">*</span></label><select id="invContractSelect" onchange="showToast('已自动带出关联项目名称与项目经理')"><option>CI-2026-001 (我的负责合同)</option></select></div>
            <div class="modal-form-group"><label>开票组织 <span style="color:red">*</span></label><select><option>总公司</option><option>分公司</option></select></div>
            <div class="modal-form-group"><label>开票客户 <span style="color:red">*</span></label><input type="text" placeholder="请输入单位全称"></div>
            <div class="modal-form-group"><label>开票日期 <span style="color:red">*</span></label><input type="date"></div>
            <div class="modal-form-group"><label>发票号 <span style="color:red">*</span></label><input type="text" placeholder="多张连号用逗号隔开"></div>
            <div class="modal-form-group"><label>币种</label><select><option>CNY</option><option>USD</option><option>EUR</option></select></div>
            <div class="modal-form-group"><label>总数量</label><input type="number" value="1"></div>
            <div class="modal-form-group"><label>总金额(元) <span style="color:red">*</span></label><input type="number" placeholder="必填，含税金额"></div>
            <div class="modal-form-group"><label>预计回款时间</label><input type="date"></div>
            <div class="modal-form-group"><label>项目经理</label><input type="text" placeholder="选择合同后带出" disabled style="background:#f8fafc;"></div>
            <div class="modal-form-group"><label>项目名称</label><input type="text" placeholder="选择合同后带出" disabled style="background:#f8fafc;"></div>
            <div class="modal-form-group"><label>凭证号</label><input type="text" placeholder="选填，如PZ-开头"></div>
        </div>
        <div class="modal-form-group"><label>备注说明</label><textarea placeholder="填报原因补充..."></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消放弃</button>
       <button class="btn btn-primary" onclick="showToast('✅ 已为您绕过审批，提交即生效入账！');closeModal()">确认提交 (立即生效)</button>`);
}
function showInvoiceEditDialog() { showInvoiceAddDialog(); }
function showInvoiceDetail() {
    openModal('开票明细台账记录', `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:8px; margin-bottom:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">合同编号：</span><strong style="color:var(--text-color);">CI-2026-001</strong></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">项目名称：</span><strong style="color:var(--text-color);">石化换热器A项全过程监理</strong></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">项目经理：</span><strong style="color:var(--text-color);">李明</strong></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">开票客户：</span><strong style="color:var(--text-color);">中国石油化工股份有限公司</strong></div>
            </div>
            <div style="height:1px;background:#e2e8f0;margin:12px 0;"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">开票组织：</span><span style="color:var(--text-color);">总公司</span></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">开票日期：</span><span style="color:var(--text-color);">2026-02-10</span></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">发票号：</span><span style="font-family:monospace;background:#f1f5f9;padding:2px 6px;border-radius:4px;color:var(--blue);">FP-202602-001</span></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">币种：</span><span style="color:var(--text-color);">CNY</span></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">总数量：</span><span style="color:var(--text-color);">1</span></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">总金额：</span><strong style="color:var(--danger-color);font-size:16px;">¥ 100,000.00</strong></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">预计回款：</span><span style="color:var(--orange);">2026-03-10</span></div>
                <div style="display:flex;"><span style="color:var(--text-muted);width:90px;">财务凭证号：</span><span style="color:var(--text-color);">PZ-001-A</span></div>
            </div>
        </div>
        <div>
            <span style="color:var(--text-muted);display:block;margin-bottom:8px;">填报备注信息：</span>
            <div style="background:#fffcf4;border:1px solid #fef08a;padding:12px;border-radius:6px;color:#854d0e;font-size:13px;line-height:1.5;">
                此处为系统第一期开票进度款，已人工核对税额无误。请项目部跟进下月度的回款进度催收情况。<br>
                历史流水对账单下载：<a href="#" style="color:var(--blue);text-decoration:none;">点击下载附属电子账单</a>
            </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭阅览</button>`);
}

// ===== 回款明细 - 新增 ==================================
function renderAutoMatchBox(val) {
    const box = document.getElementById('smartMatchBox');
    const amt = parseFloat(val) || 0;

    // 即使没输入金额，也把缺口发票列表展示出来！
    box.style.display = 'block';

    box.innerHTML = `
        <div style="background:#e0f2fe; padding:8px 12px; font-weight:600; font-size:13px; color:#0369a1; border-bottom:1px solid #bae6fd; display:flex; justify-content:space-between; align-items:center;">
            <span>🤖 系统智能核销运算：池内可用 [先进先出]</span>
            <span style="font-size:12px; font-weight:normal; background:#fff; padding:2px 8px; border-radius:12px; border:1px solid #7dd3fc;">本次待分配金额：<strong style="color:#b91c1c;font-size:14px;">￥${amt.toLocaleString()}</strong> 元</span>
        </div>
        
        <!-- 搜索过滤区 -->
        <div style="padding:10px 10px 0 10px; display:flex; gap:8px;">
            <input type="text" placeholder="🔍 检索发票号或备注..." style="flex:1; padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;">
            <input type="date" style="padding:6px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;">
            <button class="btn-mini btn-outline" onclick="showToast('检索成功')">筛选查询</button>
        </div>

        <div style="padding:10px;">
            <table style="width:100%;font-size:12px;border-collapse:collapse;margin-bottom:8px;">
                <tr style="background:#f8fafc;color:#64748b;border-bottom:1px solid #e2e8f0;">
                    <th style="padding:6px;text-align:left;width:30px;">核销</th>
                    <th style="padding:6px;text-align:left;">老发票号</th>
                    <th style="padding:6px;text-align:left;">开票日期</th>
                    <th style="padding:6px;text-align:right;">欠款缺口(元)</th>
                    <th style="padding:6px;text-align:right;">本次冲抵额(元)</th>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;background:#fff;">
                    <td style="padding:6px;"><input type="checkbox" ${amt > 0 ? 'checked' : ''} onclick="showToast('✅ 您已取消系统智能勾选，可纯手工填报抵扣金额！')"></td>
                    <td style="padding:6px;font-family:monospace;color:var(--blue);">FP-202602-001</td>
                    <td style="padding:6px;color:var(--text-muted);">2026-02-10</td>
                    <td style="padding:6px;text-align:right;color:#b45309;font-weight:600;">100,000</td>
                    <td style="padding:6px;text-align:right;">
                        <input type="number" value="${amt > 0 ? (amt > 100000 ? 100000 : amt) : ''}" placeholder="0" ${amt === 0 ? 'disabled' : ''} style="width:80px;text-align:right;padding:2px 4px;border:1px solid ${amt > 0 ? 'var(--blue)' : '#e2e8f0'};color:${amt > 0 ? 'var(--blue)' : '#94a3b8'};font-weight:bold;outline:none;background:${amt === 0 ? '#f8fafc' : '#fff'}">
                    </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;background:${amt > 100000 ? '#fff' : '#fafafa'};">
                    <td style="padding:6px;"><input type="checkbox" ${amt > 100000 ? 'checked' : ''}></td>
                    <td style="padding:6px;font-family:monospace;color:${amt > 100000 ? 'var(--blue)' : 'var(--text-muted)'};">FP-202603-009 (新票)</td>
                    <td style="padding:6px;color:var(--text-muted);">2026-03-05</td>
                    <td style="padding:6px;text-align:right;color:${amt > 100000 ? '#b45309' : 'var(--text-muted)'};font-weight:${amt > 100000 ? '600' : 'normal'};">50,000</td>
                    <td style="padding:6px;text-align:right;">
                        <input type="number" value="${amt > 100000 ? (amt - 100000) : ''}" placeholder="0" ${amt <= 100000 ? 'disabled' : ''} style="width:80px;text-align:right;padding:2px 4px;border:1px solid ${amt > 100000 ? 'var(--blue)' : '#e2e8f0'};color:${amt > 100000 ? 'var(--blue)' : '#94a3b8'};font-weight:bold;outline:none;background:${amt <= 100000 ? '#f8fafc' : '#fff'}">
                    </td>
                </tr>
            </table>
            <div style="font-size:11px;color:var(--text-muted);text-align:right;">
                💡 匹配如有误，可取消系统打钩，人工输入冲抵额重新分配
            </div>
        </div>
    `;
}

window.renderAutoMatchBox = renderAutoMatchBox;

function showPaymentAddDialog() {
    openModal('新增实际回款记录 / 记账核销', `
        <div style="margin-bottom:12px;display:flex;align-items:center;background:#f8fafc;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;font-size:12px;">
            <span style="font-weight:600;margin-right:8px;color:#475569">🎭 模拟当前账号角色：</span>
            <label style="margin-right:12px;cursor:pointer"><input type="radio" name="simRolePay" value="pm" checked onchange="document.getElementById('payContractSelect').innerHTML='<option>CI-2026-001 (我的负责合同)</option>'"> 项目经理(仅己方合同)</label>
            <label style="cursor:pointer"><input type="radio" name="simRolePay" value="cw" onchange="document.getElementById('payContractSelect').innerHTML='<option>--看全量账本--</option><option>CI-2026-001 (李明)</option><option>CI-2026-002 (王芳)</option>'"> 财务人员(看全量库)</label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="modal-form-group"><label>合同编号 <span style="color:red">*</span></label><select id="payContractSelect" onchange="showToast('已锁定该合同的【待平账发票池】'); window.renderAutoMatchBox(document.getElementById('mockPayAmt').value)"><option>--请选择--</option><option>CI-2026-001 (我的负责合同)</option></select></div>
        <div class="modal-form-group"><label>对方单位 <span style="color:red">*</span></label><input type="text" placeholder="请输入打款方名称"></div>
        <div class="modal-form-group"><label>回款金额(元) <span style="color:red">*</span></label><input type="number" id="mockPayAmt" placeholder="输入金额激活自动核销" oninput="window.renderAutoMatchBox(this.value)"></div>
        <div class="modal-form-group"><label>回款时间 <span style="color:red">*</span></label><input type="date"></div>
    </div>
    
    <!-- 🔥智能合账明细弹窗专属容器🔥 默认显示占位符 -->
    <div id="smartMatchBox" style="margin-top:16px; border:2px solid #bae6fd; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(14,165,233,0.1);"></div>

    <div class="modal-form-group" style="margin-top:16px;"><label>回款凭证扫件(pdf/图片) <span style="color:red">*</span></label>
        <div style="border:2px dashed var(--blue);border-radius:8px;padding:20px;text-align:center;background:#f8fafc;color:var(--blue);cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='#e0f2fe'" onmouseout="this.style.background='#f8fafc'">
            <div style="font-size:20px;margin-bottom:6px;">📎</div>
            <div style="font-weight:600;">点击上传流水或水单</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">(单文件≤10MB)</div>
        </div>
    </div>
    <div class="modal-form-group" style="margin-top:10px;"><label>财务审批与特殊备注</label><textarea placeholder="如需线下走账、退款重开说明等..." style="height:60px;"></textarea></div>
`, `<button class="btn btn-outline" onclick="closeModal()">放弃操作</button>
   <button class="btn btn-primary" onclick="showToast('✅ 回款及核销绑定关系建立成功！');closeModal()">确认结账并核销 (立即生效)</button>`);

    // 强制将此弹窗拉大(加宽)
    document.getElementById('modalBox').style.maxWidth = '1100px';

    // 在弹窗打开时，默认调用一次渲染逻辑，直接把发票本子铺出来
    setTimeout(() => {
        window.renderAutoMatchBox(document.getElementById('mockPayAmt').value);
    }, 50);
}
function showPaymentDetail() {
    openModal('回款凭证视图', `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:8px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:16px;">回款认定额：<strong style="color:var(--green);font-size:22px;">¥ 80,000.00</strong></div>
                <div style="color:#166534;">到账时间：2026-02-05</div>
            </div>
            <div style="margin-top:12px; font-size:13px; color:#15803d;">
                <strong>自动销账映射：</strong> 当前款项已优先抵扣 [FP-202602-001] 发票应收款项。目前该发票尚欠 ¥ 20,000.00 缺口未平。
            </div>
        </div>
        <div style="font-weight:bold;margin-bottom:8px;color:var(--text-color);">原件水单快照：</div>
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:10px; background:#f8fafc; display:flex; gap:16px;">
            <div style="width:160px; height:100px; background:#fff; border:1px solid #ccc;  display:flex; justify-content:center; align-items:center; overflow:hidden; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <img src="https://images.unsplash.com/photo-1628156165201-16b7eb8e3988?auto=format&fit=crop&q=80&w=400" alt="银行流水假图片" style="width:100%;height:100%;object-fit:cover; opacity:0.8;">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                <span style="font-weight:600;color:var(--blue); font-size:15px; margin-bottom:4px;">☑ 中国建设银行电子回单_中国石化账期.pdf</span>
                <div style="font-size:12px;color:var(--text-muted); margin-bottom:12px;">上传时间: 2026-02-05 14:32:01 | 办理人: 李明 | 大小: 2.3MB</div>
                <div>
                     <button class="btn-mini btn-primary" onclick="showToast('正在打开PDF浏览器...')"><span style="margin-right:4px">👁</span> 网页内阅览原件</button>
                     <button class="btn-mini btn-outline"><span style="margin-right:4px">⬇</span> 下载附件</button>
                </div>
            </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭视窗</button>`);
}
function showPaymentResubmitDialog() { showPaymentAddDialog(); }

window.switchSummaryTab = function (btn, targetId) {
    var parent = btn.parentElement;
    parent.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    // 智能检测：在弹窗内还是页面内
    var container = btn.closest('#modalBox') || btn.closest('#page-summary');
    if (container) {
        var mgr = container.querySelector('[data-tab="dim-manager"]');
        var ctr = container.querySelector('[data-tab="dim-contract"]');
        if (mgr) mgr.style.display = targetId === 'dim-manager' ? 'block' : 'none';
        if (ctr) ctr.style.display = targetId === 'dim-contract' ? 'block' : 'none';
    }
    // 切换Tab时自动收起抽屉
    closeSummaryDrawer();
};

window.showSummaryDrawer = function (managerName, isModal) {
    if (isModal) {
        // Modal 版本：贴在 modalBox 右边缘
        var modalBox = document.getElementById('modalBox');
        if (!modalBox) return;
        modalBox.style.overflow = 'visible';
        modalBox.style.position = 'relative';
        var draw = document.getElementById('summary-side-drawer');
        if (!draw) {
            draw = document.createElement('div');
            draw.id = 'summary-side-drawer';
            draw.style.cssText = 'position:absolute; left:100%; top:0; bottom:0; width:420px; background:#fff; border-radius:0 12px 12px 0; box-shadow:5px 0 20px rgba(0,0,0,0.12); display:flex; flex-direction:column; border-left:1px solid #e2e8f0; transform:translateX(-20px); opacity:0; transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
            draw.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding:16px 20px; background:#f8fafc; border-radius:0 12px 0 0;"><div style="display:flex; align-items:center; gap:8px;"><span style="font-size:18px;">📋</span><h4 id="summary-side-drawer-title" style="margin:0; font-size:15px; color:#1e293b; font-weight:600;">管辖项目明细</h4></div><button style="background:none; border:none; font-size:22px; cursor:pointer; color:#94a3b8; line-height:1;" onclick="closeSummaryDrawer();">&times;</button></div><div style="padding:12px 16px; border-bottom:1px solid #e2e8f0; background:#fff;"><div style="display:flex; gap:6px; align-items:center;"><input type="text" placeholder="合同编号/对方单位" style="flex:1; padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px;"><select style="padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px;"><option>全部状态</option><option>回款健康</option><option>坏账预警</option></select><button class="btn btn-primary" style="padding:5px 10px; font-size:12px;">检索</button></div></div><div class="table-wrapper" style="margin:0; flex:1; overflow-y:auto; padding:12px 16px; background:#fbfcfe; border-radius:0 0 12px 0;"><table class="data-table" style="box-shadow: 0 1px 3px rgba(0,0,0,0.05);"><thead><tr><th style="background:#f1f5f9">合同编号</th><th style="background:#f1f5f9">对方单位</th><th style="text-align:right;background:#f1f5f9">合同规模</th><th style="text-align:right;background:#f1f5f9">累计回款</th></tr></thead><tbody id="summary-side-drawer-body"></tbody></table></div>';
            modalBox.appendChild(draw);
            draw.offsetHeight;
        }
        document.getElementById('summary-side-drawer-title').innerText = '【' + managerName + '】 - 管辖项目穿透明细';
        var tbody = document.getElementById('summary-side-drawer-body');
        if (managerName === '李明') {
            tbody.innerHTML = '<tr><td><span class="link-text">CI-2026-001</span></td><td>中国石化</td><td style="text-align:right">1,200,000</td><td style="color:var(--green); font-weight:600; text-align:right">180,000</td></tr><tr><td><span class="link-text">CI-2026-003</span></td><td>中国海油</td><td style="text-align:right">860,000</td><td style="color:var(--green); font-weight:600; text-align:right">80,000</td></tr>';
        } else {
            tbody.innerHTML = '<tr><td><span class="link-text">CI-2026-002</span></td><td>中国石油</td><td style="text-align:right">800,000</td><td style="color:var(--green); font-weight:600; text-align:right">800,000</td></tr>';
        }
        draw.style.transform = 'translateX(0)';
        draw.style.opacity = '1';
    } else {
        // Page 版本：fixed 在屏幕右侧
        var draw2 = document.getElementById('global-summary-drawer');
        if (!draw2) {
            draw2 = document.createElement('div');
            draw2.id = 'global-summary-drawer';
            draw2.style.cssText = 'position:fixed; right:0; top:0; bottom:0; width:500px; background:#fff; z-index:10000; box-shadow:-5px 0 20px rgba(0,0,0,0.15); transform:translateX(100%); transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); display:flex; flex-direction:column; border-left:1px solid #cbd5e1;';
            draw2.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding:20px; background:#f8fafc;"><div style="display:flex; align-items:center; gap:8px;"><span style="font-size:20px;">📋</span><h4 id="global-summary-drawer-title" style="margin:0; font-size:16px; color:#1e293b; font-weight:600;">管辖项目明细</h4></div><button style="background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8; line-height:1;" onclick="closeSummaryDrawer();">&times;</button></div><div style="padding:16px; border-bottom:1px solid #e2e8f0; background:#fff;"><div style="display:flex; gap:8px; align-items:center;"><input type="text" placeholder="合同编号/对方单位" style="flex:1; padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px;"><select style="padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; font-size:13px;"><option>全部状态</option><option>回款健康</option><option>坏账预警</option></select><button class="btn btn-primary" style="padding:6px 12px; font-size:13px;">检索</button></div></div><div class="table-wrapper" style="margin:0; flex:1; overflow-y:auto; padding:16px; background:#fbfcfe;"><table class="data-table" style="box-shadow: 0 1px 3px rgba(0,0,0,0.05);"><thead><tr><th style="background:#f1f5f9">合同编号</th><th style="background:#f1f5f9">对方单位</th><th style="text-align:right;background:#f1f5f9">合同规模</th><th style="text-align:right;background:#f1f5f9">累计回款</th></tr></thead><tbody id="global-summary-drawer-body"></tbody></table></div>';
            document.body.appendChild(draw2);
            draw2.offsetHeight;
        }
        document.getElementById('global-summary-drawer-title').innerText = '【' + managerName + '】 - 管辖维度项目穿透明细表';
        var tbody2 = document.getElementById('global-summary-drawer-body');
        if (managerName === '李明') {
            tbody2.innerHTML = '<tr><td><span class="link-text">CI-2026-001</span></td><td>中国石化</td><td style="text-align:right">1,200,000</td><td style="color:var(--green); font-weight:600; text-align:right">180,000</td></tr><tr><td><span class="link-text">CI-2026-003</span></td><td>中国海油</td><td style="text-align:right">860,000</td><td style="color:var(--green); font-weight:600; text-align:right">80,000</td></tr>';
        } else {
            tbody2.innerHTML = '<tr><td><span class="link-text">CI-2026-002</span></td><td>中国石油</td><td style="text-align:right">800,000</td><td style="color:var(--green); font-weight:600; text-align:right">800,000</td></tr>';
        }
        draw2.style.transform = 'translateX(0)';
    }
};

window.closeSummaryDrawer = function () {
    var d1 = document.getElementById('global-summary-drawer');
    if (d1) { d1.style.transform = 'translateX(100%)'; }
    var d2 = document.getElementById('summary-side-drawer');
    if (d2) { d2.style.transform = 'translateX(-20px)'; d2.style.opacity = '0'; }
};

function showPaymentSummaryDialog() {
    openWideModal('📊 平台业绩与资金大盘汇总透视', `
        <div style="font-size:13px; color:var(--text-muted); background:#f0f9ff; padding:8px 12px; border:1px solid #bae6fd; border-radius:6px; margin-bottom:16px;">
            💡 <strong>系统提示：</strong> 该数据看板抽取自平台业务底座，数据实时连通。
        </div>
        <div class="tab-bar" style="margin-bottom:16px;">
            <button class="tab-btn active" onclick="switchSummaryTab(this,'dim-manager')">🧔 按项目经理聚合</button>
            <button class="tab-btn" onclick="switchSummaryTab(this,'dim-contract')">📜 按合同立项聚合</button>
        </div>
        
        <div data-tab="dim-manager">
            <!-- 搜索栏 -->
            <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; align-items:center;">
                <input type="text" placeholder="输入项目经理姓名" style="padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px; width:150px;">
                <input type="month" style="padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px;">
                <button class="btn btn-primary" style="padding:5px 12px; font-size:12px;" onclick="showToast('检索成功')">🔍 查询检索</button>
                <button class="btn btn-outline" style="padding:5px 12px; font-size:12px;">↻ 重置</button>
            </div>
            
            <!-- 顶部KPI卡片 -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px;">
                <div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:12px;text-align:center;">
                    <div style="font-size:12px;color:#ca8a04;">团队今年总计签约</div><div style="font-size:20px;font-weight:700;color:#a16207;">2,000,000</div>
                </div>
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;text-align:center;">
                    <div style="font-size:12px;color:#2563eb;">当年累计开票总额</div><div style="font-size:20px;font-weight:700;color:#1d4ed8;">1,400,000</div>
                </div>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;text-align:center;">
                    <div style="font-size:12px;color:#16a34a;">当年累计真金回笼</div><div style="font-size:20px;font-weight:700;color:#15803d;">980,000</div>
                </div>
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;text-align:center;">
                    <div style="font-size:12px;color:#dc2626;">悬空未收死账预警</div><div style="font-size:20px;font-weight:700;color:#b91c1c;">420,000</div>
                </div>
            </div>
            
            <div style="min-height: 400px; position:relative;">
                <div class="table-wrapper" style="margin:0;"><table class="data-table">
                    <thead><tr><th>项目经理</th><th>管辖合同数</th><th>管辖总金额</th><th>累计开出票据</th><th>真金回笼款(元)</th><th>综合兑付率</th><th>未收款坏账额</th><th style="width:80px;text-align:center">操作</th></tr></thead>
                    <tbody>
                        <tr style="cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f0f9ff'" onmouseout="this.style.background=''" onclick="showSummaryDrawer('李明', true)" title="点击查看详情">
                            <td><strong>李明</strong></td><td>2</td><td>1,200,000</td><td>600,000</td><td style="color:var(--green);font-weight:600;">180,000</td><td>30.0%</td><td style="color:var(--danger-color)">420,000</td>
                            <td style="text-align:center"><button class="btn-mini btn-outline" style="color:var(--blue); border-color:var(--blue);" onclick="event.stopPropagation();showSummaryDrawer('李明', true)">抽屉详情 〉</button></td>
                        </tr>
                        <tr style="cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f0f9ff'" onmouseout="this.style.background=''" onclick="showSummaryDrawer('王芳', true)" title="点击查看详情">
                            <td><strong>王芳</strong></td><td>1</td><td>800,000</td><td>800,000</td><td style="color:var(--green);font-weight:600;">800,000</td><td>100%</td><td>0</td>
                            <td style="text-align:center"><button class="btn-mini btn-outline" style="color:var(--blue); border-color:var(--blue);" onclick="event.stopPropagation();showSummaryDrawer('王芳', true)">抽屉详情 〉</button></td>
                        </tr>
                    </tbody>
                </table></div>
            </div>
        </div>
        
        <div data-tab="dim-contract" style="display:none;">
            <!-- 搜索栏 -->
            <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; align-items:center;">
                <input type="text" placeholder="合同编号" style="padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px; width:120px;">
                <input type="text" placeholder="对方单位(模糊过滤)" style="padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px; width:150px;">
                <input type="text" placeholder="项目经理" style="padding:5px 8px; border:1px solid var(--border-color); border-radius:4px; font-size:12px; width:100px;">
                <button class="btn btn-primary" style="padding:5px 12px; font-size:12px;" onclick="showToast('检索成功')">🔍 查询检索</button>
                <button class="btn btn-outline" style="padding:5px 12px; font-size:12px;">↻ 重置</button>
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
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭全局视角大盘</button>`);

    // 自适应调整一点宽度
    document.getElementById('modalBox').style.maxWidth = '1100px';
}

// ===== 提醒 =====
function showReminderAddDialog() {
    openModal('新增提醒设置', `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>类型</label><select><option>开票</option><option>回款</option></select></div>
            <div class="modal-form-group"><label>合同类型</label><select><option>人工日</option><option>总价</option><option>人工日计算总价</option></select></div>
            <div class="modal-form-group"><label>委托方</label><input type="text"></div>
            <div class="modal-form-group"><label>监理编号</label><select><option>CI-2026-001</option><option>CI-2026-002</option></select></div>
            <div class="modal-form-group"><label>超期时间(天)</label><input type="number" value="30"></div>
            <div class="modal-form-group"><label>提醒频率</label><select><option>每天</option><option>每3天</option><option>每周</option><option>每月</option></select></div>
            <div class="modal-form-group"><label>状态</label><select><option>开启</option><option>关闭</option></select></div>
        </div>
        <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue)">💡 保存后设定定时任务，按规则推送站内消息至合同负责人(总监代表)</div>
    `);
}
function showReminderFreqDict() {
    openModal('提醒频率字典设置', `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">频率字典：天数可新增、编辑、删除</div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr><th>频率名称</th><th>天数</th><th>操作</th></tr></thead>
            <tbody>
                <tr><td>每天</td><td>1</td><td><button class="btn-mini btn-primary">编辑</button> <button class="btn-mini btn-danger">删除</button></td></tr>
                <tr><td>每3天</td><td>3</td><td><button class="btn-mini btn-primary">编辑</button> <button class="btn-mini btn-danger">删除</button></td></tr>
                <tr><td>每周</td><td>7</td><td><button class="btn-mini btn-primary">编辑</button> <button class="btn-mini btn-danger">删除</button></td></tr>
                <tr><td>每月</td><td>30</td><td><button class="btn-mini btn-primary">编辑</button> <button class="btn-mini btn-danger">删除</button></td></tr>
            </tbody>
        </table></div>
        <div style="margin-top:8px"><button class="btn btn-primary" onclick="showToast('新增频率')">➕ 新增频率</button></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 成本明细 — 人员成本清单 =====
function showCostPersonnelDialog(ci) {
    openWideModal('人员成本清单 - ' + ci, `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
            <input type="text" placeholder="姓名" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:100px;">
            <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
            <span style="color:#999;line-height:28px;font-size:13px;">~</span>
            <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showToast('查询成功')">🔍 查询</button>
            <button class="btn btn-outline" style="padding:5px 12px" onclick="showToast('已重置')">↻ 重置</button>
            <button class="btn btn-success" style="padding:5px 12px" onclick="doExport('人员成本清单')">📥 导出</button>
        </div>
        <div style="padding:10px;background:var(--purple-light);border-radius:6px;font-size:12px;color:var(--purple);margin-bottom:8px">
            📐 核算规则：以监理人员为维度，若一人在统计周期内同时参与N个派单（并发执行），则该人员的工时成本按派单数等比拆分，每单分摊 = 工时 ÷ N × 单价。<strong>单价为敏感薪资数据，仅参与后台计算，界面不展示明文。</strong>
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr>
                <th>姓名</th>
                <th>工时(天)</th>
                <th>并发派单明细</th>
                <th>本合同有效工时</th>
                <th>单价(元/天)</th>
                <th>个人成本(元)</th>
            </tr></thead>
            <tbody>
                <tr>
                    <td>张三</td>
                    <td>34</td>
                    <td>
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">共 <strong>2</strong> 个并发派单，本合同工时按½拆分：</div>
                        <div style="display:flex;flex-direction:column;gap:3px;">
                            <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;background:#e8f0fe;border:1px solid #c5d8f8;border-radius:3px;padding:2px 6px;color:#1565c0;">
                                📋 PD-20260115-01 <span style="color:#888;">（本合同派单）</span>
                            </span>
                            <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;background:#f3f4f6;border:1px solid #d1d5db;border-radius:3px;padding:2px 6px;color:#6b7280;">
                                📋 PD-20260108-02 <span style="color:#aaa;">（其他合同并发）</span>
                            </span>
                        </div>
                    </td>
                    <td>17.00 <span style="font-size:11px;color:var(--text-muted);">(34÷2)</span></td>
                    <td><span style="color:var(--text-muted);user-select:none;letter-spacing:2px;">****</span></td>
                    <td class="text-right">13,600.00</td>
                </tr>
                <tr>
                    <td>李四</td>
                    <td>34</td>
                    <td>
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">共 <strong>1</strong> 个派单，工时不拆分：</div>
                        <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;background:#e8f0fe;border:1px solid #c5d8f8;border-radius:3px;padding:2px 6px;color:#1565c0;">
                            📋 PD-20260115-01 <span style="color:#888;">（本合同派单）</span>
                        </span>
                    </td>
                    <td>34.00 <span style="font-size:11px;color:var(--text-muted);">(34÷1)</span></td>
                    <td><span style="color:var(--text-muted);user-select:none;letter-spacing:2px;">****</span></td>
                    <td class="text-right">22,100.00</td>
                </tr>
                <tr>
                    <td>陈伟</td>
                    <td>34</td>
                    <td>
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">共 <strong>1</strong> 个派单，工时不拆分：</div>
                        <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;background:#e8f0fe;border:1px solid #c5d8f8;border-radius:3px;padding:2px 6px;color:#1565c0;">
                            📋 PD-20260115-01 <span style="color:#888;">（本合同派单）</span>
                        </span>
                    </td>
                    <td>34.00 <span style="font-size:11px;color:var(--text-muted);">(34÷1)</span></td>
                    <td><span style="color:var(--text-muted);user-select:none;letter-spacing:2px;">****</span></td>
                    <td class="text-right">30,600.00</td>
                </tr>
                <tr style="background:var(--blue-light)"><td><strong>合计</strong></td><td>—</td><td>—</td><td>—</td><td>—</td><td class="text-right"><strong>66,300.00</strong></td></tr>
            </tbody>
        </table></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 0 0;margin-top:8px;border-top:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#64748b;">共 <strong>3</strong> 条记录，每页 <select style="padding:2px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"><option>10条/页</option><option>20条/页</option></select></span>
            <div style="display:flex;gap:4px;">
                <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;" disabled>上一页</button>
                <button style="padding:3px 10px;font-size:12px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;">1</button>
                <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;" disabled>下一页</button>
            </div>
            <div style="font-size:12px;">前往 <input type="number" value="1" style="width:36px;padding:2px;text-align:center;border:1px solid var(--border-color);border-radius:4px;"> 页</div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 成本明细 — 差旅成本清单 =====
function showCostTravelDialog(ci) {
    openWideModal('差旅成本清单 - ' + ci, `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
            <input type="text" placeholder="姓名" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:100px;">
            <input type="text" placeholder="出差单编号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:150px;">
            <input type="text" placeholder="关联派单编号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:150px;">
            <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
            <span style="color:#999;line-height:28px;font-size:13px;">~</span>
            <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showToast('查询成功')">🔍 查询</button>
            <button class="btn btn-outline" style="padding:5px 12px" onclick="showToast('已重置')">↻ 重置</button>
            <button class="btn btn-success" style="padding:5px 12px" onclick="doExport('差旅成本清单')">📥 导出</button>
        </div>
        <div style="padding:10px;background:#fff3cd;border-radius:6px;font-size:12px;color:#856404;margin-bottom:8px">
            💡 分摊规则：差旅成本以出差单为维度，一条出差单对应一条记录。出差期间若同时跨多个合同的派单，差旅费用默认按关联派单数量平均分摊到各合同；也可点击"调整"按钮手动修改该出差单在本合同各派单之间的具体分摊比例（支持按天数或按金额两种调整方式）。
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr>
                <th>姓名</th>
                <th>出差单编号</th>
                <th>出差天数</th>
                <th>关联派单</th>
                <th>本合同分摊天数</th>
                <th>本合同差旅成本(元)</th>
                <th>操作</th>
            </tr></thead>
            <tbody>
                <tr>
                    <td>张三</td>
                    <td>CC-20260201-001</td>
                    <td>5天<br><span style="font-size:11px;color:var(--text-muted);">2026-02-01~2026-02-05</span></td>
                    <td>
                        <div style="display:flex;flex-direction:column;gap:3px;">
                            <span style="font-size:11px;background:#e8f0fe;border:1px solid #c5d8f8;border-radius:3px;padding:2px 6px;color:#1565c0;">📋 PD-20260115-01 （本合同）</span>
                            <span style="font-size:11px;background:#f3f4f6;border:1px solid #d1d5db;border-radius:3px;padding:2px 6px;color:#6b7280;">📋 PD-20260108-02 （CI-2026-002）</span>
                        </div>
                        <div style="font-size:11px;color:#856404;margin-top:4px;">跨2个合同，本合同分摊½</div>
                    </td>
                    <td>3天 <span style="font-size:11px;color:var(--text-muted);">(已调整)</span></td>
                    <td class="text-right">2,400.00</td>
                    <td><button class="btn-mini btn-primary" onclick="showTravelAdjustDialog('CC-20260201-001')">调整</button></td>
                </tr>
                <tr>
                    <td>陈伟</td>
                    <td>CC-20260210-002</td>
                    <td>3天<br><span style="font-size:11px;color:var(--text-muted);">2026-02-10~2026-02-12</span></td>
                    <td>
                        <div style="display:flex;flex-direction:column;gap:3px;">
                            <span style="font-size:11px;background:#e8f0fe;border:1px solid #c5d8f8;border-radius:3px;padding:2px 6px;color:#1565c0;">📋 PD-20260115-01 （本合同）</span>
                        </div>
                        <div style="font-size:11px;color:#15803d;margin-top:4px;">仅关联本合同，全额分摊</div>
                    </td>
                    <td>3天 <span style="font-size:11px;color:var(--text-muted);">(默认)</span></td>
                    <td class="text-right">1,800.00</td>
                    <td><button class="btn-mini btn-primary" onclick="showTravelAdjustDialog('CC-20260210-002')">调整</button></td>
                </tr>
                <tr>
                    <td>李四</td>
                    <td>CC-20260215-003</td>
                    <td>7天<br><span style="font-size:11px;color:var(--text-muted);">2026-02-15~2026-02-21</span></td>
                    <td>
                        <div style="display:flex;flex-direction:column;gap:3px;">
                            <span style="font-size:11px;background:#e8f0fe;border:1px solid #c5d8f8;border-radius:3px;padding:2px 6px;color:#1565c0;">📋 PD-20260115-01 （本合同）</span>
                            <span style="font-size:11px;background:#f3f4f6;border:1px solid #d1d5db;border-radius:3px;padding:2px 6px;color:#6b7280;">📋 PD-20260201-05 （CI-2026-003）</span>
                        </div>
                        <div style="font-size:11px;color:#856404;margin-top:4px;">跨2个合同，本合同分摊½（已调整）</div>
                    </td>
                    <td>4天 <span style="font-size:11px;color:var(--text-muted);">(已调整)</span></td>
                    <td class="text-right">3,200.00</td>
                    <td><button class="btn-mini btn-primary" onclick="showTravelAdjustDialog('CC-20260215-003')">调整</button></td>
                </tr>
                <tr style="background:var(--blue-light)">
                    <td><strong>合计</strong></td><td>—</td><td>15天</td><td>—</td><td>10天</td>
                    <td class="text-right"><strong>7,400.00</strong></td><td>—</td>
                </tr>
            </tbody>
        </table></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 0 0;margin-top:8px;border-top:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#64748b;">共 <strong>3</strong> 条记录，每页 <select style="padding:2px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"><option>10条/页</option><option>20条/页</option></select></span>
            <div style="display:flex;gap:4px;">
                <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;" disabled>上一页</button>
                <button style="padding:3px 10px;font-size:12px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;">1</button>
                <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;" disabled>下一页</button>
            </div>
            <div style="font-size:12px;">前往 <input type="number" value="1" style="width:36px;padding:2px;text-align:center;border:1px solid var(--border-color);border-radius:4px;"> 页</div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 成本明细 — 固定支出清单 =====
function showCostFixedDialog(ci) {
    openWideModal('固定支出清单 - ' + ci, `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
            <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部成本类型</option><option>服务人员成本</option><option>资料费用</option><option>其他采购费用</option></select>
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showToast('查询成功')">🔍 查询</button>
            <button class="btn btn-outline" style="padding:5px 12px" onclick="showToast('已重置')">↻ 重置</button>
            <button class="btn btn-success" style="padding:5px 12px" onclick="doExport('固定支出')">📥 导出</button>
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showCostFixedAddDialog('${ci}')">➕ 新增</button>
        </div>
        <div style="padding:10px;background:#fff3e0;border-radius:6px;font-size:12px;color:#e65100;margin-bottom:8px">
            📋 该合同的固定支出成本明细（合同层面，不涉及派单分摊）
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table" data-ci="${ci}">
            <thead><tr>
                <th>序号</th>
                <th>成本类型</th>
                <th>服务人员成本(元)</th>
                <th>资料费用(元)</th>
                <th>其他采购费用(元)</th>
                <th>金额(元)</th>
                <th>产生日期</th>
                <th>录入人员</th>
                <th>操作</th>
            </tr></thead>
            <tbody>
                <tr id="costFixedRow1">
                    <td>1</td>
                    <td>服务人员成本</td>
                    <td class="text-right"><strong>8000.00</strong></td>
                    <td class="text-right">0.00</td>
                    <td class="text-right">0.00</td>
                    <td class="text-right"><strong>8,000.00</strong></td>
                    <td>2026-02-15</td>
                    <td>财务张三</td>
                    <td><button class="btn-mini btn-outline" onclick="editCostFixedRow(1)">编辑</button></td>
                </tr>
                <tr id="costFixedRow2">
                    <td>2</td>
                    <td>资料费用</td>
                    <td class="text-right">0.00</td>
                    <td class="text-right"><strong>5000.00</strong></td>
                    <td class="text-right">0.00</td>
                    <td class="text-right"><strong>5,000.00</strong></td>
                    <td>2026-02-01</td>
                    <td>财务张</td>
                    <td><button class="btn-mini btn-outline" onclick="editCostFixedRow(2)">编辑</button></td>
                </tr>
                <tr style="background:var(--blue-light)">
                    <td><strong>合计</strong></td>
                    <td class="text-right"><strong>15,000</strong></td>
                    <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
                </tr>
            </tbody>
        </table></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 0 0;margin-top:8px;border-top:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#64748b;">共 <strong>2</strong> 条记录，每页 <select style="padding:2px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;"><option>10条/页</option><option>20条/页</option></select></span>
            <div style="display:flex;gap:4px;">
                <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;" disabled>上一页</button>
                <button style="padding:3px 10px;font-size:12px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;">1</button>
                <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;" disabled>下一页</button>
            </div>
            <div style="font-size:12px;">前往 <input type="number" value="1" style="width:36px;padding:2px;text-align:center;border:1px solid var(--border-color);border-radius:4px;"> 页</div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 固定支出 — 新增表单（按合同分摊） =====
function showCostFixedAddDialog() {
    openWideModal('固定成本填报', `
        <div style="background:#e8f5e9;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid #4caf50;font-size:12px;color:#2e7d32;">
            ✅ 新增固定成本，按合同进行分摊
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;font-size:13px;margin-bottom:14px;">
            <div>
                <label style="display:block;font-weight:600;margin-bottom:6px;">费用类型 <span style="color:red">*</span></label>
                <select style="width:100%;padding:7px 10px;border:1px solid var(--border-color);border-radius:6px;font-size:13px;">
                    <option value="">请选择</option>
                    <option>服务人员成本</option>
                    <option>资料费用</option>
                    <option>其他采购费用</option>
                </select>
            </div>
            <div>
                <label style="display:block;font-weight:600;margin-bottom:6px;">费用名称 <span style="color:red">*</span></label>
                <input type="text" placeholder="请输入费用名称" style="width:100%;padding:7px 10px;border:1px solid var(--border-color);border-radius:6px;font-size:13px;box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:600;margin-bottom:6px;">总金额(元) <span style="color:red">*</span></label>
                <input type="number" id="totalAmount2" placeholder="请输入总金额" oninput="updateAllocationPreview2()" style="width:100%;padding:7px 10px;border:1px solid var(--border-color);border-radius:6px;font-size:13px;box-sizing:border-box;">
            </div>
        </div>
        <div style="margin-bottom:14px;">
            <label style="display:block;font-weight:600;margin-bottom:8px;font-size:13px;">分摊方式 <span style="color:red">*</span></label>
            <div style="padding:12px;border:1px solid #e2e8f0;border-radius:6px;background:#fafafa;">
                <div style="display:flex;gap:16px;margin-bottom:10px;">
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
                        <input type="radio" name="allocationType2" value="avg" onchange="switchAllocationType2('avg')"> 平均分摊到所有合同
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
                        <input type="radio" name="allocationType2" value="manual" onchange="switchAllocationType2('manual')"> 手动选择合同
                    </label>
                </div>
                <div id="allocationArea2" style="display:none;">
                    <div style="font-size:12px;color:#64748b;margin-bottom:8px;">分摊合同列表：</div>
                    <div id="contractList2" style="max-height:250px;overflow-y:auto;"></div>
                </div>
            </div>
        </div>
        <div style="margin-bottom:14px;">
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:13px;">备注说明</label>
            <textarea placeholder="请输入备注（选填）" style="width:100%;height:60px;padding:8px 10px;border:1px solid var(--border-color);border-radius:6px;font-size:13px;resize:vertical;box-sizing:border-box;"></textarea>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('固定成本已提交');closeModal()">确认提交</button>`);
}

function switchAllocationType2(type) {
    const area = document.getElementById('allocationArea2');
    const list = document.getElementById('contractList2');
    const contracts = [
        { id: 'CI-2026-001', name: '某石化换热器监造' },
        { id: 'CI-2026-002', name: '压力容器制造监理' },
        { id: 'CI-2026-003', name: '锅炉制造过程监理' },
        { id: 'CI-2026-004', name: '海上平台结构件监造' },
        { id: 'CI-2026-005', name: '核电设备制造监理' },
        { id: 'CI-2026-006', name: '风电塔筒焊接监造' }
    ];

    area.style.display = 'block';

    if (type === 'avg') {
        let html = '<table class="data-table" style="font-size:12px;"><thead><tr><th>合同编号</th><th>合同名称</th><th>分摊金额(元)</th></tr></thead><tbody>';
        const amount = parseFloat(document.getElementById('totalAmount2').value) || 0;
        const avgAmount = amount > 0 ? (amount / contracts.length).toFixed(2) : '—';
        contracts.forEach(c => {
            html += `<tr><td>${c.id}</td><td>${c.name}</td><td><strong>${avgAmount}</strong></td></tr>`;
        });
        html += '</tbody></table>';
        list.innerHTML = html;
    } else {
        let html = '<table class="data-table" style="font-size:12px;"><thead><tr><th style="width:40px;">选择</th><th>合同编号</th><th>合同名称</th><th>分摊金额(元)</th></tr></thead><tbody>';
        contracts.forEach(c => {
            html += `<tr><td style="text-align:center;"><input type="checkbox" onchange="updateAllocationPreview2()"></td><td>${c.id}</td><td>${c.name}</td><td class="alloc-amount">—</td></tr>`;
        });
        html += '</tbody></table>';
        list.innerHTML = html;
    }
}

function updateAllocationPreview2() {
    const type = document.querySelector('input[name="allocationType2"]:checked')?.value;
    if (type === 'manual') {
        const checked = document.querySelectorAll('#contractList2 input[type="checkbox"]:checked');
        const amount = parseFloat(document.getElementById('totalAmount2').value) || 0;
        const avgAmount = checked.length > 0 && amount > 0 ? (amount / checked.length).toFixed(2) : '—';
        document.querySelectorAll('#contractList2 tbody tr').forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const amountCell = row.querySelector('.alloc-amount');
            if (checkbox && amountCell) {
                amountCell.innerHTML = checkbox.checked ? `<strong style="color:#2e7d32;">${avgAmount}</strong>` : '—';
            }
        });
    }
}

// ===== 动态成本核算 — 专属导出弹窗 =====
function showCostExportDialog() {
    openWideModal('导出成本数据', `
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
            请选择导出范围。一级汇总仅包含合同维度合计数据；含明细导出会生成多工作表 Excel，包含各项成本明细。
        </div>
        <div class="tab-bar" style="margin-bottom:16px">
            <button class="tab-btn active" onclick="switchCostExportTab(this,'export-summary')">📋 导出一级汇总数据</button>
            <button class="tab-btn" onclick="switchCostExportTab(this,'export-detail')">📊 导出含明细数据（多Sheet）</button>
        </div>

        <div id="tab-export-summary">
            <div style="padding:10px;background:#f0f9ff;border-radius:6px;font-size:12px;color:#0369a1;margin-bottom:12px;">
                导出范围：当前筛选条件下的全部合同行，每行一条，包含各项成本合计数字。适合制作成本汇总报表或向上级汇报。
            </div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
                <div style="font-weight:600;margin-bottom:12px;color:#334155;border-bottom:1px solid #e2e8f0;padding-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
                    <span>导出字段选择</span>
                    <div>
                        <span style="font-size:12px;color:var(--blue);cursor:pointer;margin-right:12px;" onclick="document.querySelectorAll('#costExportSummaryFields input').forEach(i=>i.checked=true)">全选</span>
                        <span style="font-size:12px;color:var(--text-muted);cursor:pointer;" onclick="document.querySelectorAll('#costExportSummaryFields input').forEach(i=>i.checked=false)">清空</span>
                    </div>
                </div>
                <div id="costExportSummaryFields" style="display:flex;flex-wrap:wrap;gap:4px 0;">
                    ${['合同编号', '合同名称', '总工时(天)', '人员成本(元)', '差旅成本(元)', '固定支出成本(元)', '成本合计(元)'].map(f => `
                        <label style="display:inline-flex;align-items:center;gap:6px;margin-right:20px;margin-bottom:10px;font-size:13px;cursor:pointer;">
                            <input type="checkbox" checked> <span>${f}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:16px;">
                <div style="padding:12px 20px;border:1px solid #bae6fd;background:#f0f9ff;border-radius:8px;width:130px;text-align:center;">
                    <div style="font-size:24px;font-weight:700;color:#0369a1;">10</div>
                    <div style="font-size:11px;color:#0ea5e9;">合同记录（行）</div>
                </div>
                <div style="padding:12px 20px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:8px;width:130px;text-align:center;">
                    <div style="font-size:24px;font-weight:700;color:#15803d;">1</div>
                    <div style="font-size:11px;color:#22c55e;">工作表（Sheet）</div>
                </div>
            </div>
        </div>

        <div id="tab-export-detail" style="display:none;">
            <div style="padding:10px;background:#fdf4ff;border-radius:6px;font-size:12px;color:#7c3aed;margin-bottom:12px;">
                导出范围：包含一级汇总 + 三项成本明细，生成4个工作表的 Excel 文件。适合成本核查、财务对账、明细审计等场景。
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                        <span style="background:#1976d2;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:3px;">Sheet 1</span>
                        <span style="font-weight:600;font-size:13px;">成本汇总</span>
                    </div>
                    <div style="font-size:12px;color:#64748b;">合同编号、合同名称、总工时、人员成本、差旅成本、固定支出、成本合计（每合同一行）</div>
                </div>
                <div style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                        <span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:3px;">Sheet 2</span>
                        <span style="font-weight:600;font-size:13px;">人员成本明细</span>
                    </div>
                    <div style="font-size:12px;color:#64748b;">合同编号、姓名、总工时(天)、并发派单明细、有效工时、个人成本（单价不导出）</div>
                </div>
                <div style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                        <span style="background:#0891b2;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:3px;">Sheet 3</span>
                        <span style="font-weight:600;font-size:13px;">差旅成本明细</span>
                    </div>
                    <div style="font-size:12px;color:#64748b;">合同编号、姓名、出差单编号、出差天数、关联派单、本合同分摊天数、本合同差旅成本</div>
                </div>
                <div style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                        <span style="background:#059669;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:3px;">Sheet 4</span>
                        <span style="font-weight:600;font-size:13px;">固定支出明细</span>
                    </div>
                    <div style="font-size:12px;color:#64748b;">合同编号、成本类型、金额、关联派单数、分摊派单明细、每派单分摊金额、产生日期、录入人员</div>
                </div>
            </div>
        </div>
    `, `
        <button class="btn btn-outline" onclick="closeModal()">取消</button>
        <button class="btn btn-success" onclick="showToast('文件已生成，开始下载...');closeModal();">📥 确认导出</button>
    `);
}
function switchCostExportTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.getElementById('tab-export-summary').style.display = id === 'export-summary' ? 'block' : 'none';
    document.getElementById('tab-export-detail').style.display = id === 'export-detail' ? 'block' : 'none';
}

// ===== 差旅调整 =====
function showTravelAdjustDialog(code) {
    openWideModal('差旅成本分摊调整 - ' + code, `
        <!-- 出差单信息摘要 -->
        <div style="display:flex;flex-wrap:wrap;gap:16px;padding:10px 14px;background:#fff3cd;border-radius:6px;margin-bottom:12px;font-size:12px;color:#856404;">
            <span>📄 <strong>出差单号：</strong>${code}</span>
            <span>👤 <strong>出差人：</strong>张三</span>
            <span>📅 <strong>出差时间：</strong>2026-02-01 ~ 2026-02-05（共 5 天）</span>
            <span>💰 <strong>差旅总费用：</strong><strong style="font-size:14px;color:#d97706;">4,800.00 元</strong></span>
        </div>
        <!-- 说明 -->
        <div style="padding:8px 12px;background:#f0f9ff;border-radius:6px;font-size:12px;color:#0369a1;margin-bottom:12px;line-height:1.7;">
            💡 <strong>分摊逻辑说明：</strong>以派单为基本分摊单位。出差人在出差期间同时关联了以下派单，系统先将差旅费用按派单维度进行分配，再汇总至各派单所属合同的差旅成本总计。请确认或调整每个派单实际占用的出差天数（或金额）。
        </div>
        <div class="tab-bar" style="margin-bottom:12px">
            <button class="tab-btn active" onclick="switchTravelTab(this,'adj-day')">按天调整</button>
            <button class="tab-btn" onclick="switchTravelTab(this,'adj-amount')">按金额调整</button>
        </div>

        <!-- 按天调整 Tab -->
        <div id="tab-adj-day">
            <div style="font-size:12px;color:var(--blue);margin-bottom:8px;">
                按天调整：每日费率 = 差旅总费用 ÷ 出差总天数 = 4,800 ÷ 5 = <strong>960 元/天</strong>。调整各派单分摊天数，系统自动重算分摊金额。各派单调整天数之和须等于出差总天数（5天）。
            </div>
            <div style="overflow-x:auto;margin:0;">
                <table class="data-table" style="min-width:1000px;font-size:12px;">
                    <thead><tr>
                        <th style="min-width:120px;">派单编号</th>
                        <th style="min-width:90px;">所属合同</th>
                        <th style="min-width:120px;">合同名称</th>
                        <th style="min-width:60px;">监造形式</th>
                        <th style="min-width:80px;">制造厂</th>
                        <th style="min-width:70px;">总监代表</th>
                        <th style="min-width:90px;">计划开始</th>
                        <th style="min-width:90px;">计划结束</th>
                        <th style="min-width:70px;">默认分摊<br>天数</th>
                        <th style="min-width:80px;">调整分摊<br>天数</th>
                        <th style="min-width:110px;">本派单分摊<br>金额(元)</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td style="font-weight:600;color:#1565c0;">PD-20260115-01</td>
                            <td><span style="color:var(--primary);font-weight:600;">CI-2026-001</span></td>
                            <td>某石化换热器监造</td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td>东方锅炉</td>
                            <td>周磊</td>
                            <td>2026-01-20</td>
                            <td class="text-danger">2026-02-28</td>
                            <td style="text-align:center;">2.5天</td>
                            <td><input type="number" value="3" min="0" max="5" style="width:60px;padding:4px;border:1px solid var(--border-color);border-radius:4px;text-align:center;"></td>
                            <td class="text-right" style="color:#1976d2;font-weight:600;">2,880.00</td>
                        </tr>
                        <tr>
                            <td style="font-weight:600;color:#1565c0;">PD-20260108-02</td>
                            <td><span style="color:var(--primary);font-weight:600;">CI-2026-002</span></td>
                            <td>压力容器制造监理</td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td>南京金湖石化</td>
                            <td>陈总</td>
                            <td>2026-01-08</td>
                            <td>2026-03-08</td>
                            <td style="text-align:center;">2.5天</td>
                            <td><input type="number" value="2" min="0" max="5" style="width:60px;padding:4px;border:1px solid var(--border-color);border-radius:4px;text-align:center;"></td>
                            <td class="text-right" style="color:#1976d2;font-weight:600;">1,920.00</td>
                        </tr>
                        <tr style="background:var(--blue-light);">
                            <td colspan="9" style="text-align:right;font-weight:600;padding-right:12px;">合计</td>
                            <td style="text-align:center;font-weight:600;color:#e53935;">5天 ✓</td>
                            <td class="text-right"><strong>4,800.00</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top:8px;font-size:11px;color:#64748b;padding:6px 10px;background:#f8fafc;border-radius:4px;">
                ℹ️ 调整完成后，各派单的分摊金额将自动同步至对应合同（CI-2026-001 差旅成本 +2,880 元；CI-2026-002 差旅成本 +1,920 元）
            </div>
        </div>

        <!-- 按金额调整 Tab -->
        <div id="tab-adj-amount" style="display:none;">
            <div style="font-size:12px;color:var(--blue);margin-bottom:8px;">
                按金额调整：默认平均分摊，各派单分摊金额合计须等于差旅总费用（<strong>4,800.00 元</strong>）。
            </div>
            <div style="overflow-x:auto;margin:0;">
                <table class="data-table" style="min-width:1000px;font-size:12px;">
                    <thead><tr>
                        <th style="min-width:120px;">派单编号</th>
                        <th style="min-width:90px;">所属合同</th>
                        <th style="min-width:120px;">合同名称</th>
                        <th style="min-width:60px;">监造形式</th>
                        <th style="min-width:80px;">制造厂</th>
                        <th style="min-width:70px;">总监代表</th>
                        <th style="min-width:90px;">计划开始</th>
                        <th style="min-width:90px;">计划结束</th>
                        <th style="min-width:100px;">默认分摊<br>金额(元)</th>
                        <th style="min-width:120px;">调整分摊<br>金额(元)</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td style="font-weight:600;color:#1565c0;">PD-20260115-01</td>
                            <td><span style="color:var(--primary);font-weight:600;">CI-2026-001</span></td>
                            <td>某石化换热器监造</td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td>东方锅炉</td>
                            <td>周磊</td>
                            <td>2026-01-20</td>
                            <td class="text-danger">2026-02-28</td>
                            <td class="text-right">2,400.00</td>
                            <td><input type="number" value="2800" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px;"></td>
                        </tr>
                        <tr>
                            <td style="font-weight:600;color:#1565c0;">PD-20260108-02</td>
                            <td><span style="color:var(--primary);font-weight:600;">CI-2026-002</span></td>
                            <td>压力容器制造监理</td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td>南京金湖石化</td>
                            <td>陈总</td>
                            <td>2026-01-08</td>
                            <td>2026-03-08</td>
                            <td class="text-right">2,400.00</td>
                            <td><input type="number" value="2000" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px;"></td>
                        </tr>
                        <tr style="background:var(--blue-light);">
                            <td colspan="8" style="text-align:right;font-weight:600;padding-right:12px;">合计</td>
                            <td class="text-right"><strong>4,800.00</strong></td>
                            <td style="font-size:11px;color:#e53935;font-weight:600;">当前合计: 4,800.00 ✓</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top:8px;font-size:11px;color:#64748b;padding:6px 10px;background:#f8fafc;border-radius:4px;">
                ⚠️ 请确保各派单金额合计等于 4,800.00 元，否则保存时系统将提示差额错误。
            </div>
        </div>
    `, `
        <button class="btn btn-outline" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="showToast('分摊方案已保存，各合同成本已更新');closeModal();">✅ 保存分摊方案</button>
    `);
}
function switchTravelTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.getElementById('tab-adj-day').style.display = id === 'adj-day' ? 'block' : 'none';
    document.getElementById('tab-adj-amount').style.display = id === 'adj-amount' ? 'block' : 'none';
}

// ===== 导入弹窗 =====
function showImportDialog(name) {
    const isPayment = name === '回款明细';
    let importOptions = '';

    if (isPayment) {
        importOptions = `
            <div style="margin:20px 0; padding:16px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; text-align:left;">
                <div style="font-weight:600; color:#334155; margin-bottom:12px; font-size:14px;">🧮 回款与发票防呆挂接策略（请严格按规范填写模板）：</div>
                <div style="font-size:12px; color:#475569; line-height:1.6; margin-bottom:8px;">
                    <span style="color:#2563eb; font-weight:600;">前置条件：</span>系统中必须已存在对应的【合同编号】及【待核销发票】，否则回款无法挂账！
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                    <div style="background:#fff; padding:12px; border:1px solid #e2e8f0; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="color:#0ea5e9; font-weight:600; margin-bottom:4px; font-size:13px;">🤖 模式 A：智能先进先出 (推荐)</div>
                        <div style="font-size:12px; color:#64748b;">
                            <strong>模板填写：</strong>仅填【合同编号】+【回款金额】<br>
                            <strong>系统行为：</strong>自动在底池寻找该合同最老的欠款发票，强行按序分配平账，释放人力！
                        </div>
                    </div>
                    <div style="background:#fff; padding:12px; border:1px solid #e2e8f0; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="color:#10b981; font-weight:600; margin-bottom:4px; font-size:13px;">🎯 模式 B：定向强校验核销</div>
                        <div style="font-size:12px; color:#64748b;">
                            <strong>模板填写：</strong>在此基础上填写【定向核销发票池】列<br>
                            <strong>系统行为：</strong>关闭自动智能分配，绝对遵从表格指定的发票号和金额进行精准核销。如找不到发票，报错熔断！
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    openWideModal('Excel导入 - ' + name, `
        <!-- 核心拖拽区 -->
        <div style="border:2px dashed var(--blue);border-radius:12px;padding:30px;text-align:center;background:#f0f7ff;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='#e0f2fe'" onmouseout="this.style.background='#f0f7ff'">
            <div style="font-size:48px;margin-bottom:12px">📂</div>
            <div style="font-size:16px;font-weight:600;color:var(--blue)">点击或拖拽Excel文件到此处解析</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:8px">系统将自动清洗数据并执行关联前置校验（支持 .xlsx, .xls 格式）</div>
            <button class="btn btn-primary" style="margin-top:16px; pointer-events:none;">浏览本地文件</button>
        </div>
        
        <!-- 插入挂接策略动态说明（如果是回款的话） -->
        ${importOptions}
        
        <div style="margin-top:16px;text-align:center;">
            ${isPayment ? `
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">💡 系统依赖统一制式的 Excel 模板完成批量数据关联，请选择适合的模板：</div>
            <div style="display:flex; justify-content:center; gap:16px;">
                <button class="btn-mini btn-outline" style="border-color:#0ea5e9; color:#0ea5e9; padding:6px 16px;" onclick="showToast('正在下发: 模式A-智能先进先出模板...')">⬇ 下载《模式 A：智能先进先出模板》</button>
                <button class="btn-mini btn-outline" style="border-color:#10b981; color:#10b981; padding:6px 16px;" onclick="showToast('正在下发: 模式B-定向强校验模板...')">⬇ 下载《模式 B：定向强校验核销模板》</button>
            </div>
            ` : `
            <div style="font-size:13px;color:var(--text-muted)">💡 系统依赖统一制式的 Excel 模板完成批量数据关联：</div>
            <button class="btn-mini btn-outline" style="margin-top:8px;" onclick="showToast('正在下发带防呆说明的标准模板...')">⬇ 下载《${name}标准导入模板》</button>
            `}
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消放弃</button><button class="btn btn-primary" onclick="showToast('🗜 正在提交后台校验队列并执行导入...');closeModal()">发起预检并导入</button>`);

    // 如果是带长条说明的，适当拉大点弹窗
    if (isPayment) {
        document.getElementById('modalBox').style.maxWidth = '750px';
    } else {
        document.getElementById('modalBox').style.maxWidth = '600px';
    }
}


// ===== 导出 =====
window.updateExportColCount = function () {
    const box = document.getElementById('exportFieldBox');
    if (box) {
        document.getElementById('exportColCount').innerText = box.querySelectorAll('input:checked').length;
    }
};

function doExport(name) {
    const el = document.getElementById('exportOverlay');
    const isPayment = name.includes('回款');
    const isIncome = name.includes('收入');
    const isContract = name.includes('台账');
    const isWorkhour = name.includes('工时');
    const isManagerDim = name.includes('项目经理维度');
    const isContractDim = name.includes('合同维度');

    // 根据当前导出类型动态映射字段集合
    let fields = [];
    if (isManagerDim) {
        fields = ['项目经理', '管辖合同数', '管辖总金额', '累计开出票据', '真金回笼款(元)', '综合兑付率', '未收款坏账额'];
    } else if (isContractDim) {
        fields = ['合同编号', '对方单位', '项目经理', '合同规模', '累计变现(回款)', '回款笔数', '应开未开(缺口)', '结款健康度指示'];
    } else if (isPayment) {
        fields = ['合同编号', '对方单位', '回款时间', '关联发票说明', '当次回款金额', '签约总额', '已开产值', '历史总开票', '待开票缺口', '营收总额', '综合兑付率', '结款完善度'];
    } else if (isIncome) {
        fields = ['合同编号', '合同名称', '委托方', '项目经理', '合同类型', '合同金额', '总产值', '当月计划产值', '已报产值', '当月确认产值', '最新填报时间', '已报收入', '纠正剩余额度', '当月收入', '开票状态', '计划开票时间', '最新开票时间', '开票总金额', '最新收款时间', '收款总金额', '备注'];
    } else if (isContract) {
        fields = ['合同编号', '合同名称', '设备名称', '委托方', '制造方', '监造金额', '预给号时间', '项目经理', '合同签订时间', '合同起始日期', '合同终止日期', '合同类型', 'ERP录入', '项目编号', '合同状态'];
    } else if (isWorkhour) {
        fields = ['监理编号', '合同名称', '委托方', '制造厂', '监造金额', '项目负责人', '合同形式', '工时总计'];
    } else {
        // 默认开票明细
        fields = ['开票组织', '开票客户', '开票日期', '发票号', '币种', '总数量', '总金额(元)', '预计回款时间', '项目经理', '合同编号', '项目名称', '凭证号', '填报备注'];
    }

    let fieldCheckboxes = fields.map(f => `
        <label style="display:inline-flex; align-items:center; gap:6px; margin-right:16px; margin-bottom:12px; font-size:13px; cursor:pointer;">
            <input type="checkbox" checked onchange="window.updateExportColCount()"> <span>${f}</span>
        </label>
    `).join('');

    document.getElementById('exportBody').innerHTML = `
        <div style="text-align:center;padding:10px 10px 0 10px;">
            <div style="font-size:48px;margin-bottom:12px">📊</div>
            <h3 style="margin-bottom:8px">导出数据编排 - ${name}</h3>
            <div style="font-size:13px;color:var(--text-muted)">系统准备导出当前筛选条件下的记录，您可以按需勾选下方字段定制报表列。</div>
            
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-top:20px; text-align:left;">
                <div style="font-weight:600; margin-bottom:16px; color:#334155; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
                    <span>字段清单萃取池</span>
                    <div>
                        <span style="font-size:12px; color:var(--blue); cursor:pointer; margin-right:12px;" onclick="Array.from(document.getElementById('exportFieldBox').querySelectorAll('input')).forEach(i=>i.checked=true); window.updateExportColCount();">全选全部</span>
                        <span style="font-size:12px; color:var(--text-muted); cursor:pointer;" onclick="Array.from(document.getElementById('exportFieldBox').querySelectorAll('input')).forEach(i=>i.checked=false); window.updateExportColCount();">一键清空</span>
                    </div>
                </div>
                <div id="exportFieldBox" style="display:flex; flex-wrap:wrap; max-height:160px; overflow-y:auto; padding-right:8px;">
                    ${fieldCheckboxes}
                </div>
            </div>
            
            <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                <div style="padding:12px 20px;border:1px solid #bae6fd;background:#f0f9ff;border-radius:8px;width:140px;">
                    <div style="font-size:24px;font-weight:700;color:#0369a1">3</div>
                    <div style="font-size:11px;color:#0ea5e9">可导出记录 (行)</div>
                </div>
                <div style="padding:12px 20px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:8px;width:140px;">
                    <div id="exportColCount" style="font-size:24px;font-weight:700;color:#15803d">${fields.length}</div>
                    <div style="font-size:11px;color:#22c55e">选中输出列 (列)</div>
                </div>
            </div>
        </div>
    `;

    // 自适应高度和宽度
    document.getElementById('modalBox').style.maxWidth = '650px';
    el.classList.add('active');
}
function exportCurrentPage() { const bc = document.getElementById('breadcrumb'); doExport(bc ? bc.textContent : '当前页面'); }
function closeExport() { document.getElementById('exportOverlay').classList.remove('active'); }
function downloadExport() { showToast('文件已生成，开始下载...'); closeExport(); }

// ===== Tab切换 =====
function switchReportTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const el = document.getElementById('tab-' + id); if (el) el.classList.add('active');
    setTimeout(() => initReportCharts(), 300);
}

// ===== ECharts =====
function showProfitChart(ci) {
    const container = document.getElementById('profitChartContainer');
    container.style.display = 'block';
    setTimeout(() => {
        const dom = document.getElementById('profitEchart');
        if (!dom) return;
        const chart = echarts.init(dom);
        const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
        const revenue = ci === 'CI-2026-001' ? [50000, 58000, 52000, 61000, 55000, 63000] : ci === 'CI-2026-002' ? [80000, 120000, 95000, 110000, 85000, 100000] : [0, 0, 0, 0, 0, 0];
        const cost = ci === 'CI-2026-001' ? [12000, 15000, 14000, 13500, 16000, 15000] : ci === 'CI-2026-002' ? [1200, 1500, 1800, 1600, 1400, 1500] : [5000, 8000, 10000, 12000, 6000, 4200];
        const profit = revenue.map((r, i) => r - cost[i]);
        chart.setOption({
            title: { text: '利润趋势分析 - ' + ci, left: 'center', textStyle: { fontSize: 14, fontWeight: 600 } },
            tooltip: { trigger: 'axis', backgroundColor: 'rgba(30,42,58,0.95)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 } },
            legend: { bottom: 0, data: ['总产值', '总成本', '利润'] },
            grid: { top: 50, right: 30, bottom: 40, left: 60 },
            xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: '#ddd' } }, axisLabel: { color: '#666' } },
            yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#999', formatter: v => v >= 10000 ? (v / 10000) + '万' : v } },
            series: [
                { name: '总产值', type: 'bar', data: revenue, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#409eff' }, { offset: 1, color: '#79bbff' }]), borderRadius: [4, 4, 0, 0] }, barWidth: 20 },
                { name: '总成本', type: 'bar', data: cost, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#e6a23c' }, { offset: 1, color: '#f3d19e' }]), borderRadius: [4, 4, 0, 0] }, barWidth: 20 },
                {
                    name: '利润', type: 'line', data: profit, smooth: true, lineStyle: { width: 3, color: '#67c23a' }, itemStyle: { color: '#67c23a' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(103,194,58,0.3)' }, { offset: 1, color: 'rgba(103,194,58,0.02)' }]) },
                    markLine: { data: [{ type: 'average', name: '平均利润', lineStyle: { color: '#f56c6c', type: 'dashed' } }] }
                }
            ]
        });
        window.addEventListener('resize', () => chart.resize());
    }, 100);
}
function updateProfitChart() { showProfitChart('CI-2026-001'); }

function initReportCharts() {
    const dom1 = document.getElementById('personnelReportChart');
    if (dom1 && dom1.offsetWidth > 0) {
        const c1 = echarts.init(dom1);
        c1.setOption({
            title: { text: '监理人员产值·成本·利润对比', left: 'center', textStyle: { fontSize: 13 } },
            tooltip: { trigger: 'axis' }, legend: { bottom: 0 }, grid: { top: 50, bottom: 40, left: 60, right: 30 },
            xAxis: { type: 'category', data: ['张三', '李四', '陈伟', '王五'] },
            yAxis: { type: 'value', axisLabel: { formatter: v => v >= 10000 ? (v / 10000) + '万' : v } },
            series: [
                { name: '总产值', type: 'bar', data: [160000, 85000, 85000, 75000], itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] } },
                { name: '总成本', type: 'bar', data: [36800, 22100, 30600, 18000], itemStyle: { color: '#e6a23c', borderRadius: [4, 4, 0, 0] } },
                { name: '利润', type: 'bar', data: [123200, 62900, 54400, 57000], itemStyle: { color: '#67c23a', borderRadius: [4, 4, 0, 0] } }
            ]
        });
        window.addEventListener('resize', () => c1.resize());
    }
    const dom2 = document.getElementById('contractReportChart');
    if (dom2 && dom2.offsetWidth > 0) {
        const c2 = echarts.init(dom2);
        c2.setOption({
            title: { text: '合同维度综合报表', left: 'center', textStyle: { fontSize: 13 } },
            tooltip: { trigger: 'axis' }, legend: { bottom: 0 }, grid: { top: 50, bottom: 40, left: 60, right: 30 },
            xAxis: { type: 'category', data: ['CI-2026-001', 'CI-2026-002', 'CI-2026-003'] },
            yAxis: { type: 'value', axisLabel: { formatter: v => v >= 10000 ? (v / 10000) + '万' : v } },
            series: [
                { name: '合同金额', type: 'bar', data: [580000, 1200000, 860000], itemStyle: { color: '#7c5cfc', borderRadius: [4, 4, 0, 0] } },
                { name: '总产值', type: 'bar', data: [338800, 500000, 0], itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] } },
                { name: '利润', type: 'bar', data: [253300, 492000, -45200], itemStyle: { color: p => p.value >= 0 ? '#67c23a' : '#f56c6c', borderRadius: [4, 4, 0, 0] } },
                { name: '利润率(%)', type: 'line', yAxisIndex: 0, data: [74.8, 98.4, -100], smooth: true, lineStyle: { color: '#0891b2', width: 2 }, itemStyle: { color: '#0891b2' } }
            ]
        });
        window.addEventListener('resize', () => c2.resize());
    }
}

// ===== Sidebar Toggle =====
document.getElementById('sidebarToggle').addEventListener('click', function () {
    const sb = document.getElementById('sidebar'), mc = document.getElementById('mainContent');
    sb.classList.toggle('collapsed');
    mc.style.marginLeft = sb.classList.contains('collapsed') ? '60px' : '';
});

// ===== Clock =====
function updateClock() {
    const now = new Date();
    const el = document.getElementById('headerTime');
    if (el) el.textContent = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
updateClock(); setInterval(updateClock, 1000);

// ===== 自由拖拽调整表头列宽功能 =====
document.addEventListener('DOMContentLoaded', () => {
    function initTableResizers() {
        return; // 用户要求临时关闭调整表头列宽功能
        document.querySelectorAll('.data-table').forEach(table => {
            if (table.dataset.resizerInitialized) return;
            table.dataset.resizerInitialized = 'true';

            // 确保table能够根据th的拖拽而自适应调整大小。不强制 fixed，用 auto 能让初始排版依然正常，并在拖拉后通过th显式width限制列宽
            table.style.tableLayout = 'auto';

            const cols = table.querySelectorAll('thead th');
            cols.forEach((col, index) => {
                // 如果是操作列或是选择列，尽量不给加拖拽（可选）
                if (col.innerText === '操作' || col.innerText === '#') return;

                // 给允许拖拽的列预留最小宽度和默认不换行，防止挤到一起
                col.style.whiteSpace = 'nowrap';

                const resizer = document.createElement('div');
                resizer.style.width = '6px';
                resizer.style.height = '100%';
                resizer.style.position = 'absolute';
                resizer.style.right = '0';
                resizer.style.top = '0';
                resizer.style.cursor = 'col-resize';
                resizer.style.userSelect = 'none';
                resizer.style.zIndex = '10';

                // 确保列头相对定位以容纳绝对定位的resizer
                col.style.position = 'relative';
                col.appendChild(resizer);

                let startX, startWidth;

                resizer.addEventListener('mousedown', function (e) {
                    startX = e.pageX;
                    // 如果尚未分配明确宽度，则抓取其当前自适应呈现的宽度作为起点
                    startWidth = col.offsetWidth;
                    e.stopPropagation();
                    e.preventDefault(); // 阻止选中文本

                    const onMouseMove = (e) => {
                        const newWidth = startWidth + (e.pageX - startX);
                        if (newWidth > 30) {
                            // 拖拽时，明确设置该列宽度，触发table根据新宽度排版
                            col.style.width = newWidth + 'px';
                            col.style.minWidth = newWidth + 'px';
                            col.style.maxWidth = newWidth + 'px';
                        }
                    };

                    const onMouseUp = () => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
            });
        });
    }

    // 初次调用
    setTimeout(initTableResizers, 200);

    // 监听DOM变动，因为菜单切换是直接替换 innerHTML
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 有新的节点加入，检查并绑定拖拽功能
                initTableResizers();
                break;
            }
        }
    });

    // 监听主体内容区域
    const mainContent = document.getElementById('mainContent') || document.body;
    observer.observe(mainContent, { childList: true, subtree: true });
});

// 显示日期派单信息
function showDateDispatch(date, dispatches) {
    const infoDiv = document.getElementById('dateDispatchInfo');
    const dateSpan = document.getElementById('dateDispatchDate');
    const contentDiv = document.getElementById('dateDispatchContent');

    if (!dispatches) {
        infoDiv.style.display = 'none';
        return;
    }

    dateSpan.textContent = date;
    const pdList = dispatches.split(',').map(pd => pd.trim()).filter(pd => pd);
    const personName = document.querySelector('#modalBox .modal-header h3')?.textContent.match(/打卡记录与日历 - (.+?) \(/)?.[1] || '张三';

    contentDiv.innerHTML = pdList.map(pd =>
        `<div style="margin-bottom:8px;">
            <span class="link-text" onclick="closeModal();showPersonnelLevel2('${personName}')" style="font-size:14px;font-weight:600;">📋 ${pd}</span>
        </div>`
    ).join('');

    infoDiv.style.display = 'block';
}

// 固定支出行内编辑
function editCostFixedRow(rowNum) {
    const row = document.querySelector(`#costFixedRow${rowNum}`);
    if (!row) return;

    const cells = row.querySelectorAll('td');
    const serviceCost = cells[2].textContent.trim();
    const materialCost = cells[3].textContent.trim();
    const otherCost = cells[4].textContent.trim();
    const date = cells[6].textContent.trim();

    cells[2].innerHTML = `<input type="number" value="${serviceCost}" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px;text-align:right;">`;
    cells[3].innerHTML = `<input type="number" value="${materialCost}" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px;text-align:right;">`;
    cells[4].innerHTML = `<input type="number" value="${otherCost}" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px;text-align:right;">`;
    cells[6].innerHTML = `<input type="date" value="${date}" style="padding:4px;border:1px solid var(--border-color);border-radius:4px;">`;
    cells[8].innerHTML = `<button class="btn-mini btn-success" onclick="saveCostFixedRow(${rowNum})">保存</button> <button class="btn-mini btn-outline" onclick="cancelCostFixedEdit(${rowNum})">取消</button>`;
}

function saveCostFixedRow(rowNum) {
    const row = document.querySelector(`#costFixedRow${rowNum}`);
    const cells = row.querySelectorAll('td');
    const service = cells[2].querySelector('input').value;
    const material = cells[3].querySelector('input').value;
    const other = cells[4].querySelector('input').value;
    const total = parseFloat(service) + parseFloat(material) + parseFloat(other);
    const date = cells[6].querySelector('input').value;

    cells[2].innerHTML = `<strong>${parseFloat(service).toFixed(2)}</strong>`;
    cells[3].innerHTML = parseFloat(material).toFixed(2);
    cells[4].innerHTML = parseFloat(other).toFixed(2);
    cells[5].innerHTML = `<strong>${total.toFixed(2)}</strong>`;
    cells[6].textContent = date;
    cells[8].innerHTML = `<button class="btn-mini btn-outline" onclick="editCostFixedRow(${rowNum})">编辑</button>`;
    showToast('保存成功');
}

function cancelCostFixedEdit(rowNum) {
    closeModal();
    showCostFixedDialog(document.querySelector('#costFixedRow' + rowNum).closest('table').dataset.ci);
}

// ========== 差旅报销台账 ==========
let travelData = [];
let groupedTravelData = [];
let filteredTravelData = [];
let currentPage = 1;
let pageSize = 20;
let sortColumn = '';
let sortOrder = 'asc';

// 费用分类
const expenseCategories = {
    "通用费用": ["办公用品", "水电费", "租金", "维修费"],
    "差旅费用": ["国内差旅-餐费", "国内差旅-住宿", "国内差旅-交通", "国内差旅-其他"],
    "招待费用": ["业务招待费-餐费", "业务招待费-礼品"],
    "手机费用": ["手机费用"],
    "其他费用": ["其他-系统费", "杂费"]
};

// 生成假数据
function generateTravelMockData() {
    const employees = [
        { id: 'EMP001', name: '刘丽', dept: '财务部' },
        { id: 'EMP002', name: '桑增', dept: '运营部' },
        { id: 'EMP003', name: '张伟', dept: '技术部' },
        { id: 'EMP004', name: '李娜', dept: '市场部' },
        { id: 'EMP005', name: '王强', dept: '项目部' }
    ];

    const contracts = ['CI-2026-001', 'CI-2026-002', 'CI-2026-003', 'CI-2026-004'];
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都'];
    const statuses = ['待审', '已审', '已付'];

    const data = [];
    for (let i = 1; i <= 102; i++) {
        const emp = employees[Math.floor(Math.random() * employees.length)];
        const category = Object.keys(expenseCategories)[Math.floor(Math.random() * 5)];
        const subTypes = expenseCategories[category];
        const subType = subTypes[Math.floor(Math.random() * subTypes.length)];
        const amount = Math.floor(Math.random() * 2000) + 100;

        data.push({
            id: i,
            recordId: `E017976202512${String(i).padStart(5, '0')}`,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.dept,
            expenseDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            category: category,
            subType: subType,
            amount: amount,
            invoiceAmount: amount,
            invoiceDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            contractId: contracts[Math.floor(Math.random() * contracts.length)],
            destination: cities[Math.floor(Math.random() * cities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    return data;
}

// 按员工+合同聚合数据
function groupTravelData(data) {
    const grouped = {};
    data.forEach(row => {
        const key = `${row.employeeId}_${row.contractId}`;
        if (!grouped[key]) {
            grouped[key] = {
                employeeId: row.employeeId,
                employeeName: row.employeeName,
                department: row.department,
                contractId: row.contractId,
                通用费用: 0,
                差旅费用: 0,
                招待费用: 0,
                手机费用: 0,
                其他费用: 0,
                total: 0,
                records: []
            };
        }
        grouped[key][row.category] += row.amount;
        grouped[key].total += row.amount;
        grouped[key].records.push(row);
    });
    return Object.values(grouped);
}

// 初始化差旅数据
function initTravelData() {
    travelData = generateTravelMockData();
    groupedTravelData = groupTravelData(travelData);
    filteredTravelData = [...groupedTravelData];

    // 填充筛选器选项
    const employees = [...new Set(travelData.map(d => d.employeeName))];
    const contracts = [...new Set(travelData.map(d => d.contractId))];

    const empSelect = document.getElementById('filterEmployee');
    if (empSelect) {
        empSelect.innerHTML = '<option value="">全部</option>';
        employees.forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp;
            opt.textContent = emp;
            empSelect.appendChild(opt);
        });
    }

    const contractSelect = document.getElementById('filterContract');
    if (contractSelect) {
        contractSelect.innerHTML = '<option value="">全部</option>';
        contracts.forEach(contract => {
            const opt = document.createElement('option');
            opt.value = contract;
            opt.textContent = contract;
            contractSelect.appendChild(opt);
        });
    }

    renderTravelTable();
    updateTravelStats();
}

// 渲染表格（聚合视图）
function renderTravelTable() {
    const tbody = document.getElementById('travelTableBody');
    if (!tbody) return;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredTravelData.slice(start, end);

    tbody.innerHTML = pageData.map((row, idx) => `
        <tr>
            <td style="text-align:center;"><input type="checkbox" class="row-checkbox" data-key="${row.employeeId}_${row.contractId}"></td>
            <td style="text-align:center;">${row.records[0]?.recordId || '-'}</td>
            <td style="text-align:center;">${row.employeeId}</td>
            <td style="text-align:center;">${row.employeeName}</td>
            <td style="text-align:center;">${row.department}</td>
            <td style="text-align:center;">${row.contractId}</td>
            <td style="text-align:center;">¥${row.通用费用.toFixed(2)}</td>
            <td style="text-align:center;">¥${row.差旅费用.toFixed(2)}</td>
            <td style="text-align:center;">¥${row.招待费用.toFixed(2)}</td>
            <td style="text-align:center;">¥${row.手机费用.toFixed(2)}</td>
            <td style="text-align:center;">¥${row.其他费用.toFixed(2)}</td>
            <td style="text-align:center;font-weight:600;color:#1976d2;">¥${row.total.toFixed(2)}</td>
            <td style="text-align:center;">
                <button class="action-btn" onclick='viewGroupDetail(${JSON.stringify(row).replace(/'/g, "&apos;")})' title="查看明细">👁️</button>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

// 更新统计
function updateTravelStats() {
    const totalAmount = filteredTravelData.reduce((sum, row) => sum + row.total, 0);
    const recordCount = filteredTravelData.reduce((sum, row) => sum + row.records.length, 0);
    const employeeCount = new Set(filteredTravelData.map(d => d.employeeId)).size;
    const avgAmount = recordCount > 0 ? totalAmount / recordCount : 0;

    const statTotal = document.getElementById('statTotalAmount');
    const statRecord = document.getElementById('statRecordCount');
    const statEmployee = document.getElementById('statEmployeeCount');
    const statAvg = document.getElementById('statAvgAmount');

    if (statTotal) statTotal.textContent = `¥${totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    if (statRecord) statRecord.textContent = `${recordCount}条`;
    if (statEmployee) statEmployee.textContent = `${employeeCount}人`;
    if (statAvg) statAvg.textContent = `¥${avgAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
}

// 更新分页
function updatePagination() {
    const total = filteredTravelData.length;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    const totalPages = Math.ceil(total / pageSize);

    document.getElementById('paginationInfo').textContent = `当前显示：${start}-${end} / 共${total}条`;

    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const btn = document.createElement('button');
            btn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => goToPage(i);
            pageNumbers.appendChild(btn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.padding = '0 5px';
            pageNumbers.appendChild(span);
        }
    }

    updateSelectedCount();
}

function updateSelectedCount() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length;
    document.getElementById('selectedInfo').textContent = `已选择：${checked}条`;
}

// 筛选数据（增强版）
function filterTravelData() {
    const recordId = document.getElementById('filterRecordId')?.value.trim().toLowerCase() || '';
    const employeeName = document.getElementById('filterEmployeeName')?.value.trim().toLowerCase() || '';
    const contractId = document.getElementById('filterContractId')?.value.trim().toLowerCase() || '';
    const amountMin = parseFloat(document.getElementById('filterAmountMin')?.value) || 0;
    const amountMax = parseFloat(document.getElementById('filterAmountMax')?.value) || Infinity;

    filteredTravelData = groupedTravelData.filter(row => {
        // 单据编号模糊搜索（搜索该组的所有单据）
        if (recordId && !row.records.some(r => r.recordId.toLowerCase().includes(recordId))) return false;

        // 人名模糊搜索
        if (employeeName && !row.employeeName.toLowerCase().includes(employeeName)) return false;

        // 合同编号模糊搜索
        if (contractId && !row.contractId.toLowerCase().includes(contractId)) return false;

        // 金额区间搜索
        if (row.total < amountMin || row.total > amountMax) return false;

        return true;
    });

    currentPage = 1;
    renderTravelTable();
    updateTravelStats();
}

// 重置筛选
function resetTravelFilter() {
    const recordIdInput = document.getElementById('filterRecordId');
    const employeeNameInput = document.getElementById('filterEmployeeName');
    const contractIdInput = document.getElementById('filterContractId');
    const amountMinInput = document.getElementById('filterAmountMin');
    const amountMaxInput = document.getElementById('filterAmountMax');

    if (recordIdInput) recordIdInput.value = '';
    if (employeeNameInput) employeeNameInput.value = '';
    if (contractIdInput) contractIdInput.value = '';
    if (amountMinInput) amountMinInput.value = '';
    if (amountMaxInput) amountMaxInput.value = '';

    filterTravelData();
}

// 查看分组明细（增强版 - 显示所有字段）
function viewGroupDetail(group) {
    // 强制跳转至 1:1 复刻版详情弹窗
    return viewTravelRecordDetail(group);

    // 如果只有一条记录，显示完整报销单弹窗
    if (records.length === 1) {
        viewTravelRecordDetail(records[0]);
        return;
    }
    const detailTable = `
        <div style="margin-bottom:16px;padding:12px;background:#f0f9ff;border-radius:8px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                <div><span style="color:#666;font-size:12px;">员工：</span><strong>${group.employeeName}</strong></div>
                <div><span style="color:#666;font-size:12px;">部门：</span><strong>${group.department}</strong></div>
                <div><span style="color:#666;font-size:12px;">合同：</span><strong>${group.contractId}</strong></div>
                <div><span style="color:#666;font-size:12px;">报销总额：</span><strong style="color:#1976d2;font-size:16px;">¥${group.total.toFixed(2)}</strong></div>
            </div>
        </div>
        <div style="margin-bottom:12px;padding:10px;background:#fff3cd;border-radius:6px;">
            <strong>费用汇总：</strong>
            通用费用 ¥${group.通用费用.toFixed(2)} |
            差旅费用 ¥${group.差旅费用.toFixed(2)} |
            招待费用 ¥${group.招待费用.toFixed(2)} |
            手机费用 ¥${group.手机费用.toFixed(2)} |
            其他费用 ¥${group.其他费用.toFixed(2)}
        </div>
        <div style="max-height:600px;overflow-y:auto;">
            <table class="data-table" style="font-size:11px;width:100%;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="min-width:140px;">单据编号</th>
                        <th>单据类型</th>
                        <th>单据状态</th>
                        <th>费用日期</th>
                        <th>费用项目</th>
                        <th>费用子类</th>
                        <th style="text-align:right;">报销金额</th>
                        <th style="text-align:right;">发票金额</th>
                        <th>发票日期</th>
                        <th>发票号码</th>
                        <th>目的地</th>
                        <th>天数</th>
                        <th>同行人</th>
                        <th>出发地</th>
                        <th>返回日期</th>
                        <th>交通工具</th>
                        <th>招待对象</th>
                        <th>我方人数</th>
                        <th>对方人数</th>
                        <th>手机号</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(r => `
                        <tr>
                            <td style="font-family:monospace;font-size:10px;">${r.recordId}</td>
                            <td>${r.docType || '报销单'}</td>
                            <td><span class="status-badge status-${r.status === '待审' ? 'pending' : r.status === '已审' ? 'approved' : 'paid'}">${r.status}</span></td>
                            <td>${r.expenseDate}</td>
                            <td>${r.category}</td>
                            <td>${r.subType}</td>
                            <td style="text-align:right;font-weight:600;color:#1976d2;">¥${r.amount.toFixed(2)}</td>
                            <td style="text-align:right;">¥${r.invoiceAmount.toFixed(2)}</td>
                            <td>${r.invoiceDate}</td>
                            <td>${r.invoiceNumber || '-'}</td>
                            <td>${r.destination}</td>
                            <td>${r.days || '-'}</td>
                            <td>${r.companions || '-'}</td>
                            <td>${r.departure || '-'}</td>
                            <td>${r.returnDate || '-'}</td>
                            <td>${r.transport || '-'}</td>
                            <td>${r.entertainGuest || '-'}</td>
                            <td>${r.ourCount || '-'}</td>
                            <td>${r.theirCount || '-'}</td>
                            <td>${r.phoneNumber || '-'}</td>
                            <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.remark || ''}">${r.remark || '-'}</td>
                            <td><button class="btn-mini btn-primary" onclick="viewTravelDetail('${r.单据编号 || r.recordId}')">查看</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // 使用更大的弹窗
    const modal = document.getElementById('modalOverlay');
    const modalBox = document.getElementById('modalBox');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    if (modal && modalBox && modalTitle && modalBody && modalFooter) {
        modalBox.style.maxWidth = '95vw';
        modalBox.style.width = '1600px';
        modalTitle.textContent = `报销明细 - ${group.employeeName} (${group.contractId})`;
        modalBody.innerHTML = detailTable;
        modalFooter.innerHTML = '<button class="btn btn-outline" onclick="closeModal()">关闭</button>';
        modal.style.display = 'flex';
    }
}

// 排序
function sortTable(column) {
    if (sortColumn === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortOrder = 'asc';
    }

    filteredTravelData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (typeof valA === 'number') {
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();

        if (sortOrder === 'asc') {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
    });

    renderTravelTable();
}

// 分页
function goToPage(page) {
    currentPage = page;
    renderTravelTable();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTravelTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredTravelData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTravelTable();
    }
}

// 全选
function toggleSelectAll() {
    const checked = document.getElementById('selectAll').checked;
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = checked);
    updateSelectedCount();
}

// 查看详情
function viewTravelDetail(id) {
    const record = travelData.find(r => r.id === id);
    if (!record) return;

    const html = `
        <div style="padding: 20px;">
            <h3>📋 基本信息</h3>
            <p><strong>单据编号：</strong>${record.recordId}</p>
            <p><strong>员工编号：</strong>${record.employeeId}</p>
            <p><strong>报销人：</strong>${record.employeeName}</p>
            <p><strong>部门：</strong>${record.department}</p>
            <p><strong>费用日期：</strong>${record.expenseDate}</p>
            <p><strong>状态：</strong><span class="status-badge status-${record.status === '待审' ? 'pending' : record.status === '已审' ? 'approved' : 'paid'}">${record.status}</span></p>
            
            <h3 style="margin-top: 20px;">💰 费用明细</h3>
            <p><strong>费用类型：</strong>${record.category} - ${record.subType}</p>
            <p><strong>报销金额：</strong>¥${record.amount.toFixed(2)}</p>
            <p><strong>发票金额：</strong>¥${record.invoiceAmount.toFixed(2)}</p>
            <p><strong>发票日期：</strong>${record.invoiceDate}</p>
            
            <h3 style="margin-top: 20px;">📄 其他信息</h3>
            <p><strong>合同编号：</strong>${record.contractId}</p>
            <p><strong>目的地：</strong>${record.destination}</p>
        </div>
    `;

    openModal('报销单详情', html, `
        <button class="btn-secondary" onclick="closeModal()">关闭</button>
        <button class="btn-primary" onclick="editTravelRecord(${id})">编辑</button>
    `);
}

// 编辑记录
function editTravelRecord(id) {
    showToast('编辑功能开发中...');
}

// 删除记录
function deleteTravelRecord(id) {
    if (confirm('确定要删除这条报销记录吗？')) {
        const index = travelData.findIndex(r => r.id === id);
        if (index > -1) {
            travelData.splice(index, 1);
            filterTravelData();
            showToast('删除成功');
        }
    }
}

// 批量删除
function batchDelete() {
    const checked = Array.from(document.querySelectorAll('.row-checkbox:checked'));
    if (checked.length === 0) {
        showToast('请先选择要删除的记录');
        return;
    }

    if (confirm(`确定要删除选中的 ${checked.length} 条记录吗？`)) {
        const ids = checked.map(cb => parseInt(cb.dataset.id));
        travelData = travelData.filter(r => !ids.includes(r.id));
        filterTravelData();
        showToast(`已删除 ${checked.length} 条记录`);
    }
}

// 批量导出
function batchExport() {
    const checked = Array.from(document.querySelectorAll('.row-checkbox:checked'));
    if (checked.length === 0) {
        showToast('请先选择要导出的记录');
        return;
    }
    showToast('导出功能开发中...');
}

// 导入数据
function importTravelData() {
    const importHtml = `
        <div style="padding:20px;">
            <div style="margin-bottom:20px;padding:12px;background:#dbeafe;border-left:4px solid #3b82f6;border-radius:4px;">
                <strong>📥 数据导入向导</strong>
                <p style="margin:8px 0 0;font-size:13px;color:#1e40af;">支持 CSV 和 Excel 文件格式，系统将自动识别字段并进行数据验证。</p>
            </div>
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:8px;font-weight:600;">选择文件：</label>
                <input type="file" id="importFileInput" accept=".csv,.xlsx,.xls" style="padding:8px;border:1px solid #d1d5db;border-radius:6px;width:100%;">
            </div>
            <div style="padding:16px;background:#f9fafb;border:1px dashed #d1d5db;border-radius:6px;text-align:center;">
                <div style="font-size:48px;margin-bottom:10px;">📄</div>
                <div style="font-size:14px;color:#6b7280;">拖拽文件到此处或点击上方按钮选择文件</div>
                <div style="font-size:12px;color:#9ca3af;margin-top:8px;">支持格式：CSV, Excel (.xlsx, .xls)</div>
            </div>
        </div>
    `;
    openModal('📥 导入差旅报销数据', importHtml, `
        <button class="btn btn-outline" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="processImportFile()">开始导入</button>
    `);
}

function processImportFile() {
    const fileInput = document.getElementById('importFileInput');
    if (!fileInput || !fileInput.files.length) {
        showToast('请先选择文件');
        return;
    }
    showToast('文件解析中...');
    setTimeout(() => {
        showToast('✅ 成功导入 98 条记录');
        closeModal();
        initTravelData();
    }, 1500);
}

// 导出数据（显示弹窗）
function exportTravelData() {
    const exportHtml = `
        <div style="padding:20px;">
            <div style="font-size:14px;color:#666;margin-bottom:20px;">
                系统准备导出当前筛选条件下的记录，您可以按需勾选下方字段定制报表列。
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="margin:10px 0;font-size:14px;">字段清单筛选池</h4>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <button class="btn btn-outline" onclick="selectAllExportFields(true)" style="font-size:12px;padding:4px 12px;">全选全部</button>
                    <button class="btn btn-outline" onclick="selectAllExportFields(false)" style="font-size:12px;padding:4px 12px;">一键清空</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-height:300px;overflow-y:auto;padding:10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;">
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="recordId" checked> 单据编号</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="employeeId" checked> 员工编号</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="employeeName" checked> 姓名</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="department" checked> 部门</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="contractId" checked> 合同编号</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="expenseDate" checked> 费用日期</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="category" checked> 费用大类</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="subType" checked> 费用子类</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="amount" checked> 报销金额</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="invoiceAmount" checked> 发票金额</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="invoiceDate" checked> 发票日期</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="invoiceNumber"> 发票号码</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="destination"> 目的地</label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:13px;"><input type="checkbox" class="export-field" value="status" checked> 状态</label>
                </div>
            </div>

            <div style="display:flex;justify-content:center;gap:20px;padding:20px;background:#f0f9ff;border-radius:8px;">
                <div style="text-align:center;">
                    <div style="font-size:32px;font-weight:700;color:#1976d2;">${filteredTravelData.length}</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">可导出记录（行）</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:32px;font-weight:700;color:#16a34a;" id="selectedFieldCount">13</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">选中输出列（列）</div>
                </div>
            </div>
        </div>
    `;

    openModal('📊 导出数据据编排 - 差旅报销台账', exportHtml, `
        <button class="btn btn-outline" onclick="closeModal()">取消</button>
        <button class="btn btn-success" onclick="downloadExcel()" style="background:#16a34a;border-color:#16a34a;">💾 下载 Excel</button>
        <button class="btn btn-primary" onclick="downloadPDF()">🖨️ 下载 PDF</button>
    `);

    const modalBox = document.getElementById('modalBox');
    if (modalBox) {
        modalBox.style.maxWidth = '900px';
        modalBox.style.width = '900px';
    }

    setTimeout(() => {
        document.querySelectorAll('.export-field').forEach(cb => {
            cb.addEventListener('change', updateSelectedFieldCount);
        });
    }, 100);
}

function selectAllExportFields(checked) {
    document.querySelectorAll('.export-field').forEach(cb => cb.checked = checked);
    updateSelectedFieldCount();
}

function updateSelectedFieldCount() {
    const count = document.querySelectorAll('.export-field:checked').length;
    const countEl = document.getElementById('selectedFieldCount');
    if (countEl) countEl.textContent = count;
}

function downloadExcel() {
    showToast('Excel 文件生成中...');
    setTimeout(() => {
        showToast('✅ Excel 导出成功！');
        closeModal();
    }, 1000);
}

function downloadPDF() {
    showToast('PDF 文件生成中...');
    setTimeout(() => {
        showToast('✅ PDF 导出成功！');
        closeModal();
    }, 1000);
}

// 新增报销单
function addTravelRecord() {
    const addHtml = `
        <div style="padding:20px;max-height:600px;overflow-y:auto;">
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">单据编号 *</label>
                    <input type="text" id="newRecordId" placeholder="自动生成" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;" readonly>
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">员工编号 *</label>
                    <input type="text" id="newEmployeeId" placeholder="请输入员工编号" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">报销人 *</label>
                    <input type="text" id="newEmployeeName" placeholder="请输入姓名" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">部门 *</label>
                    <input type="text" id="newDepartment" placeholder="请输入部门" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">费用日期 *</label>
                    <input type="date" id="newExpenseDate" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">费用大类 *</label>
                    <select id="newCategory" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                        <option value="">请选择</option>
                        <option value="通用费用">通用费用</option>
                        <option value="差旅费用">差旅费用</option>
                        <option value="招待费用">招待费用</option>
                        <option value="手机费用">手机费用</option>
                        <option value="其他费用">其他费用</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">费用子类 *</label>
                    <input type="text" id="newSubType" placeholder="请输入费用子类" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">报销金额 *</label>
                    <input type="number" id="newAmount" placeholder="0.00" step="0.01" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">合同编号 *</label>
                    <input type="text" id="newContractId" placeholder="请输入合同编号" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">目的地</label>
                    <input type="text" id="newDestination" placeholder="请输入目的地" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
            </div>
        </div>
    `;

    openModal('➕ 新增报销单', addHtml, `
        <button class="btn btn-outline" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveNewTravelRecord()">保存</button>
    `);

    const modalBox = document.getElementById('modalBox');
    if (modalBox) {
        modalBox.style.maxWidth = '800px';
        modalBox.style.width = '800px';
    }

    setTimeout(() => {
        const recordIdInput = document.getElementById('newRecordId');
        if (recordIdInput) recordIdInput.value = `E017976202512${String(travelData.length + 1).padStart(5, '0')}`;
    }, 100);
}

function saveNewTravelRecord() {
    showToast('保存中...');
    setTimeout(() => {
        showToast('✅ 报销单创建成功');
        closeModal();
    }, 800);
}

// 统计分析
function showTravelStats() {
    const stats = calculateTravelStats();
    const chartHtml = `
        <div style="padding:20px">
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:30px">
                <div style="background:#f0f9ff;padding:20px;border-radius:8px;border-left:4px solid #3b82f6">
                    <div style="color:#64748b;font-size:13px;margin-bottom:8px">总报销金额</div>
                    <div style="color:#1e293b;font-size:28px;font-weight:700">¥${stats.totalAmount.toFixed(2)}</div>
                </div>
                <div style="background:#f0fdf4;padding:20px;border-radius:8px;border-left:4px solid #10b981">
                    <div style="color:#64748b;font-size:13px;margin-bottom:8px">报销单据数</div>
                    <div style="color:#1e293b;font-size:28px;font-weight:700">${stats.recordCount}条</div>
                </div>
                <div style="background:#fef3c7;padding:20px;border-radius:8px;border-left:4px solid #f59e0b">
                    <div style="color:#64748b;font-size:13px;margin-bottom:8px">报销人数</div>
                    <div style="color:#1e293b;font-size:28px;font-weight:700">${stats.employeeCount}人</div>
                </div>
                <div style="background:#fce7f3;padding:20px;border-radius:8px;border-left:4px solid #ec4899">
                    <div style="color:#64748b;font-size:13px;margin-bottom:8px">人均报销</div>
                    <div style="color:#1e293b;font-size:28px;font-weight:700">¥${stats.avgPerPerson.toFixed(2)}</div>
                </div>
            </div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb">
                <h3 style="margin:0 0 20px 0;font-size:16px;color:#1e293b">费用类型分布</h3>
                <div id="statsChart" style="width:100%;height:300px"></div>
            </div>
        </div>
    `;

    openModal('📊 差旅报销统计分析', chartHtml);

    setTimeout(() => {
        const chartDom = document.getElementById('statsChart');
        if (chartDom && typeof echarts !== 'undefined') {
            const chart = echarts.init(chartDom);
            chart.setOption({
                tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
                legend: { bottom: 10, left: 'center' },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                    label: { show: true, formatter: '{b}\n¥{c}' },
                    data: stats.categoryData
                }]
            });
        }
    }, 200);
}

function calculateTravelStats() {
    const data = groupedTravelData.length > 0 ? groupedTravelData : [];
    const totalAmount = data.reduce((sum, r) => sum + (r.total || 0), 0);
    const recordCount = data.length;
    const employeeCount = new Set(data.map(r => r.employeeId)).size;
    const avgPerPerson = employeeCount > 0 ? totalAmount / employeeCount : 0;

    const categories = ['通用费用', '差旅费用', '招待费用', '手机费用', '其他费用'];
    const categoryData = categories.map(cat => ({
        name: cat,
        value: data.reduce((sum, r) => sum + (r[cat] || 0), 0)
    })).filter(d => d.value > 0);

    return { totalAmount, recordCount, employeeCount, avgPerPerson, categoryData };
}

// 新增报销单弹窗
function addTravelRecord() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    modalTitle.textContent = '➕ 新增报销单';

    // 生成单据编号
    const recordId = `E017976${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    modalBody.innerHTML = `
        <div style="max-height:70vh;overflow-y:auto;padding:0 4px;">
            <!-- 基本信息 -->
            <div style="background:#e3f2fd;padding:10px 16px;margin-bottom:16px;border-radius:6px;border-left:4px solid #2196f3;">
                <h3 style="margin:0;font-size:15px;color:#1976d2;">【基本信息】</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">单据编号 <span style="color:red;">*</span></label>
                    <input type="text" id="recordId" value="${recordId}" readonly style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;background:#f5f5f5;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">员工编号 <span style="color:red;">*</span></label>
                    <input type="text" id="employeeId" placeholder="请输入员工编号" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">组织机构 <span style="color:red;">*</span></label>
                    <input type="text" id="organization" placeholder="请输入组织机构" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">申请单号</label>
                    <input type="text" id="applicationId" placeholder="请输入申请单号" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
                </div>
            </div>

            ${generateExpenseSection()}
        </div>
    `;

    modalFooter.innerHTML = `
        <button class="btn btn-outline" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveTravelRecord()">保存并提交</button>
    `;

    document.getElementById('modalOverlay').classList.add('active');
}

// 生成费用子表区域
function generateExpenseSection() {
    return `
        ${generateCommonExpenseTable()}
        ${generateTravelExpenseTable()}
        ${generateEntertainExpenseTable()}
        ${generatePhoneExpenseTable()}
        ${generateOtherExpenseTable()}
        <div style="margin-top:20px;padding:16px;background:#f0f9ff;border-radius:6px;text-align:right;">
            <span style="font-size:16px;font-weight:600;color:#1976d2;">报销总额：¥<span id="totalAmount">0.00</span></span>
        </div>
    `;
}

// 通用费用信息子表（27个字段）
function generateCommonExpenseTable() {
    return `
        <div style="background:#e8f5e9;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #4caf50;">
            <h3 style="margin:0;font-size:15px;color:#2e7d32;">【通用费用信息】</h3>
        </div>
        <div style="margin-bottom:20px;">
            <button class="btn btn-primary" onclick="addCommonExpenseRow()" style="margin-bottom:12px;font-size:13px;padding:6px 16px;">➕ 添加通用费用</button>
            <div style="overflow-x:auto;">
                <table class="data-table" id="commonExpenseTable" style="font-size:12px;min-width:3000px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:120px;">费用承担成本中心</th>
                            <th style="width:100px;">预算科目</th>
                            <th style="width:100px;">报销金额</th>
                            <th style="width:80px;">税额</th>
                            <th style="width:100px;">不含税金额</th>
                            <th style="width:120px;">实际报销本币金额</th>
                            <th style="width:120px;">发票号码</th>
                            <th style="width:100px;">发票金额</th>
                            <th style="width:100px;">发票日期</th>
                            <th style="width:100px;">发票类型</th>
                            <th style="width:100px;">发票种类</th>
                            <th style="width:80px;">税率(%)</th>
                            <th style="width:80px;">税种</th>
                            <th style="width:80px;">发票税额</th>
                            <th style="width:80px;">折扣</th>
                            <th style="width:100px;">项目</th>
                            <th style="width:100px;">是否政府项目</th>
                            <th style="width:120px;">WBS(合同编号)</th>
                            <th style="width:100px;">预算期间</th>
                            <th style="width:80px;">本位币</th>
                            <th style="width:80px;">汇率</th>
                            <th style="width:80px;">交易币种</th>
                            <th style="width:80px;">付款币种</th>
                            <th style="width:100px;">付款币种金额</th>
                            <th style="width:150px;">事由</th>
                            <th style="width:150px;">备注</th>
                            <th style="width:80px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="commonExpenseBody">
                        <!-- 动态添加行 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 添加通用费用行
function addCommonExpenseRow() {
    const tbody = document.getElementById('commonExpenseBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="table-input" placeholder="成本中心"></td>
        <td><input type="text" class="table-input" placeholder="预算科目"></td>
        <td><input type="number" class="table-input" placeholder="0.00" onchange="calculateTotal()"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="text" class="table-input" placeholder="发票号"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="date" class="table-input"></td>
        <td><select class="table-input"><option>增值税专用发票</option><option>增值税普通发票</option><option>其他</option></select></td>
        <td><input type="text" class="table-input" placeholder="发票种类"></td>
        <td><input type="number" class="table-input" placeholder="13"></td>
        <td><input type="text" class="table-input" placeholder="增值税"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="number" class="table-input" placeholder="0"></td>
        <td><input type="text" class="table-input" placeholder="项目名称"></td>
        <td><select class="table-input"><option>否</option><option>是</option></select></td>
        <td><input type="text" class="table-input" placeholder="CI-"></td>
        <td><input type="month" class="table-input"></td>
        <td><input type="text" class="table-input" value="CNY"></td>
        <td><input type="number" class="table-input" value="1.0"></td>
        <td><input type="text" class="table-input" value="CNY"></td>
        <td><input type="text" class="table-input" value="CNY"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="text" class="table-input" placeholder="事由"></td>
        <td><input type="text" class="table-input" placeholder="备注"></td>
        <td><button class="btn-mini btn-outline" onclick="deleteExpenseRow(this)" style="color:#d32f2f;border-color:#d32f2f;">删除</button></td>
    `;
    tbody.appendChild(row);
}

// 差旅费用明细子表（11个字段）
function generateTravelExpenseTable() {
    return `
        <div style="background:#fff3e0;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #ff9800;">
            <h3 style="margin:0;font-size:15px;color:#e65100;">【差旅费用明细】</h3>
        </div>
        <div style="margin-bottom:20px;">
            <button class="btn btn-primary" onclick="addTravelExpenseRow()" style="margin-bottom:12px;font-size:13px;padding:6px 16px;">➕ 添加差旅费用</button>
            <div style="overflow-x:auto;">
                <table class="data-table" id="travelExpenseTable" style="font-size:12px;min-width:1400px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:80px;">天数</th>
                            <th style="width:120px;">同行人</th>
                            <th style="width:100px;">地点</th>
                            <th style="width:100px;">报销标准</th>
                            <th style="width:100px;">出发地</th>
                            <th style="width:100px;">目的地</th>
                            <th style="width:100px;">出发日期</th>
                            <th style="width:100px;">返回日期</th>
                            <th style="width:100px;">交通工具</th>
                            <th style="width:100px;">坐席等级</th>
                            <th style="width:100px;">坐席标准</th>
                            <th style="width:80px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="travelExpenseBody">
                        <!-- 动态添加行 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 添加差旅费用行
function addTravelExpenseRow() {
    const tbody = document.getElementById('travelExpenseBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="number" class="table-input" placeholder="0" min="0"></td>
        <td><input type="text" class="table-input" placeholder="同行人姓名"></td>
        <td><input type="text" class="table-input" placeholder="地点"></td>
        <td><input type="text" class="table-input" placeholder="标准"></td>
        <td><input type="text" class="table-input" placeholder="出发地"></td>
        <td><input type="text" class="table-input" placeholder="目的地"></td>
        <td><input type="date" class="table-input"></td>
        <td><input type="date" class="table-input"></td>
        <td><select class="table-input"><option>飞机</option><option>高铁</option><option>火车</option><option>汽车</option><option>其他</option></select></td>
        <td><input type="text" class="table-input" placeholder="等级"></td>
        <td><input type="text" class="table-input" placeholder="标准"></td>
        <td><button class="btn-mini btn-outline" onclick="deleteExpenseRow(this)" style="color:#d32f2f;border-color:#d32f2f;">删除</button></td>
    `;
    tbody.appendChild(row);
}

// 招待费用明细子表（18个字段）
function generateEntertainExpenseTable() {
    return `
        <div style="background:#fce4ec;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #e91e63;">
            <h3 style="margin:0;font-size:15px;color:#c2185b;">【招待费用明细】</h3>
        </div>
        <div style="margin-bottom:20px;">
            <button class="btn btn-primary" onclick="addEntertainExpenseRow()" style="margin-bottom:12px;font-size:13px;padding:6px 16px;">➕ 添加招待费用</button>
            <div style="overflow-x:auto;">
                <table class="data-table" id="entertainExpenseTable" style="font-size:12px;min-width:2200px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:120px;">招待对象类型</th>
                            <th style="width:120px;">招待对象</th>
                            <th style="width:80px;">我方人数</th>
                            <th style="width:80px;">对方人数</th>
                            <th style="width:80px;">用餐次数</th>
                            <th style="width:120px;">招待地点</th>
                            <th style="width:100px;">主宴请人</th>
                            <th style="width:100px;">标准</th>
                            <th style="width:100px;">招待日期</th>
                            <th style="width:120px;">我方陪同人员</th>
                            <th style="width:120px;">我方人员名称</th>
                            <th style="width:120px;">实际陪同人员</th>
                            <th style="width:120px;">实际陪同人员名称</th>
                            <th style="width:80px;">酒水数量</th>
                            <th style="width:80px;">酒水单价</th>
                            <th style="width:100px;">购买酒水金额</th>
                            <th style="width:100px;">领用酒水金额</th>
                            <th style="width:120px;">预计用餐时段</th>
                            <th style="width:80px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="entertainExpenseBody">
                        <!-- 动态添加行 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 添加招待费用行
function addEntertainExpenseRow() {
    const tbody = document.getElementById('entertainExpenseBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><select class="table-input"><option>客户</option><option>供应商</option><option>政府</option><option>其他</option></select></td>
        <td><input type="text" class="table-input" placeholder="招待对象"></td>
        <td><input type="number" class="table-input" placeholder="0" min="0"></td>
        <td><input type="number" class="table-input" placeholder="0" min="0"></td>
        <td><input type="number" class="table-input" placeholder="0" min="0"></td>
        <td><input type="text" class="table-input" placeholder="地点"></td>
        <td><input type="text" class="table-input" placeholder="主宴请人"></td>
        <td><input type="text" class="table-input" placeholder="标准"></td>
        <td><input type="date" class="table-input"></td>
        <td><input type="text" class="table-input" placeholder="陪同人员"></td>
        <td><input type="text" class="table-input" placeholder="人员名称"></td>
        <td><input type="text" class="table-input" placeholder="实际陪同"></td>
        <td><input type="text" class="table-input" placeholder="实际名称"></td>
        <td><input type="number" class="table-input" placeholder="0"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><input type="number" class="table-input" placeholder="0.00"></td>
        <td><select class="table-input"><option>早餐</option><option>午餐</option><option>晚餐</option></select></td>
        <td><button class="btn-mini btn-outline" onclick="deleteExpenseRow(this)" style="color:#d32f2f;border-color:#d32f2f;">删除</button></td>
    `;
    tbody.appendChild(row);
}

// 手机费用子表（3个字段）
function generatePhoneExpenseTable() {
    return `
        <div style="background:#e1f5fe;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #03a9f4;">
            <h3 style="margin:0;font-size:15px;color:#0277bd;">【手机费用】</h3>
        </div>
        <div style="margin-bottom:20px;">
            <button class="btn btn-primary" onclick="addPhoneExpenseRow()" style="margin-bottom:12px;font-size:13px;padding:6px 16px;">➕ 添加手机费用</button>
            <div style="overflow-x:auto;">
                <table class="data-table" id="phoneExpenseTable" style="font-size:12px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:150px;">手机号</th>
                            <th style="width:150px;">业务期间</th>
                            <th style="width:150px;">费用标准</th>
                            <th style="width:80px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="phoneExpenseBody">
                        <!-- 动态添加行 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 添加手机费用行
function addPhoneExpenseRow() {
    const tbody = document.getElementById('phoneExpenseBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="table-input" placeholder="手机号"></td>
        <td><input type="month" class="table-input"></td>
        <td><input type="text" class="table-input" placeholder="标准"></td>
        <td><button class="btn-mini btn-outline" onclick="deleteExpenseRow(this)" style="color:#d32f2f;border-color:#d32f2f;">删除</button></td>
    `;
    tbody.appendChild(row);
}

// 其他费用明细子表（6个字段）
function generateOtherExpenseTable() {
    return `
        <div style="background:#f3e5f5;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #9c27b0;">
            <h3 style="margin:0;font-size:15px;color:#6a1b9a;">【其他费用明细】</h3>
        </div>
        <div style="margin-bottom:20px;">
            <button class="btn btn-primary" onclick="addOtherExpenseRow()" style="margin-bottom:12px;font-size:13px;padding:6px 16px;">➕ 添加其他费用</button>
            <div style="overflow-x:auto;">
                <table class="data-table" id="otherExpenseTable" style="font-size:12px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:100px;">用餐人数</th>
                            <th style="width:100px;">人次</th>
                            <th style="width:120px;">费用标准</th>
                            <th style="width:120px;">手机号</th>
                            <th style="width:120px;">车牌号</th>
                            <th style="width:120px;">业务发生日期</th>
                            <th style="width:80px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="otherExpenseBody">
                        <!-- 动态添加行 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 添加其他费用行
function addOtherExpenseRow() {
    const tbody = document.getElementById('otherExpenseBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="number" class="table-input" placeholder="0" min="0"></td>
        <td><input type="number" class="table-input" placeholder="0" min="0"></td>
        <td><input type="text" class="table-input" placeholder="标准"></td>
        <td><input type="text" class="table-input" placeholder="手机号"></td>
        <td><input type="text" class="table-input" placeholder="车牌号"></td>
        <td><input type="date" class="table-input"></td>
        <td><button class="btn-mini btn-outline" onclick="deleteExpenseRow(this)" style="color:#d32f2f;border-color:#d32f2f;">删除</button></td>
    `;
    tbody.appendChild(row);
}

// 删除费用行
function deleteExpenseRow(btn) {
    btn.closest('tr').remove();
    calculateTotal();
}

// 计算总金额
function calculateTotal() {
    let total = 0;
    const commonInputs = document.querySelectorAll('#commonExpenseBody input[type="number"]');
    commonInputs.forEach(input => {
        if (input.placeholder === '0.00' && input.closest('td').cellIndex === 2) {
            total += parseFloat(input.value) || 0;
        }
    });
    const totalSpan = document.getElementById('totalAmount');
    if (totalSpan) {
        totalSpan.textContent = total.toFixed(2);
    }
}

// 保存报销单
function saveTravelRecord() {
    const recordId = document.getElementById('recordId').value;
    const employeeId = document.getElementById('employeeId').value;
    const organization = document.getElementById('organization').value;
    const applicationId = document.getElementById('applicationId').value;

    if (!employeeId || !organization) {
        showToast('请填写必填项：员工编号、组织机构', 'error');
        return;
    }

    // 收集所有费用数据
    const commonExpenses = collectTableData('commonExpenseBody');
    const travelExpenses = collectTableData('travelExpenseBody');
    const entertainExpenses = collectTableData('entertainExpenseBody');
    const phoneExpenses = collectTableData('phoneExpenseBody');
    const otherExpenses = collectTableData('otherExpenseBody');

    const newRecord = {
        recordId,
        employeeId,
        organization,
        applicationId,
        commonExpenses,
        travelExpenses,
        entertainExpenses,
        phoneExpenses,
        otherExpenses,
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent),
        createTime: new Date().toISOString()
    };

    console.log('保存报销单数据：', newRecord);
    showToast('报销单保存成功！');
    closeModal();

    // 刷新列表
    setTimeout(() => {
        initTravelData();
    }, 500);
}

// 收集表格数据
function collectTableData(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return [];

    const rows = tbody.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input, select');
        const rowData = {};
        inputs.forEach((input, index) => {
            rowData[`field_${index}`] = input.value;
        });
        data.push(rowData);
    });

    return data;
}

// 查看报销单详情
function viewTravelDetail(recordId) {
    // 从聚合数据中查找单条记录
    let record = null;
    for (const group of travelData) {
        record = group.records.find(r => (r.单据编号 || r.recordId) === recordId);
        if (record) break;
    }

    if (!record) {
        showToast('未找到该报销单', 'error');
        return;
    }

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    modalTitle.textContent = '📄 查看报销单详情';

    modalBody.innerHTML = `
        <div style="max-height:70vh;overflow-y:auto;padding:0 4px;">
            <!-- 基本信息 -->
            <div style="background:#e3f2fd;padding:10px 16px;margin-bottom:16px;border-radius:6px;border-left:4px solid #2196f3;">
                <h3 style="margin:0;font-size:15px;color:#1976d2;">【基本信息】</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">单据编号</label>
                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#333;">${record.单据编号 || record.recordId || '-'}</div>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">员工编号</label>
                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#333;">${record.员工编号 || record.employeeId || '-'}</div>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">姓名</label>
                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#333;">${record.姓名 || record.employeeName || '-'}</div>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">部门</label>
                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#333;">${record.部门 || record.department || '-'}</div>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">合同编号</label>
                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#333;">${record.合同编号 || record.contractId || '-'}</div>
                </div>
                <div>
                    <label style="display:block;margin-bottom:4px;font-size:13px;color:#666;">报销日期</label>
                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#333;">${record.报销日期 || record.expenseDate || '-'}</div>
                </div>
            </div>

            ${generateViewExpenseSection(record)}
        </div>
    `;

    modalFooter.innerHTML = `
        <button class="btn btn-outline" onclick="closeModal()">关闭</button>
    `;

    document.getElementById('modalOverlay').classList.add('active');
}

// 生成查看详情的费用区域
function generateViewExpenseSection(record) {
    return `
        ${generateViewCommonExpenseTable(record)}
        ${generateViewTravelExpenseTable(record)}
        ${generateViewEntertainExpenseTable(record)}
        ${generateViewPhoneExpenseTable(record)}
        ${generateViewOtherExpenseTable(record)}
        <div style="margin-top:20px;padding:16px;background:#f0f9ff;border-radius:6px;text-align:right;">
            <span style="font-size:16px;font-weight:600;color:#1976d2;">报销总额：¥${(record.amount || record.报销金额 || 0).toFixed(2)}</span>
        </div>
    `;
}

// 查看通用费用信息子表
function generateViewCommonExpenseTable(record) {
    const row = `<tr style="background:#fafafa;">
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.费用承担成本中心 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.预算科目 || record.category || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.报销金额 || record.amount || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.税额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.不含税金额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.实际报销本币金额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.发票号码 || record.invoiceNumber || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.发票金额 || record.invoiceAmount || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.发票日期 || record.invoiceDate || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.发票类型 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.发票种类 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.税率 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.税种 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.发票税额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.折扣 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.项目 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.是否政府项目 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.WBS合同编号 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.预算期间 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.本位币 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.汇率 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.交易币种 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.付款币种 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.付款币种金额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.事由 || record.remark || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.备注 || record.remark || '-'}</td>
    </tr>`;

    return `
        <div style="background:#e8f5e9;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #4caf50;">
            <h3 style="margin:0;font-size:15px;color:#2e7d32;">【通用费用信息】</h3>
        </div>
        <div style="margin-bottom:20px;overflow-x:auto;">
            <table class="data-table" style="font-size:12px;min-width:3000px;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="width:120px;">费用承担成本中心</th>
                        <th style="width:100px;">预算科目</th>
                        <th style="width:100px;">报销金额</th>
                        <th style="width:80px;">税额</th>
                        <th style="width:100px;">不含税金额</th>
                        <th style="width:120px;">实际报销本币金额</th>
                        <th style="width:120px;">发票号码</th>
                        <th style="width:100px;">发票金额</th>
                        <th style="width:100px;">发票日期</th>
                        <th style="width:100px;">发票类型</th>
                        <th style="width:100px;">发票种类</th>
                        <th style="width:80px;">税率(%)</th>
                        <th style="width:80px;">税种</th>
                        <th style="width:80px;">发票税额</th>
                        <th style="width:80px;">折扣</th>
                        <th style="width:100px;">项目</th>
                        <th style="width:100px;">是否政府项目</th>
                        <th style="width:120px;">WBS(合同编号)</th>
                        <th style="width:100px;">预算期间</th>
                        <th style="width:80px;">本位币</th>
                        <th style="width:80px;">汇率</th>
                        <th style="width:80px;">交易币种</th>
                        <th style="width:80px;">付款币种</th>
                        <th style="width:100px;">付款币种金额</th>
                        <th style="width:150px;">事由</th>
                        <th style="width:150px;">备注</th>
                    </tr>
                </thead>
                <tbody>${row}</tbody>
            </table>
        </div>
    `;
}

// 查看差旅费用明细子表
function generateViewTravelExpenseTable(record) {
    const row = `<tr style="background:#fafafa;">
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.天数 || record.days || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.同行人 || record.companions || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.地点 || record.destination || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.报销标准 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.出发地 || record.departure || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.目的地 || record.destination || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.出发日期 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.返回日期 || record.returnDate || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.交通工具 || record.transport || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.坐席等级 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.坐席标准 || '-'}</td>
    </tr>`;

    return `
        <div style="background:#fff3e0;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #ff9800;">
            <h3 style="margin:0;font-size:15px;color:#e65100;">【差旅费用明细】</h3>
        </div>
        <div style="margin-bottom:20px;overflow-x:auto;">
            <table class="data-table" style="font-size:12px;min-width:1400px;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="width:80px;">天数</th>
                        <th style="width:120px;">同行人</th>
                        <th style="width:100px;">地点</th>
                        <th style="width:100px;">报销标准</th>
                        <th style="width:100px;">出发地</th>
                        <th style="width:100px;">目的地</th>
                        <th style="width:100px;">出发日期</th>
                        <th style="width:100px;">返回日期</th>
                        <th style="width:100px;">交通工具</th>
                        <th style="width:100px;">坐席等级</th>
                        <th style="width:100px;">坐席标准</th>
                    </tr>
                </thead>
                <tbody>${row}</tbody>
            </table>
        </div>
    `;
}

// 查看招待费用明细子表
function generateViewEntertainExpenseTable(record) {
    const row = `<tr style="background:#fafafa;">
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.招待对象类型 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.招待对象 || record.entertainGuest || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.我方人数 || record.ourCount || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.对方人数 || record.theirCount || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.用餐次数 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.招待地点 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.主宴请人 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.标准 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.招待日期 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.我方陪同人员 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.我方人员名称 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.实际陪同人员 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.实际陪同人员名称 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.酒水数量 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.酒水单价 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.购买酒水金额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.领用酒水金额 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.预计用餐时段 || '-'}</td>
    </tr>`;

    return `
        <div style="background:#fce4ec;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #e91e63;">
            <h3 style="margin:0;font-size:15px;color:#c2185b;">【招待费用明细】</h3>
        </div>
        <div style="margin-bottom:20px;overflow-x:auto;">
            <table class="data-table" style="font-size:12px;min-width:2200px;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="width:120px;">招待对象类型</th>
                        <th style="width:120px;">招待对象</th>
                        <th style="width:80px;">我方人数</th>
                        <th style="width:80px;">对方人数</th>
                        <th style="width:80px;">用餐次数</th>
                        <th style="width:120px;">招待地点</th>
                        <th style="width:100px;">主宴请人</th>
                        <th style="width:100px;">标准</th>
                        <th style="width:100px;">招待日期</th>
                        <th style="width:120px;">我方陪同人员</th>
                        <th style="width:120px;">我方人员名称</th>
                        <th style="width:120px;">实际陪同人员</th>
                        <th style="width:120px;">实际陪同人员名称</th>
                        <th style="width:80px;">酒水数量</th>
                        <th style="width:80px;">酒水单价</th>
                        <th style="width:100px;">购买酒水金额</th>
                        <th style="width:100px;">领用酒水金额</th>
                        <th style="width:120px;">预计用餐时段</th>
                    </tr>
                </thead>
                <tbody>${row}</tbody>
            </table>
        </div>
    `;
}

// 查看手机费用子表
function generateViewPhoneExpenseTable(record) {
    const row = `<tr style="background:#fafafa;">
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.手机号 || record.phoneNumber || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.业务期间 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.费用标准 || '-'}</td>
    </tr>`;

    return `
        <div style="background:#e1f5fe;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #03a9f4;">
            <h3 style="margin:0;font-size:15px;color:#0277bd;">【手机费用】</h3>
        </div>
        <div style="margin-bottom:20px;overflow-x:auto;">
            <table class="data-table" style="font-size:12px;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="width:150px;">手机号</th>
                        <th style="width:150px;">业务期间</th>
                        <th style="width:150px;">费用标准</th>
                    </tr>
                </thead>
                <tbody>${row}</tbody>
            </table>
        </div>
    `;
}

// 查看其他费用明细子表
function generateViewOtherExpenseTable(record) {
    const row = `<tr style="background:#fafafa;">
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.用餐人数 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.人次 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.费用标准_其他 || record.费用标准 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.手机号_其他 || record.手机号 || record.phoneNumber || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.车牌号 || '-'}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;">${record.业务发生日期 || '-'}</td>
    </tr>`;

    return `
        <div style="background:#f3e5f5;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #9c27b0;">
            <h3 style="margin:0;font-size:15px;color:#6a1b9a;">【其他费用明细】</h3>
        </div>
        <div style="margin-bottom:20px;overflow-x:auto;">
            <table class="data-table" style="font-size:12px;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="width:100px;">用餐人数</th>
                        <th style="width:100px;">人次</th>
                        <th style="width:120px;">费用标准</th>
                        <th style="width:120px;">手机号</th>
                        <th style="width:120px;">车牌号</th>
                        <th style="width:120px;">业务发生日期</th>
                    </tr>
                </thead>
                <tbody>${row}</tbody>
            </table>
        </div>
    `;
}

// 查看报销单详情（完全复刻“新增报销单”的 5 分类多表结构，注入假数据）
function viewTravelRecordDetail(group) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    modalTitle.textContent = '📄 报销明细查看 - 假数据预览';

    // 完全复刻新增弹窗的 UI 结构与样式，但转为只读展示
    modalBody.innerHTML = `
        <div style="font-family:'Microsoft YaHei', sans-serif; padding-right:8px; max-height:70vh; overflow-y:auto;">
            
            <!-- 1. 基本信息 -->
            <div style="background:#e3f2fd;padding:10px 16px;margin-bottom:16px;border-radius:6px;border-left:4px solid #2196f3;">
                <h3 style="margin:0;font-size:15px;color:#1976d2;">【基本信息】</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;">
                <div><span style="color:#64748b;font-size:12px;">单据编号</span><div style="font-weight:600;margin-top:4px;">E01797620251200001</div></div>
                <div><span style="color:#64748b;font-size:12px;">员工姓名</span><div style="font-weight:600;margin-top:4px;">李娜</div></div>
                <div><span style="color:#64748b;font-size:12px;">组织机构</span><div style="font-weight:600;margin-top:4px;">市场部</div></div>
                <div><span style="color:#64748b;font-size:12px;">申请单号</span><div style="font-weight:600;margin-top:4px;">APP-2026-0012</div></div>
            </div>

            <!-- 2. 通用费用信息 -->
            <div style="background:#e8f5e9;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #4caf50;">
                <h3 style="margin:0;font-size:15px;color:#2e7d32;">【通用费用信息】</h3>
            </div>
            <div style="margin-bottom:20px;overflow-x:auto;">
                <table class="data-table" style="font-size:12px;min-width:3000px;text-align:center;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:120px;">费用承担成本中心</th><th style="width:100px;">预算科目</th>
                            <th style="width:100px;">报销金额</th><th style="width:80px;">税额</th>
                            <th style="width:100px;">不含税金额</th><th style="width:120px;">实际报销本币金额</th>
                            <th style="width:120px;">发票号码</th><th style="width:100px;">发票金额</th>
                            <th style="width:100px;">发票日期</th><th style="width:100px;">发票类型</th>
                            <th style="width:100px;">发票种类</th><th style="width:80px;">税率(%)</th>
                            <th style="width:80px;">税种</th><th style="width:80px;">发票税额</th>
                            <th style="width:80px;">折扣</th><th style="width:100px;">项目</th>
                            <th style="width:100px;">是否政府项目</th><th style="width:120px;">WBS(合同编号)</th>
                            <th style="width:100px;">预算期间</th><th style="width:80px;">本位币</th>
                            <th style="width:80px;">汇率</th><th style="width:80px;">交易币种</th>
                            <th style="width:80px;">付款币种</th><th style="width:100px;">付款币种金额</th>
                            <th style="width:150px;">事由</th><th style="width:150px;">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #eee;">
                            <td>研发中心</td><td>硬件维修费</td><td style="color:#e65100;font-weight:bold;">¥ 1285.00</td><td>¥ 72.74</td><td>¥ 1212.26</td><td>¥ 1285.00</td>
                            <td>FP20250122001</td><td>1285.00</td><td>2025-01-22</td><td>增值税专用发票</td><td>电子</td><td>6%</td><td>增值税</td><td>72.74</td>
                            <td>无</td><td>服务器升级</td><td>否</td><td>CI-2026-015</td><td>2025-Q1</td><td>RMB</td><td>1.0</td><td>RMB</td><td>RMB</td><td>1285.00</td>
                            <td>主板配件更换</td><td>已核对</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 3. 差旅费用明细 -->
            <div style="background:#fff3e0;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #ff9800;">
                <h3 style="margin:0;font-size:15px;color:#e65100;">【差旅费用明细】</h3>
            </div>
            <div style="margin-bottom:20px;overflow-x:auto;">
                <table class="data-table" style="font-size:12px;min-width:1400px;text-align:center;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:80px;">天数</th><th style="width:120px;">同行人</th>
                            <th style="width:100px;">地点</th><th style="width:100px;">报销标准</th>
                            <th style="width:100px;">出发地</th><th style="width:100px;">目的地</th>
                            <th style="width:100px;">出发日期</th><th style="width:100px;">返回日期</th>
                            <th style="width:100px;">交通工具</th><th style="width:100px;">坐席等级</th>
                            <th style="width:100px;">坐席标准</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #eee;">
                            <td>3</td><td>王强, 赵雷</td><td>北京</td><td>¥ 800/天</td><td>广州</td><td>北京</td>
                            <td>2025-06-12</td><td>2025-06-15</td><td>高铁</td><td>二等座</td><td>符合标准</td>
                        </tr>
                        <tr style="border-bottom:1px solid #eee;">
                            <td>1</td><td>无</td><td>深圳</td><td>¥ 500/天</td><td>广州</td><td>深圳</td>
                            <td>2025-06-20</td><td>2025-06-21</td><td>大巴</td><td>普通</td><td>符合标准</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 4. 招待费用明细 -->
            <div style="background:#fce4ec;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #e91e63;">
                <h3 style="margin:0;font-size:15px;color:#c2185b;">【招待费用明细】</h3>
            </div>
            <div style="margin-bottom:20px;overflow-x:auto;">
                <table class="data-table" style="font-size:12px;min-width:2200px;text-align:center;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:120px;">招待对象类型</th><th style="width:120px;">招待对象</th>
                            <th style="width:80px;">我方人数</th><th style="width:80px;">对方人数</th>
                            <th style="width:80px;">用餐次数</th><th style="width:120px;">招待地点</th>
                            <th style="width:100px;">主宴请人</th><th style="width:100px;">标准</th>
                            <th style="width:100px;">招待日期</th><th style="width:120px;">我方陪同人员</th>
                            <th style="width:120px;">我方人员名称</th><th style="width:120px;">实际陪同人员</th>
                            <th style="width:120px;">实际陪同人员名称</th><th style="width:80px;">酒水数量</th>
                            <th style="width:80px;">酒水单价</th><th style="width:100px;">购买酒水金额</th>
                            <th style="width:100px;">领用酒水金额</th><th style="width:120px;">预计用餐时段</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="18" style="color:#999;padding:15px;">暂无招待费用数据</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- 5. 手机费用 -->
            <div style="background:#e1f5fe;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #03a9f4;">
                <h3 style="margin:0;font-size:15px;color:#0277bd;">【手机费用】</h3>
            </div>
            <div style="margin-bottom:20px;overflow-x:auto;">
                <table class="data-table" style="font-size:12px;text-align:center;width:100%;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:150px;">手机号</th><th style="width:150px;">业务期间</th><th style="width:150px;">费用标准</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #eee;">
                            <td>138****0001</td><td>2025年3月</td><td>¥ 200/月</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 6. 其他费用明细 -->
            <div style="background:#f3e5f5;padding:10px 16px;margin-bottom:12px;border-radius:6px;border-left:4px solid #9c27b0;">
                <h3 style="margin:0;font-size:15px;color:#6a1b9a;">【其他费用明细】</h3>
            </div>
            <div style="margin-bottom:20px;overflow-x:auto;">
                <table class="data-table" style="font-size:12px;text-align:center;width:100%;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="width:100px;">用餐人数</th><th style="width:100px;">人次</th>
                            <th style="width:120px;">费用标准</th><th style="width:120px;">手机号</th>
                            <th style="width:120px;">车牌号</th><th style="width:120px;">业务发生日期</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr style="border-bottom:1px solid #eee;">
                            <td>-</td><td>-</td><td>按实报销</td><td>-</td><td>京A·88888</td><td>2025-08-20</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 7. 汇总金句 -->
            <div style="margin-top:20px;padding:16px;background:#f0f9ff;border-radius:6px;text-align:right;">
                <span style="font-size:16px;font-weight:600;color:#1976d2;">报销总额：<span style="font-size:22px;color:#e65100;">¥ 2,516.00</span></span>
            </div>

        </div>
    `;

    modalFooter.innerHTML = `
        <button class="btn btn-primary" style="padding:8px 32px;" onclick="closeModal()">关闭明细</button>
    `;

    // 恢复正常尺寸：移除任何会导致弹窗宽高变异的内联样式，回归系统默认的打开方式
    const box = document.getElementById('modalBox');
    if (box) {
        box.style.width = '1000px';
        box.style.maxWidth = '90vw';
    }

    document.getElementById('modalOverlay').classList.add('active');
}


// 页面切换时初始化
const originalSwitchPage = window.switchPage;
window.switchPage = function (page) {
    if (originalSwitchPage) originalSwitchPage(page);
    if (page === 'travel' && travelData.length === 0) {
        initTravelData();
    }
};
