import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../api';
import ScentPyramid from '../components/ScentPyramid';
import useCartStore from '../store/useCartStore';
import { formatPrice } from '../utils/formatPrice';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    fetchProduct(id)
      .then((res) => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  if (!product) return <div className="p-10 text-center text-gray-500">در حال بارگذاری...</div>;

  const top = JSON.parse(product.top_notes || '[]');
  const middle = JSON.parse(product.middle_notes || '[]');
  const base = JSON.parse(product.base_notes || '[]');

  const hasDiscount =
    product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-10">
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-w-md rounded-lg shadow"
      />
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-gray-600 mb-2">{product.brand}</p>
        <div className="flex gap-2 mb-4">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
            {product.concentration}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
            {product.gender === 'male'
              ? 'مردانه'
              : product.gender === 'female'
              ? 'زنانه'
              : 'یونی‌سکس'}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
            {product.volume_ml} میل
          </span>
        </div>
        <p className="text-gray-700 mb-6">{product.description}</p>

        <ScentPyramid top={top} middle={middle} base={base} />

        <div className="mt-8 flex items-center gap-4">
          <div>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through block">
                {formatPrice(product.original_price)}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          {hasDiscount && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
              {discountPercent}% تخفیف
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-6 w-full md:w-auto bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}