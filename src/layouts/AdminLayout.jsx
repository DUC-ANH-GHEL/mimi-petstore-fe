import { Link, Outlet } from 'react-router-dom'

const AdminLayout = () => (
  <div className="flex">
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Admin</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
      </nav>
    </aside>
    <main className="flex-1 p-6 bg-gray-50">
      <Outlet />
    </main>
  </div>
)

export default AdminLayout