import { Routes, Route, Navigate  } from 'react-router-dom'
// import jwt_decode from 'jwt-decode';

import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/client/Home'
import ProductList from './pages/client/ProductList'
import ProductDetail from './pages/client/ProductDetail'
import Contact from './pages/client/Contact'
import Checkout from './pages/client/Checkout'

import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Product/Products'
import OrderCreate from './pages/admin/Order/OrderCreate'
import AdminLoginPage from './pages/admin/Login'
import PrivateRoute from './components/PrivateRoute';
import CreateProduct from './pages/admin/Product/CreateProduct'
import ProductDetailPage from './pages/admin/Product/ProductDetailPage'
import { CartProvider } from './contexts/CartContext';



function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<Checkout />} />
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
          <Route path="product/update/:id" element={<CreateProduct />} />
          <Route path="order" element={<OrderCreate />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App