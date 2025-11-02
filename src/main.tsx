import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// FORCE NEW BUILD - Cache bust version
const BUILD_VERSION = '2025-11-02-CACHE-FIX';
console.log('🚀 Signal/Noise Build:', BUILD_VERSION);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
