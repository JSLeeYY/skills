---
name: single-md-task-log
description: Create and follow a strict single-Markdown task log. Use when the user explicitly requires one Markdown file only for the whole task or across continuing work, forbids multiple separate documents, requires one appended record after each completed task node, mandates a fixed four-part record covering task content, concrete execution method, current completion progress, and remaining issues or follow-up work, or expects future windows and agents to resume correctly from the same log file.
---

# Single MD Task Log

## Overview

Use exactly one fixed global Markdown file as the only execution record across this computer for all continuing user work that adopts this skill. Do not create per-folder, per-repo, or per-task log files when this skill is active. Append a new record after each completed node so the full history stays in one place and any later window or agent can resume from that same file alone.

## Non-Negotiable Rules

1. Use one fixed global Markdown file only.
2. Do not create multiple independent progress, summary, plan, or note documents for the same task or for parallel tasks covered by this skill.
3. Append a new record after each completed task node.
4. Ensure every record contains all four required items.

## Fixed Log File

Unless the user explicitly overrides it, always use this exact file as the authoritative global log:

`D:\DevelopmentLocation\agent skill\skills\skills\single-md-task-log-worklog.md`

## Workflow

1. Use the fixed global log file path above unless the user explicitly changes it.
2. Create the file if it does not exist, or reuse the existing file if it already exists.
3. Read the current contents before doing substantive work so the existing log becomes the starting context for this run.
4. Append one new record after each completed task node instead of rewriting prior records.
5. Reuse the exact field labels required by the user when they are provided explicitly.
6. If the user does not supply exact labels, use the fixed four-field fallback template below.
7. Before finishing, verify that no second progress document was created for the same task and that no per-folder or per-repo shadow log was introduced.

## Resume Rule

- On every new window, handoff, or agent run, read the current global log first.
- Treat the global log as the authoritative task memory when conversation context is incomplete.
- If the global log and the current conversation disagree, record the discrepancy in the next appended entry and state which version is currently trusted.

## Persistent Preference Rule

- If the user explicitly states that this skill should become the default operating rule, treat that instruction as a standing preference in subsequent work unless the user explicitly turns it off.
- Under that standing preference, always read the fixed global log first and keep appending to it without waiting for the user to repeat the reminder.
- Do not fall back to per-folder, per-repo, or per-task logs while that standing preference remains in effect.

## Record Template

If the user mandates exact labels, copy them verbatim from the request. Otherwise use this template for every appended record:

```md
## Record NN
Task Content:
Concrete Execution Method:
Current Completion Progress:
Open Issues and Follow-ups:
```

## Writing Rules

- Reuse the same fixed global Markdown file across windows, folders, repositories, and related tasks unless the user explicitly changes the logging policy.
- Keep the file append-only unless the user explicitly asks for cleanup or reformatting.
- Preserve historical records; do not delete earlier records unless the user explicitly requests cleanup.
- Reflect requirement changes in the next appended record instead of silently rewriting earlier records.
- Keep each record factual, concise, and operational.
- Write in the user's language unless the user explicitly requests another language.
- Keep the record human-readable; do not use shorthand, mojibake, or opaque references that would block a fresh reader.
- Ensure each record covers task content, concrete execution method, current completion progress, and remaining issues or follow-up work.
- Make each record self-contained enough that another agent can resume from the file alone.
- Name the key files, commands, SQL, decisions, and outcomes that materially changed the task state.
- When the user confirms that a proposed fix worked or failed, record that result explicitly.
- List blockers, missing inputs, permission limits, validation gaps, or policy changes in the final field of each record.

## Completion Check

Before closing the task, verify these conditions:

- The global log file path remained fixed throughout execution unless the user explicitly changed it.
- No extra progress document was created for the same task or as a competing local shadow log.
- Every completed node has a corresponding appended record.
- Each record includes all four required fields.
- The final log is readable enough for a new agent to resume without relying on the full chat history.
- The final record clearly states what is done and what, if anything, still needs follow-up.
