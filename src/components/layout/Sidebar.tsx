import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, X, Menu, LogOut, Plus, Tag } from 'lucide-react';
import { logo_url } from '../../config/api';
import { logout } from '../../services/authService';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const IMAGE_DEFAULT_URL = 'https://res.cloudinary.com/diwxfpt92/image/upload/v1770981822/logo_d2wmlf.png';

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const flyoutRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, url: "/admin" },
    { name: 'Sản phẩm', icon: <Package size={20} />, url: "/admin/products" },
    { name: 'Tạo sản phẩm', icon: <Plus size={20} />, url: "/admin/products/create" },
    { name: 'Tạo danh mục', icon: <Tag size={20} />, url: "/admin/categories/create" },
    { name: 'Đơn hàng', icon: <ShoppingCart size={20} />, url: "/admin/order" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 flex flex-col`}
      ref={flyoutRef}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <img src={logo_url} alt="Logo" className="h-8 w-8 rounded-full ring-1 ring-gray-200 dark:ring-gray-800" />
            <div className="leading-tight">
              <div className="font-semibold tracking-wide">MiMi Petwear</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
            </div>
          </div>
        ) : (
          <img src={logo_url} alt="Logo" className="h-8 w-8 rounded-full ring-1 ring-gray-200 dark:ring-gray-800 mx-auto" />
        )}
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle sidebar">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            title={!sidebarOpen ? item.name : undefined}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                sidebarOpen ? '' : 'justify-center',
                isActive
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
              ].join(' ')
            }
            end={item.url === '/admin'}
          >
            {item.icon}
            {sidebarOpen && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      {/* Bottom: Đăng xuất */}
      <div className="px-2 pb-4 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            sidebarOpen ? '' : 'justify-center'
          }`}
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
