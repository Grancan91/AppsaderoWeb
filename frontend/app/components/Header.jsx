'use client'

import { useRouter } from 'next/navigation'

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  userInitial = 'U',
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
        >
          {sidebarOpen ? '‹' : '›'}
        </button>
        <div className="header-logo"></div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" title="Notificaciones">
          🔔
        </button>

        <div className="header-user">
          <div className="header-avatar">{userInitial}</div>
          <button className="header-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
