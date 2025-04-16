import React from 'react';
import { Home, Package, Users, Tag, MessageSquare, BarChart3, Settings, ShoppingCart, X, Menu, Zap } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}


const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />,url: "/", active: true },
    { name: 'Sản phẩm', icon: <Package size={20} />, url: "/product", active: false },
    { name: 'Đơn hàng', icon: <ShoppingCart size={20} />, url: "/order", active: false },
    { name: 'Khách hàng', icon: <Users size={20} />, url:"/customer", active: false },
    { name: 'Voucher', icon: <Tag size={20} />, url: "/vourcher", active: false },
    { name: 'Bình luận', icon: <MessageSquare size={20} />, url: "/comment", active: false },
    { name: 'Báo cáo', icon: <BarChart3 size={20} />, url: "/report", active: false },
    { name: 'Cài đặt', icon: <Settings size={20} />, url: "/setting", active: false },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-60' : 'w-20'} fixed top-0 left-0 h-screen flex-shrink-0 bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 ease-in-out z-20`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-blue-500" />
            <span className="ml-2 font-semibold">AdminShop</span>
          </div>
        ) : (
          <Zap className="h-6 w-6 text-blue-500 mx-auto" />
        )}
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-800">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className={`group flex items-center py-2 px-4 text-sm font-medium rounded-md ${
                item.active ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } transition-colors`}
            >
              <div className="mr-3">{item.icon}</div>
              {sidebarOpen && <span>{item.name}</span>}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;