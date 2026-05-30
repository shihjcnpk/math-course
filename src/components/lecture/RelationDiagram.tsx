import KaTeXRenderer from '@/components/shared/KaTeXRenderer'
import MathText from '@/components/shared/MathText'
import type { KnowledgeNetwork } from '@/types'

interface Props {
  network: KnowledgeNetwork
}

function isLectureThreeKnowledgeDiagram(diagram: string) {
  return (
    diagram.includes('第2讲知识') &&
    diagram.includes('数轴') &&
    diagram.includes('相反数') &&
    diagram.includes('绝对值') &&
    diagram.includes('有理数大小比较')
  )
}

function DiagramBox({
  title,
  subtitle,
  tone = 'blue',
}: {
  title: string
  subtitle?: string
  tone?: 'blue' | 'amber' | 'green' | 'gray'
}) {
  const toneClass = {
    blue: 'border-blue-200 bg-blue-50 text-blue-950',
    amber: 'border-amber-200 bg-amber-50 text-amber-950',
    green: 'border-green-200 bg-green-50 text-green-950',
    gray: 'border-gray-300 bg-white text-gray-900',
  }[tone]

  return (
    <div className={`min-h-[64px] rounded-md border px-3 py-2 text-center shadow-sm ${toneClass}`}>
      <div className="text-sm font-semibold leading-6">{title}</div>
      {subtitle && <div className="mt-1 text-xs font-medium leading-5 text-gray-700">{subtitle}</div>}
    </div>
  )
}

function LectureThreeKnowledgeDiagram() {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-gray-700">
        <div className="w-full max-w-[220px]">
          <DiagramBox title="第2讲知识" subtitle="正负数 + 有理数" tone="gray" />
        </div>
        <div className="text-lg font-semibold leading-none text-slate-500">↓</div>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <DiagramBox title="数轴" subtitle="原点 / 正方向 / 单位长度" tone="blue" />
          <div className="min-h-[64px] rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-center text-blue-950 shadow-sm">
            <div className="text-sm font-semibold leading-6">相反数</div>
            <div className="mt-1 flex justify-center text-xs font-medium leading-5 text-gray-700">
              <KaTeXRenderer formula="a \\leftrightarrow -a" />
            </div>
          </div>
          <div className="min-h-[64px] rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-center text-blue-950 shadow-sm">
            <div className="text-sm font-semibold leading-6">绝对值</div>
            <div className="mt-1 flex justify-center text-xs font-medium leading-5 text-gray-700">
              <KaTeXRenderer formula="|a|\\ge 0" />
            </div>
          </div>
        </div>

        <div className="text-lg font-semibold leading-none text-slate-500">↓</div>
        <div className="w-full max-w-[280px]">
          <DiagramBox title="有理数大小比较" subtitle="数轴法 + 绝对值法" tone="amber" />
        </div>

        <div className="flex flex-col items-center text-xs font-semibold text-slate-500">
          <span>↓</span>
          <span>向下支撑</span>
          <span>↓</span>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <DiagramBox title="有理数运算" subtitle="加 / 减 / 乘 / 除" tone="green" />
          <DiagramBox title="解方程" subtitle="移项与等式性质" tone="green" />
          <DiagramBox title="坐标系" subtitle="距离与位置" tone="green" />
        </div>
      </div>
    </div>
  )
}

function FlowCard({ children, tone }: { children: string; tone: 'from' | 'current' | 'to' }) {
  const toneClass = {
    from: 'border-amber-200 bg-amber-50 text-amber-950',
    current: 'border-blue-200 bg-blue-50 text-blue-950',
    to: 'border-green-200 bg-green-50 text-green-950',
  }[tone]

  return (
    <div className={`rounded-md border px-3 py-2 text-sm font-medium leading-6 shadow-sm ${toneClass}`}>
      <MathText>{children}</MathText>
    </div>
  )
}

function FlowColumn({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'from' | 'current' | 'to'
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 text-center text-xs font-semibold tracking-wide text-gray-500">{title}</div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <FlowCard key={`${tone}-${index}`} tone={tone}>
            {item}
          </FlowCard>
        ))}
      </div>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center text-slate-400">
      <div className="hidden flex-col items-center gap-1 md:flex">
        <div className="h-px w-10 bg-slate-300" />
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="h-px w-10 bg-slate-300" />
      </div>
      <div className="flex flex-col items-center text-xs font-semibold text-slate-500 md:hidden">
        <span>↓</span>
        <span>{label}</span>
      </div>
    </div>
  )
}

function StructuredNetworkDiagram({ network }: { network: KnowledgeNetwork }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <FlowColumn title="前置基础" items={network.fromWhere} tone="from" />
        <Connector label="支撑" />
        <FlowColumn title="本讲核心" items={network.currentCore} tone="current" />
        <Connector label="延伸" />
        <FlowColumn title="后续应用" items={network.toWhere} tone="to" />
      </div>
    </div>
  )
}

export default function RelationDiagram({ network }: Props) {
  if (isLectureThreeKnowledgeDiagram(network.relationDiagram)) {
    return <LectureThreeKnowledgeDiagram />
  }

  return <StructuredNetworkDiagram network={network} />
}
