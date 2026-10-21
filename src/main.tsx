import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './web/App.tsx'
import { PwaUpdater } from './web/PwaUpdater.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <PwaUpdater />
  </StrictMode>,
)
