import { useState } from 'react';
import useCartStore from '../store/useCartStore';
import { submitOrder } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore(s => s.totalPrice());
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderItems = items.map(item => ({ product_id: item.product.id, quantity: item.quantity }));
    setLoading(true);
    try {
      await submitOrder({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        items: orderItems,
      });
      clearCart();
      navigate('/order-success'); // می‌توانید یک صفحه تشکر ساده بسازید
    } catch (err) {
      alert('خطایی رخ داد: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">تکمیل اطلاعات سفارش</h1>
      <div className="bg-white border rounded-lg p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">نام و نام خانوادگی</label>
            <input
              type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">شماره تماس</label>
            <input
              type="text" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">آدرس</label>
            <textarea
              required rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="bg-gray-100 p-4 rounded text-right">
            <span className="font-bold text-lg">مبلغ قابل پرداخت: {totalPrice.toLocaleString('fa-IR')} تومان</span>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-70"
          >
            {loading ? 'در حال ثبت...' : 'ثبت سفارش'}
          </button>
        </form>
      </div>
    </div>
  );
}