'use client'
import { useState, useEffect, useCallback } from 'react'
import { getMyEvents } from './event_service.js'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyEvents()
      setEvents(data.events || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar los asaderos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return { events, loading, error, refetch: fetchData }
}
