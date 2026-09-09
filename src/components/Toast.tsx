import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react'

type ToastKind = 'success' | 'error'
type ToastItem = { id: number; message: string; kind: ToastKind }

const ToastContext = createContext<{
  show: (message: string, kind?: ToastKind) => void
} | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const show = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++counter.current
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-none w-full max-w-sm rounded-chip px-4 py-2.5 text-center text-sm font-medium shadow-pop
              ${t.kind === 'success' ? 'bg-pine-700 text-paper' : 'bg-[#8C3B2B] text-paper'}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
