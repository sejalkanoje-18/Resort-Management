import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import GuestSidebar from './GuestSidebar'
import GuestTopbar from './GuestTopbar'

export default function GuestLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-dark-gradient overflow-hidden">
      <GuestSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <GuestTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
