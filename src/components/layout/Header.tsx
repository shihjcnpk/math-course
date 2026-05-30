import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-50">
      <Link to="/" className="text-lg font-bold text-primary-700">
        七八年级数学系统复习
      </Link>
      <nav className="ml-auto flex gap-4 text-sm text-gray-600">
        <Link to="/knowledge-graph" className="hover:text-primary-600">知识图谱</Link>
        <Link to="/search" className="hover:text-primary-600">搜索</Link>
        <Link to="/error-notebook" className="hover:text-primary-600">错题本</Link>
        <Link to="/progress" className="hover:text-primary-600">学习进度</Link>
      </nav>
    </header>
  )
}
