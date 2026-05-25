content = """// ===== COMPONENTS.JS =====
const { createApp, ref, computed, reactive, onMounted, onUnmounted, nextTick, watch } = Vue;

// ===== Helpers =====
function fmt(n) { if (!n && n !== 0) return '-'; return Number(n).toLocaleString('zh-CN'); }
function fmtW(n) { if (!n && n !== 0) return '-'; return (n / 10000).toFixed(1) + ' 万'; }
function fmtPct(n) { return (n || 0).toFixed(2) + '%'; }

const DashboardPage = {
  props: ['role', 'contracts', 'incomeData'],
  setup(props) {
    let chartRevenue = null, chartFunnel = null;
    onMounted(() => {
      nextTick(() => {
        if(document.getElementById('chart-revenue') && typeof echarts !== 'undefined') {
          chartRevenue = echarts.init(document.getElementById('chart-revenue'));
          chartRevenue.setOption({
            tooltip: { trigger: 'axis' }, legend: { data: ['收款', '支出'], bottom: 0 },
            xAxis: { type: 'category', data: ['10月','11月','12月','1月','2月','3月'] },
            yAxis: { type: 'value' },
            series: [
              { name: '收款', type: 'line', smooth: true, data: [45, 62, 38, 71, 55, 90], itemStyle: { color: '#409eff' } },
              { name: '支出', type: 'line', smooth: true, data: [38, 51, 44, 58, 67, 72], itemStyle: { color: '#f56c6c' } }
            ]
          });
        }
        if(document.getElementById('chart-profit') && typeof echarts !== 'undefined') {
          chartFunnel = echarts.init(document.getElementById('chart-profit'));
          chartFunnel.setOption({
            tooltip: { trigger: 'axis' }, xAxis: { type: 'category', data: ['CI-001','CI-002','CI-003','CI-004','CI-006'] },
            yAxis: { type: 'value' },
            series: [{ type: 'bar', barMaxWidth: 50, data: [143, 97.2, 105, 19.6, 33.8].map((v, i) => ({ value: v, itemStyle: { color: ['#409eff','#67c23a','#7c5cfc','#e6a23c','#0891b2'][i] } })) }]
          });
        }
      });
    });
    const totalContract = computed(() => props.contracts.reduce((s, c) => s + c.amount, 0));
    return { fmtW, fmtPct, totalContract };
  },
  template: `<div><div class="page-title-row"><h1>🖥️ 领导管理大屏</h1><span class="role-badge">{{ role }}</span></div>
    <div class="dash-metrics">
      <div class="dash-metric blue"><div class="dash-metric-label">合同总额</div><div class="dash-metric-value">{{ fmtW(totalContract) }}</div></div>
      <div class="dash-metric green"><div class="dash-metric-label">当年累计产值</div><div class="dash-metric-value">558 万</div></div>
      <div class="dash-metric orange"><div class="dash-metric-label">开票总额</div><div class="dash-metric-value">401 万</div></div>
    </div>
    <div class="dash-grid-2">
      <div class="chart-card"><div class="chart-card-title">趋势</div><div id="chart-revenue" class="chart-container"></div></div>
      <div class="chart-card"><div class="chart-card-title">利润</div><div id="chart-profit" class="chart-container"></div></div>
    </div>
  </div>`
};

const ContractPage = {
  props: ['role', 'data'],
  setup(props) {
    const search = reactive({ id: '', status: '' });
    const detailModal = ref(null);
    const terminateModal = ref(null);
    const filtered = computed(() => props.data.filter(r => (!search.id || r.id.includes(search.id)) && (!search.status || r.status === search.status)));
    return { search, filtered, detailModal, terminateModal, fmt, fmtW };
  },
  template: `<div>
    <div class="page-title-row"><h1>📋 合同台账</h1><span class="role-badge">{{ role }}</span></div>
    <!-- filter and table omitted for brevity, basic table retained -->
    <div class="table-card">
      <table class="data-table">
        <thead><tr><th>编号</th><th>名称</th><th>委托方</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id"><td>{{ r.id }}</td><td>{{ r.name }}</td><td>{{ r.client }}</td><td>{{ fmtW(r.amount) }}</td><td>{{ r.status }}</td>
          <td><button class="btn-mini blue" @click="detailModal=r">详情</button><button class="btn-mini red" @click="terminateModal=r">终止</button></td></tr>
        </tbody>
      </table>
    </div>
    <div class="modal-overlay" v-if="detailModal"><div class="modal modal-lg"><div class="modal-header"><h3>详情 - {{ detailModal.id }}</h3><button @click="detailModal=null">✕</button></div>
    <div class="modal-body">{{ detailModal.name }}</div></div></div>
    <div class="modal-overlay" v-if="terminateModal"><div class="modal modal-sm"><div class="modal-header"><h3>终止流程</h3><button @click="terminateModal=null">✕</button></div>
    <div class="modal-body"><textarea class="form-control" placeholder="原因"></textarea></div>
    <div class="modal-footer"><button class="btn-primary" @click="terminateModal=null">提交审批</button></div></div></div>
  </div>`
};

const IncomePage = {
  props: ['role', 'data'],
  setup(props) {
    const list = ref(props.data);
    const reportModal = ref(null);
    const correctModal = ref(null);
    return { list, reportModal, correctModal, fmtW };
  },
  template: `<div>
    <div class="page-title-row"><h1>💰 项目收入</h1><span class="role-badge">{{ role }}</span></div>
    <div class="table-card"><table class="data-table">
      <thead><tr><th>编号</th><th>总产值</th><th>当月产值</th><th>开票状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in list"><td>{{ r.id }}</td><td>{{ fmtW(r.totalOutput) }}</td><td>{{ fmtW(r.monthOutput) }}</td><td>{{ r.invoiceStatus }}</td>
        <td><button class="btn-mini blue" @click="reportModal=r">填报</button><button class="btn-mini orange" @click="correctModal=r">纠正</button></td></tr>
      </tbody>
    </table></div>
    <div class="modal-overlay" v-if="reportModal"><div class="modal modal-sm"><div class="modal-header"><h3>填报产值</h3><button @click="reportModal=null">✕</button></div>
    <div class="modal-body"><input class="form-control" placeholder="输入当月产值" /></div>
    <div class="modal-footer"><button class="btn-primary" @click="reportModal=null">保存</button></div></div></div>
    <!-- 收入纠正 -->
    <div class="modal-overlay" v-if="correctModal"><div class="modal modal-lg"><div class="modal-header"><h3>收入纠正</h3><button @click="correctModal=null">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>来源监理编号</label><select class="form-control"><option>CI-2024-001</option><option>CI-2024-002</option></select></div>
      <div class="form-group"><label>调整金额</label><input class="form-control" type="number" /></div>
    </div>
    <div class="modal-footer"><button class="btn-primary" @click="correctModal=null">提交</button></div></div></div>
  </div>`
};

const ExecutionPage = {
  props: ['role', 'data'],
  setup(props) { return { data }; },
  template: `<div><div class="page-title-row"><h1>⚙️ 执行管理</h1><span class="role-badge">{{ role }}</span></div>
  <table class="data-table"><thead><tr><th>编号</th><th>方式</th><th>计划结束</th><th>风险</th><th>大纲/细则</th></tr></thead>
  <tbody><tr v-for="r in data"><td>{{ r.id }}</td><td>{{ r.method }}</td><td>{{ r.planEnd }}</td><td>{{ r.riskLevel }}</td><td>{{ r.hasOutline?'已编':'缺失' }}/{{ r.hasDetail?'已编':'缺失' }}</td></tr></tbody></table>
  </div>`
};

const WorkhourPage = {
  props: ['role', 'data'],
  setup(props) {
    const list = ref(props.data);
    const expandId = ref(null);
    return { list, expandId, map: mockWorkhourDispatch };
  },
  template: `<div><div class="page-title-row"><h1>⏱️ 工时记录</h1><span class="role-badge">{{ role }}</span></div>
  <table class="data-table"><thead><tr><th>编号</th><th>方式</th><th>派单记录</th></tr></thead>
  <tbody>
    <template v-for="r in [{id:'CI-2024-001', name:'中石化'}]">
      <tr @click="expandId = expandId === r.id ? null : r.id"><td>{{ r.id }}</td><td>查看</td><td>{{ r.name }}</td></tr>
      <tr v-if="expandId === r.id"><td colspan="3"><table class="data-table"><tr><th>派单A</th><th>派单人员</th></tr><tr><td>100h</td><td>张小龙</td></tr></table></td></tr>
    </template>
  </tbody></table></div>`
};
"""
open("components_part1.js", "w", encoding="utf-8").write(content)