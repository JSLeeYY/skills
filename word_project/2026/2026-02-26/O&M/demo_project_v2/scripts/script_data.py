# -*- coding: utf-8 -*-
import os
base = r'D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project_v2'

data_js = """// ===== DATA.JS =====
const mockContracts = [
  { id: 'CI-2024-001', name: '中石化炼油设备监造项目', client: '中国石化', manufacturer: '沈阳鼓风机集团', amount: 2800000, responsiblePerson: '王建国', type: '总价合同', status: '进行中', startDate: '2024-03-01', endDate: '2024-12-31', invoiceStatus: '部分开票', invoiceAmount: 1200000, receivedAmount: 900000, remark: '' },
  { id: 'CI-2024-002', name: '中石油管道焊接监理合同', client: '中国石油', manufacturer: '哈尔滨电机厂', amount: 1560000, responsiblePerson: '李明远', type: '人工日合同', status: '进行中', startDate: '2024-01-15', endDate: '2024-09-30', invoiceStatus: '全部开票', invoiceAmount: 1560000, receivedAmount: 1200000, remark: '' },
  { id: 'CI-2024-003', name: '华电煤电机组监造服务', client: '中国华电', manufacturer: '东方电气集团', amount: 3200000, responsiblePerson: '张伟', type: '总价合同', status: '已完成', startDate: '2023-06-01', endDate: '2024-02-28', invoiceStatus: '全部开票', invoiceAmount: 3200000, receivedAmount: 3200000, remark: '' },
  { id: 'CI-2024-004', name: '中石化LNG储罐监造', client: '中国石化', manufacturer: '南京化工机械', amount: 1890000, responsiblePerson: '赵磊', type: '人工日计算总价', status: '进行中', startDate: '2024-04-10', endDate: '2025-01-31', invoiceStatus: '未开票', invoiceAmount: 0, receivedAmount: 0, remark: '客户审批流程延迟' },
  { id: 'CI-2024-005', name: '国家电网变压器监理', client: '国家电网公司', manufacturer: '特变电工', amount: 980000, responsiblePerson: '王建国', type: '总价合同', status: '已终止', startDate: '2024-02-01', endDate: '2024-07-31', invoiceStatus: '部分开票', invoiceAmount: 450000, receivedAmount: 450000, remark: '客户项目取消' },
  { id: 'CI-2024-006', name: '中海油钻井平台配件监造', client: '中国海油', manufacturer: '大连重工机床', amount: 4200000, responsiblePerson: '孙浩然', type: '人工日合同', status: '进行中', startDate: '2024-05-20', endDate: '2025-06-30', invoiceStatus: '部分开票', invoiceAmount: 800000, receivedAmount: 500000, remark: '' },
];

const mockIncomeData = mockContracts.map(c => ({
    id: c.id, name: c.name, client: c.client, responsible: c.responsiblePerson, type: c.type, contractAmount: c.amount, 
    totalOutput: c.amount * 0.8, monthOutput: c.amount * 0.05, 
    confirmedTotal: c.amount * 0.7, confirmedMonth: c.amount * 0.05, confirmedUpdateTime: '2024-03-01', correctionTime: '-',
    reportedIncome: c.invoiceAmount + 200000, monthlyIncome: 200000, invoiceStatus: c.invoiceStatus,
    planInvoiceDate: c.endDate, invoiceReason: '', latestInvoiceDate: c.invoiceAmount ? '2024-03-10' : '-', totalInvoice: c.invoiceAmount,
    latestPayDate: c.receivedAmount ? '2024-02-25' : '-', totalReceived: c.receivedAmount, remark: c.remark
}));

const mockExecutionData = [
  { id: 'CI-2024-001', name: '中石化炼油设备监造项目', method: '驻厂', personnel: '张小龙', planEnd: '2024-12-31', daysOverdue: 0, status: 'active', hasOutline: true, hasDetail: true, riskLevel: '中风险', hasTechDoc: true, changeStatus: '/' },
  { id: 'CI-2024-002', name: '中石油管道焊接监理合同', method: '巡检', personnel: '刘晓峰', planEnd: '2024-09-30', daysOverdue: 0, status: 'active', hasOutline: null, hasDetail: null, riskLevel: null, hasTechDoc: null, changeStatus: '人员变更' },
  { id: 'CI-2024-004', name: '中石化LNG储罐监造', method: '驻厂', personnel: '钱进', planEnd: '2024-02-28', daysOverdue: 5, status: 'active', hasOutline: false, hasDetail: true, riskLevel: '高风险', hasTechDoc: false, changeStatus: '/' },
];

const mockWorkhourDispatch = {
  'CI-2024-001': [
    { dispatchId: 'D-001-A', method: '驻厂', persons: ['张小龙', '李伟'], factory: '沈阳鼓风机', planStart: '2024-03-01', planEnd: '2024-08-31', status: '进行中', hours: 856 },
    { dispatchId: 'D-001-B', method: '驻厂', persons: ['王芳'], factory: '沈阳鼓风机', planStart: '2024-04-01', planEnd: '2024-12-31', status: '进行中', hours: 391 },
  ]
};

const mockPersonnelData = [
  { id: 'P001', name: '张小龙', gender: '男', ethnic: '汉', age: 36, school: '武汉大学', major: '工程管理', title: '高级工程师', certificate: '国家注册监理工程师' },
  { id: 'P002', name: '李伟', gender: '男', ethnic: '汉', age: 30, school: '同济大学', major: '工业设计', title: '中级工程师', certificate: '资格证' },
  { id: 'P003', name: '王芳', gender: '女', ethnic: '汉', age: 29, school: '交大', major: '机械', title: '助工', certificate: '' },
  { id: 'P004', name: '刘晓峰', gender: '男', ethnic: '满', age: 38, school: '哈工大', major: '动力', title: '高工', certificate: '一级建造师' },
];

const mockInvoiceData = [
  { id: 'INV-001', org: '监理公司', client: '中国石化', date: '2024-03-10', invoiceNo: 'FP20240310', amount: 600000, planReceiveDate: '2024-04-30', responsible: '王建国', ciId: 'CI-2024-001', flowStatus: '审批通过' },
  { id: 'INV-002', org: '监理公司', client: '中国海洋石油', date: '2024-03-20', invoiceNo: '', amount: 380000, planReceiveDate: '2024-05-31', responsible: '赵磊', ciId: 'CI-2024-004', flowStatus: '暂存' },
];

const mockPaymentData = [
  { id: 'PAY-001', ciId: 'CI-2024-001', counterpart: '中国石化', manager: '王建国', amount: 600000, date: '2024-02-25', flowStatus: '审批通过' },
  { id: 'PAY-002', ciId: 'CI-2024-002', counterpart: '中国石油', manager: '李明远', amount: 800000, date: '2024-03-01', flowStatus: '审批通过' },
  { id: 'PAY-003', ciId: 'CI-2024-006', counterpart: '中国海油', manager: '孙浩然', amount: 500000, date: '2024-02-28', flowStatus: '待审批' },
];

const mockReminderData = [
  { id: 'REM-001', type: '回款', client: '中国石化', ciId: 'CI-2024-001', overdueDays: 15, frequency: '每周', source: '系统', status: '开启' },
  { id: 'REM-002', type: '开票', client: '中国石油', ciId: 'CI-2024-002', overdueDays: 30, frequency: '每月', source: '系统', status: '开启' },
];

const mockCostData = [
  { ciId: 'CI-2024-001', name: '中石化项目', totalHours: 1247, personnelCost: 312000, travelCost: 45600, fixedCost: 12000 },
  { ciId: 'CI-2024-002', name: '中石油管道', totalHours: 2048, personnelCost: 512000, travelCost: 68400, fixedCost: 8000 },
  { ciId: 'CI-2024-004', name: '中石化储罐', totalHours: 756, personnelCost: 189000, travelCost: 28800, fixedCost: 6000 },
  { ciId: 'CI-2024-006', name: '海油平台', totalHours: 1632, personnelCost: 408000, travelCost: 89200, fixedCost: 15000 },
];
const mockTravelData = [
  { id: 'T-001', ciId: 'CI-2024-001', name: '张小龙', days: 5, allocateDays: 5, cost: 4500 },
  { id: 'T-002', ciId: 'CI-2024-002', name: '刘晓峰', days: 8, allocateDays: 4, cost: 7200 },
  { id: 'T-003', ciId: 'CI-2024-004', name: '钱进', days: 3, allocateDays: 3, cost: 2100 },
];
const mockWageData = [
  { account: 'zhangxiaolong', name: '张小龙', phone: '13800000001', dept: '执行一部', gender: '男', wage: 18500 },
  { account: 'liwei', name: '李伟', phone: '13800000002', dept: '执行一部', gender: '男', wage: 12500 },
  { account: 'wangfang', name: '王芳', phone: '13800000003', dept: '综合部', gender: '女', wage: 9500 },
];

const mockProfitData = [
  { ciId: 'CI-2024-001', name: '中石化设备', totalOutput: 1800000, totalCost: 369600, profit: 1430400, profitRate: 79.47 },
  { ciId: 'CI-2024-004', name: '中石化储罐', totalOutput: 420000, totalCost: 250000, profit: 170000, profitRate: 40.47 },
  { ciId: 'CI-2024-006', name: '海油平台', totalOutput: 850000, totalCost: 830000, profit: 20000, profitRate: 2.35 },
  { ciId: 'CI-2024-002', name: '中石油管道', totalOutput: 1560000, totalCost: 1600000, profit: -40000, profitRate: -2.56 },
];

const mockNotifications = [
  { type: 'danger', icon: '🔴', title: '利润严重亏损预警', desc: 'CI-2024-002 (中石油) 利润率为-2.5%，产生巨亏。' },
  { type: 'warning', icon: '⚠️', title: '技术文档缺失', desc: 'CI-2024-004 非平台项目有 3 项核心技术文件未签发。' },
  { type: 'info', icon: '💰', title: '回款催收提醒', desc: '系统检测: 中石化应收款项 30.5 万元已逾期，触发回款通知。' },
];
"""
with open(os.path.join(base, 'data.js'), 'w', encoding='utf-8') as f:
    f.write(data_js)
print("data.js written!")
