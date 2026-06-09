'use client'
import { useState, useEffect, useCallback } from 'react'
import * as svc from './friend_service.js'

export function useFriends() {
  const [friends, setFriends] = useState([])
  const [pendingReceived, setPendingReceived] = useState([])
  const [pendingSent, setPendingSent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [f, pr, ps] = await Promise.all([
        svc.getMyFriends(),
        svc.getPendingRequests(),
        svc.getPendingSent(),
      ])
      setFriends(f.friends || [])
      setPendingReceived(pr.requests || [])
      setPendingSent(ps.sent || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar amigos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Todos los registros de amistad para lookup rápido
  const allFriendships = [...friends, ...pendingReceived, ...pendingSent]

  function findFriendshipWith(userId) {
    return allFriendships.find(f =>
      f.requesterId === userId || f.addresseeId === userId
    ) || null
  }

  async function sendRequest(addresseeId) {
    const result = await svc.sendFriendRequest(addresseeId)
    await fetchAll()
    return result
  }

  async function accept(friendId) {
    await svc.acceptFriendRequest(friendId)
    await fetchAll()
  }

  async function decline(friendId) {
    await svc.declineFriendRequest(friendId)
    await fetchAll()
  }

  async function remove(friendId) {
    await svc.removeFriend(friendId)
    await fetchAll()
  }

  async function block(addresseeId) {
    await svc.blockUser(addresseeId)
    await fetchAll()
  }

  return {
    friends, pendingReceived, pendingSent, allFriendships,
    loading, error, refetch: fetchAll,
    findFriendshipWith, sendRequest, accept, decline, remove, block,
  }
}
