'use client'
import { useState } from 'react'

const FIELDS_DEFAULT = {
  nombre: '', descripcion: '', lugar: '', direccion: '',
  fechaHora: '', imagen: '', capacidadMaxima: '',
  privacidad: 'public', estado: 'draft',
}

function toDatetimeLocal(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventForm({ initial = {}, onSubmit, submitLabel = 'Crear asadero', loading = false }) {
  const [form, setForm] = useState({
    ...FIELDS_DEFAULT,
    ...initial,
    fechaHora: toDatetimeLocal(initial.fechaHora),
  })
  const [error, setError] = useState(null)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.nombre.trim()) return setError('El nombre es requerido')
    if (!form.lugar.trim()) return setError('El lugar es requerido')
    if (!form.fechaHora) return setError('La fecha y hora son requeridas')

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      lugar: form.lugar.trim(),
      direccion: form.direccion.trim() || undefined,
      fechaHora: new Date(form.fechaHora).toISOString(),
      imagen: form.imagen.trim() || undefined,
      capacidadMaxima: form.capacidadMaxima ? Number(form.capacidadMaxima) : undefined,
      privacidad: form.privacidad,
      estado: form.estado,
    }

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el asadero')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm text-[#b0b0b0] mb-1">Nombre *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            placeholder="Asadero del domingo..."
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-[#b0b0b0] mb-1">Descripción</label>
          <textarea
            rows={3}
            value={form.descripcion}
            onChange={e => set('descripcion', e.target.value)}
            placeholder="Detalles del asadero..."
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Lugar *</label>
          <input
            type="text"
            value={form.lugar}
            onChange={e => set('lugar', e.target.value)}
            placeholder="Casa de Juan..."
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Dirección</label>
          <input
            type="text"
            value={form.direccion}
            onChange={e => set('direccion', e.target.value)}
            placeholder="Calle, número..."
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Fecha y hora *</label>
          <input
            type="datetime-local"
            value={form.fechaHora}
            onChange={e => set('fechaHora', e.target.value)}
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Capacidad máxima</label>
          <input
            type="number"
            min="1"
            value={form.capacidadMaxima}
            onChange={e => set('capacidadMaxima', e.target.value)}
            placeholder="Sin límite"
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Privacidad</label>
          <select
            value={form.privacidad}
            onChange={e => set('privacidad', e.target.value)}
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white focus:outline-none focus:border-[#77f8c0] text-sm"
          >
            <option value="public">Público</option>
            <option value="private">Privado</option>
            <option value="invite_only">Solo invitados</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-[#b0b0b0] mb-1">Estado</label>
          <select
            value={form.estado}
            onChange={e => set('estado', e.target.value)}
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white focus:outline-none focus:border-[#77f8c0] text-sm"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="cancelled">Cancelado</option>
            <option value="finished">Finalizado</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-[#b0b0b0] mb-1">Imagen (URL)</label>
          <input
            type="url"
            value={form.imagen}
            onChange={e => set('imagen', e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-[#1f242e] border border-[#3a4048] rounded-lg text-white placeholder-[#505050] focus:outline-none focus:border-[#77f8c0] text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
