import { Link, useLocation } from 'react-router-dom'
import { getModuleForLecture } from '@/data/modules'
import { getLectureMeta } from '@/data/lectures'

/**
 * Auto-generated breadcrumbs derived from the current route params.
 */
export default function BreadcrumbNav() {
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)

  const crumbs: Array<{ label: string; href: string }> = [
    { label: '首页', href: '/' },
  ]

  if (parts[0] === 'lectures' && parts[1]) {
    const lectureId = parseInt(parts[1])
    const lecture = getLectureMeta(lectureId)
    const module = lecture ? getModuleForLecture(lectureId) : null
    if (module) {
      crumbs.push({ label: module.title, href: `/modules/${module.id}` })
    }
    if (lecture) {
      crumbs.push({
        label: `第${lectureId}讲：${lecture.title}`,
        href: `/lectures/${lectureId}`,
      })
    }
  } else if (parts[0] === 'modules' && parts[1]) {
    crumbs.push({ label: `模块${parts[1]}`, href: `/modules/${parts[1]}` })
  } else if (parts[0] === 'knowledge-graph') {
    crumbs.push({ label: '知识图谱', href: '/knowledge-graph' })
  } else if (parts[0] === 'search') {
    crumbs.push({ label: '搜索', href: '/search' })
  } else if (parts[0] === 'error-notebook') {
    crumbs.push({ label: '错题本', href: '/error-notebook' })
  } else if (parts[0] === 'progress') {
    crumbs.push({ label: '学习进度', href: '/progress' })
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300">/</span>}
          {i < crumbs.length - 1 ? (
            <Link to={crumb.href} className="hover:text-primary-600">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
