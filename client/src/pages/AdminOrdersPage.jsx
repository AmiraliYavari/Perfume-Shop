import { useEffect, useState } from 'react';
import axios from 'axios';
import useAdminStore from '../store/useAdminStore';
import { formatPrice } from '../utils/formatPrice';

export default function AdminOrdersPage() {
  const token = useAdminStore(state => state.token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data)).catch(console.error);
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">سفارشات</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{order.phone}</p>
                <p className="text-sm">{order.address}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{order.status}</span>
            </div>
            <div className="mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="text-right">محصول</th>
                    <th className="text-right">تعداد</th>
                    <th className="text-right">قیمت واحد</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}