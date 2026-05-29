'use client'
import { useState } from 'react'
import InviteEmailForm from './InviteEmailForm.jsx'
import InviteUserForm from './InviteUserForm.jsx'
import InviteLinkCard from './InviteLinkCard.jsx'
import InvitationList from './InvitationList.jsx'

const TABS = [
  { key: 'email', label: '✉️ Por email' },
  { key: 'user', label: '👤 Por ID' },
  { key: 'link', label: '🔗 Enlace' },
]

export default function InvitePanel({ eventId, invitations, loadingInvitations, errorInvitations, onInviteUser, onInviteByEmail, onCreateLink, onRevoke }) {
  const [activeTab, setActiveTab] = useState('email')

  return (
    <div className="flex flex-col gap-6">
      {/* invite form */}
      <div className="bg-[#2a2f38] border border-[#3a4048] rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Invitar personas</h3>

        {/* tabs */}
        <div className="flex gap-1 mb-5 bg-[#1f242e] rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#77f8c0] text-[#1f242e]'
                  : 'text-[#b0b0b0] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'email' && <InviteEmailForm onInvite={onInviteByEmail} />}
        {activeTab === 'user' && <InviteUserForm onInvite={onInviteUser} />}
        {activeTab === 'link' && <InviteLinkCard onCreateLink={onCreateLink} />}
      </div>

      {/* invitation list */}
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
