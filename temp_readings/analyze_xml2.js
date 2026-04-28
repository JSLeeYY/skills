const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'docx_unpacked', 'word', 'document.xml');
const content = fs.readFileSync(xmlPath, 'utf-8');

// Find ALL paragraphs by splitting on <w:p> boundaries
// Better approach: find the exact paragraph that contains the last training content

// The last paragraph in the training requirements section
const searchTexts = [
    '为系统管理员提供技术运维培训',
    '确保用户能够熟练使用系统'
];

for (const text of searchTexts) {
    const idx = content.indexOf(text);
    if (idx < 0) { console.log(`NOT FOUND: ${text}`); continue; }

    // Find the enclosing <w:p ...> ... </w:p>
    // Go backwards to find the start of this paragraph
    let searchBack = idx;
    let pStart = -1;
    while (searchBack > 0) {
        let pos = content.lastIndexOf('<w:p', searchBack);
        if (pos < 0) break;
        // Check if this is <w:p> or <w:p  (with space for attributes) and not <w:pPr or <w:pStyle etc
        let nextChar = content[pos + 4];
        if (nextChar === '>' || nextChar === ' ') {
            pStart = pos;
            break;
        }
        searchBack = pos - 1;
    }

    let pEnd = content.indexOf('</w:p>', idx) + '</w:p>'.length;

    console.log(`=== Paragraph containing "${text.substring(0, 20)}..." ===`);
    console.log(`Start: ${pStart}, End: ${pEnd}`);
    console.log(`Length: ${pEnd - pStart}`);
    console.log(content.substring(pStart, pEnd));
    console.log('\n');
}

// Also find what comes IMMEDIATELY after the training section
// The training section has 2 paragraphs of body text after "技术培训要求" heading
// Let's find the paragraph right after the last training paragraph
const lastText = '为系统管理员提供技术运维培训';
const lastIdx = content.indexOf(lastText);
const lastPEnd = content.indexOf('</w:p>', lastIdx) + '</w:p>'.length;

console.log('=== NEXT 500 chars after last training paragraph ===');
console.log(content.substring(lastPEnd, lastPEnd + 500));
console.log('\nInsert point:', lastPEnd);
