'use client'
import { useState, useEffect, useCallback } from 'react'
import * as svc from './invitation_service.js'

export function useInvitations(eventId) {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!eventId) return
    setLoading(true)
    setError(null)
    try {
      const data = await svc.getEventInvitations(eventId)
      setInvitations(data.invitations || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar las invitaciones')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => { fetchData() }, [fetchData])

  async function inviteUser(data) {
    const result = await svc.inviteUser(eventId, data)
    await fetchData()
    return result
  }

  async function inviteByEmail(data) {
    const result = await svc.inviteByEmail(eventId, data)
    await fetchData()
    return result
  }

  async function createLink(data) {
    const result = await svc.createInviteLink(eventId, data)
    await fetchData()
    return result
  }

  async function revoke(invitationId) {
    await svc.revokeInvitation(eventId, invitationId)
    await fetchData()
  }

  return {
    invitations, loading, error, refetch: fetchData,
    inviteUser, inviteByEmail, createLink, revoke,
  }
}
