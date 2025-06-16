import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Users, Tag, MessageSquare, BarChart3, Settings, ShoppingCart, X, Menu, Zap, ChevronDown, LogOut } from 'lucide-react';
import { logo_url } from '../../config/api';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const IMAGE_DEFAULT_URL = 'https://res.cloudinary.com/diwxfpt92/image/upload/v1749052964/products/ppe92dmlfy1eticfpdam.jpg';

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [flyoutIdx, setFlyoutIdx] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, url: "/admin" },
    {
      name: 'Sản phẩm',
      icon: <Package size={20} />, url: "/admin/products",
      children: [
        { name: 'Tất cả sản phẩm', url: '/admin/products' },
        { name: 'Tạo sản phẩm', url: '/admin/products/create' }
      ]
    },
    { name: 'Đơn hàng', icon: <ShoppingCart size={20} />, url: "/admin/order" },
    { name: 'Khách hàng', icon: <Users size={20} />, url: "/customer" },
    { name: 'Voucher', icon: <Tag size={20} />, url: "/vourcher" },
    { name: 'Bình luận', icon: <MessageSquare size={20} />, url: "/comment" },
    { name: 'Báo cáo', icon: <BarChart3 size={20} />, url: "/report" },
    { name: 'Cài đặt', icon: <Settings size={20} />, url: "/setting" },
  ];

  useEffect(() => {
    navItems.forEach(item => {
      if (item.children?.some(child => location.pathname.startsWith(child.url))) {
        setOpenSubMenu(item.name);
      }
    });
  }, [location.pathname]);

  // Đóng flyout khi click ra ngoài
  useEffect(() => {
    if (!flyoutIdx) return;
    function handleClick(e: MouseEvent) {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setFlyoutIdx(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [flyoutIdx]);

  const isActive = (url: string) => location.pathname === url;

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 z-30 flex flex-col`}
      style={{ borderTopRightRadius: 18, borderBottomRightRadius: 18 }}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <img src={logo_url} alt="Logo" className="h-8 w-8 rounded-full shadow" />
            <span className="font-semibold text-lg tracking-wide">KTM Shop</span>
          </div>
        ) : (
          <img src={logo_url} alt="Logo" className="h-8 w-8 rounded-full shadow mx-auto" />
        )}
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-800">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {/* Navigation */}
      <nav className="mt-5 px-2 space-y-1 flex-1">
        {navItems.map((item, index) => {
          const isOpen = openSubMenu === item.name;
          const active = isActive(item.url) || (item.children && item.children.some(child => isActive(child.url)));
          if (!item.children) {
            return (
              <a
                key={index}
                href={item.url}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${active ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${sidebarOpen ? '' : 'justify-center'}
                `}
                style={{ marginBottom: 2 }}
              >
                {item.icon}
                {sidebarOpen && <span>{item.name}</span>}
              </a>
            );
          }
          return (
            <div key={index} className="space-y-1 relative">
              <button
                onClick={() => {
                  if (sidebarOpen) setOpenSubMenu(isOpen ? null : item.name);
                  else setFlyoutIdx(flyoutIdx === index ? null : index);
                }}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg font-medium transition-all
                  ${active ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${sidebarOpen ? '' : 'justify-center'}
                `}
                style={{ marginBottom: 2 }}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {sidebarOpen && <span>{item.name}</span>}
                </div>
                {sidebarOpen && <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : ''} transition-transform`} />}
              </button>
              {/* Flyout submenu khi sidebar đóng */}
              {flyoutIdx === index && !sidebarOpen && (
                <div
                  ref={flyoutRef}
                  className="fixed left-20 bg-gray-900 shadow-lg rounded-lg py-2 px-2 z-50 min-w-[160px]"
                  style={{ minHeight: 48 * item.children.length, top: 64 }}
                >
                  {item.children.map((child, cIdx) => (
                    <a
                      key={cIdx}
                      href={child.url}
                      className={`block text-sm rounded px-3 py-2 transition whitespace-nowrap
                        ${isActive(child.url) ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-200 hover:text-white hover:bg-gray-800'}`}
                      onClick={() => setFlyoutIdx(null)}
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
              {/* Menu con khi sidebar mở */}
              {isOpen && sidebarOpen && (
                <div className="ml-10 space-y-1">
                  {item.children.map((child, cIdx) => (
                    <a
                      key={cIdx}
                      href={child.url}
                      className={`block text-sm rounded px-3 py-1 transition
                        ${isActive(child.url) ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {/* Bottom: Đăng xuất */}
      <div className="px-2 pb-4 mt-auto">
        <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-gray-800 hover:text-red-400 transition">
          <LogOut size={18} />
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
