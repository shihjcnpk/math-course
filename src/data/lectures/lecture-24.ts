import type { Lecture } from '@/types'

const lecture24: Lecture = {
  meta: {
    id: 24,
    title: '全等三角形判定：SSS、SAS、ASA、AAS、HL',
    moduleId: 4,
    orderInModule: 6,
    overview:
      '全等三角形——形状和大小完全相同的两个三角形。证明全等有五条路：SSS（三边）、SAS（两边夹角）、ASA（两角夹边）、AAS（两角一边）、HL（直角三角形斜边+直角边）。选哪条取决于已知条件。特别注意：没有SSA这条路！',
    objectives: [
      '理解全等三角形的概念——能完全重合的两个三角形',
      '掌握五种全等判定方法：SSS、SAS、ASA、AAS、HL',
      '能根据已知条件选择正确的判定方法',
      '理解为什么SSA不能判定全等',
      '能正确书写全等三角形的证明过程',
    ],
    durationMinutes: 60,
    oneLineMainIdea: '证明三角形全等有5条路——选哪条取决于已知条件。唯独SSA这条路不存在，因为已知两边和一个非夹角不能唯一确定三角形。',
    conceptIds: ['congruent-triangles'],
    prerequisiteLectureIds: [23],
    followupLectureIds: [25],
    isFullContent: true,
  },

  knowledgeNetwork: {
    fromWhere: [
      '三角形基础（Lecture 23）：三边关系、内角和——全等三角形就是"完全相同"的两个三角形',
      '几何基本概念（Lecture 19）：边和角的基本概念是理解全等条件的前提',
      '平行线证明（Lecture 21）：几何证明的"因为……所以……理由是……"格式在全等证明中继续使用',
    ],
    currentCore: [
      '全等的本质：形状和大小完全相同——通过平移、旋转、翻折可以完全重合',
      '五种判定方法：SSS（三边）、SAS（两边夹角）、ASA（两角夹边）、AAS（两角对边）、HL（直角-斜边-直角边）',
      '为什么没有SSA：已知两边和一个非夹角时，三角形不唯一——可以画出两个不同的三角形',
      '证明格式：在△___和△___中，列出三个等量条件，用指定方法判定全等',
    ],
    toWhere: [
      '全等三角形综合证明（Lecture 25）：利用全等证线段等和角等——全等是几何证明的"瑞士军刀"',
      '角平分线与垂直平分线（Lecture 26）：角平分线性质可用全等三角形证明',
      '等腰三角形（Lecture 27）：等边对等角、三线合一——都用全等三角形来证明',
      '四边形综合（Lecture 30）：平行四边形对边相等——用全等三角形证明',
    ],
    relationDiagram: `  Lecture 23（三角形基础）
           │
           ▼
  Lecture 24 全等三角形判定
  ┌─────────────────────────────────┐
  │  SSS   SAS   ASA   AAS    HL    │
  │  三边  两边  两角  两角  直角+    │
  │        夹角  夹边  对边  斜边+直  │
  │                               │
  │  禁止：SSA！（不能判定全等）      │
  └────────────┬────────────────────┘
               │
               ▼
  Lecture 25 全等三角形综合证明
  （证边等、角等；常见辅助线）
               │
   ┌───────────┼───────────┬──────────┐
   ▼           ▼           ▼          ▼
角平分线    等腰三角形   四边形      更多
(L26)      (L27)      (L30)      证明题`,
  },

  concepts: [
    {
      title: '全等——两个三角形"完全一样"',
      everydayAnalogy:
        '复印一张纸——原件和复印件"全等"。不管你怎样移动复印件（平移、旋转、翻折），它都能和原件完全重合。全等三角形的本质就是"可以通过平移、旋转或翻折让两个三角形完全重叠"——形状和大小完全相同，只是位置和朝向可能不同。',
      formalDefinition:
        '全等三角形（Congruent triangles）：能够完全重合的两个三角形叫做全等三角形。\n' +
        '记法：△ABC ≅ △DEF（注意顶点顺序对应——A↔D, B↔E, C↔F）。\n' +
        '全等三角形的性质：对应边相等、对应角相等。\n' +
        '反过来，判定两个三角形全等，只需验证部分元素相等——这就是五种判定方法的由来。',
      formula:
        '\\triangle ABC \\cong \\triangle DEF \\;\\Rightarrow\\; \\begin{cases} AB = DE, BC = EF, CA = FD \\\\ \\angle A = \\angle D, \\angle B = \\angle E, \\angle C = \\angle F \\end{cases}',
      associationReminders: [
        '顶点顺序必须对应——△ABC≅△DEF意味着A↔D, B↔E, C↔F。顺序写错会导致对应关系错误',
        '全等的本质是"通过变换可以重合"——动画 congruent-overlay 展示平移+旋转+翻折后完全重叠的过程',
        '全等三角形的对应边和对应角一共有6组相等——但我们只需要其中3组就能判定全等（这就是五种判定方法）',
      ],
    },
    {
      title: 'SSS（边边边）——三条边确定一切',
      everydayAnalogy:
        '给你三根固定长度的棍子，你能用它们搭出几种三角形？只有一种！（最多有两种——互为镜像，但可以通过翻折重合，在平面几何中算同一种。）这就是SSS——三条边的长度一旦确定，三角形就唯一确定了。',
      formalDefinition:
        'SSS判定定理：三边分别相等的两个三角形全等。\n' +
        '即：若AB=DE, BC=EF, CA=FD，则△ABC ≅ △DEF（SSS）。\n' +
        'SSS是最"基础"的判定——它不需要任何角的条件。',
      formula:
        '\\left.\\begin{array}{c} AB = DE \\\\ BC = EF \\\\ CA = FD \\end{array}\\right\\} \\Rightarrow \\triangle ABC \\cong \\triangle DEF \\;(SSS)',
      associationReminders: [
        'SSS是三角形稳定性的数学基础——三条边的长度一旦确定，三角形完全固定，不会变形',
        '这也是为什么三脚架比四脚架稳定——三角形是最稳定的多边形',
        'SSS要求的是三组边——找全等条件时注意寻找"公共边"（两个三角形共用同一条边）',
      ],
    },
    {
      title: 'SAS（边角边）——两边和它们的夹角',
      everydayAnalogy:
        '想象你在画三角形——先画一条边，然后在它的端点"拧"出一个确定的角度，再沿这个方向画第二条边——三角形就确定了。SAS=BAS（边→角→边），注意到"角"的位置：夹在两条已知边之间。',
      formalDefinition:
        'SAS判定定理：两边和它们的夹角分别相等的两个三角形全等。\n' +
        '即：若AB=DE, ∠B=∠E, BC=EF，则△ABC ≅ △DEF（SAS）。\n' +
        '关键：角必须是两边的"夹角"——位于两条已知边之间！',
      formula:
        '\\left.\\begin{array}{c} AB = DE \\\\ \\angle B = \\angle E \\\\ BC = EF \\end{array}\\right\\} \\Rightarrow \\triangle ABC \\cong \\triangle DEF \\;(SAS)',
      associationReminders: [
        'SAS中的A必须在两个S之间——如果角不是"夹角"，那就不是SAS而是SSA（不成立！）',
        'SAS是五种判定中用得最多的之一——因为题目常给"两边相等+一个角相等"',
        '画图时用弧线标出夹角——确保条件是"边-角-边"而不是"边-边-角"',
      ],
    },
    {
      title: 'ASA、AAS、HL——其余三种判定与SSA的"陷阱"',
      everydayAnalogy:
        'ASA（两角夹边）：知道两个角和它们之间的那条边——就像先画一条边，在两端各标出一个角，三角形的第三个顶点自然确定了。AAS（两角对边）：知道两个角和其中一个角的对边——也能确定。（因为知道两个角就等于知道第三个角）。HL是直角三角形的"特权"——只需斜边和一条直角边。SSA不能判定——就像只知道门框的宽度和门面的大小，不能确定门的开关方向。',
      formalDefinition:
        'ASA：两角和它们的夹边分别相等→全等。即：若∠B=∠E, BC=EF, ∠C=∠F，则△ABC≅△DEF（ASA）。\n\n' +
        'AAS：两角和其中一角的对边分别相等→全等。即：若∠A=∠D, ∠B=∠E, BC=EF（BC是∠A的对边），则△ABC≅△DEF（AAS）。\n\n' +
        'HL（直角三角形专用）：斜边和一条直角边分别相等→全等。即：在Rt△ABC和Rt△DEF中（∠C=∠F=90°），若AB=DE, BC=EF（或AC=DF），则△ABC≅△DEF（HL）。\n\n' +
        'SSA不是判定定理：已知两边和一个非夹角时，三角形不唯一（可以画两个不同的满足条件的三角形）。',
      formula:
        '\\text{ASA: } \\angle B = \\angle E, \\; BC = EF, \\; \\angle C = \\angle F \\\\' +
        '\\text{AAS: } \\angle A = \\angle D, \\; \\angle B = \\angle E, \\; BC = EF \\;(BC\\text{是}\\angle A\\text{的对边}) \\\\' +
        '\\text{HL: } \\angle C = \\angle F = 90°, \\; AB = DE, \\; BC = EF',
      associationReminders: [
        'ASA和AAS都只需要两个角和一条边——区别是边的位置：ASA的边在两组角之间（夹边），AAS的边是某一组角的对边',
        'HL只适用于直角三角形——如果题目没有明确说"直角三角形"，不能使用HL',
        'SSA为什么不行：画个草图——已知AB=6, BC=4, ∠A=30°。以B为圆心4为半径画弧，弧与以A为起点的射线可以交于两个点→两个不同的三角形',
        '口诀：五种判定记心中，SSA陷阱要躲开！（如果SSA中那个角恰好是直角→那其实就是HL——所以HL可以理解为"SSA在直角条件下的特例"）',
      ],
    },
  ],

  coreMethods: [
    {
      name: '证明全等的标准格式——三步法',
      derivation:
        '全等证明有其固定的书写格式——必须清楚地写出三个等量条件，然后指定所用的判定方法。这种格式确保阅卷老师（和机器）能轻松看到你的推理链。格式不规范是常见的扣分点。',
      steps: [
        '第1步：写"在△___和△___中"——注意顶点顺序对应',
        '第2步：逐行列出三个等量条件，每行注明条件来源（已知/已证/公共边等）',
        '第3步：写"∴△___≅△___（判定方法）"——方法用大写字母SSS/SAS/ASA/AAS/HL',
        '额外：全等后可以写"∴对应边/对应角相等"——这为下一步证明提供弹药',
      ],
      visualExplanation:
        '\\text{标准格式示例：} \\\\' +
        '\\text{在}\\triangle ABC\\text{和}\\triangle DEF\\text{中} \\\\' +
        '\\begin{cases} AB = DE \\;(\\text{已知})\\\\ \\angle B = \\angle E \\;(\\text{已知})\\\\ BC = EF \\;(\\text{已知}) \\end{cases} \\\\' +
        '\\therefore \\triangle ABC \\cong \\triangle DEF \\;(SAS) \\\\' +
        '\\therefore AC = DF \\;(\\text{全等三角形对应边相等})',
    },
    {
      name: '选择判定方法的"条件扫描法"',
      derivation:
        '拿到题后不要盲目套公式，先扫描已知条件——有几组边相等？几组角相等？然后根据条件和图形特征选择最优判定方法。这个过程就像"穿衣服"——有什么条件就穿什么"方法"。',
      steps: [
        '扫描已知条件：列出所有已知的等边和等角',
        '看是否有直角——如果有且已知一组斜边和一组直角边→优先考虑HL',
        '已知三组边→SSS（无需角的条件）',
        '已知两组边+一组角：(1)角在两边之间→SAS；(2)角在其中一边的对角→不能判定！（除非是直角→HL）',
        '已知两组角+一组边：(1)边在两组角之间→ASA；(2)边是某角的对边→AAS',
        '注意公共边/公共角——这是"隐形条件"，两个三角形共用同一条边或同一个角',
      ],
      visualExplanation:
        '\\text{决策树：} \\\\' +
        '\\text{有直角？} \\xrightarrow{\\text{是}} \\text{斜边+直角边？} \\xrightarrow{\\text{是}} HL \\\\' +
        '\\xrightarrow{\\text{否}} \\text{三组边？} \\xrightarrow{\\text{是}} SSS \\\\' +
        '\\xrightarrow{\\text{否}} \\text{两组边一个角？} \\xrightarrow{\\text{夹角？}} \\xrightarrow{\\text{是}} SAS \\;\\;\\; \\xrightarrow{\\text{否}} \\text{不能用！} \\\\' +
        '\\xrightarrow{\\text{否}} \\text{两组角一条边？} \\xrightarrow{\\text{夹边？}} \\xrightarrow{\\text{是}} ASA \\;\\;\\; \\xrightarrow{\\text{否}} AAS',
    },
  ],

  typicalQuestions: [
    {
      name: '单一判定方法的直接应用',
      essence: '题目明确给出三组等量条件，只需要选择正确的判定方法并写出规范的证明过程。这是最基础的全等证明——识别条件类型，套用对应方法。',
      solutionSteps: [
        '扫描已知条件——有多少组边等？多少组角等？',
        '对号入座：3边→SSS；2边1夹角→SAS；2角1夹边→ASA；2角1对边→AAS；直角+斜边+直角边→HL',
        '检查是否有"公共边/公共角"等隐含条件',
        '按标准格式写出证明',
      ],
      example: {
        problem: '如图，AB=DE，BC=EF，AC=DF。求证：△ABC ≅ △DEF。',
        stepByStepAnalysis: [
          '已知三组边分别相等：AB=DE, BC=EF, AC=DF',
          '三边→应选用SSS判定',
          '在△ABC和△DEF中列出三个条件，判定SSS',
        ],
        answer:
          '证明：\n' +
          '在△ABC和△DEF中\n' +
          '∵ AB = DE（已知）\n' +
          'BC = EF（已知）\n' +
          'AC = DF（已知）\n' +
          '∴ △ABC ≅ △DEF（SSS）',
        commonMistake: '三组边写对了但顶点顺序不对应——AB对应DE，BC对应EF，CA对应FD。如果写成AB=DE, BC=DF, CA=EF→对应关系混乱。',
      },
      variations: [
        {
          problem: '如图，在△ABC和△DCB中，AB=DC，∠ABC=∠DCB，BC=CB（公共边）。求证：△ABC ≅ △DCB。',
          hint: '两边一夹角：AB=DC（边），∠ABC=∠DCB（夹角），BC=CB（公共边）→SAS。',
          answer: 'SAS。（注意公共边BC=CB——同一条边在两个三角形中的写法不同，但长度当然相等。）',
        },
      ],
      summary: '单一判定题的核心是"对号入座"——什么条件对应什么方法。',
    },
    {
      name: '含公共边/公共角的全等证明',
      essence: '两个三角形共用一条边或一个角——这个"公共元素"既是第一个三角形的元素也是第二个三角形的元素。公共边/角天然相等，可以算作一个等量条件。这是北京中考最常见的全等证明题类型。',
      solutionSteps: [
        '观察图形中两个三角形是否共用边或角',
        '公共边：两个三角形都包含同一条线段（如BD是两个三角形的公共边→BD=DB）',
        '公共角：两个三角形共享同一个顶点角（如∠A既是△ABC的∠A也是△ABD的∠A）',
        '公共边/角算一组等量条件——结合题目给的另外两组条件凑齐三个',
        '选择对应的判定方法',
      ],
      example: {
        problem: '（2022北京中考第20题改编）\n如图，AB=AC，D是BC的中点。连接AD。求证：△ABD ≅ △ACD。',
        stepByStepAnalysis: [
          '已知：AB=AC（等腰），D是BC中点→BD=CD',
          'AD是公共边→AD=AD',
          '三组等量条件：AB=AC, BD=CD, AD=AD→三边→SSS',
          '也可以用SAS：AB=AC（边），∠BAD=∠CAD（等腰三角形三线合一），AD=AD（公共边）',
        ],
        answer:
          '证明：\n' +
          '在△ABD和△ACD中\n' +
          '∵ AB = AC（已知）\n' +
          'BD = CD（已知，D是BC的中点）\n' +
          'AD = AD（公共边）\n' +
          '∴ △ABD ≅ △ACD（SSS）\n' +
          '∴ ∠B = ∠C（全等三角形对应角相等）——由此证明了"等边对等角"！',
        commonMistake: '公共边的写法：AD在两个三角形中都是AD——所以写AD=AD（而不是AD=DA）。虽然线段没有方向，但对应关系要清晰。',
      },
      variations: [
        {
          problem: '如图，∠1=∠2，∠3=∠4。求证：△ABD ≅ △ACD。',
          hint: '两角一公共边：∠1=∠2（ASA中的一组角），∠3=∠4（ASA中的另一组角或者转化为边条件），AD=AD（公共边）。注意公共边的位置——AD是否为两组角的夹边？看图判断。',
          answer: '在△ABD和△ACD中：∠BAD=∠CAD（∠1=∠2），AD=AD（公共边），∠BDA=∠CDA（∠3=∠4）→ASA。',
        },
      ],
      summary: '公共边/公共角是送分条件——看到了就直接写"=自己"，白捡一组等量条件。',
    },
    {
      name: '辨别"真伪"——判断哪个条件组能判定全等',
      essence: '给出多组等量条件选项或描述，判断哪组能唯一判定两个三角形全等。这类题考察对五种判定方法的理解，尤其是"SSA陷阱"的识别。北京中考在前几道选择题中出现过类似题型。',
      solutionSteps: [
        '一一检查每组条件——3组等量关系分别是什么类型？',
        '对照五种判定方法：SSS/SAS/ASA/AAS/HL——是否匹配其中之一？',
        '特别警惕：两边+一个非夹角（即SSA）——立即排除！',
        '判断AAA（三角相等）——不能判定全等（只能判定两个三角形相似，大小可能不同）',
        '注意对应顺序——条件中的边和角是否对应同一个三角形中的正确位置？',
      ],
      example: {
        problem: '下列条件中，能判定△ABC≅△DEF的是？\nA. AB=DE, BC=EF, ∠A=∠D\nB. AB=DE, BC=EF, ∠C=∠F\nC. ∠A=∠D, ∠B=∠E, AC=DF\nD. ∠A=∠D, ∠B=∠E, ∠C=∠F',
        stepByStepAnalysis: [
          'A：AB=DE, BC=EF, ∠A=∠D——两边+∠A（A点处的角）。但是AB和BC的夹角是∠B，不是∠A或∠C。所以角不在两边之间→SSA（或ASS）→不能判定',
          'B：AB=DE, BC=EF, ∠C=∠F——两边+∠C（C点处的角）。AB和BC的夹角是∠B，∠C是BC和AC的夹角但不涉及AB。→SSA→不能判定',
          'C：∠A=∠D, ∠B=∠E, AC=DF——两角+一边。AC是∠B的对边→AAS→能判定！',
          'D：AAA——三角相等只能判定相似，不能判定全等（大小可能不同）',
        ],
        answer: 'C。AAS（两角一边——AC是∠B的对边）能判定全等。\nA和B都是SSA→不能判定。D是AAA→只能判定相似。',
        commonMistake: '看到"两边+一个角"就自然地认为能判定——忽略了"角必须是夹角"这个要求。SAS要求A在两个S之间。',
      },
      variations: [
        {
          problem: '判断：两个直角三角形中，斜边相等，一条直角边相等，能判定这两个直角三角形全等吗？',
          hint: 'HL！斜边+直角边→全等。所以能。',
          answer: '能。HL（斜边、直角边）——直角三角形专用。',
        },
        {
          problem: '判断：如果两个三角形的两边和其中一边的对角分别相等，能判定全等吗？',
          hint: '这就是经典的SSA（或ASS）。不能判定全等——可以画出两个不同形状的三角形满足条件。',
          answer: '不能。SSA不是判定方法——唯一例外是当那个角为直角时（即HL）。',
        },
      ],
      summary: '判定真伪的口诀："两边夹角能判定（SAS），两边对角不能判（SSA勿用）；两角夹边能判定（ASA），两角对边也能判（AAS）；三边永远能判定（SSS）；三角度数不能判（AAA非全等）。"',
    },
    {
      name: '添加条件——补全判定',
      essence: '题目给了两组等量条件，问"还需添加什么条件"才能判定全等。这是一种开放性问题——通常有多种正确答案（不同的添加对应不同的判定方法）。北京中考在填空题中出现过此类问题。',
      solutionSteps: [
        '列出已有的两组等量条件',
        '根据"缺什么补什么"原则——如果已有两边，缺的可能是第三边（→SSS）或夹角（→SAS）',
        '如果已有两角，缺的可以是夹边（→ASA）或某一角的对边（→AAS）',
        '提供最自然的补充条件——通常是题中没有但容易推出的那个',
      ],
      example: {
        problem: '（2021北京中考第15题改编）\n如图，在△ABC和△DEF中，AB=DE，∠B=∠E。要判定△ABC≅△DEF，还需添加什么条件？（写出两种不同的答案）',
        stepByStepAnalysis: [
          '已有条件：一组边（AB=DE）和一组角（∠B=∠E）',
          '方案一：再加一组边→看已有边和后加边的关系。加BC=EF→AB和BC的夹角是∠B→SAS',
          '方案二：再加一组角。加∠A=∠D时，已知边AB是两已知角的夹边，可用ASA；加∠C=∠F时，已知边AB不是两已知角的夹边，可用AAS。',
          '方案三：加AC=DF→此时AB=DE, AC=DF, ∠B=∠E。注意∠B不是AB和AC的夹角（AB和AC的夹角是∠A→未知）→SSA→不行！',
        ],
        answer:
          '答案一：添加BC=EF（→SAS）。\n' +
          '答案二：添加∠A=∠D（→ASA）。也可以添加∠C=∠F（→AAS）。\n' +
          '（开放题可能有多种正确答案，根据具体图形判断。）',
        commonMistake: '随便加一个条件，不检查是否凑成有效的判定方法。特别是加了AC=DF变成SSA——要验证"角的位置是否在两边之间"。',
      },
      variations: [
        {
          problem: '如图，AC=DF，∠A=∠D。还需添加什么条件才能证明△ABC≅△DEF？（给出两种方案）',
          hint: '方案一：加AB=DE→SAS（AC=DF已知，AB=DE补充，夹角∠A=∠D）。方案二：加∠C=∠F→ASA（∠A=∠D, AC=DF夹边, ∠C=∠F）。',
          answer: '方案一：AB=DE（SAS）。方案二：∠C=∠F（ASA）。',
        },
      ],
      summary: '补全条件的思路：看已有的是哪些类型，对照五种判定方法补全——"两边补一边成SSS或补一夹角成SAS；两角补夹边成ASA或补对边成AAS"。',
    },
  ],

  commonMistakes: [
    {
      wrongExample: '看到AB=DE, BC=EF, ∠A=∠D，直接写SAS——"两边一个角，肯定是SAS"',
      wrongReason: 'SAS要求角在两边的"中间"（夹角）。这里的∠A是A处的角——AB和BC的夹角是∠B（在B点处），∠A是AB和AC的夹角。AB、BC、∠A三者无法组成SAS——这是SSA（已知两边AB和BC，角∠A不和这两边构成夹角）。',
      correctApproach: '画图确认：已知边AB和BC的公共端点是B，所以它们的夹角是∠B。∠A不是这两条边的夹角，不能据此使用SAS。',
      relatedReminder: 'SAS = 边-角-边（S-A-S），三个字母表示"第一条边→夹角→第二条边"。注意看字母是否对应到图形中的位置。',
    },
    {
      wrongExample: '把SSA和HL搞混——在一个非直角三角形中用HL判定全等',
      wrongReason: 'HL是直角三角形专用的判定方法——必须首先确认三角形是直角三角形（∠C=∠F=90°）。对于一般三角形，即使"斜边"和"直角边"相等，也不能用HL。',
      correctApproach: '用HL必须满足两个前提：(1)三角形是直角三角形；(2)斜边和一条直角边分别相等。在证明中必须先写"∠C=∠F=90°（已知）"或"在Rt△ABC和Rt△DEF中"。',
      relatedReminder: 'HL本质上是"SSA在直角条件下的特例"——因为直角的存在固定了另一边（用勾股定理），所以此时SSA实际上变成了SSS。',
    },
    {
      wrongExample: '证明格式不写判定方法或写错——写"∴△ABC≅△DEF"不写括号里的(SSS)',
      wrongReason: '判定方法必须写——这是全等证明完整性的要求。不写判定方法，阅卷老师不知道你"凭什么"说全等。',
      correctApproach: '格式最后一行必须是："∴△ABC ≅ △DEF（SSS）"——括号里的大写字母（SSS/SAS/ASA/AAS/HL）不能漏，也不能写错。',
      relatedReminder: '有的学生在这里写"边边边"或"S.S.S."——标准写法是大写字母不加点：SSS（不是S.S.S.也不是边边边）。',
    },
    {
      wrongExample: '对应顶点顺序不对——△ABC≅△DEF写成△ABC≅△FDE',
      wrongReason: '虽然没有"错"到导致全等不成立，但对应关系混乱会给后续的"对应边/对应角相等"带来麻烦——你看不出来AB对应F D还是DF。',
      correctApproach: '写△ABC≅△DEF时，A↔D、B↔E、C↔F。这样看对应关系一目了然：第一个字母A对应D，第二个字母B对应E，第三个字母C对应F。',
      relatedReminder: '写对应关系的小技巧：把相等的元素写在同一行，然后从上到下读字母顺序。如：AB=DE, BC=EF, CA=FD→ABC↔DEF。',
    },
  ],

  exercises: {
    basic: [
      {
        id: 'ex-24-basic-1',
        question: '如图，AB=DE，BC=EF，CA=FD。求证：△ABC ≅ △DEF。',
        answer: '在△ABC和△DEF中\n∵ AB = DE（已知）\nBC = EF（已知）\nCA = FD（已知）\n∴ △ABC ≅ △DEF（SSS）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-basic-2',
        question: '如图，AB=AC，∠B=∠C=45°。哪个判定方法可直接判断△ABD和△ACD全等？（其中D是BC的中点）',
        answer: 'AB=AC（已知边），∠B=∠C（已知角），BD=CD（D是中点→另一组边）。AB和BD的夹角是∠B，AC和CD的夹角是∠C→SAS。（或者AB=AC, AD=AD公共边, ∠BAD=∠CAD→SAS）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-basic-3',
        question: '下列条件能判定两个三角形全等的是？\nA. 两角一边（边是夹边）\nB. 两边和其中一个边的对角\nC. 三组角分别相等\nD. 两边一夹角',
        answer: 'A和D都能。\nA→ASA（两角夹边）。D→SAS。\nB是SSA→不能。C是AAA→只能相似。',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-basic-4',
        question: '如图，在Rt△ABC和Rt△DEF中，∠C=∠F=90°，AB=DE，AC=DF。求证：△ABC ≅ △DEF。',
        answer: '在Rt△ABC和Rt△DEF中\n∵ ∠C = ∠F = 90°（已知）\nAB = DE（已知，斜边相等）\nAC = DF（已知，直角边相等）\n∴ △ABC ≅ △DEF（HL）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-basic-5',
        question: '如图，∠A=∠D，∠B=∠E，BC=EF。求证：△ABC ≅ △DEF。用的是哪种判定方法？',
        answer: 'AAS（两角一对边）。BC=EF是边，∠A=∠D和∠B=∠E是两组角——边BC是∠A的对边。\n\n证明：在△ABC和△DEF中\n∵ ∠A = ∠D（已知）\n∠B = ∠E（已知）\nBC = EF（已知）\n∴ △ABC ≅ △DEF（AAS）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
    ],
    intermediate: [
      {
        id: 'ex-24-inter-1',
        question: '（2023北京中考第18题改编）\n如图，AB=DC，∠ABC=∠DCB。求证：△ABC ≅ △DCB。',
        answer: '在△ABC和△DCB中\n∵ AB = DC（已知）\n∠ABC = ∠DCB（已知）\nBC = CB（公共边）\n∴ △ABC ≅ △DCB（SAS）',
        hint: '注意公共边BC=CB——两个三角形共用BC，但写法不同。',
        difficulty: 'intermediate',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-inter-2',
        question: '如图，点B、E、C、F在同一直线上，AB=DE，AC=DF，BE=CF。求证：△ABC ≅ △DEF。',
        answer: 'B、E、C、F共线，BE=CF→BE+EC=CF+EC→BC=EF\n\n在△ABC和△DEF中\n∵ AB = DE（已知）\nAC = DF（已知）\nBC = EF（已证：由BE=CF两段加公共段EC得到）\n∴ △ABC ≅ △DEF（SSS）',
        hint: '由BE=CF推出BC=EF是关键——在直线上，等长线段的等长延长仍等长。',
        difficulty: 'intermediate',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-inter-3',
        question: '如图，AC∥DF，BC∥EF，AB=DE。问：需要添加什么条件就能判定△ABC≅△DEF？请给出两种不同方案。',
        answer: '由AC∥DF→∠A=∠D（同位角或内错角，取决于截线）。由BC∥EF→∠B=∠E（同理）。\n\n已有：AB=DE（边），∠A=∠D（角），∠B=∠E（角）。AB是∠C的对边→AAS可以直接判定。\n\n但如果题干要求"添加条件"（且已给的条件不足以凑成完整判定）：\n方案一：加AC=DF→SAS（AB=DE, AC=DF, 夹角∠A=∠D）\n方案二：加∠C=∠F→ASA或AAS',
        hint: '利用平行线性质把"平行"转化为"角相等"——这是常见技巧。',
        difficulty: 'intermediate',
        flaggedConceptIds: ['congruent-triangles', 'parallel-lines-angles'],
      },
    ],
    challenge: [
      {
        id: 'ex-24-challenge-1',
        question: '如图，在△ABC中，AB=AC。D在△ABC内部，且DB=DC。(1)求证：△ABD≅△ACD。(2)由此得出什么结论？',
        answer: '(1)在△ABD和△ACD中\n∵ AB = AC（已知）\nDB = DC（已知）\nAD = AD（公共边）\n∴ △ABD ≅ △ACD（SSS）。\n\n(2)由全等得∠BAD=∠CAD，所以AD平分∠BAC；还可得∠BDA=∠ADC，所以AD平分∠BDC。又因为A、D都到B、C两点距离相等，所以A、D都在线段BC的垂直平分线上，即直线AD垂直平分BC。',
        hint: '公共边AD+两组已知边→SSS。全等后对应角相等——其中的结论（AD平分∠BAC）实际上是"到线段两端距离相等的点在这条线段的垂直平分线上"的特例。',
        difficulty: 'challenge',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-24-challenge-2',
        question: '已知△ABC与△DEF中，AB=DE，AC=DF，BC边上的中线AM等于EF边上的中线DN。求证：△ABC≅△DEF。',
        answer: '延长AM到P，使MP=AM；延长DN到Q，使NQ=DN。因为M、N分别是BC、EF的中点，所以四边形ABPC与DEQF的对角线分别互相平分，它们都是平行四边形。于是BP=AC，EQ=DF，且AP=2AM，DQ=2DN。\n\n在△ABP和△DEQ中，AB=DE，BP=EQ，AP=DQ，所以△ABP≅△DEQ（SSS），从而∠BAM=∠EDN。\n\n在△ABM和△DEN中，AB=DE，AM=DN，∠BAM=∠EDN，所以△ABM≅△DEN（SAS），得BM=EN，即BC=EF。最后由AB=DE、AC=DF、BC=EF，得△ABC≅△DEF（SSS）。',
        hint: '把中线延长一倍，利用“对角线互相平分的四边形是平行四边形”，把已知两边转化为构造三角形的边，再连续使用SSS和SAS。',
        difficulty: 'challenge',
        flaggedConceptIds: ['congruent-triangles'],
      },
    ],
    knowledgeTransfer: [
      {
        id: 'ex-24-transfer-1',
        question: '（连接Lecture 25——全等三角形的应用）\n如图，在△ABC中，D是BC的中点。过C作CE∥AB交AD的延长线于E。\n(1)求证：△ABD ≅ △ECD。\n(2)由全等能推出AB=CE吗？为什么？\n(3)这个图形在全等证明中有什么特殊意义？',
        answer: '(1)在△ABD和△ECD中，D是BC中点，所以BD=CD；∠ADB=∠CDE（对顶角）；∠ABD=∠ECD（两直线平行，内错角相等）。边BD、CD分别是这两组已知角的夹边，所以△ABD≅△ECD（ASA）。\n\n(2)由全等三角形对应边相等，得AB=CE。\n\n(3)这个图形通过平行线、对顶角和中点构造全等，把线段AB的长度关系“搬运”到CE。',
        hint: '利用平行线提供等角条件、对顶角提供等角条件、中点提供等边条件→AAS。',
        difficulty: 'transfer',
        flaggedConceptIds: ['congruent-triangles', 'parallel-lines-angles'],
        knowledgeChain: [
          '三角形全等的判定方法（Lecture 24）',
          '利用全等关系进行"等量搬运"（移花接木）',
          '为证明边等和角等提供工具→Lecture 25全等三角形综合证明',
          '倍长中线法→一个常见的几何构造规律',
        ],
      },
    ],
  },

  oralTask: {
    problem: '请口头解释：为什么SSA不能判定两个三角形全等？用语言描述加画图说明——具体解释在什么情况下两组边和一个非夹角相等可以对应两个不同的三角形。',
    script: [
      '第一步：明确SSA的定义。SSA指的是已知两组边和其中一条边所对的一个角相等——比如已知AB=DE, BC=EF, ∠A=∠D。注意角∠A不是两边AB和BC的夹角（夹角是∠B），而是边BC的对角。',
      '第二步：构造反例。在纸上画一个角∠XAY=∠D=30°。在射线AX上截取线段AX=AB。然后以B为圆心，BC长为半径画弧——由于BC可能比较短，这条弧与射线AY可能交于两个点！这两个点分别是C₁和C₂。',
      '第三步：得出两个不同的三角形△ABC₁和△ABC₂。它们有相同的AB, BC长度和相同的∠A=30°，但形状不同——一个可能是锐角三角形，另一个可能是钝角三角形。所以已知条件不能唯一确定三角形。',
      '第四步：唯一的例外——直角。如果那个角恰好是直角（∠A=90°），那么以B为圆心、BC为半径的弧与射线AY可能只交于一个点（考虑到勾股定理的约束），这就是HL——直角三角形的SSA特例。',
      '第五步总结：SSA之所以不行，是因为"边-边-角"不是刚性的——角度不约束两个边的相对位置（它约束的是一个边和一个方向上任意线段之间的角），所以无法确定第三条边的位置。而SAS中角度作为"夹角"约束了两条边的相对方向→唯一确定三角形。区别就在于：角在两边之间（SAS）vs角在两边之外（SSA）。',
    ],
  },

  errorCard: {
    fields: {
      errorNumber: 'EB-24-001',
      errorType: '使用SSA判定全等',
      errorReason: '在两角一边或两边一等角条件下，不检查"角是否为夹角"就使用判定。尤其是已知AB=DE, BC=EF, ∠A=∠D时，自然地用SAS判定——但∠A不是AB和BC的夹角（夹角是∠B），这是SSA，不能判定。',
      correctMethod: '三个步骤避免SSA陷阱：(1)画一个简单的草图；(2)在图上用不同颜色标出已知的两条边；(3)在图上圈出已知的角——看这个角的顶点在哪里、这个角夹在哪些边之间。如果角不是两条已知边的夹角→马上放弃SAS，检查是否还有其他条件能用。',
      similarPractice: '已知：在△ABC和△DEF中，AB=DE=5, AC=DF=7, ∠B=∠E=30°。问：这两个三角形一定全等吗？请说明理由。\n（答案：不一定。这是SSA——已知两边AB、AC和其中一边AC的对角∠B。画图可以发现满足这一条件的三角形有两种可能，一种∠A≈103°，一种∠A≈17°。）',
      mastered: false,
    },
  },

  animationIds: ['congruent-overlay'],
}

export default lecture24
