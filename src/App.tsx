import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Protected } from '@/pages/authentication/Protected'
import Signup from './pages/authentication/Signup/Signup'
import Login from './pages/authentication/Login/Login'
import { Services } from './pages/services/Services'
import { MonitorPage } from './pages/monitor/MonitorsPage'
import { ServiceDetailsPage } from './pages/services/ServiceDetailsPage'
import IncidentsPage from './pages/incident/IncidentPage'

import MonitorStatsPageWrapper from './pages/stats/StatsWrapper'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Toaster richColors closeButton position='top-right' />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          {/* Protected NO-LAYOUT route for monitor stats */}
          <Route
            path='/monitor/:monitorId/stats'
            element={
              <Protected>
                <MonitorStatsPageWrapper />
              </Protected>
            }
          />
          {/* Protected WITH LAYOUT for dashboard */}
          <Route
            element={
              <Protected>
                <Layout />
              </Protected>
            }>
            <Route path='/' element={<Navigate to='/services' replace />} />
            <Route path='/services' element={<Services />} />
            <Route path='/services/:serviceId' element={<ServiceDetailsPage />} />
            <Route path='/monitor' element={<MonitorPage />} />
            <Route path='/incidents' element={<IncidentsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
