const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'docx_unpacked', 'word', 'document.xml');
const content = fs.readFileSync(xmlPath, 'utf-8');

// Find the paragraph containing "技术培训要求"
let idx = content.indexOf('技术培训要求');
console.log('Found "技术培训要求" at char index:', idx);

// Find "为系统管理员提供技术运维培训" - this is the last paragraph in the training section
let lastTrainingIdx = content.indexOf('为系统管理员提供技术运维培训');
console.log('Found last training paragraph at char index:', lastTrainingIdx);

// Find "第五章" - this starts after our target section
let ch5Idx = content.indexOf('第五章');
console.log('Found "第五章" at char index:', ch5Idx);

// Now let's find the closing </w:p> of the last training paragraph
if (lastTrainingIdx > 0) {
    let closingPIdx = content.indexOf('</w:p>', lastTrainingIdx);
    console.log('Closing </w:p> after last training paragraph at:', closingPIdx);

    // Show some context around the closing tag
    let insertPoint = closingPIdx + '</w:p>'.length;
    console.log('\n=== Content BEFORE insert point (last 300 chars) ===');
    console.log(content.substring(insertPoint - 300, insertPoint));
    console.log('\n=== Content AFTER insert point (first 300 chars) ===');
    console.log(content.substring(insertPoint, insertPoint + 300));

    // Save the insert position
    console.log('\nInsert position (char index):', insertPoint);
}

// Now let's extract the paragraph format pattern used in this section
// Find the "质保期服务标准" sub-heading to get its full XML
let subHeadingIdx = content.indexOf('质保期服务标准');
if (subHeadingIdx > 0) {
    // Go backwards to find <w:p
    let pStart = content.lastIndexOf('<w:p ', subHeadingIdx);
    if (pStart < 0) pStart = content.lastIndexOf('<w:p>', subHeadingIdx);
    let pEnd = content.indexOf('</w:p>', subHeadingIdx) + '</w:p>'.length;
    console.log('\n=== Sub-heading paragraph XML (质保期服务标准) ===');
    console.log(content.substring(pStart, pEnd));
}

// Find a body text paragraph's format pattern (e.g. "维护期为项目验收通过后12个月")
let bodyIdx = content.indexOf('维护期为项目验收通过后12个月');
if (bodyIdx > 0) {
    let pStart = content.lastIndexOf('<w:p ', bodyIdx);
    if (pStart < 0) pStart = content.lastIndexOf('<w:p>', bodyIdx);
    let pEnd = content.indexOf('</w:p>', bodyIdx) + '</w:p>'.length;
    console.log('\n=== Body text paragraph XML (维护期为项目验收通过后...) ===');
    console.log(content.substring(pStart, pEnd));
}
