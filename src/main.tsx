// import { StrictMode } from 'react'
import Clarity from '@microsoft/clarity'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID
if (clarityProjectId) {
  Clarity.init(clarityProjectId)
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // </StrictMode>
)
