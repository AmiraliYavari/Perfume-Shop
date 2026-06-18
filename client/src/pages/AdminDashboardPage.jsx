import { useEffect, useState } from 'react';
import axios from 'axios';
import useAdminStore from '../store/useAdminStore';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const token = useAdminStore(state => state.token);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const [prodRes, orderRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/products', { headers }),
        axios.get('http://localhost:3001/api/admin/orders', { headers }),
      ]);
      setStats({ products: prodRes.data.length, orders: orderRes.data.length });
    };
    fetchStats();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">داشبورد مدیریت</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">محصولات</h2>
          <p className="text-3xl font-bold">{stats.products}</p>
          <Link to="/admin/products" className="text-amber-600 hover:underline text-sm">مدیریت محصولات</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">سفارشات</h2>
          <p className="text-3xl font-bold">{stats.orders}</p>
          <Link to="/admin/orders" className="text-amber-600 hover:underline text-sm">مشاهده سفارشات</Link>
        </div>
      </div>
    </div>
  );
}