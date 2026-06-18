import { useEffect, useState } from 'react';
import axios from 'axios';
import useAdminStore from '../store/useAdminStore';
import { formatPrice } from '../utils/formatPrice';

export default function AdminProductsPage() {
  const token = useAdminStore(state => state.token);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3001/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('آیا مطمئن هستید؟')) return;
    await axios.delete(`http://localhost:3001/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProducts();
  };

  const openForm = (product = null) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <button onClick={() => openForm()} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition">افزودن محصول</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-right">نام</th>
              <th className="p-3 text-right">برند</th>
              <th className="p-3 text-right">قیمت</th>
              <th className="p-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.brand}</td>
                <td className="p-3">{formatPrice(product.price)}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openForm(product)} className="text-blue-600 hover:underline">ویرایش</button>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:underline">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          token={token}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, token, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    concentration: product?.concentration || '',
    gender: product?.gender || '',
    season: product?.season || '',
    top_notes: product?.top_notes ? JSON.parse(product.top_notes) : [],
    middle_notes: product?.middle_notes ? JSON.parse(product.middle_notes) : [],
    base_notes: product?.base_notes ? JSON.parse(product.base_notes) : [],
    description: product?.description || '',
    image: product?.image || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    volume_ml: product?.volume_ml || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'top_notes' || name === 'middle_notes' || name === 'base_notes') {
      setForm({ ...form, [name]: value.split(',').map(s => s.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null, volume_ml: Number(form.volume_ml) };
    try {
      if (product) {
        await axios.put(`http://localhost:3001/api/admin/products/${product.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:3001/api/admin/products', payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      onSaved();
    } catch (err) {
      alert('خطا در ذخیره‌سازی');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{product ? 'ویرایش محصول' : 'افزودن محصول'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder="نام" value={form.name} onChange={handleChange} required className="border p-2 rounded" />
            <input name="brand" placeholder="برند" value={form.brand} onChange={handleChange} required className="border p-2 rounded" />
            <input name="concentration" placeholder="غلظت" value={form.concentration} onChange={handleChange} className="border p-2 rounded" />
            <input name="gender" placeholder="جنسیت" value={form.gender} onChange={handleChange} className="border p-2 rounded" />
            <input name="season" placeholder="فصل" value={form.season} onChange={handleChange} className="border p-2 rounded" />
            <input name="price" type="number" placeholder="قیمت" value={form.price} onChange={handleChange} required className="border p-2 rounded" />
            <input name="original_price" type="number" placeholder="قیمت اصلی (برای تخفیف)" value={form.original_price} onChange={handleChange} className="border p-2 rounded" />
            <input name="volume_ml" type="number" placeholder="حجم (میلی‌لیتر)" value={form.volume_ml} onChange={handleChange} required className="border p-2 rounded" />
          </div>
          <textarea name="description" placeholder="توضیحات" value={form.description} onChange={handleChange} rows="3" className="border p-2 rounded w-full" />
          <input name="image" placeholder="آدرس تصویر" value={form.image} onChange={handleChange} className="border p-2 rounded w-full" />
          <div className="grid grid-cols-3 gap-2">
            <input name="top_notes" placeholder="نت‌های آغازین (با کاما جدا کنید)" value={form.top_notes.join(', ')} onChange={handleChange} className="border p-2 rounded" />
            <input name="middle_notes" placeholder="نت‌های میانی" value={form.middle_notes.join(', ')} onChange={handleChange} className="border p-2 rounded" />
            <input name="base_notes" placeholder="نت‌های پایانی" value={form.base_notes.join(', ')} onChange={handleChange} className="border p-2 rounded" />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">انصراف</button>
            <button type="submit" className="px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">ذخیره</button>
          </div>
        </form>
      </div>
    </div>
  );
}