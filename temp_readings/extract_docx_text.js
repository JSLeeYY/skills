const fs = require('fs');
const path = require('path');

const docXmlPath = path.join(__dirname, 'docx_unpacked', 'word', 'document.xml');
const content = fs.readFileSync(docXmlPath, 'utf-8');

// Extract text from w:t tags
const textRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
const paragraphRegex = /<w:p[\s>]/g;

// Split by paragraphs and extract text
const paragraphs = content.split(/<w:p[\s>]/);
const result = [];

for (const para of paragraphs) {
  const texts = [];
  let match;
  const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
  while ((match = regex.exec(para)) !== null) {
    texts.push(match[1]);
  }
  if (texts.length > 0) {
    result.push(texts.join(''));
  }
}

const outputPath = path.join(__dirname, 'docx_text_output.txt');
fs.writeFileSync(outputPath, result.join('\n'), 'utf-8');
console.log(`Extracted ${result.length} paragraphs to ${outputPath}`);
