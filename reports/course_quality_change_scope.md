# 二次课程质量改造文件清单

> 生成时间：2026-06-24  
> 依据：项目结构、教材一致性、五条主线、注意力支持和课程结构五份基线报告

## 1. 计划新增

- `data/knowledge-threads.json`：五条知识主线、教材章节、课程映射、高频题型、高频错因、易混点和关键动作。
- `src/data/knowledge-threads.ts`：类型安全读取和按讲次查询。
- `src/components/lecture/QuestionTypeNetwork.tsx`：从现有典型题数据生成统一题型网络。
- `src/components/lecture/KnowledgeThreadSummary.tsx`：单元页显示主线结构表。
- `scripts/audit_course_quality.py`：15 项合并质量审计。
- `scripts/export_sample_lessons.py`：可重复导出 10 节代表性课程。
- `reports/course_quality_check_report.md`：质量脚本输出。
- `reports/sample_lessons/`：七、八年级各 5 节样本。
- `reports/course_quality_review.md`：综合质量验收。
- `reports/final_course_improvement_report.md`：最终执行报告。

## 2. 计划完善

- `templates/adhd-lesson-template.md`：补网络位置、题型网络、五步刹车和 8 项完成标准。
- `templates/error-card-template.md`：补所属主线、知识点、题型和迁移掌握标准。
- `data/error-types.json`：增加迁移错误，为全部 7 类增加 `related_knowledge_thread`。
- `data/adhd-lesson-support.json`：五步刹车和 8 项完成标准。
- `src/types/adhd.ts`：补关联主线和主线定义类型。
- `src/data/adhd-support.ts`：导出新错因字段。
- `src/components/lecture/AdhdLessonStart.tsx`：显式显示所属主线、教材章节、前置、核心、后续、易混和唯一关键任务。
- `src/components/lecture/ExampleSection.tsx`：接入题型网络。
- `src/pages/LecturePage.tsx`：传入知识网络并增加“想一想”“说一说”暂停。
- `src/pages/ModulePage.tsx`：显示单元知识主线结构表。
- `src/data/modules.ts`：统一表述为五条知识主线。
- `scripts/audit_adhd_support.py`：同步 7 类错因和新共享模块检查。

## 3. 课程正文处理原则

- 48 个课程文件已有完整知识网络、概念、方法、题型、易错点、练习、口述和错题卡。
- 不逐讲复制相同支持文案。
- 不改排课程、不删除题目、不重写成熟讲解。
- 仅当新质量脚本发现教材映射、前后关系、题型或错题闭环真实缺失时，才定点修改对应课程文件。

## 4. 样本课程

七年级：第 4、12、21、14、16 讲。  
八年级：第 24、8、9、29、34 讲。

样本导出只复制课程用于审阅，不改变原课程数据源。

## 5. 验收

- 课程质量严格审计。
- 原注意力支持审计。
- KaTeX 公式审计。
- TypeScript、ESLint、生产构建。
- 24 章、60 个节点、练习引用和 20 个动画的完整性检查。
- 关键路由 HTTP 烟雾测试。
