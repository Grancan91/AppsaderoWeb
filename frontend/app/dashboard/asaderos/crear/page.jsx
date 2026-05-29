'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EventForm from '../../../components/events/EventForm.jsx'
import { createEvent } from '../../../../lib/events/event_service.js'

export default function CrearAsaderoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    setLoading(true)
    try {
      const result = await createEvent(data)
      router.push(`/dashboard/asaderos/${result.event.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/asaderos"
          className="text-sm text-[#b0b0b0] hover:text-[#77f8c0] transition-colors"
        >
          ← Volver a mis asaderos
        </Link>
        <h1 className="text-2xl font-bold text-white mt-3">Crear asadero</h1>
        <p className="text-[#b0b0b0] text-sm mt-0.5">Completa los detalles de tu evento</p>
      </div>

      <div className="bg-[#2a2f38] border border-[#3a4048] rounded-xl p-6">
        <EventForm onSubmit={handleSubmit} loading={loading} submitLabel="Crear asadero" />
      </div>
    </div>
  )
}
