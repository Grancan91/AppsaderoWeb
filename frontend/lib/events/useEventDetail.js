'use client'
import { useState, useEffect, useCallback } from 'react'
import { getEventById, updateEvent, deleteEvent } from './event_service.js'

export function useEventDetail(eventId) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!eventId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getEventById(eventId)
      setEvent(data.event)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar el evento')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => { fetchData() }, [fetchData])

  async function update(data) {
    const result = await updateEvent(eventId, data)
    setEvent(result.event)
    return result
  }

  async function remove() {
    await deleteEvent(eventId)
  }

  return { event, loading, error, refetch: fetchData, update, remove }
}
