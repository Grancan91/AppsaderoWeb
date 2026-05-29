'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { UserProvider, useUser } from '../../lib/user/UserContext'

function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useUser()

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />
      <div className="dashboard-content">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userInitial={userInitial}
        />
        <main className="dashboard-main flex justify-center">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <UserProvider>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  )
}
