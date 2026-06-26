import{n as e}from"./rolldown-runtime-QTnfLwEv.js";var t=e({default:()=>n}),n={meta:{id:27,title:`轴对称、等腰三角形、等边三角形`,moduleId:4,orderInModule:9,overview:`轴对称是图形变换之一，沿对称轴对折后完全重合。等腰三角形是轴对称图形：对称轴=底边垂直平分线=顶角平分线=底边中线=底边高线（三线合一）。等边三角形三边相等、三角均为60°，有三条对称轴。这是几何证明中最重要的"特殊三角形"体系。`,objectives:[`理解轴对称的概念：沿对称轴对折后两部分完全重合，对应点连线被对称轴垂直平分`,`掌握等腰三角形性质：等边对等角、三线合一`,`掌握等腰三角形判定：等角对等边`,`掌握等边三角形的性质与判定：三边相等↔三角均为60°`,`能用等腰/等边三角形性质进行角度计算和线段证明`],durationMinutes:60,oneLineMainIdea:`等腰三角形是轴对称图形——这条对称轴同时是底边中线、高线和顶角平分线（三线合一）。`,conceptIds:[`isosceles-triangle`,`axis-symmetry`],prerequisiteLectureIds:[23,26],followupLectureIds:[28],isFullContent:!1},knowledgeNetwork:{fromWhere:[`三角形基础（Lecture 23）：三边关系、内角和=180°、外角定理是等腰三角形角度计算的基础`,`角平分线与垂直平分线（Lecture 26）：三线合一中的"三线"就是角平分线、中线、高线/垂直平分线`,`全等三角形（Lecture 24-25）：等腰三角形的性质（等边对等角）可用全等三角形证明`],currentCore:[`轴对称概念：沿对称轴对折重合，对称轴垂直平分任意一对对应点连线`,`等腰三角形性质：等边对等角；三线合一（底边中线=底边高线=顶角平分线=底边垂直平分线）`,`等腰三角形判定：等角对等边（如果一个三角形有两个角相等，则对边也相等）`,`等边三角形：三边相等↔三角均为60°；有三条对称轴；同时也是等腰三角形的特殊情况`],toWhere:[`最短路径/将军饮马（Lecture 28）：反射法就是轴对称的直接应用`,`四边形综合（Lecture 30）：菱形的对角线互相垂直平分——菱形的性质来自等腰三角形的组合`,`坐标系中的对称（Lecture 32）：关于x轴、y轴的对称点坐标规律`],relationDiagram:`  角平分线/垂直平分线(L26)    三角形基础(L23)
                │                        │
                └──────────┬─────────────┘
                           ▼
              Lecture 27 轴对称、等腰三角形、等边三角形
              ┌────────────────────────────────────┐
              │ 轴对称：对折重合，对称轴垂直平分连线    │
              │ 等腰△：等边对等角，三线合一            │
              │ 等边△：三角60°，三条对称轴            │
              └────────────────┬───────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
             最短路径(L28)  四边形(L30)  坐标对称(L32)`},concepts:[{title:`轴对称——对折后完全重合`,everydayAnalogy:`轴对称就像照镜子——镜子里的你和镜子外的你，形状大小完全一样，但左右颠倒。镜子所在的那条线就是对称轴。你把纸沿着对称轴对折，左右两边的图案恰好重合。自然界中蝴蝶的翅膀、人的脸（大体上）都是轴对称的。`,formalDefinition:`如果一个图形沿一条直线折叠后，直线两旁的部分能够互相重合，那么这个图形叫做轴对称图形，这条直线叫做对称轴。

轴对称的两个核心性质：
(1) 对称轴上的任意一点，到一对对应点的距离相等（对称轴是对应点连线的垂直平分线）
(2) 对应线段相等，对应角相等（因为折叠后重合）

这两个性质直接来自折叠的操作——折痕（对称轴）把图形的每一对对应点"平分"且"垂直"连接。`,formula:`\\text{若}A\\text{和}A'\\text{关于直线}l\\text{对称} \\Rightarrow l\\text{垂直平分}AA'`,associationReminders:[`对称轴="折痕"——沿它折叠，两边完全重合`,`对称轴垂直平分每一对对应点连线→这是轴对称最核心的数量关系`,`轴对称是图形变换的一种（与平移、旋转并列），变换前后的图形全等`,`角是轴对称图形——角的平分线所在直线就是它的对称轴`]},{title:`等腰三角形的性质——"等边对等角"和"三线合一"`,everydayAnalogy:`等腰三角形像一座山——两边（腰）一样长，山顶（顶角）在正中间。从山顶垂直往山脚（底边）画一条线，正好把山分成左右一模一样的两半——这条线同时是中线、高线和角平分线。等腰三角形的美就美在"对称"。`,formalDefinition:`等腰三角形：有两条边相等的三角形。相等的两边叫腰，第三边叫底边。两腰的夹角叫顶角，腰与底边的夹角叫底角。

性质1（等边对等角）：等腰三角形的两个底角相等。
证明：作顶角的平分线AD→△ABD≅△ACD（SAS）→∠B=∠C。

性质2（三线合一）：等腰三角形顶角的平分线、底边上的中线、底边上的高线互相重合。
即：如果AD是等腰△ABC中顶角A的平分线，那么它也一定是底边BC的中线和高线。
证明思路：由性质1的证明中，△ABD≅△ACD→BD=CD（中线），∠ADB=∠ADC=90°（高线）。`,formula:`\\text{若}AB = AC \\Rightarrow \\angle B = \\angle C\\;(\\text{等边对等角}) \\\\[4pt]\\text{三线合一：顶角平分线} = \\text{底边中线} = \\text{底边高线}`,associationReminders:[`三线合一只对"顶角"成立——是顶角的平分线、底边的中线和高线。不是随便哪个角的平分线都能三线合一`,`等腰三角形的对称轴就是三线合一中的那条线——底边的垂直平分线`,`"等边对等角"和"等角对等边"互为逆定理——一个从边推角，一个从角推边`,`在等腰三角形中，已知三线中任意一条，就能推另外两条`]},{title:`等腰三角形的判定——"等角对等边"`,everydayAnalogy:`如果你测量一个三角形，发现两个角一样大，那么这个三角形一定是等腰的——两个相等的角各自对着的边就是相等的两条腰。这就像天平：两边角一样重，那它们对面的边也一样长。`,formalDefinition:`等腰三角形的判定定理：如果一个三角形有两个角相等，那么这两个角所对的边也相等（等角对等边）。

这是性质定理"等边对等角"的逆定理。

证明思路：已知∠B=∠C，作AD⊥BC于D→证明△ABD≅△ACD（AAS，因为∠B=∠C，∠ADB=∠ADC=90°，AD=AD）→AB=AC。

注意：判定定理常用在"已知两个角相等，需要证明两条边相等"的场景。`,formula:`\\text{若}\\angle B = \\angle C \\Rightarrow AB = AC\\;(\\text{等角对等边})`,associationReminders:[`"等边对等角"和"等角对等边"互为逆定理——审题时判断方向`,`判定定理常用于证明某个三角形是等腰三角形`,`"有两个角等于60°"可以直接推出是等边三角形——因为第三个角也是60°`]},{title:`等边三角形——最"完美"的三角形`,everydayAnalogy:`等边三角形是三角形的"完全体"——三边完全相等，三个角都是60°，无论从哪个角度看都是对称的。它有3条对称轴（每个顶角的平分线都是一条对称轴）。等边三角形同时也是等腰三角形——它是等腰三角形当底边也等于腰长时的特殊情况。`,formalDefinition:`等边三角形（正三角形）：三边都相等的三角形。

性质：(1)三个内角都等于60°；(2)有三条对称轴（每条高线/中线/角平分线所在直线）；(3)每条边上的高线、中线、角平分线三线合一（三个顶点都满足三线合一）；(4)等边三角形一定是等腰三角形。

判定：(1)三边相等→等边三角形；(2)三个角都相等（各60°）→等边三角形；(3)有一个角是60°的等腰三角形→等边三角形。`,formula:`\\text{等边}\\triangle ABC:\\; AB = BC = CA,\\; \\angle A = \\angle B = \\angle C = 60^\\circ`,associationReminders:[`等边三角形是特殊等腰三角形——所有等腰三角形的性质它都满足`,`"有一个角是60°的等腰三角形是等边三角形"是高频考点`,`三条对称轴意味着三个方向的三线合一——比等腰三角形多两个对称轴`,`等边三角形的高h = (√3/2)·a（a是边长），面积S = (√3/4)·a²`]}],coreMethods:[{name:`等腰三角形角度计算——"三线"和"两角"方程法`,derivation:`等腰三角形的角度问题通常围绕两个核心：等边对等角（底角相等）和三线合一（平分顶角+直角）。结合内角和=180°，往往能列出方程求解。`,steps:[`第1步：标出已知角——题目给的角直接用数字标出来`,`第2步：利用等边对等角——如果两边相等，则它们对应的底角也相等，设为同一个未知数`,`第3步：利用三线合一——如果某条线是"三线"，则它平分顶角（顶角的一半）且与底边垂直（90°）`,`第4步：列方程——三角形内角和=180°，把所有角加起来=180°`,`第5步：解方程求出未知角`],visualExplanation:`\\text{等腰}\\triangle ABC,\\; AB = AC,\\; \\angle A = 40^\\circ \\\\\\Rightarrow \\angle B = \\angle C = (180^\\circ - 40^\\circ) \\div 2 = 70^\\circ`},{name:`三线合一的灵活运用——知一推二`,derivation:`三线合一意味着"平分线=中线=高线=对称轴"四位一体。做题时，只要知道其中一条线的身份，就能自动获得另外三个身份。这个"知一推二"（实际是知一推三）是等腰三角形证明题的核心武器。`,steps:[`第1步：确认当前三角形是等腰三角形（两边相等或两角相等）`,`第2步：观察已知条件——哪条"线"的身份被确认了？`,`第3步：如果是"顶角平分线"→它也是底边中线和底边高线（底已被平分+垂直）`,`第4步：如果是"底边中线"→它也是顶角平分线和底边高线（角已被平分+垂直）`,`第5步：如果是"底边高线"→它也是顶角平分线和底边中线（角已被平分+底被平分）`,`第6步：将推出的新关系用于后续证明`],visualExplanation:`\\text{在等腰}\\triangle ABC(AB=AC)\\text{中：}\\\\AD\\text{平分}\\angle A \\Rightarrow AD \\perp BC\\text{且}BD = CD \\\\AD \\perp BC \\Rightarrow AD\\text{平分}\\angle A\\text{且}BD = CD \\\\BD = CD \\Rightarrow AD \\perp BC\\text{且}AD\\text{平分}\\angle A`},{name:`等腰三角形的辅助线策略`,derivation:`等腰三角形证明题中，当已知条件不够时，作辅助线是最常用的手段。等腰三角形有三条经典辅助线：顶角平分线、底边中线、底边高线——这三条其实是同一条，所以选择哪条取决于已知条件。`,steps:[`第1步：如果不知道顶角或底角的关系——作顶角平分线（利用SSS或SAS构造全等）`,`第2步：如果涉及底边上的点或底边被分割——作底边中线（利用中点条件）`,`第3步：如果涉及垂直或直角——作底边高线（利用90°条件）`,`第4步：如果以上都不明确，优先选"顶角平分线"——因为它触发三线合一最自然`,`第5步：在等边三角形中，作任意一边的高（也是中线、角平分线）都能创造30°-60°-90°的直角三角形`]}],typicalQuestions:[{name:`等腰三角形角度计算`,essence:`利用"等边对等角"和三角形内角和=180°，列方程求未知角。这是等腰三角形考题中出现频率最高的题型。`,solutionSteps:[`从"两边相等"推出两底角相等，设为x`,`如果知道顶角，则2x+顶角=180°`,`如果知道一个底角，则顶角=180°-2×底角`,`如果涉及三线合一，注意平分角和直角的关系`],example:{problem:`（2023北京中考）如图，在△ABC中，AB=AC，∠A=40°，BD是AC边上的高。求∠DBC的度数。`,stepByStepAnalysis:[`AB=AC→等腰△ABC→∠B=∠C=(180°-40°)÷2=70°`,`BD是AC边上的高→BD⊥AC→∠BDA=90°`,`在Rt△ABD中：∠ABD=180°-90°-40°=50°`,`∠DBC=∠B-∠ABD=70°-50°=20°`],answer:`∠DBC = 20°。
解：∵ AB=AC（已知）
∴ ∠ABC = ∠C = (180°-40°)÷2 = 70°（等边对等角，内角和180°）
∵ BD⊥AC（已知）
∴ ∠BDA = 90°
在△ABD中，∠ABD = 180°-90°-40° = 50°
∴ ∠DBC = ∠ABC - ∠ABD = 70° - 50° = 20°`,commonMistake:`把∠B的70°当成最终答案——没注意要求的是∠DBC而不是∠ABC。读题要仔细。`},variations:[{problem:`在等腰△ABC中，AB=AC，∠A=80°，求∠B的度数。`,hint:`等边对等角→∠B=∠C。内角和→∠B+∠C=100°→∠B=50°。`,answer:`∠B = 50°。
解：∵ AB=AC，∴ ∠B=∠C（等边对等角）
∠A+∠B+∠C=180°→80°+2∠B=180°→∠B=50°`}],summary:`等腰三角形角度计算=等边对等角+内角和=180°。关键：先判断谁是底角谁是顶角。`},{name:`三线合一的应用——知一线推全线`,essence:`给等腰三角形+三线之一，自动获得另外两线。这个"知一推二"是证明线段相等、角相等、垂直关系的高效工具。`,solutionSteps:[`确认等腰三角形（两边相等）`,`确认已知线是三线中的哪一条（平分线/中线/高线）`,`直接推出另外两条线的性质`,`用推出的新结论来完成证明`],example:{problem:`（2021北京中考）如图，在△ABC中，AB=AC，D是BC的中点。求证：AD平分∠BAC且AD⊥BC。`,stepByStepAnalysis:[`AB=AC→等腰△ABC`,`D是BC的中点→AD是底边BC的中线`,`在等腰三角形中，底边中线=顶角平分线=底边高线（三线合一）`,`因此AD平分∠BAC且AD⊥BC——一步到位`],answer:`证明：
∵ AB=AC（已知）
∴ △ABC是等腰三角形
∵ D是BC的中点（已知）
∴ AD是底边BC的中线
在等腰△ABC中，底边上的中线也是顶角的平分线和底边的高线（三线合一）
∴ AD平分∠BAC，且AD⊥BC`,commonMistake:`只写了中线身份就下结论说不垂直——三线合一必须明确写出"中线=高线=平分线"的推理过程。`},variations:[{problem:`在△ABC中，AB=AC，AD⊥BC于D。求证：BD=CD。`,hint:`等腰三角形底边高线=底边中线→AD是中线→D是中点→BD=CD。`,answer:`证明：∵ AB=AC，AD⊥BC
∴ AD是等腰△ABC底边BC的高线
在等腰三角形中，底边高线也是底边中线（三线合一）
∴ D是BC的中点，∴ BD=CD`}],summary:`三线合一=等腰三角形的"万能钥匙"——已知三线中任意一条，另外两条自动解锁。`},{name:`等腰三角形判定——证一个三角形是等腰三角形`,essence:`通过证明两个角相等来证明两边相等（等角对等边），从而得出三角形是等腰三角形。这是"由角推边"的判定逻辑。`,solutionSteps:[`找到要证的两条边（目标腰）`,`找到这两条边分别对应的角（对角）`,`证明这两个角相等（可能用到平行线性质、全等三角形、等量代换等）`,`用"等角对等边"得出结论`],example:{problem:`（2020北京中考）如图，在△ABC中，∠B=∠C，BD平分∠ABC，CE平分∠ACB。求证：△DBC是等腰三角形。`,stepByStepAnalysis:[`要证△DBC是等腰三角形→需要证明DB=DC或∠DBC=∠DCB`,`∠DBC=½∠ABC（BD平分∠ABC），∠DCB=½∠ACB（CE平分∠ACB）`,`又∠ABC=∠ACB（已知∠B=∠C）→∠DBC=∠DCB`,`由∠DBC=∠DCB→DB=DC（等角对等边）→△DBC是等腰三角形`],answer:`证明：
∵ BD平分∠ABC（已知）
∴ ∠DBC = ½∠ABC（角平分线定义）
∵ CE平分∠ACB（已知）
∴ ∠DCB = ½∠ACB
∵ ∠ABC = ∠ACB（已知∠B=∠C）
∴ ∠DBC = ∠DCB（等量代换——相等角的一半仍相等）
∴ DB = DC（等角对等边）
∴ △DBC是等腰三角形`,commonMistake:`直接从"∠B=∠C"跳到"DB=DC"——中间少了"角平分线→半角相等"的推理步骤。`},variations:[{problem:`如图，在△ABC中，AD平分∠BAC，且DE∥AB。求证：△ADE是等腰三角形。`,hint:`AD平分∠BAC→∠BAD=∠CAD。DE∥AB→∠ADE=∠BAD（内错角相等）。所以∠ADE=∠CAD→△ADE中∠ADE=∠DAE→AE=DE。`,answer:`证明：
∵ AD平分∠BAC，∴ ∠BAD = ∠CAD
∵ DE∥AB，∴ ∠ADE = ∠BAD（两直线平行，内错角相等）
∴ ∠ADE = ∠CAD
在△ADE中，∠ADE = ∠DAE
∴ AE = DE（等角对等边）
∴ △ADE是等腰三角形`}],summary:`判定等腰三角形→证两角相等→等角对等边。角相等的来源多种多样：平行线、角平分线、全等。`},{name:`等边三角形的性质综合`,essence:`等边三角形集等腰三角形的所有性质于一身——三角各60°，三条对称轴，每条边上的高=中线=角平分线。同时它比等腰三角形多一个关键特征：任意高把它分成两个含30°-60°-90°的直角三角形。`,solutionSteps:[`标出等边三角形的所有已知信息：三边相等、三角=60°`,`如果需要高，h=(√3/2)·a（a为边长）`,`作高产生30°-60°-90°直角三角形（斜边=a，短直角边=a/2，长直角边=a√3/2）`,`涉及角度计算——三边相等→三角=60°，或反过来`],example:{problem:`（2024北京中考）如图，在等边△ABC中，D、E分别是AB、AC的中点。求证：△ADE是等边三角形。`,stepByStepAnalysis:[`等边△ABC→AB=BC=AC，∠A=∠B=∠C=60°`,`D、E分别是AB、AC的中点→AD=AB/2，AE=AC/2`,`AB=AC→AD=AE`,`又∠A=60°→△ADE中：AD=AE且∠A=60°→有一个角是60°的等腰三角形是等边三角形`],answer:`证明：
∵ △ABC是等边三角形（已知）
∴ AB=AC，∠A=60°
∵ D、E分别是AB、AC的中点（已知）
∴ AD=½AB，AE=½AC
∴ AD=AE
∴ △ADE是等腰三角形
又∠A=60°
∴ △ADE是等边三角形（有一个角是60°的等腰三角形是等边三角形）`,commonMistake:`忘记用"有一个角是60°的等腰三角形→等边三角形"这个判定，而是去证三边相等——虽然也正确但更麻烦。`},variations:[{problem:`等边△ABC的边长为4，求它的高和面积。`,hint:`作高AD→平分底边（三线合一）→BD=2。在Rt△ABD中，AD=√(4²-2²)=√12=2√3。面积=½·4·2√3=4√3。`,answer:`高=2√3，面积=4√3。
公式：等边三角形高h=(√3/2)a，面积S=(√3/4)a²，代入a=4即可。`}],summary:`等边三角形=等腰三角形+三角各60°。记公式：h=(√3/2)a，S=(√3/4)a²。`}],commonMistakes:[{wrongExample:`三线合一用于腰上的高——说"腰上的高也是腰的中线和角平分线"`,wrongReason:`三线合一只对"顶角"成立——顶角的平分线=底边上的中线=底边上的高线。腰上的高不是三线中的任何一线。`,correctApproach:`三线合一中的"三线"特指：(1)顶角平分线 (2)底边中线 (3)底边高线。它们都是和底边相关的。`,relatedReminder:`"底"和"顶"要分清——三线合一作用于底边和顶角，不是腰。`},{wrongExample:`看到"有一个角是60°"的三角形就说它是等边三角形`,wrongReason:`必须是"有一个角是60°的等腰三角形"才是等边三角形。如果只说"有一个角是60°"，另外两个角可能是70°和50°，不是等边三角形。`,correctApproach:`判断等边三角形的三条路：(1)三边相等；(2)三角都相等；(3)有一个角是60°的等腰三角形。第三条路需要"等腰"这个前提。`,relatedReminder:`"等边三角形是特殊的等腰三角形"但要单独判定时必须有等腰前提+60°角。`},{wrongExample:`把"等边对等角"和"等角对等边"搞反——要证边相等却用"等边对等角"`,wrongReason:`"等边对等角"=由边推角（已知两边相等→推出两角相等）。"等角对等边"=由角推边（已知两角相等→推出两边相等）。方向不同，选错则整题逻辑断裂。`,correctApproach:`审题时明确：结论是"某两个角相等"→用等边对等角。结论是"某两条边相等"→用等角对等边。`,relatedReminder:`口诀："边推角用等边对等角，角推边用等角对等边"——注意"对"字后面的就是结论。`},{wrongExample:`作等腰三角形的辅助线时，同时画了顶角平分线和底边中线（画了两条不同的线）`,wrongReason:`等腰三角形中这两条线是同一条——三线合一。同时画两条不同的线会破坏图形的准确性。`,correctApproach:`等腰三角形中的顶角平分线、底边中线、底边高线是同一条线——选择一种方式作就可以了。`,relatedReminder:`在等腰三角形中，"作顶角平分线"和"作底边中线"是同一回事——选一种表述即可。`}],exercises:{basic:[{id:`ex-27-basic-1`,question:`在等腰△ABC中，AB=AC，∠A=50°。求∠B和∠C的度数。`,answer:`∠B=∠C=65°。
解：∵ AB=AC，∴ ∠B=∠C（等边对等角）
∠A+∠B+∠C=180°→50°+2∠B=180°→∠B=65°
∴ ∠B=∠C=65°`,hint:`等边对等角+内角和=180°。`,difficulty:`basic`,flaggedConceptIds:[`isosceles-triangle`]},{id:`ex-27-basic-2`,question:`在△ABC中，∠A=70°，∠B=55°。判断△ABC是什么三角形，并说明理由。`,answer:`△ABC是等腰三角形。
理由：∠C=180°-70°-55°=55°
∴ ∠B=∠C=55°
∴ AB=AC（等角对等边）
∴ △ABC是等腰三角形`,hint:`先求∠C，发现两个角相等→等角对等边→等腰三角形。`,difficulty:`basic`,flaggedConceptIds:[`isosceles-triangle`]},{id:`ex-27-basic-3`,question:`等腰△ABC中，AB=AC，AD平分∠BAC。若∠BAD=35°，求∠B的度数。`,answer:`∠B=55°。
解：∵ AD平分∠BAC，∴ ∠BAC=2×35°=70°
∵ AB=AC，∴ ∠B=∠C
∠B+∠C=180°-70°=110°→∠B=55°`,hint:`平分线给出顶角，等边对等角给出底角。`,difficulty:`basic`,flaggedConceptIds:[`isosceles-triangle`,`angle-bisector-properties`]},{id:`ex-27-basic-4`,question:`等边三角形ABC的边长为6，求它的高。`,answer:`高 = 3√3。
解：作AD⊥BC于D。
在等边△ABC中，AD也是BC的中线（三线合一）→BD=3
在Rt△ABD中，AD=√(6²-3²)=√(36-9)=√27=3√3`,hint:`等边三角形高=(√3/2)×边长。直接用勾股定理验证。`,difficulty:`basic`,flaggedConceptIds:[`isosceles-triangle`,`pythagorean-theorem`]},{id:`ex-27-basic-5`,question:`判断题：判断以下说法是否正确，并改正错误的说法。
(1)"有两个角相等的三角形是等腰三角形。"
(2)"等边三角形只有一条对称轴。"`,answer:`(1)正确。这是"等角对等边"的另一种表述。
(2)错误。改正："等边三角形有三条对称轴（每条边上的高所在直线都是一条对称轴）。"`,hint:`(2)等边三角形的高=中线=角平分线所在直线就是对称轴，三边各一条。`,difficulty:`basic`,flaggedConceptIds:[`isosceles-triangle`,`axis-symmetry`]}],intermediate:[{id:`ex-27-inter-1`,question:`（2023北京中考改编）如图，在△ABC中，AB=AC，D是BC上一点，∠BAD=30°，AD=BD。求∠BAC的度数。`,answer:`解：设∠B=∠C=x（等边对等角）
∵ AD=BD，∴ ∠B=∠BAD=30°（等边对等角在△ABD中）
∴ x=30°，即∠B=∠C=30°
∠BAC=180°-30°-30°=120°
答：∠BAC=120°。`,hint:`AD=BD→△ABD是等腰三角形→∠B=∠BAD=30°。然后大等腰△ABC中底角=30°→顶角=120°。`,difficulty:`intermediate`,flaggedConceptIds:[`isosceles-triangle`]},{id:`ex-27-inter-2`,question:`如图，在△ABC中，AB=AC，点D在△ABC内部，且DB=DC。求证：AD平分∠BAC。`,answer:`证明：
∵ AB=AC（已知）
∴ A在线段BC的垂直平分线上（到两端距离相等的点在垂直平分线上）
∵ DB=DC（已知）
∴ D也在BC的垂直平分线上
∴ 直线AD就是BC的垂直平分线
在等腰△ABC中，底边的垂直平分线=顶角平分线（三线合一）
∴ AD平分∠BAC`,hint:`先证AD是BC的垂直平分线（AB=AC且DB=DC→A和D都在垂直平分线上），再用三线合一。`,difficulty:`intermediate`,flaggedConceptIds:[`isosceles-triangle`,`angle-bisector-properties`]},{id:`ex-27-inter-3`,question:`如图，等边△ABC中，D是BC上一点，以AD为边向外作等边△ADE。求证：CE∥AB。`,answer:`证明：
∵ △ABC和△ADE都是等边三角形
∴ AB=AC，AD=AE，∠BAC=∠DAE=60°
∠BAD=∠BAC-∠DAC=60°-∠DAC
∠CAE=∠DAE-∠DAC=60°-∠DAC
∴ ∠BAD=∠CAE
在△ABD和△ACE中：AB=AC，∠BAD=∠CAE，AD=AE
∴ △ABD≅△ACE（SAS）
∴ ∠ACE=∠B=60°
∴ ∠ACE=∠BAC=60°→CE∥AB（内错角相等，两直线平行）`,hint:`先证△ABD≅△ACE（SAS），再找内错角相等→平行。`,difficulty:`intermediate`,flaggedConceptIds:[`isosceles-triangle`,`congruent-triangles`,`parallel-lines-proof`]}],challenge:[{id:`ex-27-challenge-1`,question:`（2022北京中考）如图，在△ABC中，AB=AC，∠A=36°，BD平分∠ABC交AC于D。求证：△BCD是等腰三角形，并求图中各角的度数。`,answer:`解：∠ABC=∠C=(180°-36°)÷2=72°
BD平分∠ABC→∠ABD=∠DBC=36°
在△BCD中，∠DBC=36°，∠C=72°→∠BDC=180°-36°-72°=72°
∴ ∠BDC=∠C=72°→BD=BC（等角对等边）
∴ △BCD是等腰三角形（且是"黄金等腰"，BD=BC=AD）

角：∠A=36°, ∠ABD=36°, ∠DBC=36°, ∠C=72°, ∠BDC=72°, ∠ADB=108°`,hint:`顶角36°的等腰三角形有"黄金分割"性质——角平分线分出另一个相似的等腰三角形。`,difficulty:`challenge`,flaggedConceptIds:[`isosceles-triangle`,`angle-bisector-properties`]},{id:`ex-27-challenge-2`,question:`如图，在等边△ABC中，D、E、F分别是AB、BC、CA上的点，且AD=BE=CF。求证：△DEF是等边三角形。`,answer:`证明：
∵ △ABC是等边三角形→AB=BC=CA，∠A=∠B=∠C=60°
设AD=BE=CF=a，则DB=AB-AD，EC=BC-BE，FA=CA-CF
∵ AB=BC=CA且AD=BE=CF，∴ DB=EC=FA
在△ADF和△BED中：AD=BE，∠A=∠B=60°，AF=BD
∴ △ADF≅△BED（SAS）→DF=ED
同理可证ED=FE
∴ DF=ED=FE→△DEF是等边三角形`,hint:`用SAS证明三个"角上的"小三角形两两全等→对应边相等→△DEF三边相等。`,difficulty:`challenge`,flaggedConceptIds:[`isosceles-triangle`,`congruent-triangles`]}],knowledgeTransfer:[{id:`ex-27-transfer-1`,question:`（预习Lecture 28：将军饮马）
如图，在∠AOB的内部有一点P。在OA上找一点M，在OB上找一点N，使得PM+MN最小。
提示：利用轴对称——反射法。`,answer:`作法：
作P关于OA的对称点P'，作P'关于OB的对称点P''
连接P''与……
（核心思想：两次反射——利用轴对称将折线转化为直线。PM+MN的最小值就是P'到M再到N再到目标点的最短路径。通过两次对称，最终把三段折线变成一条直线段。）

这个题是将军饮马问题的变式——在Lecture 28中会详细讲解。`,hint:`轴对称=反射法的理论基础。关于直线的对称点→对应点连线被对称轴垂直平分。`,difficulty:`transfer`,flaggedConceptIds:[`axis-symmetry`,`isosceles-triangle`,`shortest-path`],knowledgeChain:[`轴对称性质：对称轴是任意一对对应点连线的垂直平分线`,`作对称点后，折线路径转化为直线段`,`两点之间线段最短 → 反射法得最优解`,`预演Lecture 28将军饮马问题`]}]},oralTask:{problem:`已知△ABC中，AB=AC，D是BC上任意一点，DE⊥AB于E，DF⊥AC于F。请你口头证明：DE+DF为定值。（提示：用面积法）`,script:[`第一步：等腰△ABC中AB=AC。D在底边BC上。要求证DE+DF为定值——即和D的位置无关。`,`第二步：用面积法。连接AD。把△ABC分成△ABD和△ADC。`,`第三步：S△ABD=½·AB·DE（以AB为底，DE为高）。S△ADC=½·AC·DF（以AC为底，DF为高）。`,`第四步：因为AB=AC，所以S△ABD+S△ADC=½·AB·(DE+DF)。`,`第五步：但S△ABD+S△ADC=S△ABC——而S△ABC是定值。所以½·AB·(DE+DF)=S△ABC。`,`第六步：由此得出DE+DF=2S△ABC/AB——等式右边的S△ABC和AB都是定值，所以DE+DF为定值。这个定值恰好等于AB边（即腰）上的高。`,`第七步总结：面积法是解决"底边上点到两腰距离之和"这类问题的标准方法。如果你去翻课本，会发现三角形内角平分线的交点到三边距离相等，也是用面积法来理解的。`]},errorCard:{fields:{errorNumber:`EB-27-001`,errorType:`三线合一只用了一条，忘记其余两条`,errorReason:`在等腰三角形证明中，只用了"已知AD是顶角平分线"，但没有由此推出"AD也是底边中线和底边高线"。三线合一意味着知道一条线等于知道三条线的所有性质，不能只取其一。`,correctMethod:`在等腰三角形中，一旦确认某条线具有三线之一的身份，就应立即写出它同时具有的另外两个身份："所以XXX也是底边中线和底边高线"。将这个推理显式写出来。`,similarPractice:`在等腰△ABC（AB=AC）中，D是BC的中点。请完整写出"能推出哪些结论"——要求结论不少于3条，每条都要有理由。`,mastered:!1}},animationIds:[`axis-symmetry-fold`]};export{t};