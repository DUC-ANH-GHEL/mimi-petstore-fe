import { Link } from 'react-router-dom'

const Header = () => (
  <header className="p-4 shadow flex justify-between items-center bg-white">
    <Link to="/" className="text-xl font-bold">Hydraulic Store</Link>
    <nav className="flex gap-4">
      <Link to="/products">Sản phẩm</Link>
      <Link to="/contact">Liên hệ</Link>
    </nav>
  </header>
)

export default Header