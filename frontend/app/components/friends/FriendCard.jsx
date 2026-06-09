'use client'
import { useState } from 'react'

function getFriendUser(friendship, myId) {
  return friendship.requesterId === myId ? friendship.addressee : friendship.requester
}

export default function FriendCard({ friendship, myId, onRemove, onBlock }) {
  const friendUser = getFriendUser(friendship, myId)
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    if (!confirm(`¿Eliminar a ${friendUser?.name || friendUser?.email} de tus amigos?`)) return
    setLoading(true)
    try { await onRemove(friendship.id) } finally { setLoading(false) }
  }

  async function handleBlock() {
    if (!confirm(`¿Bloquear a ${friendUser?.name || friendUser?.email}? No podrá enviarte solicitudes.`)) return
    setLoading(true)
    try { await onBlock(friendUser.id) } finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1f242e] border border-[#3a4048]">
      <div className="w-9 h-9 rounded-full bg-[#3a4048] flex items-center justify-center text-sm font-semibold text-[#77f8c0] flex-shrink-0">
        {(friendUser?.name || friendUser?.email || '?')[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{friendUser?.name || 'Sin nombre'}</p>
        <p className="text-[#b0b0b0] text-xs truncate">{friendUser?.email}</p>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-xs px-2.5 py-1 rounded-lg border border-[#3a4048] text-[#b0b0b0] hover:border-red-400/40 hover:text-red-400 disabled:opacity-50 transition-colors"
        >
          Eliminar
        </button>
        <button
          onClick={handleBlock}
          disabled={loading}
          className="text-xs px-2.5 py-1 rounded-lg border border-[#3a4048] text-[#b0b0b0] hover:border-red-600/40 hover:text-red-500 disabled:opacity-50 transition-colors"
        >
          Bloquear
        </button>
      </div>
    </div>
  )
}
