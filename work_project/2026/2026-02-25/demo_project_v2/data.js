// ===== data.js — V2 全量模拟数据 =====

// 合同台账
const mockContracts = [
  { ciCode: 'CI-2024-001', name: '某石化换热器监造', device: '管壳式换热器', client: '中国石化', factory: '东方锅炉', amount: 580000, preDate: '2024-01-10', manager: '李明', signDate: '2024-01-15', returnDate: '2024-01-25', startDate: '2024-01-20', endDate: '2024-12-31', contact: '张经理', contractForm: '人工日', erp: '已录入', projectCode: 'PRJ-001', projectName: '石化换热器A项', status: '进行中' },
  { ciCode: 'CI-2024-002', name: '压力容器制造监理', device: '压力容器', client: '中国石油', factory: '哈尔滨锅炉', amount: 1200000, preDate: '2024-01-05', manager: '王芳', signDate: '2024-01-08', returnDate: '2024-01-20', startDate: '2024-01-15', endDate: '2027-06-30', contact: '刘总', contractForm: '总价', erp: '已录入', projectCode: 'PRJ-002', projectName: '石油压力容器B项', status: '进行中' },
  { ciCode: 'CI-2024-003', name: '管道安装监造项目', device: '工业管道', client: '中海油', factory: '大连重工', amount: 860000, preDate: '2023-12-20', manager: '陈伟', signDate: '2023-12-25', returnDate: '2024-01-05', startDate: '2024-01-01', endDate: '2024-09-30', contact: '赵主任', contractForm: '人工日计算总价', erp: '未录入', projectCode: 'PRJ-003', projectName: '海油管道安装C项', status: '已终止' },
  { ciCode: 'CI-2024-004', name: '锅炉联箱焊接监理', device: '联箱', client: '华能集团', factory: '武汉锅炉', amount: 420000, preDate: '2024-02-01', manager: '李明', signDate: '2024-02-05', returnDate: '2024-02-15', startDate: '2024-02-10', endDate: '2025-06-30', contact: '许主管', contractForm: '人工日', erp: '已录入', projectCode: 'PRJ-004', projectName: '华能联箱焊接D项', status: '进行中' },
  { ciCode: 'CI-2024-005', name: '管道检测监理项目', device: '石油管道', client: '中国石化', factory: '宝鸡石油机械', amount: 350000, preDate: '2024-03-01', manager: '王芳', signDate: '2024-03-05', returnDate: '', startDate: '2024-03-10', endDate: '2025-03-31', contact: '孙科长', contractForm: '总价', erp: '未录入', projectCode: 'PRJ-005', projectName: '石化管道检测E项', status: '进行中' }
];

// 项目收入
const mockIncomeData = [
  { ciCode: 'CI-2024-001', name: '某石化换热器监造', client: '中国石化', contractForm: '人工日', contractAmount: 580000, totalOutput: 338800, monthOutput: 18400, confirmedOutput: 320000, monthConfirmed: 18400, reportedIncome: 200000, invoiced: 200000, received: 150000, invoiceStatus: '部分开票' },
  { ciCode: 'CI-2024-002', name: '压力容器制造监理', client: '中国石油', contractForm: '总价', contractAmount: 1200000, totalOutput: 500000, monthOutput: 120000, confirmedOutput: 480000, monthConfirmed: 120000, reportedIncome: 500000, invoiced: 500000, received: 400000, invoiceStatus: '部分开票' },
  { ciCode: 'CI-2024-003', name: '管道安装监造项目', client: '中海油', contractForm: '人工日计算总价', contractAmount: 860000, totalOutput: 0, monthOutput: 0, confirmedOutput: 0, monthConfirmed: 0, reportedIncome: 0, invoiced: 0, received: 0, invoiceStatus: '未开票' },
  { ciCode: 'CI-2024-004', name: '锅炉联箱焊接监理', client: '华能集团', contractForm: '人工日', contractAmount: 420000, totalOutput: 180000, monthOutput: 15000, confirmedOutput: 165000, monthConfirmed: 15000, reportedIncome: 100000, invoiced: 100000, received: 80000, invoiceStatus: '部分开票' },
  { ciCode: 'CI-2024-005', name: '管道检测监理项目', client: '中国石化', contractForm: '总价', contractAmount: 350000, totalOutput: 350000, monthOutput: 0, confirmedOutput: 350000, monthConfirmed: 0, reportedIncome: 350000, invoiced: 350000, received: 350000, invoiceStatus: '全部开票' }
];

// 执行管理
const mockExecutionData = [
  { ciCode: 'CI-2024-001', manager: '李明', projectCode: 'PRJ-001', projectName: '石化换热器A项', director: '周磊', dispatchCode: 'PD-20240115-01', directorRep: '周磊', totalOutput: 220000, monthOutput: 18400, factory: '东方锅炉', assignee: '张三', assistant: '李四, 陈伟', method: '驻厂', planStart: '2024-01-20', planEnd: '2024-02-28', actualStart: '2024-01-22', actualEnd: '', execStatus: '进行中', workDays: 34, platform: '是', sinopec: '是', deviceName: '换热器', deviceQty: 4, outline: '是', detail: '是', riskLevel: '中', basisDoc: '是', handover: '否', itp: '是', preInspection: '是' },
  { ciCode: 'CI-2024-001', manager: '李明', projectCode: 'PRJ-001', projectName: '石化换热器A项', director: '周磊', dispatchCode: 'PD-20240115-02', directorRep: '周磊', totalOutput: 118800, monthOutput: 10400, factory: '东方锅炉', assignee: '王五', assistant: '赵六', method: '巡检', planStart: '2024-01-25', planEnd: '2024-03-15', actualStart: '2024-01-26', actualEnd: '', execStatus: '进行中', workDays: 30, platform: '否', sinopec: '是', deviceName: '换热器', deviceQty: 4, outline: '', detail: '', riskLevel: '', basisDoc: '', handover: '', itp: '', preInspection: '' },
  { ciCode: 'CI-2024-002', manager: '王芳', projectCode: 'PRJ-002', projectName: '石油压力容器B项', director: '郑华', dispatchCode: 'PD-20240120-01', directorRep: '郑华', totalOutput: 500000, monthOutput: 120000, factory: '哈尔滨锅炉', assignee: '孙七', assistant: '吴八, 周九', method: '驻厂', planStart: '2024-01-20', planEnd: '2027-06-30', actualStart: '', actualEnd: '', execStatus: '未开始', workDays: 0, platform: '是', sinopec: '否', deviceName: '压力容器', deviceQty: 2, outline: '否', detail: '否', riskLevel: '低', basisDoc: '否', handover: '否', itp: '否', preInspection: '否' }
];

// 成本数据
const mockCostData = [
  { ciCode: 'CI-2024-001', name: '某石化换热器监造', workHours: 158, personnelCost: 66300, travelCost: 4200, fixedCost: 15000 },
  { ciCode: 'CI-2024-002', name: '压力容器制造监理', workHours: 0, personnelCost: 0, travelCost: 0, fixedCost: 8000 },
  { ciCode: 'CI-2024-003', name: '管道安装监造项目', workHours: 80, personnelCost: 32000, travelCost: 5200, fixedCost: 8000 },
  { ciCode: 'CI-2024-004', name: '锅炉联箱焊接监理', workHours: 45, personnelCost: 22500, travelCost: 3000, fixedCost: 5000 },
  { ciCode: 'CI-2024-005', name: '管道检测监理项目', workHours: 120, personnelCost: 48000, travelCost: 6000, fixedCost: 10000 }
];

// 利润数据
const mockProfitData = [
  { ciCode: 'CI-2024-001', name: '某石化换热器监造', manager: '李明', client: '中国石化', factory: '东方锅炉', totalOutput: 338800, totalCost: 85500, profit: 253300 },
  { ciCode: 'CI-2024-002', name: '压力容器制造监理', manager: '王芳', client: '中国石油', factory: '哈尔滨锅炉', totalOutput: 500000, totalCost: 8000, profit: 492000 },
  { ciCode: 'CI-2024-003', name: '管道安装监造项目', manager: '陈伟', client: '中海油', factory: '大连重工', totalOutput: 0, totalCost: 45200, profit: -45200 },
  { ciCode: 'CI-2024-004', name: '锅炉联箱焊接监理', manager: '李明', client: '华能集团', factory: '武汉锅炉', totalOutput: 180000, totalCost: 30500, profit: 149500 },
  { ciCode: 'CI-2024-005', name: '管道检测监理项目', manager: '王芳', client: '中国石化', factory: '宝鸡石油机械', totalOutput: 350000, totalCost: 64000, profit: 286000 }
];
