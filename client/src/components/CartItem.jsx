import useCartStore from '../store/useCartStore';

export default function CartItem({ item }) {
  const { product, quantity } = item;
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.brand} - {product.volume_ml} میل</p>
        <p className="font-bold mt-1">{(product.price * quantity).toLocaleString('fa-IR')} تومان</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          disabled={quantity <= 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          -
        </button>
        <span className="text-sm">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeFromCart(product.id)}
        className="text-red-500 hover:text-red-700 mr-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    </div>
  );
}