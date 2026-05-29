import api from '../api.js'

export async function getEventParticipants(eventId) {
  const res = await api.get(`/api/events/${eventId}/participants`)
  return res.data
}

export async function updateParticipantStatus(eventId, userId, data) {
  const res = await api.patch(`/api/events/${eventId}/participants/${userId}`, data)
  return res.data
}

export async function removeParticipant(eventId, userId) {
  const res = await api.delete(`/api/events/${eventId}/participants/${userId}`)
  return res.data
}
