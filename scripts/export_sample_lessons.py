#!/usr/bin/env python3
"""Export ten reviewable sample lessons with a quality-design preface."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LECTURE_DIR = ROOT / "src" / "data" / "lectures"
OUTPUT_DIR = ROOT / "reports" / "sample_lessons"

SAMPLES = [
    (7, 4, "有理数运算"),
    (7, 12, "一元一次方程"),
    (7, 21, "相交线与平行线"),
    (7, 14, "二元一次方程组"),
    (7, 16, "不等式与不等式组"),
    (8, 24, "全等三角形"),
    (8, 8, "整式乘法与因式分解"),
    (8, 9, "分式"),
    (8, 29, "勾股定理"),
    (8, 34, "一次函数"),
]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    support = load_json(ROOT / "data" / "adhd-lesson-support.json")
    supports = {int(item["lecture_id"]): item for item in support["lessons"]}
    threads = load_json(ROOT / "data" / "knowledge-threads.json")["threads"]
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    index_lines = [
        "# 代表性课程样本",
        "",
        "样本从原课程逐字导出，前置说明用于课程质量审阅；原课程文件仍是唯一数据源。",
        "",
        "| 年级 | 讲次 | 代表内容 | 文件 |",
        "|---|---:|---|---|",
    ]

    for grade, lecture_id, label in SAMPLES:
        source_path = LECTURE_DIR / f"lecture-{lecture_id:02d}.ts"
        source = source_path.read_text(encoding="utf-8")
        title_match = re.search(r"\btitle:\s*['\"]([^'\"]+)['\"]", source)
        title = title_match.group(1) if title_match else label
        lesson = supports[lecture_id]
        lesson_threads = [thread["name"] for thread in threads if lecture_id in thread["lecture_ids"]]
        output_name = f"grade{grade}-lecture-{lecture_id:02d}.md"
        output_path = OUTPUT_DIR / output_name

        lines = [
            f"# 七八年级数学代表性课程：第{lecture_id}讲 {title}",
            "",
            f"> 代表内容：{label}  ",
            f"> 原始文件：`src/data/lectures/lecture-{lecture_id:02d}.ts`  ",
            "> 教材版本：人教版新课标六三制",
            "",
            "## 样本课程说明",
            "",
            f"1. **所属知识主线：** {'、'.join(lesson_threads)}。",
            f"2. **对应教材章节：** {'；'.join(lesson['textbook_chapters'])}。",
            f"3. **本节核心问题：** {lesson['core_question']}",
            f"4. **注意力缺陷支持设计：** 以“{lesson['start']['one_task']}”降低启动门槛；用“{lesson['attention_anchor']['before_action']}”作为做题前动作，并采用3+8+10+3+10+5+2分钟分段。",
            "5. **错题闭环设计：** 保留原错误过程，选择主要/次要错因，回答错题四问，再用同核心、不同表面的变式题验证迁移。",
            f"6. **间隔复习设计：** D0原题重做、D1同类基础、D3变式、D7混合、D14综合；本讲变式任务为“{lesson['variant_task']}”。",
            "",
            "## 原课程完整内容",
            "",
            "```ts",
            source.rstrip(),
            "```",
            "",
        ]
        output_path.write_text("\n".join(lines), encoding="utf-8")
        index_lines.append(f"| 七/八年级中的{grade}年级代表 | {lecture_id} | {label} | [{output_name}]({output_name}) |")

    (OUTPUT_DIR / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
    print(f"已导出 {len(SAMPLES)} 节样本到：{OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
