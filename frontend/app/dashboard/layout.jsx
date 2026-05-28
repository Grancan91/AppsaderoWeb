'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />
      <div className="dashboard-content">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          userInitial="A"
        />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  )
}
