import { Dashboard } from './pages/Dashboard'
import { ToastProvider } from './components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  )
}
