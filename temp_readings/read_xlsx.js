const fs = require('fs');
const path = require('path');

// XLSX is essentially a ZIP file containing XML
// Copy xlsx as zip and extract
const xlsxPath = 'D:\\Desktop\\供应商服务程度评价表.xlsx';
const zipPath = path.join(__dirname, 'temp_xlsx.zip');
const outDir = path.join(__dirname, 'xlsx_unpacked');

// Copy file
fs.copyFileSync(xlsxPath, zipPath);
console.log('File copied to', zipPath);
console.log('File size:', fs.statSync(zipPath).size, 'bytes');
