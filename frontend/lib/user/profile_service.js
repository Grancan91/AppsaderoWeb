import api from '../api'

export const fetchProfile = () =>
  api.get('/api/user/profile').then((r) => r.data)

export const updateProfile = (data) =>
  api.patch('/api/user/profile', data).then((r) => r.data)

export const deleteAccount = () => api.delete('/api/user/account')
