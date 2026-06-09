'use client'
import { useState } from 'react'
import InviteEmailForm from './InviteEmailForm.jsx'
import InviteUserForm from './InviteUserForm.jsx'
import InviteLinkCard from './InviteLinkCard.jsx'
import InvitationList from './InvitationList.jsx'

// friends: array de registros Friend aceptados, myId: UUID del usuario actual
function getFriendUser(friendship, myId) {
  return friendship.requesterId === myId
    ? friendship.addressee
    : friendship.requester
}

const BASE_TABS = [
  //{ key: 'email', label: '✉️ Email' },
  // { key: 'user', label: '👤 Por ID' },
  { key: 'link', label: '🔗 Enlace' },
]

export default function InvitePanel({
  eventId,
  invitations,
  loadingInvitations,
  errorInvitations,
  onInviteUser,
  onInviteByEmail,
  onCreateLink,
  onRevoke,
  // props de amigos (opcionales)
  friends = [],
  myId,
}) {
  const hasFriends = friends.length > 0
  const TABS = hasFriends
    ? [{ key: 'friends', label: '👥 Amigos' }, ...BASE_TABS]
    : BASE_TABS

  const [activeTab, setActiveTab] = useState(hasFriends ? 'friends' : 'email')
  const [invitingId, setInvitingId] = useState(null)
  const [inviteFeedback, setInviteFeedback] = useState({})

  async function handleInviteFriend(userId) {
    setInvitingId(userId)
    setInviteFeedback((prev) => ({ ...prev, [userId]: null }))
    try {
      await onInviteUser({ userId })
      setInviteFeedback((prev) => ({ ...prev, [userId]: 'ok' }))
    } catch (err) {
      setInviteFeedback((prev) => ({
        ...prev,
        [userId]: err.response?.data?.error || 'Error al invitar',
      }))
    } finally {
      setInvitingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* formulario de invitación */}
      <div className="bg-[#2a2f38] border border-[#3a4048] rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Invitar personas</h3>

        {/* tabs */}
        <div className="flex gap-1 my-5 bg-[#1f242e] rounded-lg p-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max py-1.5 px-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#77f8c0] text-[#1f242e]'
                  : 'text-[#b0b0b0] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* tab: amigos */}
        {activeTab === 'friends' && (
          <div className="flex flex-col gap-2">
            {friends.map((friendship) => {
              const friendUser = getFriendUser(friendship, myId)
              if (!friendUser) return null
              const feedback = inviteFeedback[friendUser.id]
              const busy = invitingId === friendUser.id

              return (
                <div
                  key={friendship.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#1f242e] border border-[#3a4048]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3a4048] flex items-center justify-center text-sm font-semibold text-[#77f8c0] shrink-0">
                    {(friendUser.name ||
                      friendUser.email ||
                      '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {friendUser.name || 'Sin nombre'}
                    </p>
                    <p className="text-[#b0b0b0] text-xs truncate">
                      {friendUser.email}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {feedback === 'ok' ? (
                      <span className="text-xs text-green-400">✓ Invitado</span>
                    ) : feedback ? (
                      <span className="text-xs text-red-400" title={feedback}>
                        Error
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInviteFriend(friendUser.id)}
                        disabled={busy}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#77f8c0] text-[#1f242e] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {busy ? '...' : 'Invitar'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'email' && (
          <InviteEmailForm onInvite={onInviteByEmail} />
        )}
        {activeTab === 'user' && <InviteUserForm onInvite={onInviteUser} />}
        {activeTab === 'link' && <InviteLinkCard onCreateLink={onCreateLink} />}
      </div>

      {/* lista de invitaciones enviadas */}
      <div className="bg-[#2a2f38] border border-[#3a4048] rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Invitaciones enviadas</h3>
        <InvitationList
          invitations={invitations}
          loading={loadingInvitations}
          error={errorInvitations}
          onRevoke={onRevoke}
        />
      </div>
    </div>
  )
}
