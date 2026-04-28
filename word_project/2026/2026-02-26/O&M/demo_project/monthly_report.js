// ===== monthly_report.js =====

// ============ 模拟数据 ============
const CONTRACT_DATA = [
    {ci:'CI-6088-71',name:'九江石化150万吨/年芳烃及炼油配套改造项目',owner:'李文健',client:'中国石化九江分公司',type:'总价合同',startDate:'2026-01-17',endDate:'2028-03-17',amount:432002.4,costLabor:36722.04,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6870',name:'普光气田大湾区增压工程4台压缩机组',owner:'张恒',client:'大连中石化物资装备有限公司',type:'总价合同',startDate:'2026-01-10',endDate:'2026-08-20',amount:822304.24,costLabor:493382.54,costMaterial:0,costManuf:0,profitRate:0.4},
    {ci:'CI-6871',name:'九江石化检修项目',owner:'陈真',client:'中国石化九江分公司',type:'总价合同',startDate:'2026-01-17',endDate:'2026-12-31',amount:20000,costLabor:17000,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6872',name:'海南炼化乙烯工业示范装置',owner:'蔡乾春',client:'中国石化海南炼油化工有限公司',type:'总价合同',startDate:'2026-01-22',endDate:'2027-01-15',amount:7350.4,costLabor:5145.28,costMaterial:0,costManuf:0,profitRate:0.3},
    {ci:'CI-6873',name:'海南炼化技改项目',owner:'蔡乾春',client:'中国石化海南炼油化工有限公司',type:'总价合同',startDate:'2026-01-22',endDate:'2026-12-31',amount:44100,costLabor:36162,costMaterial:0,costManuf:0,profitRate:0.18},
    {ci:'CI-6875',name:'柴油轻馏分优化利用项目（大耐泵业）',owner:'赵文强',client:'中国石化金陵分公司',type:'总价合同',startDate:'2026-01-22',endDate:'2027-02-28',amount:55818.24,costLabor:44654.59,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6876',name:'南化苯化工部苯胺焦油回用项目',owner:'吴挺',client:'中国石化南京化学工业有限公司',type:'总价合同',startDate:'2026-01-23',endDate:'2026-07-20',amount:44000,costLabor:35200,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6877',name:'南化有机区溴化锂扩容项目',owner:'吴挺',client:'中国石化南京化学工业有限公司',type:'总价合同',startDate:'2026-01-23',endDate:'2026-08-25',amount:44100,costLabor:35280,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6878',name:'中石化（天津）设备更新项目',owner:'刘富强',client:'中石化（天津）石油化工有限公司',type:'总价合同',startDate:'2026-01-23',endDate:'2026-05-13',amount:32382,costLabor:26877.06,costMaterial:0,costManuf:0,profitRate:0.17},
    {ci:'CI-6879',name:'青岛炼化电机监造项目',owner:'赵文强',client:'中国石化青岛炼油化工有限责任公司',type:'总价合同',startDate:'2026-01-24',endDate:'2026-03-22',amount:2756.4,costLabor:2205.12,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6880',name:'南化苯胺系统优化项目',owner:'吴挺',client:'中国石化南京化学工业有限公司',type:'总价合同',startDate:'2026-01-26',endDate:'2026-07-20',amount:44000,costLabor:33000,costMaterial:0,costManuf:0,profitRate:0.25},
    {ci:'CI-6881',name:'彭州输气站过滤器',owner:'于昌亮',client:'中石化彭州天然气销售有限责任公司',type:'总价合同',startDate:'2026-01-26',endDate:'2027-03-05',amount:22980,costLabor:19533,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6882',name:'普光分公司高效过滤系统',owner:'吴挺',client:'中国石化中原油田普光分公司',type:'总价合同',startDate:'2026-01-26',endDate:'2026-05-13',amount:41634,costLabor:33307.2,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6883',name:'金风绿能绿氢制50万吨绿色甲醇项目',owner:'祁新飞',client:'华陆工程科技有限责任公司',type:'总价合同',startDate:'2026-01-26',endDate:'2026-05-13',amount:120000,costLabor:92400,costMaterial:0,costManuf:0,profitRate:0.23},
    {ci:'CI-6884',name:'海南PBST连续聚合项目',owner:'蔡乾春',client:'中国石化海南炼油化工有限公司',type:'总价合同',startDate:'2026-01-29',endDate:'2026-10-21',amount:2774.4,costLabor:1942.08,costMaterial:0,costManuf:0,profitRate:0.3},
    {ci:'CI-6885',name:'海南炼化磁力泵测绘改造项目',owner:'蔡乾春',client:'中国石化海南炼油化工有限公司',type:'总价合同',startDate:'2026-01-29',endDate:'2027-03-06',amount:44100,costLabor:35280,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6886',name:'海南炼化乙苯脱氢改造',owner:'蔡乾春',client:'中国石化海南炼油化工有限公司',type:'总价合同',startDate:'2026-01-29',endDate:'2027-03-06',amount:44100,costLabor:35280,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-6887',name:'石家庄炼化110/220KVGIS',owner:'陈真',client:'中国石化物资装备部',type:'总价合同',startDate:'2026-01-29',endDate:'2027-01-27',amount:307261.6,costLabor:138267.72,costMaterial:0,costManuf:0,profitRate:0.55},
    {ci:'CI-6888',name:'天津南疆成品油管道内检测配套改造',owner:'冯宇',client:'中国石化销售华北分公司',type:'总价合同',startDate:'2026-02-07',endDate:'2026-03-22',amount:27594,costLabor:23454.9,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6889',name:'石家庄炼化绿色转型发展项目',owner:'吴挺',client:'中石化广州工程有限公司',type:'总价合同',startDate:'2026-02-10',endDate:'2027-07-14',amount:43376.16,costLabor:36869.74,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6890',name:'天津南港绿色高端橡胶新材料项目',owner:'赵洵',client:'中国石化北京燕山分公司',type:'总价合同',startDate:'2026-02-10',endDate:'2026-06-03',amount:29593.54,costLabor:25154.51,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6891',name:'天津1#焦化装置节能优化改造',owner:'刘富强',client:'中石化（天津）石油化工有限公司',type:'总价合同',startDate:'2026-02-10',endDate:'2026-04-02',amount:44000,costLabor:36080,costMaterial:0,costManuf:0,profitRate:0.18},
    {ci:'CI-6892',name:'柴油轻馏分优化利用项目A',owner:'赵文强',client:'中国石化金陵分公司',type:'总价合同',startDate:'2026-02-11',endDate:'2026-06-03',amount:4626,costLabor:3932.1,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6893',name:'柴油轻馏分优化利用项目B',owner:'赵文强',client:'中国石化金陵分公司',type:'总价合同',startDate:'2026-02-11',endDate:'2026-06-03',amount:90280,costLabor:76738,costMaterial:0,costManuf:0,profitRate:0.15},
    {ci:'CI-6894',name:'高端日化品及配套项目A',owner:'赵文强',client:'中石化金陵日化科技（南京）有限公司',type:'总价合同',startDate:'2026-02-11',endDate:'2026-10-21',amount:11097.6,costLabor:9987.84,costMaterial:0,costManuf:0,profitRate:0.1},
    {ci:'CI-6895',name:'高端日化品及配套项目B',owner:'赵文强',client:'中石化金陵日化科技（南京）有限公司',type:'总价合同',startDate:'2026-02-11',endDate:'2026-10-21',amount:7398.4,costLabor:6658.56,costMaterial:0,costManuf:0,profitRate:0.1},
    {ci:'CI-6896',name:'高端日化品及配套项目C',owner:'赵文强',client:'中石化金陵日化科技（南京）有限公司',type:'总价合同',startDate:'2026-02-11',endDate:'2026-10-21',amount:5548.8,costLabor:4993.92,costMaterial:0,costManuf:0,profitRate:0.1},
    {ci:'CI-6897',name:'高端日化品及配套项目D',owner:'赵文强',client:'中石化金陵日化科技（南京）有限公司',type:'总价合同',startDate:'2026-02-11',endDate:'2026-02-11',amount:4624,costLabor:4161.6,costMaterial:0,costManuf:0,profitRate:0.1},
    // 开口合同
    {ci:'CI-5199',name:'中国成达工程有限公司国外项目框架协议',owner:'张子平',client:'中国成达工程有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:93150,costLabor:74520,costMaterial:0,costManuf:0,profitRate:0.2},
    {ci:'CI-5319',name:'福建联合石油化工物资监造检验服务（1）',owner:'梁荣',client:'福建联合石油化工有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:253421,costLabor:190065.75,costMaterial:0,costManuf:0,profitRate:0.25},
    {ci:'CI-5319-2',name:'福建联合石油化工物资监造检验服务（2）',owner:'梁荣',client:'福建联合石油化工有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:568418.8,costLabor:397893.16,costMaterial:0,costManuf:0,profitRate:0.3},
    {ci:'CI5635',name:'物资装备华东有限公司材料包检验项目',owner:'张恒',client:'中国石化物资装备华东有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:919.8,costLabor:827.82,costMaterial:0,costManuf:0,profitRate:0.1},
    {ci:'CI-6484',name:'深能北方鄂托克旗风光制氢合成绿氨项目',owner:'赵洵',client:'深能北方（鄂托克旗）能源有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:41769,costLabor:37592.1,costMaterial:0,costManuf:0,profitRate:0.1},
    {ci:'CI5523',name:'福建古雷150万吨/年乙烯深加工联合体项目',owner:'冯宇',client:'中国寰球工程有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:572340,costLabor:400638,costMaterial:0,costManuf:0,profitRate:0.3},
    {ci:'CI4986',name:'海南PBST连续聚合EPC总承包项目',owner:'赵文强',client:'中石化上海工程有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:289415.4,costLabor:208379.09,costMaterial:0,costManuf:0,profitRate:0.28},
    {ci:'CI6084',name:'中海壳牌惠州三期乙烯项目',owner:'冯宇',client:'中海壳牌石油化工有限公司',type:'开口合同',startDate:'2026-01-01',endDate:'2026-12-31',amount:1726854.64,costLabor:949770.05,costMaterial:0,costManuf:0,profitRate:0.45},
];

const INVOICE_DATA = [
    {ci:'CI-5199',invoiceDate:'2026-02-05',invoiceAmount:55890,invoiceNo:'INV-2026-0101'},
    {ci:'CI-5319',invoiceDate:'2026-02-08',invoiceAmount:126710.5,invoiceNo:'INV-2026-0102'},
    {ci:'CI-5319-2',invoiceDate:'2026-02-10',invoiceAmount:284209.4,invoiceNo:'INV-2026-0103'},
    {ci:'CI5635',invoiceDate:'2026-02-03',invoiceAmount:459.9,invoiceNo:'INV-2026-0104'},
    {ci:'CI-6484',invoiceDate:'2026-02-15',invoiceAmount:20884.5,invoiceNo:'INV-2026-0105'},
    {ci:'CI5523',invoiceDate:'2026-02-18',invoiceAmount:286170,invoiceNo:'INV-2026-0106'},
    {ci:'CI4986',invoiceDate:'2026-02-20',invoiceAmount:144707.7,invoiceNo:'INV-2026-0107'},
    {ci:'CI6084',invoiceDate:'2026-02-22',invoiceAmount:863427.32,invoiceNo:'INV-2026-0108'},
    {ci:'CI-6870',invoiceDate:'2026-02-05',invoiceAmount:411152.12,invoiceNo:'INV-2026-0201'},
    {ci:'CI-6875',invoiceDate:'2026-02-10',invoiceAmount:27909.12,invoiceNo:'INV-2026-0202'},
    {ci:'CI-6887',invoiceDate:'2026-02-15',invoiceAmount:153630.8,invoiceNo:'INV-2026-0203'},
];

const INCOME_DATA = [
    {ci:'CI-5199',totalOutput:93150,monthlyOutput:46575,invoicedTotal:55890,receivedTotal:55890},
    {ci:'CI-5319',totalOutput:253421,monthlyOutput:126710.5,invoicedTotal:126710.5,receivedTotal:100000},
    {ci:'CI-5319-2',totalOutput:568418.8,monthlyOutput:284209.4,invoicedTotal:284209.4,receivedTotal:250000},
    {ci:'CI5635',totalOutput:919.8,monthlyOutput:459.9,invoicedTotal:459.9,receivedTotal:459.9},
    {ci:'CI-6484',totalOutput:41769,monthlyOutput:20884.5,invoicedTotal:20884.5,receivedTotal:20884.5},
    {ci:'CI5523',totalOutput:572340,monthlyOutput:286170,invoicedTotal:286170,receivedTotal:260000},
    {ci:'CI4986',totalOutput:289415.4,monthlyOutput:144707.7,invoicedTotal:144707.7,receivedTotal:140000},
    {ci:'CI6084',totalOutput:1726854.64,monthlyOutput:863427.32,invoicedTotal:863427.32,receivedTotal:800000},
];

// ============ 工具函数 ============
function fmt(n){if(n===null||n===undefined)return'—';return parseFloat(n).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});}
function fmtPct(n){if(n===null||n===undefined)return'—';return(parseFloat(n)*100).toFixed(1)+'%';}
function parseDate(s){return s?new Date(s):null;}
function inRange(dateStr,s,e){if(!dateStr)return false;const d=parseDate(dateStr),sd=parseDate(s),ed=parseDate(e);if(!d||!sd||!ed)return false;return d>=sd&&d<=ed;}
function contractStartInRange(c,s,e){return inRange(c.startDate,s,e);}
function calcCost(c){return (c.costMaterial||0)+(c.costLabor||0)+(c.costManuf||0);}
function calcProfit(c){return c.amount-calcCost(c);}

// ============ 数据聚合 ============
function buildMonthlyReport(rangeStart, rangeEnd){
    const part1=[],part2=[];
    CONTRACT_DATA.filter(c=>c.type==='总价合同'&&contractStartInRange(c,rangeStart,rangeEnd)).forEach(c=>{
        const invs=INVOICE_DATA.filter(i=>i.ci===c.ci&&inRange(i.invoiceDate,rangeStart,rangeEnd));
        const costTotal=calcCost(c), profit=calcProfit(c);
        part1.push({...c,costTotal,profit,invoicedAmount:invs.reduce((s,i)=>s+i.invoiceAmount,0),invoiceNo:invs.map(i=>i.invoiceNo).join('、')||'—'});
    });
    INVOICE_DATA.filter(i=>inRange(i.invoiceDate,rangeStart,rangeEnd)).forEach(inv=>{
        const c=CONTRACT_DATA.find(x=>x.ci===inv.ci&&x.type==='开口合同');
        if(!c)return;
        const inc=INCOME_DATA.find(x=>x.ci===inv.ci);
        const costTotal=calcCost(c),profit=calcProfit(c);
        part2.push({...c,costTotal,profit,invoiceDate:inv.invoiceDate,invoicedAmount:inv.invoiceAmount,invoiceNo:inv.invoiceNo,
            totalOutput:inc?inc.totalOutput:0,monthlyOutput:inc?inc.monthlyOutput:0,
            invoicedTotal:inc?inc.invoicedTotal:0,receivedTotal:inc?inc.receivedTotal:0});
    });
    return {part1,part2};
}

function filterReport(data,filters){
    return data.filter(r=>{
        if(filters.ci&&!r.ci.toLowerCase().includes(filters.ci.toLowerCase()))return false;
        if(filters.name&&!r.name.includes(filters.name))return false;
        if(filters.owner&&!r.owner.includes(filters.owner))return false;
        if(filters.client&&!r.client.includes(filters.client))return false;
        return true;
    });
}

// ============ 导出Excel核心：参照模板格式 ============
function mrExportExcel(part1, part2, rangeStart, rangeEnd){
    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // 获取年月显示
    const dateLabel = rangeStart ? rangeStart.slice(0,7).replace('-','年')+'月科研经营月报' : '科研经营月报';
    const unitLabel = '单位名称：南京三方';

    // 统计汇总
    const allAmount = [...part1,...part2].reduce((s,r)=>s+r.amount,0);
    const allInvoiced = [...part1,...part2].reduce((s,r)=>s+(r.invoicedAmount||0),0);

    // R0: 标题行
    ws_data.push([dateLabel,'','','','','','','','','','','','','','','','','','','','','']);
    // R1: 统计信息行
    ws_data.push([unitLabel,'','','','本期合同额（元）',allAmount,'','年初至本月累计（元）','',allAmount*2,'','本期销售回款（元）','',allInvoiced,'','年初至本月累计（元）','',allInvoiced*2,'','','','']);
    // R2-R3: 列头（双行，对应模板的合并列头）
    ws_data.push(['序号','监理编号','合同标的物','负责人','合同委托方','合同起始日期','合同终止日期','合同额\n（元）',
        '合同基本情况（元）','','','','','','付款约定（%）','','','','','','合同交货期','备注']);
    ws_data.push(['','','','','','','','','材料费','人工费','制造费','成本小计','毛利金额','毛利率%',
        '预付款','进度款','提货款','验收款','款到发货','质保金','','']);

    // ---- Part1: 总价合同 ----
    if(part1.length>0){
        ws_data.push(['===【总价合同台账】（合同起始日期在'+rangeStart+'~'+rangeEnd+'范围内）','','','','','','','','','','','','','','','','','','','','','']);
        part1.forEach((r,i)=>{
            ws_data.push([
                i+1, r.ci, r.name, r.owner, r.client, r.startDate, r.endDate,
                r.amount, r.costMaterial||0, r.costLabor||0, r.costManuf||0, r.costTotal,
                r.profit, parseFloat((r.profitRate*100).toFixed(2))+'%',
                0, 0, 0, '100%', 0, 0, r.endDate, ''
            ]);
        });
        // 总价合同小计
        const s1={amount:0,costMaterial:0,costLabor:0,costManuf:0,costTotal:0,profit:0};
        part1.forEach(r=>{s1.amount+=r.amount;s1.costMaterial+=r.costMaterial||0;s1.costLabor+=r.costLabor||0;s1.costManuf+=r.costManuf||0;s1.costTotal+=r.costTotal;s1.profit+=r.profit;});
        ws_data.push(['小计('+part1.length+'条)','','','','','','',s1.amount,s1.costMaterial,s1.costLabor,s1.costManuf,s1.costTotal,s1.profit,'','','','','','','','','']);
    }

    // 空行分隔
    ws_data.push(['','','','','','','','','','','','','','','','','','','','','','']);

    // ---- Part2: 开口合同 ----
    if(part2.length>0){
        ws_data.push(['===【开口合同台账】（开票时间在'+rangeStart+'~'+rangeEnd+'范围内）','','','','','','','','','','','','','','','','','','','','','']);
        // 开口合同额外列头
        ws_data.push(['序号','监理编号','合同标的物','负责人','合同委托方','开票日期','开票发票号','本次开票额（元）',
            '合同额（元）','成本小计','毛利金额','毛利率%','总产值','当月产值','累计开票总额','累计回款总额',
            '','','','','合同交货期','备注']);
        part2.forEach((r,i)=>{
            ws_data.push([
                i+1, r.ci, r.name, r.owner, r.client,
                r.invoiceDate||'', r.invoiceNo||'', r.invoicedAmount||0,
                r.amount, r.costTotal, r.profit,
                parseFloat((r.profitRate*100).toFixed(2))+'%',
                r.totalOutput||0, r.monthlyOutput||0,
                r.invoicedTotal||0, r.receivedTotal||0,
                '','','','', r.endDate, ''
            ]);
        });
        const s2={invoicedAmount:0,amount:0,costTotal:0,profit:0,totalOutput:0,monthlyOutput:0,invoicedTotal:0,receivedTotal:0};
        part2.forEach(r=>{s2.invoicedAmount+=(r.invoicedAmount||0);s2.amount+=r.amount;s2.costTotal+=r.costTotal;s2.profit+=r.profit;s2.totalOutput+=(r.totalOutput||0);s2.monthlyOutput+=(r.monthlyOutput||0);s2.invoicedTotal+=(r.invoicedTotal||0);s2.receivedTotal+=(r.receivedTotal||0);});
        ws_data.push(['小计('+part2.length+'条)','','','','','','',s2.invoicedAmount,s2.amount,s2.costTotal,s2.profit,'',s2.totalOutput,s2.monthlyOutput,s2.invoicedTotal,s2.receivedTotal,'','','','','','']);
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // 设置列宽
    ws['!cols'] = [
        {wch:6},{wch:14},{wch:40},{wch:8},{wch:28},{wch:12},{wch:12},
        {wch:14},{wch:12},{wch:12},{wch:10},{wch:14},{wch:14},{wch:8},
        {wch:8},{wch:8},{wch:8},{wch:8},{wch:8},{wch:8},{wch:12},{wch:16}
    ];

    XLSX.utils.book_append_sheet(wb, ws, '科研经营月报');
    const filename = '科研经营月报_'+rangeStart+'至'+rangeEnd+'.xlsx';
    XLSX.writeFile(wb, filename);
}

// ============ 导出弹窗 ============
function mrShowExportDialog(){
    if(!window._mrCurrentPart1&&!window._mrCurrentPart2){showToast('请先加载月报数据');return;}
    const p1=window._mrCurrentPart1||[];
    const p2=window._mrCurrentPart2||[];
    const s=document.getElementById('mr-date-start')?.value||'';
    const e=document.getElementById('mr-date-end')?.value||'';
    const totalAmt=[...p1,...p2].reduce((s,r)=>s+r.amount,0);
    const totalInv=[...p1,...p2].reduce((s,r)=>s+(r.invoicedAmount||0),0);
    const totalProfit=[...p1,...p2].reduce((s,r)=>s+r.profit,0);

    const overlay=document.createElement('div');
    overlay.id='mr-export-overlay';
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML=`
<div style="background:#fff;border-radius:14px;width:640px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.25);overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);padding:18px 24px;display:flex;justify-content:space-between;align-items:center;">
    <h3 style="margin:0;color:#fff;font-size:16px;">📥 导出科研经营月报 Excel</h3>
    <button onclick="document.getElementById('mr-export-overlay').remove()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
  </div>
  <div style="padding:24px;">
    <div style="background:#f0f9ff;border-radius:10px;padding:16px;margin-bottom:20px;border:1px solid #bae6fd;">
      <div style="font-size:13px;color:#0369a1;font-weight:600;margin-bottom:10px;">📋 导出内容预览</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;">
        <div>时间区间：<strong>${s} ~ ${e}</strong></div>
        <div>总价合同：<strong style="color:#1d4ed8;">${p1.length} 条</strong></div>
        <div>开口合同：<strong style="color:#059669;">${p2.length} 条</strong></div>
        <div>合计：<strong>${p1.length+p2.length} 条</strong></div>
        <div>合同总额：<strong style="color:#1d4ed8;">¥${fmt(totalAmt)}</strong></div>
        <div>本期开票：<strong style="color:#059669;">¥${fmt(totalInv)}</strong></div>
        <div>毛利润：<strong style="color:${totalProfit>=0?'#059669':'#dc2626'};">¥${fmt(totalProfit)}</strong></div>
      </div>
    </div>
    <div style="background:#fffbeb;border-radius:8px;padding:12px;border:1px solid #fde68a;font-size:12px;color:#92400e;margin-bottom:20px;">
      📌 导出格式说明：<br>
      • <strong>Sheet1</strong> 包含完整月报，上方为【总价合同】，下方为【开口合同】<br>
      • 格式对照原始模板（序号、监理编号、合同标的物、负责人、委托方、合同额、成本、毛利等）<br>
      • 文件名：科研经营月报_${s}至${e}.xlsx
    </div>
    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <button onclick="document.getElementById('mr-export-overlay').remove()" style="padding:10px 24px;border:1px solid #d1d5db;border-radius:8px;background:#f9fafb;cursor:pointer;font-size:13px;font-weight:600;">取消</button>
      <button id="mr-do-export-btn" onclick="mrDoExport()" style="padding:10px 28px;background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;box-shadow:0 2px 8px rgba(5,150,105,0.35);">
        ✅ 确认导出 Excel
      </button>
    </div>
  </div>
</div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
}

function mrDoExport(){
    const btn=document.getElementById('mr-do-export-btn');
    if(btn){btn.textContent='⏳ 生成中...';btn.disabled=true;}
    setTimeout(()=>{
        try{
            mrExportExcel(
                window._mrCurrentPart1||[],
                window._mrCurrentPart2||[],
                document.getElementById('mr-date-start')?.value||'',
                document.getElementById('mr-date-end')?.value||''
            );
            const ov=document.getElementById('mr-export-overlay');
            if(ov)ov.remove();
            showToast('Excel导出成功！');
        }catch(err){
            console.error(err);
            showToast('导出失败：'+err.message);
            if(btn){btn.textContent='✅ 确认导出 Excel';btn.disabled=false;}
        }
    },100);
}

// ============ 渲染页面 ============
function renderMonthlyReportPage(){
    const container=document.getElementById('page-monthly-report');
    if(!container)return;
    container.innerHTML=`
<style>
#mr-page{font-size:13px;}
.mr-step1{background:linear-gradient(135deg,#dbeafe,#eff6ff);border-radius:12px;padding:20px 24px;margin-bottom:20px;border:1px solid #bfdbfe;}
.mr-step1 h3{margin:0 0 12px;color:#1e40af;font-size:15px;}
.mr-date-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.mr-date-row label{font-weight:600;color:#374151;}
.mr-date-row input[type=date]{padding:8px 12px;border:1.5px solid #93c5fd;border-radius:8px;font-size:13px;outline:none;}
.mr-query-btn{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:9px 22px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;}
.mr-info-hint{font-size:12px;color:#6b7280;background:#f9fafb;border-radius:6px;padding:6px 12px;border:1px solid #e5e7eb;}
#mr-data-section{display:none;}
.mr-filter-bar{background:#fff;border-radius:12px;padding:16px 20px;margin-bottom:16px;border:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.mr-filter-row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;}
.mr-filter-item{display:flex;flex-direction:column;gap:4px;min-width:140px;}
.mr-filter-item label{font-size:12px;color:#6b7280;font-weight:500;}
.mr-filter-item input,.mr-filter-item select{padding:7px 10px;border:1.5px solid #d1d5db;border-radius:7px;font-size:13px;outline:none;}
.mr-filter-actions{display:flex;gap:8px;align-items:flex-end;}
.mr-btn-q{background:#2563eb;color:#fff;border:none;padding:8px 18px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;}
.mr-btn-r{background:#f3f4f6;color:#374151;border:1px solid #d1d5db;padding:8px 18px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;}
.mr-btn-ex{background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;padding:8px 20px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;box-shadow:0 2px 8px rgba(5,150,105,.3);}
.mr-stat-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;margin-bottom:20px;}
.mr-stat-card{background:#fff;border-radius:10px;padding:14px 16px;border:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.mr-stat-card .sc-label{font-size:12px;color:#6b7280;margin-bottom:6px;}
.mr-stat-card .sc-val{font-size:18px;font-weight:700;color:#111827;}
.mr-stat-card .sc-sub{font-size:11px;color:#9ca3af;margin-top:2px;}
.mr-section{margin-bottom:28px;}
.mr-section-header{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.mr-section-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:700;}
.mr-badge1{background:linear-gradient(135deg,#dbeafe,#bfdbfe);color:#1e40af;border:1px solid #93c5fd;}
.mr-badge2{background:linear-gradient(135deg,#d1fae5,#a7f3d0);color:#065f46;border:1px solid #6ee7b7;}
.mr-table-wrap{overflow-x:auto;border-radius:10px;border:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.mr-table{width:100%;border-collapse:collapse;font-size:12px;min-width:1400px;}
.mr-table thead tr{background:linear-gradient(135deg,#f8fafc,#f1f5f9);}
.mr-table thead th{padding:8px 10px;text-align:left;color:#374151;font-weight:600;border-bottom:1px solid #e5e7eb;border-right:1px solid #e5e7eb;white-space:nowrap;vertical-align:middle;}
.mr-table thead th.thn{text-align:right;}
.mr-table thead tr:first-child th{border-bottom:1px solid #cbd5e1;}
.mr-table thead tr:last-child th{border-bottom:2px solid #94a3b8;font-size:11px;color:#4b5563;}
.mr-table tbody tr:hover{background:#eff6ff;}
.mr-table tbody tr:nth-child(even){background:#fafafa;}
.mr-table td{padding:9px 12px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:top;}
.mr-table td.tdn{text-align:right;font-family:'Courier New',monospace;}
.ppos{color:#059669;font-weight:600;text-align:right;}
.pneg{color:#dc2626;font-weight:600;text-align:right;}
.mr-divider{border:none;border-top:3px dashed #d1fae5;margin:24px 0;}
.mr-empty{text-align:center;padding:40px;color:#9ca3af;}
</style>
<div id="mr-page">
  <div class="page-title-row">
    <h1>科研经营月报 <small>(数据综合台账)</small></h1>
    <div class="role-badge">当前角色：<strong>商务 / 财务</strong> — 只读汇总视图</div>
  </div>
  <div class="mr-step1">
    <h3>📅 Step 1：选择时间区间，加载月报数据</h3>
    <div class="mr-date-row">
      <label>开始日期：</label>
      <input type="date" id="mr-date-start" value="2026-02-01">
      <label>结束日期：</label>
      <input type="date" id="mr-date-end" value="2026-02-28">
      <button class="mr-query-btn" onclick="mrLoadData()">🔍 加载月报</button>
      <div class="mr-info-hint">📌 总价合同按合同起始日期筛选 &nbsp;|&nbsp; 📌 开口合同按开票时间筛选</div>
    </div>
  </div>
  <div id="mr-data-section">
    <div class="mr-filter-bar">
      <div style="font-size:12px;color:#6b7280;margin-bottom:10px;font-weight:600;">🔎 Step 2：多条件精确查询</div>
      <div class="mr-filter-row">
        <div class="mr-filter-item"><label>合同编号</label><input type="text" id="mr-f-ci" placeholder="模糊搜索"></div>
        <div class="mr-filter-item"><label>合同名称</label><input type="text" id="mr-f-name" placeholder="模糊搜索"></div>
        <div class="mr-filter-item"><label>负责人</label><input type="text" id="mr-f-owner" placeholder="请输入"></div>
        <div class="mr-filter-item"><label>委托方</label><input type="text" id="mr-f-client" placeholder="模糊搜索"></div>
        <div class="mr-filter-item"><label>合同类型</label>
          <select id="mr-f-type"><option value="">全部</option><option value="总价合同">总价合同</option><option value="开口合同">开口合同</option></select>
        </div>
        <div class="mr-filter-actions">
          <button class="mr-btn-q" onclick="mrApplyFilter()">🔍 查询</button>
          <button class="mr-btn-r" onclick="mrResetFilter()">↻ 重置</button>
          <button class="mr-btn-ex" onclick="mrShowExportDialog()">📥 导出Excel</button>
        </div>
      </div>
    </div>
    <div class="mr-stat-cards" id="mr-stat-cards"></div>
    <div id="mr-report-body"></div>
  </div>
</div>`;
}

// ============ 加载数据 ============
window._mrCurrentPart1=null;
window._mrCurrentPart2=null;

function mrLoadData(){
    const s=document.getElementById('mr-date-start')?.value;
    const e=document.getElementById('mr-date-end')?.value;
    if(!s||!e){showToast('请先选择完整的时间区间');return;}
    if(s>e){showToast('开始日期不能晚于结束日期');return;}
    const{part1,part2}=buildMonthlyReport(s,e);
    window._mrCurrentPart1=part1;
    window._mrCurrentPart2=part2;
    document.getElementById('mr-data-section').style.display='block';
    ['mr-f-ci','mr-f-name','mr-f-owner','mr-f-client'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    const t=document.getElementById('mr-f-type');if(t)t.value='';
    mrRenderAll(part1,part2);
    showToast('月报加载完成，共 '+(part1.length+part2.length)+' 条数据');
}

function mrApplyFilter(){
    if(!window._mrCurrentPart1)return;
    const filters={ci:document.getElementById('mr-f-ci')?.value||'',name:document.getElementById('mr-f-name')?.value||'',owner:document.getElementById('mr-f-owner')?.value||'',client:document.getElementById('mr-f-client')?.value||''};
    const tp=document.getElementById('mr-f-type')?.value||'';
    let fp1=filterReport(window._mrCurrentPart1,filters);
    let fp2=filterReport(window._mrCurrentPart2,filters);
    if(tp==='总价合同')fp2=[];
    if(tp==='开口合同')fp1=[];
    mrRenderAll(fp1,fp2);
    showToast('筛选完成，共 '+(fp1.length+fp2.length)+' 条');
}

function mrResetFilter(){
    ['mr-f-ci','mr-f-name','mr-f-owner','mr-f-client'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    const t=document.getElementById('mr-f-type');if(t)t.value='';
    if(window._mrCurrentPart1)mrRenderAll(window._mrCurrentPart1,window._mrCurrentPart2||[]);
}

// ============ 渲染统计+报表 ============
function mrRenderAll(p1,p2){
    const all=[...p1,...p2];
    const totalAmt=all.reduce((s,r)=>s+r.amount,0);
    const totalInv=all.reduce((s,r)=>s+(r.invoicedAmount||0),0);
    const totalProfit=all.reduce((s,r)=>s+r.profit,0);
    const statsEl=document.getElementById('mr-stat-cards');
    if(statsEl)statsEl.innerHTML=`
<div class="mr-stat-card"><div class="sc-label">📋 合同总数</div><div class="sc-val">${all.length}</div><div class="sc-sub">总价${p1.length}+开口${p2.length}</div></div>
<div class="mr-stat-card"><div class="sc-label">💰 合同总额（元）</div><div class="sc-val" style="color:#1d4ed8;font-size:15px;">¥${fmt(totalAmt)}</div></div>
<div class="mr-stat-card"><div class="sc-label">🧾 本期开票（元）</div><div class="sc-val" style="color:#059669;font-size:15px;">¥${fmt(totalInv)}</div></div>
<div class="mr-stat-card"><div class="sc-label">📈 毛利润（元）</div><div class="sc-val" style="color:${totalProfit>=0?'#059669':'#dc2626'};font-size:15px;">¥${fmt(totalProfit)}</div></div>
<div class="mr-stat-card"><div class="sc-label">📊 综合毛利率</div><div class="sc-val" style="color:#7c3aed;">${totalAmt?fmtPct(totalProfit/totalAmt):'—'}</div></div>`;

    const bodyEl=document.getElementById('mr-report-body');
    if(!bodyEl)return;
    let html='';

    // --- 总价合同 ---
    html+=`<div class="mr-section"><div class="mr-section-header"><span class="mr-section-badge mr-badge1">① 总价合同台账</span><span style="font-size:12px;color:#6b7280;">合同起始日期在区间内，共 <strong>${p1.length}</strong> 条</span></div>`;
    if(p1.length===0){html+=`<div class="mr-empty">🔍 无符合的总价合同数据</div>`;}
    else{
        // 双行表头，严格对照Excel模板R2/R3行
        html+=`<div class="mr-table-wrap"><table class="mr-table"><thead>
<tr>
  <th rowspan="2">#</th>
  <th rowspan="2">监理编号</th>
  <th rowspan="2">合同标的物</th>
  <th rowspan="2">负责人</th>
  <th rowspan="2">合同委托方</th>
  <th rowspan="2">合同起始日期</th>
  <th rowspan="2">合同终止日期</th>
  <th rowspan="2" class="thn">合同额（元）</th>
  <th colspan="4" style="text-align:center;background:#e0f2fe;">合同基本情况（元）</th>
  <th rowspan="2" class="thn">毛利金额</th>
  <th rowspan="2" class="thn">毛利率 %</th>
  <th colspan="6" style="text-align:center;background:#fef9c3;">付款约定（%）</th>
  <th rowspan="2">合同交货期</th>
  <th rowspan="2">备注</th>
</tr>
<tr>
  <th class="thn" style="background:#f0f9ff;">材料费</th>
  <th class="thn" style="background:#f0f9ff;">人工费</th>
  <th class="thn" style="background:#f0f9ff;">制造费</th>
  <th class="thn" style="background:#f0f9ff;">成本小计</th>
  <th class="thn" style="background:#fefce8;">预付款</th>
  <th class="thn" style="background:#fefce8;">进度款</th>
  <th class="thn" style="background:#fefce8;">提货款</th>
  <th class="thn" style="background:#fefce8;">验收款</th>
  <th class="thn" style="background:#fefce8;">款到发货</th>
  <th class="thn" style="background:#fefce8;">质保金</th>
</tr>
</thead><tbody>`;
        p1.forEach((r,i)=>{
            const pc=r.profit>=0?'ppos':'pneg';
            html+=`<tr>
<td>${i+1}</td>
<td style="font-family:monospace;color:#1d4ed8;font-weight:600;">${r.ci}</td>
<td style="max-width:220px;" title="${r.name}">${r.name.length>28?r.name.slice(0,28)+'…':r.name}</td>
<td>${r.owner}</td>
<td style="max-width:160px;" title="${r.client}">${r.client.length>16?r.client.slice(0,16)+'…':r.client}</td>
<td>${r.startDate}</td><td>${r.endDate}</td>
<td class="tdn">${fmt(r.amount)}</td>
<td class="tdn" style="background:#f0f9ff;">${r.costMaterial?fmt(r.costMaterial):'—'}</td>
<td class="tdn" style="background:#f0f9ff;">${fmt(r.costLabor)}</td>
<td class="tdn" style="background:#f0f9ff;">${r.costManuf?fmt(r.costManuf):'—'}</td>
<td class="tdn" style="background:#f0f9ff;font-weight:600;">${fmt(r.costTotal)}</td>
<td class="${pc}">${fmt(r.profit)}</td>
<td class="tdn" style="color:#7c3aed;">${fmtPct(r.profitRate)}</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">100%</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td>${r.endDate}</td>
<td style="font-size:11px;color:#6b7280;">${r.invoiceNo||'—'}</td>
</tr>`;
        });
        const sa={amount:0,costLabor:0,costTotal:0,profit:0};
        p1.forEach(r=>{sa.amount+=r.amount;sa.costLabor+=r.costLabor||0;sa.costTotal+=r.costTotal;sa.profit+=r.profit;});
        html+=`<tr style="background:#eff6ff;font-weight:700;">
<td colspan="7" style="text-align:right;color:#1e40af;">小计（${p1.length}条）</td>
<td class="tdn" style="color:#1d4ed8;">${fmt(sa.amount)}</td>
<td class="tdn">—</td><td class="tdn">${fmt(sa.costLabor)}</td><td class="tdn">—</td>
<td class="tdn">${fmt(sa.costTotal)}</td>
<td class="${sa.profit>=0?'ppos':'pneg'}">${fmt(sa.profit)}</td>
<td class="tdn" style="color:#7c3aed;">${sa.amount?fmtPct(sa.profit/sa.amount):'—'}</td>
<td colspan="8"></td>
</tr>`;
        html+=`</tbody></table></div>`;
    }
    html+=`</div><hr class="mr-divider">`;

    // --- 开口合同：同样使用双行合并列头，严格对应Excel格式 ---
    html+=`<div class="mr-section"><div class="mr-section-header"><span class="mr-section-badge mr-badge2">② 开口合同台账（以开票明细为主表）</span><span style="font-size:12px;color:#6b7280;">开票时间在区间内，共 <strong>${p2.length}</strong> 条</span></div>`;
    if(p2.length===0){html+=`<div class="mr-empty">🔍 无符合的开口合同开票数据</div>`;}
    else{
        html+=`<div class="mr-table-wrap"><table class="mr-table"><thead>
<tr>
  <th rowspan="2">#</th>
  <th rowspan="2">监理编号</th>
  <th rowspan="2">合同标的物</th>
  <th rowspan="2">负责人</th>
  <th rowspan="2">合同委托方</th>
  <th rowspan="2">开票日期</th>
  <th rowspan="2">发票号</th>
  <th rowspan="2" class="thn" style="color:#059669;">本次开票额（元）</th>
  <th rowspan="2" class="thn">合同额（元）</th>
  <th colspan="4" style="text-align:center;background:#e0f2fe;">合同基本情况（元）</th>
  <th rowspan="2" class="thn">毛利金额</th>
  <th rowspan="2" class="thn">毛利率 %</th>
  <th colspan="6" style="text-align:center;background:#fef9c3;">付款约定（%）</th>
  <th rowspan="2">合同交货期</th>
  <th rowspan="2">备注</th>
</tr>
<tr>
  <th class="thn" style="background:#f0f9ff;">材料费</th>
  <th class="thn" style="background:#f0f9ff;">人工费</th>
  <th class="thn" style="background:#f0f9ff;">制造费</th>
  <th class="thn" style="background:#f0f9ff;">成本小计</th>
  <th class="thn" style="background:#fefce8;">预付款</th>
  <th class="thn" style="background:#fefce8;">进度款</th>
  <th class="thn" style="background:#fefce8;">提货款</th>
  <th class="thn" style="background:#fefce8;">验收款</th>
  <th class="thn" style="background:#fefce8;">款到发货</th>
  <th class="thn" style="background:#fefce8;">质保金</th>
</tr>
</thead><tbody>`;
        p2.forEach((r,i)=>{
            const pc=r.profit>=0?'ppos':'pneg';
            html+=`<tr>
<td>${i+1}</td>
<td style="font-family:monospace;color:#065f46;font-weight:600;">${r.ci}</td>
<td style="max-width:220px;" title="${r.name}">${r.name.length>28?r.name.slice(0,28)+'…':r.name}</td>
<td>${r.owner}</td>
<td style="max-width:160px;" title="${r.client}">${r.client.length>16?r.client.slice(0,16)+'…':r.client}</td>
<td>${r.invoiceDate||'—'}</td>
<td style="font-size:11px;color:#6b7280;">${r.invoiceNo||'—'}</td>
<td class="tdn" style="color:#059669;font-weight:700;">${fmt(r.invoicedAmount)}</td>
<td class="tdn">${fmt(r.amount)}</td>
<td class="tdn" style="background:#f0f9ff;">${r.costMaterial?fmt(r.costMaterial):'—'}</td>
<td class="tdn" style="background:#f0f9ff;">${fmt(r.costLabor)}</td>
<td class="tdn" style="background:#f0f9ff;">${r.costManuf?fmt(r.costManuf):'—'}</td>
<td class="tdn" style="background:#f0f9ff;font-weight:600;">${fmt(r.costTotal)}</td>
<td class="${pc}">${fmt(r.profit)}</td>
<td class="tdn" style="color:#7c3aed;">${fmtPct(r.profitRate)}</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">100%</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td class="tdn" style="background:#fefce8;">—</td>
<td>${r.endDate}</td>
<td style="font-size:11px;color:#6b7280;">${r.totalOutput?fmt(r.totalOutput)+' / 月:'+fmt(r.monthlyOutput):''}</td>
</tr>`;
        });
        const sb={inv:0,amount:0,costTotal:0,costLabor:0,profit:0};
        p2.forEach(r=>{sb.inv+=(r.invoicedAmount||0);sb.amount+=r.amount;sb.costTotal+=r.costTotal;sb.costLabor+=r.costLabor||0;sb.profit+=r.profit;});
        html+=`<tr style="background:#ecfdf5;font-weight:700;">
<td colspan="7" style="text-align:right;color:#065f46;">小计（${p2.length}条）</td>
<td class="tdn" style="color:#059669;">${fmt(sb.inv)}</td>
<td class="tdn" style="color:#1d4ed8;">${fmt(sb.amount)}</td>
<td class="tdn">—</td><td class="tdn">${fmt(sb.costLabor)}</td><td class="tdn">—</td>
<td class="tdn">${fmt(sb.costTotal)}</td>
<td class="${sb.profit>=0?'ppos':'pneg'}">${fmt(sb.profit)}</td>
<td class="tdn" style="color:#7c3aed;">${sb.amount?fmtPct(sb.profit/sb.amount):'—'}</td>
<td colspan="8"></td>
</tr>`;
        html+=`</tbody></table></div>`;
    }
    html+=`</div>`;
    bodyEl.innerHTML=html;
}

// ============ 初始化 ============
(function init(){
    const c=document.getElementById('page-monthly-report');
    if(c){renderMonthlyReportPage();}
    else{document.addEventListener('DOMContentLoaded',()=>{const cc=document.getElementById('page-monthly-report');if(cc)renderMonthlyReportPage();});}
})();
