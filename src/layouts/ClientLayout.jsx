import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => (
  <>
    <Header />
    <main className="min-h-screen p-4"><Outlet /></main>
    <Footer />
  </>
)

export default ClientLayout