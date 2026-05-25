# 2026年4月 PECMS（对内/对外）与安全管理平台 Bug 处理归档

## 1. 归档范围
- 时间范围：`2026-04-01` 至 `2026-04-30`
- 检索来源：
  - `D:\DevelopmentLocation\agent skill\skills\word_project\single-markdown-worklog.md`
  - `D:\DevelopmentLocation\agent skill\skills\skills\single-md-task-log-worklog.md`
  - `C:\Users\lenovo\.codex\memories\auto-session-memory\case-bookmarks.md`
  - `C:\Users\lenovo\.codex\memories\auto-session-memory\raw-events\2026-04-24.events.jsonl`
  - `C:\Users\lenovo\.codex\sessions\2026\04\*.jsonl`
- 纳入口径：只纳入日志中明确体现“已排查 / 已定位 / 已给出修复方案 / 已修复 / 用户确认解决”的 bug；需求清单、合同条款、验收资料中的“缺陷清单 / 整改闭环”字样不计入真实 bug 处理记录。

## 2. 结论摘要
- `2026-04` 可证实的 bug 处理记录：`2` 条
- 明确偏向 `PECMS` 派单 / 报表链路：`1` 条
- 明确属于安全管理平台并已处理闭环：`0` 条
- 系统归属未在日志中写死、但已形成可复用修复 SOP：`1` 条
- 4 月大量出现的 `PECMS`、`安全管理平台` 相关记录，主要是三期需求、付款节点、验收条款、缺陷清单口径，不属于“当月已实际处理的 bug”。

## 3. Bug 明细

### 3.1 PECMS 报表链路 SQL 报错（已修复）
- 时间定位：日志补记并确认时间不晚于 `2026-04-24`；首次处理日未在原日志中显式写明。
- 系统归属：`PECMS`（对内 / 对外共用的派单 / 报表链路，按函数和表名判断倾向成立）
- 问题现象：报表 `Sheet1` 的 `G4` 节点触发 SQL 相关 bug，异常链路追到 `getSupplierid('1865686849400016898','1624319429024215042')`。
- 根因定位：问题不在主报表 SQL，也不在 `sys_evaluate` 展示字段；真实根因是 `getSupplierid` 函数把同一个 `supplierid` 重复拼接了 `13` 次，返回串长度达到 `259`，超过函数定义 `RETURNS varchar(255)`。
- 处理动作：采用最小改动修复方案，将 `getSupplierid` 的返回长度由 `varchar(255)` 提升为 `varchar(1000)`，其余逻辑不动。
- 处理结果：用户确认按该方案修改函数后，报表 bug 已解决。
- 遗留风险：当前只是止血修复；函数内部“重复拼接同一 `supplierid`”的逻辑缺陷仍在，后续应评估改为去重拼接。
- 证据来源：
  - `D:\DevelopmentLocation\agent skill\skills\skills\single-md-task-log-worklog.md` 记录 `14`、`15`
  - `C:\Users\lenovo\.codex\memories\auto-session-memory\raw-events\2026-04-24.events.jsonl`
  - `C:\Users\lenovo\.codex\sessions\2026\04\22\rollout-2026-04-22T08-45-26-019db2a6-2617-7262-9fc2-5fe15e3ae787.jsonl`

### 3.2 “验收标准 -> 材料牌号”下拉联动异常（已修复，系统归属待确认）
- 时间定位：记录至少在 `2026-04-24` 已存在；原工作日志未显式写明首次处理日。
- 系统归属：日志未直接写明属于 `PECMS` 对内 / 对外或安全管理平台，暂标记为“归属待确认”。
- 问题现象：材料牌号下拉框需要根据验收标准联动筛选，但原配置会出现“下拉能筛出数据，最终无论选哪个都回显成同一个牌号”的问题。
- 根因判断：问题关键不在继续调整原有联动表达式，而在于下拉控件没有回写牌号自身唯一值。
- 处理动作：
  - 查询 SQL 调整为：

```sql
select a.* from (
    select
        t2.id,
        t.standardname,
        t.id as ph_id
    from sys_standard t
    left join sys_standard t1 on t.parent_id = t1.id
    left join sys_standard t2 on t1.parent_id = t2.id
    where t.type = 1
) a
where 1 = 1
```

  - 配置口径收敛为：数据列 `ph_id`、显示列 `standardname`、联动条件 `id=={e4}`，并勾选“惰性初始化”“每次输入时，动态数据过滤”。
- 处理结果：下拉可正常打开并查询数据，牌号显示恢复正常，不再出现“选任意值都回显成同一个牌号”。
- 遗留风险：当前仅能确认修复方案有效，不能仅凭现有日志将其硬归属到 `PECMS` / 安全管理平台中的某一套系统。
- 证据来源：
  - `D:\DevelopmentLocation\agent skill\skills\word_project\single-markdown-worklog.md` 记录 `01`、`02`
  - `C:\Users\lenovo\.codex\memories\auto-session-memory\case-bookmarks.md` 案例 `001`
  - `C:\Users\lenovo\.codex\memories\auto-session-memory\raw-events\2026-04-24.events.jsonl`

## 4. 本月未纳入项说明
- `2026-04-22` 到 `2026-04-24` 期间，大量 `PECMS（对内+对外PC）`、`安全管理模块三期优化改造`、`缺陷清单`、`整改闭环记录` 相关内容，主要出现在付款节点、谈判文件、验收资料要求和需求拆解中。
- 这些记录说明项目文件里已经把“缺陷清单 / 整改闭环 / 问题台账”列为交付要求，但它们不是“你在 2026 年 4 月已经实际处理过的 bug 记录”，因此本归档不计入 bug 数量。
- 本次检索未找到“安全管理平台在 2026 年 4 月已实际处理并闭环”的直接 bug 日志证据。如果当月还有线下或其他目录的排障记录，需要补充对应文件位置后才能继续补档。

## 5. 最终归档判断
- 如果按“严格能证实”为标准，`2026-04` 与你处理相关的 bug 记录共 `2` 条。
- 其中 `1` 条可明确归入 `PECMS` 派单 / 报表链路；安全管理平台暂无可证实闭环 bug 记录；另 `1` 条下拉联动问题已解决，但系统归属在现有日志中没有写死。
- 因此，当前能落档的最稳妥结论是：`PECMS 1 条已修复 + 归属待确认 1 条已修复 + 安全管理平台 0 条已证实闭环`。
