'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  getEventParticipants,
  updateParticipantStatus,
  removeParticipant,
} from './participant_service.js'

export function useParticipants(eventId) {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!eventId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getEventParticipants(eventId)
      setParticipants(data.participants || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar los participantes')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(userId, updateData) {
    await updateParticipantStatus(eventId, userId, updateData)
    await fetchData()
  }

  async function remove(userId) {
    await removeParticipant(eventId, userId)
    await fetchData()
  }

  return { participants, loading, error, refetch: fetchData, updateStatus, remove }
}
