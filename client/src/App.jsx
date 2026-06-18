import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminLayout from './pages/AdminLayout';
import useAdminStore from './store/useAdminStore';

function ProtectedAdminRoute({ children }) {
  const token = useAdminStore(state => state.token);
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* مسیرهای ادمین (بدون هدر و فوتر اصلی) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

        {/* مسیرهای فروشگاه */}
        <Route path="*" element={
          <>
            <Navbar />
            <CartDrawer />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={
                  <div className="container mx-auto py-20 text-center">
                    <h1 className="text-2xl font-bold text-green-600">سفارش شما با موفقیت ثبت شد!</h1>
                    <p className="mt-4">به زودی با شما تماس خواهیم گرفت.</p>
                  </div>
                } />
              </Routes>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}