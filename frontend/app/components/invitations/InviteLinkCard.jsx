'use client'
import { useState } from 'react'

export default function InviteLinkCard({ onCreateLink }) {
  const [inviteUrl, setInviteUrl] = useState(null)
  const [expiresAt, setExpiresAt] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    setError(null)
    setLoading(true)
    try {
      const result = await onCreateLink({
        expiresAt: expiresAt || undefined,
        mensaje: mensaje.trim() || undefined,
      })
      const fullUrl = window.location.origin + result.inviteUrl
      setInviteUrl(fullUrl)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el enlace')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#b0b0b0]">
        Genera un enlace que cualquier usuario autenticado puede usar para unirse al asadero.
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Expira el (opcional)</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Mensaje opcional</label>
          <input
            type="text"
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            placeholder="¡Únete a nuestro asadero!"
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="py-2 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Generando...' : 'Generar enlace'}
      </button>

      {inviteUrl && (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#77f8c0]/5 border border-[#77f8c0]/20">
          <p className="text-xs text-[#77f8c0] font-medium">Enlace generado</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={inviteUrl}
              className="flex-1 min-w-0 px-3 py-1.5 bg-[#1f242e] border border-[#3a4048] rounded-lg text-[#b0b0b0] text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-[#77f8c0] text-[#1f242e] hover:opacity-90'
              }`}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
