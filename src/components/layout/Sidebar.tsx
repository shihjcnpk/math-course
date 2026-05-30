import { Link, useLocation } from 'react-router-dom'
import { modules } from '@/data/modules'
import { getLecturesForModule } from '@/data/lectures'
import { useStore } from '@/store'

export default function Sidebar() {
  const location = useLocation()
  const statuses = useStore((s) => s.progress.lectureStatuses)

  const isLecture = location.pathname.startsWith('/lectures/')
  const isModule = location.pathname.startsWith('/modules/')
  const currentModuleId = (() => {
    if (isLecture) {
      const id = parseInt(location.pathname.split('/')[2])
      for (const mod of modules) {
        if (id >= mod.lectureRange[0] && id <= mod.lectureRange[1]) return mod.id
      }
    }
    if (isModule) return parseInt(location.pathname.split('/')[2])
    return null
  })()

  return (
    <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block flex-shrink-0">
      <nav className="p-3 space-y-1">
        {modules.map((mod) => {
          const lectures = getLecturesForModule(mod.id)
          const isCurrentModule = currentModuleId === mod.id
          const completedCount = lectures.filter(
            (l) => statuses[l.id] === 'mastered',
          ).length

          return (
            <div key={mod.id}>
              <Link
                to={`/modules/${mod.id}`}
                className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isCurrentModule
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs mr-1 opacity-60">{mod.subtitle[2]}</span>
                {mod.title}
                <span className="text-xs text-gray-400 ml-auto float-right mt-0.5">
                  {completedCount}/{lectures.length}
                </span>
              </Link>

              {isCurrentModule && (
                <div className="ml-2 mt-0.5 space-y-0.5">
                  {lectures.map((l) => {
                    const isCurrentLecture =
                      isLecture && parseInt(location.pathname.split('/')[2]) === l.id
                    const s = statuses[l.id] || 'not-started'

                    return (
                      <Link
                        key={l.id}
                        to={`/lectures/${l.id}`}
                        className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                          isCurrentLecture
                            ? 'bg-primary-100 text-primary-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 text-right text-gray-400">{l.id}</span>
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className="flex-shrink-0">
                            {s === 'mastered' ? '✓' :
                             s === 'error-prone' ? '⚠' :
                             s === 'needs-review' ? '↻' :
                             s === 'in-progress' ? '▶' : ''}
                          </span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
