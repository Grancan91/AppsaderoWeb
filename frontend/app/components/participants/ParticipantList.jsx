'use client'
import ParticipantCard from './ParticipantCard.jsx'
import LoadingSpinner from '../ui/LoadingSpinner.jsx'
import EmptyState from '../ui/EmptyState.jsx'

const STATUS_ORDER = { creator: 0, co_host: 1, confirmed: 2, invited: 3, pending_payment: 4, declined: 5, removed: 6 }

export default function ParticipantList({
  participants, loading, error, isOrganizer, currentUserId,
  onUpdateStatus, onRemove,
  // props opcionales de amistad
  findFriendshipWith, onSendFriendRequest, onAcceptFriendRequest,
  onDeclineFriendRequest, onRemoveFriend,
}) {
  if (loading) return <LoadingSpinner message="Cargando participantes..." />

  if (error) return (
    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      {error}
    </div>
  )

  const sorted = [...participants].sort((a, b) => {
    const ra = STATUS_ORDER[a.role] ?? 9
    const rb = STATUS_ORDER[b.role] ?? 9
    return ra !== rb ? ra - rb : (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
  })

  if (sorted.length === 0) return (
    <EmptyState icon="👥" title="Sin participantes aún" description="Las personas que invites aparecerán aquí." />
  )

  const confirmed = sorted.filter(p => p.status === 'confirmed').length

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#b0b0b0]">
        {confirmed} confirmado{confirmed !== 1 ? 's' : ''} · {sorted.length} total
      </p>
      {sorted.map(p => (
        <ParticipantCard
          key={p.id}
          participant={p}
          isOrganizer={isOrganizer}
          currentUserId={currentUserId}
          onUpdateStatus={onUpdateStatus}
          onRemove={onRemove}
          friendship={findFriendshipWith ? findFriendshipWith(p.user?.id) : null}
          onSendFriendRequest={onSendFriendRequest}
          onAcceptFriendRequest={onAcceptFriendRequest}
          onDeclineFriendRequest={onDeclineFriendRequest}
          onRemoveFriend={onRemoveFriend}
        />
      ))}
    </div>
  )
}
