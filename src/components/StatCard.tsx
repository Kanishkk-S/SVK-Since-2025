import { ReactNode } from 'react'

export function formatRupees(amount: number) {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  onClick,
  tone = 'default',
  size = 'md',
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: string
  onClick?: () => void
  tone?: 'default' | 'accent'
  size?: 'md' | 'lg'
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`group w-full rounded-card border border-line bg-white p-6 text-left shadow-card transition
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0' : ''}`}
    >
      <div className="flex items-center gap-2 text-ink/55">
        <span className="text-lg leading-none">{icon}</span>
        <span className="text-sm font-medium tracking-tight">{label}</span>
      </div>
      <div
        className={`mt-3 font-display font-medium tabular-nums
          ${size === 'lg' ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}
          ${tone === 'accent' ? 'text-turmeric-600' : 'text-ink'}`}
      >
        {value}
      </div>
      {hint && <div className="mt-2 text-sm text-ink/45">{hint}</div>}
    </Comp>
  )
}