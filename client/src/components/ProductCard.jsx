import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const openCart = useCartStore((s) => s.openCart);
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    openCart();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block product-card-image relative">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discountPercent}٪ تخفیف
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <Link to={`/product/${product.id}`} className="font-semibold text-lg hover:text-primary transition line-clamp-2">
          {product.name}
        </Link>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            {hasDiscount && (
              <span className="line-through text-gray-400 text-sm ml-2">{formatPrice(product.original_price)}</span>
            )}
            <span className="font-bold text-lg text-gray-800">{formatPrice(product.price)}</span>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{product.volume_ml} میل</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          افزودن به سبد
        </button>
      </div>
    </div>
  );
}