'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEvents } from '../../../lib/events/useEvents.js'
import { deleteEvent } from '../../../lib/events/event_service.js'
import EventCard from '../../components/events/EventCard.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

export default function MisAsaderosPage() {
  const router = useRouter()
  const { events, loading, error, refetch } = useEvents()

  async function handleDelete(eventId) {
    try {
      await deleteEvent(eventId)
      refetch()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar el asadero')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Asaderos</h1>
          <p className="text-[#b0b0b0] text-sm mt-0.5">Eventos que organizas o en los que participas</p>
        </div>
        <Link
          href="/dashboard/asaderos/crear"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          + Crear asadero
        </Link>
      </div>

      {/* content */}
      {loading && <LoadingSpinner message="Cargando asaderos..." />}

      {!loading && error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <EmptyState
          icon="🥩"
          title="No tienes asaderos todavía"
          description="Crea el primero e invita a tu gente."
          action={
            <Link
              href="/dashboard/asaderos/crear"
              className="px-4 py-2 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Crear asadero
            </Link>
          }
        />
      )}

      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
