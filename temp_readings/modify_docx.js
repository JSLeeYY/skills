const fs = require('fs');
const path = require('path');

// Paths
const unpackedDir = path.join(__dirname, 'docx_unpacked');
const xmlPath = path.join(unpackedDir, 'word', 'document.xml');
const outputDocx = 'D:\\Desktop\\南京三方一体化数字信息平台优化提升项目谈判文件(2025-新增供应商考核).docx';

// Read original XML
let content = fs.readFileSync(xmlPath, 'utf-8');

// Sub-heading template (bold, 仿宋, outlineLvl=2, same as "质保期服务标准")
function makeSubHeading(text) {
    return `<w:p w14:paraId="${randomParaId()}"><w:pPr><w:keepNext w:val="0"/><w:keepLines w:val="0"/><w:pageBreakBefore w:val="0"/><w:widowControl w:val="0"/><w:kinsoku/><w:wordWrap/><w:overflowPunct/><w:topLinePunct w:val="0"/><w:autoSpaceDE/><w:autoSpaceDN/><w:bidi w:val="0"/><w:adjustRightInd/><w:snapToGrid/><w:spacing w:line="360" w:lineRule="auto"/><w:ind w:left="0" w:leftChars="0" w:firstLine="454" w:firstLineChars="200"/><w:textAlignment w:val="auto"/><w:outlineLvl w:val="2"/><w:rPr><w:rFonts w:hint="eastAsia" w:ascii="仿宋" w:hAnsi="仿宋" w:eastAsia="仿宋" w:cs="仿宋"/><w:b/><w:bCs/><w:spacing w:val="-7"/><w:kern w:val="2"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:eastAsia="zh-CN" w:bidi="ar-SA"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:hint="eastAsia" w:ascii="仿宋" w:hAnsi="仿宋" w:eastAsia="仿宋" w:cs="仿宋"/><w:b/><w:bCs/><w:spacing w:val="-7"/><w:kern w:val="2"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:eastAsia="zh-CN" w:bidi="ar-SA"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;
}

// Body text template (仿宋, firstLine indent 300, same as the maintenance body text)
function makeBodyText(text) {
    return `<w:p w14:paraId="${randomParaId()}"><w:pPr><w:keepNext w:val="0"/><w:keepLines w:val="0"/><w:pageBreakBefore w:val="0"/><w:widowControl w:val="0"/><w:kinsoku/><w:wordWrap/><w:overflowPunct/><w:topLinePunct w:val="0"/><w:autoSpaceDE/><w:autoSpaceDN/><w:bidi w:val="0"/><w:adjustRightInd/><w:snapToGrid/><w:spacing w:line="360" w:lineRule="auto"/><w:ind w:leftChars="0" w:firstLine="720" w:firstLineChars="300"/><w:textAlignment w:val="auto"/><w:rPr><w:rFonts w:hint="eastAsia" w:ascii="仿宋" w:hAnsi="仿宋" w:eastAsia="仿宋" w:cs="仿宋"/><w:sz w:val="24"/><w:szCs w:val="18"/><w:lang w:val="en-US" w:eastAsia="zh-CN"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:hint="eastAsia" w:ascii="仿宋" w:hAnsi="仿宋" w:eastAsia="仿宋" w:cs="仿宋"/><w:sz w:val="24"/><w:szCs w:val="18"/><w:lang w:val="en-US" w:eastAsia="zh-CN"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;
}

// Generate random paragraph ID (8 hex chars)
function randomParaId() {
    return Math.random().toString(16).substring(2, 10).toUpperCase().padEnd(8, '0');
}

// ============================================
// Build new content sections
// ============================================
let newContent = '';

// 3. 付款与质量挂钩要求
newContent += makeSubHeading('付款与质量挂钩要求');
newContent += makeBodyText('各阶段付款须与交付质量挂钩，系统功能上线后需经甲方测试验收通过，且稳定运行一定周期或问题数低于合同约定值后，方可触发对应付款节点，严禁"上线即付款"。');
newContent += makeBodyText('合同总价外，未明确列明的第三方服务费用（包括但不限于中间件、数据库、插件授权费用等）一律由乙方承担，甲方不承担任何隐形费用。');

// 4. 运维期服务范围与标准
newContent += makeSubHeading('运维期服务范围与标准');
newContent += makeBodyText('质保期内，乙方须提供免费运维服务，涵盖现有功能维护及现网问题修复，质保期内不得以任何形式收取"工时费"。乙方不得将合同约定范围内的Bug修复、功能缺陷整改等工作归类为"新需求"并另行收费。');
newContent += makeBodyText('质保期内须包含一定工作量的免费小需求优化或界面调整额度，杜绝"微小改动即收费"的行为。具体免费优化额度由双方协商后写入合同。');

// 5. 服务响应与SLA标准
newContent += makeSubHeading('服务响应与SLA标准');
newContent += makeBodyText('乙方须安排周末及节假日值班人员，确保系统现网问题能够得到及时响应和处理，严禁出现"等工作日再处理"的情况。');
newContent += makeBodyText('乙方须明确远程响应和驻场响应的时间标准，并将响应时效、问题解决时限及对应的违约赔偿条款写入合同。口头承诺不作为考核依据，所有SLA指标须量化并写入合同违约条款。');

// 6. 人员管理要求
newContent += makeSubHeading('人员管理要求');
newContent += makeBodyText('项目经理、系统架构师等核心岗位人员在项目实施期间不得随意更换，如确需更换须提前书面通知甲方并获得甲方书面同意，且替换人员资质不得低于原人员。严禁出现"资深人员谈单、初级人员执行"的情况。');
newContent += makeBodyText('参与本项目的开发人员须为乙方正式员工（以社保缴纳记录为准），严禁将合同工作转包或分包给第三方。如查实存在转包行为，甲方有权解除合同并追究乙方违约责任。');

// 7. 代码质量与技术规范
newContent += makeSubHeading('代码质量与技术规范');
newContent += makeBodyText('乙方须严格执行代码规范，建立并遵守清晰的分支管理制度（如Git Flow），定期进行Code Review。不合规代码必须在甲方提出后限期整改，确保代码结构清晰、可维护、可回滚。');
newContent += makeBodyText('交付代码须通过静态代码扫描工具检测，严重及以上级别Bug数量为零，代码重复率须控制在合理范围内。乙方须向甲方提供扫描报告作为验收依据。');
newContent += makeBodyText('针对Vue2/UniApp技术栈，乙方须在开发阶段主动验证并解决消息通知推送、桌面角标适配、离线推送等技术难点，确保App端功能体验不低于主流即时通讯应用标准。');
newContent += makeBodyText('鉴于Vue2框架已停止官方维护，乙方须承诺在合同期内负责Vue2框架相关安全漏洞的修复工作，或在必要时提供免费的框架升级迁移方案。');

// 8. 性能与兼容性要求
newContent += makeSubHeading('性能与兼容性要求');
newContent += makeBodyText('系统须满足合同约定的并发用户数要求，页面响应时间须符合技术指标。乙方须在交付前完成压力测试，并提供压测报告，压测通过后方可进入验收流程。');
newContent += makeBodyText('App端须覆盖主流Android版本及主流机型（含折叠屏设备），确保界面无错位、功能无异常。乙方须提供兼容性测试报告。');
newContent += makeBodyText('系统通知送达率及离线推送功能须达到行业领先水平，乙方须提供具体的技术实现方案，并对最终送达效果负责。');

// 9. 安全合规与数据保护要求
newContent += makeSubHeading('安全合规与数据保护要求');
newContent += makeBodyText('乙方须配合甲方完成信息安全等级保护自评、系统漏洞检测及DCMM（数据管理能力成熟度评估）等合规性评估工作，确保系统满足相关监管要求。');
newContent += makeBodyText('乙方须制定并落实完整的数据库全量备份与增量备份方案，定期开展数据恢复演练并提供演练报告，确保备份数据的可恢复性和完整性。');
newContent += makeBodyText('远程开发须通过甲方指定的VPN通道进行，代码环境须与外网物理或逻辑隔离，严禁源代码通过非授权渠道传播或泄露。');
newContent += makeBodyText('系统操作日志、用户访问日志留存周期不少于180天，日志数据不可篡改，须满足《中华人民共和国网络安全法》及等级保护的审计要求。');
newContent += makeBodyText('乙方承诺交付的系统不含任何恶意代码、逻辑炸弹、后门程序及隐私窃取功能。如经检测发现存在上述情况，甲方有权要求全额退款并追究乙方法律责任。');

// 10. 知识产权与法律合规要求
newContent += makeSubHeading('知识产权与法律合规要求');
newContent += makeBodyText('本项目所有代码、文档、数据等交付物的知识产权完全归甲方所有，乙方不得将项目成果复用于其他客户或项目。乙方须配合甲方完成软件著作权登记。');
newContent += makeBodyText('乙方须提供完整的第三方开源组件清单及其授权协议说明，严禁使用GPL等传染性开源协议的组件。如使用付费第三方插件或组件，须在合同签订前书面告知甲方，否则相关费用由乙方自行承担。');
newContent += makeBodyText('如交付物中存在第三方知识产权侵权（包括但不限于图片、字体、代码等），由乙方承担全部赔偿责任，并负责协调解决，确保甲方不受任何侵权追诉。');

// 11. 交付物与独立部署要求
newContent += makeSubHeading('交付物与独立部署要求');
newContent += makeBodyText('乙方须完整交付以下文档类材料：系统设计文档（含原型设计、UI设计、接口文档）、测试报告（含功能测试、性能测试、安全测试）、用户操作手册、系统运维手册、等保及DCMM评估报告等。文档须内容详实、可操作，不得流于形式。');
newContent += makeBodyText('乙方须完整交付以下代码及资产类材料：全部源代码（含清晰注释）、部署包、数据库建表及初始化脚本、第三方组件授权文件等。交付物须确保甲方能够脱离乙方环境独立完成系统的部署、运行和验证。');

// 12. 退出机制与数据处理
newContent += makeSubHeading('退出机制与数据处理');
newContent += makeBodyText('合同期满不续约或提前终止合作时，乙方有义务配合甲方或甲方指定的新服务商进行系统交接，交接配合期不少于5个工作日，交接内容包括但不限于技术文档说明、系统架构讲解、运维知识转移等。');
newContent += makeBodyText('合作结束后，乙方须将其持有的甲方所有数据完整移交甲方，并彻底销毁乙方服务器及备份介质上的甲方数据副本，出具书面数据销毁证明。');

// Find insert point: after the last paragraph of "技术培训要求" section
const insertMarker = '为系统管理员提供技术运维培训';
const markerIdx = content.indexOf(insertMarker);
if (markerIdx < 0) {
    console.error('ERROR: Cannot find insert marker text!');
    process.exit(1);
}
const insertIdx = content.indexOf('</w:p>', markerIdx) + '</w:p>'.length;

// Insert the new content
const modifiedContent = content.substring(0, insertIdx) + newContent + content.substring(insertIdx);

// Write modified XML back
fs.writeFileSync(xmlPath, modifiedContent, 'utf-8');
console.log('document.xml modified successfully');
console.log(`Inserted ${newContent.length} characters of new content at position ${insertIdx}`);
console.log(`Output will be: ${outputDocx}`);
