import { Link } from 'react-router-dom'
import { modules } from '@/data/modules'
import { getLecturesForModule } from '@/data/lectures'
import { useStore } from '@/store'
import ProgressBar from '@/components/shared/ProgressBar'
import { computeProgress } from '@/utils/progress'

const MODULE_ICONS: Record<number, string> = {
  1: '🗺️', 2: '🔢', 3: '⚖️', 4: '📐', 5: '📈', 6: '📊', 7: '🎯', 8: '✅',
}

const MODULE_BORDERS: Record<number, string> = {
  1: 'border-gray-300 hover:border-gray-400',
  2: 'border-blue-200 hover:border-blue-300',
  3: 'border-amber-200 hover:border-amber-300',
  4: 'border-emerald-200 hover:border-emerald-300',
  5: 'border-purple-200 hover:border-purple-300',
  6: 'border-pink-200 hover:border-pink-300',
  7: 'border-red-200 hover:border-red-300',
  8: 'border-gray-200 hover:border-gray-300',
}

export default function HomePage() {
  const statuses = useStore((s) => s.progress.lectureStatuses)
  const { total, completed, mastered, percentage } = computeProgress(statuses)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">七八年级数学系统复习教程</h1>
        <p className="text-gray-500 mt-2 text-lg">48讲 · 8大模块 · 知识网络式学习</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">总体学习进度</h2>
          <span className="text-sm text-gray-500">{completed}/{total} 讲完成 · {mastered} 讲已掌握</span>
        </div>
        <ProgressBar value={percentage} size="lg" color="bg-primary-500" showLabel />
        <div className="flex gap-2 mt-3">
          <Link to="/progress" className="text-xs text-primary-600 hover:text-primary-700">查看详细进度 →</Link>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {modules.map((mod) => {
          const lectures = getLecturesForModule(mod.id)
          const modCompleted = lectures.filter(
            (l) => statuses[l.id] === 'mastered',
          ).length

          return (
            <Link
              key={mod.id}
              to={`/modules/${mod.id}`}
              className={`p-4 rounded-xl border bg-white transition-all hover:shadow-md ${MODULE_BORDERS[mod.id]}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{MODULE_ICONS[mod.id]}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {mod.subtitle}：{mod.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    第{mod.lectureRange[0]}—{mod.lectureRange[1]}讲 · {lectures.length}讲
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{mod.description}</p>
              <ProgressBar
                value={lectures.length > 0 ? Math.round((modCompleted / lectures.length) * 100) : 0}
                size="sm"
                color="bg-primary-400"
              />
              <p className="text-xs text-gray-400 mt-1">{modCompleted}/{lectures.length} 讲已掌握</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/knowledge-graph" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all">
          <h3 className="font-semibold text-gray-800">🔗 知识图谱</h3>
          <p className="text-sm text-gray-500 mt-1">查看知识点之间的关联，理解数学的整体结构</p>
        </Link>
        <Link to="/search" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all">
          <h3 className="font-semibold text-gray-800">🔍 全局搜索</h3>
          <p className="text-sm text-gray-500 mt-1">按章节、知识点、题型、易错点搜索</p>
        </Link>
        <Link to="/error-notebook" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all">
          <h3 className="font-semibold text-gray-800">📋 错题本</h3>
          <p className="text-sm text-gray-500 mt-1">记录错题，诊断知识断点，生成复习建议</p>
        </Link>
      </div>
    </div>
  )
}
