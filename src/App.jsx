import { Routes, Route, Navigate  } from 'react-router-dom'
// import jwt_decode from 'jwt-decode';

import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/client/Home'
import ProductList from './pages/client/ProductList'
import ProductDetail from './pages/client/ProductDetail'
import Contact from './pages/client/Contact'

import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import AdminLoginPage from './pages/admin/Login'
import PrivateRoute from './components/PrivateRoute';
import CreateProduct from './pages/admin/CreateProduct'


// const isLoggedIn = () => {
//   return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
// }

// const isLoggedIn = () => {
//   const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
//   if (!token) return false;

//   try {
//     const decoded = jwt_decode(token); // không dùng type annotation
//     const exp = decoded.exp;
//     const isExpired = exp * 1000 < Date.now();
//     return !isExpired;
//   } catch {
//     return false;
//   }
// }


function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
{/* 
     

      <Route path="/admin" element={<Dashboard />}> */}
       {/* <Route path="/admin/login" element={
        isLoggedIn() ? <Navigate to="/admin" /> : <AdminLoginPage />
      } />

      <Route path="/admin" element={
        isLoggedIn() ? <Dashboard /> : <Navigate to="/admin/login" />
      }> */}

      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  )
}

export default App