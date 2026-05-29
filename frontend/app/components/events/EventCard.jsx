'use client'
import Link from 'next/link'
import Badge from '../ui/Badge.jsx'

const formatDate = (d) =>
  new Date(d).toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export default function EventCard({ event, onDelete }) {
  const isCreator = event.myRole === 'creator'
  const isOrganizer = isCreator || event.myRole === 'co_host'

  async function handleDelete(e) {
    e.preventDefault()
    if (!confirm(`¿Eliminar "${event.nombre}"? Esta acción no se puede deshacer.`)) return
    await onDelete(event.id)
  }

  return (
    <div className="bg-[#2a2f38] border border-[#3a4048] rounded-xl p-5 flex flex-col gap-4 hover:border-[#77f8c0]/30 transition-colors">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">{event.nombre}</h3>
          {event.descripcion && (
            <p className="text-[#b0b0b0] text-sm mt-0.5 line-clamp-2">{event.descripcion}</p>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <Badge value={event.estado} />
        </div>
      </div>

      {/* meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
          <span>📅</span>
          <span>{formatDate(event.fechaHora)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
          <span>📍</span>
          <span className="truncate">{event.lugar}</span>
        </div>
        {event.confirmedCount !== undefined && (
          <div className="flex items-center gap-2 text-sm text-[#b0b0b0]">
            <span>👥</span>
            <span>
              {event.confirmedCount} confirmado{event.confirmedCount !== 1 ? 's' : ''}
              {event.capacidadMaxima ? ` / ${event.capacidadMaxima}` : ''}
            </span>
          </div>
        )}
      </div>

      {/* badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge value={event.privacidad} />
        {event.myRole && <Badge value={event.myRole} />}
      </div>

      {/* actions */}
      <div className="flex gap-2 pt-1 border-t border-[#3a4048] flex-wrap">
        <Link
          href={`/dashboard/asaderos/${event.id}`}
          className="flex-1 text-center px-3 py-1.5 rounded-lg bg-[#77f8c0] text-[#1f242e] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Ver detalle
        </Link>
        {isOrganizer && (
          <Link
            href={`/dashboard/asaderos/${event.id}?edit=1`}
            className="px-3 py-1.5 rounded-lg border border-[#3a4048] text-[#b0b0b0] text-sm hover:border-[#77f8c0] hover:text-[#77f8c0] transition-colors"
          >
            Editar
          </Link>
        )}
        {isCreator && onDelete && (
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg border border-red-600/40 text-red-400 text-sm hover:bg-red-600/10 transition-colors"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}
