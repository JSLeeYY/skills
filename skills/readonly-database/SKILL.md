---
name: readonly-database
description: Inspect read-only relational databases from connection details. Use when Codex is given a database host, account, password or password environment variable, and database name, and the user asks for table counts, database size in MB, per-table storage, row-count estimates, schema inventory, or safe read-only SQL results. Supports MySQL, PostgreSQL, SQL Server, and SQLite through the bundled script.
---

# Readonly Database

Use this skill to inspect a database without changing data. Prefer the bundled script over hand-written ad hoc commands because it centralizes connection handling, read-only guardrails, result limiting, and size queries.

## Safety Rules

- Use a database account with read-only permissions whenever possible.
- Do not place live passwords in final answers, logs, screenshots, or committed files.
- Prefer a temporary environment variable for the password:

```powershell
$env:DB_PASSWORD = "secret"
python .\skills\readonly-database\scripts\readonly_db_inspect.py --type mysql --host db.example.com --port 3306 --database appdb --user readonly --password-env DB_PASSWORD --mode summary
Remove-Item Env:DB_PASSWORD
```

- If the user sends a raw password, do not repeat it. Pass it only to the script and redact it from any summary.
- Custom SQL must be one read-only statement. The script rejects common write/DDL/admin verbs and only fetches up to `--limit` rows.

## Workflow

1. Identify the database type: `mysql`, `postgresql`, `sqlserver`, or `sqlite`.
2. Gather only the connection fields needed for that type:
   - MySQL/PostgreSQL/SQL Server: host, port, database, user, password or password env var.
   - SQLite: database file path through `--database`.
3. Run `summary` first for table count and total MB.
4. Run `tables` when the user wants per-table sizes or row estimates.
5. Run `query` only for user-requested read-only SQL, with a small `--limit` unless the user explicitly needs more.
6. Report concise results and mention whether row counts are exact or estimated for that engine.

## Common Commands

MySQL summary:

```powershell
python .\skills\readonly-database\scripts\readonly_db_inspect.py --type mysql --host HOST --port 3306 --database DB --user USER --password-env DB_PASSWORD --mode summary
```

PostgreSQL table sizes for one schema:

```powershell
python .\skills\readonly-database\scripts\readonly_db_inspect.py --type postgresql --host HOST --port 5432 --database DB --user USER --password-env DB_PASSWORD --schema public --mode tables
```

SQL Server summary:

```powershell
python .\skills\readonly-database\scripts\readonly_db_inspect.py --type sqlserver --host HOST --port 1433 --database DB --user USER --password-env DB_PASSWORD --mode summary
```

SQLite summary:

```powershell
python .\skills\readonly-database\scripts\readonly_db_inspect.py --type sqlite --database .\data\app.db --mode summary
```

Safe custom query:

```powershell
python .\skills\readonly-database\scripts\readonly_db_inspect.py --type postgresql --host HOST --database DB --user USER --password-env DB_PASSWORD --mode query --sql "select * from public.orders order by created_at desc" --limit 20
```

## Output Guidance

- For database-size questions, report:
  - table count
  - total size MB
  - top tables by MB when useful
  - engine-specific caveats, such as MySQL/PostgreSQL row counts being estimates in metadata views
- For custom query questions, report only the relevant rows/aggregates. Do not dump large raw result sets.
- If a driver is missing, install the smallest matching Python package:
  - MySQL: `pip install pymysql`
  - PostgreSQL: `pip install psycopg2-binary` or `pip install psycopg`
  - SQL Server: `pip install pyodbc` plus a local ODBC Driver for SQL Server
