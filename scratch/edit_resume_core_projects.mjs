import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2];
const mode = process.argv[3] ?? "inspect";

if (!workbookPath) {
  console.error("Usage: node scratch/edit_resume_core_projects.mjs <xlsx-path> [inspect|apply]");
  process.exit(1);
}

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

function toCellAddress(rowIndex, colIndex) {
  let col = colIndex + 1;
  let label = "";
  while (col > 0) {
    const remainder = (col - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    col = Math.floor((col - 1) / 26);
  }
  return `${label}${rowIndex + 1}`;
}

function normalize(value) {
  if (typeof value === "string") {
    return value.replace(/\s+/g, " ").trim();
  }
  return value;
}

const keywords = [
  "核心项目经验",
  "AI",
  "人工智能",
  "大模型",
  "智能",
  "算法",
  "机器学习",
];

const cellUpdates = new Map([
  [
    "实施顾问-李帅杰 个人简介!B20",
    "面向石化工程领域的监理、检验检测、咨询全流程一体化管理系统，覆盖石化工程项目从前期备案、过程监理、检验检测、报告出具到归档管理的全生命周期业务需求，实现石化工程相关业务的数字化、标准化、精细化管控。",
  ],
  [
    "实施顾问-李帅杰 个人简介!B21",
    "作为项目实施总负责人，全流程统筹项目从前期客户需求调研、业务方案设计、技术架构选型，到中期全栈开发、系统测试与用户培训，再到后期系统上线部署、试运行保障、运维优化的全环节实施与技术管理，保障项目按计划推进并稳定交付。",
  ],
  [
    "实施顾问-李帅杰 个人简介!B22",
    "1. 保障系统100%匹配客户业务需求，按期高质量完成交付并顺利通过客户验收，获得客户高度认可与长期战略合作意向；\n2. 基于Java全栈技术搭建高可用分布式微服务架构，系统上线后运行稳定，核心业务数据处理效率与系统响应速度大幅提升；\n3. 建立需求梳理、开发联调、测试验证、问题闭环的标准化实施机制，大幅缩短项目实施周期，提升交付效率与实施质量；\n4. 完成全流程客户培训与知识转移，保障客户各业务部门快速上手系统，实现石化工程监理、检验检测、咨询管理全业务线的数字化平稳转型，同时沉淀了石化行业数字化项目实施的标准化流程与交付经验。",
  ],
]);

const rowHeightUpdates = new Map([
  ["实施顾问-李帅杰 个人简介!22", 190],
]);

const sheets = workbook.worksheets.items ?? [];
console.log(`Workbook: ${path.resolve(workbookPath)}`);
console.log(`Sheets: ${sheets.map((sheet) => sheet.name).join(", ")}`);

for (const sheet of sheets) {
  const usedRange = sheet.getUsedRange();
  const values = usedRange.values ?? [];
  console.log(`\n[Sheet] ${sheet.name}`);

  for (let rowIndex = 0; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex] ?? [];
    for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
      const cellValue = row[colIndex];
      if (typeof cellValue !== "string") {
        continue;
      }

      const text = normalize(cellValue);
      if (!text) {
        continue;
      }

      const matched = keywords.filter((keyword) => text.includes(keyword));
      if (matched.length > 0) {
        console.log(
          `${toCellAddress(rowIndex, colIndex)} | ${matched.join(", ")} | ${text}`,
        );
      }

      const cellAddress = `${sheet.name}!${toCellAddress(rowIndex, colIndex)}`;
      if (mode === "apply" && cellUpdates.has(cellAddress)) {
        const nextValue = cellUpdates.get(cellAddress);
        if (nextValue !== cellValue) {
          sheet.getCell(rowIndex, colIndex).values = [[nextValue]];
          console.log(`UPDATED ${toCellAddress(rowIndex, colIndex)} -> ${normalize(nextValue)}`);
        }
      }
    }
  }
}

if (mode === "apply") {
  for (const [target, height] of rowHeightUpdates.entries()) {
    const [sheetName, rowNumber] = target.split("!");
    const sheet = workbook.worksheets.getItem(sheetName);
    sheet.getRange(`A${rowNumber}:B${rowNumber}`).format.rowHeight = height;
    console.log(`ROW HEIGHT ${rowNumber} -> ${height}`);
  }
  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(workbookPath);
  await fs.access(workbookPath);
  console.log(`\nSaved: ${path.resolve(workbookPath)}`);
}
