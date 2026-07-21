# 数学课程去重任务进度

## 当前状态(2026-07-20)

**批次 1(P0 必改)已完成且验证通过** ✅
- 13 处改动,涉及 8 个文件:lecture-07/21/24/25/31/44/47/48.ts
- 验证:tsc 0 错误、vite build 2.97s 成功、audit:formulas 0 错误、audit:quality 通过
- 改动清单:
  1. L31 concept[0] 坐标距离知识错误修正(`到轴的距离`->`表示位置`)
  2. L47 ex47-test-03 分式题换立方差题(不再照搬L40)
  3. L24 ex-24-basic-1 SSS题换字母(△ABC≅△PQR)
  4. L21 同位角题 70°->80°
  5. L21 同旁内角题 55°/125°->65°/115°
  6. L25 ex-25-basic-3 换"等角减公共角"SAS题
  7. L7 overview 去逐字重复
  8. L48 overview 去逐字重复
  9. L21 内错角题 50°->62°
  10. L25 oralTask 换"等腰+中点+SSS证AD⊥BC"
  11. L44 ex44-basic-5 换 5-12-13(答案BF=12)
  12. L44 ex44-inter-3 换 8-10(答案BF=6,CE=3)+修正knowledgeChain
  13. L47 ex47-test-14 换"等腰+中点+AE=AF证DE=DF"SAS题
- 顺手修:L44 knowledgeChain 串入无关内容、flaggedConceptIds 无关项

## 批次 2 改-1~改-7 ✅ 已完成(2026-07-20)

- 7 处改动:L02 改-2 / L03 改-3+改-6 / L05 改-5 / L10 改-1+改-4+改-7
- 验证:tsc 0 错误、audit:formulas 0 错误、audit:quality 48/48 通过、vite build 2.18s
- 改写要点:
  - 改-1 L10 无理数清单->聚焦数轴对应+引用 L02(识别 vs 定位分工)
  - 改-2 L02 超前分式题->"为何 0 不能作除数"概念题
  - 改-3 L03 数轴画法易错点->相反数 vs 绝对值
  - 改-4 L10 √2+√3≠√5->实数运算新约束(细节推 L11)
  - 改-5 L05 ex5-challenge-2 条件换 x-3y+2=0(答案 -3/2,避开 inter-1)
  - 改-6 L03 ex3-inter-3 换数字 |x-5|+|y+1|=0(答案 1/5)
  - 改-7 L10 l10-ch-01 换数字 |a-3|+√(b+5)=0(答案 1/243)
- 顺手修:L10 既有约 16 个单反斜杠 `\sqrt` 渲染 bug(`fix_p1a_la.py` 顺带改双)

## ⚠️ 修复经验(必读,避免重蹈覆辙)

1. **Edit 工具对含 LaTeX 的内容会失败**:文件里 LaTeX 是双反斜杠 `$\\angle`(TS转义),Edit 经 JSON 解析后 old_string 变单反斜杠,不匹配。含 `--`/`->`/`⊥`/`≅`/`√`/`²` 等字符的 old_string 也易因手动复制误差失败。
2. **用 python 脚本最可靠**:按 id 正则定位对象块替换,绕过精确字符匹配。脚本用绝对路径 `BASE='D:/tools/math-course/src/data/lectures/'`,用 `io.open(newline='')` 保留换行符。
3. **逗号陷阱**:python 列表构造对象块时,每个 TS 字段行(problem/answer/hint/script元素)末尾**必须带 TS 逗号**(在 python 字符串内写 `\',`)。批次1的 L25/L47 第一次漏逗号致 tsc 报错,后用 fix_p0_b.py 修正。
4. **执行命令需 cd**:`(cd /d/tools/math-course && <cmd>)` 子 shell;tsc 可用绝对路径 `node D:/tools/math-course/node_modules/typescript/bin/tsc -b D:/tools/math-course/tsconfig.json`;vite 必须在项目目录运行(不支持 `--root`)。
5. **验证命令**:tsc -b + vite build + `node scripts/audit_math_formulas.mjs` + `python scripts/audit_course_quality.py --strict`
6. **临时脚本**(供参考):`scripts/fix_p0.py`、`scripts/fix_p0_b.py`、`scripts/fix_p1a.py`(改-1~改-7)、`scripts/fix_p1a_la.py`(LaTeX 反斜杠修正)
7. **⚠️ JSON 反斜杠陷阱**(批次2新发现,极重要):Write/Edit 的 content 经 JSON 传输,`\\` 会被吃成单 `\`。TS 源码里 LaTeX 命令必须是双反斜杠 `\\frac`(TS 解析为单 `\frac`,KaTeX 正常)。若 content 写 `\\frac`,实际写入单 `\frac`,JS 把 `\f`/`\t`/`\n` 解析为转义字符(KaTeX 报错),`\s`/`\d`/`\g`/`\l`/`\p` 等非转义则被忽略反斜杠变 `sqrt`/`dfrac`/`geq` 字面(渲染错但 audit:formulas 不报,隐藏 bug)。**对策**:python 脚本里 LaTeX 用 4 反斜杠 `r'\\\\frac'`,或写完后跑 `fix_p1a_la.py` 用负向断言 `(?<!\\)\\cmd` 把单反斜杠 LaTeX 命令统一改双(原文件双反斜杠不误伤)。中文标点统一 `，。（）""--`(P0 惯例)。

## 批次 2(P1 高优先级)待办 - 内容重复

### 前两轮 diff 方案(改-1~改-7,针对 L2-L11)
| 编号 | 文件:行 | 改动 |
|---|---|---|
| 改-1 | L10 L93 | 无理数三类清单改引用L02(聚焦√2不可约+实数数轴对应) |
| 改-2 | L02 L402 ex2-inter-3 | 超前分式题1/(x-2)换"为何0不能作除数"概念题(归L09) |
| 改-3 | L03 L287 commonMistakes | 数轴画法易错点换"相反数vs绝对值相反"易错点 |
| 改-4 | L10 L293 commonMistakes | √2+√3≠√5 易错点归L11,L10换"实数运算新约束" |
| 改-5 | L05 L420 ex5-challenge-2 | 换条件 x-3y+2=0(答案-3/2),避开ex5-inter-1 |
| 改-6 | L03 L391 ex3-inter-3 | 换数字 \|x-5\|+\|y+1\|=0(答案1/5) |
| 改-7 | L10 L417 l10-ch-01 | 换数字 \|a-3\|+√(b+5)=0(答案1/243) |

### 全面检查新发现(P1)
| # | 位置 | 问题 | 建议 |
|---|---|---|---|
| P1-1 | L14 L622 / L18 L235,L76 / L35 L339 | y=2x+1与y=-x+7直线对三讲重复,答案都(2,5) | 改L35换直线对(如y=3x-2,y=-2x+5) |
| P1-2 | L13 L467 / L15 L205 | 螺钉螺母配套题(22人/1200/2000/1:2)完全相同 | L15换数字 |
| P1-3 | L14 L644 / L35 L205 | 话费套餐题(A套餐20+0.1x完全相同) | L14 transfer-2换非方案题 |
| P1-4 | L22 L104 / L32 L54 | 点平移坐标公式逐字重复(L22自承"先见一面") | L32删重复,引用L22 |
| P1-5 | L43 L147 / L24 L394 | L43例1照搬L24 ex24(SSS全等,只多AB//DE问) | L43换倍长中线/角平分线题 |
| P1-6 | L31 L256 / L32 L245 | 平移求B'题同条件(L31越界L32内容) | L31删平移题 |
| P1-7 | L34 L434 / L18 L197 | 方程组交点/不等式图像重复(L34前瞻深度=正式课) | L34 transfer简化为直观观察 |
| P1-8 | L35 L301 / L18 L423 | 追及题同条件(4km/h,12km/h) | L35换相向/环形情境 |

## 批次 2 P1-1~P1-8 ✅ 已完成(2026-07-21)

- 8 处改动:L14/L15/L22/L31/L34/L35/L43.ts
- 验证:tsc 0、formulas 0(7914)、quality 48/48、build 2.07s
- 改写要点:
  - P1-1 L35 方程组 y=2x+1/-x+7 -> y=3x+1/-2x+6(交点(1,4))
  - P1-2 L15 螺钉螺母换 30人/1000/1500/1:3(答案 10/20)
  - P1-3 L14 套餐 -> 罐头盒配套(非方案题)
  - P1-4 L22 formalDefinition 简化(前瞻,引用 L32;L32 保持正式)
  - P1-5 L43 SSS 例1 -> 倍长中线(Unicode △≅∠,无 LaTeX 命令)
  - P1-6 L31 平移求 B' -> 第二象限距离题(回归 L31 主题)
  - P1-7 L34 transfer-1 联立求解 -> 代入验证(简化为直观观察)
  - P1-8 L35 追及 -> 环形同向追及(400m 跑道,无 LaTeX 命令)
- 脚本:`fix_p1b.py`(P1-1/6/7)、`fix_p1b2.py`(P1-2/3/5/8 初版)、`fix_p1b3.py`(P1-2/3/5 修正)、`fix_p1_4.py`(P1-4)
- **⚠️ re.subn repl 转义陷阱**(批次2发现,极重要):`re.subn(pat, repl, s)` 的 repl 字符串会转义反斜杠(`\\begin`->`\begin`),导致 LaTeX 双反斜杠变单。**对策**:`re.subn(pat, lambda m: nb, s)` 用函数返回 nb(不转义)。`io.open.write` 不转义,但 `re.subn` repl 转义。后续脚本统一用 lambda。

## 批次 3(P2)改-8/9/10 + P2-1/P2-2 ✅ 已完成(2026-07-21)

- 改-8 L03 everydayAnalogy 温度计->格子纸带(避开 L02)
- 改-9a L03 overview 删"几何直观"套话
- 改-9b L04 overview 删"基础"套话(oneLineMainIdea 已有)
- 改-10 L04 concept3 "想象叠积木"->算式 2,4,8,16 引入(差异化)
- P2-1 L39 "交通规则"->"通用语法"(title+everydayAnalogy,避开 L04)
- P2-2 L43 oneLineMainIdea "破案"->"溯流而上"(避开 L35)
- 验证:tsc 0、formulas 0、build 2.10s
- **⚠️ CRLF 陷阱**(批次3发现):L39 文件用 CRLF(`\r\n`),pat 用 `\n`(LF)不匹配(`:`后是 `\r` 非 `\n`)。对策:pat 用 `\r?\n` 兼容。不同文件换行符可能不同(LF/CRLF),脚本需兼容。
- 脚本:`fix_p2a.py`(改-8/9/10)、`fix_p2b.py`(P2-1/P2-2)

## 批次 3 剩余待办(P2-3/4/5,中低优先级)

| 编号 | 位置 | 改动 |
|---|---|---|
| 改-8 | L03 L74 everydayAnalogy | 温度计比喻改"格子纸带"(避开L02) |
| 改-9 | L03/L04 overview | 去套话(L03删"本讲核心是几何直观";L04"这一课是基础"具体化) |
| 改-10 | L04 concept3 | "想象"开场差异化(示范:看算式2,4,8,16引入乘方) |
| P2-1 | L39 L71 | "交通规则"比喻照搬L4,换"通用语法" |
| P2-2 | L43 L19 | "侦探破案"比喻照搬L35,换"溯流而上" |
| P2-3 | L8/L24/L28/L29/L34/L44/L45 | overview↔oneLineMainIdea中度重复,分化职能(overview讲脉络,oneLine讲洞见) |
| P2-4 | L2-L6 overview | "本讲是X基础"套话(改-9的扩展,L2/L5/L6保留,L3/L4改) |
| P2-5 | "桥梁"比喻 | 9讲高频,部分换"中介/纽带/转换器" |

## 批次 4(P3)改-11 ✅ 已完成 + 其余评估暂缓(2026-07-21)

- 改-11 L7-L11+L30 "lecture X"->"第X讲"(75 处统一)✅
- 改-12 relationDiagram 暂缓:原结构是 `string[]` 数组(每行一元素),合理;改模板字符串会破坏类型且转义风险高
- oneLineMainIdea 句式暂缓:写作风格(非内容错误),句式实际多样(非全雷同),改写主观收益低
- P2-3 overview↔oneLineMainIdea 暂缓:中度,overview(脉络)/oneLine(洞见)职能本不同,7 讲主观改写
- P2-4 已含在改-9(L3/L4 改,L2/L5/L6 保留)
- P2-5 "桥梁"比喻暂缓:通用比喻,各讲语境不同(坐标系/数轴/全等/勾股/辅助线等不同连接),非重复;换"中介/纽带"收益低风险高
- 最终验证:tsc 0、formulas 0(7913)、quality 48/48、build 2.07s

## 批次 4(P3 低优先级)待办 - 格式统一

| 编号 | 范围 | 改动 |
|---|---|---|
| 改-11 | L7-L11, L30 toWhere | "lecture X"统一改"第X讲";合并L7/L8/L10内部重复条目 |
| 改-12 | L7-L11, L30 relationDiagram | 数组.join 改模板字符串(转义风险高,单独做) |
| - | oneLineMainIdea | "X不是Y而是Z"6讲、"X就是Y"7讲,部分换句式 |

## 注意

- L20↔L21 三对题:批次1已改L21(70/55/内错角50换数字),L20保留
- L25 oralTask:批次1已改(等腰+中点+SSS)
- 每批改完跑:tsc -b + vite build + audit:formulas + audit:quality
- 数学答案必须手算验证后再改
