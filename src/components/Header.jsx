import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaTrash, FaPhoneAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { HiMenu, HiX } from 'react-icons/hi';

const IMAGE_DEFAULT_URL = 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg';

const Header = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const total = cart.reduce((sum, p) => {
    const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
    return sum + priceNum * p.quantity;
  }, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      {/* Top bar with contact info */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:0966201140" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <FaPhoneAlt className="text-blue-300" />
              <span>Hotline: 0966 201 140</span>
            </a>
            {/* <a href="mailto:kythuatmayktm@gmail.com" className="hover:text-blue-200 transition-colors">
              Email: kythuatmayktm@gmail.com
            </a> */}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-blue-200 transition-colors">Giới thiệu</Link>
            <Link to="/contact" className="hover:text-blue-200 transition-colors">Liên hệ</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={IMAGE_DEFAULT_URL} 
                alt="MiMi PetStore Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900">MiMi PetStore</h1>
              <p className="text-sm text-gray-600">Kỹ thuật, Phụ tùng máy cơ giới</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Trang chủ</Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Sản phẩm</Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Dịch vụ</Link>
            <Link to="/news" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Tin tức</Link>
          </nav>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 transition"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Mở menu"
          >
            <HiMenu size={28} />
          </button>

          {/* Cart */}
          <div className="relative" ref={cartRef}>
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setCartOpen((v) => !v)}
              aria-label="Giỏ hàng"
            >
              <FaShoppingCart size={24} className="text-blue-600 cart-fly-target" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border-2 border-white">
                  {cart.reduce((sum, p) => sum + p.quantity, 0)}
                </span>
              )}
            </button>
            {cartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 animate-fadeIn">
                <div className="px-4 py-2 font-bold text-lg text-blue-700 border-b border-gray-100">Giỏ hàng</div>
                {cart.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500">Chưa có sản phẩm nào</div>
                ) : (
                  <>
                    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                      {cart.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 px-4 py-2">
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover border" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">{item.title}</div>
                            <div className="text-xs text-gray-500">SL: {item.quantity} x {item.price}</div>
                          </div>
                          <button className="text-red-500 hover:text-red-700 p-1" onClick={() => removeFromCart(item.title)} title="Xóa">
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Tổng:</span>
                      <span className="font-bold text-lg text-orange-500">{total.toLocaleString()} đ</span>
                    </div>
                    <div className="px-4 pb-2 flex gap-2">
                      <button
                        className="flex-1 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                        onClick={() => { setCartOpen(false); navigate('/checkout'); }}
                      >
                        Thanh toán
                      </button>
                      <button className="py-2 px-3 rounded bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition" onClick={clearCart}>Xóa hết</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col">
            <button
              className="self-end mb-6 p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Đóng menu"
            >
              <HiX size={28} />
            </button>
            <nav className="flex flex-col gap-4 text-lg font-medium">
              <Link to="/" onClick={() => setMobileNavOpen(false)} className="hover:text-blue-600">Trang chủ</Link>
              <Link to="/products" onClick={() => setMobileNavOpen(false)} className="hover:text-blue-600">Sản phẩm</Link>
              <Link to="/services" onClick={() => setMobileNavOpen(false)} className="hover:text-blue-600">Dịch vụ</Link>
              <Link to="/news" onClick={() => setMobileNavOpen(false)} className="hover:text-blue-600">Tin tức</Link>
              <Link to="/about" onClick={() => setMobileNavOpen(false)} className="hover:text-blue-600">Giới thiệu</Link>
              <Link to="/contact" onClick={() => setMobileNavOpen(false)} className="hover:text-blue-600">Liên hệ</Link>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;