import { useParams, Link } from 'react-router-dom'
import { getModuleById } from '@/data/modules'
import { getLecturesForModule } from '@/data/lectures'
import { useStore } from '@/store'
import LectureCard from '@/components/shared/LectureCard'
import ProgressBar from '@/components/shared/ProgressBar'
import { computeProgress } from '@/utils/progress'

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = getModuleById(parseInt(moduleId || '1'))
  const statuses = useStore((s) => s.progress.lectureStatuses)

  if (!module) {
    return <div className="text-center py-12 text-gray-500">模块未找到</div>
  }

  const lectures = getLecturesForModule(module.id)
  const { percentage, mastered } = computeProgress(statuses)

  return (
    <div>
      <div className={`p-6 rounded-xl mb-6 bg-gradient-to-r ${
        module.id === 2 ? 'from-blue-50 to-blue-100' :
        module.id === 3 ? 'from-amber-50 to-amber-100' :
        module.id === 4 ? 'from-emerald-50 to-emerald-100' :
        module.id === 5 ? 'from-purple-50 to-purple-100' :
        module.id === 6 ? 'from-pink-50 to-pink-100' :
        module.id === 7 ? 'from-red-50 to-red-100' :
        'from-gray-50 to-gray-100'
      }`}>
        <h1 className="text-2xl font-bold text-gray-900">{module.subtitle}：{module.title}</h1>
        <p className="text-gray-600 mt-2">{module.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <ProgressBar value={percentage} size="md" color="bg-primary-500" showLabel />
          <span className="text-sm text-gray-500">{lectures.length} 讲 · 已掌握 {mastered} 讲</span>
        </div>
      </div>

      <div className="space-y-2">
        {lectures.map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">模块知识网</h3>
        <p className="text-sm text-gray-600 mb-3">
          本模块知识点在知识图谱中的位置和关联。理解知识之间的连线比记住每个知识点更重要。
        </p>
        <Link
          to="/knowledge-graph"
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          查看完整知识图谱 →
        </Link>
      </div>
    </div>
  )
}
