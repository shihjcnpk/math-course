import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">页面未找到</p>
      <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
        返回首页 →
      </Link>
    </div>
  )
}
