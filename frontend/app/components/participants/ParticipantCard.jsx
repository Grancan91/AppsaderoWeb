'use client'
import { useState } from 'react'
import Badge from '../ui/Badge.jsx'
import AddFriendButton from '../friends/AddFriendButton.jsx'

const STATUS_OPTIONS = ['invited', 'pending_payment', 'confirmed', 'declined', 'removed']
const STATUS_LABELS = {
  invited: 'Invitado', pending_payment: 'Pago pendiente', confirmed: 'Confirmado',
  declined: 'Rechazado', removed: 'Eliminado',
}
const ROLE_OPTIONS = ['guest', 'co_host', 'creator']
const ROLE_LABELS = { guest: 'Invitado', co_host: 'Co-anfitrión', creator: 'Creador' }

export default function ParticipantCard({
  participant, isOrganizer, currentUserId, onUpdateStatus, onRemove,
  // props opcionales de amistad
  friendship, onSendFriendRequest, onAcceptFriendRequest, onDeclineFriendRequest, onRemoveFriend,
}) {
  const { user, role, status, joinedAt } = participant
  const isMe = user?.id === currentUserId
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(e) {
    setLoading(true)
    try { await onUpdateStatus(user.id, { status: e.target.value }) } finally { setLoading(false) }
  }

  async function handleRoleChange(e) {
    setLoading(true)
    try { await onUpdateStatus(user.id, { role: e.target.value }) } finally { setLoading(false) }
  }

  async function handleRemove() {
    if (!confirm(`¿Eliminar a ${user?.name || user?.email} del asadero?`)) return
    setLoading(true)
    try { await onRemove(user.id) } finally { setLoading(false) }
  }

  const showFriendButton = !isMe && onSendFriendRequest

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
      isMe ? 'bg-[#77f8c0]/5 border-[#77f8c0]/20' : 'bg-[#1f242e] border-[#3a4048]'
    }`}>
      {/* avatar */}
      <div className="w-9 h-9 rounded-full bg-[#3a4048] flex items-center justify-center text-sm font-semibold text-[#77f8c0] shrink-0">
        {(user?.name || user?.email || '?')[0].toUpperCase()}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white text-sm font-medium truncate">
            {user?.name || 'Sin nombre'}
            {isMe && <span className="text-[#77f8c0] ml-1">(tú)</span>}
          </span>
          <Badge value={role} />
          <Badge value={status} />
        </div>
        <p className="text-[#b0b0b0] text-xs truncate mt-0.5">{user?.email}</p>
        {joinedAt && (
          <p className="text-[#505050] text-xs mt-0.5">
            Se unió {new Date(joinedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* controles derechos */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {/* botón de amistad (solo para otros usuarios) */}
        {showFriendButton && (
          <AddFriendButton
            targetUserId={user?.id}
            friendship={friendship}
            myId={currentUserId}
            onSend={onSendFriendRequest}
            onAccept={onAcceptFriendRequest}
            onDecline={onDeclineFriendRequest}
            onRemove={onRemoveFriend}
          />
        )}

        {/* controles de organizador */}
        {isOrganizer && role !== 'creator' && (
          <>
            <select
              value={status}
              onChange={handleStatusChange}
              disabled={loading}
              className="text-xs bg-[#2a2f38] border border-[#3a4048] rounded-lg px-2 py-1 text-[#b0b0b0] focus:outline-none focus:border-[#77f8c0] disabled:opacity-50"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <select
              value={role}
              onChange={handleRoleChange}
              disabled={loading}
              className="text-xs bg-[#2a2f38] border border-[#3a4048] rounded-lg px-2 py-1 text-[#b0b0b0] focus:outline-none focus:border-[#77f8c0] disabled:opacity-50"
            >
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="p-1.5 rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 disabled:opacity-50 transition-colors"
              title="Eliminar del asadero"
            >
              ✕
            </button>
          </>
        )}

        {/* control propio: declinar invitación */}
        {!isOrganizer && isMe && status === 'invited' && (
          <button
            onClick={() => onUpdateStatus(user.id, { status: 'declined' })}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#3a4048] text-[#b0b0b0] hover:border-red-400/50 hover:text-red-400 disabled:opacity-50 transition-colors"
          >
            Declinar
          </button>
        )}
      </div>
    </div>
  )
}
