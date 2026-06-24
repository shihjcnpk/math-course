import { Link } from 'react-router-dom'
import { textbookChapters } from '@/data/textbook-chapters'
import { getLectureMeta } from '@/data/lectures'

const VOLUMES = [
  { grade: 7 as const, volume: '上册' as const, edition: '2024秋' },
  { grade: 7 as const, volume: '下册' as const, edition: '2025春' },
  { grade: 8 as const, volume: '上册' as const, edition: '2025秋' },
  { grade: 8 as const, volume: '下册' as const, edition: '2026春' },
]

export default function TextbookChaptersPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary-700">第二套导航 · 不改变现有48讲顺序</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">人教版新课标六三制教材章节</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          按2024—2026新版教材24章查找对应复习课。默认学习路径仍是跨年级知识主线；这里用于同步学校进度和核对教材位置。
        </p>
      </div>

      <div className="space-y-8">
        {VOLUMES.map((group) => {
          const chapters = textbookChapters.filter(
            (chapter) => chapter.grade === group.grade && chapter.volume === group.volume,
          )

          return (
            <section key={group.grade + group.volume}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{group.grade}年级{group.volume}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{group.edition}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {chapters.map((chapter) => (
                  <article key={chapter.id} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">第{chapter.id}章</p>
                        <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                      </div>
                      <span className={'rounded-full px-2 py-1 text-[10px] font-medium ' + (
                        chapter.coverage === 'complete'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      )}>
                        {chapter.coverage === 'complete' ? '已覆盖' : '部分覆盖'}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {chapter.lecture_ids.map((lectureId) => {
                        const lecture = getLectureMeta(lectureId)
                        return lecture ? (
                          <Link
                            key={lectureId}
                            to={'/lectures/' + lectureId}
                            className="rounded-lg border border-primary-100 bg-primary-50 px-2 py-1 text-xs text-primary-700 hover:border-primary-300"
                          >
                            第{lectureId}讲：{lecture.title}
                          </Link>
                        ) : null
                      })}
                    </div>

                    {chapter.missing_topics.length > 0 && (
                      <div className="mt-3 rounded-lg bg-amber-50 p-2">
                        <p className="text-[11px] font-medium text-amber-800">待补或待教师复核</p>
                        <ul className="mt-1 list-disc pl-4 text-[11px] text-amber-700">
                          {chapter.missing_topics.map((topic) => <li key={topic}>{topic}</li>)}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
