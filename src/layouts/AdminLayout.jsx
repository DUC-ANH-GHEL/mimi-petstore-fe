import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Kiểm tra kích thước màn hình và cập nhật trạng thái `isMobile`
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        // setIsMobile(true);
        setSidebarOpen(false); // Đóng sidebar khi ở mobile
      } else {
        // setIsMobile(false);
        setSidebarOpen(true); // Mở sidebar khi ở desktop
      }
    };

    checkMobile();  // Kiểm tra ngay khi component được render
    window.addEventListener('resize', checkMobile);  // Kiểm tra lại khi thay đổi kích thước màn hình

    return () => {
      window.removeEventListener('resize', checkMobile);  // Dọn dẹp event listener khi component bị unmount
    };
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-rose-50/40 dark:bg-gray-950">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <Header sidebarOpen={sidebarOpen} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

          <main className="flex-1 overflow-y-auto p-6 pt-24">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;


// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/layout/Sidebar';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
//       <div
//         className={`flex-1 transition-all duration-300 ease-in-out ${
//           sidebarOpen ? 'ml-64' : 'ml-20'
//         } bg-gray-100 p-6 overflow-y-auto`}
//       >
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
