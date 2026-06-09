import api from '../api.js'

export async function sendFriendRequest(addresseeId) {
  const res = await api.post('/api/friends/request', { addresseeId })
  return res.data
}

export async function getMyFriends() {
  const res = await api.get('/api/friends')
  return res.data
}

export async function getPendingRequests() {
  const res = await api.get('/api/friends/pending')
  return res.data
}

export async function getPendingSent() {
  const res = await api.get('/api/friends/pending/sent')
  return res.data
}

export async function acceptFriendRequest(friendId) {
  const res = await api.patch(`/api/friends/${friendId}/accept`)
  return res.data
}

export async function declineFriendRequest(friendId) {
  const res = await api.patch(`/api/friends/${friendId}/decline`)
  return res.data
}

export async function removeFriend(friendId) {
  const res = await api.delete(`/api/friends/${friendId}`)
  return res.data
}

export async function blockUser(addresseeId) {
  const res = await api.post('/api/friends/block', { addresseeId })
  return res.data
}
