// import { Link, Outlet } from 'react-router-dom'

// const AdminLayout = () => (
//   <div className="flex">
//     <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
//       <h2 className="text-xl font-bold mb-4">Admin</h2>
//       <nav className="flex flex-col gap-2">
//         <Link to="/admin">Dashboard</Link>
//         <Link to="/admin/products">Products</Link>
//         <Link to="/admin/orders">Orders</Link>
//       </nav>
//     </aside>
//     <main className="flex-1 p-6 bg-gray-50">
//       <Outlet />
//     </main>
//   </div>
// )

// export default AdminLayout


import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col bg-gray-100">
         {/* ✅ HEADER CHUNG */}
   
    <Header sidebarOpen={sidebarOpen}  darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      {/* <main
        className={`flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        } p-6`}
      > */}
      <main 
      // className="flex-1 bg-gray-100 p-6 overflow-y-auto h-screen"
      className={`flex-1 bg-gray-100 overflow-y-auto transition-all duration-300 ease-in-out p-6 pt-24`}
      >

        <Outlet />
      </main>
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
