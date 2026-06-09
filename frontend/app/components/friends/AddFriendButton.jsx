'use client'
import { useState } from 'react'

// friendship: registro Friend entre el usuario actual y targetUser (o null)
// myId: UUID del usuario actual en BD
export default function AddFriendButton({ targetUserId, friendship, myId, onSend, onAccept, onDecline, onRemove }) {
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)

  if (!targetUserId || !myId || targetUserId === myId) return null

  async function handle(action) {
    setLoading(true)
    setLocalError(null)
    try {
      await action()
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Error')
    } finally {
      setLoading(false)
    }
  }

  if (!friendship) {
    return (
      <button
        onClick={() => handle(() => onSend(targetUserId))}
        disabled={loading}
        title={localError || undefined}
        className="text-xs px-2.5 py-1 rounded-lg bg-[#77f8c0]/10 text-[#77f8c0] border border-[#77f8c0]/20 hover:bg-[#77f8c0]/20 disabled:opacity-50 transition-colors"
      >
        {loading ? '...' : '+ Añadir'}
      </button>
    )
  }

  const iAmRequester = friendship.requesterId === myId

  if (friendship.status === 'accepted') {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-[#77f8c0]">✓ Amigos</span>
        <button
          onClick={() => handle(() => onRemove(friendship.id))}
          disabled={loading}
          className="text-[#505050] hover:text-red-400 disabled:opacity-50 transition-colors text-xs ml-0.5"
          title="Eliminar amigo"
        >
          ✕
        </button>
      </div>
    )
  }

  if (friendship.status === 'pending') {
    if (iAmRequester) {
      return (
        <span className="text-xs text-[#b0b0b0] border border-[#3a4048] px-2.5 py-1 rounded-lg">
          Enviada
        </span>
      )
    }
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handle(() => onAccept(friendship.id))}
          disabled={loading}
          className="text-xs px-2.5 py-1 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Aceptar
        </button>
        <button
          onClick={() => handle(() => onDecline(friendship.id))}
          disabled={loading}
          className="text-xs px-1.5 py-1 rounded-lg text-[#b0b0b0] hover:text-red-400 disabled:opacity-50 transition-colors"
        >
          ✕
        </button>
      </div>
    )
  }

  if (friendship.status === 'blocked') {
    return <span className="text-xs text-[#505050]">Bloqueado</span>
  }

  return null
}
