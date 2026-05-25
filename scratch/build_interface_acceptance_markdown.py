from __future__ import annotations

import argparse
from pathlib import Path

from docx import Document

from build_interface_acceptance_report import extract_base_url, parse_interfaces


def build_markdown(source_docx: Path, output_md: Path) -> None:
    source = Document(str(source_docx))
    items = parse_interfaces(source)
    base_url = extract_base_url(source)

    method_counts: dict[str, int] = {}
    for item in items:
        method_counts[item.method] = method_counts.get(item.method, 0) + 1

    lines: list[str] = []
    lines.append("# PECMS接口验收报告")
    lines.append("")
    lines.append("## 一、基本信息")
    lines.append("")
    lines.append("| 项目 | 内容 |")
    lines.append("| --- | --- |")
    lines.append("| 甲方 | 五环工程公司 |")
    lines.append("| 乙方 | [待填写] |")
    lines.append("| 验收内容 | PECMS公共接口交付验收 |")
    lines.append(f"| 接口总数 | {len(items)} 项 |")
    lines.append(f"| 请求地址前缀 | {base_url} |")
    lines.append(
        f"| 请求方式统计 | GET {method_counts.get('GET', 0)} 项，POST {method_counts.get('POST', 0)} 项 |"
    )
    lines.append("| 验收日期 | [待填写] |")
    lines.append("| 验收结论 | 通过 |")
    lines.append("")
    lines.append("## 二、验收说明")
    lines.append("")
    lines.append(
        "根据《PECMS接口清单-五环工程公司.docx》，乙方向甲方提供 PECMS 公共接口服务。"
        "本报告仅针对接口交付内容进行验收，验收范围包括接口名称、接口编号（if-id）、请求方式、请求 uri、鉴权规则、请求参数、响应状态及响应结构。"
    )
    lines.append("")
    lines.append(
        "本次验收不包含平台部署、服务器环境、数据库、源代码、运维服务及其他非接口交付事项。"
    )
    lines.append("")
    lines.append("## 三、验收依据")
    lines.append("")
    lines.append("1. 《PECMS接口清单-五环工程公司.docx》")
    lines.append("2. 双方确认的接口对接范围、接口调用规则及接口报文说明")
    lines.append("")
    lines.append("## 四、验收范围")
    lines.append("")
    lines.append(
        f"本次纳入验收的接口共 {len(items)} 项，其中 GET 接口 {method_counts.get('GET', 0)} 项，POST 接口 {method_counts.get('POST', 0)} 项。"
    )
    lines.append("")
    lines.append(
        "接口清单覆盖项目、派单、设备、文件、图片、文档、报表、进度、异常问题、数据分析、监理日志、监理总结等对外提供的数据访问与查询能力。"
    )
    lines.append("")
    lines.append(
        "接口调用请求头统一包含 `access-key`、`timestamp`、`if-id`、`sign` 等字段，满足甲方按统一规则进行调用、鉴权和接入的需要。"
    )
    lines.append("")
    lines.append("## 五、验收结果")
    lines.append("")
    lines.append("| 序号 | 验收项目 | 验收结果 | 说明 |")
    lines.append("| --- | --- | --- | --- |")
    lines.append("| 1 | 接口范围 | 通过 | 本次验收仅针对乙方向甲方提供的 PECMS 公共接口。 |")
    lines.append("| 2 | 清单对应性 | 通过 | 接口名称、if-id、请求方式、请求 uri 与接口清单一致。 |")
    lines.append("| 3 | 鉴权规则 | 通过 | 请求头已明确 access-key、timestamp、if-id、sign 等调用规则。 |")
    lines.append("| 4 | 参数定义 | 通过 | 各接口已明确 Path、Body、Query 等请求参数及是否必填。 |")
    lines.append("| 5 | 响应结构 | 通过 | 各接口已明确响应状态码、返回数据结构及示例报文。 |")
    lines.append("| 6 | 文件能力 | 通过 | 涉及附件、图片、文档、报表等接口已提供访问说明。 |")
    lines.append("")
    lines.append("## 六、接口验收明细表")
    lines.append("")
    lines.append("| 序号 | 接口名称 | if-id | 方法 | 请求 uri | 结果 |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    for item in items:
        lines.append(
            f"| {item.index} | {item.name} | {item.if_id} | {item.method} | `{item.uri}` | 通过 |"
        )
    lines.append("")
    lines.append("## 七、验收结论")
    lines.append("")
    lines.append(
        "经对照《PECMS接口清单-五环工程公司》进行核对，本次提交的 PECMS 公共接口清单范围明确、接口调用规则清晰、请求方式与请求 uri 定义完整、请求参数与响应结构说明齐备，满足甲方对接口交付验收的要求。"
    )
    lines.append("")
    lines.append("综上，本次乙方向甲方提供的 PECMS 接口交付内容，同意通过接口验收。")
    lines.append("")
    lines.append("## 八、签署确认")
    lines.append("")
    lines.append("| 单位 | 代表/负责人 | 签字 | 日期 |")
    lines.append("| --- | --- | --- | --- |")
    lines.append("| 甲方（五环工程公司） |  |  |  |")
    lines.append("| 乙方 |  |  |  |")
    lines.append("")
    lines.append("> 说明：本报告仅作为接口交付验收文件使用。")
    lines.append("")

    output_md.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    build_markdown(args.source, args.output)
    print(args.output)


if __name__ == "__main__":
    main()
