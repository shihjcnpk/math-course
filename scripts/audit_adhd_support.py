#!/usr/bin/env python3
"""Audit textbook alignment, ADHD support, exercises, and knowledge graph integrity."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
LECTURE_DIR = ROOT / "src" / "data" / "lectures"
SUPPORT_FILE = ROOT / "data" / "adhd-lesson-support.json"
CHAPTER_FILE = ROOT / "data" / "textbook-chapters.json"
ERROR_TYPES_FILE = ROOT / "data" / "error-types.json"
REVIEW_FILE = ROOT / "data" / "review-schedule.json"
KNOWLEDGE_FILE = ROOT / "src" / "data" / "knowledge-nodes.ts"
OUTPUT_FILE = ROOT / "reports" / "adhd_support_check_report.md"
LECTURE_PAGE_FILE = ROOT / "src" / "pages" / "LecturePage.tsx"
QUESTION_NETWORK_FILE = ROOT / "src" / "components" / "lecture" / "QuestionTypeNetwork.tsx"

REQUIRED_TEXTBOOK = "人教版新课标六三制"
EXPECTED_CHAPTER_TITLES = [
    "有理数",
    "有理数的运算",
    "代数式",
    "整式的加减",
    "一元一次方程",
    "几何图形初步",
    "相交线与平行线",
    "实数",
    "平面直角坐标系",
    "二元一次方程组",
    "不等式与不等式组",
    "数据的收集、整理与描述",
    "三角形",
    "全等三角形",
    "轴对称",
    "整式的乘法",
    "因式分解",
    "分式",
    "二次根式",
    "勾股定理",
    "四边形",
    "函数",
    "一次函数",
    "数据的分析",
]

MIXED_EDITION_PATTERN = re.compile(
    r"五四制|北师大版|苏科版|沪科版|沪教版|华师大版"
)
FORMAL_OUT_OF_SCOPE_PATTERN = re.compile(
    r"(?:question|problem|answer|hint)\s*:\s*[^\n]*(?:一元二次方程|二次函数|三角函数|配方法|导数|定积分)"
)
UNFINISHED_EDITORIAL_PATTERN = re.compile(
    r"需要重新计算|重新计算可得|数据有误|题目不合理|问题重述|面积重新|本题有矛盾"
)

CONTENT_CHECKPOINTS: dict[str, dict[str, list[str]]] = {
    "lecture-04.ts": {
        "required": ["正整数指数", "八上第18章", "绝对值大于10"],
        "forbidden": ["0.000001=", "小数的科学记数法"],
    },
    "lecture-09.ts": {
        "required": ["零指数", "负整数指数", "小数的科学记数法"],
        "forbidden": [],
    },
    "lecture-11.ts": {
        "required": ["最简二次根式", "被开方数不含分母"],
        "forbidden": ["分母有理化", "共轭"],
    },
    "lecture-19.ts": {
        "required": ["立体图形与平面图形", "三视图", "展开图", "线段的比较", "中点"],
        "forbidden": [],
    },
    "lecture-36.ts": {
        "required": ["频数÷组距", "长方形的面积表示各组频数", "趋势图", "散点"],
        "forbidden": [],
    },
    "lecture-37.ts": {
        "required": ["四分位数", "箱线图", "四分位距"],
        "forbidden": [],
    },
    "lecture-38.ts": {
        "required": ["离差平方和", "方差", "组内离差平方和"],
        "forbidden": ["正态分布", "变异系数", "导数"],
    },
}

REQUIRED_ERROR_FIELDS = {
    "id",
    "name",
    "category",
    "description",
    "typical_behaviors",
    "correction_action",
    "reminder_sentence",
    "related_topics",
    "related_knowledge_thread",
    "parent_guidance",
}
EXPECTED_ERROR_CATEGORIES = {
    "审题错误",
    "概念错误",
    "方法错误",
    "计算错误",
    "步骤错误",
    "检查错误",
    "迁移错误",
}
EXPECTED_REVIEW_KEYS = {"D0", "D1", "D3", "D7", "D14"}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def escape_cell(value: str) -> str:
    return value.replace("|", r"\|").replace("\n", "<br>")


def non_empty(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return bool(value)
    return value is not None


def lecture_id_from_source(path: Path, source: str) -> int:
    match = re.search(r"\bid:\s*(\d+)\s*,", source)
    if not match:
        raise ValueError(f"无法从 {path.name} 读取讲次 id")
    return int(match.group(1))


def module_checks(
    source: str,
    support: dict[str, Any] | None,
    defaults: dict[str, Any],
) -> dict[str, bool]:
    support = support or {}
    start = support.get("start") or {}
    anchor = support.get("attention_anchor") or {}
    parent = support.get("parent_guidance") or {}
    return {
        "教材版本": (
            defaults.get("textbook_version") == REQUIRED_TEXTBOOK
            and non_empty(support.get("textbook_chapters"))
        ),
        "本节核心问题": non_empty(support.get("core_question")),
        "3分钟课前启动": all(
            non_empty(start.get(key))
            for key in (
                "one_task",
                "warmup_question",
                "warmup_answer",
                "attention_reminder",
            )
        ),
        "注意力锚点": all(
            non_empty(anchor.get(key))
            for key in ("key_point", "common_trap", "before_action")
        ),
        "做题前5秒刹车": len(defaults.get("five_second_brake") or []) >= 5,
        "错题四问": len(defaults.get("error_four_questions") or []) >= 4,
        "变式题": (
            non_empty(support.get("variant_task"))
            and ("variations:" in source or "exercises:" in source)
        ),
        "间隔复习": set(defaults.get("review_schedule") or []) >= EXPECTED_REVIEW_KEYS,
        "家长陪伴提示": all(
            non_empty(parent.get(key)) for key in ("avoid", "say", "one_habit")
        ),
        "短时分段学习提示": len(defaults.get("short_units") or []) >= 7,
        "重新聚焦提示": all(
            f'title="{title}"' in LECTURE_PAGE_FILE.read_text(encoding="utf-8")
            for title in ("暂停一下", "检查一下", "想一想", "说一说")
        ),
        "每个题型的第一步动作": "solutionSteps:" in source,
        "每类易错点的下次提醒语": "relatedReminder:" in source,
        "题型网络": all(
            marker in QUESTION_NETWORK_FILE.read_text(encoding="utf-8")
            for marker in ("第一眼看什么", "第一步做什么", "容易混淆", "后续升级", "常见错因")
        ),
        "完成标准": len(defaults.get("completion_standard") or []) >= 8,
    }


def priority_for(missing: list[str], textbook_issues: list[str]) -> str:
    if textbook_issues or any(
        item in {"教材版本", "本节核心问题", "错题四问", "变式题", "题型网络", "每类易错点的下次提醒语"}
        for item in missing
    ):
        return "高"
    if missing:
        return "中"
    return "低（已通过）"


def exercise_integrity(
    sources: dict[str, str], knowledge_ids: set[str]
) -> tuple[list[str], list[str], list[str]]:
    all_exercise_ids: list[str] = []
    empty_flags: list[str] = []
    invalid_flags: list[str] = []
    for filename, source in sources.items():
        all_exercise_ids.extend(
            re.findall(r"\bid:\s*['\"](ex[^'\"]+)['\"]", source)
        )
        for match in re.finditer(r"flaggedConceptIds:\s*\[([^\]]*)\]", source, re.S):
            values = re.findall(r"['\"]([^'\"]+)['\"]", match.group(1))
            line = source.count("\n", 0, match.start()) + 1
            if not values:
                empty_flags.append(f"{filename}:{line}")
            for value in values:
                if value not in knowledge_ids:
                    invalid_flags.append(f"{filename}:{line} → {value}")
    duplicates = sorted(
        item for item, count in Counter(all_exercise_ids).items() if count > 1
    )
    return duplicates, empty_flags, invalid_flags


def knowledge_graph_integrity(source: str) -> tuple[set[str], list[str]]:
    node_ids = set(re.findall(r"^\s{4}id:\s*['\"]([^'\"]+)['\"]", source, re.M))
    invalid: list[str] = []
    for key in ("prerequisites", "related", "leadsTo"):
        for match in re.finditer(rf"\b{key}:\s*\[([^\]]*)\]", source, re.S):
            for reference in re.findall(r"['\"]([^'\"]+)['\"]", match.group(1)):
                if reference not in node_ids:
                    line = source.count("\n", 0, match.start()) + 1
                    invalid.append(f"{key}@{line} → {reference}")
    return node_ids, invalid


def data_integrity() -> tuple[list[str], list[str]]:
    errors = load_json(ERROR_TYPES_FILE)
    error_items = errors.get("error_types", errors if isinstance(errors, list) else [])
    error_issues: list[str] = []
    categories: set[str] = set()
    for index, item in enumerate(error_items):
        categories.add(str(item.get("name", "")))
        missing = sorted(REQUIRED_ERROR_FIELDS - set(item))
        if missing:
            error_issues.append(f"第{index + 1}项缺字段：{', '.join(missing)}")
    missing_categories = sorted(EXPECTED_ERROR_CATEGORIES - categories)
    if missing_categories:
        error_issues.append(f"缺少分类：{', '.join(missing_categories)}")

    review = load_json(REVIEW_FILE)
    review_issues: list[str] = []
    actual_review_keys = {key for key in review if key.startswith("D")}
    if actual_review_keys != EXPECTED_REVIEW_KEYS:
        review_issues.append(
            f"节点应为 {sorted(EXPECTED_REVIEW_KEYS)}，实际为 {sorted(actual_review_keys)}"
        )
    for key in sorted(EXPECTED_REVIEW_KEYS & set(review)):
        missing = [field for field in ("name", "task", "purpose") if not non_empty(review[key].get(field))]
        if missing:
            review_issues.append(f"{key} 缺字段：{', '.join(missing)}")
    return error_issues, review_issues


def audit() -> tuple[str, bool]:
    support_data = load_json(SUPPORT_FILE)
    chapter_data = load_json(CHAPTER_FILE)
    defaults = support_data.get("defaults") or {}
    support_by_id = {
        int(item["lecture_id"]): item for item in support_data.get("lessons", [])
    }
    chapters = chapter_data.get("chapters") or []
    chapter_by_lecture: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for chapter in chapters:
        for lecture_id in chapter.get("lecture_ids", []):
            chapter_by_lecture[int(lecture_id)].append(chapter)

    knowledge_source = KNOWLEDGE_FILE.read_text(encoding="utf-8")
    knowledge_ids, invalid_graph_refs = knowledge_graph_integrity(knowledge_source)
    lecture_files = sorted(LECTURE_DIR.glob("lecture-*.ts"))
    sources = {path.name: path.read_text(encoding="utf-8") for path in lecture_files}
    duplicate_exercise_ids, empty_flags, invalid_flags = exercise_integrity(
        sources, knowledge_ids
    )
    error_data_issues, review_data_issues = data_integrity()

    rows: list[dict[str, str]] = []
    mixed_hits: list[str] = []
    formal_scope_hits: list[str] = []
    editorial_hits: list[str] = []
    checkpoint_issues: list[str] = []
    seen_ids: list[int] = []

    for path in lecture_files:
        source = sources[path.name]
        lecture_id = lecture_id_from_source(path, source)
        seen_ids.append(lecture_id)
        support = support_by_id.get(lecture_id)
        checks = module_checks(source, support, defaults)
        missing = [name for name, passed in checks.items() if not passed]
        textbook_issues: list[str] = []

        if support is None:
            textbook_issues.append("缺少注意力支持映射")
        elif support.get("alignment_status") == "manual-review":
            textbook_issues.append("教材对齐状态待人工复核")
        for chapter in chapter_by_lecture.get(lecture_id, []):
            if chapter.get("coverage") != "complete":
                textbook_issues.append(
                    f"第{chapter['id']}章覆盖为{chapter.get('coverage', '未知')}"
                )
        if MIXED_EDITION_PATTERN.search(source):
            textbook_issues.append("发现其他学制或教材版本关键词")
            mixed_hits.append(path.name)
        if FORMAL_OUT_OF_SCOPE_PATTERN.search(source):
            textbook_issues.append("题目或解答中疑似使用九年级/高中方法")
            formal_scope_hits.append(path.name)
        if UNFINISHED_EDITORIAL_PATTERN.search(source):
            textbook_issues.append("发现疑似未完成编辑说明")
            editorial_hits.append(path.name)

        checkpoint = CONTENT_CHECKPOINTS.get(path.name)
        if checkpoint:
            for required in checkpoint["required"]:
                if required not in source:
                    issue = f"{path.name} 缺少教材关键点：{required}"
                    checkpoint_issues.append(issue)
                    textbook_issues.append(issue)
            for forbidden in checkpoint["forbidden"]:
                if forbidden in source:
                    issue = f"{path.name} 含超出本章要求的内容：{forbidden}"
                    checkpoint_issues.append(issue)
                    textbook_issues.append(issue)

        suggestion = "无须补充"
        if textbook_issues:
            suggestion = "按教材定位复核并修正"
        if missing:
            addition = "补充：" + "、".join(missing)
            suggestion = addition if suggestion == "无须补充" else suggestion + "；" + addition
        rows.append(
            {
                "file": path.relative_to(ROOT).as_posix(),
                "textbook": "；".join(textbook_issues) or "无",
                "missing": "、".join(missing) or "无",
                "problem": "；".join(textbook_issues) or ("缺少支持模块" if missing else "无"),
                "suggestion": suggestion,
                "priority": priority_for(missing, textbook_issues),
            }
        )

    duplicate_ids = sorted(
        lecture_id for lecture_id, count in Counter(seen_ids).items() if count > 1
    )
    expected_ids = set(range(1, 49))
    missing_ids = sorted(expected_ids - set(seen_ids))
    extra_ids = sorted(set(seen_ids) - expected_ids)
    support_missing_ids = sorted(expected_ids - set(support_by_id))
    support_extra_ids = sorted(set(support_by_id) - expected_ids)

    textbook_meta_ok = (
        support_data.get("textbook_scope") == "人教版新课标六三制七、八年级数学"
        and defaults.get("textbook_version") == REQUIRED_TEXTBOOK
        and chapter_data.get("textbook_version") == REQUIRED_TEXTBOOK
    )
    chapter_ids = [int(chapter["id"]) for chapter in chapters]
    chapter_titles = [str(chapter["title"]) for chapter in chapters]
    chapter_structure_ok = (
        chapter_ids == list(range(1, 25))
        and chapter_titles == EXPECTED_CHAPTER_TITLES
        and all(chapter.get("coverage") == "complete" for chapter in chapters)
    )

    priority_counts = Counter(row["priority"] for row in rows)
    missing_module_files = sum(1 for row in rows if row["missing"] != "无")
    textbook_issue_files = sum(1 for row in rows if row["textbook"] != "无")
    structural_issues = [
        duplicate_ids,
        missing_ids,
        extra_ids,
        support_missing_ids,
        support_extra_ids,
        invalid_graph_refs,
        duplicate_exercise_ids,
        empty_flags,
        invalid_flags,
        error_data_issues,
        review_data_issues,
    ]
    structural_ok = (
        textbook_meta_ok
        and chapter_structure_ok
        and not any(structural_issues)
    )
    all_required_modules_ok = missing_module_files == 0

    lines = [
        "# 注意力缺陷课程支持检查报告",
        "",
        f"- 生成时间：{datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S %z')}",
        f"- 扫描范围：{LECTURE_DIR.relative_to(ROOT).as_posix()}/lecture-*.ts",
        f"- 课程文件：{len(lecture_files)} 个",
        f"- 教材基准：{REQUIRED_TEXTBOOK}，2024—2026 新版 24 章顺序",
        "- 检查方式：合并检查讲义、注意力支持数据、教材章节映射、错因数据、复习数据和知识图谱。",
        "",
        "## 汇总",
        "",
        f"- 15项必需模块全部通过：{'是' if all_required_modules_ok else '否'}",
        f"- 缺失模块文件数：{missing_module_files}",
        f"- 教材范围或覆盖待复核文件数：{textbook_issue_files}",
        f"- 高优先级：{priority_counts['高']}；中优先级：{priority_counts['中']}；低（已通过）：{priority_counts['低（已通过）']}",
        f"- 48讲结构和支持映射完整：{'是' if structural_ok else '否'}",
        f"- 24章编号、标题、顺序和覆盖完整：{'是' if chapter_structure_ok else '否'}",
        "",
        "## 逐讲检查",
        "",
        "| 文件 | 缺失模块 | 问题说明 | 修改建议 | 优先级 |",
        "|---|---|---|---|---|",
    ]
    for row in rows:
        lines.append(
            "| {file} | {missing} | {problem} | {suggestion} | {priority} |".format(
                **{key: escape_cell(value) for key, value in row.items()}
            )
        )

    lines.extend(
        [
            "",
            "## 系统完整性",
            "",
            f"- 重复/缺失/越界讲次 ID：{duplicate_ids or '无'} / {missing_ids or '无'} / {extra_ids or '无'}",
            f"- 缺少/多余支持数据 ID：{support_missing_ids or '无'} / {support_extra_ids or '无'}",
            f"- 教材元数据一致：{'是' if textbook_meta_ok else '否'}",
            f"- 知识图谱无效引用：{invalid_graph_refs or '无'}",
            f"- 重复练习 ID：{duplicate_exercise_ids or '无'}",
            f"- 未绑定诊断节点的练习：{empty_flags or '无'}",
            f"- 练习引用不存在的知识节点：{invalid_flags or '无'}",
            f"- 错因数据问题：{error_data_issues or '无'}",
            f"- 复习计划数据问题：{review_data_issues or '无'}",
            "",
            "## 教材边界与内容关键点",
            "",
            f"- 五四制或其他教材版本关键词：{', '.join(mixed_hits) or '未发现'}",
            f"- 题目/解答中疑似九年级或高中正式方法：{', '.join(formal_scope_hits) or '未发现'}",
            f"- 疑似未完成编辑说明：{', '.join(editorial_hits) or '未发现'}",
            f"- 关键教材检查点问题：{checkpoint_issues or '无'}",
            "",
            "> 说明：48讲继续采用跨年级知识主线复习顺序；24章映射用于保证教材教学顺序、概念边界和复习定位不丢失。最终例题口径仍建议由任课教师抽样复核。",
            "",
        ]
    )
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")

    has_high_priority_issue = any(row["priority"] == "高" for row in rows)
    return str(OUTPUT_FILE), has_high_priority_issue or not structural_ok


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--strict",
        action="store_true",
        help="发现高优先级或结构问题时返回非零状态",
    )
    args = parser.parse_args()
    output, has_issues = audit()
    print(f"已生成：{output}")
    return 1 if args.strict and has_issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
