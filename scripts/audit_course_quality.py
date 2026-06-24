#!/usr/bin/env python3
"""Strict merged audit for textbook, knowledge-network, ADHD, and error-loop quality."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
LECTURE_DIR = ROOT / "src" / "data" / "lectures"
SUPPORT_FILE = ROOT / "data" / "adhd-lesson-support.json"
CHAPTER_FILE = ROOT / "data" / "textbook-chapters.json"
THREAD_FILE = ROOT / "data" / "knowledge-threads.json"
ERROR_FILE = ROOT / "data" / "error-types.json"
REVIEW_FILE = ROOT / "data" / "review-schedule.json"
KNOWLEDGE_FILE = ROOT / "src" / "data" / "knowledge-nodes.ts"
LESSON_PAGE = ROOT / "src" / "pages" / "LecturePage.tsx"
START_COMPONENT = ROOT / "src" / "components" / "lecture" / "AdhdLessonStart.tsx"
QUESTION_NETWORK_COMPONENT = ROOT / "src" / "components" / "lecture" / "QuestionTypeNetwork.tsx"
OUTPUT_FILE = ROOT / "reports" / "course_quality_check_report.md"

REQUIRED_TEXTBOOK = "人教版新课标六三制"
EXPECTED_REVIEW = {"D0", "D1", "D3", "D7", "D14"}
EXPECTED_ERROR_NAMES = {
    "审题错误", "概念错误", "方法错误", "计算错误", "步骤错误", "检查错误", "迁移错误"
}
EXPECTED_THREAD_NAMES = {
    "数与式主线", "方程与不等式主线", "函数主线", "几何推理主线", "数据统计主线"
}
EXPECTED_CHAPTER_TITLES = [
    "有理数", "有理数的运算", "代数式", "整式的加减", "一元一次方程", "几何图形初步",
    "相交线与平行线", "实数", "平面直角坐标系", "二元一次方程组", "不等式与不等式组",
    "数据的收集、整理与描述", "三角形", "全等三角形", "轴对称", "整式的乘法",
    "因式分解", "分式", "二次根式", "勾股定理", "四边形", "函数", "一次函数", "数据的分析",
]
REQUIRED_ERROR_FIELDS = {
    "id", "name", "category", "description", "typical_behaviors", "correction_action",
    "reminder_sentence", "related_topics", "related_knowledge_thread", "parent_guidance",
}
MIXED_EDITION_PATTERN = re.compile(r"五四制|北师大版|苏科版|沪科版|沪教版|华师大版")
FORMAL_OUT_OF_SCOPE_PATTERN = re.compile(
    r"(?:question|problem|answer|hint)\s*:\s*[^\n]*(?:一元二次方程|二次函数|三角函数|配方法|导数|定积分)"
)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def non_empty(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return bool(value)
    return value is not None


def lecture_id(source: str, filename: str) -> int:
    match = re.search(r"\bid:\s*(\d+)\s*,", source)
    if not match:
        raise ValueError(f"无法从 {filename} 读取讲次 ID")
    return int(match.group(1))


def escape(value: str) -> str:
    return value.replace("|", r"\|").replace("\n", "<br>")


def array_has_content(source: str, field: str) -> bool:
    match = re.search(rf"\b{re.escape(field)}:\s*\[([^\]]*)\]", source, re.S)
    return bool(match and re.search(r"['\"`]", match.group(1)))


def knowledge_node_ids(source: str) -> set[str]:
    return set(re.findall(r"^\s{4}id:\s*['\"]([^'\"]+)['\"]", source, re.M))


def invalid_graph_refs(source: str, node_ids: set[str]) -> list[str]:
    invalid: list[str] = []
    for field in ("prerequisites", "related", "leadsTo"):
        for match in re.finditer(rf"\b{field}:\s*\[([^\]]*)\]", source, re.S):
            for ref in re.findall(r"['\"]([^'\"]+)['\"]", match.group(1)):
                if ref not in node_ids:
                    invalid.append(f"{field} → {ref}")
    return invalid


def exercise_issues(sources: dict[str, str], node_ids: set[str]) -> list[str]:
    exercise_ids: list[str] = []
    issues: list[str] = []
    for filename, source in sources.items():
        exercise_ids.extend(re.findall(r"\bid:\s*['\"](ex[^'\"]+)['\"]", source))
        for match in re.finditer(r"flaggedConceptIds:\s*\[([^\]]*)\]", source, re.S):
            refs = re.findall(r"['\"]([^'\"]+)['\"]", match.group(1))
            if not refs:
                issues.append(f"{filename} 有练习未绑定知识节点")
            for ref in refs:
                if ref not in node_ids:
                    issues.append(f"{filename} 引用不存在的知识节点 {ref}")
    duplicates = sorted(item for item, count in Counter(exercise_ids).items() if count > 1)
    if duplicates:
        issues.append(f"重复练习 ID：{duplicates}")
    return issues


def priority(textbook: list[str], network: list[str], attention: list[str], errors: list[str]) -> str:
    if textbook or network or errors:
        return "高"
    if attention:
        return "中"
    return "低（通过）"


def main_audit() -> tuple[str, bool]:
    support_data = load_json(SUPPORT_FILE)
    chapter_data = load_json(CHAPTER_FILE)
    thread_data = load_json(THREAD_FILE)
    error_data = load_json(ERROR_FILE)
    review_data = load_json(REVIEW_FILE)
    defaults = support_data["defaults"]
    supports = {int(item["lecture_id"]): item for item in support_data["lessons"]}
    threads = thread_data["threads"]
    thread_by_lecture: dict[int, list[dict[str, Any]]] = {
        lecture_id: [thread for thread in threads if lecture_id in thread["lecture_ids"]]
        for lecture_id in range(1, 49)
    }

    lesson_page_source = LESSON_PAGE.read_text(encoding="utf-8")
    start_source = START_COMPONENT.read_text(encoding="utf-8")
    question_network_source = QUESTION_NETWORK_COMPONENT.read_text(encoding="utf-8")
    shared_pause_ok = all(
        f'title="{title}"' in lesson_page_source
        for title in ("暂停一下", "检查一下", "想一想", "说一说")
    )
    shared_network_position_ok = all(
        marker in start_source
        for marker in ("所属知识主线", "前置知识", "后续关联", "容易混淆或误用", "本节只解决一个关键问题")
    )
    shared_question_network_ok = all(
        marker in question_network_source
        for marker in ("题型网络", "第一眼看什么", "第一步做什么", "容易混淆", "怎样变式", "后续升级", "常见错因")
    )

    files = sorted(LECTURE_DIR.glob("lecture-*.ts"))
    sources = {path.name: path.read_text(encoding="utf-8") for path in files}
    rows: list[dict[str, str]] = []
    seen_ids: list[int] = []

    for path in files:
        source = sources[path.name]
        lid = lecture_id(source, path.name)
        seen_ids.append(lid)
        support = supports.get(lid) or {}
        textbook: list[str] = []
        network: list[str] = []
        attention: list[str] = []
        errors: list[str] = []

        if defaults.get("textbook_version") != REQUIRED_TEXTBOOK:
            textbook.append("教材版本字段不正确")
        if not non_empty(support.get("textbook_chapters")):
            textbook.append("缺对应教材章节")
        if support.get("alignment_status") == "manual-review":
            textbook.append("教材映射待人工复核")
        if MIXED_EDITION_PATTERN.search(source):
            textbook.append("发现其他学制或教材版本关键词")
        if FORMAL_OUT_OF_SCOPE_PATTERN.search(source):
            textbook.append("题目或解答疑似使用超纲方法")

        if not thread_by_lecture.get(lid):
            network.append("缺所属知识主线")
        if "knowledgeNetwork:" not in source:
            network.append("缺知识网络对象")
        for field, label in (("fromWhere", "前置知识"), ("currentCore", "核心知识"), ("toWhere", "后续关联")):
            if not array_has_content(source, field):
                network.append(f"缺{label}")
        if not shared_network_position_ok:
            network.append("课首网络位置展示不完整")
        if not all(marker in source for marker in ("typicalQuestions:", "essence:", "solutionSteps:", "commonMistake:", "variations:")):
            network.append("题型基础数据不完整")
        if not shared_question_network_ok:
            network.append("共享题型网络不完整")

        start = support.get("start") or {}
        anchor = support.get("attention_anchor") or {}
        if not non_empty(support.get("core_question")):
            attention.append("本节核心问题")
        if not all(non_empty(start.get(key)) for key in ("one_task", "warmup_question", "warmup_answer", "attention_reminder")):
            attention.append("3分钟课前启动")
        if not all(non_empty(anchor.get(key)) for key in ("key_point", "common_trap", "before_action")):
            attention.append("注意力锚点")
        if len(defaults.get("five_second_brake") or []) < 5:
            attention.append("做题前5秒刹车")
        if len(defaults.get("short_units") or []) < 7:
            attention.append("短时学习单元")
        if not shared_pause_ok:
            attention.append("四类聚焦暂停")

        if len(defaults.get("error_four_questions") or []) < 4:
            errors.append("错题四问")
        if not non_empty(support.get("variant_task")) or "variations:" not in source:
            errors.append("变式题")
        if set(defaults.get("review_schedule") or []) != EXPECTED_REVIEW:
            errors.append("间隔复习")
        parent = support.get("parent_guidance") or {}
        if not all(non_empty(parent.get(key)) for key in ("avoid", "say", "one_habit")):
            errors.append("家长陪伴提示")
        if len(defaults.get("completion_standard") or []) < 8:
            errors.append("完成标准")
        if not all(marker in source for marker in ("commonMistakes:", "relatedReminder:", "errorCard:")):
            errors.append("易错点提醒或错题卡")

        all_issues = textbook + network + attention + errors
        suggestion = "无须补充" if not all_issues else "补充或修正：" + "、".join(dict.fromkeys(all_issues))
        rows.append({
            "file": path.relative_to(ROOT).as_posix(),
            "textbook": "、".join(textbook) or "无",
            "network": "、".join(network) or "无",
            "attention": "、".join(attention) or "无",
            "errors": "、".join(errors) or "无",
            "suggestion": suggestion,
            "priority": priority(textbook, network, attention, errors),
        })

    structural: list[str] = []
    expected_ids = set(range(1, 49))
    if set(seen_ids) != expected_ids or len(seen_ids) != 48:
        structural.append("讲次 ID 不是完整的 1—48")
    if set(supports) != expected_ids:
        structural.append("逐讲支持数据不是完整的 1—48")
    chapter_titles = [chapter["title"] for chapter in chapter_data.get("chapters", [])]
    if chapter_titles != EXPECTED_CHAPTER_TITLES:
        structural.append("24章标题或顺序不正确")
    if any(chapter.get("coverage") != "complete" for chapter in chapter_data.get("chapters", [])):
        structural.append("存在教材章节覆盖不完整")
    thread_names = {thread["name"] for thread in threads}
    if thread_names != EXPECTED_THREAD_NAMES:
        structural.append("五条知识主线定义不完整")
    uncovered = sorted(lid for lid in expected_ids if not thread_by_lecture.get(lid))
    if uncovered:
        structural.append(f"未映射知识主线的讲次：{uncovered}")

    error_items = error_data.get("error_types", [])
    if {item.get("name") for item in error_items} != EXPECTED_ERROR_NAMES:
        structural.append("七类错因定义不完整")
    for item in error_items:
        missing = REQUIRED_ERROR_FIELDS - set(item)
        if missing:
            structural.append(f"错因 {item.get('id')} 缺字段：{sorted(missing)}")
    review_keys = {key for key in review_data if key.startswith("D")}
    if review_keys != EXPECTED_REVIEW:
        structural.append("D0—D14 复习节点不完整")

    node_source = KNOWLEDGE_FILE.read_text(encoding="utf-8")
    nodes = knowledge_node_ids(node_source)
    graph_issues = invalid_graph_refs(node_source, nodes)
    structural.extend(f"知识图谱无效引用：{item}" for item in graph_issues)
    structural.extend(exercise_issues(sources, nodes))

    counts = Counter(row["priority"] for row in rows)
    passed = sum(row["priority"] == "低（通过）" for row in rows)
    lines = [
        "# 课程质量检查报告",
        "",
        f"- 生成时间：{datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S %z')}",
        f"- 扫描课程：{len(files)} 讲",
        f"- 通过：{passed}/48",
        f"- 高优先级：{counts['高']}；中优先级：{counts['中']}；低（通过）：{counts['低（通过）']}",
        f"- 系统结构问题：{structural or '无'}",
        "",
        "| 文件 | 教材映射问题 | 知识网络问题 | 注意力支持缺失 | 错题闭环问题 | 建议补充 | 优先级 |",
        "|---|---|---|---|---|---|---|",
    ]
    for row in rows:
        lines.append(
            "| {file} | {textbook} | {network} | {attention} | {errors} | {suggestion} | {priority} |".format(
                **{key: escape(value) for key, value in row.items()}
            )
        )
    lines.extend([
        "", "## 系统级检查", "",
        f"- 人教版新课标六三制 24 章顺序：{'通过' if chapter_titles == EXPECTED_CHAPTER_TITLES else '失败'}",
        f"- 五条知识主线：{'通过' if thread_names == EXPECTED_THREAD_NAMES and not uncovered else '失败'}",
        f"- 七类错因及关联主线：{'通过' if not any('错因' in issue for issue in structural) else '失败'}",
        f"- D0、D1、D3、D7、D14：{'通过' if review_keys == EXPECTED_REVIEW else '失败'}",
        f"- 知识图谱与练习诊断引用：{'通过' if not graph_issues and not exercise_issues(sources, nodes) else '失败'}",
        "",
        "> 本审计按“课程正文 + 支持数据 + 共享组件”合并判断。共享模块无需复制进 48 个课程文件。",
        "",
    ])
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")
    failed = passed != 48 or bool(structural)
    return str(OUTPUT_FILE), failed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    output, failed = main_audit()
    print(f"已生成：{output}")
    return 1 if args.strict and failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
