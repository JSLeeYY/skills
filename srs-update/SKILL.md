---
name: srs-update
description: Manage SRS (Software Requirements Specification) document updates through a structured confirmation workflow. Use when working with SRS documents and need to: (1) Create confirmation documents comparing SRS descriptions with actual implementations, (2) Update SRS content with confirmed implementation details, (3) Track and document differences between requirements and implementations. Supports the workflow of actual implementation → confirmation document → SRS update.
---

# SRS Update Workflow

## Overview

This skill manages the complete workflow for updating SRS documents based on actual implementations:

1. **Create confirmation document** - Generate structured comparison documents
2. **Review and confirm** - Stakeholders review and approve changes
3. **Update SRS** - Automatically apply confirmed changes to SRS documents

## Quick Start

### Create a Confirmation Document

Generate a confirmation document template for a module:

```bash
python scripts/create_confirmation_doc.py <模块名> <SRS章节> <输出目录>
```

Example:
```bash
python scripts/create_confirmation_doc.py 监理人员动态 §5 ./需求确认签批
```

This creates a document named `YYYYMMDD_模块名_完整功能确认.md` with structured sections for comparing SRS descriptions with actual implementations.

### Update SRS Document

After confirmation document is approved (marked with ☑ 同意 or ✓ 同意), update the SRS:

```bash
python scripts/update_srs.py <确认文档路径> <SRS文档路径>
```

Example:
```bash
python scripts/update_srs.py ./需求确认签批/20260318_动态成本核算_完整功能确认.md ./Operations_and_Management_SRS_Final_V11.md
```

The script automatically:
- Creates a timestamped backup of the SRS document
- Parses confirmed items from the confirmation document
- Replaces SRS descriptions with actual implementation descriptions
- Reports update status for each feature point

## Detailed Guidance

### Confirmation Document Structure

See [references/confirmation_template.md](references/confirmation_template.md) for:
- Document naming conventions
- Complete structure template
- Field-by-field filling guidelines
- Confirmation status markers

### SRS Update Rules

See [references/srs_update_rules.md](references/srs_update_rules.md) for:
- Complete update workflow
- Matching and replacement principles
- Backup mechanisms
- Troubleshooting common issues

## Key Points

### Exact Matching Required

The update script uses exact text matching. The 【SRS原文描述】 in the confirmation document must match the SRS content exactly, including:
- Whitespace and line breaks
- Punctuation
- Markdown formatting

**Best practice**: Copy-paste directly from SRS documents.

### Confirmation Status

Only feature points marked with these statuses are processed:
- `同意`
- `✓`
- `☑`

Unmarked or "不同意" items are skipped.

### Automatic Backup

By default, the update script creates a backup before modifying the SRS:
- Format: `[filename].backup_YYYYMMDD_HHMMSS`
- Skip backup with `--no-backup` flag

## Workflow Example

1. **Implement feature** - Build the actual functionality
2. **Create confirmation doc**:
   ```bash
   python scripts/create_confirmation_doc.py 动态成本核算 §9 ./需求确认签批
   ```
3. **Fill confirmation doc**:
   - Copy SRS original text to 【SRS原文描述】
   - Describe actual implementation in 【实际实现描述】
   - Explain differences in 【差异说明】
   - Mark as `☑ 同意` after review
4. **Update SRS**:
   ```bash
   python scripts/update_srs.py ./需求确认签批/20260318_动态成本核算_完整功能确认.md ./Operations_and_Management_SRS_Final_V11.md
   ```
5. **Verify** - Check the backup and updated SRS document
