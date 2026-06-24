import type { Lecture } from '@/types'

const lecture25: Lecture = {
  meta: {
    id: 25,
    title: '全等三角形综合证明',
    moduleId: 4,
    orderInModule: 7,
    overview:
      '全等三角形是几何证明的"瑞士军刀"——要证边等或角等，往往先证三角形全等。本讲聚焦于利用全等三角形来证明线段相等、角相等，以及常见辅助线的添加方法（连接、延长、作平行线、倍长中线）。证明过程的规范书写是重点。',
    objectives: [
      '掌握"要证边等或角等→先证三角形全等"的核心思想',
      '能利用全等三角形证明线段相等和角相等',
      '掌握常见辅助线的添加方法：连接两点、延长线段、作平行线',
      '能规范书写完整的全等证明过程',
      '能独立完成含一步或多步全等证明的中等难度综合题',
    ],
    durationMinutes: 60,
    oneLineMainIdea: '全等三角形不是终点而是工具——证出全等后，立刻得到对应边等和对应角等。这两个结论才是做题真正要用的。',
    conceptIds: ['congruent-triangles'],
    prerequisiteLectureIds: [24],
    followupLectureIds: [26, 30],
    isFullContent: true,
  },

  knowledgeNetwork: {
    fromWhere: [
      '全等三角形五种判定（Lecture 24）：SSS、SAS、ASA、AAS、HL是本讲的基础工具',
      '平行线判定与证明（Lecture 21）：几何证明格式（"因为……所以……理由是……"）在全等证明中继续使用',
      '三角形基础（Lecture 23）：内角和、三边关系等为全等证明提供推导零件',
    ],
    currentCore: [
      '核心思想：要证边等→先证两个三角形全等；要证角等→也先证两个三角形全等',
      '证明流程：已知条件→凑齐三组等量条件→判定全等→由全等得对应边/角相等→获得目标结论',
      '常见辅助线：(1)连接两点——制造公共边和三角形；(2)延长线段——构造对顶角和等角；(3)作平行线——为全等提供等角条件',
      '证明规范：格式完整、条件来源清楚、判定方法准确、全等后的对应结论书写正确',
    ],
    toWhere: [
      '角平分线与垂直平分线（Lecture 26）：角平分线性质可用全等三角形证明',
      '等腰三角形（Lecture 27）：等边对等角、三线合一——都可用全等来证明',
      '四边形综合（Lecture 30）：平行四边形对边相等、对角线互相平分——利用全等三角形来推导',
      '几何证明专题（Lecture 43）：将全等作为证明工具综合运用',
    ],
    relationDiagram: `  Lecture 24（五种全等判定方法）
           │
           ▼
  Lecture 25 全等三角形综合证明
  ┌─────────────────────────────────┐
  │  证边等 → 先找全等三角形           │
  │  证角等 → 也先找全等三角形         │
  │  辅助线：连接 + 延长 + 作平行线    │
  │  格式：因为→所以→理由              │
  └────────────┬────────────────────┘
               │
   ┌───────────┼───────────┬──────────┐
   ▼           ▼           ▼          ▼
角平分线    等腰三角形    四边形    几何证明专题
(L26)      (L27)       (L30)    (L43)`,
  },

  concepts: [
    {
      title: '全等三角形的"工具属性"——证边等和角等的跳板',
      everydayAnalogy:
        '全等三角形就像一本"翻译字典"——有时你想证明两条线段相等，但它们不在同一个三角形里，没法直接比。这时你找到一个全等关系，"翻译"后就能把一条线段"搬"到另一条的位置上。"我不会直接证AB=CD——但我先证它们所在的三角形全等，然后对应边相等自然就拿到了。"',
      formalDefinition:
        '全等三角形在几何证明中的根本作用：\n' +
        '(1) 证线段相等：先证两个三角形全等→全等三角形对应边相等→目标线段相等。\n' +
        '(2) 证角相等：先证两个三角形全等→全等三角形对应角相等→目标角相等。\n' +
        '这就是"要证什么→先证全等"的核心逻辑——全等是连接"已知条件"和"目标结论"的桥梁。',
      formula:
        '\\text{全等} \\;\\Rightarrow\\; \\begin{cases} \\text{对应边相等} \\;\\Rightarrow\\; \\text{证线段等} \\\\ \\text{对应角相等} \\;\\Rightarrow\\; \\text{证角等} \\end{cases}',
      associationReminders: [
        '证完全等之后紧接着一定要写"对应边/对应角相等"这一行——很多人证明全等后就停了（以为完事了），忘了全等只是手段，不是目的',
        '找出需要证明相等的线段/角分属哪两个三角形——这两个三角形就是要证明全等的目标',
        '如果目标线段/角不在三角形内——考虑构造辅助线把它们放进三角形里',
      ],
    },
    {
      title: '三步骤证明法——"找三角形→凑条件→判全等→得结论"',
      everydayAnalogy:
        '全等证明有固定的节奏——就像做菜：第一步备菜（找出两个目标三角形），第二步配料（凑齐三组等量条件），第三步下锅（写判定方法），第四步出锅（写对应边/角相等）。跳步就"夹生"。',
      formalDefinition:
        '全等证明的标准流程：\n' +
        '第一步：确定目标——要证的是哪两条线段相等/哪两个角相等？它们分别属于哪两个三角形？\n' +
        '第二步：搜集条件——在图形中寻找三组等量关系（边或角），可能来源：已知条件、公共边/角、对顶角、平行线角关系、中点……\n' +
        '第三步：写出证明——用标准格式：在△___和△___中，逐行列条件，最后写"∴___≅___（判定方法）"。\n' +
        '第四步：利用全等——写"∴目标结论（全等三角形对应边/角相等）"。',
      formula:
        '\\text{目标：证 } AB = CD \\\\' +
        '\\text{寻找：} AB \\in \\triangle ABE, \\; CD \\in \\triangle CDE \\\\' +
        '\\text{证明 } \\triangle ABE \\cong \\triangle CDE \\\\' +
        '\\Rightarrow AB = CD \\;(\\text{全等三角形对应边相等})',
      associationReminders: [
        '第一步容易被跳过——学生看到"证AB=CD"就直接去找AB和CD的关系，忘了先锁定它们所在的三角形',
        '公共边/公共角是"免费条件"——如果两个三角形共享一条边或一个角，自动获得一组等量条件',
        '证明链可能不止一步：有时先证全等A得到某个中间条件，再用该条件去证全等B，最终获得目标结论',
      ],
    },
    {
      title: '常见辅助线——"桥梁"的三种搭法',
      everydayAnalogy:
        '两个村子之间有一条河——怎么修桥？第一种：直接在两个村子之间拉一座桥（连接两点）。第二种：在河两岸各建一个码头，然后用渡船运到对岸（作平行线）。第三种：把河岸扩大，铺路到更远的地方（延长线）。这三种"修路"方法就是全等证明中最常用的辅助线。',
      formalDefinition:
        '辅助线一：连接两点（如"连接AC"或"连接BD"）。作用：将两个原本孤立的三角形连接起来——制造公共边或构造需要的三角形。\n\n' +
        '辅助线二：延长某条线段（如"延长AD至E"）。作用：使延长的部分等于某已知线段，或者构造对顶角/平角关系。\n\n' +
        '辅助线三：过某点作平行线（如"过C作CE∥AB"）。作用：利用平行线性质（内错角相等、同位角相等）为全等提供等角条件。\n\n' +
        '注意：辅助线必须用虚线表示，并在证明开头说明"作……"（辅助线是"造"出来的，不是"已知"的）。',
      formula:
        '\\text{连接：作线段 } AC \\\\' +
        '\\text{延长：延长 } AD \\text{ 至 } E \\text{，使 } DE = AD \\\\' +
        '\\text{作平行线：过 } C \\text{ 作 } CE \\parallel AB',
      associationReminders: [
        '辅助线是"构造"出来的条件——在证明中写"作……"开头，不能写成"已知"',
        '"倍长中线"是延长线段的一种经典用法：延长中线AD至E使DE=AD→构造全等（这是Lecture 30中证明平行四边形性质的经典辅助线）',
        '辅助线的灵感来源：从结论倒推——要证某个结论需要什么条件？缺少的条件能不能通过辅助线"造"出来？',
      ],
    },
  ],

  coreMethods: [
    {
      name: '"要证什么→先证全等"的逆向思维',
      derivation:
        '拿到一道证明题，不要从已知条件开始"闷头推"——先看结论！结论是线段等还是角等？它们在哪两个三角形里？这两个三角形可能全等吗？然后从可能全等的判定方法所需的条件倒推已知条件。这种"目标驱动"的思维是解决复杂证明题的关键。',
      steps: [
        '第1步：圈出结论——要证的是哪两条线段相等/哪两个角相等？',
        '第2步：锁定三角形——结论涉及的线段/角分别属于哪两个三角形？用不同颜色笔勾出来',
        '第3步：猜测判定方法——根据图形特征猜测可能用SSS/SAS/ASA/AAS/HL中的哪一个',
        '第4步：逆向搜集条件——该判定方法需要哪三组等量？已知条件给了几组？还缺什么？',
        '第5步：正向写证明——从已知条件出发，按照标准格式写出完整证明',
      ],
      visualExplanation:
        '\\text{例：目标证 } AB = CD \\\\' +
        '\\text{AB 在 } \\triangle ABE \\text{ 中，} CD \\text{ 在 } \\triangle CDE \\text{ 中} \\\\' +
        '\\text{猜测用 SAS —— 需要：} \\\\' +
        '\\quad \\text{① 一组边等：可能 AE = CE（已知？）} \\\\' +
        '\\quad \\text{② 一组夹角等：可能 } \\angle AEB = \\angle CED \\text{（对顶角！免费）} \\\\' +
        '\\quad \\text{③ 另一组边等：可能 } BE = DE \\text{（E是中点？）} \\\\' +
        '\\text{三组凑齐 → SAS → 全等 → AB = CD！}',
    },
    {
      name: '多步全等证明——"串联"思维',
      derivation:
        '有些题目一次全等证明不够——结论需要的条件需要通过第一次全等来提供。这就形成了"全等链"：第一个全等→提供中间条件（某边等或某角等）→第二个全等→最终结论。这种多步推理需要全局规划能力。',
      steps: [
        '分析最终结论——要证什么？这和第一步直接全等证明不同——有时目标线段/角不在"明显全等"的两个三角形里',
        '如果直接全等条件不够→寻找"中间跳板"——有什么可以先证明的全等？证明它之后能得到什么？',
        '用第一次全等的结论（对应边/角相等）作为第二次全等的条件之一',
        '注意：每一步全等都要写完整的格式——两组全等不能混在一个"在△___和△___中"里面',
        '最后画一条推理链：条件A→全等1→中间结论B→全等2→最终结论',
      ],
      visualExplanation:
        '\\text{全等1：} \\triangle ABD \\cong \\triangle CDB \\;(SAS) \\\\' +
        '\\Rightarrow \\angle ADB = \\angle CBD \\;(\\text{对应角相等——中间条件}) \\\\' +
        '\\text{全等2：} \\triangle ABE \\cong \\triangle CDF \\;(ASA) \\\\' +
        '\\Rightarrow AE = CF \\;(\\text{最终结论})',
    },
  ],

  typicalQuestions: [
    {
      name: '利用全等证线段相等',
      essence: '结论是"某两条线段相等"——找到一个全等三角形关系，让目标线段成为对应边。这是全等最直接的应用。北京中考证明题几乎年年考这种基本模式。',
      solutionSteps: [
        '确认要证哪两条线段相等',
        '找到这两条线段分别属于哪两个三角形——这两个三角形就是要证全等的目标',
        '凑齐三组等量条件（通常来自已知条件、公共边/角、中点、对顶角等）',
        '证明这两个三角形全等',
        '由全等得出目标线段相等（全等三角形对应边相等）',
      ],
      example: {
        problem: '（2020北京中考第19题改编）\n如图，点C是线段AB的中点，CD=CE，∠ACD=∠BCE。求证：AD=BE。',
        stepByStepAnalysis: [
          '目标：证AD=BE。AD在△ACD中，BE在△BCE中→需证△ACD≅△BCE',
          '搜集条件：C是AB中点→AC=BC。CD=CE（已知）。∠ACD=∠BCE（已知）',
          'AC=BC（边），∠ACD=∠BCE（夹角），CD=CE（另一组边）→SAS！',
          '△ACD≅△BCE（SAS）→AD=BE（对应边相等）',
        ],
        answer:
          '证明：\n' +
          '∵ C是AB的中点（已知）\n' +
          '∴ AC = BC（线段中点定义）\n' +
          '在△ACD和△BCE中\n' +
          '∵ AC = BC（已证）\n' +
          '∠ACD = ∠BCE（已知）\n' +
          'CD = CE（已知）\n' +
          '∴ △ACD ≅ △BCE（SAS）\n' +
          '∴ AD = BE（全等三角形对应边相等）',
        commonMistake: '证完全等就停笔——忘了写最后一行"AD=BE"。全等只是手段，最后的对应边/角相等才是题目要的答案。',
      },
      variations: [
        {
          problem: '如图，AB∥CD，AB=CD。求证：AD=BC。',
          hint: '连接AC→△ABC和△CDA中：AB=CD（已知），∠BAC=∠DCA（内错角），AC=CA（公共边）→SAS→全等→AD=BC。',
          answer:
            '证明：连接AC\n' +
            '在△ABC和△CDA中\n' +
            '∵ AB = CD（已知）\n' +
            '∠BAC = ∠DCA（AB∥CD，内错角相等）\n' +
            'AC = CA（公共边）\n' +
            '∴ △ABC ≅ △CDA（SAS）\n' +
            '∴ AD = BC（全等三角形对应边相等）',
        },
      ],
      summary: '证线段等→先找两个三角形→证全等。每次全等后必须写"对应边/角相等"。',
    },
    {
      name: '利用全等证角相等',
      essence: '结论是"某两个角相等"——同样先证包含这两个角的两个三角形全等，然后对应角相等就是结论。常见于证明角平分线、判断平行等题目。',
      solutionSteps: [
        '确认目标角——要证哪两个角相等？',
        '找到包含这两个角的两个三角形',
        '凑齐等量条件→证明这两个三角形全等',
        '由全等得出目标角相等（全等三角形对应角相等）',
      ],
      example: {
        problem: '如图，AB=AC，BD=CD。求证：∠BAD=∠CAD。',
        stepByStepAnalysis: [
          '目标：证∠BAD=∠CAD。∠BAD在△ABD中，∠CAD在△ACD中→需证△ABD≅△ACD',
          'AB=AC（已知），BD=CD（已知），AD=AD（公共边）→SSS',
          '△ABD≅△ACD（SSS）→∠BAD=∠CAD（对应角相等）',
          '旁通：这实际上证明了AD是∠BAC的角平分线！',
        ],
        answer:
          '证明：\n' +
          '在△ABD和△ACD中\n' +
          '∵ AB = AC（已知）\n' +
          'BD = CD（已知）\n' +
          'AD = AD（公共边）\n' +
          '∴ △ABD ≅ △ACD（SSS）\n' +
          '∴ ∠BAD = ∠CAD（全等三角形对应角相等）\n' +
          '∴ AD平分∠BAC（角平分线定义）',
        commonMistake: '公共边AD=AD要写——不要因为"废话"就省略。在全等证明中每一组等量条件都必须明确写出。',
      },
      variations: [
        {
          problem: '如图，已知AE=CE，∠A=∠C。求证：∠ABE=∠CDE。',
          hint: 'AE=CE, ∠A=∠C, ∠AEB=∠CED（对顶角）→AAS→△ABE≅△CDE→∠ABE=∠CDE。',
          answer:
            '证明：\n' +
            '在△ABE和△CDE中\n' +
            '∵ ∠A = ∠C（已知）\n' +
            '∠AEB = ∠CED（对顶角相等）\n' +
            'AE = CE（已知）\n' +
            '∴ △ABE ≅ △CDE（AAS）\n' +
            '∴ ∠ABE = ∠CDE（全等三角形对应角相等）',
        },
      ],
      summary: '证角等和证线段等的流程完全相同——先证全等，再取对应角。',
    },
    {
      name: '需要添加辅助线的全等证明',
      essence: '题目中的图形缺少明确的三角形结构——需要通过添加辅助线（连接、延长、作平行线）来构造可以证明全等的三角形。这是全等证明中的"进阶"题型，也是北京中考压轴题中常见的构思。',
      solutionSteps: [
        '分析图形——目标线段/角目前是否属于某个现成的三角形？如果没有→需要辅助线',
        '选择辅助线类型：\n  - 连接两点→造三角形和公共边\n  - 延长线段→造对顶角或等线段\n  - 作平行线→造等角（内错角/同位角）',
        '在证明开头写"连接/延长/作……"（辅助线用虚线画）',
        '利用辅助线提供的条件凑齐三组等量→证全等→得结论',
      ],
      example: {
        problem: '如图，在△ABC中，AB=AC。D是BC的中点。求证：AD⊥BC。',
        stepByStepAnalysis: [
          '没有明显需要构造的辅助线——△ABD和△ACD已经存在。AB=AC, BD=CD(D是中点), AD=AD公共边→SSS',
          '△ABD≅△ACD→∠ADB=∠ADC',
          '又∠ADB+∠ADC=180°（B、D、C共线→平角）',
          '∴∠ADB=∠ADC=90°→AD⊥BC',
          '实际上这道题不需要额外辅助线。但当条件不足时，连接两点是最常用的辅助线。',
        ],
        answer:
          '证明：\n' +
          '∵ D是BC的中点（已知）\n' +
          '∴ BD = CD（中点定义）\n' +
          '在△ABD和△ACD中\n' +
          '∵ AB = AC（已知）\n' +
          'BD = CD（已证）\n' +
          'AD = AD（公共边）\n' +
          '∴ △ABD ≅ △ACD（SSS）\n' +
          '∴ ∠ADB = ∠ADC（全等三角形对应角相等）\n' +
          '∵ ∠ADB + ∠ADC = 180°（B、D、C三点共线，平角）\n' +
          '又∠ADB = ∠ADC\n' +
          '∴ ∠ADB = ∠ADC = 90°\n' +
          '∴ AD⊥BC（垂直定义）',
        commonMistake: '证出∠ADB=∠ADC后就停了——还需要结合"两角之和=180°"才能推出各为90°。疏忽了"垂直"需要90°这个条件。',
      },
      variations: [
        {
          problem: '如图，已知AB=CD，∠B=∠D=90°。求证：△ABC≅△CDA。',
          hint: '需要连接AC——这样△ABC和△CDA就有了公共边AC。然后用HL（∠B=∠D=90°, AB=CD, AC=CA）或SAS。',
          answer:
            '证明：连接AC\n' +
            '在Rt△ABC和Rt△CDA中（∠B=∠D=90°）\n' +
            '∵ AB = CD（已知）\n' +
            'AC = CA（公共边/斜边）\n' +
            '∴ Rt△ABC ≅ Rt△CDA（HL）',
        },
      ],
      summary: '辅助线是"无中生有"的艺术——当现有图形没有现成的三角形关系时，自己造一个。',
    },
    {
      name: '等量代换与全等的综合推理',
      essence: '题目中条件分散——有的角相等来自平行线，有的边相等来自中点，有的关系需要经过"等量代换"才能用到全等条件中。这要求学生将多项知识串联使用。北京中考的几何证明题常以此类形式出现。',
      solutionSteps: [
        '逐一梳理条件：把每个已知条件都转换成等边或等角的形式',
        '平行线→同位角/内错角相等或同旁内角互补',
        '中点→线段被平分（两段相等）',
        '角平分线→两角相等',
        '对顶角→相等（自动获得）',
        '将所有"转化后"的条件对号入座——看能否凑成全等所需的三组条件',
      ],
      example: {
        problem: '（2022北京中考第20题改编）\n如图，AB∥CD，E是AD的中点。连接BE并延长交CD于F。求证：BE=EF。',
        stepByStepAnalysis: [
          '目标：证BE=EF。BE在△ABE中，EF在△DEF中→需证△ABE≅△DEF',
          '条件转化：\n  ①E是AD中点→AE=DE\n  ②AB∥CD→∠A=∠D（内错角，AB和CD平行，AD是截线）\n  ③∠AEB=∠DEF（对顶角——BE延长交CD于F→B、E、F共线）',
          '已有：AE=DE（边），∠A=∠D（角），∠AEB=∠DEF（角）→AAS或ASA',
          '△ABE≅△DEF（ASA：∠A=∠D, AE=DE夹边, ∠AEB=∠DEF）→BE=EF！',
        ],
        answer:
          '证明：\n' +
          '∵ E是AD的中点（已知）\n' +
          '∴ AE = DE（中点定义）\n' +
          '∵ AB ∥ CD（已知）\n' +
          '∴ ∠A = ∠D（两直线平行，内错角相等）\n' +
          '在△ABE和△DFE中\n' +
          '∵ ∠A = ∠D（已证）\n' +
          'AE = DE（已证）\n' +
          '∠AEB = ∠DEF（对顶角相等）\n' +
          '∴ △ABE ≅ △DFE（ASA）\n' +
          '∴ BE = EF（全等三角形对应边相等）',
        commonMistake: '把"内错角"和"同位角"搞混——AB∥CD，AD是截线，∠A和∠D分别在AD的左右两侧、在AB和CD之间→内错角（不是同位角）。角类型的准确判断很重要。',
      },
      variations: [
        {
          problem: '如图，在△ABC中，AD平分∠BAC，AB=AC。求证：BD=CD。',
          hint: '在△ABD和△ACD中，AB=AC，AD=AD，∠BAD=∠CAD。这两边及其夹角对应相等，可用SAS。',
          answer: '∵ AD平分∠BAC，∴ ∠BAD=∠CAD。又AB=AC，AD=AD，所以△ABD≅△ACD（SAS），从而BD=CD。',
        },
      ],
      summary: '综合推理的技巧——将每个已知条件"翻译"成等边或等角，然后对号入座判定方法。条件不够→考虑辅助线。',
    },
  ],

  commonMistakes: [
    {
      wrongExample: '证明完△ABC≅△DEF后就停笔了，忘了写最终结论',
      wrongReason: '题目问的是"求证AD=BE"，不是"求证△ACD≅△BCE"。全等是手段不是目的——证完全等后必须写对应边/角相等来得到题目要求的结论。',
      correctApproach: '证完全等后立即写"∴AD=BE（全等三角形对应边相等）"或"∴∠A=∠D（全等三角形对应角相等）"——这一行不能省略。',
      relatedReminder: '检查方法：读完自己的证明，最后一行是不是题目问的问题？如果不是，说明中间断了。',
    },
    {
      wrongExample: '条件不够就直接放弃——看不到"公共边"或"对顶角"这些隐形条件',
      wrongReason: '很多全等证明题只给了两个显式条件——第三个条件往往是公共边/公共角或对顶角这些"不写自明"的条件。学生没有养成在图形中"找隐形条件"的习惯。',
      correctApproach: '每次面对全等证明，先在图形中标出：(1)公共边（两个三角形共用的边）；(2)公共角（共用的角）；(3)对顶角（十字交叉处的角相等）；(4)中点带来的等线段。这些条件往往就是凑齐三组的最后一块拼图。',
      relatedReminder: '在图形上用不同符号标注条件——已知边用"|"，已知角用弧线。如果发现两个三角形共用一条边或一个角，立刻标注为可用条件。',
    },
    {
      wrongExample: '辅助线画出来了但证明中没提——或者辅助线"被当成"已知条件使用',
      wrongReason: '辅助线是"作"出来的，不是原来就有的。在证明中必须用"连接……""延长……""过……作平行线……"等动词开头说明——不能直接拿来当已知用。',
      correctApproach: '辅助线在证明中单独一行："连接AC。"或"过C作CE∥AB。"——这是一个"操作"而非"已知条件"。辅助线带来的等量关系要在后续行中推理得出。',
      relatedReminder: '"连接AC"→自动得到公共边AC，但AC的长度关系需要额外推理（如它是斜边、直角边等）。"作平行线"→自动得到内错角/同位角相等（用平行线性质推）。',
    },
    {
      wrongExample: '在证明中把判定方法写错——写"SAS"但实际条件排列是"AS S"（先角后边后边）',
      wrongReason: '次序不重要，重要的是条件的内容——SAS不要求书写顺序是"边-角-边"，只要实际满足"两边和它们的夹角"就行。但有些学生因记错SAS的含义而把非夹角当夹角→错误。',
      correctApproach: '不要只看写的顺序——重点检查"角是不是两条边的夹角"。画图时把已知的两条边加粗，看角的顶点在哪——角的顶点必须是两条边的公共端点。',
      relatedReminder: 'SAS的本质：角紧挨着两条边——角的顶点是两边的公共端点。不是这个关系的就不是SAS。',
    },
  ],

  exercises: {
    basic: [
      {
        id: 'ex-25-basic-1',
        question: '如图，AB=DE，BC=EF，∠B=∠E。求证：AC=DF。',
        answer:
          '证明：\n' +
          '在△ABC和△DEF中\n' +
          '∵ AB = DE（已知）\n' +
          '∠B = ∠E（已知）\n' +
          'BC = EF（已知）\n' +
          '∴ △ABC ≅ △DEF（SAS）\n' +
          '∴ AC = DF（全等三角形对应边相等）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-25-basic-2',
        question: '如图，AD=BC，∠DAB=∠CBA。求证：∠DBA=∠CAB。',
        answer:
          '证明：\n' +
          '在△ABD和△BAC中\n' +
          '∵ AD = BC（已知）\n' +
          '∠DAB = ∠CBA（已知）\n' +
          'AB = BA（公共边）\n' +
          '∴ △ABD ≅ △BAC（SAS）\n' +
          '∴ ∠DBA = ∠CAB（全等三角形对应角相等）',
        hint: '公共边AB在两个三角形中的写法不同：一个写AB，另一个写BA。但AB=BA当然是成立的。',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-25-basic-3',
        question: '如图，C是AB的中点，CD=CE，∠ACD=∠BCE。求证：AD=BE。',
        answer:
          '证明：\n' +
          '∵ C是AB的中点（已知）\n' +
          '∴ AC = BC（中点定义）\n' +
          '在△ACD和△BCE中\n' +
          '∵ AC = BC（已证）\n' +
          '∠ACD = ∠BCE（已知）\n' +
          'CD = CE（已知）\n' +
          '∴ △ACD ≅ △BCE（SAS）\n' +
          '∴ AD = BE（全等三角形对应边相等）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-25-basic-4',
        question: '如图，AB⊥BC，DC⊥BC，AB=DC。求证：△ABC≅△DCB。',
        answer:
          '证明：\n' +
          '在Rt△ABC和Rt△DCB中（∠ABC=∠DCB=90°）\n' +
          '∵ AB = DC（已知）\n' +
          'BC = CB（公共边）\n' +
          '∴ Rt△ABC ≅ Rt△DCB（HL）\n' +
          '∴ AC = DB（全等三角形对应边相等）',
        hint: '两个直角三角形→HL！垂直条件给出∠ABC=∠DCB=90°。',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-25-basic-5',
        question: '如图，∠A=∠D，∠B=∠E，BC=EF。求证：△ABC≅△DEF。',
        answer:
          '证明：\n' +
          '在△ABC和△DEF中\n' +
          '∵ ∠A = ∠D（已知）\n' +
          '∠B = ∠E（已知）\n' +
          'BC = EF（已知）\n' +
          '∴ △ABC ≅ △DEF（AAS）\n' +
          '（BC是∠A的对边，符合AAS）',
        difficulty: 'basic',
        flaggedConceptIds: ['congruent-triangles'],
      },
    ],
    intermediate: [
      {
        id: 'ex-25-inter-1',
        question: '在△ABC和△DEF中，AB∥DE，BC∥EF，AC∥DF，且AB=DE。求证：△ABC≅△DEF。',
        answer: '由AB∥DE、BC∥EF可得∠ABC=∠DEF；由AB∥DE、AC∥DF可得∠BAC=∠EDF。又AB=DE，所以△ABC≅△DEF（ASA）。',
        hint: '平行线提供两组对应角相等，AB=DE是这两组角的夹边，使用ASA。',
        difficulty: 'intermediate',
        flaggedConceptIds: ['congruent-triangles', 'parallel-lines-angles'],
      },
      {
        id: 'ex-25-inter-2',
        question: '（2021北京中考第22题改编）\n如图，在四边形ABCD中，AB∥CD，AB=CD。\n(1)求证：△ABC≅△CDA。\n(2)求证：AD∥BC。',
        answer:
          '证明：(1)连接AC\n' +
          '在△ABC和△CDA中\n' +
          '∵ AB = CD（已知）\n' +
          '∠BAC = ∠DCA（AB∥CD，内错角相等）\n' +
          'AC = CA（公共边）\n' +
          '∴ △ABC ≅ △CDA（SAS）\n\n' +
          '(2)由全等得∠BCA = ∠DAC（对应角相等）\n' +
          '∵ ∠BCA = ∠DAC（已证）\n' +
          '∴ AD ∥ BC（内错角相等，两直线平行）',
        hint: '(1)连接AC→构造公共边。(2)由全等对应角相等+内错角相等→平行——全等服务于平行判定。',
        difficulty: 'intermediate',
        flaggedConceptIds: ['congruent-triangles', 'parallel-lines-proof'],
      },
      {
        id: 'ex-25-inter-3',
        question: '如图，已知AD平分∠BAC，∠B=∠C。求证：BD=CD。',
        answer:
          '证明：\n' +
          '∵ AD平分∠BAC（已知）\n' +
          '∴ ∠BAD = ∠CAD（角平分线定义）\n' +
          '在△ABD和△ACD中\n' +
          '∵ ∠BAD = ∠CAD（已证）\n' +
          'AD = AD（公共边）\n' +
          '∠B = ∠C（已知）\n' +
          '∴ △ABD ≅ △ACD（AAS）\n' +
          '∴ BD = CD（全等三角形对应边相等）',
        hint: '角平分线→等角。公共边AD。∠B=∠C→三组条件：两角一边→AAS。边AD是∠B的对边。',
        difficulty: 'intermediate',
        flaggedConceptIds: ['congruent-triangles', 'basic-geometry'],
      },
    ],
    challenge: [
      {
        id: 'ex-25-challenge-1',
        question: '（2023北京中考第23题改编）\n如图，在△ABC中，AB=AC。D是BC上一点，以AD为边向△ABC外侧作等边三角形ADE。连接BE、CD。求证：BE=CD。',
        answer:
          '证明：\n' +
          '∵ △ADE是等边三角形（已知）\n' +
          '∴ AD = AE = DE，∠DAE = 60°\n\n' +
          '在△ABE和△ACD中\n' +
          '∵ AB = AC（已知）\n' +
          'AE = AD（等边三角形）\n' +
          '∠BAE = ∠CAD + 60°（分析：∠BAE = ∠BAC + ∠CAE = ？需具体图形）\n\n' +
          '关键思路：通过AB=AC（等腰）和AD=AE（等边）以及等角来证△ABE≅△ACD→BE=CD。具体角度分析依赖图形中D在BC的位置。\n\n' +
          '这是一道综合全等+等腰+等边三角形的典型压轴小题——证明线段等的手段依然是全等。',
        hint: '先看有没有现成的全等条件：AB=AC（等腰）、AD=AE（等边）→两组边已齐。缺什么？夹角！∠BAE和∠CAD是否相等？利用等边三角形的角性质。',
        difficulty: 'challenge',
        flaggedConceptIds: ['congruent-triangles'],
      },
      {
        id: 'ex-25-challenge-2',
        question: '如图，△ABC中，AD⊥BC于D，E是AD的中点。连接BE并延长，过C作CF∥BE，交AD的延长线于F。求证：AD=DF。',
        answer:
          '分析：要证AD=DF→即证D是AF的中点。（已知E是AD的中点，给了个中点条件。）\n\n' +
          '思路：E是AD的中点→AE=ED。CF∥BE→∠AEB=∠F（或∠DBE=∠DCF等，依具体关系）。\n\n' +
          '考虑△ABE和△什么全等？BE所在三角形和CF有关——利用"CF∥BE"得到角相等。\n\n' +
          '具体证明过程取决于图形细节。核心工具依然是：平行→等角；中点→等边→全等→结论。',
        hint: '利用"CF∥BE"把等角关系建立起来。E是AD的中点→AE=ED。结合AD⊥BC这个垂直条件看能否构造直角三角形的全等（HL）。',
        difficulty: 'challenge',
        flaggedConceptIds: ['congruent-triangles', 'parallel-lines-proof'],
      },
    ],
    knowledgeTransfer: [
      {
        id: 'ex-25-transfer-1',
        question: '（连接Lecture 30——四边形性质证明）\n如图，在四边形ABCD中，AB=CD，AD=BC。\n(1)连接AC。求证：△ABC≅△CDA。\n(2)由此推出AB∥CD吗？为什么？\n(3)由此推出AD∥BC吗？为什么？\n(4)这个四边形是什么特殊四边形？',
        answer:
          '证明：(1)连接AC\n在△ABC和△CDA中\n∵ AB = CD（已知）\nBC = AD（已知）\nAC = CA（公共边）\n∴ △ABC ≅ △CDA（SSS）\n\n(2)由全等得∠BAC = ∠DCA（对应角相等）\n∵ ∠BAC = ∠DCA（已证）\n∴ AB ∥ CD（内错角相等，两直线平行）\n\n(3)同理，由全等得∠BCA = ∠DAC\n∴ AD ∥ BC（内错角相等，两直线平行）\n\n(4)两组对边分别平行→平行四边形。\n\n这证明了一个重要结论：两组对边分别相等的四边形是平行四边形。Lecture 30会系统地学习这个结论。',
        hint: '全等证明（SSS）→对应角相等→内错角相等→平行→平行四边形。这是全等如何"推导"出四边形性质的标准路径。',
        difficulty: 'transfer',
        flaggedConceptIds: ['congruent-triangles', 'quadrilateral-properties', 'parallel-lines-proof'],
        knowledgeChain: [
          '全等三角形判定SSS（共用公共边AC）',
          '全等→对应角相等→内错角相等',
          '内错角相等→两直线平行→对边平行',
          '对边平行的四边形→平行四边形（Lecture 30核心内容）',
        ],
      },
      {
        id: 'ex-25-transfer-2',
        question: '（连接Lecture 26——角平分线性质）\n如图，已知OP平分∠AOB，PC⊥OA于C，PD⊥OB于D。\n(1)图中△OPC和△OPD具备哪些等量条件？\n(2)证明△OPC≅△OPD。\n(3)由全等得出什么结论？这个结论就是角平分线的一个性质。',
        answer:
          '(1)等量条件：\n  ∠COP = ∠DOP（OP是角平分线）\n  ∠PCO = ∠PDO = 90°（垂直）\n  OP = OP（公共边）\n\n(2)证明：\n在△OPC和△OPD中\n∵ ∠COP = ∠DOP（已证）\n∠PCO = ∠PDO = 90°（已知）\nOP = OP（公共边）\n∴ △OPC ≅ △OPD（AAS）\n\n(3)由全等得PC = PD（对应边相等）。\n结论：角平分线上的点到角两边的距离相等——这就是Lecture 26要学的"角平分线性质"的核心内容！',
        hint: '这是用全等来证明"角平分线性质"的经典过程——先做垂直（获得直角），再结合角平分线和公共边→AAS→全等→对应边相等=距离相等。',
        difficulty: 'transfer',
        flaggedConceptIds: ['congruent-triangles', 'angle-bisector-properties'],
        knowledgeChain: [
          '作垂线→获得直角条件',
          '角平分线→获得等角条件',
          '公共边→第三组条件',
          'AAS→全等→对应边相等→角平分线上点到两边距离相等',
          '这是Lecture 26角平分线性质定理的证明——全等三角形是证明它的工具',
        ],
      },
    ],
  },

  oralTask: {
    problem: '如图，AB∥CD，E是AD的中点。连接BE并延长交CD于F。请口头完整证明BE=EF——从"要证BE=EF"出发分析思路，然后写出完整的规范和证明过程，最后总结全等证明的通用步骤。',
    script: [
      '第一步：分析结论。要证BE=EF——BE在△ABE中，EF在△DEF中（注意：B、E、F三点共线——这是延长线带来的）。所以需要证△ABE≅△DEF。',
      '第二步：扫描条件。(1)E是AD的中点→AE=DE（这组边对应上了：AE↔DE）；(2)AB∥CD→能提供什么角相等？AB和CD是平行线，AD是截线→内错角∠A=∠D；(3)观察图形——∠AEB和∠DEF是什么关系？BE延长后与CD交于F，B-E-F共线→所以∠AEB和∠DEF是对顶角→相等！',
      '第三步：汇总。条件有：AE=DE（边），∠A=∠D（角），∠AEB=∠DEF（角）。这是两组角夹一条边→ASA！',
      '第四步：写出规范证明。在△ABE和△DFE中：因为∠A=∠D（两直线平行，内错角相等），AE=DE（中点定义），∠AEB=∠DEF（对顶角相等）。所以△ABE≅△DFE（ASA）。所以BE=EF（全等三角形对应边相等）。证毕！',
      '第五步总结：这道题展示了全等证明的完整流程——(1)从结论出发确定要证哪两个三角形全等；(2)扫选条件并把每个条件转化为等边或等角；(3)对号入座判定方法；(4)写规范证明。这是一个"可复用"的思维模板。',
    ],
  },

  errorCard: {
    fields: {
      errorNumber: 'EB-25-001',
      errorType: '全等证明后忘记写对应边/角相等——证明半途而废',
      errorReason: '证完全等（写出"△ABC≅△DEF（SAS）"）后就停了，忘记写"∴AB=DE（全等三角形对应边相等）"。把"全等"当做最终结论，但题目问的是"求证AB=DE"——全等只是中间步骤。根本原因是混淆了"证明手段"和"证明目标"。',
      correctMethod: '全等证明的完整格式最后必须有一行"∴目标结论（全等三角形对应边/角相等）"。写完证明后自检：证明的最后一行是不是题目"求证"的内容？如果是，证明完整；如果不是，缺了一行。',
      similarPractice: '如图，AC=BD，∠CAB=∠DBA。求证：△ABC≅△BAD。(提示：需要辅助线？不需要——AC=BD, ∠CAB=∠DBA, AB=BA→SAS→全等。但注意题目问的就是证全等，所以证完全等就可以停了——不需要额外一行对应关系。)\n\n区分：题目问"求证全等"→证完全等就结束。题目问"求证AB=CD"→证完全等后再写一行对应边相等。',
      mastered: false,
    },
  },

  animationIds: [],
}

export default lecture25
