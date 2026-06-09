'use client'
import FriendCard from './FriendCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function FriendList({ friends, myId, onRemove, onBlock }) {
  if (friends.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="Aún no tienes amigos"
        description="Añade personas desde los asaderos en los que participas."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {friends.map(f => (
        <FriendCard key={f.id} friendship={f} myId={myId} onRemove={onRemove} onBlock={onBlock} />
      ))}
    </div>
  )
}
