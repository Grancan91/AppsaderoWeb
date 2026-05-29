import api from '../api.js'

export async function createEvent(data) {
  const res = await api.post('/api/events', data)
  return res.data
}

export async function getMyEvents() {
  const res = await api.get('/api/events/my')
  return res.data
}

export async function getEventById(eventId) {
  const res = await api.get(`/api/events/${eventId}`)
  return res.data
}

export async function updateEvent(eventId, data) {
  const res = await api.patch(`/api/events/${eventId}`, data)
  return res.data
}

export async function deleteEvent(eventId) {
  const res = await api.delete(`/api/events/${eventId}`)
  return res.data
}
