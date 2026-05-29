export default function EmptyState({ icon = '🔍', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-white font-medium">{title}</p>
      {description && <p className="text-sm text-[#b0b0b0] max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
