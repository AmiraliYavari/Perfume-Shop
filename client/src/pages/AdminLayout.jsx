import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAdminStore from '../store/useAdminStore';

export default function AdminLayout() {
  const logout = useAdminStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        {/* دکمه بازگشت به فروشگاه */}
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          بازگشت به فروشگاه
        </Link>

        <h2 className="text-xl font-bold mb-6">پنل مدیریت</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/admin" className="hover:bg-gray-700 px-3 py-2 rounded">داشبورد</Link>
          <Link to="/admin/products" className="hover:bg-gray-700 px-3 py-2 rounded">محصولات</Link>
          <Link to="/admin/orders" className="hover:bg-gray-700 px-3 py-2 rounded">سفارشات</Link>
        </nav>
        <button onClick={handleLogout} className="mt-auto bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm">خروج</button>
      </aside>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}