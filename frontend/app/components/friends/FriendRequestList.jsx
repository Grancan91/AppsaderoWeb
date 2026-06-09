'use client'
import { useState } from 'react'
import EmptyState from '../ui/EmptyState.jsx'

function RequestCard({ request, onAccept, onDecline }) {
  const [loading, setLoading] = useState(false)
  const { requester } = request

  async function handle(action) {
    setLoading(true)
    try {
      if (action === 'accept') await onAccept(request.id)
      else await onDecline(request.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1f242e] border border-[#77f8c0]/20">
      <div className="w-9 h-9 rounded-full bg-[#3a4048] flex items-center justify-center text-sm font-semibold text-[#77f8c0] flex-shrink-0">
        {(requester?.name || requester?.email || '?')[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{requester?.name || 'Sin nombre'}</p>
        <p className="text-[#b0b0b0] text-xs truncate">{requester?.email}</p>
        <p className="text-[#77f8c0]/60 text-xs mt-0.5">Quiere ser tu amigo</p>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={() => handle('accept')}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Aceptar
        </button>
        <button
          onClick={() => handle('decline')}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-[#3a4048] text-[#b0b0b0] hover:text-red-400 disabled:opacity-50 transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  )
}

export default function FriendRequestList({ requests, onAccept, onDecline }) {
  if (requests.length === 0) {
    return <EmptyState icon="📭" title="Sin solicitudes pendientes" />
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map(r => (
        <RequestCard key={r.id} request={r} onAccept={onAccept} onDecline={onDecline} />
      ))}
    </div>
  )
}
