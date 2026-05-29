'use client'
import { useState } from 'react'

export default function InviteEmailForm({ onInvite }) {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback(null)
    if (!email.trim()) return setFeedback({ type: 'error', text: 'El email es requerido' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setFeedback({ type: 'error', text: 'Email no válido' })

    setLoading(true)
    try {
      await onInvite({ email: email.trim().toLowerCase(), mensaje: mensaje.trim() || undefined })
      setFeedback({ type: 'success', text: `Invitación enviada a ${email}` })
      setEmail('')
      setMensaje('')
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Error al enviar la invitación' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <label className="block text-sm text-[#b0b0b0] mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="amigo@email.com"
          className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
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
        {loading ? 'Enviando...' : 'Invitar por email'}
      </button>
    </form>
  )
}
