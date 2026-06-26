import{n as e}from"./rolldown-runtime-QTnfLwEv.js";var t=e({default:()=>n}),n={meta:{id:26,title:`角平分线与垂直平分线：性质、判定、证明`,moduleId:4,orderInModule:8,overview:`角平分线上的点到角两边距离相等；垂直平分线上的点到线段两端距离相等。这两条线都是"等距线"——性质和判定互为逆定理。这是连接全等三角形和等腰三角形的重要桥梁，也是尺规作图的理论基础。`,objectives:[`掌握角平分线的性质：角平分线上的点到角的两边距离相等`,`掌握角平分线的判定：到角两边距离相等的点在角的平分线上`,`掌握垂直平分线的性质与判定——"到两端距离相等"的双向推理`,`理解性质与判定的互逆关系，能在做题中正确选用`,`会用尺规作角平分线和线段的垂直平分线，能解释作图依据`],durationMinutes:60,oneLineMainIdea:`角平分线和垂直平分线都是"等距线"——性质告诉你线上点满足什么关系，判定告诉你满足关系的点在线上。`,conceptIds:[`angle-bisector-properties`],prerequisiteLectureIds:[24,25],followupLectureIds:[27,28],isFullContent:!1},knowledgeNetwork:{fromWhere:[`全等三角形（Lecture 24-25）：角平分线和垂直平分线的性质都是用全等三角形（AAS/HL/SAS）证明的`,`几何基本元素（Lecture 19）：角平分线的定义、垂线的概念和作图`,`相交线与垂线（Lecture 20）：垂直的定义、垂线段最短的性质`],currentCore:[`角平分线性质定理：角平分线上的点到角的两边距离相等（用AAS全等证明）`,`角平分线判定定理：角的内部到角两边距离相等的点在角平分线上（性质定理的逆定理）`,`垂直平分线性质定理：线段垂直平分线上的点到线段两端距离相等（用SAS全等证明）`,`垂直平分线判定定理：到线段两端距离相等的点在线段的垂直平分线上`,`尺规作图：作角平分线和线段的垂直平分线——全等三角形的直接应用`],toWhere:[`等腰三角形三线合一（Lecture 27）：底边的垂直平分线=顶角的平分线=底边中线=底边高线`,`轴对称（Lecture 27-28）：对称轴本质上就是对应点连线的垂直平分线`,`最短路径/将军饮马（Lecture 28）：反射法利用对称——对称的本质是垂直平分线`],relationDiagram:`  全等三角形(L24-25)         几何基本元素(L19)
           │                          │
           └────────────┬─────────────┘
                        ▼
           Lecture 26 角平分线与垂直平分线
           ┌──────────────────────────────────┐
           │ 角平分线              垂直平分线    │
           │ 性质：点→距离相等      性质：点→距离相等│
           │ 判定：距离相等→点      判定：距离相等→点│
           │ 尺规作图(SSS全等)      尺规作图(等距)  │
           └────────┬──────────────────┬────────┘
                    │                  │
                    ▼                  ▼
            等腰三角形(L27)    轴对称/最短路径(L27-28)`},concepts:[{title:`角平分线的性质——线上的点"到两边一样远"`,everydayAnalogy:`想象一个角的平分线就像一条中轴线——站在这条线上任何位置，你到两条边的"垂直距离"都是相等的。就像站在一个V形山谷的谷底中线上，到两面山坡的垂直距离一样。这里"距离"必须是垂直距离，斜着量不算。`,formalDefinition:`角平分线的性质定理：角平分线上的任意一点，到这个角的两边的距离相等。
（"距离"指点到角两边的垂线段长度——必须垂直！）

证明思路：设OC是∠AOB的平分线，P是OC上任意一点。
作PD⊥OA于D，PE⊥OB于E。
在△POD和△POE中：∠POD=∠POE（OC平分∠AOB）、∠PDO=∠PEO=90°（垂直定义）、OP=OP（公共边）
→ △POD≅△POE（AAS）→ PD=PE（全等三角形对应边相等）。`,formula:`\\text{若点}P\\text{在}\\angle AOB\\text{的平分线上} \\Rightarrow P\\text{到}OA\\text{的距离} = P\\text{到}OB\\text{的距离}`,associationReminders:[`距离必须是垂线段——点到角边的"垂直距离"，斜线段不算"距离"`,`性质定理的逆命题也成立——这就是判定定理（互为逆定理）`,`这个定理在证明中用来"由角平分线推距离相等"，方向是"角平分线→等距"`,`角平分线还有一个直接定义：把一个角分成两个相等的角。定义本身也可以直接用来解题`]},{title:`垂直平分线的性质——线上的点"到两端一样远"`,everydayAnalogy:`线段的垂直平分线就像一道"公平的围墙"——站在围墙上的任何位置，到线段两端（比如两个村口）的距离都相等。如果要建一个到两个村庄距离相等的服务站，它就应该建在连接两村线段的垂直平分线上。`,formalDefinition:`垂直平分线（也叫中垂线）的性质定理：线段垂直平分线上的任意一点，到这条线段两个端点的距离相等。

证明思路：设直线l是线段AB的垂直平分线，垂足为O（O是AB的中点），P是l上任意一点。
在△PAO和△PBO中：AO=BO（O是中点），∠POA=∠POB=90°（l⊥AB），PO=PO（公共边）
→ △PAO≅△PBO（SAS）→ PA=PB。`,formula:`\\text{若点}P\\text{在线段}AB\\text{的垂直平分线上} \\Rightarrow PA = PB`,associationReminders:[`垂直平分线=垂直+过中点——两个条件缺一不可`,`垂直平分线可以看作所有"到A和B距离相等"的点的集合`,`这个性质在等腰三角形中至关重要：底边的垂直平分线同时也是顶角的平分线（三线合一）`,`与角平分线对比：角平分线→到"两边"距离相等，垂直平分线→到"两端"距离相等`]},{title:`性质与判定的互逆——因果关系完全相反`,everydayAnalogy:`性质和判定就像"门禁卡"和"身份验证"：性质是"有门禁卡就能开门"，判定是"能开门就证明你有门禁卡"。同一条事实的两个方向——做几何题时必须先判断要用哪个方向。`,formalDefinition:`角平分线：
性质：点在角平分线上 → 点到角两边距离相等（由位置推结果）
判定：到角两边距离相等的点 → 在角的平分线上（由结果推位置）

垂直平分线：
性质：点在垂直平分线上 → 点到线段两端距离相等
判定：到线段两端距离相等的点 → 在线段的垂直平分线上

关键区分法：看结论是"证等距"还是"证点在线上"。证等距用性质，证在线上用判定。`,formula:`\\text{性质：位置}\\Rightarrow\\text{等距关系} \\qquad \\text{判定：等距关系}\\Rightarrow\\text{位置}`,associationReminders:[`类比平行线：判定"角→平行"，性质"平行→角"——同样的互逆逻辑`,`做题口诀："证等距用性质，证在线上用判定"`,`尺规作图就是判定定理的直接应用——通过保证距离相等来确定线的位置`]},{title:`尺规作图——角平分线与垂直平分线`,everydayAnalogy:`不用量角器也能平分一个角，不用尺子量也能找到中点——这就是尺规作图的"魔法"。古人只用圆规和没有刻度的直尺，就能完成精确的几何作图。中考中尺规作图是必考操作。`,formalDefinition:`作已知角的平分线：(1)以顶点O为圆心，任意半径画弧交两边于C、D；(2)分别以C、D为圆心，大于½CD的相等半径画弧，两弧交于E；(3)连接OE即为角平分线。
依据：OC=OD，CE=DE，OE=OE → △OCE≅△ODE（SSS）→ ∠COE=∠DOE。

作已知线段的垂直平分线：(1)分别以A、B为圆心，大于½AB的相等半径画弧，交于C、D；(2)过C、D作直线即为垂直平分线。
依据：CA=CB，DA=DB → C和D都在AB的垂直平分线上 → 两点确定一条直线。`,associationReminders:[`角平分线作图的关键是构造SSS全等来证角相等`,`垂直平分线作图的关键是构造两个到两端等距的点`,`"大于一半"这个条件必须满足——半径太小的弧不会相交`,`尺规作图的作图痕迹（弧线）不能擦掉，是得分依据`]}],coreMethods:[{name:`角平分线证明策略——先作垂线再找全等`,derivation:`角平分线的题目有两种走向：已知点在角平分线上→证明距离相等（用性质）；要证明某条线是角平分线→先证明距离相等（用判定）。无论哪种方向，第一步几乎都是"作垂线"——这是角平分线证明题的标配。`,steps:[`第1步：判断方向——题目是"已知角平分线"还是"要证角平分线"？选择性质还是判定`,`第2步：如果缺垂线段，从目标点向角的两边作垂线（标清两个垂足字母）`,`第3步：找全等三角形——以角顶点和角平分线上的点为公共元素，加上两个直角，构成两个直角三角形`,`第4步：用AAS或HL证全等（通常公共边+两个角的关系）`,`第5步：由全等得出结论（证性质则得垂线段相等，证判定则在证得垂线段相等后用逆定理）`],visualExplanation:`\\because OC\\text{平分}\\angle AOB,\\; PD\\perp OA\\text{于}D,\\; PE\\perp OB\\text{于}E \\\\\\therefore \\triangle POD \\cong \\triangle POE \\;(\\text{AAS}) \\\\\\therefore PD = PE\\;(\\text{角平分线上的点到两边距离相等})`},{name:`垂直平分线证明策略——"连两端"一条线证明`,derivation:`垂直平分线问题与角平分线相比少了一个"作垂线"的步骤，因为距离是直接连到两端点的线段。核心是证明"到两端距离相等"的关系。`,steps:[`第1步：判断——用性质（点在垂直平分线上→PA=PB）还是判定（PA=PB→点在垂直平分线上）`,`第2步：性质题——直接由垂直平分线一步得出PA=PB，简洁高效`,`第3步：判定题——需要证明两个条件：(1)PA=PB（距离相等），(2)连线过中点且垂直`,`第4步：判定题中PA=PB的证明通常通过全等三角形或等量代换来完成`,`第5步：尺规作图题解释依据时，核心逻辑是"到两端等距的点在垂直平分线上"（判定定理）`],visualExplanation:`\\because l\\text{是}AB\\text{的垂直平分线},\\; P\\text{在}l\\text{上} \\\\\\therefore PA = PB\\;(\\text{线段垂直平分线上的点到两端距离相等})`},{name:`尺规作图题作答规范`,derivation:`中考尺规作图题不仅要求"会画"，还要求"会解释"——说明每一步操作的几何依据。作图痕迹必须保留。`,steps:[`第1步：明确作图目标（角平分线/垂直平分线/对称点）`,`第2步：按规范步骤作图，用铅笔和尺规，保留所有弧线`,`第3步：写出“射线OC（或直线l）即为所求”，并保留清晰的作图痕迹`,`第4步：解释依据——角平分线用SSS全等→角等，垂直平分线用到两端等距→判定定理`,`第5步：检验——角平分线检查两个角是否相等，垂直平分线检查中点+垂直`]}],typicalQuestions:[{name:`角平分线性质：证线段相等`,essence:`利用"角平分线上的点到角两边距离相等"证明两条垂线段相等。核心操作是"从角平分线上的点向两边作垂线"。`,solutionSteps:[`确认"某点在角平分线上"这一关键条件`,`从该点分别向角的两边作垂线（标出垂足）`,`用AAS证全等或用性质定理直接得出垂线段相等`,`利用这个相等关系进行后续推理`],example:{problem:`（2023北京中考）如图，OC平分∠AOB，P是OC上一点，PD⊥OA于D，PE⊥OB于E。求证：PD=PE。`,stepByStepAnalysis:[`已知：OC平分∠AOB → ∠POD=∠POE；PD⊥OA，PE⊥OB → ∠PDO=∠PEO=90°`,`要证PD=PE——这是点到两边的距离`,`在△POD和△POE中：∠POD=∠POE，∠PDO=∠PEO=90°，OP=OP`,`由AAS得△POD≅△POE，对应边PD=PE`],answer:`证明：
∵ OC平分∠AOB（已知）
∴ ∠POD = ∠POE（角平分线定义）
∵ PD⊥OA，PE⊥OB（已知）
∴ ∠PDO = ∠PEO = 90°（垂直定义）
在△POD和△POE中：
  ∠POD = ∠POE（已证）
  ∠PDO = ∠PEO = 90°（已证）
  OP = OP（公共边）
∴ △POD ≅ △POE（AAS）
∴ PD = PE（全等三角形对应边相等）`,commonMistake:`漏写"作垂线"步骤——题目已给垂线则直接用，没给就要自己作。另外不要把垂足写成边上的任意点。`},variations:[{problem:`如图，AD是△ABC中∠BAC的平分线，DE⊥AB于E，DF⊥AC于F。若AB=8，AC=6，S△ABD=12，求S△ADC。`,hint:`由角平分线得DE=DF。S△ABD=½·AB·DE→求DE→S△ADC=½·AC·DF。`,answer:`S△ADC = 9。
解：∵ AD平分∠BAC，DE⊥AB，DF⊥AC
∴ DE = DF（角平分线上的点到两边距离相等）
S△ABD = ½·AB·DE = ½·8·DE = 12 → DE = 3
∴ DF = DE = 3
S△ADC = ½·AC·DF = ½·6·3 = 9`}],summary:`角平分线+垂线段→全等△→等距。题目不给垂足就自己画——这是标配操作。`},{name:`垂直平分线性质：一步证等距`,essence:`利用"垂直平分线上的点到两端距离相等"直接推出线段相等——比通过全等三角形证更快。关键是识别出题中的垂直平分线条件。`,solutionSteps:[`确认"某直线是某线段的垂直平分线"以及"目标点在该直线上"`,`直接应用性质定理：该点到线段两端的距离相等`,`利用这个等距关系继续推理`],example:{problem:`（2021北京中考）如图，在△ABC中，AB=AC，D是BC的中点。求证：AD⊥BC。`,stepByStepAnalysis:[`AB=AC → A到B和C的距离相等 → A在线段BC的垂直平分线上（判定定理）`,`D是BC的中点 → D也在BC的垂直平分线上（中点在垂直平分线上）`,`A和D都在BC的垂直平分线上 → 直线AD就是BC的垂直平分线`,`垂直平分线的定义：过中点且垂直于线段 → AD⊥BC`],answer:`证明：
∵ AB = AC（已知）
∴ 点A到线段BC两端B和C的距离相等
∴ A在线段BC的垂直平分线上（到线段两端距离相等的点在线段的垂直平分线上）
∵ D是BC的中点（已知）
∴ D也在BC的垂直平分线上
∵ A和D都在BC的垂直平分线上，两点确定一条直线
∴ 直线AD就是线段BC的垂直平分线
∴ AD ⊥ BC（垂直平分线的定义）`,commonMistake:`直接说"因为等腰所以AD⊥BC"而不写垂直平分线的推理过程——跳步了。必须写出A在垂直平分线上这步。`},variations:[{problem:`如图，在△ABC中，DE是AC的垂直平分线，交AC于D，交BC于E。若AE=3.5，求CE。`,hint:`E在AC的垂直平分线上→EA=EC。`,answer:`CE = 3.5。
理由：∵ DE是AC的垂直平分线，E在DE上
∴ EA = EC（线段垂直平分线上的点到两端距离相等）
∵ AE = 3.5
∴ CE = 3.5`}],summary:`垂直平分线=最简洁的"等距"工具——不需要证全等，一步到位。`},{name:`尺规作图与原理说明`,essence:`用尺规完成角平分线或垂直平分线的作图，并解释每一步的几何依据。中考要求"会画、会写、会解释"。`,solutionSteps:[`明确作图目标，准备好无刻度直尺和圆规`,`按标准步骤作图，保留所有作图痕迹（弧线、交点标记）`,`写明所作射线或直线“即为所求”，并保留全部作图痕迹`,`解释依据：角平分线→SSS全等→角等；垂直平分线→到两端等距→判定定理`],example:{problem:`（2022北京中考）如图，已知∠AOB，用尺规作∠AOB的平分线。（不写作法，保留作图痕迹）`,stepByStepAnalysis:[`以O为圆心，任意半径画弧交OA于C、OB于D（保证OC=OD）`,`分别以C、D为圆心，大于½CD的相等半径画弧，两弧交于E（保证CE=DE）`,`连接OE。由SSS全等（OC=OD，CE=DE，OE=OE）→∠COE=∠DOE→OE是角平分线`],answer:`如图所示，射线OE即为所求。

作图依据：由作图知OC=OD，CE=DE，OE=OE
∴ △OCE ≅ △ODE（SSS）
∴ ∠COE = ∠DOE（全等三角形对应角相等）
∴ OE平分∠AOB`,commonMistake:`"大于½"被忽略——半径太小导致两弧不相交。作图痕迹必须保留，没弧线就没分。`},variations:[{problem:`已知线段AB，用尺规作出AB的垂直平分线。（保留作图痕迹，说明依据）`,hint:`两圆半径相等且大于½AB，以A、B为圆心分别画弧得C、D两点，连线即为所求。`,answer:`如图所示，直线CD即为所求。
依据：由作图知CA=CB，DA=DB
∴ C和D都在线段AB的垂直平分线上（判定定理）
两点确定一条直线，∴ 直线CD是AB的垂直平分线`}],summary:`尺规作图=操作+原理。操作规范（留痕迹），理由说清楚（全等/判定）。`},{name:`角平分线与垂直平分线的综合证明`,essence:`图形中同时涉及角平分线和垂直平分线时，需要灵活切换两者的性质和判定。通常还与等腰三角形或全等三角形联动。`,solutionSteps:[`标出所有已知条件——角平分线→等角，垂直平分线→等距+垂直`,`分析：哪个条件能直接提供等距关系？哪个条件需要结合全等来用？`,`观察是否存在等腰三角形——等边对等角或等角对等边往往是突破口`,`从结论逆推：最后要证什么？缺少哪个条件？用已掌握的关系补全`],example:{problem:`（2020北京中考）如图，在△ABC中，∠BAC的平分线AD交BC于D，DE垂直平分AB。求证：∠B=∠BAD。`,stepByStepAnalysis:[`DE是AB的垂直平分线→DA=DB→△DAB是等腰三角形`,`等腰三角形底角相等→∠DAB=∠DBA`,`即∠BAD=∠B——证毕。`,`注意：此题中AD平分∠BAC的条件虽然是角平分线，但证明中主要用了垂直平分线的性质。`],answer:`证明：
∵ DE是AB的垂直平分线，D在DE上（已知）
∴ DA = DB（线段垂直平分线上的点到两端距离相等）
在△DAB中，DA = DB（已证）
∴ ∠DAB = ∠DBA（等边对等角）
即 ∠BAD = ∠B`,commonMistake:`看到角平分线就条件反射向两边作垂线——此题不需要。灵活分析比机械套模板更重要。`},variations:[{problem:`如图，在△ABC中，∠C=90°，AD平分∠BAC，DE垂直平分AB。求证：△ADC是等腰三角形。`,hint:`AD平分∠BAC→DC=点D到AB的距离。DE垂直平分AB→DA=DB。需结合∠C=90°。`,answer:`证明：
作DF⊥AB于F
∵ AD平分∠BAC，DC⊥AC，DF⊥AB
∴ DC = DF（角平分线上的点到两边距离相等）………①
∵ DE垂直平分AB，D在DE上
∴ DA = DB（垂直平分线性质）………②
∴ 在△ADF中……（继续结合图形推导）`}],summary:`综合题的关键是"先观察后出招"——不要看到角平分线就作垂线，看清全局再定策略。`}],commonMistakes:[{wrongExample:`题目说"点P在∠AOB的平分线上"，学生写"所以PA=PB"（A、B是角两边上的任意点）`,wrongReason:`角平分线上的点到角两边距离相等——"距离"是垂线段长度，不是到边上任意点的长度。PA和PB若不过垂足就不是距离。`,correctApproach:`必须先作垂线："作PD⊥OA于D，PE⊥OB于E"，再证PD=PE。不能把边上任意点A、B当垂足。`,relatedReminder:`角平分线的"距离"=垂直距离=垂线段长度。没有⊥符号就不叫距离。`},{wrongExample:`要证"点P在角平分线上"，只写"PD⊥OA，PE⊥OB，所以P在角平分线上"`,wrongReason:`判定定理条件缺了关键一步——仅垂直还不够！必须证PD=PE。垂直只是让线段成为"距离"，相等才能判定在角平分线上。`,correctApproach:`完整写：PD⊥OA，PE⊥OB，且PD=PE → P在∠AOB的平分线上。`,relatedReminder:`判定=距离相等。垂直让线段成为"距离"，相等才是核心条件。`},{wrongExample:`垂直平分线画成只过中点的任意直线，不垂直`,wrongReason:`垂直平分线=垂直+过中点，"过中点"和"垂直"缺一不可。只有中点叫中线，只有垂直叫垂线。`,correctApproach:`尺规作图利用"到两端等距"来同时保证过中点和垂直两个条件。`,relatedReminder:`记名字：垂直平分线=垂直且平分。平分对应过中点，垂直对应⊥。`},{wrongExample:`尺规作图作角平分线，两次取弧的半径不一样`,wrongReason:`角平分线作图要求C和D处的弧半径相等——这样才能保证CE=DE，构造出SSS全等。半径不等则E不在角平分线上。`,correctApproach:`分别以C和D为圆心，取相同半径（都大于½CD）画弧。同一步骤中"相等半径"必须严格遵守。`,relatedReminder:`尺规作图中"任意半径"≠"不同半径"——同一步骤要求相等时必须相等。`},{wrongExample:`性质和判定混用——要证等距却写判定，要证在线上却写性质`,wrongReason:`没有先判断"结论是什么"就盲目写证明。证等距→用性质（位置→等距），证在线上→用判定（等距→位置）。`,correctApproach:`审题先看结论关键词："相等"→性质，"……是……平分线"或"……在……上"→判定。`,relatedReminder:`口诀："证等距用性质，证在线上用判定"。可类比平行线的判定与性质。`}],exercises:{basic:[{id:`ex-26-basic-1`,question:`如图，AD平分∠BAC，DE⊥AB于E，DF⊥AC于F。若DE=4，求DF。`,answer:`DF=4。
理由：∵ AD平分∠BAC，DE⊥AB，DF⊥AC
∴ DE=DF（角平分线上的点到角两边距离相等）
∵ DE=4
∴ DF=4`,hint:`直接用角平分线性质——角平分线上的点到两边距离相等。`,difficulty:`basic`,flaggedConceptIds:[`angle-bisector-properties`]},{id:`ex-26-basic-2`,question:`如图，直线l是线段AB的垂直平分线，P是l上一点。若PA=5，求PB。`,answer:`PB=5。
理由：∵ l是AB的垂直平分线，P在l上
∴ PA=PB（线段垂直平分线上的点到两端距离相等）
∵ PA=5
∴ PB=5`,difficulty:`basic`,flaggedConceptIds:[`angle-bisector-properties`]},{id:`ex-26-basic-3`,question:`如图，在△ABC中，∠C=90°，AD平分∠BAC交BC于D。若BD:DC=5:3，且AB=10，求AC。`,answer:`解：过D作DE⊥AB于E
∵ AD平分∠BAC，DC⊥AC，DE⊥AB
∴ DC=DE（角平分线上的点到两边距离相等）
设DC=DE=3k，则BD=5k，BC=8k
S△ABC = ½·BC·AC = ½·8k·AC
又S△ABC = S△ADC + S△ABD = ½·AC·DC + ½·AB·DE
= ½·AC·3k + ½·10·3k = ½·3k·(AC+10)
∴ 8k·AC = 3k·(AC+10) → 8AC=3AC+30 → 5AC=30 → AC=6`,hint:`用面积法——角平分线到两边距离相等，把△ABC拆成两个小三角形。`,difficulty:`basic`,flaggedConceptIds:[`angle-bisector-properties`,`triangle-basics`]},{id:`ex-26-basic-4`,question:`已知线段AB=6cm。(1)用尺规作AB的垂直平分线。(2)在垂直平分线上取点P使PA=5cm，求P到AB的距离。`,answer:`(1) 作图略（分别以A、B为圆心，大于3cm的相等半径画弧得交点，连线即为垂直平分线）
(2) 设垂足为O，则OA=3cm。在Rt△PAO中，PA=5，OA=3，
PO=√(5²-3²)=√16=4cm。
答：P到AB的距离为4cm。`,hint:`勾股定理——PA是斜边，OA是直角边，PO是要求的另一条直角边。`,difficulty:`basic`,flaggedConceptIds:[`angle-bisector-properties`,`pythagorean-theorem`]},{id:`ex-26-basic-5`,question:`判断正误并改正：(1)"角平分线上的点，到角的两边任意两点距离相等。"(2)"到线段两端距离相等的点只有一个。"`,answer:`(1) 错误。改正："角平分线上的点，到角的两边的垂直距离（垂线段长度）相等。"任意两点不等于垂足。
(2) 错误。改正："到线段两端距离相等的点有无数个，它们都在该线段的垂直平分线上。"垂直平分线就是所有满足条件点的集合。`,hint:`(1)注意"距离"的定义。(2)垂直平分线是一条直线，线上无穷多个点都满足条件。`,difficulty:`basic`,flaggedConceptIds:[`angle-bisector-properties`]}],intermediate:[{id:`ex-26-inter-1`,question:`（2024北京中考）如图，在△ABC中，AB=AC，AD平分∠BAC交BC于D。求证：AD⊥BC且BD=CD。`,answer:`证明：
∵ AB=AC（已知）
∴ ∠B=∠C（等边对等角）
∵ AD平分∠BAC（已知）
∴ ∠BAD=∠CAD（角平分线定义）
在△ABD和△ACD中：∠BAD=∠CAD，AB=AC，∠B=∠C
∴ △ABD ≅ △ACD（ASA）
∴ BD=CD，∠ADB=∠ADC
又∠ADB+∠ADC=180°
∴ ∠ADB=∠ADC=90°，即AD⊥BC。`,hint:`等腰三角形+角平分线→用ASA证全等→三线合一。`,difficulty:`intermediate`,flaggedConceptIds:[`angle-bisector-properties`,`isosceles-triangle`,`congruent-triangles`]},{id:`ex-26-inter-2`,question:`如图，在四边形ABCD中，AC⊥BD于O，且OA=OC。求证：AB=BC且AD=CD。`,answer:`证明：
∵ AC⊥BD于O，且OA=OC（已知）
∴ BD是线段AC的垂直平分线（过中点O且垂直于AC）
∵ B在BD上，∴ BA=BC（垂直平分线上的点到两端距离相等）
∵ D在BD上，∴ DA=DC（同理）`,hint:`AC⊥BD且OA=OC→BD是AC的垂直平分线。套性质一步得出。`,difficulty:`intermediate`,flaggedConceptIds:[`angle-bisector-properties`]},{id:`ex-26-inter-3`,question:`如图，在Rt△ABC中，∠C=90°，AD平分∠BAC，DE⊥AB于E。已知AC=6，BC=8，求CD。`,answer:`解：在Rt△ABC中，AB=√(6²+8²)=10（勾股定理）
∵ AD平分∠BAC，DC⊥AC，DE⊥AB
∴ DC=DE（角平分线上的点到两边距离相等）
设CD=DE=x
S△ABC = ½·6·8 = 24
又S△ABC = S△ADC + S△ABD = ½·6·x + ½·10·x = 8x
∴ 8x = 24 → x = 3
答：CD=3。`,hint:`面积法——△ABC=△ADC+△ABD。DC=DE是关键的等量关系。`,difficulty:`intermediate`,flaggedConceptIds:[`angle-bisector-properties`,`pythagorean-theorem`]}],challenge:[{id:`ex-26-challenge-1`,question:`（2022北京中考改编）如图，在△ABC中，∠B=2∠C，AD平分∠BAC交BC于D。求证：AC=AB+BD。`,answer:`证明（截长法）：
在AC上取点E，使AE=AB，连接DE。
∵ AD平分∠BAC，∴ ∠BAD=∠EAD。
在△ABD和△AED中：AB=AE（作图），∠BAD=∠EAD，AD=AD
∴ △ABD ≅ △AED（SAS）
∴ BD=DE，∠B=∠AED
∵ ∠B=2∠C（已知），∠AED=∠EDC+∠C（外角定理）
∴ 2∠C = ∠EDC + ∠C → ∠EDC = ∠C
∴ DE=EC（等角对等边）
∴ BD=DE=EC
∴ AC = AE + EC = AB + BD`,hint:`截长法：在长边上截取短边，利用角平分线构造全等三角形。`,difficulty:`challenge`,flaggedConceptIds:[`angle-bisector-properties`,`congruent-triangles`,`isosceles-triangle`]},{id:`ex-26-challenge-2`,question:`如图，在△ABC中，∠ABC和∠ACB的平分线交于点O。过O作EF∥BC，交AB于E，交AC于F。求证：EF=EB+FC。`,answer:`证明：
∵ BO平分∠ABC（已知）
∴ ∠EBO = ∠OBC（角平分线定义）
∵ EF∥BC（已知）
∴ ∠EOB = ∠OBC（两直线平行，内错角相等）
∴ ∠EBO = ∠EOB → EB = EO（等角对等边）………①
同理：∵ CO平分∠ACB，EF∥BC
∴ ∠FCO = ∠OCB = ∠FOC → FC = FO………②
EF = EO + OF = EB + FC（由①②得）`,hint:`角平分线+平行线是"等腰三角形诞生"的经典组合——这两个条件组合往往能推出等角对等边。`,difficulty:`challenge`,flaggedConceptIds:[`angle-bisector-properties`,`parallel-lines-angles`,`isosceles-triangle`]}],knowledgeTransfer:[{id:`ex-26-transfer-1`,question:`（预习Lecture 27：等腰三角形）
在△ABC中，AB=AC，D是BC上任意一点，DE⊥AB于E，DF⊥AC于F。
(1) 求证：DE+DF为定值。
(2) 这个定值等于什么？`,answer:`(1) 连接AD。
S△ABC = S△ABD + S△ADC
= ½·AB·DE + ½·AC·DF = ½·AB·(DE+DF)（因为AB=AC）
∴ DE+DF = 2S△ABC/AB
由于S△ABC和AB都是定值，DE+DF为定值。

(2) DE+DF = AB边上的高h。
因为S△ABC = ½·AB·h，代入得½·AB·(DE+DF)=½·AB·h → DE+DF=h。
结论：等腰三角形底边上任意一点到两腰的距离之和等于腰上的高（定值）。`,hint:`面积法——把大三角形拆成两个小三角形，利用等腰条件AB=AC。`,difficulty:`transfer`,flaggedConceptIds:[`angle-bisector-properties`,`isosceles-triangle`,`triangle-basics`],knowledgeChain:[`点到直线的距离 → 与三角形面积的联系（S=½·底·高）`,`等腰三角形两腰相等 → 面积公式中出现DE+DF`,`DE+DF = 定值 = 腰上的高 → 距离之和与高的等价关系`,`这是连接"距离"和"等腰三角形性质"的桥梁`]}]},oralTask:{problem:`已知△ABC中，∠B=60°，AD平分∠BAC，CE平分∠BCA，AD与CE交于点O。请口头证明：O到三边的距离相等。`,script:[`第一步：观察图形。AD平分∠BAC，CE平分∠BCA。它们交于O。要证O到三边距离相等。`,`第二步：O在∠BAC的平分线AD上→O到AB的距离=O到AC的距离（角平分线性质）。`,`第三步：O在∠BCA的平分线CE上→O到BC的距离=O到AC的距离（角平分线性质）。`,`第四步：由等量代换→O到AB的距离=O到AC的距离=O到BC的距离。也就是说O到三边的距离都相等。`,`第五步：这恰好证明了"三角形三条角平分线交于一点（内心），内心到三边的距离相等"。∠B=60°在本题中并未用到——它是一个干扰条件。`,`第六步总结：这道题的灵魂是"把角平分线性质用两次+等量代换"。O同时在两条角平分线上，所以O到三边的距离两两相等，最终三个都相等。`]},errorCard:{fields:{errorNumber:`EB-26-001`,errorType:`角平分线/垂直平分线性质与判定混淆`,errorReason:`做题时不先判断目标结论——要证"两条线段相等"还是"某条线是角平分线/垂直平分线"。前者用性质（从线推距离），后者用判定（从距离推线）。性质和判定方向相反，方向搞反全题错。`,correctMethod:`审题三步：(1)看清结论关键词→"相等"还是"是……平分线/在……上"；(2)证等距→用性质；(3)证在线上→用判定。口诀："证等距用性质，证在线上用判定"。`,similarPractice:`判断以下各题用性质还是判定（填"性质"或"判定"）：
(1)已知AD平分∠BAC，求证：D到AB和AC的距离相等 → 用____
(2)已知D到AB和AC的距离相等，求证：AD平分∠BAC → 用____
(3)已知P在AB的垂直平分线上，求证：PA=PB → 用____
(4)已知PA=PB，求证：P在AB的垂直平分线上 → 用____`,mastered:!1}},animationIds:[]};export{t};