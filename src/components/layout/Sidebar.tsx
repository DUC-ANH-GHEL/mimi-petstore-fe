// import React, {useState} from 'react';
// import { Home, Package, Users, Tag, MessageSquare, BarChart3, Settings, ShoppingCart, X, Menu, Zap, ChevronDown } from 'lucide-react';

// interface SidebarProps {
//   sidebarOpen: boolean;
//   toggleSidebar: () => void;
// }




// const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
//   const [productSubOpen, setProductSubOpen] = useState(false);

//   const navItems = [
//     { name: 'Dashboard', icon: <Home size={20} />,url: "/admin", active: true },
//     // { name: 'Sản phẩm', icon: <Package size={20} />, url: "/product", active: false },
//     {
//       name: 'Sản phẩm',
//       icon: <Package size={20} />,
//       url: "/products",
//       active: false,
//       children: [
//         { name: 'Tất cả sản phẩm', url: '/admin/products' },
//         { name: 'Tạo sản phẩm', url: '/admin/products/create' }
//       ]
//     },
//     { name: 'Đơn hàng', icon: <ShoppingCart size={20} />, url: "/order", active: false },
//     { name: 'Khách hàng', icon: <Users size={20} />, url:"/customer", active: false },
//     { name: 'Voucher', icon: <Tag size={20} />, url: "/vourcher", active: false },
//     { name: 'Bình luận', icon: <MessageSquare size={20} />, url: "/comment", active: false },
//     { name: 'Báo cáo', icon: <BarChart3 size={20} />, url: "/report", active: false },
//     { name: 'Cài đặt', icon: <Settings size={20} />, url: "/setting", active: false },
//   ];

 
//   return (
//     <div className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-20`}>
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
//         {sidebarOpen ? (
//           <div className="flex items-center space-x-2">
//             <Zap className="h-6 w-6 text-blue-500" />
//             <span className="font-semibold text-lg">AdminShop</span>
//           </div>
//         ) : (
//           <Zap className="h-6 w-6 text-blue-500 mx-auto" />
//         )}
//         <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-800">
//           {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-5 px-2 space-y-1">
//         {navItems.map((item, index) => {
//           if (!item.children) {
//             return (
//               <a
//                 key={index}
//                 href={item.url}
//                 className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
//               >
//                 {item.icon}
//                 {sidebarOpen && <span>{item.name}</span>}
//               </a>
//             );
//           }

//           return (
//             <div key={index} className="space-y-1">
//               <button
//                 onClick={() => setProductSubOpen(!productSubOpen)}
//                 className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition"
//               >
//                 <div className="flex items-center gap-3">
//                   {item.icon}
//                   {sidebarOpen && <span>{item.name}</span>}
//                 </div>
//                 {sidebarOpen && <ChevronDown size={16} className={`${productSubOpen ? 'rotate-180' : ''} transition-transform`} />}
//               </button>
//               {productSubOpen && sidebarOpen && (
//                 <div className="ml-10 space-y-1">
//                   {item.children.map((child, cIdx) => (
//                     <a
//                       key={cIdx}
//                       href={child.url}
//                       className="block text-sm text-gray-400 hover:text-white transition"
//                     >
//                       {child.name}
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// // };

// export default Sidebar;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Users, Tag, MessageSquare, BarChart3, Settings, ShoppingCart, X, Menu, Zap, ChevronDown } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, url: "/admin", active: true },
    {
      name: 'Sản phẩm',
      icon: <Package size={20} />,
      url: "/products",
      active: false,
      children: [
        { name: 'Tất cả sản phẩm', url: '/admin/products' },
        { name: 'Tạo sản phẩm', url: '/admin/products/create' }
      ]
    },
    { name: 'Đơn hàng', icon: <ShoppingCart size={20} />, url: "/order", active: false },
    { name: 'Khách hàng', icon: <Users size={20} />, url: "/customer", active: false },
    { name: 'Voucher', icon: <Tag size={20} />, url: "/vourcher", active: false },
    { name: 'Bình luận', icon: <MessageSquare size={20} />, url: "/comment", active: false },
    { name: 'Báo cáo', icon: <BarChart3 size={20} />, url: "/report", active: false },
    { name: 'Cài đặt', icon: <Settings size={20} />, url: "/setting", active: false },
  ];

  useEffect(() => {
    // Auto open submenu if current path matches any children
    navItems.forEach(item => {
      if (item.children?.some(child => location.pathname.startsWith(child.url))) {
        setOpenSubMenu(item.name);
      }
    });
  }, [location.pathname]);

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'}   h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-20`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {sidebarOpen ? (
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-500" />
            <span className="font-semibold text-lg">AdminShop</span>
          </div>
        ) : (
          <Zap className="h-6 w-6 text-blue-500 mx-auto" />
        )}
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-800">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5 px-2 space-y-1">
        {navItems.map((item, index) => {
          const isOpen = openSubMenu === item.name;

          if (!item.children) {
            return (
              <a
                key={index}
                href={item.url}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                {item.icon}
                {sidebarOpen && <span>{item.name}</span>}
              </a>
            );
          }

          return (
            <div key={index} className="space-y-1">
              <button
                onClick={() => setOpenSubMenu(isOpen ? null : item.name)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {sidebarOpen && <span>{item.name}</span>}
                </div>
                {sidebarOpen && <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : ''} transition-transform`} />}
              </button>
              {isOpen && sidebarOpen && (
                <div className="ml-10 space-y-1">
                  {item.children.map((child, cIdx) => (
                    <a
                      key={cIdx}
                      href={child.url}
                      className={`block text-sm ${
                        location.pathname === child.url ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                      } transition`}
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
    </div>
  );
};

export default Sidebar;
