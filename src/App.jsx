import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppLayout from './components/layout/AppLayout'
import GuestLayout from './components/layout/GuestLayout'

// Auth
import Login       from './pages/auth/Login'
import GuestLogin  from './pages/guest/GuestLogin'

// Owner
import OwnerDashboard   from './pages/owner/OwnerDashboard'
import OwnerResorts     from './pages/owner/OwnerResorts'
import OwnerPermissions from './pages/owner/OwnerPermissions'
import OwnerAccounts    from './pages/owner/OwnerAccounts'
import OwnerRevenue     from './pages/owner/OwnerRevenue'
import OwnerReports     from './pages/owner/OwnerReports'
import OwnerAudit       from './pages/owner/OwnerAudit'
import OwnerSettings    from './pages/owner/OwnerSettings'

// Management Dashboard
import ManagementDashboard from './pages/management/ManagementDashboard'

// Shared Modules
import ResortsModule      from './pages/modules/ResortsModule'
import RoomsModule        from './pages/modules/RoomsModule'
import ReservationsModule from './pages/modules/ReservationsModule'
import GuestsModule       from './pages/modules/GuestsModule'
import HousekeepingModule from './pages/modules/HousekeepingModule'
import MaintenanceModule  from './pages/modules/MaintenanceModule'
import BillingModule      from './pages/modules/BillingModule'
import OffersModule       from './pages/modules/OffersModule'
import ReviewsModule      from './pages/modules/ReviewsModule'
import ReportsModule      from './pages/modules/ReportsModule'
import UsersModule        from './pages/modules/UsersModule'
import PermissionsModule  from './pages/modules/PermissionsModule'
import AuditLogsModule    from './pages/modules/AuditLogsModule'
import SettingsModule     from './pages/modules/SettingsModule'

// Staff
import StaffDashboard    from './pages/staff/StaffDashboard'
import FrontDesk         from './pages/staff/FrontDesk'
import StaffHousekeeping from './pages/staff/StaffHousekeeping'
import StaffMaintenance  from './pages/staff/StaffMaintenance'
import FnBModule         from './pages/staff/FnBModule'
import SpaModule         from './pages/staff/SpaModule'
import GardenModule      from './pages/staff/GardenModule'

// Guest
import GuestDashboard    from './pages/guest/GuestDashboard'
import GuestDiscover     from './pages/guest/GuestDiscover'
import GuestBooking      from './pages/guest/GuestBooking'
import GuestReservations from './pages/guest/GuestReservations'
import GuestProfile      from './pages/guest/GuestProfile'
import GuestFeedback     from './pages/guest/GuestFeedback'

// ── Route Guards ──────────────────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading session...</p>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const routes = { owner: '/owner', management: '/management', staff: '/staff', guest: '/guest' }
    return <Navigate to={routes[user.role] || '/login'} replace />
  }
  return children
}

function GuestProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading session...</p>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/guest/login" replace />
  if (user.role !== 'guest') return <Navigate to="/" replace />
  return children
}

function DefaultRedirect() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading session...</p>
        </div>
      </div>
    )
  }
  if (!user)                      return <Navigate to="/login" replace />
  if (user.role === 'owner')      return <Navigate to="/owner" replace />
  if (user.role === 'management') return <Navigate to="/management" replace />
  if (user.role === 'guest')      return <Navigate to="/guest" replace />
  return <Navigate to="/staff" replace />
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public auth pages */}
      <Route path="/login"       element={<Login />} />
      <Route path="/guest/login" element={<GuestLogin />} />
      <Route path="/"            element={<DefaultRedirect />} />

      {/* ── Owner ────────────────────────────────────────── */}
      <Route path="/owner" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index               element={<OwnerDashboard />} />
        <Route path="resorts"      element={<OwnerResorts />} />
        <Route path="permissions"  element={<OwnerPermissions />} />
        <Route path="accounts"     element={<OwnerAccounts />} />
        <Route path="revenue"      element={<OwnerRevenue />} />
        <Route path="reports"      element={<OwnerReports />} />
        <Route path="audit"        element={<OwnerAudit />} />
        <Route path="staff"        element={<Navigate to="/owner/accounts" replace />} />
        <Route path="settings"     element={<OwnerSettings />} />
      </Route>

      {/* ── Management ───────────────────────────────────── */}
      <Route path="/management" element={
        <ProtectedRoute allowedRoles={['management', 'owner']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index               element={<ManagementDashboard />} />
        <Route path="resorts"      element={<ResortsModule />} />
        <Route path="rooms"        element={<RoomsModule />} />
        <Route path="reservations" element={<ReservationsModule />} />
        <Route path="guests"       element={<GuestsModule />} />
        <Route path="housekeeping" element={<HousekeepingModule />} />
        <Route path="maintenance"  element={<MaintenanceModule />} />
        <Route path="billing"      element={<BillingModule />} />
        <Route path="offers"       element={<OffersModule />} />
        <Route path="reviews"      element={<ReviewsModule />} />
        <Route path="reports"      element={<ReportsModule />} />
        <Route path="users"        element={<UsersModule />} />
        <Route path="permissions"  element={<PermissionsModule />} />
        <Route path="audit"        element={<AuditLogsModule />} />
        <Route path="settings"     element={<SettingsModule />} />
      </Route>

      {/* ── Staff ────────────────────────────────────────── */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['staff', 'management', 'owner']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index               element={<StaffDashboard />} />
        <Route path="front-desk"   element={<FrontDesk />} />
        <Route path="housekeeping" element={<StaffHousekeeping />} />
        <Route path="maintenance"  element={<StaffMaintenance />} />
        <Route path="fnb"          element={<FnBModule />} />
        <Route path="spa"          element={<SpaModule />} />
        <Route path="garden"       element={<GardenModule />} />
      </Route>

      {/* ── Guest ────────────────────────────────────────── */}
      <Route path="/guest" element={
        <GuestProtectedRoute>
          <GuestLayout />
        </GuestProtectedRoute>
      }>
        <Route index                element={<GuestDashboard />} />
        <Route path="discover"      element={<GuestDiscover />} />
        <Route path="book"          element={<GuestBooking />} />
        <Route path="reservations"  element={<GuestReservations />} />
        <Route path="profile"       element={<GuestProfile />} />
        <Route path="feedback"      element={<GuestFeedback />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
