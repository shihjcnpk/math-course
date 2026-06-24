import type { KnowledgeThreadDefinition, TypicalQuestion } from '@/types'
import MathText from '@/components/shared/MathText'

interface Props {
  question: TypicalQuestion
  threads: KnowledgeThreadDefinition[]
}

function inferLikelyErrorType(question: TypicalQuestion): string {
  const text = `${question.name} ${question.essence} ${question.example.commonMistake}`
  if (/变式|迁移|综合|换一种|转化/.test(text)) return '迁移错误'
  if (/单位|关键词|条件|所求|看清|对应/.test(text)) return '审题错误'
  if (/定义|概念|性质|适用|混淆/.test(text)) return '概念错误'
  if (/符号|计算|变号|括号|通分|约分|代入/.test(text)) return '计算错误'
  if (/依据|证明|格式|跳步|步骤/.test(text)) return '步骤错误'
  if (/检验|验算|合理|范围/.test(text)) return '检查错误'
  return '方法错误或迁移错误'
}

export default function QuestionTypeNetwork({ question, threads }: Props) {
  const firstLook = question.solutionSteps[0] || question.essence
  const firstAction = question.solutionSteps[1] || question.solutionSteps[0] || question.summary
  const variation = question.variations[0]?.problem || '改变条件或问法后，仍使用同一核心方法。'
  const upgrade = question.knowledgeChain?.at(-1) || question.summary

  return (
    <details className="mb-3 rounded-lg border border-violet-200 bg-violet-50 p-3">
      <summary className="cursor-pointer text-xs font-semibold text-violet-900">
        题型网络：先识别，再下笔
      </summary>
      <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-700 md:grid-cols-2">
        <div><dt className="font-semibold text-violet-800">所属知识主线</dt><dd>{threads.map((thread) => thread.name).join('、') || '综合复习主线'}</dd></div>
        <div><dt className="font-semibold text-violet-800">核心考点</dt><dd><MathText>{question.essence}</MathText></dd></div>
        <div><dt className="font-semibold text-violet-800">第一眼看什么</dt><dd><MathText>{firstLook}</MathText></dd></div>
        <div><dt className="font-semibold text-violet-800">第一步做什么</dt><dd><MathText>{firstAction}</MathText></dd></div>
        <div><dt className="font-semibold text-violet-800">容易混淆</dt><dd><MathText>{question.example.commonMistake}</MathText></dd></div>
        <div><dt className="font-semibold text-violet-800">怎样变式</dt><dd><MathText>{variation}</MathText></dd></div>
        <div><dt className="font-semibold text-violet-800">后续升级</dt><dd><MathText>{upgrade}</MathText></dd></div>
        <div><dt className="font-semibold text-violet-800">常见错因</dt><dd>{inferLikelyErrorType(question)}</dd></div>
      </dl>
    </details>
  )
}
