# PECMS接口验收报告

## 一、基本信息

| 项目 | 内容 |
| --- | --- |
| 甲方 | 五环工程公司 |
| 乙方 | [待填写] |
| 验收内容 | PECMS公共接口交付验收 |
| 接口总数 | 87 项 |
| 请求地址前缀 | https://pecms.com.cn |
| 请求方式统计 | GET 24 项，POST 63 项 |
| 验收日期 | [待填写] |
| 验收结论 | 通过 |

## 二、验收说明

根据《PECMS接口清单-五环工程公司.docx》，乙方向甲方提供 PECMS 公共接口服务。本报告仅针对接口交付内容进行验收，验收范围包括接口名称、接口编号（if-id）、请求方式、请求 uri、鉴权规则、请求参数、响应状态及响应结构。

本次验收不包含平台部署、服务器环境、数据库、源代码、运维服务及其他非接口交付事项。

## 三、验收依据

1. 《PECMS接口清单-五环工程公司.docx》
2. 双方确认的接口对接范围、接口调用规则及接口报文说明

## 四、验收范围

本次纳入验收的接口共 87 项，其中 GET 接口 24 项，POST 接口 63 项。

接口清单覆盖项目、派单、设备、文件、图片、文档、报表、进度、异常问题、数据分析、监理日志、监理总结等对外提供的数据访问与查询能力。

接口调用请求头统一包含 `access-key`、`timestamp`、`if-id`、`sign` 等字段，满足甲方按统一规则进行调用、鉴权和接入的需要。

## 五、验收结果

| 序号 | 验收项目 | 验收结果 | 说明 |
| --- | --- | --- | --- |
| 1 | 接口范围 | 通过 | 本次验收仅针对乙方向甲方提供的 PECMS 公共接口。 |
| 2 | 清单对应性 | 通过 | 接口名称、if-id、请求方式、请求 uri 与接口清单一致。 |
| 3 | 鉴权规则 | 通过 | 请求头已明确 access-key、timestamp、if-id、sign 等调用规则。 |
| 4 | 参数定义 | 通过 | 各接口已明确 Path、Body、Query 等请求参数及是否必填。 |
| 5 | 响应结构 | 通过 | 各接口已明确响应状态码、返回数据结构及示例报文。 |
| 6 | 文件能力 | 通过 | 涉及附件、图片、文档、报表等接口已提供访问说明。 |

## 六、接口验收明细表

| 序号 | 接口名称 | if-id | 方法 | 请求 uri | 结果 |
| --- | --- | --- | --- | --- | --- |
| 1 | 项目列表接口 | 30 | POST | `/imp/imp-api/Pecms/open/api/project/list` | 通过 |
| 2 | 项目详情接口 | 31 | GET | `/imp/imp-api/Pecms/open/api/project/pDetail/{id}` | 通过 |
| 3 | 项目-设备信息 | 84 | GET | `/imp/imp-api/Pecms/open/api/project/device/{projectId}` | 通过 |
| 4 | 装置分类 | 32 | GET | `/imp/imp-api/Pecms/open/api/project/apparatus/{projectId}` | 通过 |
| 5 | 设备分类 | 33 | GET | `/imp/imp-api/Pecms/open/api/treeDataByType` | 通过 |
| 6 | 根据字典类型查询字典数据 | 88 | GET | `/imp/imp-api/Pecms/open/api/dictByType` | 通过 |
| 7 | 根据项目查询派遣单列表 | 34 | POST | `/imp/imp-api/Pecms/open/api/dispatch/listByPro` | 通过 |
| 8 | 获取派单-基本信息 | 75 | GET | `/imp/imp-api/Pecms/open/api/dispatch/detail/{dispatchId}` | 通过 |
| 9 | 获取派单-设备信息 | 76 | GET | `/imp/imp-api/Pecms/open/api/dispatch/device/{dispatchId}` | 通过 |
| 10 | 获取派单-其他信息 | 77 | GET | `/imp/imp-api/Pecms/open/api/dispatch/other/{dispatchId}` | 通过 |
| 11 | 文件下载 | 80 | GET | `/imp/imp-api/Pecms/open/api/file/download` | 通过 |
| 12 | 图片预览 | 83 | GET | `/imp/imp-api/Pecms/open/api/comm/fileAvatarView` | 通过 |
| 13 | 转动设备-外协件外购件状态表查看 | 13 | POST | `/imp/imp-api/Pecms/open/api/rotating/externalProcurement` | 通过 |
| 14 | 转动设备-主要零部件状态表查看 | 14 | POST | `/imp/imp-api/Pecms/open/api/rotating/mainComponents` | 通过 |
| 15 | 转动设备-图纸工艺文件状态表查看 | 15 | POST | `/imp/imp-api/Pecms/open/api/rotating/drawingProcess` | 通过 |
| 16 | 阀门-外协件外购件状态表查看 | 16 | POST | `/imp/imp-api/Pecms/open/api/valve/externalProcurement` | 通过 |
| 17 | 阀门-棒材状态表查看 | 17 | POST | `/imp/imp-api/Pecms/open/api/valve/barStock` | 通过 |
| 18 | 阀门-铸件状态表查看 | 18 | POST | `/imp/imp-api/Pecms/open/api/valve/casting` | 通过 |
| 19 | 阀门-锻件状态表查看 | 19 | POST | `/imp/imp-api/Pecms/open/api/valve/forging` | 通过 |
| 20 | 阀门-图纸工艺文件状态表查看 | 20 | POST | `/imp/imp-api/Pecms/open/api/valve/drawingProcess` | 通过 |
| 21 | 静设备-外协件外购件状态表查看 | 21 | POST | `/imp/imp-api/Pecms/open/api/static/outsourceAndPurchase` | 通过 |
| 22 | 静设备-板材状态表查看 | 22 | POST | `/imp/imp-api/Pecms/open/api/static/boardStatus` | 通过 |
| 23 | 静设备-换热管状态表查看 | 23 | POST | `/imp/imp-api/Pecms/open/api/static/heatExchangeTube` | 通过 |
| 24 | 静设备-锻件状态表查看 | 24 | POST | `/imp/imp-api/Pecms/open/api/static/forging` | 通过 |
| 25 | 静设备-焊材状态表查看 | 25 | POST | `/imp/imp-api/Pecms/open/api/static/weldingMaterial` | 通过 |
| 26 | 静设备-图纸工艺文件状态表查看 | 26 | POST | `/imp/imp-api/Pecms/open/api/static/drawingStatus` | 通过 |
| 27 | 炉类-外协件外购件状态表查看 | 49 | POST | `/imp/imp-api/Pecms/open/api/furnace/externalProcurement` | 通过 |
| 28 | 炉类-炉管状态表查看 | 50 | POST | `/imp/imp-api/Pecms/open/api/furnace/tubeStatus` | 通过 |
| 29 | 炉类-衬里状态表查看 | 51 | POST | `/imp/imp-api/Pecms/open/api/furnace/liningStatus` | 通过 |
| 30 | 炉类-钢结构状态表查看 | 53 | POST | `/imp/imp-api/Pecms/open/api/furnace/steelStatus` | 通过 |
| 31 | 炉类-集合管状态表查看 | 54 | POST | `/imp/imp-api/Pecms/open/api/furnace/collectingDuct` | 通过 |
| 32 | 炉类-图纸工艺文件状态表查看 | 55 | POST | `/imp/imp-api/Pecms/open/api/furnace/drawingProcess` | 通过 |
| 33 | 电气及其他通用设备-外协件外购件状态表查看 | 60 | POST | `/imp/imp-api/Pecms/open/api/electrical/externalProcurement` | 通过 |
| 34 | 电气及其他通用设备-主要零部件状态表查看 | 61 | POST | `/imp/imp-api/Pecms/open/api/electrical/mainComponents` | 通过 |
| 35 | 电气及其他通用设备-图纸工艺文件状态表查看 | 62 | POST | `/imp/imp-api/Pecms/open/api/electrical/drawingProcess` | 通过 |
| 36 | 派单-文件目录 | 78 | GET | `/imp/imp-api/Pecms/open/api/dispatch/file/catalogue/{dispatchId}` | 通过 |
| 37 | 派单-文件列表 | 79 | POST | `/imp/imp-api/Pecms/open/api/dispatch/file/list` | 通过 |
| 38 | 根据项目查询统计报表文件清单 | 87 | GET | `/imp/imp-api/Pecms/open/api/project/file/{projectId}` | 通过 |
| 39 | 根据项目查询统计报表所有内容 | 86 | GET | `/imp/imp-api/Pecms/open/api/project/doc/{projectId}` | 通过 |
| 40 | 根据项目查询图纸内容 | 85 | GET | `/imp/imp-api/Pecms/open/api/project/drawingProcess/{projectId}` | 通过 |
| 41 | 设备进度信息 | 35 | POST | `/imp/imp-api/Pecms/open/api/progress/device` | 通过 |
| 42 | 进度预览 | 36 | POST | `/imp/imp-api/Pecms/open/api/progress/preview` | 通过 |
| 43 | 进度曲线图 | 37 | POST | `/imp/imp-api/Pecms/open/api/progress/lineChart` | 通过 |
| 44 | 监理联系单列表 | 38 | POST | `/imp/imp-api/Pecms/open/api/workList` | 通过 |
| 45 | 监理联系单详情 | 39 | GET | `/imp/imp-api/Pecms/open/api/workDetail/{id}` | 通过 |
| 46 | 工程师通知单列表 | 40 | POST | `/imp/imp-api/Pecms/open/api/noticesList` | 通过 |
| 47 | 工程师通知单详情 | 41 | GET | `/imp/imp-api/Pecms/open/api/noticesDetail/{id}` | 通过 |
| 48 | 重大问题提报单列表 | 42 | POST | `/imp/imp-api/Pecms/open/api/majorProblemsList` | 通过 |
| 49 | 重大问题提报单详情 | 43 | GET | `/imp/imp-api/Pecms/open/api/majorProblemsDetail/{id}` | 通过 |
| 50 | 异常问题列表 | 44 | POST | `/imp/imp-api/Pecms/open/api/problemList` | 通过 |
| 51 | 异常问题详情 | 45 | GET | `/imp/imp-api/Pecms/open/api/problemDetail/{id}` | 通过 |
| 52 | 监理周报列表 | 46 | POST | `/imp/imp-api/Pecms/open/api/weeklyList` | 通过 |
| 53 | 监理周报详情 | 52 | GET | `/imp/imp-api/Pecms/open/api/weeklyDetail/{id}` | 通过 |
| 54 | 查询日周月报列表 | 93 | POST | `/imp/imp-api/Pecms/open/api/reportList` | 通过 |
| 55 | 根据日周月报ID查询详细信息 | 94 | POST | `/imp/imp-api/Pecms/open/api/reportDetail/{id}` | 通过 |
| 56 | 放行单列表 | 47 | POST | `/imp/imp-api/Pecms/open/api/releaseNoteList` | 通过 |
| 57 | 放行单详情 | 48 | GET | `/imp/imp-api/Pecms/open/api/releaseNoteDetail/{id}` | 通过 |
| 58 | 派单-文档管理-文档管理类型 | 81 | POST | `/imp/imp-api/Pecms/open/api/dispatch/doc/type` | 通过 |
| 59 | 派单-文档管理-文件列表 | 82 | POST | `/imp/imp-api/Pecms/open/api/dispatch/doc/file/list` | 通过 |
| 60 | 数据分析-查询条件-委托方 | 56 | GET | `/imp/imp-api/Pecms/open/api/project/analysis/select/client/list/{projectId}` | 通过 |
| 61 | 数据分析-查询条件-制造厂 | 57 | GET | `/imp/imp-api/Pecms/open/api/project/analysis/select/supplier/list/{projectId}` | 通过 |
| 62 | 数据分析-查询条件-设备类型 | 58 | GET | `/imp/imp-api/Pecms/open/api/project/analysis/select/device/type/list` | 通过 |
| 63 | 数据分析-查询条件-设备 | 59 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/select/device/list` | 通过 |
| 64 | 数据分析-报表-装置分类 | 63 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/category` | 通过 |
| 65 | 数据分析-报表-设备分类 | 64 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/device` | 通过 |
| 66 | 数据分析-报表-设备进度 | 65 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/plan` | 通过 |
| 67 | 数据分析-报表-大件吊装设备 | 66 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/lifting` | 通过 |
| 68 | 数据分析-报表-图纸工艺文件状态 | 67 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/drawing` | 通过 |
| 69 | 数据分析-报表-主要原材料外协外购件状态 | 68 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/outsourcing` | 通过 |
| 70 | 数据分析-报表-异常问题 | 69 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/problem` | 通过 |
| 71 | 数据分析-报表-设备明细-装置分类/设备分类/大件吊装设备 | 70 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/device/list` | 通过 |
| 72 | 数据分析-报表-设备明细-图纸工艺 | 71 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/drawing/device/list` | 通过 |
| 73 | 数据分析-报表-设备明细-设备进度 | 72 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/plan/device/list` | 通过 |
| 74 | 数据分析-报表-设备明细-主要原材料 | 73 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/outsourcing/device/list` | 通过 |
| 75 | 数据分析-报表-异常问题-异常明细 | 74 | POST | `/imp/imp-api/Pecms/open/api/project/analysis/chart/problem/list` | 通过 |
| 76 | 根据租户查询检验主管列表 | 89 | GET | `/imp/imp-api/Pecms/open/api/company/chiefInspector/list` | 通过 |
| 77 | 接受业主附件数据 | 90 | POST | `/imp/imp-api/Pecms/open/api/company/disclose/file/upload` | 通过 |
| 78 | 接受业主基本信息 | 91 | POST | `/imp/imp-api/Pecms/open/api/company/disclose/save` | 通过 |
| 79 | 根据项目ID、派单ID查询文档目录各版本明细数据-响应参数 | 97 | POST | `/imp/imp-api/Pecms/open/api/project/document/version/list` | 通过 |
| 80 | 根据派单ID、文件类型、版本信息查询文档报表明细数据-响应参数 | 98 | POST | `/imp/imp-api/Pecms/open/api/project/document/report/detail` | 通过 |
| 81 | 查询录入细则必选表单报表详情 | 92 | POST | `/imp/imp-api/Pecms/open/api/project/document/required-form/list` | 通过 |
| 82 | 根据项目ID、派单ID查询人员交接明细数据 | 99 | POST | `/imp/imp-api/Pecms/open/api/project/handover/list` | 通过 |
| 83 | 根据项目ID、派单ID查询到岗明细数据-响应参数 | 100 | POST | `/imp/imp-api/Pecms/open/api/project/sign/list` | 通过 |
| 84 | 根据项目ID、派单ID查询设备申请明细数据-响应参数 | 101 | POST | `/imp/imp-api/Pecms/open/api/project/device/apply/list` | 通过 |
| 85 | 查询监理日志及填报日期清单 | 95 | POST | `/imp/imp-api/Pecms/open/api/project/log/list` | 通过 |
| 86 | 用于根据日志 ID 与日期查询填报详情 | 96 | POST | `/imp/imp-api/Pecms/open/api/project/log/detail` | 通过 |
| 87 | 查询监理总结各版本明细数据 | 102 | POST | `/imp/imp-api/Pecms/open/api/project/summary/version/list` | 通过 |

## 七、验收结论

经对照《PECMS接口清单-五环工程公司》进行核对，本次提交的 PECMS 公共接口清单范围明确、接口调用规则清晰、请求方式与请求 uri 定义完整、请求参数与响应结构说明齐备，满足甲方对接口交付验收的要求。

综上，本次乙方向甲方提供的 PECMS 接口交付内容，同意通过接口验收。

## 八、签署确认

| 单位 | 代表/负责人 | 签字 | 日期 |
| --- | --- | --- | --- |
| 甲方（五环工程公司） |  |  |  |
| 乙方 |  |  |  |

