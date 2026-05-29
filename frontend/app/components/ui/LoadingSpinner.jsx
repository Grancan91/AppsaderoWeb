export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#b0b0b0]">
      <div className="w-8 h-8 border-2 border-[#3a4048] border-t-[#77f8c0] rounded-full animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  )
}
