'use client'
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '../../../services/firebase.js'
import { acceptInvitation, declineInvitation } from '../../../lib/events/invitation_service.js'

export default function InvitationPage({ params }) {
  const { token } = use(params)
  const router = useRouter()

  const [authUser, setAuthUser] = useState(undefined) // undefined = loading
  const [status, setStatus] = useState('idle') // idle | accepting | declining | accepted | declined | error
  const [message, setMessage] = useState(null)
  const [eventId, setEventId] = useState(null)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => setAuthUser(user || null))
    return unsub
  }, [])

  async function handleAccept() {
    setStatus('accepting')
    setMessage(null)
    try {
      const result = await acceptInvitation(token)
      setEventId(result.participant?.eventId)
      setStatus('accepted')
    } catch (err) {
      setMessage(err.response?.data?.error || 'No se pudo aceptar la invitación')
      setStatus('error')
    }
  }

  async function handleDecline() {
    setStatus('declining')
    setMessage(null)
    try {
      await declineInvitation(token)
      setStatus('declined')
    } catch (err) {
      setMessage(err.response?.data?.error || 'No se pudo rechazar la invitación')
      setStatus('error')
    }
  }

  // Loading auth state
  if (authUser === undefined) {
    return (
      <div className="min-h-screen bg-[#1f242e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3a4048] border-t-[#77f8c0] rounded-full animate-spin" />
      </div>
    )
  }

  // Not authenticated
  if (authUser === null) {
    return (
      <div className="min-h-screen bg-[#1f242e] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-[#2a2f38] border border-[#3a4048] rounded-2xl p-8 text-center">
          <span className="text-5xl">🥩</span>
          <h1 className="text-xl font-bold text-white mt-4">Has sido invitado a un asadero</h1>
          <p className="text-[#b0b0b0] text-sm mt-2">
            Inicia sesión para ver los detalles y confirmar tu asistencia.
          </p>
          <Link
            href={`/?redirect=/invite/${token}`}
            className="mt-6 block py-2.5 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  // Accepted
  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-[#1f242e] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-[#2a2f38] border border-[#3a4048] rounded-2xl p-8 text-center">
          <span className="text-5xl">🎉</span>
          <h1 className="text-xl font-bold text-white mt-4">¡Confirmado!</h1>
          <p className="text-[#b0b0b0] text-sm mt-2">Tu asistencia ha sido registrada.</p>
          <div className="flex flex-col gap-2 mt-6">
            {eventId && (
              <Link
                href={`/dashboard/asaderos/${eventId}`}
                className="py-2.5 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Ver el asadero
              </Link>
            )}
            <Link
              href="/dashboard/asaderos"
              className="py-2.5 rounded-lg border border-[#3a4048] text-[#b0b0b0] text-sm hover:border-[#77f8c0] hover:text-[#77f8c0] transition-colors"
            >
              Mis asaderos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Declined
  if (status === 'declined') {
    return (
      <div className="min-h-screen bg-[#1f242e] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-[#2a2f38] border border-[#3a4048] rounded-2xl p-8 text-center">
          <span className="text-5xl">👋</span>
          <h1 className="text-xl font-bold text-white mt-4">Invitación rechazada</h1>
          <p className="text-[#b0b0b0] text-sm mt-2">Has rechazado esta invitación.</p>
          <Link
            href="/dashboard/asaderos"
            className="mt-6 block py-2.5 rounded-lg border border-[#3a4048] text-[#b0b0b0] text-sm hover:border-[#77f8c0] hover:text-[#77f8c0] transition-colors"
          >
            Mis asaderos
          </Link>
        </div>
      </div>
    )
  }

  // Main invite screen (authenticated, idle or error)
  const busy = status === 'accepting' || status === 'declining'

  return (
    <div className="min-h-screen bg-[#1f242e] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#2a2f38] border border-[#3a4048] rounded-2xl p-8">
        <div className="text-center mb-6">
          <span className="text-5xl">🥩</span>
          <h1 className="text-xl font-bold text-white mt-4">Invitación a un asadero</h1>
          <p className="text-[#b0b0b0] text-sm mt-2">
            Alguien te ha invitado. ¿Confirmas tu asistencia?
          </p>
        </div>

        {/* user info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1f242e] border border-[#3a4048] mb-6">
          <div className="w-8 h-8 rounded-full bg-[#3a4048] flex items-center justify-center text-sm font-semibold text-[#77f8c0]">
            {(authUser.displayName || authUser.email || '?')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{authUser.displayName || 'Usuario'}</p>
            <p className="text-[#b0b0b0] text-xs truncate">{authUser.email}</p>
          </div>
        </div>

        {status === 'error' && message && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={busy}
            className="py-3 rounded-xl bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {status === 'accepting' ? 'Confirmando...' : '✅ Confirmar asistencia'}
          </button>
          <button
            onClick={handleDecline}
            disabled={busy}
            className="py-3 rounded-xl border border-[#3a4048] text-[#b0b0b0] text-sm hover:border-red-400/50 hover:text-red-400 disabled:opacity-50 transition-colors"
          >
            {status === 'declining' ? 'Rechazando...' : '✕ Rechazar invitación'}
          </button>
        </div>

        <p className="text-center text-xs text-[#505050] mt-6">
          ¿No esperabas esta invitación?{' '}
          <Link href="/dashboard" className="text-[#b0b0b0] hover:text-white">
            Ir al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
