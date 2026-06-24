import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-3 sm:px-6 sticky top-0 z-50">
      <Link to="/" className="flex-shrink-0 text-base font-bold text-primary-700 sm:text-lg">
        七八年级数学系统复习
      </Link>
      <nav className="ml-auto flex gap-2 overflow-x-auto whitespace-nowrap pl-3 text-xs text-gray-600 sm:gap-4 sm:text-sm">
        <Link to="/textbook-chapters" className="hover:text-primary-600">教材章节</Link>
        <Link to="/knowledge-graph" className="hover:text-primary-600">知识图谱</Link>
        <Link to="/search" className="hover:text-primary-600">搜索</Link>
        <Link to="/error-notebook" className="hover:text-primary-600">错题本</Link>
        <Link to="/progress" className="hover:text-primary-600">学习进度</Link>
        <a href="/course-usage-guide.html" className="hover:text-primary-600">使用说明</a>
      </nav>
    </header>
  )
}
