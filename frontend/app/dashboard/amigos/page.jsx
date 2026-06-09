'use client'
import { useUser } from '../../../lib/user/UserContext.jsx'
import { useFriends } from '../../../lib/friends/useFriends.js'
import FriendList from '../../components/friends/FriendList.jsx'
import FriendRequestList from '../../components/friends/FriendRequestList.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'

export default function AmigosPage() {
  const { user } = useUser()
  const {
    friends, pendingReceived, pendingSent,
    loading, error, accept, decline, remove, block,
  } = useFriends()

  if (loading) return <div className="p-6"><LoadingSpinner message="Cargando amigos..." /></div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Amigos</h1>
        <p className="text-[#b0b0b0] text-sm mt-0.5">Tu red de personas para organizar asaderos juntos</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Solicitudes recibidas */}
      {pendingReceived.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider mb-3">
            Solicitudes recibidas · {pendingReceived.length}
          </h2>
          <FriendRequestList requests={pendingReceived} onAccept={accept} onDecline={decline} />
        </section>
      )}

      {/* Amigos aceptados */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider mb-3">
          Amigos · {friends.length}
        </h2>
        <FriendList friends={friends} myId={user?.id} onRemove={remove} onBlock={block} />
      </section>

      {/* Solicitudes enviadas */}
      {pendingSent.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[#b0b0b0] uppercase tracking-wider mb-3">
            Solicitudes enviadas · {pendingSent.length}
          </h2>
          <div className="flex flex-col gap-2">
            {pendingSent.map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1f242e] border border-[#3a4048]">
                <div className="w-9 h-9 rounded-full bg-[#3a4048] flex items-center justify-center text-sm font-semibold text-[#77f8c0] flex-shrink-0">
                  {(f.addressee?.name || f.addressee?.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{f.addressee?.name || 'Sin nombre'}</p>
                  <p className="text-[#b0b0b0] text-xs truncate">{f.addressee?.email}</p>
                </div>
                <span className="text-xs text-[#b0b0b0] border border-[#3a4048] px-2.5 py-1 rounded-lg flex-shrink-0">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
