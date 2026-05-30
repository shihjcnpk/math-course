import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import BreadcrumbNav from './BreadcrumbNav'

export default function AppLayout() {
  const location = useLocation()
  const isGraphPage =
    location.pathname === '/knowledge-graph' ||
    location.pathname.startsWith('/knowledge-graph/')
  const showSidebar = !isGraphPage

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto">
          {isGraphPage ? (
            <Outlet />
          ) : (
            <div className="max-w-5xl mx-auto px-6 py-6">
              <BreadcrumbNav />
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
