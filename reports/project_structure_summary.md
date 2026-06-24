# 项目结构审计摘要

> 项目：D:\tools\math-course  
> 扫描日期：2026-06-24  
> 本报告为二次优化前的只读扫描结果。

## 1. 课程文件位置

- 七、八年级课程采用跨年级知识脉络组织，没有按年级拆目录。
- 课程正文统一位于 `src/data/lectures/lecture-01.ts` 至 `lecture-48.ts`。
- 课程导航摘要位于 `src/data/lectures/index.ts`。
- 8 个课程模块位于 `src/data/modules.ts`。
- 教材第 1—24 章映射位于 `data/textbook-chapters.json`，页面入口为 `src/pages/TextbookChaptersPage.tsx`。

这种组织方式符合“知识脉络为主、教材章节为边界”，不属于章节混乱。

## 2. 模板

- 已有注意力课程模板：`templates/adhd-lesson-template.md`。
- 已有错题卡模板：`templates/error-card-template.md`。
- 当前模板已覆盖启动、锚点、5 秒刹车、错题四问和间隔复习；二次审计发现还需补充五条知识主线、题型网络和迁移掌握标准。

## 3. 知识图谱

- 节点：`src/data/knowledge-nodes.ts`，当前 60 个知识节点。
- 关系：`src/data/knowledge-relationships.ts`。
- 图谱布局与交互：`src/hooks/useKnowledgeGraph.ts`、`src/components/graph/`、`src/pages/KnowledgeGraphPage.tsx`。
- 48 个课程文件均有 `knowledgeNetwork`，包含“从哪里来—正在学什么—到哪里去”。
- 严格审计未发现无效知识节点引用。

## 4. 题型库

- 没有独立题型数据库。
- 每讲的 `typicalQuestions` 内嵌题型本质、步骤、例题、易错点、变式和总结。
- 优点：课程自包含、上下文完整。
- 当前缺口：题型之间的“易混题型—后续升级—典型错因”尚未以统一题型网络组件展示。

## 5. 错题库

- 浏览器本地错题库：`src/store/errorSlice.ts`。
- 页面：`src/pages/ErrorNotebookPage.tsx`、`src/components/error/`。
- 错因数据：`data/error-types.json`。
- 当前支持主要错因、次要错因、原错误过程、具体错误原因和复习阶段。
- 数据保存在 localStorage，无账号、服务端或跨设备同步。

## 6. 复习计划

- 规则：`data/review-schedule.json`。
- 调度与队列：`src/utils/review.ts`、`src/components/error/ReviewQueue.tsx`。
- 已实现 D0、D1、D3、D7、D14，以及“今日新学、昨日回顾、三日前错题、七日前混合题、十四日前综合题”。

## 7. 图示和动图

- 动画注册表：`src/data/animation-registry.ts`。
- 动画组件：`src/components/animation/`。
- 当前 20 个注册动画，被课程引用 28 次；不存在缺失引用或未使用注册项。
- 知识关系图由课程数据和 ReactFlow 生成，不依赖外部图片路径。

## 8. 课程生成脚本

- 未发现批量生成课程正文的脚本。
- 课程正文采用 48 个独立 TypeScript 文件人工维护。
- 搜索索引在运行时从课程模块构建，不是课程生成器。

## 9. 质量审计脚本

- `scripts/audit_adhd_support.py`：教材映射、支持模块、练习引用和知识图谱完整性。
- `scripts/audit_math_formulas.mjs`：逐个解析 48 讲中的 KaTeX 公式。
- 二次验收需新增 `scripts/audit_course_quality.py`，统一检查教材、五条主线、课程结构、题型网络和错题闭环。

## 10. 结论

项目目录结构成熟，无需大面积重构。后续应采用“共享组件 + 结构化数据 + 审计脚本”的增量方式补齐五条知识主线、题型网络和第七类迁移错误，不改排 48 讲。
