import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DeveloperPortal } from './components/developer/DeveloperPortal'
import './styles/qw.css'
import './styles/developer.css'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isDeveloper = path === '/developer' || path.startsWith('/developer/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isDeveloper ? <DeveloperPortal /> : <App />}</StrictMode>,
)
