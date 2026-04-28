#!/usr/bin/env python3
"""Read-only database inspection helper.

Supports metadata size summaries for MySQL, PostgreSQL, SQL Server, and SQLite.
Custom query mode accepts only a single conservative read-only statement and
fetches a bounded number of rows.
"""

from __future__ import annotations

import argparse
import datetime as dt
import decimal
import getpass
import json
import os
import re
import sqlite3
import sys
from pathlib import Path
from typing import Any, Iterable


FORBIDDEN_SQL_WORDS = {
    "alter",
    "analyze",
    "attach",
    "backup",
    "begin",
    "call",
    "checkpoint",
    "commit",
    "copy",
    "create",
    "delete",
    "detach",
    "drop",
    "exec",
    "execute",
    "grant",
    "insert",
    "load",
    "lock",
    "merge",
    "reindex",
    "rename",
    "replace",
    "reset",
    "restore",
    "revoke",
    "rollback",
    "set",
    "truncate",
    "unlock",
    "update",
    "use",
    "vacuum",
}

ALLOWED_START_WORDS = {"select", "with", "show", "describe", "desc", "explain", "values"}


def fail(message: str, code: int = 2) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(code)


def json_default(value: Any) -> Any:
    if isinstance(value, decimal.Decimal):
        return float(value)
    if isinstance(value, (dt.date, dt.datetime, dt.time)):
        return value.isoformat()
    if isinstance(value, bytes):
        return value.hex()
    return str(value)


def get_password(args: argparse.Namespace) -> str | None:
    if args.type == "sqlite":
        return None
    if args.password_env:
        value = os.environ.get(args.password_env)
        if value is None:
            fail(f"environment variable {args.password_env!r} is not set")
        return value
    if args.password:
        return args.password
    if args.no_password_prompt:
        return None
    return getpass.getpass("Database password: ")


def rows_from_cursor(cursor: Any, rows: Iterable[Any]) -> list[dict[str, Any]]:
    columns = [col[0] for col in cursor.description or []]
    result: list[dict[str, Any]] = []
    for row in rows:
        if isinstance(row, dict):
            result.append(row)
        else:
            result.append({columns[i]: row[i] for i in range(len(columns))})
    return result


def fetch_all(cursor: Any, sql: str, params: Iterable[Any] | None = None) -> list[dict[str, Any]]:
    cursor.execute(sql, tuple(params or ()))
    return rows_from_cursor(cursor, cursor.fetchall())


def fetch_limited(cursor: Any, sql: str, limit: int) -> list[dict[str, Any]]:
    cursor.execute(sql)
    return rows_from_cursor(cursor, cursor.fetchmany(limit))


def strip_comments_and_literals(sql: str) -> str:
    """Mask string literals and remove SQL comments for conservative validation."""
    out: list[str] = []
    i = 0
    state = "normal"
    while i < len(sql):
        ch = sql[i]
        nxt = sql[i + 1] if i + 1 < len(sql) else ""
        if state == "normal":
            if ch == "-" and nxt == "-":
                state = "line_comment"
                i += 2
                continue
            if ch == "/" and nxt == "*":
                state = "block_comment"
                i += 2
                continue
            if ch in ("'", '"', "`"):
                quote = ch
                out.append(" ")
                state = f"quote:{quote}"
                i += 1
                continue
            out.append(ch)
            i += 1
            continue
        if state == "line_comment":
            if ch in "\r\n":
                state = "normal"
                out.append(" ")
            i += 1
            continue
        if state == "block_comment":
            if ch == "*" and nxt == "/":
                state = "normal"
                i += 2
            else:
                i += 1
            continue
        if state.startswith("quote:"):
            quote = state.split(":", 1)[1]
            if ch == quote:
                if i + 1 < len(sql) and sql[i + 1] == quote:
                    i += 2
                    continue
                state = "normal"
            elif ch == "\\":
                i += 2
                continue
            i += 1
            continue
    return "".join(out)


def has_multiple_statements(masked_sql: str) -> bool:
    return ";" in masked_sql.strip().rstrip(";")


def validate_readonly_sql(sql: str) -> str:
    if not sql or not sql.strip():
        fail("--sql is required in query mode")
    masked = strip_comments_and_literals(sql)
    if has_multiple_statements(masked):
        fail("custom SQL must be a single statement")
    normalized = masked.strip().rstrip(";").strip()
    first = re.match(r"([A-Za-z_]+)", normalized)
    if not first or first.group(1).lower() not in ALLOWED_START_WORDS:
        fail("custom SQL must start with a read-only verb such as SELECT, WITH, SHOW, DESCRIBE, or EXPLAIN")
    words = {w.lower() for w in re.findall(r"\b[A-Za-z_]+\b", normalized)}
    forbidden = sorted(words & FORBIDDEN_SQL_WORDS)
    if forbidden:
        fail(f"custom SQL contains forbidden word(s): {', '.join(forbidden)}")
    if re.search(r"\binto\s+(outfile|dumpfile)\b", normalized, flags=re.IGNORECASE):
        fail("custom SQL must not write to files")
    return sql.strip().rstrip(";")


def import_mysql() -> Any:
    try:
        import pymysql
    except ImportError:
        fail("missing MySQL driver. Install with: pip install pymysql")
    return pymysql


def import_postgres() -> tuple[str, Any]:
    try:
        import psycopg
        return "psycopg3", psycopg
    except ImportError:
        pass
    try:
        import psycopg2
        return "psycopg2", psycopg2
    except ImportError:
        fail("missing PostgreSQL driver. Install with: pip install psycopg2-binary")


def import_pyodbc() -> Any:
    try:
        import pyodbc
    except ImportError:
        fail("missing SQL Server driver. Install with: pip install pyodbc")
    return pyodbc


def connect(args: argparse.Namespace, password: str | None) -> Any:
    db_type = args.type
    if db_type == "mysql":
        pymysql = import_mysql()
        return pymysql.connect(
            host=args.host,
            port=args.port or 3306,
            user=args.user,
            password=password or "",
            database=args.database,
            charset="utf8mb4",
            autocommit=False,
            cursorclass=pymysql.cursors.Cursor,
            connect_timeout=args.timeout,
            read_timeout=args.timeout,
            write_timeout=args.timeout,
        )
    if db_type == "postgresql":
        variant, pg = import_postgres()
        kwargs = {
            "host": args.host,
            "port": args.port or 5432,
            "dbname": args.database,
            "user": args.user,
            "password": password or "",
            "connect_timeout": args.timeout,
        }
        conn = pg.connect(**kwargs)
        if variant == "psycopg3":
            conn.read_only = True
            conn.autocommit = False
        else:
            conn.set_session(readonly=True, autocommit=False)
        return conn
    if db_type == "sqlserver":
        pyodbc = import_pyodbc()
        driver = args.driver or "ODBC Driver 18 for SQL Server"
        server = args.host if not args.port else f"{args.host},{args.port}"
        conn_str = (
            f"DRIVER={{{driver}}};SERVER={server};DATABASE={args.database};"
            f"UID={args.user};PWD={password or ''};Encrypt=yes;TrustServerCertificate=yes;"
            "ApplicationIntent=ReadOnly;"
        )
        return pyodbc.connect(conn_str, timeout=args.timeout, autocommit=False)
    if db_type == "sqlite":
        return sqlite3.connect(args.database)
    fail(f"unsupported database type: {db_type}")


def apply_readonly_session(conn: Any, db_type: str) -> None:
    cur = conn.cursor()
    try:
        if db_type == "mysql":
            cur.execute("SET SESSION TRANSACTION READ ONLY")
            cur.execute("START TRANSACTION READ ONLY")
        elif db_type == "sqlserver":
            cur.execute("SET TRANSACTION ISOLATION LEVEL SNAPSHOT")
            cur.execute("BEGIN TRANSACTION")
        elif db_type == "sqlite":
            cur.execute("PRAGMA query_only = ON")
    except Exception:
        try:
            conn.rollback()
        except Exception:
            pass
    finally:
        try:
            cur.close()
        except Exception:
            pass


def mysql_tables(conn: Any, database: str, schema: str | None) -> list[dict[str, Any]]:
    schema_name = schema or database
    sql = """
        SELECT
            table_schema AS schema_name,
            table_name,
            table_rows AS row_estimate,
            ROUND(data_length / 1024 / 1024, 2) AS data_mb,
            ROUND(index_length / 1024 / 1024, 2) AS index_mb,
            ROUND((data_length + index_length) / 1024 / 1024, 2) AS total_mb
        FROM information_schema.tables
        WHERE table_schema = %s AND table_type = 'BASE TABLE'
        ORDER BY (data_length + index_length) DESC, table_name
    """
    return fetch_all(conn.cursor(), sql, (schema_name,))


def postgres_tables(conn: Any, schema: str | None) -> list[dict[str, Any]]:
    params: list[Any] = []
    schema_clause = ""
    if schema:
        schema_clause = "AND n.nspname = %s"
        params.append(schema)
    sql = f"""
        SELECT
            n.nspname AS schema_name,
            c.relname AS table_name,
            c.reltuples::bigint AS row_estimate,
            ROUND(pg_relation_size(c.oid)::numeric / 1024 / 1024, 2) AS data_mb,
            ROUND(pg_indexes_size(c.oid)::numeric / 1024 / 1024, 2) AS index_mb,
            ROUND(pg_total_relation_size(c.oid)::numeric / 1024 / 1024, 2) AS total_mb
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind IN ('r', 'p')
          AND n.nspname NOT IN ('pg_catalog', 'information_schema')
          AND n.nspname NOT LIKE 'pg_toast%%'
          {schema_clause}
        ORDER BY pg_total_relation_size(c.oid) DESC, n.nspname, c.relname
    """
    return fetch_all(conn.cursor(), sql, params)


def sqlserver_tables(conn: Any, schema: str | None) -> list[dict[str, Any]]:
    params: list[Any] = []
    schema_clause = ""
    if schema:
        schema_clause = "WHERE s.name = ?"
        params.append(schema)
    sql = f"""
        SELECT
            s.name AS schema_name,
            t.name AS table_name,
            SUM(CASE WHEN i.index_id IN (0, 1) THEN p.rows ELSE 0 END) AS row_estimate,
            CAST(SUM(a.total_pages) * 8.0 / 1024 AS decimal(18, 2)) AS total_mb,
            CAST(SUM(a.used_pages) * 8.0 / 1024 AS decimal(18, 2)) AS used_mb,
            CAST((SUM(a.total_pages) - SUM(a.used_pages)) * 8.0 / 1024 AS decimal(18, 2)) AS unused_mb
        FROM sys.tables t
        JOIN sys.schemas s ON t.schema_id = s.schema_id
        JOIN sys.indexes i ON t.object_id = i.object_id
        JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
        LEFT JOIN sys.allocation_units a ON p.partition_id = a.container_id
        {schema_clause}
        GROUP BY s.name, t.name
        ORDER BY SUM(a.total_pages) DESC, s.name, t.name
    """
    return fetch_all(conn.cursor(), sql, params)


def sqlite_tables(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    cur = conn.cursor()
    tables = fetch_all(
        cur,
        "SELECT name AS table_name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
    )
    dbstat_sizes: dict[str, float] = {}
    try:
        for row in fetch_all(cur, "SELECT name, SUM(pgsize) / 1024.0 / 1024.0 AS total_mb FROM dbstat GROUP BY name"):
            dbstat_sizes[row["name"]] = round(row["total_mb"] or 0, 2)
    except Exception:
        dbstat_sizes = {}
    result: list[dict[str, Any]] = []
    for table in tables:
        name = table["table_name"]
        quoted = '"' + str(name).replace('"', '""') + '"'
        row_count = fetch_all(cur, f"SELECT COUNT(*) AS row_count FROM {quoted}")[0]["row_count"]
        result.append(
            {
                "schema_name": "main",
                "table_name": name,
                "row_count": row_count,
                "total_mb": dbstat_sizes.get(name),
            }
        )
    result.sort(key=lambda row: (row.get("total_mb") is None, -(row.get("total_mb") or 0), row["table_name"]))
    return result


def get_tables(conn: Any, args: argparse.Namespace) -> list[dict[str, Any]]:
    if args.type == "mysql":
        return mysql_tables(conn, args.database, args.schema)
    if args.type == "postgresql":
        return postgres_tables(conn, args.schema)
    if args.type == "sqlserver":
        return sqlserver_tables(conn, args.schema)
    if args.type == "sqlite":
        return sqlite_tables(conn)
    fail(f"unsupported database type: {args.type}")


def summarize(args: argparse.Namespace, tables: list[dict[str, Any]]) -> dict[str, Any]:
    total_mb = sum(float(row.get("total_mb") or 0) for row in tables)
    schemas = sorted({str(row.get("schema_name", "")) for row in tables})
    summary = {
        "database_type": args.type,
        "database": args.database,
        "schema_filter": args.schema,
        "table_count": len(tables),
        "total_mb": round(total_mb, 2),
        "schemas": schemas,
    }
    if args.type == "sqlite":
        path = Path(args.database)
        if path.exists():
            summary["file_mb"] = round(path.stat().st_size / 1024 / 1024, 2)
    return summary


def print_table(rows: list[dict[str, Any]], max_rows: int = 50) -> None:
    if not rows:
        print("(no rows)")
        return
    display = rows[:max_rows]
    columns = list(display[0].keys())
    widths = {col: len(col) for col in columns}
    for row in display:
        for col in columns:
            widths[col] = min(60, max(widths[col], len(str(row.get(col, "")))))
    print(" | ".join(col.ljust(widths[col]) for col in columns))
    print("-+-".join("-" * widths[col] for col in columns))
    for row in display:
        print(" | ".join(str(row.get(col, ""))[:60].ljust(widths[col]) for col in columns))
    if len(rows) > max_rows:
        print(f"... {len(rows) - max_rows} more row(s)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Inspect a database through read-only metadata queries.")
    parser.add_argument("--type", choices=["mysql", "postgresql", "sqlserver", "sqlite"], required=True)
    parser.add_argument("--host", help="database host")
    parser.add_argument("--port", type=int, help="database port")
    parser.add_argument("--database", required=True, help="database name, or SQLite file path")
    parser.add_argument("--schema", help="optional schema filter")
    parser.add_argument("--user", help="database user")
    parser.add_argument("--password-env", help="environment variable containing the password")
    parser.add_argument("--password", help="password; prefer --password-env for real secrets")
    parser.add_argument("--no-password-prompt", action="store_true", help="do not prompt for a password")
    parser.add_argument("--driver", help="ODBC driver name for SQL Server")
    parser.add_argument("--timeout", type=int, default=30, help="connection timeout in seconds")
    parser.add_argument("--mode", choices=["summary", "tables", "query"], default="summary")
    parser.add_argument("--sql", help="single read-only SQL statement for query mode")
    parser.add_argument("--limit", type=int, default=50, help="maximum rows to fetch in query mode")
    parser.add_argument("--json", action="store_true", help="print JSON only")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.type != "sqlite":
        missing = [name for name in ("host", "database", "user") if not getattr(args, name)]
        if missing:
            fail(f"missing required argument(s) for {args.type}: {', '.join('--' + name for name in missing)}")
    if args.limit < 1:
        fail("--limit must be at least 1")
    password = get_password(args)
    conn = connect(args, password)
    try:
        apply_readonly_session(conn, args.type)
        if args.mode in {"summary", "tables"}:
            tables = get_tables(conn, args)
            output = {"summary": summarize(args, tables), "tables": tables}
            if args.json:
                print(json.dumps(output, ensure_ascii=False, indent=2, default=json_default))
            else:
                print(json.dumps(output["summary"], ensure_ascii=False, indent=2, default=json_default))
                print()
                print_table(tables, max_rows=20 if args.mode == "summary" else len(tables))
        else:
            sql = validate_readonly_sql(args.sql or "")
            rows = fetch_limited(conn.cursor(), sql, args.limit)
            output = {"row_count_returned": len(rows), "limit": args.limit, "rows": rows}
            if args.json:
                print(json.dumps(output, ensure_ascii=False, indent=2, default=json_default))
            else:
                print(json.dumps({"row_count_returned": len(rows), "limit": args.limit}, indent=2))
                print()
                print_table(rows, max_rows=args.limit)
        try:
            conn.rollback()
        except Exception:
            pass
        return 0
    finally:
        try:
            conn.close()
        except Exception:
            pass


if __name__ == "__main__":
    raise SystemExit(main())
