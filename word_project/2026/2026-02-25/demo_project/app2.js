// ===== app2.js - 弹窗续集 + ECharts + 导出 + 初始化 =====

// ===== 监理人员 - 二级页面(派单汇总) =====
function showPersonnelLevel2(name) {
    openWideModal('派单汇总 - ' + name, `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
            <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部监造形式</option><option>驻厂</option><option>巡检</option></select>
            <input type="text" placeholder="制造厂" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
            <input type="text" placeholder="总监代表" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
            <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部状态</option><option>进行中</option><option>已完成</option><option>待派遣</option></select>
            <button class="btn btn-primary" style="padding:5px 12px">查询</button>
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr><th>派单编号</th><th>监造形式</th><th>辅助人员</th><th>制造厂</th><th>总监代表</th><th>计划开始</th><th>计划结束</th><th>发起时间</th><th>派单状态</th><th>监造结束</th><th>剩余时间</th><th>工时</th><th>操作</th></tr></thead>
            <tbody>
                <tr><td>PD-20260115-01</td><td><span class="tag tag-blue">驻厂</span></td><td>李四, 陈伟</td><td>东方锅炉</td><td>周磊</td><td>2026-01-20</td><td class="text-danger">2026-02-28</td><td>2026-01-15</td><td><span class="status status-active">进行中</span></td><td>—</td><td>3天</td><td>34</td><td><button class="btn-mini btn-primary" onclick="showPersonnelLevel3('${name}','PD-20260115-01')">查看</button></td></tr>
                <tr><td>PD-20260115-02</td><td><span class="tag tag-cyan">巡检</span></td><td>赵六</td><td>东方锅炉</td><td>周磊</td><td>2026-01-25</td><td>2026-03-15</td><td>2026-01-15</td><td><span class="status status-active">进行中</span></td><td>—</td><td>18天</td><td>30</td><td><button class="btn-mini btn-primary" onclick="showPersonnelLevel3('${name}','PD-20260115-02')">查看</button></td></tr>
            </tbody>
        </table></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">返回</button>`);
}

// ===== 监理人员 - 三级页面(打卡记录与日历) =====
// source: 'workhour' | 'personnel'(default), ci/ciName 用于从工时记录返回
function showPersonnelLevel3(name, pd, source, ci, ciName) {
    const isFromWorkhour = source === 'workhour';
    const backBtn = isFromWorkhour
        ? `<button class="btn btn-outline" onclick="showWorkhourLevel2('${ci || ''}','${ciName || ''}')">← 返回派单列表</button>`
        : `<button class="btn btn-outline" onclick="showPersonnelLevel2('${name}')">← 返回派单汇总</button>`;

    openModal('打卡记录与日历 - ' + name + ' (' + pd + ')', `
        <!-- 人员信息摘要 -->
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px;">
            <div style="background:linear-gradient(135deg,#e8f4fd,#d1ecf9);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#5b8db8;margin-bottom:4px;">人员姓名</div>
                <div style="font-size:15px;font-weight:700;color:#1a6fb5;">${name}</div>
            </div>
            <div style="background:linear-gradient(135deg,#ede7f6,#d9ccf0);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#7e57c2;margin-bottom:4px;">派单编号</div>
                <div style="font-size:13px;font-weight:600;color:#5e35b1;">${pd}</div>
            </div>
            <div style="background:linear-gradient(135deg,#e8fdf0,#d1f9e0);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#4a9d6b;margin-bottom:4px;">本月出勤</div>
                <div style="font-size:18px;font-weight:700;color:#2d7d4f;">15 天</div>
            </div>
            <div style="background:linear-gradient(135deg,#fff3e0,#ffe8cc);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#c77c2a;margin-bottom:4px;">本月休息</div>
                <div style="font-size:18px;font-weight:700;color:#e68a00;">6 天</div>
            </div>
            <div style="background:linear-gradient(135deg,#fce4ec,#f8bbd0);border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:11px;color:#c62828;margin-bottom:4px;">异常记录</div>
                <div style="font-size:18px;font-weight:700;color:#d32f2f;">0 天</div>
            </div>
        </div>
        <!-- 双栏内容：打卡列表 + 日历 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <!-- 左侧：打卡列表 -->
            <div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;">
                <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);">
                    <h4 style="font-size:13px;font-weight:600;color:#334155;margin:0;">📋 打卡列表</h4>
                </div>
                <div style="max-height:350px;overflow-y:auto;">
                    <table class="data-table">
                        <thead><tr><th>姓名</th><th>日期</th><th>上班</th><th>下班</th><th>签到状态</th><th style="width:50px;">工时</th></tr></thead>
                        <tbody>
                            <tr><td><span class="link-text" title="点击筛选日历">${name}</span></td><td>2026-02-25</td><td>08:30</td><td>17:30</td><td><span class="tag tag-green">正常</span></td><td style="font-weight:600;">1</td></tr>
                            <tr><td>${name}</td><td>2026-02-24</td><td>08:25</td><td>17:35</td><td><span class="tag tag-green">正常</span></td><td style="font-weight:600;">1</td></tr>
                            <tr style="background:#fffbeb;"><td>${name}</td><td>2026-02-23</td><td>—</td><td>—</td><td><span class="tag tag-orange">休息</span></td><td>0</td></tr>
                            <tr style="background:#fffbeb;"><td>${name}</td><td>2026-02-22</td><td>—</td><td>—</td><td><span class="tag tag-orange">休息</span></td><td>0</td></tr>
                            <tr><td>${name}</td><td>2026-02-21</td><td>08:20</td><td>17:40</td><td><span class="tag tag-green">正常</span></td><td style="font-weight:600;">1</td></tr>
                            <tr><td>${name}</td><td>2026-02-20</td><td>08:15</td><td>17:45</td><td><span class="tag tag-green">正常</span></td><td style="font-weight:600;">1</td></tr>
                            <tr><td>${name}</td><td>2026-02-19</td><td>08:30</td><td>17:30</td><td><span class="tag tag-green">正常</span></td><td style="font-weight:600;">1</td></tr>
                            <tr><td>${name}</td><td>2026-02-18</td><td>08:28</td><td>17:32</td><td><span class="tag tag-green">正常</span></td><td style="font-weight:600;">1</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 右侧：工时日历 -->
            <div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;">
                <div style="background:#f8fafc;padding:10px 16px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                    <h4 style="font-size:13px;font-weight:600;color:#334155;margin:0;">📅 工时日历 (2026年2月)</h4>
                    <span style="font-size:11px;color:var(--text-muted);">颜色深浅反映并发派单数</span>
                </div>
                <div style="padding:16px;">
                    <div id="personnelCalendar" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:12px;">
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">一</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">二</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">三</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">四</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">五</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">六</div>
                        <div style="text-align:center;font-weight:600;color:var(--text-muted);padding:6px;">日</div>
                        ${buildCalendarDays()}
                    </div>
                    <div style="margin-top:12px;display:flex;gap:16px;align-items:center;font-size:11px;color:var(--text-muted);">
                        <span>图例：</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:16px;height:16px;border-radius:4px;background:#bde0fe;display:inline-block;"></span> 单派单</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:16px;height:16px;border-radius:4px;background:#5baadc;display:inline-block;"></span> 多派单</span>
                        <span style="display:flex;align-items:center;gap:4px;"><span style="width:16px;height:16px;border-radius:4px;background:#f5f5f5;display:inline-block;"></span> 休息日</span>
                    </div>
                </div>
                <div style="padding:0 16px 14px;font-size:11px;color:var(--text-muted);">
                    💡 鼠标悬停日期显示关联派单编号，颜色越深代表并发派单数越多
                </div>
            </div>
        </div>
    `, backBtn);
    // 设置为近全屏宽度
    document.getElementById('modalBox').style.maxWidth = '1300px';
}
function buildCalendarDays() {
    const days = [];
    // 2026年2月: 周日开始，2月1日是周日
    days.push('<div></div>'.repeat(6)); // padding for Sun start at position 7
    for (let d = 1; d <= 28; d++) {
        const isWeekend = (d % 7 === 1 || d % 7 === 0);
        const hasWork = !isWeekend && d <= 25;
        const multiPD = d >= 16 && d <= 20 && hasWork;
        const bg = multiPD ? 'rgba(64,158,255,0.5)' : hasWork ? 'rgba(64,158,255,0.2)' : 'transparent';
        const title = multiPD ? 'PD-20260115-01, PD-20260115-02' : hasWork ? 'PD-20260115-01' : '';
        days.push(`<div style="text-align:center;padding:6px 2px;border-radius:4px;background:${bg};cursor:${hasWork ? 'pointer' : 'default'}" title="${title}">${d}</div>`);
    }
    return days.join('');
}

// ===== 工时记录 - 二级 =====
function showWorkhourLevel2(ci, name) {
    const isCI001 = ci === 'CI-2026-001';
    openModal('派单列表 - ' + ci + ' (' + name + ')', `
        <!-- 合同摘要信息 -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;">
            <div style="background:linear-gradient(135deg,#e8f4fd,#d1ecf9);border-radius:10px;padding:16px;text-align:center;">
                <div style="font-size:12px;color:#5b8db8;margin-bottom:6px;">监理编号</div>
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
        <!-- 派单明细表格 -->
        <div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;">
            <div style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                <h4 style="font-size:14px;font-weight:600;color:#334155;margin:0;">📋 派单明细</h4>
                <span style="font-size:12px;color:var(--text-muted);">共 2 条派单记录</span>
            </div>
            <div style="overflow-x:auto;">
                <table class="data-table" style="min-width:1000px;">
                    <thead><tr>
                        <th style="width:140px;">派单编号</th><th style="width:70px;">监造形式</th><th style="min-width:160px;">辅助人员</th>
                        <th>制造厂</th><th>总监代表</th><th>计划开始</th><th style="min-width:90px;">计划结束</th>
                        <th>发起时间</th><th>派单状态</th><th>监造结束</th><th>剩余时间</th><th style="width:60px;">工时</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>PD-20260115-01</strong></td>
                            <td><span class="tag tag-blue">驻厂</span></td>
                            <td>
                                <span class="link-text" onclick="showPersonnelLevel3('张三','PD-20260115-01','workhour','${ci}','${name}')">张三</span>、
                                <span class="link-text" onclick="showPersonnelLevel3('李四','PD-20260115-01','workhour','${ci}','${name}')">李四</span>、
                                <span class="link-text" onclick="showPersonnelLevel3('陈伟','PD-20260115-01','workhour','${ci}','${name}')">陈伟</span>
                            </td>
                            <td>东方锅炉</td><td>周磊</td><td>2026-01-20</td>
                            <td class="text-danger" style="font-weight:600;">2026-02-28 ⚠️</td>
                            <td>2026-01-15</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td style="color:var(--orange);font-weight:600;">3天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">98</td>
                        </tr>
                        <tr>
                            <td><strong>PD-20260115-02</strong></td>
                            <td><span class="tag tag-cyan">巡检</span></td>
                            <td>
                                <span class="link-text" onclick="showPersonnelLevel3('王五','PD-20260115-02','workhour','${ci}','${name}')">王五</span>、
                                <span class="link-text" onclick="showPersonnelLevel3('赵六','PD-20260115-02','workhour','${ci}','${name}')">赵六</span>
                            </td>
                            <td>东方锅炉</td><td>周磊</td><td>2026-01-25</td>
                            <td>2026-03-15</td><td>2026-01-15</td>
                            <td><span class="status status-active">进行中</span></td>
                            <td>—</td><td>18天</td>
                            <td style="font-size:16px;font-weight:700;color:var(--blue);">60</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style="background:#f0f7ff;font-weight:600;">
                            <td colspan="11" style="text-align:right;padding-right:20px;">合计工时</td>
                            <td style="font-size:18px;color:var(--blue);">158</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div style="margin-top:12px;padding:10px 16px;background:var(--blue-light);border-radius:8px;border:1px solid rgba(64,158,255,0.15);display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">💡</span>
            <span style="font-size:12px;color:var(--blue);">辅助人员列点击人名可进入对应的<strong>打卡记录与日历</strong>（三级页面弹窗）| 计划结束标红表示即将超期或已超期</span>
        </div>
        ` : `
        <div style="text-align:center;padding:60px 20px;">
            <div style="font-size:56px;margin-bottom:16px;opacity:0.5;">📭</div>
            <div style="font-size:16px;color:var(--text-muted);margin-bottom:8px;">暂无派单记录</div>
            <div style="font-size:13px;color:var(--text-muted);">该合同尚未创建任何派单</div>
        </div>
        `}
    `, `<button class="btn btn-outline" onclick="closeModal()">返回</button>`);
    // 设置为近全屏宽度
    document.getElementById('modalBox').style.maxWidth = '1300px';
}

// ===== 开票 - 新增 =====
function showInvoiceAddDialog() {
    openModal('新增开票记录', `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>开票组织</label><select><option>总公司</option><option>分公司</option></select></div>
            <div class="modal-form-group"><label>开票客户</label><input type="text" placeholder="请输入"></div>
            <div class="modal-form-group"><label>开票日期</label><input type="date"></div>
            <div class="modal-form-group"><label>发票号</label><input type="text" placeholder="自动生成或手动输入"></div>
            <div class="modal-form-group"><label>币种</label><select><option>CNY</option><option>USD</option><option>EUR</option></select></div>
            <div class="modal-form-group"><label>总数量</label><input type="number"></div>
            <div class="modal-form-group"><label>总金额(元)</label><input type="number"></div>
            <div class="modal-form-group"><label>预计回款时间</label><input type="date"></div>
            <div class="modal-form-group"><label>合同负责人</label><input type="text"></div>
            <div class="modal-form-group"><label>监理编号</label><select><option>CI-2026-001</option><option>CI-2026-002</option><option>CI-2026-003</option></select></div>
            <div class="modal-form-group"><label>项目名称</label><input type="text" placeholder="选择监理编号后自动带出"></div>
            <div class="modal-form-group"><label>凭证号</label><input type="text"></div>
        </div>
        <div class="modal-form-group"><label>备注</label><textarea></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-outline" onclick="showToast('已保存(暂存，不校验)');closeModal()">保存</button>
       <button class="btn btn-primary" onclick="showToast('已提交(校验并走审批流)');closeModal()">提交</button>`);
}
function showInvoiceEditDialog() { showInvoiceAddDialog(); }
function showInvoiceDetail() { openModal('开票详情', '<div style="text-align:center;padding:30px;color:var(--text-muted)">📋 此处展示完整的开票记录详情信息</div>', `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`); }

// ===== 回款 =====
function showPaymentAddDialog() {
    openModal('新增回款记录', `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>监理编号</label><select onchange="showToast('已联动带出项目名称和项目经理')"><option>CI-2026-001</option><option>CI-2026-002</option></select></div>
            <div class="modal-form-group"><label>对方单位</label><input type="text" placeholder="请输入"></div>
            <div class="modal-form-group"><label>回款金额(元)</label><input type="number" placeholder="请输入"></div>
            <div class="modal-form-group"><label>回款时间</label><input type="date"></div>
        </div>
        <div class="modal-form-group"><label>回款凭证(pdf/图片)</label><div style="border:2px dashed var(--border-color);border-radius:8px;padding:24px;text-align:center;color:var(--text-muted);cursor:pointer">📁 点击或拖拽上传凭证文件(pdf/图片)</div></div>
        <div class="modal-form-group"><label>备注</label><textarea></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-outline" onclick="showToast('已保存');closeModal()">保存</button>
       <button class="btn btn-primary" onclick="showToast('已提交');closeModal()">提交</button>`);
}
function showPaymentDetail() { openModal('回款详情', '<div style="text-align:center;padding:30px;color:var(--text-muted)">📋 回款记录详情</div>', `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`); }
function showPaymentResubmitDialog() { showPaymentAddDialog(); }
function showPaymentSummaryDialog() {
    openModal('回款汇总', `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
            <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>按监理编号</option><option>按对方单位</option><option>按项目</option><option>按项目经理</option></select>
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showToast('已汇总')">执行汇总</button>
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr><th>维度</th><th>回款金额合计(元)</th><th>笔数</th></tr></thead>
            <tbody>
                <tr><td>CI-2026-001</td><td class="text-right"><strong>150,000</strong></td><td>2</td></tr>
                <tr><td>CI-2026-002</td><td class="text-right"><strong>400,000</strong></td><td>1</td></tr>
                <tr style="background:var(--blue-light)"><td><strong>合计</strong></td><td class="text-right"><strong>550,000</strong></td><td><strong>3</strong></td></tr>
            </tbody>
        </table></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
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

// ===== 成本明细 =====
function showCostPersonnelDialog(ci) {
    openWideModal('人员成本清单 - ' + ci, `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
            <input type="text" placeholder="姓名" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
            <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
            <button class="btn btn-primary" style="padding:5px 12px">查询</button>
            <button class="btn btn-success" style="padding:5px 12px" onclick="doExport('人员成本清单')">导出</button>
        </div>
        <div style="padding:10px;background:var(--purple-light);border-radius:6px;font-size:12px;color:var(--purple);margin-bottom:8px">📐 核算规则：以监理人员为维度，若一人同时在N个派单，成本 = (工时÷N) × 单价（保留2位小数）</div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr><th>姓名</th><th>工时(天)</th><th>并发派单数</th><th>有效工时</th><th>单价(元/天)</th><th>个人成本(元)</th></tr></thead>
            <tbody>
                <tr><td>张三</td><td>34</td><td>2</td><td>17.00</td><td>800</td><td class="text-right">13,600.00</td></tr>
                <tr><td>李四</td><td>34</td><td>1</td><td>34.00</td><td>650</td><td class="text-right">22,100.00</td></tr>
                <tr><td>陈伟</td><td>34</td><td>1</td><td>34.00</td><td>900</td><td class="text-right">30,600.00</td></tr>
                <tr style="background:var(--blue-light)"><td><strong>合计</strong></td><td>—</td><td>—</td><td>—</td><td>—</td><td class="text-right"><strong>66,300.00</strong></td></tr>
            </tbody>
        </table></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}
function showCostTravelDialog(ci) { openModal('差旅成本明细 - ' + ci, '<div style="padding:20px;text-align:center;color:var(--text-muted)">差旅数据按出差单关联CI编号显示</div>', `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`); }
function showCostFixedDialog(ci) {
    openModal('固定支出清单 - ' + ci, `
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
            <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部成本类型</option><option>服务人员</option><option>资料费用</option><option>其他采购</option></select>
            <button class="btn btn-primary" style="padding:5px 12px">查询</button>
            <button class="btn btn-success" style="padding:5px 12px" onclick="doExport('固定支出')">导出</button>
            <button class="btn btn-primary" style="padding:5px 12px" onclick="showToast('新增固定成本')">新增</button>
        </div>
        <div class="table-wrapper" style="margin:0"><table class="data-table">
            <thead><tr><th>成本类型</th><th>服务人员成本</th><th>资料费用</th><th>其他采购费用</th><th>金额(元)</th><th>产生日期</th><th>录入人员</th></tr></thead>
            <tbody>
                <tr><td>资料费用</td><td>0</td><td>5,000</td><td>0</td><td class="text-right">5,000</td><td>2026-01-20</td><td>财务张</td></tr>
                <tr><td>其他采购</td><td>0</td><td>0</td><td>10,000</td><td class="text-right">10,000</td><td>2026-02-01</td><td>财务张</td></tr>
            </tbody>
        </table></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 差旅调整 =====
function showTravelAdjustDialog(code) {
    openWideModal('差旅成本调整 - ' + code, `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">以出差单为维度(一单一条)。默认自动按CI编号数平均分配。</div>
        <div class="tab-bar" style="margin-bottom:12px">
            <button class="tab-btn active" onclick="switchTravelTab(this,'adj-day')">按天调整</button>
            <button class="tab-btn" onclick="switchTravelTab(this,'adj-amount')">按金额调整</button>
        </div>
        <div id="tab-adj-day">
            <div style="font-size:12px;color:var(--blue);margin-bottom:8px">按天调整：总金额 ÷ 天数，调整每个CI编号占据的天数来重算成本</div>
            <div class="table-wrapper" style="margin:0"><table class="data-table">
                <thead><tr><th>CI编号</th><th>合同名称</th><th>默认天数</th><th>调整天数</th><th>分摊成本(元)</th></tr></thead>
                <tbody>
                    <tr><td>CI-2026-001</td><td>某石化换热器</td><td>2.5</td><td><input type="number" value="3" style="width:60px;padding:4px;border:1px solid var(--border-color);border-radius:4px"></td><td class="text-right">1,440.00</td></tr>
                    <tr><td>CI-2026-002</td><td>压力容器监理</td><td>2.5</td><td><input type="number" value="2" style="width:60px;padding:4px;border:1px solid var(--border-color);border-radius:4px"></td><td class="text-right">960.00</td></tr>
                </tbody>
            </table></div>
        </div>
        <div id="tab-adj-amount" style="display:none">
            <div style="font-size:12px;color:var(--blue);margin-bottom:8px">按金额调整：总金额 ÷ CI编号数平均分配后，自行修改调整各 CI 所占金额</div>
            <div class="table-wrapper" style="margin:0"><table class="data-table">
                <thead><tr><th>CI编号</th><th>合同名称</th><th>默认金额</th><th>调整金额(元)</th></tr></thead>
                <tbody>
                    <tr><td>CI-2026-001</td><td>某石化换热器</td><td>1,200.00</td><td><input type="number" value="1400" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px"></td></tr>
                    <tr><td>CI-2026-002</td><td>压力容器监理</td><td>1,200.00</td><td><input type="number" value="1000" style="width:100px;padding:4px;border:1px solid var(--border-color);border-radius:4px"></td></tr>
                </tbody>
            </table></div>
        </div>
    `);
}
function switchTravelTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.getElementById('tab-adj-day').style.display = id === 'adj-day' ? 'block' : 'none';
    document.getElementById('tab-adj-amount').style.display = id === 'adj-amount' ? 'block' : 'none';
}

// ===== 导入弹窗 =====
function showImportDialog(name) {
    openModal('Excel导入 - ' + name, `
        <div style="border:2px dashed var(--border-color);border-radius:12px;padding:40px;text-align:center">
            <div style="font-size:48px;margin-bottom:12px">📂</div>
            <div style="font-size:14px;color:var(--text-secondary)">点击或拖拽Excel文件到此处上传</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:8px">支持 .xlsx, .xls 格式</div>
            <button class="btn btn-primary" style="margin-top:16px">选择文件</button>
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-muted)">💡 请先下载模板填写数据后上传 <span class="link-text">下载模板</span></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="showToast('导入成功');closeModal()">确认导入</button>`);
}

// ===== 导出 =====
function doExport(name) {
    const el = document.getElementById('exportOverlay');
    document.getElementById('exportBody').innerHTML = `
        <div style="text-align:center;padding:20px">
            <div style="font-size:48px;margin-bottom:12px">📊</div>
            <h3 style="margin-bottom:8px">导出预览 - ${name}</h3>
            <div style="font-size:13px;color:var(--text-muted)">将导出当前筛选条件下的所有数据</div>
            <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                <div style="padding:12px 20px;border:1px solid var(--border-color);border-radius:8px"><div style="font-size:24px;font-weight:700;color:var(--blue)">3</div><div style="font-size:11px;color:var(--text-muted)">数据行数</div></div>
                <div style="padding:12px 20px;border:1px solid var(--border-color);border-radius:8px"><div style="font-size:24px;font-weight:700;color:var(--green)">18</div><div style="font-size:11px;color:var(--text-muted)">字段列数</div></div>
            </div>
        </div>
    `;
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
