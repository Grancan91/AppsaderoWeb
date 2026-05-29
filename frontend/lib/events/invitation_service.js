import api from '../api.js'

export async function inviteUser(eventId, data) {
  const res = await api.post(`/api/events/${eventId}/invitations/user`, data)
  return res.data
}

export async function inviteByEmail(eventId, data) {
  const res = await api.post(`/api/events/${eventId}/invitations/email`, data)
  return res.data
}

export async function createInviteLink(eventId, data = {}) {
  const res = await api.post(`/api/events/${eventId}/invitations/link`, data)
  return res.data
}

export async function getEventInvitations(eventId) {
  const res = await api.get(`/api/events/${eventId}/invitations`)
  return res.data
}

export async function acceptInvitation(token) {
  const res = await api.post(`/api/invitations/${token}/accept`)
  return res.data
}

export async function declineInvitation(token) {
  const res = await api.post(`/api/invitations/${token}/decline`)
  return res.data
}

export async function revokeInvitation(eventId, invitationId) {
  const res = await api.delete(`/api/events/${eventId}/invitations/${invitationId}`)
  return res.data
}
