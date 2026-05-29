'use client'
import { use, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '../../../../lib/user/UserContext.jsx'
import { useEventDetail } from '../../../../lib/events/useEventDetail.js'
import { useParticipants } from '../../../../lib/events/useParticipants.js'
import { useInvitations } from '../../../../lib/events/useInvitations.js'
import EventForm from '../../../components/events/EventForm.jsx'
import ParticipantList from '../../../components/participants/ParticipantList.jsx'
import InvitePanel from '../../../components/invitations/InvitePanel.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import LoadingSpinner from '../../../components/ui/LoadingSpinner.jsx'

const formatDate = (d) =>
  new Date(d).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export default function EventDetailPage({ params }) {
  const { eventId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()

  const [editMode, setEditMode] = useState(searchParams.get('edit') === '1')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('participants')

  const { event, loading, error, refetch, update, remove } = useEventDetail(eventId)
  const {
    participants, loading: pLoading, error: pError, refetch: pRefetch,
    updateStatus, remove: removeParticipant,
  } = useParticipants(eventId)
  const {
    invitations, loading: iLoading, error: iError,
    inviteUser, inviteByEmail, createLink, revoke,
  } = useInvitations(eventId)

  const myParticipation = participants.find(p => p.user?.id === user?.id)
  const isOrganizer = ['creator', 'co_host'].includes(myParticipation?.role)
  const isCreator = myParticipation?.role === 'creator'

  async function handleUpdate(data) {
    setUpdateLoading(true)
    try {
      await update(data)
      setEditMode(false)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el asadero')
    } finally {
      setUpdateLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${event?.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await remove()
      router.push('/dashboard/asaderos')
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar el asadero')
    }
  }

  if (loading) return (
    <div className="p-6">
      <LoadingSpinner message="Cargando asadero..." />
    </div>
  )

  if (error) return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/dashboard/asaderos" className="text-sm text-[#b0b0b0] hover:text-[#77f8c0]">← Volver</Link>
      <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
    </div>
  )

  if (!event) return null

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* breadcrumb */}
      <Link href="/dashboard/asaderos" className="text-sm text-[#b0b0b0] hover:text-[#77f8c0] transition-colors">
        ← Mis asaderos
      </Link>

      {/* event header */}
      <div className="mt-4 bg-[#2a2f38] border border-[#3a4048] rounded-xl overflow-hidden">
        {event.imagen && (
          <img src={event.imagen} alt={event.nombre} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          {editMode ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Editar asadero</h2>
                <button onClick={() => setEditMode(false)} className="text-[#b0b0b0] hover:text-white text-sm">
                  Cancelar
                </button>
              </div>
              <EventForm
                initial={event}
                onSubmit={handleUpdate}
                loading={updateLoading}
                submitLabel="Guardar cambios"
              />
            </>
          ) : (
            <>
              {/* title + badges */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white">{event.nombre}</h1>
                  {event.descripcion && (
                    <p className="text-[#b0b0b0] mt-1">{event.descripcion}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge value={event.estado} />
                  <Badge value={event.privacidad} />
                  {myParticipation && <Badge value={myParticipation.role} />}
                </div>
              </div>

              {/* meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
                  <span>📅</span>
                  <span>{formatDate(event.fechaHora)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
                  <span>📍</span>
                  <span>{event.lugar}{event.direccion ? ` · ${event.direccion}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
                  <span>👥</span>
                  <span>
                    {event.confirmedCount ?? 0} confirmado{event.confirmedCount !== 1 ? 's' : ''}
                    {event.capacidadMaxima ? ` / ${event.capacidadMaxima} plazas` : ''}
                  </span>
                </div>
                {event.creator && (
                  <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
                    <span>🎯</span>
                    <span>Organiza {event.creator.name || event.creator.email}</span>
                  </div>
                )}
              </div>

              {/* organizer actions */}
              {isOrganizer && (
                <div className="flex gap-2 mt-5 pt-4 border-t border-[#3a4048] flex-wrap">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-lg border border-[#3a4048] text-[#b0b0b0] text-sm hover:border-[#77f8c0] hover:text-[#77f8c0] transition-colors"
                  >
                    Editar
                  </button>
                  {isCreator && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 rounded-lg border border-red-600/40 text-red-400 text-sm hover:bg-red-600/10 transition-colors"
                    >
                      Eliminar asadero
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* section tabs */}
      <div className="flex gap-1 mt-6 bg-[#2a2f38] border border-[#3a4048] rounded-xl p-1">
        <button
          onClick={() => setActiveSection('participants')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSection === 'participants'
              ? 'bg-[#77f8c0] text-[#1f242e]'
              : 'text-[#b0b0b0] hover:text-white'
          }`}
        >
          👥 Participantes ({participants.length})
        </button>
        {isOrganizer && (
          <button
            onClick={() => setActiveSection('invitations')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'invitations'
                ? 'bg-[#77f8c0] text-[#1f242e]'
                : 'text-[#b0b0b0] hover:text-white'
            }`}
          >
            ✉️ Invitaciones ({invitations.length})
          </button>
        )}
      </div>

      {/* sections */}
      <div className="mt-4">
        {activeSection === 'participants' && (
          <div className="bg-[#2a2f38] border border-[#3a4048] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Participantes</h2>
            <ParticipantList
              participants={participants}
              loading={pLoading}
              error={pError}
              isOrganizer={isOrganizer}
              currentUserId={user?.id}
              onUpdateStatus={updateStatus}
              onRemove={removeParticipant}
            />
          </div>
        )}

        {activeSection === 'invitations' && isOrganizer && (
          <InvitePanel
            eventId={eventId}
            invitations={invitations}
            loadingInvitations={iLoading}
            errorInvitations={iError}
            onInviteUser={inviteUser}
            onInviteByEmail={inviteByEmail}
            onCreateLink={createLink}
            onRevoke={revoke}
          />
        )}
      </div>
    </div>
  )
}
