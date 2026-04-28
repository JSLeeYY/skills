// ===== app.js Part 1: 核心交互 =====

// ===== 页面切换 =====
const PAGE_LABELS = {
    'permission': '全局配置 / 权限分配', 'contract': '核心业务 / 合同台账', 'income': '核心业务 / 项目收入',
    'execution': '核心业务 / 执行管理', 'personnel': '核心业务 / 监理人员动态', 'workhour': '核心业务 / 工时记录',
    'invoice': '财务管理 / 开票明细', 'payment': '财务管理 / 回款明细', 'summary': '财务管理 / 大盘透视', 'reminder': '财务管理 / 提醒设置',
    'cost': '成本与利润 / 动态成本核算', 'travel': '成本与利润 / 差旅报销台账', 'salary': '成本与利润 / 人员工资管理',
    'profit': '成本与利润 / 利润管理', 'report': '成本与利润 / 经营数据量化',
    'monthly-report': '综合报表 / 科研经营月报'
};
function switchPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const t = document.getElementById('page-' + id); if (t) t.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const n = document.querySelector(`.nav-item[data-page="${id}"]`); if (n) n.classList.add('active');
    const bc = document.getElementById('breadcrumb');
    if (bc && PAGE_LABELS[id]) { const p = PAGE_LABELS[id].split(' / '); bc.innerHTML = `<span>${p[0]}</span> / <span>${p[1]}</span>`; }
    closeNotification();
    if (id === 'report') setTimeout(() => initReportCharts(), 300);
    if (id === 'profit') { const c = document.getElementById('profitChartContainer'); if (c) c.style.display = 'none'; }
    if (id === 'income' && typeof applyIncomeStickyColumns === 'function') {
        setTimeout(applyIncomeStickyColumns, 100);
    }
}

// ===== Toast =====
function showToast(msg) {
    const c = document.getElementById('toastContainer'), t = document.createElement('div');
    t.className = 'toast'; t.textContent = '✅ ' + msg; c.appendChild(t); setTimeout(() => t.remove(), 3000);
}

// ===== Modal =====
function openModal(title, body, footer) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalFooter').innerHTML = footer || `<button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="showToast('操作成功');closeModal()">确定</button>`;
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalBox').style.maxWidth = '';
}
function openWideModal(title, body, footer) {
    openModal(title, body, footer);
    const box = document.getElementById('modalBox');
    box.style.maxWidth = '1800px';
    box.style.width = '95vw';
    box.style.height = '85vh';
    box.style.maxHeight = '85vh';
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    // 清理侧挂抽屉
    var sideDrawer = document.getElementById('summary-side-drawer');
    if (sideDrawer) sideDrawer.remove();
    var historyDrawer = document.getElementById('history-side-drawer');
    if (historyDrawer) historyDrawer.remove();
    var modalBox = document.getElementById('modalBox');
    if (modalBox) { modalBox.style.overflow = ''; modalBox.style.position = ''; }
}

function showConfirmDialog(msg, title) {
    openModal(title || '确认操作', `<div style="text-align:center;padding:20px 0"><div style="font-size:48px;margin-bottom:16px">⚠️</div><p style="font-size:15px">${msg}</p></div>`);
}

// ===== Notification =====
function showNotification() { document.getElementById('notificationPanel').classList.add('active'); }
function closeNotification() { document.getElementById('notificationPanel').classList.remove('active'); }

// ===== 高级筛选 =====
function toggleAdvFilter(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const show = el.style.display === 'none';
    el.style.display = show ? 'flex' : 'none';
    if (btn) btn.textContent = show ? '⚡ 收起高级' : '⚡ 高级查询';
}

// ===== 权限分配 =====
function selectPM(el, name) {
    el.parentElement.querySelectorAll('.perm-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('pmName').textContent = name;
}
function showAssignContractModal() {
    const content = `
        <div class="filter-panel" style="margin-bottom:12px; padding:10px; background:#f8f9fa;">
            <div class="filter-row" style="margin-bottom:8px;">
                <div class="filter-item"><label>合同编号</label><input type="text" placeholder="模糊搜索"></div>
                <div class="filter-item"><label>合同名称</label><input type="text" placeholder="模糊搜索"></div>
                <div class="filter-item"><label>委托方</label><input type="text" placeholder="模糊搜索"></div>
                <div class="filter-item"><label>制造方</label><input type="text" placeholder="模糊搜索"></div>
                <div class="filter-item"><label>现项目经理</label><input type="text" placeholder="模糊搜索"></div>
            </div>
            <div class="filter-row" style="margin-bottom:0;">
                <div class="filter-item"><label>合同类型</label><select><option>全部</option><option>开口合同</option><option>总价合同</option><option>框架协议合同</option></select></div>
                <div class="filter-item"><label>项目状态</label><select><option>全部</option><option>进行中</option><option>已完成</option><option>已终止</option></select></div>
            </div>
            <div class="filter-actions" style="margin-top:10px;">
                <button class="btn-mini btn-primary" onclick="showToast('查询成功')">🔍 查询</button>
                <button class="btn-mini btn-outline">↻ 重置</button>
            </div>
        </div>
        <div class="table-wrapper" style="max-height: 450px; overflow-y: auto;">
            <table class="data-table">
                <thead style="position: sticky; top: 0; z-index: 1;">
                    <tr>
                        <th style="width:40px;"><input type="checkbox"></th>
                        <th>监理编号</th>
                        <th>合同名称</th>
                        <th>设备名称</th>
                        <th>委托方</th>
                        <th>制造方</th>
                        <th>合同类型</th>
                        <th>监造金额(元)</th>
                        <th>合同签订时间</th>
                        <th>项目经理(默认)</th>
                        <th>项目状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>CI-2026-004</td>
                        <td>核电设备监造</td>
                        <td>核反应堆辅助设备</td>
                        <td>中国核电</td>
                        <td>上海电气</td>
                        <td><span class="tag tag-blue">开口合同</span></td>
                        <td class="text-right">450,000</td>
                        <td>2026-01-10</td>
                        <td>张三</td>
                        <td><span class="status status-active">进行中</span></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>CI-2026-006</td>
                        <td>锅炉改造监理</td>
                        <td>大型工业锅炉</td>
                        <td>国家电网</td>
                        <td>东方锅炉</td>
                        <td><span class="tag tag-green">总价合同</span></td>
                        <td class="text-right">1,200,000</td>
                        <td>2026-02-05</td>
                        <td>(未绑定)</td>
                        <td><span class="status status-active">进行中</span></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td>CI-2026-007</td>
                        <td>储罐检验监理</td>
                        <td>大型原油储罐</td>
                        <td>中国石油</td>
                        <td>兰州石化机械</td>
                        <td><span class="tag tag-purple">框架协议合同</span></td>
                        <td class="text-right">860,000</td>
                        <td>2026-03-01</td>
                        <td>李四</td>
                        <td><span class="status status-pending">未开始</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" style="margin-top:10px;">
            <span>共 <strong>3</strong> 条可选</span>
            <div class="pagination-btns"><button class="btn-page active">1</button></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:8px">💡 勾选右方复选框并确定后，系统将这批合同的人工特批权限追加给当前选中的项目经理。</div>
    `;
    openWideModal('分配合同 - 权限人工特批追加', content, `<button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="showToast('人工特批分配成功！已即时生效');closeModal()">确认分配</button>`);

    setTimeout(() => {
        const box = document.getElementById('modalBox');
        if (box) {
            box.style.width = '1400px';
            box.style.maxWidth = '95vw';
        }
    }, 10);
}

// ===== 权限特批：穿梭框交互 =====
window.addPMToAuth = function (name, btn) {
    const list = document.getElementById('assignedTeamList');
    // 移除“暂无”提示
    const emptyMsg = list.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    // 添加到右侧
    const div = document.createElement('div');
    div.className = 'auth-item';
    div.style.cssText = 'display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--border-color);align-items:center;background:#fff;border-radius:4px;margin-bottom:6px;box-shadow:0 1px 2px rgba(0,0,0,0.05);';
    div.innerHTML = `<span style="font-weight:500;">${name}</span><button class="btn-mini btn-outline" style="border-color:var(--danger-color);color:var(--danger-color);padding:2px 8px;" onclick="window.removePMFromAuth('${name}', this)">移除 ✖</button>`;
    list.appendChild(div);

    // 从左侧隐藏
    btn.style.display = 'none';
    showToast(`已将 ${name} 添加至特批授权名单`);
};

window.removePMFromAuth = function (name, btn) {
    // 移除自己
    btn.parentElement.remove();

    // 恢复左侧的显示
    const leftList = document.getElementById('unassignedStaffList');
    const items = leftList.querySelectorAll('.candidate-item');
    items.forEach(item => {
        if (item.dataset.name === name) {
            item.style.display = 'block';
        }
    });

    // 检查右侧是否为空
    const list = document.getElementById('assignedTeamList');
    if (list.children.length === 0) {
        list.innerHTML = `<div class="empty-msg" style="color:var(--text-muted);font-size:13px;text-align:center;padding:30px;">暂无授权追加的项目经理</div>`;
    }
};

function showAuthTransferModal(ci, defaultPM, currentAuths = []) {
    let authHTML = '';
    currentAuths.forEach(a => {
        authHTML += `<div class="auth-item" style="display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--border-color);align-items:center;background:#fff;border-radius:4px;margin-bottom:6px;box-shadow:0 1px 2px rgba(0,0,0,0.05);"><span style="font-weight:500;">${a}</span><button class="btn-mini btn-outline" style="border-color:var(--danger-color);color:var(--danger-color);padding:2px 8px;" onclick="window.removePMFromAuth('${a}', this)">移除 ✖</button></div>`;
    });

    if (!authHTML) authHTML = `<div class="empty-msg" style="color:var(--text-muted);font-size:13px;text-align:center;padding:30px;">暂无授权追加的项目经理</div>`;

    const allPMs = ['张三', '李明', '王芳', '陈伟', '赵丽', '王磊', '刘洋', '陈静'];
    let leftHTML = '';
    allPMs.forEach(pm => {
        // 如果他不仅不是默认项目经理，并且也不在已授权列表里，才在左侧显示
        const isHidden = (currentAuths.includes(pm) || defaultPM === pm) ? 'display:none;' : 'display:block;';
        const initial = pm.charAt(0);
        leftHTML += `<div class="candidate-item" data-name="${pm}" style="padding:10px 12px; cursor:pointer; border-bottom:1px solid #f1f1f1; transition:background 0.2s; ${isHidden}" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'" onclick="window.addPMToAuth('${pm}', this)">
            <span class="avatar-sm" style="display:inline-block;vertical-align:middle;margin-right:10px;background-color:var(--blue);color:#fff;">${initial}</span>
            <span style="vertical-align:middle;font-weight:500;">${pm}</span>
            <span style="float:right;color:var(--blue);font-size:12px;margin-top:6px;">➕ 添加</span>
        </div>`;
    });

    const content = `
        <div style="display:flex; gap:24px; height: 500px; padding:10px 0;">
            <!-- 左侧：全公司的可分配员工列表 -->
            <div style="flex:1; border:1px solid var(--border-color); border-radius:8px; display:flex; flex-direction:column; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="padding:14px 16px; background:#f8f9fa; border-bottom:1px solid var(--border-color); border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:15px; color:var(--text-color);">项目经理候选池</strong>
                    <span class="tag" style="background:var(--blue-light);color:var(--blue); border:none;">点击添加</span>
                </div>
                <div style="padding:12px 16px; border-bottom:1px solid #f1f1f1;">
                    <div style="position:relative;">
                        <span style="position:absolute;left:10px;top:8px;color:#999;">🔍</span>
                        <input type="text" placeholder="搜索姓名或工号..." style="width:100%; border:1px solid #ddd; border-radius:6px; padding:8px 10px 8px 30px; font-size:13px; transition:border 0.2s;" onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='#ddd'">
                    </div>
                </div>
                <div style="flex:1; overflow-y:auto; padding:8px; background:#fafbfc;" id="unassignedStaffList">
                    ${leftHTML}
                </div>
            </div>

            <!-- 右侧：当前合同的协作列表 -->
            <div style="flex:1.2; border:1px solid var(--border-color); border-radius:8px; display:flex; flex-direction:column; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="padding:14px 16px; background:#eef4ff; border-bottom:1px solid var(--border-color); border-radius:8px 8px 0 0; display:flex; align-items:center;">
                    <strong style="font-size:15px; color:var(--blue);">已授权管理该合同的项目经理</strong>
                </div>
                
                <div style="padding:16px; border-bottom:1px dashed var(--border-color); background:#fcfcfc;">
                    <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">项目经理(默认) <span title="PECMS 同步的默认负责人，无法在此处移除" style="cursor:help;">🔒</span></div> 
                    <div style="display:flex; align-items:center;">
                        <span class="avatar-sm" style="margin-right:10px; background-color:var(--danger-color); color:#fff; font-weight:bold;">默</span>
                        <strong style="font-size:15px;">${defaultPM}</strong>
                        ${defaultPM === '(未绑定)' ? `<span class="tag" style="margin-left:10px; background:#fff3f3; color:var(--danger-color); border-color:var(--danger-color);">⚠️ 前端未分配</span>` : ''}
                    </div>
                </div>

                <div style="padding:16px 16px 8px 16px; font-size:13px; font-weight:600; color:var(--text-color);">
                    额外授权的项目经理 (手工追加)
                </div>
                
                <div style="flex:1; overflow-y:auto; padding:10px 16px; background:#f4f6f8; border-radius:0 0 8px 8px;" id="assignedTeamList">
                    ${authHTML}
                </div>
            </div>
        </div>
        <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:13px; color:var(--text-secondary); display:flex; align-items:center;">
                <span style="font-size:16px; margin-right:6px;">💡</span> 左侧点击人名可直接添加授权；右侧点击 ✖ 按钮立即解除相应权限。
            </div>
        </div>
    `;

    openWideModal('【' + ci + '】 统一授权管控穿梭窗', content, `<button class="btn btn-outline" style="padding:8px 24px;" onclick="closeModal()">取消</button><button class="btn btn-primary" style="padding:8px 24px;" onclick="showToast('特批授权名单已生效！');closeModal()">确认保存授权</button>`);

    // 加大弹窗并且美化
    setTimeout(() => {
        const box = document.getElementById('modalBox');
        if (box) {
            box.style.width = '900px';
            box.style.maxWidth = '95vw';
        }
    }, 10);
}

// ===== 提醒引擎：配置规则弹窗 =====
function showAddReminderModal() {
    const content = `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="form-group" style="margin-bottom:0;">
                <label>扫描业务引擎类型 <span style="color:red">*</span></label>
                <div style="display:flex; gap:15px; margin-top:8px;">
                    <label style="display:flex;align-items:center;cursor:pointer;"><input type="radio" name="rt" checked style="margin-right:6px"> 单笔开票落后追踪</label>
                    <label style="display:flex;align-items:center;cursor:pointer;"><input type="radio" name="rt" style="margin-right:6px"> 应收账款回笼逾期</label>
                    <label style="display:flex;align-items:center;cursor:pointer;"><input type="radio" name="rt" style="margin-right:6px"> 极端低润报警网</label>
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom:0;">
                <label>规则适用靶向 <span style="color:red">*</span></label>
                <select class="form-control" style="width:100%;margin-top:6px;" onchange="document.getElementById('ciInputGroup').style.display = this.value === 'single' ? 'block' : 'none'">
                    <option value="single">定向狙击单一合同 (优先)</option>
                    <option value="all">平台全局兜底预铺 (底层防漏)</option>
                </select>
            </div>
            
            <div class="form-group" id="ciInputGroup" style="margin-bottom:0;">
                <label>绑定目标靶位 <span style="color:red">*</span></label>
                <input type="text" class="form-control" style="width:100%;margin-top:6px;" placeholder="请输入该合同的专属 CI 编号..." value="CI-2026-008">
            </div>
            
            <div style="padding:15px; background:#fef8f8; border-left:4px solid var(--danger-color); border-radius:4px; margin-top:5px;">
                <label style="margin-bottom:10px; display:block; font-weight:600; color:var(--danger-color);">引爆警报阈值阀门</label>
                <div style="display:flex; align-items:center; font-size:13px; gap:8px;">
                    只要业务指标跌破基线，且沉沦超期满 <input type="number" value="15" style="width:60px; padding:4px; border:1px solid #ccc; border-radius:4px; text-align:center;"> 天未拉升达标，即释放首发警报导弹。
                </div>
            </div>

            <div class="form-group" style="margin-bottom:0px;">
                <label>重复轰炸频率系数 <span style="color:red">*</span></label>
                <div style="margin-top:8px; display:flex; align-items:center; gap:8px;">
                    首发之后倘若没动作，每隔 <input type="number" value="3" style="width:60px; text-align:center; padding:4px; border:1px solid #ccc; border-radius:4px;"> 昼夜循环释放同等警报，不死不休，直至闭环拔网。
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom:0;">
                <label>接收人群组 <span style="color:red">*</span></label>
                <div style="margin-top:8px;">
                    <label style="margin-right:15px;"><input type="checkbox" checked disabled> 专属项目经理 (不可解绑)</label>
                    <label style="margin-right:15px;"><input type="checkbox" checked> 分管财务跟票人</label>
                    <label style="margin-right:15px;"><input type="checkbox"> 公司分管领导</label>
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom:0;">
                <label>多矩阵穿透投递路线</label>
                <div style="margin-top:8px;">
                    <label style="margin-right:15px;"><input type="checkbox" checked disabled> O&M内网悬浮红点 (母站直签)</label>
                    <label style="margin-right:15px;"><input type="checkbox" checked> <span style="font-weight:600;color:var(--blue);">外网邮件连环追击 (外挂力推)</span></label>
                    <label style="margin-right:15px;"><input type="checkbox"> 短信直刺</label>
                </div>
            </div>
        </div>
    `;
    openModal("➕ 装载新一代智能预警引擎", content, `<button class="btn btn-outline" onclick="closeModal()">撤掉配置包</button><button class="btn btn-primary" style="background:#10b981; border-color:#10b981;" onclick="showToast('新一代警报引擎正式灌入列阵，次日凌晨引爆查杀');closeModal()">保存并装车生效</button>`);
}

// ===== 工资脱敏 =====
const salaryData = { 'zhangsan': '¥800/天', 'lisi': '¥650/天', 'chenwei': '¥900/天', 'wangwu': '¥750/天' };
let salaryIdx = 0;
function toggleSalary(el) {
    // 已禁用：任何角色均无法查看明文工资
    showToast('⚠️ 工资数据不允许查看明文', 'error');
}
// 差旅报销台账 - 内联编辑后提示
function recalcTravelCost(el) {
    showToast('数值已更新为 ' + el.value + '，点击保存按钮提交');
}

// ===== 合同台账 - 详情 =====
function showContractDetail(ci) {
    openWideModal('合同详情 - ' + ci, `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>监理编号</label><input value="${ci}" readonly></div>
            <div class="modal-form-group"><label>合同名称</label><input value="${ci === 'CI-2026-001' ? '某石化换热器监造' : ci === 'CI-2026-002' ? '压力容器制造监理' : '管道安装监造项目'}" readonly></div>
            <div class="modal-form-group"><label>设备名称</label><input value="${ci === 'CI-2026-001' ? '管壳式换热器' : ci === 'CI-2026-002' ? '压力容器' : '工业管道'}" readonly></div>
            <div class="modal-form-group"><label>委托方</label><input value="${ci === 'CI-2026-001' ? '中国石化' : ci === 'CI-2026-002' ? '中国石油' : '中海油'}" readonly></div>
            <div class="modal-form-group"><label>制造方</label><input value="${ci === 'CI-2026-001' ? '东方锅炉' : ci === 'CI-2026-002' ? '哈尔滨锅炉' : '大连重工'}" readonly></div>
            <div class="modal-form-group"><label>监造金额(元)</label><input value="${ci === 'CI-2026-001' ? '580,000' : ci === 'CI-2026-002' ? '1,200,000' : '860,000'}" readonly></div>
            <div class="modal-form-group"><label>预给号时间</label><input value="2026-01-10" readonly></div>
            <div class="modal-form-group"><label>项目负责人</label><input value="${ci === 'CI-2026-001' ? '李明' : ci === 'CI-2026-002' ? '王芳' : '陈伟'}" readonly></div>
            <div class="modal-form-group"><label>合同签订时间</label><input value="2026-01-15" readonly></div>
            <div class="modal-form-group"><label>合同原件返回时间</label><input value="2026-01-25" readonly></div>
            <div class="modal-form-group"><label>合同起始日期</label><input value="2026-01-20" readonly></div>
            <div class="modal-form-group"><label>合同终止日期</label><input value="${ci === 'CI-2026-003' ? '2026-09-30' : '2026-12-31'}" readonly></div>
            <div class="modal-form-group"><label>委托方联系人</label><input value="张经理" readonly></div>
            <div class="modal-form-group"><label>合同形式</label><input value="${ci === 'CI-2026-001' ? '人工日' : ci === 'CI-2026-002' ? '总价' : '人工日计算总价'}" readonly></div>
            <div class="modal-form-group"><label>ERP录入情况</label><input value="${ci === 'CI-2026-003' ? '未录入' : '已录入'}" readonly></div>
            <div class="modal-form-group"><label>项目编号</label><input value="PRJ-00${ci.slice(-1)}" readonly></div>
            <div class="modal-form-group"><label>项目名称</label><input value="${ci === 'CI-2026-001' ? '石化换热器A项' : ci === 'CI-2026-002' ? '石油压力容器B项' : '海油管道安装C项'}" readonly></div>
        </div>
        <div class="modal-form-group"><label>合同特殊情况备注</label><textarea readonly>${ci === 'CI-2026-001' ? '中石化重点项目，需配合甲方年度审计' : ci === 'CI-2026-003' ? '合同已终止，等待取消终止审批' : '—'}</textarea></div>
        ${ci === 'CI-2026-003' ? `<div style="margin-top:12px;padding:12px;background:var(--orange-light);border-radius:8px;border:1px solid rgba(230,162,60,0.3)">
            <h4 style="font-size:13px;color:var(--orange);margin-bottom:8px">📋 取消终止申请记录</h4>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.8">
                <div><strong>发起人：</strong>陈伟 &nbsp;|&nbsp; <strong>时间：</strong>2026-02-20 14:30</div>
                <div><strong>终止原因：</strong>客户要求恢复项目执行</div>
                <div><strong>预估恢复时间：</strong>2026-03-01</div>
                <div><strong>审批状态：</strong><span class="status status-done">已通过</span></div>
            </div>
        </div>`: ''}
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
}

// ===== 合同台账 - 取消终止 =====
function showCancelTerminateDialog(ci) {
    openModal('取消终止申请 - ' + ci, `
        <div class="modal-form-group"><label>终止原因 <span style="color:var(--red)">*</span></label><textarea placeholder="请填写终止原因（必填）"></textarea></div>
        <div class="modal-form-group"><label>预估恢复时间 <span style="color:var(--red)">*</span></label><input type="date"></div>
        <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue)">💡 提交后将发起审批流程，按钮变更为"取消终止申请"，点击可查看申请内容和审批信息</div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="showToast('审批流程已发起');closeModal()">确定</button>`);
}

// ===== 项目收入 - 当月计划产值表明细 =====
function showOutputDetail(ci, amount) {
    openModal('当月计划产值计算明细 - ' + ci, `
        <div style="font-size:13px; margin-bottom:12px;">
            当前计划产值总计: <strong style="color:var(--blue);font-size:16px;">${amount}</strong> 元
        </div>
        <div class="table-wrapper" style="margin:0;"><table class="data-table">
            <thead>
                <tr><th>人员姓名</th><th>岗位</th><th>本月填报工时(天)</th><th>合同约定单价(元/天)</th><th>小计产值(元)</th></tr>
            </thead>
            <tbody>
                <tr><td>张三</td><td>高级监造工程师</td><td>15</td><td>1,200</td><td>18,000</td></tr>
                <tr><td>李四</td><td>监造工程师</td><td>12</td><td>900</td><td>10,800</td></tr>
            </tbody>
        </table></div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-muted);">
            💡 本明细数据来源于【工时记录】模块中已审批通过的当月实际投入工时，计算公式：当月工时 × 合同单价。
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);
    // 强制扩宽容器给历史弹窗
    setTimeout(() => { document.getElementById('modalBox').style.width = '1450px'; document.getElementById('modalBox').style.maxWidth = '95vw'; }, 10);
}

// ===== 项目收入 - 当月确认产值 =====
function showMonthlyOutputDialog(ci, type, plannedAmount) {
    const isOpen = type === '开口合同';
    // 依据要求，开口合同默认值为当月计划产值，总价合同默认值为0
    const confirmVal = isOpen ? (plannedAmount || 0) : 0;
    openModal('当月确认产值填报 - ' + ci, `
        <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="modal-form-group"><label>合同编号</label><input value="${ci}" readonly></div>
                <div class="modal-form-group"><label>合同类型</label><input value="${type}" readonly></div>
                <div class="modal-form-group"><label>合同金额</label><input value="${ci === 'CI-2026-001' ? '580,000' : '1,200,000'}" readonly></div>
                <div class="modal-form-group"><label>已报产值</label><input value="${ci === 'CI-2026-001' ? '310,000' : '500,000'}" readonly></div>
            </div>
        </div>
        ${isOpen ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>时间区间起始</label><input type="date" value="2026-02-01"></div>
            <div class="modal-form-group"><label>时间区间结束</label><input type="date" value="2026-02-28"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>系统计算值（当月计划产值）</label><input value="${confirmVal}" readonly style="background:var(--blue-light);color:var(--blue)"></div>
            <div class="modal-form-group"><label>当月确认产值 <span style="color:var(--red)">*</span></label><input type="number" id="confirmOutput" value="${confirmVal}" oninput="checkLowOutput(this.value, ${confirmVal})"></div>
        </div>
        <div id="lowOutputWarning" style="display:none;padding:10px;background:var(--orange-light);border-radius:6px;font-size:12px;color:var(--orange);margin-bottom:10px">
            ⚠️ 当月确认产值低于系统计算值阈值，需填写产值过低原因并上传证明材料
        </div>
        <div id="lowOutputApproval" style="display:none;">
            <div class="modal-form-group"><label>产值过低原因 <span style="color:var(--red)">*</span></label><textarea placeholder="请说明产值过低的原因（工期滞后、设备未到场等）" rows="2"></textarea></div>
            <div class="modal-form-group"><label>证明材料附件</label><input type="file" accept=".pdf,.jpg,.png,.docx" style="font-size:12px;"></div>
        </div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入填报备注信息" rows="2"></textarea></div>
        <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue)">
            💡 开口合同：确认产值 &lt; 系统计算值 × 阈值（字典配置）→ 触发<strong>产值过低审批流</strong>
        </div>` : `
        <div class="modal-form-group"><label>当月确认产值 <span style="color:var(--red)">*</span></label><input type="number" value="${confirmVal}"></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入填报备注信息" rows="2"></textarea></div>
        <div style="padding:10px;background:var(--blue-light);border-radius:6px;font-size:12px;color:var(--blue)">💡 总价合同：根据约定当月计划产值为0，无系统计算参考值，请<strong>项目经理直接手动评估并填写当月确认产值</strong>（无误差校验、且无审批流）。</div>`}
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-outline" onclick="showToast('已暂存');closeModal()">暂存</button>
       <button class="btn btn-primary" onclick="showToast('已提交');closeModal()">提交</button>`);
}

// ===== 项目收入 - 收入纠正 =====
function showIncomeCorrectionDialog(ci) {
    const is001 = ci === 'CI-2026-001';
    openModal('当月收入纠错 (财务) - ' + (ci || '未知合同'), `
        <div style="width:100%;margin:0;padding:0;">
        <div style="background:linear-gradient(135deg,#fff3e0,#ffe0b2);border-radius:8px;padding:12px 16px;margin-bottom:14px;border-left:4px solid #ff9800;">
            <div style="font-size:13px;font-weight:600;color:#e65100;margin-bottom:4px;">⚠️ 纠除规则说明</div>
            <div style="font-size:12px;color:#bf360c;line-height:1.8;">
                1. 填写纠正金额，提交后生成纠正剩余额度，<strong>直接生效无需审批</strong><br>
                2. 已报收入 = 累计开票金额 + 纠正剩余额度<br>
                3. 每次开票后系统自动抵扣纠正剩余额度，归零后纠正完成<br>
                4. <strong style="color:#2e7d32;">撤回剩余</strong>：可撤回未被抵充的金额，撤回后立即生效<br>
                5. <strong style="color:#c62828;">系统冲销</strong>：已抵充金额由系统自动检测并冲销，生成红字记录<br>
                6. 备注为选填项，可多行填写
            </div>
        </div>
        <div class="table-wrapper" style="margin:0;overflow-x:auto;"><table class="data-table" style="min-width:1500px;">
            <thead><tr>
                <th>合同编号</th><th>合同名称</th><th>合同类型</th><th>委托方</th><th>项目经理</th>
                <th>当月计划产值(元)</th>
                <th title="已报收入 = 累计开票 + 纠正剩余额度" style="text-decoration:underline dotted;cursor:help;">已报收入(元) ℹ️</th>
                <th>当月收入(元)</th>
                <th>开票总金额(元)</th><th>收款总金额(元)</th>
                <th>纠正金额(元)</th>
                <th style="background:#fff3e0;">已抵充金额(元)</th>
                <th style="background:#e8f5e9;">剩余可撤金额(元)</th>
                <th>备注（选填，可多行）</th>
                <th style="min-width:180px;">操作</th>
            </tr></thead>
            <tbody>
                ${is001 ? `
                <tr>
                    <td>CI-2026-001</td><td>某石化换热器监造</td>
                    <td><span class="tag tag-blue">开口合同</span></td>
                    <td>中国石化</td><td>李明</td>
                    <td>28,800</td><td title="构成: 历史开票(200,000) + 纠正剩余额度(30,000)" style="cursor:help;color:var(--blue);font-weight:bold;">230,000</td><td>28,800</td>
                    <td>200,000</td><td>150,000</td>
                    <td><input type="number" value="30000" style="width:100px;padding:6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="updateCorrectionSummary()"></td>
                    <td style="background:#fff3e0;font-weight:bold;color:#e65100;">12,000</td>
                    <td style="background:#e8f5e9;font-weight:bold;color:#2e7d32;">18,000</td>
                    <td><textarea rows="2" style="width:200px;padding:6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;resize:vertical;" placeholder="备注（可为空）">已部分抵充</textarea></td>
                    <td>
                        <button class="btn btn-sm" style="background:#4caf50;color:white;" onclick="handleWithdrawRemaining('CI-2026-001', 18000)" title="撤回剩余的18,000元">撤回剩余</button>
                    </td>
                </tr>` : `
                <tr>
                    <td>CI-2026-002</td><td>压力容器制造监理</td>
                    <td><span class="tag tag-green">总价合同</span></td>
                    <td>中国石油</td><td>王芳</td>
                    <td>0</td><td title="构成: 历史开票(500,000) 无纠正" style="cursor:help;">500,000</td><td>120,000</td>
                    <td>500,000</td><td>400,000</td>
                    <td><input type="number" style="width:100px;padding:6px;border:1px solid var(--border-color);border-radius:4px;text-align:center;font-size:13px;" onchange="updateCorrectionSummary()"></td>
                    <td style="background:#fff3e0;color:var(--text-muted);">0</td>
                    <td style="background:#e8f5e9;color:var(--text-muted);">0</td>
                    <td><textarea rows="2" style="width:200px;padding:6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;resize:vertical;" placeholder="备注（可为空）"></textarea></td>
                    <td style="color:var(--text-muted);font-size:12px;">暂无纠错记录</td>
                </tr>`}
            </tbody>
        </table></div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:var(--bg-body);border-radius:8px;border:1px solid var(--border-color);">
            <div style="font-size:12px;color:var(--text-muted);">
                已选合同：<strong style="color:var(--blue);">1</strong> 个 &nbsp;|&nbsp;
                操作人：<strong style="color:var(--text-primary);">当前登录用户(财务)</strong> &nbsp;|&nbsp;
                操作时间：<strong style="color:var(--text-primary);">${new Date().toLocaleString('zh-CN')}</strong>
            </div>
            <div style="font-size:14px;">本期提交纠正金额：<strong id="correctionTotal" style="color:var(--red);font-size:16px;">${is001 ? '¥30,000.00' : '¥0.00'}</strong></div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">
            💡 提交后生成纠错记录，纠正剩余额度=纠正金额，每次开票自动抵扣直至归零。可在「历史」弹窗查看。
        </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('纠错记录已提交');closeModal()">提交纠错</button>`);

    // 强制扩宽容器给纠错弹窗
    setTimeout(() => {
        const box = document.getElementById('modalBox');
        box.style.width = '1800px';
        box.style.maxWidth = '95vw';
        box.style.minHeight = '700px';
        box.style.maxHeight = '90vh';
    }, 10);
}
function updateCorrectionSummary() {
    showToast('纠正金额已更新');
}

// 撤回剩余纠错金额
function handleWithdrawRemaining(ci, amount) {
    openModal('撤回剩余纠错金额', `
        <div style="background:#e8f5e9;border-radius:8px;padding:12px;margin-bottom:16px;border-left:4px solid #4caf50;">
            <div style="font-size:13px;font-weight:600;color:#2e7d32;margin-bottom:6px;">✓ 撤回说明</div>
            <div style="font-size:12px;color:#1b5e20;line-height:1.6;">
                • 仅撤回<strong>未被抵充</strong>的纠错金额<br>
                • 撤回后该部分金额将从纠正剩余额度中扣除<br>
                • <strong>提交后立即生效，无需审批</strong>
            </div>
        </div>
        <div class="modal-form-group">
            <label>合同编号</label>
            <input type="text" value="${ci}" disabled style="background:#f5f5f5;">
        </div>
        <div class="modal-form-group">
            <label>可撤回金额(元)</label>
            <input type="text" value="${amount.toLocaleString()}" disabled style="background:#f5f5f5;color:#2e7d32;font-weight:bold;">
        </div>
        <div class="modal-form-group">
            <label>撤回原因 <span style="color:var(--red)">*</span></label>
            <textarea placeholder="请说明撤回原因" rows="3"></textarea>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('撤回成功，纠正剩余额度已更新');closeModal()">确认撤回</button>`);
}

// 申请冲销已抵充金额
function handleReverseCorrection(ci, usedAmount) {
    openModal('申请冲销纠错 (红字冲销)', `
        <div style="background:#ffebee;border-radius:8px;padding:12px;margin-bottom:16px;border-left:4px solid #f44336;">
            <div style="font-size:13px;font-weight:600;color:#c62828;margin-bottom:6px;">⚠️ 冲销规则</div>
            <div style="font-size:12px;color:#b71c1c;line-height:1.6;">
                • 已抵充金额通过<strong>红字冲销</strong>处理<br>
                • 系统将生成一笔<strong>负数纠错记录</strong>抵消原纠错<br>
                • 冲销后当月收入将相应调整<br>
                • <strong>提交后立即生效，无需审批</strong>
            </div>
        </div>
        <div class="modal-form-group">
            <label>合同编号</label>
            <input type="text" value="${ci}" disabled style="background:#f5f5f5;">
        </div>
        <div class="modal-form-group">
            <label>已抵充金额(元)</label>
            <input type="text" value="${usedAmount.toLocaleString()}" disabled style="background:#f5f5f5;color:#d32f2f;font-weight:bold;">
        </div>
        <div class="modal-form-group">
            <label>冲销金额(元)</label>
            <input type="number" value="${usedAmount}" max="${usedAmount}" disabled style="background:#ffebee;color:#d32f2f;font-weight:bold;border:2px solid #f44336;">
            <div style="font-size:11px;color:#666;margin-top:4px;">💡 默认全额冲销已抵充金额</div>
        </div>
        <div class="modal-form-group">
            <label>冲销原因 <span style="color:var(--red)">*</span></label>
            <textarea placeholder="请详细说明冲销原因" rows="4"></textarea>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn" style="background:#f44336;color:white;" onclick="showToast('冲销成功，已生成红字记录');closeModal()">确认冲销</button>`);
}

// ===== 项目收入 - 开票信息填报 =====
function showInvoiceInfoDialog(ci) {
    openModal('预计开票填报 - ' + (ci || ''), `
        <div style="background:#f0f7ff;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--blue);font-size:12px;color:#1565c0;">
            🧾 填报开票相关信息。提交后将生成历史记录，可在「历史」弹窗中查看。
        </div>
        <div class="modal-form-group"><label>计划开票时间 <span style="color:var(--red)">*</span></label><input type="date"></div>
        <div class="modal-form-group"><label>未开票原因</label><textarea placeholder="请输入未开票原因"></textarea></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入备注信息"></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('开票信息已保存');closeModal()">保存</button>`);
}
// ===== 项目收入 - 回款信息填报 =====
function showReceiptInfoDialog(ci) {
    openModal('预计回款填报 - ' + (ci || ''), `
        <div style="background:#f0fff4;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--green);font-size:12px;color:#2e7d32;">
            💰 填报回款相关信息。供管理者全面排查查看。提交后将生成历史记录，可在「历史」弹窗中查看。
        </div>
        <div class="modal-form-group"><label>计划回款时间</label><input type="date"></div>
        <div class="modal-form-group"><label>计划回款金额(元)</label><input type="number" placeholder="请输入计划回款金额"></div>
        <div class="modal-form-group"><label>最新收款时间 <span style="color:var(--red)">*</span></label><input type="date"></div>
        <div class="modal-form-group"><label>收款总金额(元) <span style="color:var(--red)">*</span></label><input type="number" placeholder="请输入累计收款总金额"></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入备注信息"></textarea></div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('回款信息已保存');closeModal()">保存</button>`);
}

// ===== 项目收入 - 历史 =====
function showHistoryDialog(ci) {
    if(!ci) ci = "CI-2026-002";
    openModal('历史记录 - ' + ci, `
        <div style="width:100%; flex:1; display:flex; flex-direction:column; min-height:0;">
        <div class="tab-bar" style="margin-bottom:12px">
            <button class="tab-btn active" onclick="switchHistTab(this,'hist-output')">当月确认产值</button>
            <button class="tab-btn" onclick="switchHistTab(this,'hist-correct')">纠正记录</button>
            <button class="tab-btn" onclick="switchHistTab(this,'hist-invoice')">开票记录查询</button>
            <button class="tab-btn" onclick="switchHistTab(this,'hist-payment')">回款历史查询</button>
            <button class="tab-btn" onclick="switchHistTab(this,'hist-report')">开票/回款管控台账</button>
        </div>
        <!-- Tab1: 当月确认产值 -->
        <div id="tab-hist-output" style="display:flex; flex:1; overflow-y:auto; flex-direction:column;">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部记录类型</option><option>系统计算</option><option>用户填报</option><option>系统补齐</option></select>
                <input type="text" placeholder="操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:90px;">
                <button class="btn btn-primary" style="padding:5px 12px">精确查询</button>
                <button class="btn btn-outline" style="padding:5px 12px">清空条件</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto; flex:1; overflow-y:auto;"><table class="data-table" style="min-width:1050px; width:100%;">
                <thead><tr>
                    <th>月份</th><th>合同类型</th>
                    <th>系统计算值(元)</th><th>确认产值(元)</th>
                    <th>差异值(元)</th><th>差异率</th>
                    <th>已报产值快照(元)</th>
                    <th>类型</th><th>操作人</th><th>操作时间</th><th>备注</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>2026-02</td><td><span class="tag tag-blue">开口合同</span></td>
                        <td>28,800</td><td><strong style="color:var(--blue);">26,500</strong></td>
                        <td><span style="color:var(--red);font-weight:600;">-2,300</span></td>
                        <td><span style="color:var(--red);">-7.99%</span></td>
                        <td>308,800</td>
                        <td><span class="tag tag-blue">用户填报</span></td>
                        <td>李明</td><td>2026-02-20 14:32:15</td>
                        <td style="font-size:11px;color:var(--text-muted);">按实际工时调整</td>
                    </tr>
                    <tr>
                        <td>2026-01</td><td><span class="tag tag-blue">开口合同</span></td>
                        <td>28,800</td><td>28,800</td>
                        <td><span style="color:var(--green);font-weight:600;">0</span></td>
                        <td><span style="color:var(--green);">0%</span></td><td>282,300</td>
                        <td><span class="tag tag-green">系统计算</span></td>
                        <td>系统</td><td>2026-01-31 23:59:59</td>
                        <td style="font-size:11px;color:var(--text-muted);">自动结算</td>
                    </tr>
                    <tr>
                        <td>2025-12</td><td><span class="tag tag-blue">开口合同</span></td>
                        <td>45,000</td><td><strong style="color:var(--blue);">45,000</strong></td>
                        <td><span style="color:var(--green);font-weight:600;">0</span></td>
                        <td><span style="color:var(--green);">0%</span></td><td>253,500</td>
                        <td><span class="tag tag-green">系统计算</span></td>
                        <td>系统</td><td>2025-12-31 23:59:59</td>
                        <td style="font-size:11px;color:var(--text-muted);">自动结算</td>
                    </tr>
                    <tr>
                        <td>2025-11</td><td><span class="tag tag-blue">开口合同</span></td>
                        <td>30,000</td><td><strong style="color:var(--blue);">35,000</strong></td>
                        <td><span style="color:var(--red);font-weight:600;">5,000</span></td>
                        <td><span style="color:var(--red);">16.67%</span></td><td>208,500</td>
                        <td><span class="tag tag-orange" style="background:#fff3e0;color:#e65100">系统补齐</span></td>
                        <td>李总</td><td>2025-11-25 10:20:00</td>
                        <td style="font-size:11px;color:var(--text-muted);">补全缺口数据</td>
                    </tr>
                </tbody>
            </table></div>
            <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:10px; font-size:12px; color:#666; gap:10px;">
                <span>共 24 条记录</span>
                <select style="border:1px solid #ddd; padding:2px 4px; border-radius:2px;"><option>10条/页</option><option>20条/页</option></select>
                <div style="display:flex; gap:4px;">
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;" disabled>&lt;</button>
                    <button style="border:1px solid var(--blue); background:var(--blue); color:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">1</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">2</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">3</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">&gt;</button>
                </div>
            </div>
            <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">💡 差异值 = 确认产值 - 系统计算值 | 差异率低于阈值触发产值过低审批 | 红色=低于计算值 绿色=无差异</div>
        </div>
        <!-- Tab2: 纠正记录 -->
        <div id="tab-hist-correct" style="display:none; flex:1; overflow-y:auto; flex-direction:column;">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="text" placeholder="纠正操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:120px;">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
                    <option value="">全部单据状态</option><option value="1">已生效</option><option value="2">已作废</option>
                </select>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <button class="btn btn-primary" style="padding:5px 12px">精准搜索</button>
                <button class="btn btn-outline" style="padding:5px 12px">重置条件</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto; flex:1; overflow-y:auto;"><table class="data-table" style="min-width:1100px; width:100%;">
                <thead><tr>
                    <th>序号</th><th>操作时间</th><th>操作类型</th><th>合同编号</th>
                    <th>纠正金额(元)</th><th>已抵充(元)</th><th>剩余(元)</th>
                    <th>备注</th><th>操作人</th><th>状态</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>1</td><td>2026-03-18 14:30:15</td>
                        <td><span class="tag" style="background:#ffebee;color:#c62828;">系统冲销</span></td>
                        <td>CI-2026-001</td>
                        <td><strong style="color:#d32f2f;">-12,000</strong></td>
                        <td>12,000</td><td>0</td>
                        <td style="font-size:11px;">红字冲销已抵充部分</td>
                        <td>系统自动</td>
                        <td><span class="status status-active">已完成</span></td>
                    </tr>
                    <tr>
                        <td>2</td><td>2026-03-18 14:25:08</td>
                        <td><span class="tag" style="background:#e8f5e9;color:#2e7d32;">撤回剩余</span></td>
                        <td>CI-2026-001</td>
                        <td><strong style="color:#2e7d32;">-18,000</strong></td>
                        <td>0</td><td>18,000</td>
                        <td style="font-size:11px;">不需要纠正了</td>
                        <td>财务李四</td>
                        <td><span class="status status-active">已完成</span></td>
                    </tr>
                    <tr>
                        <td>3</td><td>2026-03-18 10:20:33</td>
                        <td><span class="tag" style="background:#fff3e0;color:#e65100;">系统抵充</span></td>
                        <td>CI-2026-001</td>
                        <td><strong style="color:var(--orange);">-12,000</strong></td>
                        <td>12,000</td><td>18,000</td>
                        <td style="font-size:11px;">开票自动抵扣</td>
                        <td>系统自动</td>
                        <td><span class="status status-active">已完成</span></td>
                    </tr>
                    <tr>
                        <td>4</td><td>2026-03-17 17:36:42</td>
                        <td><span class="tag" style="background:#e3f2fd;color:#1976d2;">新增纠错</span></td>
                        <td>CI-2026-001</td>
                        <td><strong style="color:var(--red);">+30,000</strong></td>
                        <td>0</td><td>30,000</td>
                        <td style="font-size:11px;">收入调整</td>
                        <td>财务张三</td>
                        <td><span class="status status-active">生效中</span></td>
                    </tr>
                </tbody>
            </table></div>
            <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:10px; font-size:12px; color:#666; gap:10px;">
                <span>共 8 条记录</span>
                <select style="border:1px solid #ddd; padding:2px 4px; border-radius:2px;"><option>10条/页</option><option>20条/页</option></select>
                <div style="display:flex; gap:4px;">
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;" disabled>&lt;</button>
                    <button style="border:1px solid var(--blue); background:var(--blue); color:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">1</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;" disabled>&gt;</button>
                </div>
            </div>
        </div>
        <!-- Tab3: 开票记录查询 -->
        <div id="tab-hist-invoice" style="display:none; flex:1; overflow-y:auto; flex-direction:column;">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="text" placeholder="操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:90px;">
                <input type="text" placeholder="发票号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:120px;">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;">
                    <option value="">全部开票状态</option><option value="1">全额开票</option><option value="2">部分开票</option>
                </select>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <button class="btn btn-primary" style="padding:5px 12px">查询</button>
                <button class="btn btn-outline" style="padding:5px 12px">重置</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto;"><table class="data-table" style="min-width:800px;">
                <thead><tr>
                    <th>序号</th><th>开票时间</th><th>发票号</th><th>开票金额(元)</th>
                    <th>累计开票金额(元)</th><th>抵扣纠正额度(元)</th><th>开票状态</th><th>操作人</th><th>备注</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>2</td><td>2026-03-01</td><td>INV-2026-003</td>
                        <td>100,000</td><td>300,000</td><td>30,000</td>
                        <td><span class="status status-active">超额补开</span></td>
                        <td>系统自动</td><td>依据纠正审批单自动核算</td>
                    </tr>
                    <tr>
                        <td>1</td><td>2026-02-10</td><td>INV-2026-001</td>
                        <td>200,000</td><td>200,000</td><td>—</td>
                        <td><span class="status status-pending">部分开票</span></td>
                        <td>财务张</td><td>—</td>
                    </tr>
                </tbody>
            </table></div>
            <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:10px; font-size:12px; color:#666; gap:10px;">
                <span>共 15 条记录</span>
                <select style="border:1px solid #ddd; padding:2px 4px; border-radius:2px;"><option>10条/页</option><option>20条/页</option></select>
                <div style="display:flex; gap:4px;">
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;" disabled>&lt;</button>
                    <button style="border:1px solid var(--blue); background:var(--blue); color:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">1</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">2</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">&gt;</button>
                </div>
            </div>
        </div>
        <!-- Tab4: 回款历史查询 -->
        <div id="tab-hist-payment" style="display:none; flex:1; overflow-y:auto; flex-direction:column;">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="text" placeholder="收款操作人/财务" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:120px;">
                <input type="number" placeholder="最小金额" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:90px;">
                <span style="line-height:30px">-</span>
                <input type="number" placeholder="最大金额" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:90px;">
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <button class="btn btn-primary" style="padding:5px 12px">查询</button>
                <button class="btn btn-outline" style="padding:5px 12px">重置</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto;"><table class="data-table" style="min-width:700px;">
                <thead><tr>
                    <th>序号</th><th>收款时间</th><th>收款金额(元)</th>
                    <th>累计收款金额(元)</th><th>操作人</th><th>备注</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>2</td><td>2026-03-05</td>
                        <td>50,000</td><td>200,000</td>
                        <td>系统认领</td><td>尾款认领</td>
                    </tr>
                    <tr>
                        <td>1</td><td>2026-02-05</td>
                        <td>150,000</td><td>150,000</td>
                        <td>财务张</td><td>首付款</td>
                    </tr>
                </tbody>
            </table></div>
            <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:10px; font-size:12px; color:#666; gap:10px;">
                <span>共 32 条记录</span>
                <select style="border:1px solid #ddd; padding:2px 4px; border-radius:2px;"><option>10条/页</option><option>20条/页</option></select>
                <div style="display:flex; gap:4px;">
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;" disabled>&lt;</button>
                    <button style="border:1px solid var(--blue); background:var(--blue); color:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">1</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">2</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">3</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">4</button>
                    <button style="border:1px solid #ddd; background:#fff; padding:2px 8px; border-radius:2px; cursor:pointer;">&gt;</button>
                </div>
            </div>
        </div>
        <!-- Tab5: 计划管控与异常台账 -->
        <div id="tab-hist-report" style="display:none; padding:15px 0 0 0; height:500px; display:none; flex-direction:column;">
            <div style="display:flex; flex:1; gap: 16px; min-height:0;">
                <div style="flex:1; display:flex; flex-direction:column;">
                    <div style="margin-bottom: 12px; display:flex; flex-direction:column; gap:8px;">
                        <h4 style="font-size:14px; margin:0; color:#333;">📅 开票/回款计划管控流水</h4>
                        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                            <input type="text" placeholder="填报内容摘要" style="padding:4px 8px; border:1px solid #ddd; border-radius:4px; font-size:12px; width:120px;">
                            <input type="date" style="padding:4px 8px; border:1px solid #ddd; border-radius:4px; font-size:12px;"> <span style="font-size:12px">~</span> <input type="date" style="padding:4px 8px; border:1px solid #ddd; border-radius:4px; font-size:12px;">
                            <select style="padding:4px 8px; border-radius:4px; border:1px solid #ddd; font-size:12px;">
                                <option value="all">填报类型</option>
                                <option value="invoice">预计开票填报</option>
                                <option value="payment">预计回款填报</option>
                            </select>
                            <select style="padding:4px 8px; border-radius:4px; border:1px solid #ddd; font-size:12px;">
                                <option value="all">最新审批状态</option>
                                <option value="pending">待审批</option>
                                <option value="passed">已同意</option>
                                <option value="rejected">已驳回</option>
                                <option value="none">/</option>
                            </select>
                            <button class="btn btn-primary" style="padding:4px 12px;">查询</button>
                        </div>
                    </div>
                    <div style="overflow-y:auto; flex:1; margin-top:8px;">
                        <table class="data-table" style="width:100%; font-size:13px;">
                            <thead>
                                <tr><th>类型</th><th>摘要说明</th><th>最新审批状态</th><th>填报时间</th></tr>
                            </thead>
                            <tbody>
                                <tr onclick="window.showReportDetail('invoice', 'invoice-delay-v4', this)" style="cursor:pointer; background:#f0f7ff; transition: background 0.2s;">
                                    <td><span class="tag tag-blue">预计开票</span></td>
                                    <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="申请将开票日再次延期至2026-03-31">将开票日再次延期至2026-03-31</td>
                                    <td><span style="color:var(--orange); font-weight:600;">待审批</span></td>
                                    <td style="color:#666;font-size:12px;">03-05 14:20</td>
                                </tr>
                                <tr onclick="window.showReportDetail('invoice', 'invoice-approved-v3', this)" style="cursor:pointer; transition: background 0.2s;">
                                    <td><span class="tag tag-blue">预计开票</span></td>
                                    <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">将承诺日变更为 2026-03-15</td>
                                    <td><span style="color:var(--green); font-weight:600;">已同意</span></td>
                                    <td style="color:#666;font-size:12px;">02-28 10:15</td>
                                </tr>
                                <tr onclick="window.showReportDetail('invoice', 'invoice-rejected-v2', this)" style="cursor:pointer; transition: background 0.2s;">
                                    <td><span class="tag tag-blue">预计开票</span></td>
                                    <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">将开票日延期至 [2026-04-10]</td>
                                    <td><span style="color:var(--red); font-weight:600;">已驳回</span></td>
                                    <td style="color:#666;font-size:12px;">02-26 16:40</td>
                                </tr>
                                <tr onclick="window.showReportDetail('payment', 'payment-plan-v1', this)" style="cursor:pointer; transition: background 0.2s;">
                                    <td><span class="tag tag-green">预计回款</span></td>
                                    <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">计划回款金额 30万，时间 2026-04-30</td>
                                    <td><span style="color:#999;">/</span></td>
                                    <td style="color:#666;font-size:12px;">01-31 09:00</td>
                                </tr>
                                <tr onclick="window.showReportDetail('invoice', 'invoice-init-v1', this)" style="cursor:pointer; transition: background 0.2s;">
                                    <td><span class="tag tag-blue">预计开票</span></td>
                                    <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">首次填报承诺：2026-02-28 开票</td>
                                    <td><span style="color:#999;">/</span></td>
                                    <td style="color:#666;font-size:12px;">01-31 09:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; font-size:11px; color:#666; border-top:1px solid #eee; padding-top:8px;">
                        <span>共 18 条管控记录</span>
                        <div style="display:flex; gap:4px;">
                            <button style="border:1px solid #ddd; background:#fff; padding:2px 6px; border-radius:2px; cursor:pointer;" disabled>&lt;</button>
                            <button style="border:1px solid var(--blue); background:var(--blue); color:#fff; padding:2px 6px; border-radius:2px; cursor:pointer;">1</button>
                            <button style="border:1px solid #ddd; background:#fff; padding:2px 6px; border-radius:2px; cursor:pointer;">2</button>
                            <button style="border:1px solid #ddd; background:#fff; padding:2px 6px; border-radius:2px; cursor:pointer;">&gt;</button>
                            </div>
                        </div>
                    </div>
            </div>
            
            <div style="margin-top:12px;padding:10px 16px;background:#fff8e1;border-radius:8px;border:1px solid #ffe082;font-size:11px;color:#f57f17; display:flex; gap:10px; align-items:center; flex-shrink:0;">
                <span style="font-size:18px;">🛡️</span>
                <div>
                    <strong>业财异常追踪保护底线</strong>：为保障公司现金流预测的准确性，任何历史承诺均不可删除篡改。<br>
                    如遇客观障碍导致必须延期，<strong>点击列表后将在弹窗右侧抽屉中查看审批流程，并可继续使用【申请修偏】按钮发起异常审批单，经审批同意后系统才可更新监控日并重置警报。</strong>
                </div>
            </div>
        </div>

        </div>
    `, `<button class="btn btn-primary" onclick="closeModal()">关闭档案库</button>`);
    
    // 强制历史档案库高度锁定与内部flex联动布局
    setTimeout(() => {
        const box = document.getElementById('modalBox');
        if (box) { 
            box.style.width = '90vw'; 
            box.style.maxWidth = '1450px'; 
            box.style.height = '85vh';
            box.style.display = 'flex';
            box.style.flexDirection = 'column';
        }
        const b = document.getElementById('modalBody');
        if (b) {
            b.style.flex = '1';
            b.style.overflowY = 'auto';
            b.style.display = 'flex';
            b.style.flexDirection = 'column';
        }
    }, 10);
}

// 供 Tab5 填报历史界面的左侧主菜单点击切换右侧抽屉详情使用
window.reportDetailTemplates = {
    'invoice-delay-v4': `
        <div style="background:var(--blue); color:#fff; padding:18px 18px 16px;">
            <div style="font-size:12px; opacity:0.88;">CI-2026-001 · 开票计划审批流</div>
            <div style="font-size:24px; font-weight:700; margin-top:6px;">延期至 2026-03-31</div>
            <div style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; background:rgba(255,255,255,0.18); padding:4px 10px; border-radius:999px; font-size:12px;">待审批 · 当前停留赵总监</div>
        </div>
        <div style="padding:16px 18px 20px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
                    <div style="font-size:12px; color:#64748b;">申请人</div>
                    <div style="font-size:14px; font-weight:600; margin-top:4px;">李明</div>
                </div>
                <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:10px 12px;">
                    <div style="font-size:12px; color:#9a3412;">异常标签</div>
                    <div style="font-size:14px; font-weight:600; margin-top:4px;">甲方内部财务审批阻滞</div>
                </div>
            </div>
            <div style="font-size:13px; color:#475569; line-height:1.7; background:#f8fafc; border-radius:8px; padding:12px 14px; border:1px solid #e2e8f0;">
                客户财务系统上周升级故障，付款流程停滞，要求我方月末后再寄票，因此申请将开票日再次顺延至 2026-03-31。
            </div>
            <h4 style="font-size:13px; color:#475569; margin:18px 0 12px;">审批流程</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="border-left:3px solid #f59e0b; padding-left:12px;">
                    <div style="font-size:13px; font-weight:600; color:#111827;">赵总监审批</div>
                    <div style="font-size:12px; color:#f59e0b; margin-top:4px;">处理中 · 已停留 3 小时</div>
                    <div style="font-size:12px; color:#64748b; margin-top:6px;">接收时间：2026-03-05 14:26</div>
                </div>
                <div style="border-left:3px solid #cbd5e1; padding-left:12px;">
                    <div style="font-size:13px; font-weight:600; color:#111827;">财务负责人会签</div>
                    <div style="font-size:12px; color:#94a3b8; margin-top:4px;">待上一步通过后触发</div>
                </div>
            </div>
            <button onclick="showDelayModal('invoice')" style="margin-top:18px; width:100%; background:#fff; color:var(--blue); border:1px solid #bfdbfe; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer;">申请延期/纠偏</button>
        </div>
    `,
    'invoice-approved-v3': `
        <div style="background:var(--blue); color:#fff; padding:18px 18px 16px;">
            <div style="font-size:12px; opacity:0.88;">CI-2026-001 · 开票计划审批流</div>
            <div style="font-size:24px; font-weight:700; margin-top:6px;">承诺日变更为 2026-03-15</div>
            <div style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; background:rgba(255,255,255,0.18); padding:4px 10px; border-radius:999px; font-size:12px;">已同意 · 当前生效版本 V3</div>
        </div>
        <div style="padding:16px 18px 20px;">
            <div style="font-size:13px; color:#475569; line-height:1.7; background:#f8fafc; border-radius:8px; padding:12px 14px; border:1px solid #e2e8f0;">
                甲方财务负责人出差，本月无法完成票据流转，申请顺延两周。该申请已于 2026-02-28 11:30 审批通过并生效。
            </div>
            <h4 style="font-size:13px; color:#475569; margin:18px 0 12px;">审批流程</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="border-left:3px solid #10b981; padding-left:12px;">
                    <div style="font-size:13px; font-weight:600; color:#111827;">赵总监审批</div>
                    <div style="font-size:12px; color:#10b981; margin-top:4px;">已同意 · 2026-02-28 11:30</div>
                    <div style="font-size:12px; color:#64748b; margin-top:6px;">意见：情况属实，同意顺延至 2026-03-15。</div>
                </div>
                <div style="border-left:3px solid #10b981; padding-left:12px;">
                    <div style="font-size:13px; font-weight:600; color:#111827;">系统回写</div>
                    <div style="font-size:12px; color:#10b981; margin-top:4px;">已完成 · 2026-02-28 11:31</div>
                    <div style="font-size:12px; color:#64748b; margin-top:6px;">开票预警监控日已更新，旧承诺自动归档。</div>
                </div>
            </div>
            <button onclick="showDelayModal('invoice')" style="margin-top:18px; width:100%; background:#fff; color:var(--blue); border:1px solid #bfdbfe; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer;">申请延期/纠偏</button>
        </div>
    `,
    'invoice-rejected-v2': `
        <div style="background:#dc2626; color:#fff; padding:18px 18px 16px;">
            <div style="font-size:12px; opacity:0.88;">CI-2026-001 · 开票计划审批流</div>
            <div style="font-size:24px; font-weight:700; margin-top:6px;">延期至 2026-04-10</div>
            <div style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; background:rgba(255,255,255,0.18); padding:4px 10px; border-radius:999px; font-size:12px;">已驳回 · 作废版本 V2</div>
        </div>
        <div style="padding:16px 18px 20px;">
            <div style="font-size:13px; color:#475569; line-height:1.7; background:#fef2f2; border-radius:8px; padding:12px 14px; border:1px solid #fecaca;">
                本次延期跨月过长，被要求先去现场催办，不允许直接挂起至下月。该版本已被系统归档为驳回记录，不参与当前监控日。
            </div>
            <h4 style="font-size:13px; color:#475569; margin:18px 0 12px;">审批流程</h4>
            <div style="border-left:3px solid #ef4444; padding-left:12px;">
                <div style="font-size:13px; font-weight:600; color:#111827;">洪总审批</div>
                <div style="font-size:12px; color:#ef4444; margin-top:4px;">已驳回 · 2026-02-26 17:05</div>
                <div style="font-size:12px; color:#64748b; margin-top:6px;">意见：跨月太长，不允许直接挂起至下月，先去现场催票。</div>
            </div>
            <button onclick="showDelayModal('invoice')" style="margin-top:18px; width:100%; background:#fff; color:#dc2626; border:1px solid #fecaca; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer;">重新发起纠偏</button>
        </div>
    `,
    'payment-plan-v1': `
        <div style="background:#10b981; color:#fff; padding:18px 18px 16px;">
            <div style="font-size:12px; opacity:0.88;">CI-2026-001 · 回款计划记录</div>
            <div style="font-size:24px; font-weight:700; margin-top:6px;">300,000 元 / 2026-04-30</div>
            <div style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; background:rgba(255,255,255,0.18); padding:4px 10px; border-radius:999px; font-size:12px;">初始填报 · 暂无审批</div>
        </div>
        <div style="padding:16px 18px 20px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 12px;">
                    <div style="font-size:12px; color:#166534;">计划回款金额</div>
                    <div style="font-size:14px; font-weight:600; margin-top:4px;">300,000 元</div>
                </div>
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 12px;">
                    <div style="font-size:12px; color:#166534;">承诺最晚到账</div>
                    <div style="font-size:14px; font-weight:600; margin-top:4px;">2026-04-30</div>
                </div>
            </div>
            <div style="font-size:13px; color:#475569; line-height:1.7; background:#f8fafc; border-radius:8px; padding:12px 14px; border:1px solid #e2e8f0;">
                该条为首次计划回款填报记录，目前未触发审批流程。后续若申请延期或回款节奏异常，审批链会从该记录继续衍生。
            </div>
            <button onclick="showDelayModal('payment')" style="margin-top:18px; width:100%; background:#fff; color:#10b981; border:1px solid #bbf7d0; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer;">申请延期/纠偏</button>
        </div>
    `,
    'invoice-init-v1': `
        <div style="background:var(--blue); color:#fff; padding:18px 18px 16px;">
            <div style="font-size:12px; opacity:0.88;">CI-2026-001 · 开票计划初始记录</div>
            <div style="font-size:24px; font-weight:700; margin-top:6px;">首次承诺 2026-02-28</div>
            <div style="display:inline-flex; align-items:center; gap:6px; margin-top:8px; background:rgba(255,255,255,0.18); padding:4px 10px; border-radius:999px; font-size:12px;">初始填报 · 暂无审批</div>
        </div>
        <div style="padding:16px 18px 20px;">
            <div style="font-size:13px; color:#475569; line-height:1.7; background:#f8fafc; border-radius:8px; padding:12px 14px; border:1px solid #e2e8f0;">
                该记录是最初的开票承诺版本，后续所有延期、驳回、重新审批都以它为起点生成版本链。
            </div>
            <h4 style="font-size:13px; color:#475569; margin:18px 0 12px;">流程状态</h4>
            <div style="border-left:3px solid #94a3b8; padding-left:12px;">
                <div style="font-size:13px; font-weight:600; color:#111827;">初始建档</div>
                <div style="font-size:12px; color:#64748b; margin-top:4px;">2026-01-31 09:00 由李明填报，未触发审批。</div>
            </div>
            <button onclick="showDelayModal('invoice')" style="margin-top:18px; width:100%; background:#fff; color:var(--blue); border:1px solid #bfdbfe; padding:10px 14px; border-radius:10px; font-weight:600; cursor:pointer;">申请延期/纠偏</button>
        </div>
    `
};

window.ensureHistoryDrawer = function() {
    let drawer = document.getElementById('history-side-drawer');
    if (drawer) return drawer;
    drawer = document.createElement('div');
    drawer.id = 'history-side-drawer';
    drawer.style.cssText = 'position:fixed; width:440px; background:#fff; border:1px solid #dbe4f0; border-radius:14px; box-shadow:0 24px 60px rgba(15,23,42,0.22); overflow:hidden; z-index:260; opacity:0; transform:translateX(28px); transition:transform .24s ease, opacity .24s ease;';
    drawer.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #e5e7eb; background:#f8fafc;">
            <div>
                <div style="font-size:14px; font-weight:700; color:#0f172a;">审批流程详情</div>
                <div id="history-side-drawer-subtitle" style="font-size:12px; color:#64748b; margin-top:3px;">点击左侧记录查看对应审批链</div>
            </div>
            <button onclick="window.closeReportDetail()" style="background:none; border:none; font-size:20px; line-height:1; cursor:pointer; color:#64748b;">×</button>
        </div>
        <div id="history-side-drawer-content" style="max-height:calc(85vh - 62px); overflow:auto;"></div>
    `;
    document.getElementById('modalOverlay').appendChild(drawer);
    return drawer;
};

window.positionHistoryDrawer = function() {
    const drawer = document.getElementById('history-side-drawer');
    const modalBox = document.getElementById('modalBox');
    if (!drawer || !modalBox) return;
    const rect = modalBox.getBoundingClientRect();
    const gap = 14;
    const desiredLeft = rect.right + gap;
    const maxWidth = Math.min(440, Math.max(320, window.innerWidth - desiredLeft - 24));
    drawer.style.width = maxWidth + 'px';
    drawer.style.top = rect.top + 'px';
    drawer.style.left = Math.min(desiredLeft, window.innerWidth - maxWidth - 24) + 'px';
    drawer.style.height = rect.height + 'px';
};

window.showReportDetail = function(type, recordKey, rowElem) {
    const drawer = window.ensureHistoryDrawer();
    window.positionHistoryDrawer();
    document.getElementById('history-side-drawer-subtitle').textContent = type === 'invoice' ? '开票审批流程' : '回款审批流程';
    document.getElementById('history-side-drawer-content').innerHTML = window.reportDetailTemplates[recordKey] || '<div style="padding:16px;color:#64748b;">未找到对应详情。</div>';
    requestAnimationFrame(() => {
        drawer.style.opacity = '1';
        drawer.style.transform = 'translateX(0)';
    });

    if (rowElem) {
        const tbody = rowElem.parentElement;
        Array.from(tbody.children).forEach(tr => tr.style.background = 'transparent');
        rowElem.style.background = '#f0f7ff';
    }
};

window.closeReportDetail = function() {
    const drawer = document.getElementById('history-side-drawer');
    if (drawer) {
        drawer.style.opacity = '0';
        drawer.style.transform = 'translateX(28px)';
        setTimeout(() => {
            const liveDrawer = document.getElementById('history-side-drawer');
            if (liveDrawer && liveDrawer.style.opacity === '0') liveDrawer.remove();
        }, 240);
    }
    document.querySelectorAll('#tab-hist-report tbody tr').forEach(tr => tr.style.background = 'transparent');
};

// ===== 申请延期/纠偏审批单弹窗 =====
function showDelayModal(type) {
    const isInvoice = type === 'invoice';
    const title = isInvoice ? "申请调整【预计开票】计划" : "申请调整【预计回款】计划";
    const dateLabel = isInvoice ? "新申请开票日期" : "新申请回款日期";
    
    const content = `
        <div style="background:#fff3e0; padding:12px 16px; border-left:4px solid #ff9800; font-size:13px; color:#e65100; margin-bottom:16px; border-radius:4px;">
            ⚠️ 调整核心监控节点将直接影响后端报表与资金流调度。您正在发起的修改必须如实填报情况说明。
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
            <div class="form-group" style="background:#f5f5f5; padding:10px; border-radius:4px;">
                <label style="color:#666;">当前承诺监控截止日</label>
                <div style="font-size:18px; font-weight:600; font-family:monospace; margin-top:5px; color:#333;">2026-03-15</div>
            </div>
            
            <div class="form-group">
                <label style="color:var(--text-color); font-weight:600;">⚠️ ${dateLabel} <span style="color:red">*</span></label>
                <input type="date" class="form-control" style="width:100%; margin-top:5px; border-color:var(--blue);" value="2026-04-15">
                <div style="font-size:11px; color:var(--red); margin-top:4px;">系统自动折算：本次申请向后延期 31 天</div>
            </div>
        </div>

        <div class="form-group" style="margin-top:15px;">
            <label style="color:var(--text-color); font-weight:600;">异常归类标签 (必选) <span style="color:#aaa; font-size:11px; font-weight:normal; margin-left:8px;">[⚙️该下拉选项由数据字典动态配置加载]</span> <span style="color:red">*</span></label>
            <select class="form-control" style="width:100%; margin-top:5px;">
                <option value="">-- 请选择异常核心原因 --</option>
                <option value="1">甲方内部财务审批阻滞</option>
                <option value="2">合同/商务条款存在争议挂起</option>
                <option value="3">现场验收/移交单据缺失待补</option>
                <option value="4">我方发票开具错误需重开</option>
                <option value="5">其他客观不可抗力因素</option>
            </select>
        </div>

        <div class="form-group" style="margin-top:15px;">
            <label style="color:var(--text-color); font-weight:600;">详细情况说明及下一步化解动作 (不少于20字) <span style="color:red">*</span></label>
            <textarea class="form-control" rows="4" style="width:100%; margin-top:5px; resize:none;" placeholder="请详细描述目前的客观阻力，以及您下一步打算找谁协助、如何推进、预计何时能解决..."></textarea>
        </div>
        
        <div style="margin-top:20px; border-radius:8px; border:1px solid #e0e0e0; overflow:hidden;">
            <div style="background:#fafafa; padding:10px 15px; border-bottom:1px solid #eee; font-size:13px; font-weight:600; color:#444;">📋 流运转达节点图</div>
            <div style="padding:24px 15px; display:flex; justify-content:space-between; align-items:center;">
                <div style="text-align:center;">
                    <div style="width:30px; height:30px; border-radius:50%; background:var(--blue); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.1);">1</div>
                    <div style="font-size:12px; color:#333; font-weight:500;">发起申请</div>
                    <div style="font-size:11px; color:#999; margin-top:4px;">项目经理</div>
                </div>
                <div style="flex:1; height:2px; background:#e0e0e0; margin:0 15px; position:relative; top:-15px;"></div>
                <div style="text-align:center;">
                    <div style="width:30px; height:30px; border-radius:50%; background:#f0f0f0; border:1px solid #ccc; color:#666; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-weight:bold;">2</div>
                    <div style="font-size:12px; color:#333; font-weight:500;">业务复核</div>
                    <div style="font-size:11px; color:#999; margin-top:4px;">部门分管总监</div>
                </div>
                <div style="flex:1; height:2px; background:#e0e0e0; margin:0 15px; position:relative; top:-15px;"></div>
                <div style="text-align:center;">
                    <div style="width:30px; height:30px; border-radius:50%; background:#f0f0f0; border:1px solid #ccc; color:#666; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-weight:bold;">3</div>
                    <div style="font-size:12px; color:#333; font-weight:500;">最终核准</div>
                    <div style="font-size:11px; color:#999; margin-top:4px;">财务结算专员</div>
                </div>
            </div>
            <div style="padding:10px 15px; background:#fffcf5; font-size:12px; color:#e65100; border-top:1px dashed #eee;">
                ⚠️ 审批单在途期间，对应预警将进入“静默”状态挂起，直至审批链路结束。
            </div>
        </div>
    `;
    
    // 打开一个小号的审批单弹窗 (利用现有开窗，并调整按钮)
    openModal("🛎️ 业财预警异常纠偏报告单", content, `
        <button class="btn btn-outline" style="padding:8px 24px;" onclick="closeModal(); setTimeout(() => showHistoryDialog('CI-2026-001'), 150);">撤回申请</button>
        <button class="btn btn-primary" style="padding:8px 24px; background:var(--blue); border-color:var(--blue);" onclick="showToast('纠偏报告已打包流转给主管审批！'); closeModal(); setTimeout(() => showHistoryDialog('CI-2026-001'), 150);">正式提交流转</button>
    `);
    
    // 恢复小弹窗高度
    setTimeout(() => {
        const box = document.getElementById('modalBox');
        if (box) { 
            box.style.width = '800px'; 
            box.style.height = 'auto';
        }
    }, 10);
}
function switchHistTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    ['hist-output', 'hist-correct', 'hist-invoice', 'hist-payment', 'hist-report'].forEach(tabId => {
        const el = document.getElementById('tab-' + tabId);
        if (el) {
            if (tabId === id) {
                el.style.display = 'flex';
                el.style.flexDirection = 'column';
            } else {
                el.style.display = 'none';
            }
        }
    });
    if (id !== 'hist-report') window.closeReportDetail();
}

window.addEventListener('resize', function() {
    window.positionHistoryDrawer();
});




// ===== 项目收入 - 全局历史记录 =====
function showGlobalHistoryDialog() {
    openModal('全局历史记录查询 (领导层视图)', `
        <div style="max-width:1300px;margin:0 auto;">
        <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin-bottom:14px;border-left:4px solid #6b7280;">
            <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:4px;">📜 全局合同历史视图</div>
            <div style="font-size:12px;color:#4b5563;">
                 此视图供管理层审阅，包含所有合同的“确认产值”和“纠正记录”完整轨迹，支持多维度组合高级查询及双向排序功能。
            </div>
        </div>
        <div class="tab-bar" style="margin-bottom:12px">
            <button class="tab-btn active" onclick="switchGlobalHistTab(this,'global-hist-output')">全量确认产值记录</button>
            <button class="tab-btn" onclick="switchGlobalHistTab(this,'global-hist-correct')">全量纠正记录</button>
        </div>
        <div id="tab-global-hist-output">
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">
                <input type="text" placeholder="监理编号" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:100px;">
                <input type="text" placeholder="合同名称" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:120px;">
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <span style="line-height:30px">~</span>
                <input type="date" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>全部类型</option><option>系统计算</option><option>用户填报</option><option>系统补齐</option></select>
                <input type="text" placeholder="操作人" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:80px;">
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>金额排序:默认</option><option>从大到小</option><option>从小到大</option></select>
                <select style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px"><option>编号排序:默认</option><option>A-Z</option><option>Z-A</option></select>
                <button class="btn btn-primary" style="padding:5px 12px">查询</button>
                <button class="btn btn-success" style="padding:5px 12px">📥 批量导出</button>
            </div>
            <div class="table-wrapper" style="margin:0;overflow-x:auto;max-height:400px;overflow-y:auto;"><table class="data-table" style="min-width:1250px;">
                <thead style="position:sticky;top:0;background:var(--bg-card);z-index:1;"><tr>
                    <th>监理编号</th><th>合同名称</th><th>月份</th><th>合同类型</th>
                    <th>系统计算值</th><th>确认产值</th>
                    <th>差异值</th><th>差异率</th>
                    <th>总产值快照</th>
                    <th>类型</th><th>操作人</th><th>操作时间</th><th>备注</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>CI-2026-001</td><td>某石化换热器监造</td>
                        <td>2026-02</td>
                        <td><span class="tag tag-blue">人工日</span></td>
                        <td>28,800</td><td><strong style="color:var(--blue);">26,500</strong></td>
                        <td><span style="color:var(--red);font-weight:600;">-2,300</span></td>
                        <td><span style="color:var(--red);">-7.99%</span></td>
                        <td>308,800</td><td><span class="tag tag-blue">用户填报</span></td>
                        <td>李明</td><td>2026-02-20 14:32:15</td>
                        <td style="font-size:11px;color:var(--text-muted);">按实际工时调整</td>
                    </tr>
                    <tr>
                        <td>CI-2026-002</td><td>压力容器制造监理</td>
                        <td>2026-01</td>
                        <td><span class="tag tag-green">总价</span></td>
                        <td>120,000</td><td><strong style="color:var(--blue);">120,000</strong></td>
                        <td><span style="color:var(--green);font-weight:600;">0</span></td>
                        <td><span style="color:var(--green);">0%</span></td>
                        <td>480,000</td><td><span class="tag tag-blue">用户填报</span></td>
                        <td>王芳</td><td>2026-01-31 16:20:00</td>
                        <td style="font-size:11px;color:var(--text-muted);">本月结算</td>
                    </tr>
                </tbody>
            </table></div>
        </div>
        <div id="tab-global-hist-correct" style="display:none">
            <div style="text-align:center;padding:40px;color:var(--text-muted)">全量纠正记录列表，结构与单合同一致，但拥有跨合同对比查询与导出能力...</div>
        </div>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭全局视图</button>`);
    document.getElementById('modalBox').style.maxWidth = '1300px';
}
function switchGlobalHistTab(btn, id) {
    btn.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active')); btn.classList.add('active');
    document.getElementById('tab-global-hist-output').style.display = id === 'global-hist-output' ? 'block' : 'none';
    document.getElementById('tab-global-hist-correct').style.display = id === 'global-hist-correct' ? 'block' : 'none';
}

// ===== 执行管理 - 编辑 =====
function showExecutionEditDialog(pd) {
    openModal('编辑业务状态流 - ' + pd, `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">编辑驻厂监造的业务状态流字段（巡检无数据）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="modal-form-group"><label>大纲是否已编制审核</label><select><option>是</option><option>否</option></select></div>
            <div class="modal-form-group"><label>细则是否已编制审核</label><select><option>是</option><option>否</option></select></div>
            <div class="modal-form-group"><label>风险评估报告风险等级</label><select><option>低</option><option selected>中</option><option>高</option></select></div>
            <div class="modal-form-group"><label>依据性文件现场是否拿到</label><select><option>是</option><option>否</option></select></div>
            <div class="modal-form-group"><label>监理工程师交接申请</label><select><option>有</option><option selected>无</option></select></div>
            <div class="modal-form-group"><label>ITP是否已确认并发给委托方</label><select><option>是</option><option>否</option></select></div>
        </div>
        <div class="modal-form-group"><label>预检会是否召开并有会议纪要</label><select><option>是</option><option>否</option></select></div>
        <div class="modal-form-group"><label>备注</label><textarea placeholder="请输入"></textarea></div>
    `);
}

// ============================================================
// ===== 列字段自定义显示（通用列选择器）=====
// ============================================================

// 合同台账 列定义（idx对应<th>/<td>的下标，locked=不可隐藏）
const contractTableColumns = [
    { idx: 0, label: '#', locked: true },
    { idx: 1, label: '合同编号', locked: true },
    { idx: 2, label: '合同名称', locked: false },
    { idx: 3, label: '设备名称', locked: false },
    { idx: 4, label: '委托方', locked: false },
    { idx: 5, label: '制造方', locked: false },
    { idx: 6, label: '监造金额(元)', locked: false },
    { idx: 7, label: '预给号时间', locked: false },
    { idx: 8, label: '项目经理', locked: false },
    { idx: 9, label: '合同签订时间', locked: false },
    { idx: 10, label: '合同原件返回时间', locked: false },
    { idx: 11, label: '合同起始日期', locked: false },
    { idx: 12, label: '合同终止日期', locked: false },
    { idx: 13, label: '委托方联系人', locked: false },
    { idx: 14, label: '合同类型', locked: false },
    { idx: 15, label: '合同形式', locked: false },
    { idx: 16, label: 'ERP录入', locked: false },
    { idx: 17, label: '上级单位ERP唯一标识', locked: false },
    { idx: 18, label: '项目编号', locked: false },
    { idx: 19, label: '项目名称', locked: false },
    { idx: 20, label: '状态', locked: false },
    { idx: 21, label: '操作', locked: true },
];

/**
 * 打开/关闭列选择面板
 * @param {string} tableId  - 目标 table 的 id
                    * @param {Array}  columns  - 对应的列定义数组
                    * @param {string} btnId    - 触发按钮的 id（用于定位面板位置）
                    */
function openColPicker(tableId, columns, btnId) {
    // 已存在则关闭
    const existing = document.getElementById('__colPickerPanel');
    if (existing) { existing.remove(); return; }

    const panel = document.createElement('div');
    panel.id = '__colPickerPanel';
    panel.style.cssText = [
        'position:fixed', 'z-index:9999',
        'background:#fff',
        'border:1px solid #e4e7ed',
        'border-radius:10px',
        'box-shadow:0 8px 32px rgba(0,0,0,0.15)',
        'padding:16px 16px 12px',
        'width:300px',
        'max-height:460px',
        'overflow-y:auto',
        'animation:fadeIn 0.18s ease',
    ].join(';');

    // 定位在触发按钮下方靠右
    const btn = document.getElementById(btnId);
    if (btn) {
        const r = btn.getBoundingClientRect();
        panel.style.top = (r.bottom + 8) + 'px';
        panel.style.right = (window.innerWidth - r.right) + 'px';
    } else {
        panel.style.top = '120px'; panel.style.right = '24px';
    }

    // 读取当前各列可见状态
    const table = document.getElementById(tableId);
    function isVisible(idx) {
        if (!table) return true;
        const th = table.querySelectorAll('thead th')[idx];
        return th ? th.style.display !== 'none' : true;
    }

    let html = `
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <span style="font-size:14px;font-weight:700;color:#1e2a3a;">🗂️ 自定义显示列</span>
                        <button onclick="document.getElementById('__colPickerPanel').remove()"
                            style="background:none;border:none;font-size:18px;cursor:pointer;color:#909399;line-height:1;">×</button>
                    </div>
                    <div style="display:flex;gap:6px;margin-bottom:12px;">
                        <button onclick="colPickerSelectAll('${tableId}', ${JSON.stringify(columns.map(c => ({ idx: c.idx, locked: c.locked })))}, true)"
                            style="flex:1;padding:5px 0;font-size:12px;border:1px solid var(--blue);color:var(--blue);
            background:#ecf5ff;border-radius:5px;cursor:pointer;">✓ 全部显示</button>
                        <button onclick="colPickerSelectAll('${tableId}', ${JSON.stringify(columns.map(c => ({ idx: c.idx, locked: c.locked })))}, false)"
                            style="flex:1;padding:5px 0;font-size:12px;border:1px solid #ddd;color:#909399;
            background:#f4f4f5;border-radius:5px;cursor:pointer;">✕ 仅锁定列</button>
                        <button onclick="colPickerSelectAll('${tableId}', ${JSON.stringify(columns.map(c => ({ idx: c.idx, locked: c.locked })))}, 'reset')"
                            style="flex:1;padding:5px 0;font-size:12px;border:1px solid #ddd;color:#606266;
            background:#f4f4f5;border-radius:5px;cursor:pointer;">↺ 重置</button>
                    </div>
                    <div style="font-size:11px;color:#c0c4cc;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f0f0f0;">
                        🔒 灰色项为锁定列，不可隐藏
                    </div>
                    <div id="__colPickerList">`;

    columns.forEach(col => {
        const vis = isVisible(col.idx);
        html += `
                        <label style="display:flex;align-items:center;gap:10px;padding:6px 8px;
            border-radius:6px;cursor:${col.locked ? 'not-allowed' : 'pointer'};
            transition:background 0.15s;"
                            onmouseenter="if(!${col.locked})this.style.background='#f5f7fa'"
                            onmouseleave="this.style.background=''">
                            <input type="checkbox" id="chk_${tableId}_${col.idx}"
                                class="col-chk-${tableId}"
                                data-idx="${col.idx}"
                                ${vis ? 'checked' : ''}
                                ${col.locked ? 'disabled' : ''}
                                onchange="toggleTableCol('${tableId}', ${col.idx}, this.checked)"
                                style="width:15px;height:15px;accent-color:var(--blue);cursor:${col.locked ? 'not-allowed' : 'pointer'};">
                                <span style="font-size:13px;color:${col.locked ? '#c0c4cc' : '#303133'};flex:1;">
                                    ${col.label}
                                </span>
                                ${col.locked ? '<span style="font-size:10px;color:#c0c4cc;">🔒</span>' : ''}
                        </label>`;
    });

    html += `</div>
                    <div style="margin-top:12px;padding-top:10px;border-top:1px solid #f0f0f0;
        font-size:11px;color:#c0c4cc;text-align:center;">
                        设置即时生效，刷新页面后恢复默认
                    </div>`;

    panel.innerHTML = html;
    document.body.appendChild(panel);

    // 点击面板外关闭
    setTimeout(() => {
        document.addEventListener('click', function _close(e) {
            const p = document.getElementById('__colPickerPanel');
            if (!p) { document.removeEventListener('click', _close); return; }
            if (!p.contains(e.target) && !(btn && btn.contains(e.target))) {
                p.remove();
                document.removeEventListener('click', _close);
            }
        });
    }, 80);
}

/**
 * 切换某一列（thead + tbody + tfoot）的显示/隐藏
 */
function toggleTableCol(tableId, colIdx, visible) {
    const table = document.getElementById(tableId);
    if (!table) return;
    table.querySelectorAll('tr').forEach(row => {
        const cell = row.children[colIdx];
        if (cell) cell.style.display = visible ? '' : 'none';
    });

    // 如果是项目收入表，列切换后重新计算冻结列
    if (tableId === 'incomeTable' && typeof applyIncomeStickyColumns === 'function') {
        setTimeout(applyIncomeStickyColumns, 50);
    }
}


/**
 * 全选 / 清空 / 重置
 */
function colPickerSelectAll(tableId, colDefs, mode) {
    colDefs.forEach(col => {
        if (col.locked) return;
        const visible = (mode === true || mode === 'reset');
        toggleTableCol(tableId, col.idx, visible);
        const chk = document.getElementById(`chk_${tableId}_${col.idx}`);
        if (chk) chk.checked = visible;
    });
}

// ===== 列配置 (项目收入) =====
const incomeTableColumns = [
    { idx: 0, label: "#", locked: true },
    { idx: 1, label: "合同编号", locked: true },
    { idx: 2, label: "合同名称", locked: true },
    { idx: 3, label: "委托方", locked: false },
    { idx: 4, label: "项目经理", locked: false },
    { idx: 5, label: "合同类型", locked: false },
    { idx: 6, label: "合同金额", locked: false },
    { idx: 7, label: "总产值", locked: false },
    { idx: 8, label: "当月计划产值", locked: false },
    { idx: 9, label: "已报产值", locked: false },
    { idx: 10, label: "当月确认产值", locked: false },
    { idx: 11, label: "最新填报时间", locked: false },
    { idx: 12, label: "已报收入", locked: false },
    { idx: 13, label: "纠正剩余额度", locked: false },
    { idx: 14, label: "当月收入", locked: false },
    { idx: 15, label: "开票状态", locked: false },
    { idx: 16, label: "计划开票时间", locked: false },
    { idx: 17, label: "未开票原因", locked: false },
    { idx: 18, label: "最新开票时间", locked: false },
    { idx: 19, label: "开票总金额", locked: false },
    { idx: 20, label: "最新收款时间", locked: false },
    { idx: 21, label: "收款总金额", locked: false },
    { idx: 22, label: "备注", locked: false },
    { idx: 23, label: "当月收入最新填报时间", locked: false },
    { idx: 24, label: "操作", locked: true }
];

// ===== 项目收入表 动态列冻结 (Sticky) =====
function applyIncomeStickyColumns() {
    const table = document.getElementById('incomeTable');
    if (!table) return;

    const theadTr = table.querySelector('thead tr');
    if (!theadTr) return;
    const ths = Array.from(theadTr.children);

    // 我们要冻结：前3列 (0到2) 和 最后一列
    const leftIndices = [0, 1, 2];
    const rightIndices = [ths.length - 1];

    // 左侧冻结计算
    let currentLeft = 0;
    leftIndices.forEach((idx, i) => {
        const th = ths[idx];
        if (!th || th.style.display === 'none') return;

        const isLastVisible = i === leftIndices.length - 1; // 假定前5项都是locked所以一定可见
        th.classList.add('sticky-header');
        th.style.left = currentLeft + 'px';
        th.style.boxShadow = isLastVisible ? '2px 0 4px rgba(0,0,0,0.05)' : 'none';

        table.querySelectorAll('tbody tr').forEach(tr => {
            const td = tr.children[idx];
            if (td) {
                td.classList.add('sticky-cell');
                td.style.left = currentLeft + 'px';
                td.style.boxShadow = isLastVisible ? '2px 0 4px rgba(0,0,0,0.05)' : 'none';
            }
        });
        currentLeft += th.offsetWidth;
    });

    // 右侧冻结计算
    let currentRight = 0;
    rightIndices.forEach((idx, i) => {
        const th = ths[idx];
        if (!th || th.style.display === 'none') return;

        th.classList.add('sticky-header');
        th.style.right = currentRight + 'px';
        th.style.boxShadow = '-2px 0 4px rgba(0,0,0,0.05)';

        table.querySelectorAll('tbody tr').forEach(tr => {
            const td = tr.children[idx];
            if (td) {
                td.classList.add('sticky-cell');
                td.style.right = currentRight + 'px';
                td.style.boxShadow = '-2px 0 4px rgba(0,0,0,0.05)';
            }
        });
        currentRight += th.offsetWidth;
    });
}

// 使用 ResizeObserver 监听表格尺寸变化，以自动调整位置
let incomeTableObserver = null;
function initStickyObserver() {
    const table = document.getElementById('incomeTable');
    if (!table) return;

    if (incomeTableObserver) {
        incomeTableObserver.disconnect();
    }
    incomeTableObserver = new ResizeObserver(() => {
        requestAnimationFrame(applyIncomeStickyColumns);
    });
    incomeTableObserver.observe(table);
}

document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化以确保DOM完全加载
    setTimeout(initStickyObserver, 200);
});

// ===== 提醒引擎：配置规则弹窗 =====
// ===== 规则弹窗内容构造器 =====
function getReminderModalContent(isEdit, typeData) {
    const isCost = typeData === 'profit';
    const isPayment = typeData === 'payment';
    const isInvoice = (!isCost && !isPayment);

    // 根据模式加载不同的初始值
    const invoiceTabClass = isInvoice ? "r-tab r-tab-active" : "r-tab";
    const paymentTabClass = isPayment ? "r-tab r-tab-active" : "r-tab";
    const profitTabClass = isCost ? "r-tab r-tab-active" : "r-tab";

    return `
        <style>
            .reminder-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .r-section-title { font-weight: 600; font-size: 14px; margin-bottom: 12px; color: var(--text-color); border-bottom: 1px solid #eee; padding-bottom: 8px; }
            
            /* 分组Tab样式 */
            .r-tabs-container { display: flex; border-bottom: 2px solid #eee; margin-bottom: 15px; }
            .r-tab { padding: 10px 20px; cursor: pointer; font-size: 14px; font-weight: 500; color: #666; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
            .r-tab:hover { color: var(--blue); }
            .r-tab-active { color: var(--blue); border-bottom-color: var(--blue); }
            
            /* 假装的手写自动补全组件 */
            .r-autocomplete { position: relative; }
            .r-autocomplete input { width: 100%; }
            .r-autocomplete-list { 
                display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; 
                border: 1px solid var(--border-color); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                z-index: 100; max-height: 200px; overflow-y: auto; margin-top: 4px;
            }
            .r-autocomplete-item { padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
            .r-autocomplete-item:hover { background: #f0f7ff; }
            .r-autocomplete-item:last-child { border-bottom: none; }
        </style>
        
        <div style="display:flex; flex-direction:column; gap:10px;">
            <!-- 切换引擎类型的 Tab 层 -->
            <div class="test-tab-header" style="margin-bottom:0px;">
                <label style="font-weight:600; font-size:14px; display:block; margin-bottom:10px;">业务触发类型 <span style="color:red">*</span></label>
                <div class="r-tabs-container" id="reminderTabs">
                    <div class="${invoiceTabClass}" onclick="switchReminderType('invoice', this)">单笔开票催交</div>
                    <div class="${paymentTabClass}" onclick="switchReminderType('payment', this)">应收账款回笼</div>
                    <div class="${profitTabClass}" onclick="switchReminderType('profit', this)">全局利润预警</div>
                </div>
            </div>

            <div class="reminder-modal-grid">
                <!-- 左列：适用范围与规则 -->
                <div>
                    <div class="r-section-title">📍 适用范围界定</div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label>适用合同范围 <span style="color:red">*</span></label>
                        <select id="scopeSelect" class="form-control" style="width:100%;margin-top:6px;" onchange="document.getElementById('ciInputGroup').style.display = this.value === 'single' ? 'block' : 'none'">
                            <option value="single" ${!isCost ? 'selected' : ''}>特定单一合同</option>
                            <option value="all" ${isCost ? 'selected' : ''}>全部合同</option>
                        </select>
                    </div>
                    
                    <div class="form-group r-autocomplete" id="ciInputGroup" style="display:${isCost ? 'none' : 'block'}; margin-bottom:0;">
                        <label>绑定目标合同 <span style="color:red">*</span></label>
                        <input type="text" class="form-control" id="contractSearchInput" style="margin-top:6px;" placeholder="请输入合同编号检索 (如: CI)" value="${isEdit && !isCost ? (isPayment ? 'CI-2026-002' : 'CI-2026-001') : ''}" onfocus="showAutocomplete()" oninput="filterAutocomplete(this.value)">
                        <div class="r-autocomplete-list" id="contractOptions">
                            <div class="r-autocomplete-item" onclick="selectContract('CI-2026-001 (石化换热器监造)')">CI-2026-001 (石化换热器监造)</div>
                            <div class="r-autocomplete-item" onclick="selectContract('CI-2026-002 (压力容器制造监理)')">CI-2026-002 (压力容器制造监理)</div>
                            <div class="r-autocomplete-item" onclick="selectContract('CI-2026-003 (管廊监理标段)')">CI-2026-003 (管廊监理标段)</div>
                        </div>
                    </div>

                    <div class="r-section-title" style="margin-top: 24px;">⚙️ 核心触发阈值</div>
                    <!-- 动态变化区：超期 vs 利润率 -->
                    <div id="logicAreaInvoice" style="display: ${isInvoice ? 'block' : 'none'}; padding:15px; background:#f8fcfa; border-left:4px solid var(--blue); border-radius:4px;">
                        <div style="font-size:13px; line-height:1.6; color:#444;">
                            业务发生日起超期 <input type="number" value="15" style="width:50px; padding:2px; border:1px solid #ccc; border-radius:4px; text-align:center;"> <b>天</b> 未闭环，即触发提醒。
                        </div>
                    </div>
                    <div id="logicAreaPayment" style="display: ${isPayment ? 'block' : 'none'}; padding:15px; background:#f8fcfa; border-left:4px solid #10b981; border-radius:4px;">
                        <div style="font-size:13px; line-height:1.6; color:#444;">
                            业务发生日起超期 <input type="number" value="30" style="width:50px; padding:2px; border:1px solid #ccc; border-radius:4px; text-align:center;"> <b>天</b> 未闭环，即触发提醒。
                        </div>
                    </div>
                    <div id="logicAreaProfit" style="display: ${isCost ? 'block' : 'none'}; padding:15px; background:#fdf8f8; border-left:4px solid #8b5cf6; border-radius:4px;">
                        <div style="font-size:13px; line-height:1.6; color:#444;">
                            当系统核算净利润率 ≤ <input type="number" value="3.0" step="0.1" style="width:60px; padding:2px; border:1px solid #ccc; border-radius:4px; text-align:center;"> <b>%</b> 时，即触发红色预警。
                        </div>
                    </div>
                </div>

                <!-- 右列：推送配置 -->
                <div>
                    <div class="r-section-title">📢 推送通道与频率</div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label>循环通知频率 <span style="color:red">*</span></label>
                        <div style="margin-top:8px; display:flex; align-items:center; gap:8px; font-size:13px;">
                            <select class="form-control" style="width:120px; padding:4px;">
                                <option ${isPayment ? 'selected' : ''}>每天</option>
                                <option ${isInvoice ? 'selected' : ''}>每3天</option>
                                <option ${isCost ? 'selected' : ''}>每周</option>
                            </select>
                            循环推送，直至恢复正常。
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom:12px;">
                        <label>预警推送群组 (多选) <span style="color:red">*</span></label>
                        <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
                            <label><input type="checkbox" id="chkPM" checked ${!isCost ? 'disabled' : ''}> 项目经理</label>
                            <label><input type="checkbox" id="chkFinance" ${isPayment || isCost ? 'checked' : ''}> 财务</label>
                            <label><input type="checkbox" id="chkAdmin" ${isCost ? 'checked' : ''}> 系统管理员 / 公司领导</label>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom:0;">
                        <label>投递渠道配置</label>
                        <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
                            <label><input type="checkbox" checked disabled> 系统内信提醒 (强制开启)</label>
                            <label><input type="checkbox" checked> <span style="font-weight:600;color:var(--blue);">关联工作邮箱推送</span></label>
                            <label><input type="checkbox"> 手机工作短信推送</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div>
    `;
}

// ===== 提醒引擎：新增配置规则 =====
function showAddReminderModal() {
    const content = getReminderModalContent(false, 'invoice');
    openWideModal("✛ 新建业务提醒配置规则", content, `<button class="btn btn-outline" style="padding:8px 24px;" onclick="closeModal()">取消配置</button><button class="btn btn-primary" style="padding:8px 24px;background:#10b981; border-color:#10b981;" onclick="showToast('新规则已保存并正式投入后台验证');closeModal()">确认保存并生效</button>`);
    
    // 强制扩宽
    setTimeout(() => {
        const box = document.getElementById('modalBox');
        if (box) { box.style.width = '900px'; box.style.maxWidth = '95vw'; }
    }, 10);
}

// ===== 提醒引擎：编辑配置规则 =====
function showEditReminderModal(id, type) {
    const content = getReminderModalContent(true, type);
    openWideModal("⚙️ 编辑当前提醒配置规则", content, `<button class="btn btn-outline" style="padding:8px 24px;" onclick="closeModal()">取消修改</button><button class="btn btn-primary" style="padding:8px 24px;background:var(--blue); border-color:var(--blue);" onclick="showToast('当前规则修改成功');closeModal()">保存修改内容</button>`);
    
    // 强制扩宽
    setTimeout(() => {
        const box = document.getElementById('modalBox');
        if (box) { box.style.width = '900px'; box.style.maxWidth = '95vw'; }
    }, 10);
}

// ==========================
// 全局提醒设置弹窗交互逻辑
// ==========================
function switchReminderType(type, element) {
    // 切换选中Tab样式
    var tabs = document.querySelectorAll('.r-tab');
    tabs.forEach(t => t.classList.remove('r-tab-active'));
    if(element) element.classList.add('r-tab-active');

    // 切换下方内容
    document.getElementById('logicAreaInvoice').style.display = 'none';
    document.getElementById('logicAreaPayment').style.display = 'none';
    document.getElementById('logicAreaProfit').style.display = 'none';
    
    if(type === 'invoice') {
        document.getElementById('logicAreaInvoice').style.display = 'block';
        document.getElementById('scopeSelect').value = 'single';
        document.getElementById('ciInputGroup').style.display = 'block';
        document.getElementById('chkPM').checked = true;
        document.getElementById('chkPM').disabled = true;
    }
    if(type === 'payment') {
        document.getElementById('logicAreaPayment').style.display = 'block';
        document.getElementById('scopeSelect').value = 'single';
        document.getElementById('ciInputGroup').style.display = 'block';
        document.getElementById('chkPM').checked = true;
        document.getElementById('chkPM').disabled = true;
        document.getElementById('chkFinance').checked = true;
    }
    if(type === 'profit') {
        document.getElementById('logicAreaProfit').style.display = 'block';
        // 利润预警强制使用全局
        document.getElementById('scopeSelect').value = 'all';
        document.getElementById('ciInputGroup').style.display = 'none';
        document.getElementById('chkPM').disabled = false;
        document.getElementById('chkAdmin').checked = true;
        document.getElementById('chkFinance').checked = true;
    }
}

// 手写的JS联想框逻辑
function showAutocomplete() {
    document.getElementById('contractOptions').style.display = 'block';
}
function filterAutocomplete(val) {
    const list = document.getElementById('contractOptions');
    list.style.display = 'block';
    const items = list.getElementsByClassName('r-autocomplete-item');
    for(let i=0; i<items.length; i++) {
        const txt = items[i].innerText;
        items[i].style.display = txt.toUpperCase().indexOf(val.toUpperCase()) > -1 ? 'block' : 'none';
    }
}
function selectContract(val) {
    document.getElementById('contractSearchInput').value = val.split(' ')[0]; // 只取CI编号
    document.getElementById('contractOptions').style.display = 'none';
}

// 点击外部关闭联想框
document.addEventListener('click', function(e) {
    const input = document.getElementById('contractSearchInput');
    if(input && e.target !== input) {
        const list = document.getElementById('contractOptions');
        if(list) list.style.display = 'none';
    }
});

// ============================================================
// ===== 执行管理模块新增函数 =====
// ============================================================

// 超期天数排序
function sortByOverdueDays() {
    showToast('已按超期天数排序（演示）');
    // 实际项目中需要重新请求后端数据并排序
}

// 查看派单变更记录
function showChangeLog(pd) {
    openModal('派单变更记录 - ' + pd, `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
            显示该派单的历史变更记录（换人、改时间等）
        </div>
        <table class="data-table" style="font-size:12px">
            <thead><tr><th>变更时间</th><th>变更类型</th><th>变更内容</th><th>操作人</th></tr></thead>
            <tbody>
                <tr><td>2026-02-15</td><td>人员变更</td><td>辅助人员：李四 → 陈伟</td><td>周磊</td></tr>
                <tr><td>2026-01-25</td><td>时间调整</td><td>计划结束：2026-03-15 → 2026-02-28</td><td>李明</td></tr>
            </tbody>
        </table>
    `);
}

// 查看合同详情
function showContractDetail(ci) {
    openWideModal('合同详情 - ' + ci, `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px">
            <div><strong>监理编号：</strong>CI-4471-1</div>
            <div><strong>派遣单单号：</strong>CI-4471-1-JZRWPDQD-004</div>
            <div><strong>项目名称：</strong>五环-河南神马尼龙化工产业配套氢氮项目</div>
            <div><strong>项目编号：</strong>NJSF-JL-2022-08-004</div>
            <div><strong>监造形式：</strong>驻厂检验</div>
            <div><strong>区域经理：</strong>张伟</div>
            <div><strong>设备名称：</strong>离心压缩机</div>
            <div><strong>设备数量：</strong>3台</div>
            <div><strong>计划开始时间：</strong>2022-05-30</div>
            <div><strong>计划结束时间：</strong>2022-08-30</div>
            <div><strong>派遣人员：</strong>张三</div>
            <div><strong>辅助人员：</strong>李四, 陈伟</div>
            <div><strong>委托方：</strong>中国五环工程有限公司</div>
            <div><strong>委托方联系人：</strong>赵松伟</div>
            <div><strong>制造厂：</strong>沈鼓集团</div>
            <div><strong>制造厂联系人：</strong>王崇</div>
            <div><strong>项目地址：</strong>河南省平顶山市</div>
            <div><strong>省份：</strong>河南省</div>
            <div><strong>城市：</strong>平顶山市</div>
            <div><strong>地区：</strong>市辖区</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;font-size:13px">
            <div><strong>固定打卡/业主监督：</strong><div style="margin-top:4px;padding:8px;background:var(--bg-secondary);border-radius:4px;font-size:12px">每日8:00-17:00固定打卡，业主现场监督</div></div>
            <div><strong>简述：</strong><div style="margin-top:4px;padding:8px;background:var(--bg-secondary);border-radius:4px;font-size:12px">本项目为氢氮装置配套设备监造，需驻厂全程监督</div></div>
        </div>
        <div style="margin-top:16px;padding:12px;background:var(--bg-secondary);border-radius:4px;font-size:12px">
            <strong>备注：</strong>此处展示合同详细信息，数据来源于O&M系统内部，不跳转PECMS。
        </div>
    `);
}

// 执行管理表格列定义
const executionTableColumns = [
    { idx: 0, label: '#', locked: true },
    { idx: 1, label: '监理编号', locked: true },
    { idx: 2, label: '合同负责人', locked: true },
    { idx: 3, label: '项目编号', locked: false },
    { idx: 4, label: '项目名称', locked: false },
    { idx: 5, label: '项目总监', locked: false },
    { idx: 6, label: '派单编号', locked: false },
    { idx: 7, label: '总监代表', locked: false },
    { idx: 8, label: '总产值', locked: false },
    { idx: 9, label: '当月产值', locked: false },
    { idx: 10, label: '监造厂家', locked: false },
    { idx: 11, label: '派遣人员', locked: false },
    { idx: 12, label: '辅助人员', locked: false },
    { idx: 13, label: '监造方式', locked: false },
    { idx: 14, label: '计划开始', locked: false },
    { idx: 15, label: '计划结束', locked: false },
    { idx: 16, label: '实际开始', locked: false },
    { idx: 17, label: '实际结束', locked: false },
    { idx: 18, label: '状态', locked: false },
    { idx: 19, label: '用工(天)', locked: false },
    { idx: 20, label: '监造平台', locked: false },
    { idx: 21, label: '中石化', locked: false },
    { idx: 22, label: '设备名称', locked: false },
    { idx: 23, label: '数量', locked: false },
    { idx: 24, label: '风险等级', locked: false },
    { idx: 25, label: '技术文件', locked: false },
    { idx: 26, label: '预检会', locked: false },
    { idx: 27, label: '派单变更', locked: false },
    { idx: 28, label: '操作', locked: true },
];

// 角色权限过滤（演示）
function filterByRole(role) {
    const table = document.getElementById('executionTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        const responsiblePerson = row.cells[2]?.textContent.trim();
        if (role === 'admin') {
            row.style.display = '';
        } else {
            row.style.display = responsiblePerson === role ? '' : 'none';
        }
    });

    showToast(role === 'admin' ? '已切换到管理员视角' : `已切换到${role}视角`);
}

// ==================== 执行管理 - 方案对比功能 ====================

// 切换执行管理方案展示
function switchExecutionPlan(plan) {
    ['A', 'B', 'C'].forEach(p => {
        const planDiv = document.getElementById('executionPlan' + p);
        const tabBtn = document.getElementById('tabPlan' + p);
        if (planDiv && tabBtn) {
            if (p === plan) {
                planDiv.style.display = '';
                tabBtn.style.background = '#1976d2';
                tabBtn.style.color = '#fff';
                tabBtn.style.borderColor = '#1976d2';
            } else {
                planDiv.style.display = 'none';
                tabBtn.style.background = '';
                tabBtn.style.color = '';
                tabBtn.style.borderColor = '';
            }
        }
    });
    
    // 方案B切换时关闭派单明细
    if (plan !== 'B') {
        const detailArea = document.getElementById('dispatchDetailArea');
        if (detailArea) detailArea.style.display = 'none';
    }

    // 方案C切换时初始化浮动滚动条
    if (plan === 'C') {
        setTimeout(() => initPlanCScrollbar(), 100);
    }
}

// 方案A：展开/折叠合同
function toggleContract(contractId) {
    const icon = document.getElementById('icon-' + contractId);
    const rows = document.querySelectorAll(`tr.dispatch-row[data-contract="${contractId}"]`);
    
    if (icon && rows.length > 0) {
        const isExpanded = rows[0].style.display !== 'none';
        rows.forEach(row => {
            row.style.display = isExpanded ? 'none' : '';
        });
        icon.textContent = isExpanded ? '▶' : '▼';
    }
}

// 方案B：显示派单明细
function showDispatchDetail(contractId) {
    const detailArea = document.getElementById('dispatchDetailArea');
    const contractIdSpan = document.getElementById('currentContractId');
    const detailBody = document.getElementById('dispatchDetailBody');
    
    if (!detailArea || !contractIdSpan || !detailBody) return;
    
    contractIdSpan.textContent = contractId;
    
    // 模拟数据
    const dispatchData = {
        'CI-2026-001': [
            { id: 'PD-001-01', person: '李明', status: '执行中', light: 'red', date: '2026-02-28', days: 34, canEdit: true },
            { id: 'PD-001-02', person: '王芳', status: '结束', light: 'green', date: '2026-01-15', days: 20, canEdit: false },
            { id: 'PD-001-03', person: '李明', status: '暂停', light: 'orange', date: '2026-03-10', days: 10, canEdit: true }
        ],
        'CI-2026-002': [
            { id: 'PD-002-01', person: '王芳', status: '执行中', light: 'blue', date: '2026-04-30', days: 30, canEdit: true }
        ],
        'CI-2026-003': [
            { id: 'PD-003-01', person: '赵六', status: '已终止', light: 'gray', date: '2026-05-20', days: '/', canEdit: false },
            { id: 'PD-003-02', person: '赵六', status: '未开始', light: 'gray', date: '2026-06-15', days: '/', canEdit: true }
        ]
    };
    
    const data = dispatchData[contractId] || [];
    detailBody.innerHTML = data.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.person}</td>
            <td>${d.status}</td>
            <td><span class="status-light ${d.light}"></span></td>
            <td>${d.date}</td>
            <td>${d.days}</td>
            <td><button class="btn-mini btn-primary" onclick="showExecutionEditDialog('${d.id}')" ${d.canEdit ? '' : 'disabled'}>编辑</button></td>
        </tr>
    `).join('');
    
    detailArea.style.display = '';
}

// 方案B：关闭派单明细
function closeDispatchDetail() {
    const detailArea = document.getElementById('dispatchDetailArea');
    if (detailArea) detailArea.style.display = 'none';
}

// 显示合同详情（22字段）
function showContractDetail(ci) {
    // 合同基础信息数据源
    const cmap = {
        'CI-2026-001':{ name:'某石化换热器监造', client:'中国石化工程建设有限公司', maker:'东方锅炉有限公司', amount:'220,000', pm:'李明', region:'张经理', supervisor:'周磊', projNo:'PRJ-001', projName:'石化换热器A项', type:'开口合同', signDate:'2025-12-01', startDate:'2026-01-20', endDate:'2026-06-30' },
        'CI-2026-002':{ name:'压力容器制造监理', client:'中国五环工程有限公司', maker:'南京金湖石化压力容器厂', amount:'180,000', pm:'王芳', region:'李经理', supervisor:'陈总', projNo:'PRJ-002', projName:'压力容器B项', type:'总价合同', signDate:'2025-11-15', startDate:'2026-01-25', endDate:'2026-07-31' },
        'CI-2026-003':{ name:'锅炉制造过程监理', client:'中国能源建设集团', maker:'哈尔滨锅炉厂有限公司', amount:'350,000', pm:'赵强', region:'孙经理', supervisor:'王总', projNo:'PRJ-003', projName:'锅炉制造C项', type:'框架协议合同', signDate:'2025-10-20', startDate:'2026-02-01', endDate:'2026-10-30' },
    };
    const d = cmap[ci] || { name:'—', client:'—', maker:'—', amount:'—', pm:'—', region:'—', supervisor:'—', projNo:'—', projName:'—', type:'—', signDate:'—', startDate:'—', endDate:'—' };

    // 派单数据源（按合同编号索引）
    const pdmap = {
        'CI-2026-001': [
            { no:'PD-20260115-01', rep:'周磊', pv:'220,000', mpv:'18,400', factory:'东方锅炉', main:'张三', aux:'李四, 陈伟', form:'<span class="tag tag-blue">驻厂</span>', ps:'2026-01-20', pe:'<span class="text-danger">2026-02-28</span>', as:'2026-01-22', ae:'—', st:'<span class="status-light red" title="超期警戒"></span>', days:'34', platform:'是', sinopec:'是', device:'换热器', qty:'4', outline:'✅', rule:'✅', risk:'<span class="tag tag-orange">中</span>', doc:'✅', handover:'❌', itp:'✅', premeeting:'✅', change:'<span class="tag tag-gray" style="cursor:pointer;font-size:11px" onclick="showChangeLog(\'PD-20260115-01\')">查看变更</span>' },
            { no:'PD-20260115-02', rep:'周磊', pv:'118,800', mpv:'10,400', factory:'东方锅炉', main:'王五', aux:'赵六', form:'<span class="tag tag-cyan">巡检</span>', ps:'2026-01-25', pe:'2026-03-15', as:'2026-01-25', ae:'—', st:'<span class="status-light blue" title="进行中"></span>', days:'30', platform:'否', sinopec:'是', device:'换热器', qty:'4', outline:'✅', rule:'✅', risk:'<span class="tag tag-green">低</span>', doc:'✅', handover:'✅', itp:'✅', premeeting:'❌', change:'—' },
        ],
        'CI-2026-002': [
            { no:'PD-20260120-01', rep:'陈总', pv:'180,000', mpv:'12,000', factory:'南京金湖石化', main:'孙七', aux:'李二', form:'<span class="tag tag-blue">驻厂</span>', ps:'2026-01-25', pe:'2026-05-31', as:'2026-01-26', ae:'—', st:'<span class="status-light blue" title="进行中"></span>', days:'48', platform:'是', sinopec:'否', device:'压力容器', qty:'2', outline:'✅', rule:'✅', risk:'<span class="tag tag-red">高</span>', doc:'✅', handover:'✅', itp:'✅', premeeting:'✅', change:'—' },
            { no:'PD-20260201-05', rep:'陈总', pv:'0', mpv:'0', factory:'南京金湖石化', main:'朱九', aux:'—', form:'<span class="tag tag-cyan">巡检</span>', ps:'2026-02-01', pe:'2026-04-30', as:'—', ae:'—', st:'<span class="status-light gray" title="未开始"></span>', days:'0', platform:'否', sinopec:'否', device:'阀门', qty:'6', outline:'❌', rule:'❌', risk:'<span class="tag tag-green">低</span>', doc:'❌', handover:'❌', itp:'❌', premeeting:'❌', change:'—' },
        ],
        'CI-2026-003': [
            { no:'PD-20260201-01', rep:'王总', pv:'350,000', mpv:'28,000', factory:'哈尔滨锅炉厂', main:'刘八', aux:'黄十, 吴一', form:'<span class="tag tag-blue">驻厂</span>', ps:'2026-02-01', pe:'2026-09-30', as:'2026-02-03', ae:'—', st:'<span class="status-light blue" title="进行中"></span>', days:'44', platform:'是', sinopec:'是', device:'锅炉本体', qty:'1', outline:'✅', rule:'✅', risk:'<span class="tag tag-orange">中</span>', doc:'✅', handover:'✅', itp:'✅', premeeting:'✅', change:'<span class="tag tag-gray" style="cursor:pointer;font-size:11px">查看变更</span>' },
        ],
    };
    const pdList = pdmap[ci] || [];

    const pdRows = pdList.length > 0
        ? pdList.map((p,i) => `<tr>
            <td style="text-align:center;">${i+1}</td>
            <td style="font-weight:600;white-space:nowrap;">${p.no}</td>
            <td>${p.rep}</td>
            <td class="text-right">${p.pv}</td>
            <td class="text-right">${p.mpv}</td>
            <td>${p.factory}</td>
            <td>${p.main}</td>
            <td>${p.aux}</td>
            <td>${p.form}</td>
            <td style="white-space:nowrap;">${p.ps}</td>
            <td style="white-space:nowrap;">${p.pe}</td>
            <td style="white-space:nowrap;">${p.as}</td>
            <td style="white-space:nowrap;">${p.ae}</td>
            <td style="text-align:center;">${p.st}</td>
            <td style="text-align:center;">${p.days}</td>
            <td style="text-align:center;">${p.platform}</td>
            <td style="text-align:center;">${p.sinopec}</td>
            <td>${p.device}</td>
            <td style="text-align:center;">${p.qty}</td>
            <td style="text-align:center;">${p.outline}</td>
            <td style="text-align:center;">${p.rule}</td>
            <td style="text-align:center;">${p.risk}</td>
            <td style="text-align:center;">${p.doc}</td>
            <td style="text-align:center;">${p.handover}</td>
            <td style="text-align:center;">${p.itp}</td>
            <td style="text-align:center;">${p.premeeting}</td>
            <td>${p.change}</td>
        </tr>`).join('')
        : `<tr><td colspan="27" style="text-align:center;color:var(--text-muted);padding:20px;">暂无派单数据</td></tr>`;

    openWideModal('合同详情 - ' + ci, `
        <!-- 上半部分：合同基本信息 -->
        <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;margin-bottom:14px;border:1px solid #e2e8f0;">
            <div style="font-weight:600;color:#1e3a5f;font-size:13px;margin-bottom:12px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
                📋 合同基本信息
                <span style="margin-left:auto;font-size:11px;color:#94a3b8;font-weight:400;">数据来源：O&M系统（同步自PECMS）</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px 16px;font-size:13px;line-height:1.8;">
                <div><span style="color:#64748b;">合同编号：</span><strong>${ci}</strong></div>
                <div><span style="color:#64748b;">合同名称：</span>${d.name}</div>
                <div><span style="color:#64748b;">合同形式：</span><span class="tag tag-blue" style="font-size:11px;">${d.type}</span></div>
                <div><span style="color:#64748b;">项目编号：</span>${d.projNo}</div>
                <div><span style="color:#64748b;">委托方：</span>${d.client}</div>
                <div><span style="color:#64748b;">制造方：</span>${d.maker}</div>
                <div><span style="color:#64748b;">监造金额(元)：</span><strong style="color:#1976d2;">${d.amount}</strong></div>
                <div><span style="color:#64748b;">项目总监：</span>${d.supervisor}</div>
                <div><span style="color:#64748b;">项目经理：</span>${d.pm}</div>
                <div><span style="color:#64748b;">区域经理：</span>${d.region}</div>
                <div><span style="color:#64748b;">合同签订时间：</span>${d.signDate}</div>
                <div><span style="color:#64748b;">合同起始日期：</span>${d.startDate}</div>
                <div><span style="color:#64748b;">合同终止日期：</span>${d.endDate}</div>
            </div>
        </div>
        <!-- 下半部分：该合同下全部派单 -->
        <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
            <div style="padding:10px 16px;background:#fff;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;">
                <span style="font-weight:600;color:#1e3a5f;font-size:13px;">📋 派单列表（该合同下全部派单）</span>
                <span style="font-size:12px;color:#94a3b8;">共 <strong>${pdList.length}</strong> 条派单记录</span>
            </div>
            <div style="overflow-x:auto;">
                <table class="data-table" style="min-width:2200px;font-size:12px;">
                    <thead><tr>
                        <th style="min-width:36px;">#</th>
                        <th style="min-width:130px;">派单编号</th>
                        <th style="min-width:70px;">总监代表</th>
                        <th style="min-width:80px;">总产值</th>
                        <th style="min-width:80px;">当月产值</th>
                        <th style="min-width:90px;">制造厂</th>
                        <th style="min-width:60px;">派遣人员</th>
                        <th style="min-width:90px;">辅助人员</th>
                        <th style="min-width:60px;">监造方式</th>
                        <th style="min-width:90px;">计划开始</th>
                        <th style="min-width:90px;">计划结束</th>
                        <th style="min-width:90px;">实际开始</th>
                        <th style="min-width:90px;">实际结束</th>
                        <th style="min-width:50px;">状态</th>
                        <th style="min-width:60px;">用工(天)</th>
                        <th style="min-width:70px;">监造平台</th>
                        <th style="min-width:60px;">中石化</th>
                        <th style="min-width:80px;">设备名称</th>
                        <th style="min-width:50px;">数量</th>
                        <th style="min-width:50px;">大纲</th>
                        <th style="min-width:50px;">细则</th>
                        <th style="min-width:50px;">风险</th>
                        <th style="min-width:70px;">依据文件</th>
                        <th style="min-width:50px;">交接</th>
                        <th style="min-width:50px;">ITP</th>
                        <th style="min-width:60px;">预检会</th>
                        <th style="min-width:90px;">派单变更</th>
                    </tr></thead>
                    <tbody>${pdRows}</tbody>
                </table>
            </div>
            <div style="padding:8px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;background:#fafafa;">
                <span style="font-size:12px;color:#64748b;">共 <strong>${pdList.length}</strong> 条记录</span>
                <div style="display:flex;gap:4px;align-items:center;">
                    <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#f5f5f5;color:#999;border-radius:4px;cursor:not-allowed;" disabled>上一页</button>
                    <button style="padding:3px 10px;font-size:12px;border:1px solid #1976d2;background:#1976d2;color:#fff;border-radius:4px;">1</button>
                    <button style="padding:3px 10px;font-size:12px;border:1px solid #ddd;background:#fff;border-radius:4px;" onclick="showToast('下一页')">下一页</button>
                </div>
                <div style="font-size:12px;">前往 <input type="number" value="1" style="width:40px;padding:3px;text-align:center;border:1px solid var(--border-color);border-radius:4px;"> 页</div>
            </div>
        </div>
    `);
}

// 显示派单变更记录
function showChangeLog(pd) {
    openModal('派单变更记录 - ' + pd, `
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
            显示该派单的历史变更记录（仅显示PECMS审批通过的变更）
        </div>
        <table class="data-table" style="font-size:12px">
            <thead><tr><th>变更时间</th><th>变更类型</th><th>变更内容</th><th>操作人</th></tr></thead>
            <tbody>
                <tr><td>2026-02-15</td><td>人员变更</td><td>辅助人员：李四 → 陈伟</td><td>周磊</td></tr>
                <tr><td>2026-01-25</td><td>时间调整</td><td>计划结束：2026-03-15 → 2026-02-28</td><td>李明</td></tr>
            </tbody>
        </table>
    `);
}

// 按超期天数排序
function sortByOverdueDays() {
    showToast('已按超期天数排序（演示功能）');
}

// 切换合同展开/收起
function toggleContract(contractId) {
    const tbody = document.getElementById(contractId);
    const btn = event.target;
    if (tbody.style.display === 'none') {
        tbody.style.display = '';
        btn.textContent = '▼';
    } else {
        tbody.style.display = 'none';
        btn.textContent = '▶';
    }
}

// 初始化方案C浮动滚动条
function initPlanCScrollbar() {
    const wrapper = document.getElementById('executionPlanC');
    if (!wrapper || wrapper.style.display === 'none') {
        const scrollbar = document.getElementById('planCFloatingScrollbar');
        if (scrollbar) scrollbar.style.display = 'none';
        return;
    }

    const table = wrapper.querySelector('table');
    if (!table || table.scrollWidth <= wrapper.clientWidth) {
        const scrollbar = document.getElementById('planCFloatingScrollbar');
        if (scrollbar) scrollbar.style.display = 'none';
        return;
    }

    let scrollbar = document.getElementById('planCFloatingScrollbar');
    if (!scrollbar) {
        scrollbar = document.createElement('div');
        scrollbar.id = 'planCFloatingScrollbar';
        scrollbar.style.cssText = 'position:fixed;bottom:0;height:17px;overflow-x:auto;overflow-y:hidden;background:#f5f5f5;border-top:2px solid #1976d2;z-index:9999;';
        const inner = document.createElement('div');
        inner.id = 'planCScrollbarInner';
        inner.style.height = '1px';
        scrollbar.appendChild(inner);
        document.body.appendChild(scrollbar);

        scrollbar.addEventListener('scroll', () => {
            wrapper.scrollLeft = scrollbar.scrollLeft;
        });

        wrapper.addEventListener('scroll', () => {
            scrollbar.scrollLeft = wrapper.scrollLeft;
        });
    }

    const rect = wrapper.getBoundingClientRect();
    scrollbar.style.left = rect.left + 'px';
    scrollbar.style.width = rect.width + 'px';
    scrollbar.style.display = 'block';

    const inner = document.getElementById('planCScrollbarInner');
    inner.style.width = table.scrollWidth + 'px';
}

// 监理人员动态 - 角色切换函数
function switchPersonnelRole(role) {
    showToast(`已切换为：${role}`);
    // 实际项目中，这里应该根据角色重新请求后台数据
    // 前端演示：可以根据角色过滤显示的人员数据
}

// 监理人员动态 - 显示二级页面（人员派单列表）
function showPersonnelLevel2(personnelName) {
    document.body.insertAdjacentHTML('beforeend', personnelLevel2HTML);
    document.getElementById('personnelName').textContent = personnelName;

    // 模拟该人员的派单数据
    const dispatchData = [
        { id: 'PD-20260115-01', form: '驻厂', assistant: '李四, 陈伟', factory: '东方锅炉', supervisor: '周磊', planStart: '2026-01-20', planEnd: '2026-02-28', issueTime: '2026-01-15', status: 'red', statusText: '超期', endTime: '—', remainDays: '3天', workHours: 34 },
        { id: 'PD-20260115-02', form: '巡检', assistant: '赵六', factory: '东方锅炉', supervisor: '周磊', planStart: '2026-01-25', planEnd: '2026-03-15', issueTime: '2026-01-15', status: 'blue', statusText: '进行中', endTime: '—', remainDays: '18天', workHours: 30 }
    ];

    let html = '';
    dispatchData.forEach((item, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td>${item.id}</td>
            <td><span class="tag tag-blue">${item.form}</span></td>
            <td>${item.assistant}</td>
            <td>${item.factory}</td>
            <td>${item.supervisor}</td>
            <td>${item.planStart}</td>
            <td>${item.planEnd}</td>
            <td>${item.issueTime}</td>
            <td><span class="status-light ${item.status}" title="${item.statusText}"></span></td>
            <td>${item.endTime}</td>
            <td>${item.remainDays}</td>
            <td class="text-right">${item.workHours}</td>
            <td><button class="btn-mini btn-primary" onclick="showPersonnelLevel3('${personnelName}', '${item.id}')">查看</button></td>
        </tr>`;
    });

    document.getElementById('personnelDispatchList').innerHTML = html;
    document.getElementById('personnelDispatchCount').textContent = dispatchData.length;
}

// 监理人员动态 - 返回一级页面
function backToPersonnelLevel1() {
    const modal = document.getElementById('personnelLevel2Modal');
    if (modal) {
        modal.remove();
    }
}

// 监理人员动态 - 显示三级弹窗（工时明细）
function showPersonnelLevel3(personnelName, dispatchId) {
    document.body.insertAdjacentHTML('beforeend', personnelLevel3HTML);
    document.getElementById('level3PersonnelName').textContent = personnelName;
    document.getElementById('level3DispatchId').textContent = dispatchId;
    document.getElementById('personnelLevel3Modal').style.display = 'flex';

    // 模拟工时明细数据
    const workhourData = [
        { name: personnelName, date: '2026-03-01', startTime: '08:00', endTime: '17:00', status: '正常', statusColor: 'green', hours: '8小时' },
        { name: personnelName, date: '2026-03-02', startTime: '08:30', endTime: '17:00', status: '迟到', statusColor: 'orange', hours: '7.5小时' },
        { name: personnelName, date: '2026-03-03', startTime: '08:00', endTime: '16:30', status: '早退', statusColor: 'orange', hours: '7.5小时' },
        { name: personnelName, date: '2026-03-04', startTime: '08:00', endTime: '17:00', status: '正常', statusColor: 'green', hours: '8小时' },
        { name: personnelName, date: '2026-03-05', startTime: '—', endTime: '—', status: '缺勤', statusColor: 'red', hours: '0小时' }
    ];

    let html = '';
    workhourData.forEach((item, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td>${item.startTime}</td>
            <td>${item.endTime}</td>
            <td><span class="tag tag-${item.statusColor}">${item.status}</span></td>
            <td>${item.hours}</td>
        </tr>`;
    });

    document.getElementById('workhourDetailBody').innerHTML = html;
    renderWorkhourCalendar();
}

// 监理人员动态 - 关闭三级弹窗
function closePersonnelLevel3() {
    const modal = document.getElementById('personnelLevel3Modal');
    if (modal) {
        modal.remove();
    }
}

// 监理人员动态 - 渲染工时日历
let currentCalendarDate = new Date();
function renderWorkhourCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    document.getElementById('calendarTitle').textContent = `${year}年${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // 模拟签到数据（1-5号有签到）
    const attendanceDays = [1, 2, 3, 4, 5];

    let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        html += `<div style="text-align:center;padding:8px;font-weight:600;color:#666;">${day}</div>`;
    });

    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startDay; i++) {
        html += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        const hasAttendance = attendanceDays.includes(day);
        const bgColor = isToday ? '#e3f2fd' : (hasAttendance ? '#f0fdf4' : '#fff');
        const border = isToday ? '2px solid #1976d2' : '1px solid #e0e0e0';

        html += `<div style="text-align:center;padding:12px 8px;background:${bgColor};border:${border};border-radius:4px;cursor:pointer;position:relative;" title="${hasAttendance ? '有签到记录' : ''}">
            <div style="font-size:14px;">${day}</div>
            ${hasAttendance ? '<div style="width:6px;height:6px;background:#10b981;border-radius:50%;position:absolute;bottom:4px;left:50%;transform:translateX(-50%);"></div>' : ''}
        </div>`;
    }

    html += '</div>';
    document.getElementById('calendarGrid').innerHTML = html;
}

// 监理人员动态 - 切换日历月份
function changeCalendarMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderWorkhourCalendar();
}

// 监理人员动态 - 导出人员列表
function exportPersonnelData() {
    const fields = [
        '姓名', '性别', '民族', '政治面貌', '文化程度', '身份证号',
        '出生年月', '年龄', '入职日期', '毕业院校', '专业', '职称', '监理师证书'
    ];
    showPersonnelExportDialog(fields);
}

function showPersonnelExportDialog(fields) {
    const modal = document.createElement('div');
    modal.id = 'personnelExportModal';
    modal.className = 'modal-overlay active';

    let fieldsHtml = '';
    fields.forEach(field => {
        fieldsHtml += `<label style="display:inline-block;margin:8px 16px;"><input type="checkbox" checked onchange="updatePersonnelFieldCount()"> ${field}</label>`;
    });

    modal.innerHTML = `
        <div class="modal-content" style="width:800px;max-height:80vh;overflow-y:auto;">
            <div class="modal-header">
                <h3 style="margin:0;">📊 导出数据编排 - 监理人员动态</h3>
                <button class="modal-close" onclick="closePersonnelExportDialog()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color:#666;font-size:13px;margin-bottom:16px;">系统准备导出当前筛选条件下的记录，您可以按需勾选下方字段定制报表列。</p>
                <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <strong>字段清单牵取池</strong>
                        <div>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;" onclick="selectAllPersonnelFields()">全选全部</button>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;margin-left:8px;" onclick="clearAllPersonnelFields()">一键清空</button>
                        </div>
                    </div>
                    <div id="personnelFieldsList">${fieldsHtml}</div>
                </div>
                <div style="display:flex;gap:16px;margin-bottom:16px;">
                    <div style="flex:1;background:#e3f2fd;padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:#1976d2;">4</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">可导出记录 (行)</div>
                    </div>
                    <div style="flex:1;background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
                        <div id="personnelFieldCount" style="font-size:32px;font-weight:700;color:#16a34a;">${fields.length}</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">选中输出列 (列)</div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;justify-content:flex-end;">
                    <button class="btn btn-outline" onclick="closePersonnelExportDialog()">取消</button>
                    <button class="btn btn-success" onclick="downloadPersonnelExcel()">📥 下载 Excel</button>
                    <button class="btn btn-primary" onclick="downloadPersonnelPDF()">📥 下载 PDF</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closePersonnelExportDialog() {
    const modal = document.getElementById('personnelExportModal');
    if (modal) modal.remove();
}

function selectAllPersonnelFields() {
    document.querySelectorAll('#personnelFieldsList input[type="checkbox"]').forEach(cb => cb.checked = true);
    updatePersonnelFieldCount();
}

function clearAllPersonnelFields() {
    document.querySelectorAll('#personnelFieldsList input[type="checkbox"]').forEach(cb => cb.checked = false);
    updatePersonnelFieldCount();
}

function updatePersonnelFieldCount() {
    const count = document.querySelectorAll('#personnelFieldsList input[type="checkbox"]:checked').length;
    const el = document.getElementById('personnelFieldCount');
    if (el) el.textContent = count;
}

function downloadPersonnelExcel() {
    showToast('正在生成Excel文件...');
    closePersonnelExportDialog();
}

function downloadPersonnelPDF() {
    showToast('正在生成PDF文件...');
    closePersonnelExportDialog();
}

// 监理人员动态 - 导出派单列表
function exportDispatchData() {
    const fields = [
        '派单编号', '监造形式', '辅助人员', '制造厂', '总监代表',
        '计划开始时间', '计划结束时间', '发起时间', '派单状态',
        '监造结束时间', '剩余时间', '工时(天)'
    ];
    showDispatchExportDialog(fields);
}

function showDispatchExportDialog(fields) {
    const modal = document.createElement('div');
    modal.id = 'dispatchExportModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';

    let fieldsHtml = '';
    fields.forEach(field => {
        fieldsHtml += `<label style="display:inline-block;margin:8px 16px;"><input type="checkbox" checked> ${field}</label>`;
    });

    modal.innerHTML = `
        <div class="modal-content" style="width:800px;max-height:80vh;overflow-y:auto;">
            <div class="modal-header">
                <h3 style="margin:0;">📊 导出数据编排 - 派单列表</h3>
                <button class="modal-close" onclick="closeDispatchExportDialog()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color:#666;font-size:13px;margin-bottom:16px;">系统准备导出当前筛选条件下的记录，您可以按需勾选下方字段定制报表列。</p>
                <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <strong>字段清单牵取池</strong>
                        <div>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;" onclick="selectAllDispatchFields()">全选全部</button>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;margin-left:8px;" onclick="clearAllDispatchFields()">一键清空</button>
                        </div>
                    </div>
                    <div id="dispatchFieldsList">${fieldsHtml}</div>
                </div>
                <div style="display:flex;gap:16px;margin-bottom:16px;">
                    <div style="flex:1;background:#e3f2fd;padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:#1976d2;">2</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">可导出记录 (行)</div>
                    </div>
                    <div style="flex:1;background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:#16a34a;">${fields.length}</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">选中输出列 (列)</div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;justify-content:flex-end;">
                    <button class="btn btn-outline" onclick="closeDispatchExportDialog()">取消</button>
                    <button class="btn btn-success" onclick="downloadDispatchExcel()">📥 下载 Excel</button>
                    <button class="btn btn-primary" onclick="downloadDispatchPDF()">📥 下载 PDF</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeDispatchExportDialog() {
    const modal = document.getElementById('dispatchExportModal');
    if (modal) modal.remove();
}

function selectAllDispatchFields() {
    document.querySelectorAll('#dispatchFieldsList input[type="checkbox"]').forEach(cb => cb.checked = true);
}

function clearAllDispatchFields() {
    document.querySelectorAll('#dispatchFieldsList input[type="checkbox"]').forEach(cb => cb.checked = false);
}

function downloadDispatchExcel() {
    showToast('正在生成Excel文件...');
    closeDispatchExportDialog();
}

function downloadDispatchPDF() {
    showToast('正在生成PDF文件...');
    closeDispatchExportDialog();
}

// 监理人员动态 - 导出工时明细
function exportWorkhourData() {
    const fields = ['姓名', '日期', '上班时间', '下班时间', '签到状态', '工时'];
    showWorkhourExportDialog(fields);
}

function showWorkhourExportDialog(fields) {
    const modal = document.createElement('div');
    modal.id = 'workhourExportModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';

    let fieldsHtml = '';
    fields.forEach(field => {
        fieldsHtml += `<label style="display:inline-block;margin:8px 16px;"><input type="checkbox" checked> ${field}</label>`;
    });

    modal.innerHTML = `
        <div class="modal-content" style="width:800px;max-height:80vh;overflow-y:auto;">
            <div class="modal-header">
                <h3 style="margin:0;">📊 导出数据编排 - 工时明细</h3>
                <button class="modal-close" onclick="closeWorkhourExportDialog()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color:#666;font-size:13px;margin-bottom:16px;">系统准备导出当前筛选条件下的记录，您可以按需勾选下方字段定制报表列。</p>
                <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <strong>字段清单牵取池</strong>
                        <div>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;" onclick="selectAllWorkhourFields()">全选全部</button>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;margin-left:8px;" onclick="clearAllWorkhourFields()">一键清空</button>
                        </div>
                    </div>
                    <div id="workhourFieldsList">${fieldsHtml}</div>
                </div>
                <div style="display:flex;gap:16px;margin-bottom:16px;">
                    <div style="flex:1;background:#e3f2fd;padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:#1976d2;">5</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">可导出记录 (行)</div>
                    </div>
                    <div style="flex:1;background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:#16a34a;">${fields.length}</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">选中输出列 (列)</div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;justify-content:flex-end;">
                    <button class="btn btn-outline" onclick="closeWorkhourExportDialog()">取消</button>
                    <button class="btn btn-success" onclick="downloadWorkhourExcel()">📥 下载 Excel</button>
                    <button class="btn btn-primary" onclick="downloadWorkhourPDF()">📥 下载 PDF</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeWorkhourExportDialog() {
    const modal = document.getElementById('workhourExportModal');
    if (modal) modal.remove();
}

function selectAllWorkhourFields() {
    document.querySelectorAll('#workhourFieldsList input[type="checkbox"]').forEach(cb => cb.checked = true);
}

function clearAllWorkhourFields() {
    document.querySelectorAll('#workhourFieldsList input[type="checkbox"]').forEach(cb => cb.checked = false);
}

function downloadWorkhourExcel() {
    showToast('正在生成Excel文件...');
    closeWorkhourExportDialog();
}

function downloadWorkhourPDF() {
    showToast('正在生成PDF文件...');
    closeWorkhourExportDialog();
}

// 通用导出预览对话框
function showExportDialog(title, fields, recordCount) {
    showToast(`准备导出${title}数据，共${recordCount}条记录`);
}

// 执行管理 - 导出数据
function exportExecutionData() {
    const fields = [
        '合同编号', '合同负责人', '区域经理', '项目编号', '项目名称', '项目总监',
        '派单编号', '总监代表', '总产值', '当月产值', '制造厂', '派遣人员',
        '辅助人员', '监造方式', '计划开始', '计划结束', '实际开始', '实际结束',
        '状态', '用工(天)', '监造平台', '中石化', '设备名称', '数量',
        '大纲', '细则', '风险', '依据文件', '交接', 'ITP', '预检会', '派单变更'
    ];
    showExecutionExportDialog(fields);
}

function showExecutionExportDialog(fields) {
    const modal = document.createElement('div');
    modal.id = 'executionExportModal';
    modal.className = 'modal-overlay active';

    let fieldsHtml = '';
    fields.forEach(field => {
        fieldsHtml += `<label style="display:inline-block;margin:8px 16px;"><input type="checkbox" checked onchange="updateExecutionFieldCount()"> ${field}</label>`;
    });

    modal.innerHTML = `
        <div class="modal-content" style="width:800px;max-height:80vh;overflow-y:auto;">
            <div class="modal-header">
                <h3 style="margin:0;">📊 导出数据编排 - 执行管理</h3>
                <button class="modal-close" onclick="closeExecutionExportDialog()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color:#666;font-size:13px;margin-bottom:16px;">系统准备导出当前筛选条件下的记录，您可以按需勾选下方字段定制报表列。</p>
                <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <strong>字段清单牵取池</strong>
                        <div>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;" onclick="selectAllExecutionFields()">全选全部</button>
                            <button class="btn btn-outline" style="padding:4px 12px;font-size:12px;margin-left:8px;" onclick="clearAllExecutionFields()">一键清空</button>
                        </div>
                    </div>
                    <div id="executionFieldsList">${fieldsHtml}</div>
                </div>
                <div style="display:flex;gap:16px;margin-bottom:16px;">
                    <div style="flex:1;background:#e3f2fd;padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:32px;font-weight:700;color:#1976d2;">3</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">可导出记录 (行)</div>
                    </div>
                    <div style="flex:1;background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
                        <div id="executionFieldCount" style="font-size:32px;font-weight:700;color:#16a34a;">${fields.length}</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">选中输出列 (列)</div>
                    </div>
                </div>
                <div style="display:flex;gap:12px;justify-content:flex-end;">
                    <button class="btn btn-outline" onclick="closeExecutionExportDialog()">取消</button>
                    <button class="btn btn-success" onclick="downloadExecutionExcel()">📥 下载 Excel</button>
                    <button class="btn btn-primary" onclick="downloadExecutionPDF()">📥 下载 PDF</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeExecutionExportDialog() {
    const modal = document.getElementById('executionExportModal');
    if (modal) modal.remove();
}

function selectAllExecutionFields() {
    document.querySelectorAll('#executionFieldsList input[type="checkbox"]').forEach(cb => cb.checked = true);
    updateExecutionFieldCount();
}

function clearAllExecutionFields() {
    document.querySelectorAll('#executionFieldsList input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateExecutionFieldCount();
}

function updateExecutionFieldCount() {
    const count = document.querySelectorAll('#executionFieldsList input[type="checkbox"]:checked').length;
    const el = document.getElementById('executionFieldCount');
    if (el) el.textContent = count;
}

function downloadExecutionExcel() {
    showToast('正在生成Excel文件...');
    closeExecutionExportDialog();
}

function downloadExecutionPDF() {
    showToast('正在生成PDF文件...');
    closeExecutionExportDialog();
}

// ===== 动态成本核算 - 人员成本明细 =====
function showCostPersonnelDialog(ci) {
    openModal('人员成本明细 - ' + ci, `
        <div style="background:#f0f7ff;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid var(--blue);font-size:12px;color:#1565c0;">
            📊 显示该合同下所有人员的工时和成本明细
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:flex-end;">
            <div style="display:flex;flex-direction:column;gap:4px;">
                <label style="font-size:12px;color:#666;">姓名</label>
                <input type="text" placeholder="请输入" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:100px;">
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
                <label style="font-size:12px;color:#666;">派单编号</label>
                <input type="text" placeholder="请输入" style="padding:5px 8px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:140px;">
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
                <label style="font-size:12px;color:#666;">有效工时(天)</label>
                <div style="display:flex;align-items:center;gap:4px;">
                    <input type="number" placeholder="最小" style="padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:70px;">
                    <span style="color:#999;">~</span>
                    <input type="number" placeholder="最大" style="padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:70px;">
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
                <label style="font-size:12px;color:#666;">个人成本(元)</label>
                <div style="display:flex;align-items:center;gap:4px;">
                    <input type="number" placeholder="最小" style="padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:80px;">
                    <span style="color:#999;">~</span>
                    <input type="number" placeholder="最大" style="padding:5px 6px;border:1px solid var(--border-color);border-radius:4px;font-size:12px;width:80px;">
                </div>
            </div>
            <button class="btn btn-primary" style="padding:5px 12px;height:30px;" onclick="showToast('查询成功')">查询</button>
            <button class="btn btn-outline" style="padding:5px 12px;height:30px;" onclick="showToast('已重置')">重置</button>
        </div>
        <div class="table-wrapper" style="max-height:400px;overflow-y:auto;">
            <table class="data-table" style="font-size:12px;">
                <thead><tr>
                    <th>序号</th><th>姓名</th><th>派单编号</th><th>派单信息</th>
                    <th>有效工时(天)</th><th>日单价(元)</th><th>个人成本(元)</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>1</td><td>张三</td><td>PD-20260115-01</td>
                        <td style="font-size:11px;color:#666;">主派人员 | 驻厂监造</td>
                        <td>34</td><td>800</td><td><strong>27,200.00</strong></td>
                    </tr>
                    <tr>
                        <td>2</td><td>李四</td><td>PD-20260115-01</td>
                        <td style="font-size:11px;color:#666;">辅助人员 | 驻厂监造</td>
                        <td>34</td><td>650</td><td><strong>22,100.00</strong></td>
                    </tr>
                    <tr>
                        <td>3</td><td>陈伟</td><td>PD-20260115-01</td>
                        <td style="font-size:11px;color:#666;">辅助人员 | 驻厂监造</td>
                        <td>34</td><td>500</td><td><strong>17,000.00</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="margin-top:12px;text-align:right;font-size:13px;padding:8px;background:var(--bg-secondary);border-radius:4px;">
            合计人员成本：<strong style="color:var(--primary);font-size:15px;">¥66,300.00</strong>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);

    setTimeout(() => {
        const box = document.getElementById('modalBox');
        box.style.width = '1200px';
        box.style.maxWidth = '95vw';
    }, 10);
}

// ===== 动态成本核算 - 固定成本查看（只读） =====
function showCostFixedDialog(ci) {
    openModal('固定支出清单 - ' + ci, `
        <div style="background:#fff3e0;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid #ff9800;font-size:12px;color:#e65100;">
            📋 该合同的固定支出成本明细（合同层面，不涉及派单分摊）
        </div>
        <div style="margin-bottom:12px;">
            <select style="padding:6px 10px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;">
                <option>全部成本类型</option>
                <option>服务人员成本</option>
                <option>资料费用</option>
                <option>其他采购费用</option>
            </select>
            <button class="btn btn-primary" style="margin-left:8px;padding:6px 16px;font-size:13px;">查询</button>
        </div>
        <div class="table-wrapper" style="max-height:400px;overflow-y:auto;">
            <table class="data-table" style="font-size:12px;">
                <thead><tr>
                    <th>序号</th><th>成本类型</th><th>服务人员成本(元)</th><th>资料费用(元)</th>
                    <th>其他采购费用(元)</th><th>金额(元)</th><th>产生日期</th><th>录入人员</th>
                </tr></thead>
                <tbody>
                    <tr>
                        <td>1</td><td>服务人员成本</td><td><strong>8,000.00</strong></td><td>0.00</td>
                        <td>0.00</td><td><strong>8,000.00</strong></td>
                        <td>2026-02-15</td><td>财务张三</td>
                    </tr>
                    <tr>
                        <td>2</td><td>资料费用</td><td>0.00</td><td><strong>5,000.00</strong></td>
                        <td>0.00</td><td><strong>5,000.00</strong></td>
                        <td>2026-02-20</td><td>财务李四</td>
                    </tr>
                    <tr>
                        <td>3</td><td>其他采购费用</td><td>0.00</td><td>0.00</td>
                        <td><strong>2,000.00</strong></td><td><strong>2,000.00</strong></td>
                        <td>2026-02-25</td><td>项目经理</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="margin-top:12px;text-align:right;font-size:13px;padding:8px;background:var(--bg-secondary);border-radius:4px;">
            本合同固定支出成本合计：<strong style="color:#ff9800;font-size:15px;">¥15,000.00</strong>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">关闭</button>`);

    setTimeout(() => {
        const box = document.getElementById('modalBox');
        box.style.width = '1100px';
        box.style.maxWidth = '95vw';
    }, 10);
}

// ===== 动态成本核算 - 固定成本新增（按合同分摊） =====
function showCostFixedAddDialog() {
    openModal('固定成本填报', `
        <div style="background:#e8f5e9;border-radius:8px;padding:10px 14px;margin-bottom:14px;border-left:4px solid #4caf50;font-size:12px;color:#2e7d32;">
            ✅ 新增固定成本，按合同进行分摊
        </div>
        <div class="modal-form-group">
            <label>费用类型 <span style="color:var(--red)">*</span></label>
            <select>
                <option value="">请选择</option>
                <option value="1">服务人员成本</option>
                <option value="2">资料费用</option>
                <option value="3">其他采购费用</option>
            </select>
        </div>
        <div class="modal-form-group">
            <label>费用名称 <span style="color:var(--red)">*</span></label>
            <input type="text" placeholder="请输入费用名称">
        </div>
        <div class="modal-form-group">
            <label>总金额(元) <span style="color:var(--red)">*</span></label>
            <input type="number" id="totalAmount" placeholder="请输入总金额" oninput="updateAllocationPreview()">
        </div>
        <div class="modal-form-group">
            <label>分摊方式 <span style="color:var(--red)">*</span></label>
            <div style="display:flex;gap:12px;margin-top:8px;">
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input type="radio" name="allocationType" value="avg" onchange="switchAllocationType('avg')"> 平均分摊到所有合同
                </label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                    <input type="radio" name="allocationType" value="manual" onchange="switchAllocationType('manual')"> 手动选择合同
                </label>
            </div>
        </div>
        <div id="allocationArea" style="display:none;margin-top:16px;">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;">
                <div style="font-size:13px;font-weight:600;color:#334155;margin-bottom:10px;">分摊合同列表</div>
                <div id="contractList" style="max-height:250px;overflow-y:auto;"></div>
            </div>
        </div>
        <div class="modal-form-group">
            <label>备注</label>
            <textarea rows="3" placeholder="请输入备注信息"></textarea>
        </div>
    `, `<button class="btn btn-outline" onclick="closeModal()">取消</button>
       <button class="btn btn-primary" onclick="showToast('固定成本已提交');closeModal()">提交</button>`);

    setTimeout(() => {
        const box = document.getElementById('modalBox');
        box.style.width = '800px';
        box.style.maxWidth = '95vw';
    }, 10);
}

function switchAllocationType(type) {
    const area = document.getElementById('allocationArea');
    const list = document.getElementById('contractList');
    const contracts = [
        {id:'CI-2026-001', name:'某石化换热器监造'},
        {id:'CI-2026-002', name:'压力容器制造监理'},
        {id:'CI-2026-003', name:'锅炉制造过程监理'},
        {id:'CI-2026-004', name:'海上平台结构件监造'},
        {id:'CI-2026-005', name:'核电设备制造监理'},
        {id:'CI-2026-006', name:'风电塔筒焊接监造'}
    ];

    area.style.display = 'block';

    if(type === 'avg') {
        let html = '<table class="data-table" style="font-size:12px;"><thead><tr><th>合同编号</th><th>合同名称</th><th>分摊金额(元)</th></tr></thead><tbody>';
        const amount = parseFloat(document.getElementById('totalAmount').value) || 0;
        const avgAmount = amount > 0 ? (amount / contracts.length).toFixed(2) : '—';
        contracts.forEach(c => {
            html += `<tr><td>${c.id}</td><td>${c.name}</td><td><strong>${avgAmount}</strong></td></tr>`;
        });
        html += '</tbody></table>';
        list.innerHTML = html;
    } else {
        let html = '';
        contracts.forEach(c => {
            html += `<label style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #e2e8f0;cursor:pointer;">
                <input type="checkbox" value="${c.id}" onchange="updateAllocationPreview()">
                <span style="flex:1;font-size:12px;">${c.id} - ${c.name}</span>
            </label>`;
        });
        list.innerHTML = html;
    }
}

function updateAllocationPreview() {
    const type = document.querySelector('input[name="allocationType"]:checked')?.value;
    if(type === 'manual') {
        const checked = document.querySelectorAll('#contractList input[type="checkbox"]:checked');
        const amount = parseFloat(document.getElementById('totalAmount').value) || 0;
        const avgAmount = checked.length > 0 && amount > 0 ? (amount / checked.length).toFixed(2) : '—';
        document.querySelectorAll('#contractList label').forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            const existing = label.querySelector('.allocation-amount');
            if(existing) existing.remove();
            if(checkbox.checked) {
                label.insertAdjacentHTML('beforeend', `<span class="allocation-amount" style="color:#2e7d32;font-weight:600;font-size:12px;">¥${avgAmount}</span>`);
            }
        });
    }
}
