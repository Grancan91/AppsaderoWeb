'use client'
import Badge from '../ui/Badge.jsx'
import LoadingSpinner from '../ui/LoadingSpinner.jsx'
import EmptyState from '../ui/EmptyState.jsx'

const TIPO_ICONS = { direct_user: '👤', email: '✉️', link: '🔗' }

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function InvitationList({ invitations, loading, error, onRevoke }) {
  if (loading) return <LoadingSpinner message="Cargando invitaciones..." />

  if (error) return (
    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      {error}
    </div>
  )

  if (invitations.length === 0) return (
    <EmptyState icon="✉️" title="Sin invitaciones" description="Las invitaciones que envíes aparecerán aquí." />
  )

  return (
    <div className="flex flex-col gap-2">
      {invitations.map(inv => (
        <div
          key={inv.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#1f242e] border border-[#3a4048]"
        >
          <span className="text-lg flex-shrink-0">{TIPO_ICONS[inv.tipo] || '📨'}</span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white text-sm font-medium truncate">
                {inv.invitedUser?.name || inv.invitedEmail || 'Enlace compartible'}
              </span>
              <Badge value={inv.tipo} />
              <Badge value={inv.status} />
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="text-xs text-[#b0b0b0]">
                Enviado por {inv.inviter?.name || 'desconocido'} · {formatDate(inv.createdAt)}
              </span>
              {inv.expiresAt && (
                <span className="text-xs text-orange-400">
                  Expira {formatDate(inv.expiresAt)}
                </span>
              )}
            </div>
            {inv.mensaje && (
              <p className="text-xs text-[#b0b0b0] italic mt-0.5 truncate">"{inv.mensaje}"</p>
            )}
          </div>

          {inv.status === 'pending' && (
            <button
              onClick={() => onRevoke(inv.id)}
              className="flex-shrink-0 text-xs px-2.5 py-1 rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors"
            >
              Revocar
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
