const STYLES = {
  // participant & invitation status
  invited:         'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20',
  pending_payment: 'bg-orange-400/10 text-orange-300 border border-orange-400/20',
  confirmed:       'bg-green-400/10  text-green-300  border border-green-400/20',
  declined:        'bg-red-400/10    text-red-400    border border-red-400/20',
  removed:         'bg-gray-500/10   text-gray-400   border border-gray-500/20',
  pending:         'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20',
  accepted:        'bg-green-400/10  text-green-300  border border-green-400/20',
  expired:         'bg-gray-500/10   text-gray-400   border border-gray-500/20',
  revoked:         'bg-gray-500/10   text-gray-400   border border-gray-500/20',
  // privacidad
  public:          'bg-blue-400/10   text-blue-300   border border-blue-400/20',
  private:         'bg-purple-400/10 text-purple-300 border border-purple-400/20',
  invite_only:     'bg-teal-400/10   text-teal-300   border border-teal-400/20',
  // estado evento
  draft:           'bg-gray-500/10   text-gray-400   border border-gray-500/20',
  published:       'bg-green-400/10  text-green-300  border border-green-400/20',
  cancelled:       'bg-red-400/10    text-red-400    border border-red-400/20',
  finished:        'bg-blue-400/10   text-blue-300   border border-blue-400/20',
  // roles
  creator:         'bg-[#77f8c0]/10  text-[#77f8c0]  border border-[#77f8c0]/20',
  co_host:         'bg-purple-400/10 text-purple-300 border border-purple-400/20',
  guest:           'bg-gray-500/10   text-gray-400   border border-gray-500/20',
  // tipo invitación
  direct_user:     'bg-blue-400/10   text-blue-300   border border-blue-400/20',
  email:           'bg-purple-400/10 text-purple-300 border border-purple-400/20',
  link:            'bg-teal-400/10   text-teal-300   border border-teal-400/20',
}

const LABELS = {
  invited: 'Invitado', pending_payment: 'Pago pendiente', confirmed: 'Confirmado',
  declined: 'Rechazado', removed: 'Eliminado', pending: 'Pendiente',
  accepted: 'Aceptado', expired: 'Expirado', revoked: 'Revocado',
  public: 'Público', private: 'Privado', invite_only: 'Solo invitados',
  draft: 'Borrador', published: 'Publicado', cancelled: 'Cancelado', finished: 'Finalizado',
  creator: 'Creador', co_host: 'Co-anfitrión', guest: 'Invitado',
  direct_user: 'Usuario', email: 'Email', link: 'Enlace',
}

export default function Badge({ value }) {
  const cls = STYLES[value] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {LABELS[value] ?? value}
    </span>
  )
}
