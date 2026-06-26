import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import '@/styles/index.css'
import '@/styles/katex-overrides.css'
import 'reactflow/dist/style.css'
import '@/styles/graph.css'
import '@/styles/animation.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
