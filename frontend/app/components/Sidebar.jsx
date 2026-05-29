'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ open = true }) {
  const pathname = usePathname()
  const isActive = (href) => pathname === href

  return (
    <aside className={`sidebar ${!open ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">Appsadero</div>
      </div>

      <nav className="sidebar-content">
        <Link
          href="/dashboard"
          className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-label">Inicio</span>
        </Link>

        <Link
          href="/dashboard/perfil"
          className={`sidebar-item ${isActive('/dashboard/perfil') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-label">Mi Perfil</span>
        </Link>
      </nav>
    </aside>
  )
}
