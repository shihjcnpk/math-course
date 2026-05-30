import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'
import ModulePage from '@/pages/ModulePage'
import LecturePage from '@/pages/LecturePage'
import ProgressPage from '@/pages/ProgressPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Heavy pages — lazy loaded to keep main bundle small
const KnowledgeGraphPage = lazy(() => import('@/pages/KnowledgeGraphPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const ErrorNotebookPage = lazy(() => import('@/pages/ErrorNotebookPage'))

function PageFallback() {
  return <div className="flex items-center justify-center py-16 text-gray-400">加载中...</div>
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route path="/lectures/:lectureId" element={<LecturePage />} />
        <Route
          path="/knowledge-graph"
          element={<Suspense fallback={<PageFallback />}><KnowledgeGraphPage /></Suspense>}
        />
        <Route
          path="/knowledge-graph/:nodeId"
          element={<Suspense fallback={<PageFallback />}><KnowledgeGraphPage /></Suspense>}
        />
        <Route
          path="/search"
          element={<Suspense fallback={<PageFallback />}><SearchPage /></Suspense>}
        />
        <Route
          path="/error-notebook"
          element={<Suspense fallback={<PageFallback />}><ErrorNotebookPage /></Suspense>}
        />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
