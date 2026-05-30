import { useStore } from '@/store'
import { modules } from '@/data/modules'
import { getLecturesForModule } from '@/data/lectures'
import { computeProgress } from '@/utils/progress'
import ProgressBar from '@/components/shared/ProgressBar'

export default function ProgressPage() {
  const statuses = useStore((s) => s.progress.lectureStatuses)
  const totalStudyTime = useStore((s) => s.progress.totalStudyTimeMinutes)
  const { total, completed, mastered, percentage } = computeProgress(statuses)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">学习进度</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '总课时', value: total, color: 'text-gray-700' },
          { label: '已完成', value: completed, color: 'text-blue-600' },
          { label: '已掌握', value: mastered, color: 'text-green-600' },
          { label: '学习时间(分)', value: totalStudyTime, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <ProgressBar value={percentage} size="lg" color="bg-primary-500" showLabel />

      <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4">模块进度</h2>
      <div className="space-y-4">
        {modules.slice(1).map((mod) => {
          const lectures = getLecturesForModule(mod.id)
          const modCompleted = lectures.filter(
            (l) => statuses[l.id] === 'mastered' || statuses[l.id] === 'in-progress',
          ).length
          const modPct = lectures.length > 0 ? Math.round((modCompleted / lectures.length) * 100) : 0

          return (
            <div key={mod.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">{mod.subtitle}：{mod.title}</span>
                <span className="text-sm text-gray-500">{modCompleted}/{lectures.length} 讲</span>
              </div>
              <ProgressBar value={modPct} size="sm" color={`bg-module-${mod.color === 'blue' ? 'numbers' : mod.color === 'amber' ? 'equations' : mod.color === 'emerald' ? 'geometry' : mod.color === 'purple' ? 'functions' : mod.color === 'pink' ? 'statistics' : mod.color === 'red' ? 'comprehensive' : 'assessment'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
