# 注意力缺陷学习支持改造文件清单

> 本清单生成于课程正文修改之前，用于控制范围、追踪改动和支持回退。

> 批准后范围变更：课程负责人已于 2026-06-24 批准全部执行，因此第40、41讲的超范围实质训练改为七、八年级范围内的综合题；同时新增24章教材导航、4项新版教材缺项、短时暂停提示和错题间隔复习队列。最终范围以 `reports/course_improvement_plan.md` 为准。

## 1. 新增文件

### 模板

- templates/adhd-lesson-template.md
- templates/error-card-template.md

### 数据

- data/error-types.json
- data/review-schedule.json
- data/adhd-lesson-support.json
- data/textbook-chapters.json

### 应用支持层

- src/types/adhd.ts
- src/data/adhd-support.ts
- src/utils/review.ts
- src/components/lecture/AdhdLessonStart.tsx
- src/components/lecture/AdhdLessonClosure.tsx
- src/components/error/ReviewQueue.tsx
- src/components/lecture/LearningPause.tsx
- src/pages/TextbookChaptersPage.tsx
- src/data/textbook-chapters.ts

### 审计与报告

- scripts/audit_adhd_support.py
- reports/adhd_support_check_report.md（由脚本生成）
- reports/course_improvement_plan.md

## 2. 拟修改的共享文件

- tsconfig.app.json：允许类型安全导入 JSON 支持数据。
- src/pages/LecturePage.tsx：在原课程结构上接入课前启动、注意力锚点、短时学习单元、间隔复习和家长提示。
- src/components/lecture/ExampleSection.tsx：在每道典型例题前显示“做题前 5 秒刹车”。
- src/components/lecture/ErrorAnalysisSection.tsx：在每个易错点后显示错题四问。
- src/components/lecture/ExerciseSection.tsx：记录错题时选择错因，并保留错误答案和具体原因。
- src/types/errors.ts：以可选字段扩展错因和间隔复习记录，兼容现有 localStorage 数据。
- src/store/errorSlice.ts：增加复习阶段记录动作。
- src/pages/ErrorNotebookPage.tsx：增加今日复习队列。

## 3. 拟定点修正的课程文件

- src/data/lectures/lecture-07.ts：将九年级二次函数迁移题替换为八年级范围内的乘法公式迁移题。
- src/data/lectures/lecture-15.ts：修正“一元二次方程组”为“二元一次方程组”。
- src/data/lectures/lecture-23.ts：修正“两条中线分成 4 个等面积部分”的错误表述。
- src/data/lectures/lecture-32.ts：重写一条含编辑残留和未闭合公式的面积题答案。
- src/data/lectures/lecture-34.ts：将二次函数预测题替换为一次函数参数判断迁移题。
- src/data/lectures/lecture-44.ts：移除“三角函数”作为七、八年级解题方法的提示。

## 4. 批准后纳入定点改造的文件

- lecture-40.ts：删除配方法、二次函数等九年级实质训练，保留整式乘法、因式分解、分式化简和整体代入。
- lecture-41.ts：将二次函数利润最值改为折扣利润的一元一次方程和商品数量的二元一次方程组。
- lecture-04.ts、lecture-36.ts、lecture-37.ts、lecture-38.ts：分别补近似数、直方图与趋势图、四分位数、数据分组。

## 5. 本轮不做大面积修改的文件

- knowledge-nodes.ts：已清理无效关系引用，并把图谱关系完整性纳入严格审计。
- 其余课程正文：保留成熟讲解、例题、练习、公式、图示和动画。
- 部署配置：不改变 Cloudflare 路由和发布方式。

## 6. 验证范围

- Python 审计脚本运行成功并生成检查报告。
- JSON 文件可解析且 48 讲支持数据完整。
- TypeScript 类型检查、ESLint 和生产构建通过。
- 48 个课程模块仍可动态导入。
- 数学公式批量解析无新增错误。
- 动画注册表和组件映射保持完整。
- Git 差异仅包含本清单范围内文件。
