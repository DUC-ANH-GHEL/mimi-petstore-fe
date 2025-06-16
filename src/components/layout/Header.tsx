import React, { useState, useRef } from 'react';
import { Bell, Moon, Sun, ChevronDown, LogOut, KeyRound } from 'lucide-react';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { logo_url } from '../../config/api';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
}

const Header = ({ darkMode, toggleDarkMode, sidebarOpen }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cart, removeFromCart, clearCart } = useCart();

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const total = cart.reduce((sum, p) => {
    // Lấy số từ chuỗi giá, loại bỏ ký tự không phải số
    const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
    return sum + priceNum * p.quantity;
  }, 0);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 shadow z-30 transition-all"
      style={{ marginLeft: sidebarOpen ? 256 : 80 }} // 256 = w-64, 80 = w-20
    >
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo_url} alt="Logo" className="h-8 w-8 rounded-full shadow" />
          {/* <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">AdminShop</h1> */}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Bell size={22} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-500" />}
          </button>
          <div className="relative" ref={avatarRef}>
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <img
                src={logo_url}
                alt="Admin avatar"
                className="h-8 w-8 rounded-full border-2 border-blue-400 shadow"
              />
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Admin</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm">
                  <KeyRound size={16} /> Đổi mật khẩu
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm">
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;