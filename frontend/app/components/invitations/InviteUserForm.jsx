'use client'
import { useState } from 'react'

export default function InviteUserForm({ onInvite }) {
  const [userId, setUserId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback(null)
    if (!userId.trim()) return setFeedback({ type: 'error', text: 'El ID de usuario es requerido' })

    setLoading(true)
    try {
      await onInvite({ userId: userId.trim(), mensaje: mensaje.trim() || undefined })
      setFeedback({ type: 'success', text: 'Invitación enviada correctamente' })
      setUserId('')
      setMensaje('')
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Error al enviar la invitación' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-xs text-[#b0b0b0]">
        Invita directamente a un usuario registrado con su ID. El usuario verá la invitación en la lista de participantes de inmediato.
      </p>
      {feedback && (
        <div className={`px-3 py-2 rounded-lg text-sm border ${
          feedback.type === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-green-500/10 border-green-500/20 text-green-400'
        }`}>
          {feedback.text}
        </div>
      )}
      <div>
        <label className="block text-sm text-[#b0b0b0] mb-1">ID de usuario</label>
        <input
          type="text"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="UUID del usuario..."
          className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm font-mono"
        />
      </div>
      <div>
        <label className="block text-sm text-[#b0b0b0] mb-1">Mensaje opcional</label>
        <input
          type="text"
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="¡Te esperamos!"
          className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="py-2 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Enviando...' : 'Invitar usuario'}
      </button>
    </form>
  )
}
