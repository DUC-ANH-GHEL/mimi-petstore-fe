import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ClientLayout = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => setDarkMode(Boolean(media.matches))
    apply()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }

    // Safari fallback
    media.addListener(apply)
    return () => media.removeListener(apply)
  }, [])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header />
      <main className="min-h-screen p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default ClientLayout