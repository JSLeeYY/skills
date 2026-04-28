const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'docx_unpacked', 'word', 'document.xml');
const content = fs.readFileSync(xmlPath, 'utf-8');

// Find the sub-heading "质保期服务标准" paragraph XML
const subHeadText = '质保期服务标准';
const subIdx = content.indexOf(subHeadText);
let subStart = subIdx;
while (subStart > 0) {
    let pos = content.lastIndexOf('<w:p ', subStart);
    if (pos < 0) pos = content.lastIndexOf('<w:p>', subStart);
    if (pos < 0) break;
    let nc = content[pos + 4];
    if (nc === '>' || nc === ' ') { subStart = pos; break; }
    subStart = pos - 1;
}
let subEnd = content.indexOf('</w:p>', subIdx) + '</w:p>'.length;
fs.writeFileSync(path.join(__dirname, 'sub_heading_xml.txt'), content.substring(subStart, subEnd), 'utf-8');

// Find a body text paragraph XML (e.g. "维护期为项目验收通过后12个月")
const bodyText = '维护期为项目验收通过后12个月';
const bodyIdx = content.indexOf(bodyText);
let bodyStart = bodyIdx;
while (bodyStart > 0) {
    let pos = content.lastIndexOf('<w:p ', bodyStart);
    if (pos < 0) pos = content.lastIndexOf('<w:p>', bodyStart);
    if (pos < 0) break;
    let nc = content[pos + 4];
    if (nc === '>' || nc === ' ') { bodyStart = pos; break; }
    bodyStart = pos - 1;
}
let bodyEnd = content.indexOf('</w:p>', bodyIdx) + '</w:p>'.length;
fs.writeFileSync(path.join(__dirname, 'body_text_xml.txt'), content.substring(bodyStart, bodyEnd), 'utf-8');

// Find what comes after the last training paragraph
const lastText = '为系统管理员提供技术运维培训';
const lastIdx = content.indexOf(lastText);
const lastPEnd = content.indexOf('</w:p>', lastIdx) + '</w:p>'.length;
fs.writeFileSync(path.join(__dirname, 'after_training.txt'), content.substring(lastPEnd, lastPEnd + 1000), 'utf-8');

// Also get the "所有系统的维护与服务要求" heading XML
const mainHeadText = '所有系统的维护与服务要求';
const mainIdx = content.indexOf(mainHeadText);
let mainStart = mainIdx;
while (mainStart > 0) {
    let pos = content.lastIndexOf('<w:p ', mainStart);
    if (pos < 0) pos = content.lastIndexOf('<w:p>', mainStart);
    if (pos < 0) break;
    let nc = content[pos + 4];
    if (nc === '>' || nc === ' ') { mainStart = pos; break; }
    mainStart = pos - 1;
}
let mainEnd = content.indexOf('</w:p>', mainIdx) + '</w:p>'.length;
fs.writeFileSync(path.join(__dirname, 'main_heading_xml.txt'), content.substring(mainStart, mainEnd), 'utf-8');

console.log('Insert point (char index):', lastPEnd);
console.log('Files written successfully');
