import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { formatPrice } from '../utils/formatPrice';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  // محاسبه مستقیم مجموع (عدد)
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  // فیلتر آیتم‌های امن
  const safeItems = items.filter(
    (item) => item?.product && typeof item.product.price === 'number'
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">سبد خرید</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>
        </div>

        <div
          className="p-4 flex flex-col gap-4 overflow-y-auto"
          style={{ maxHeight: 'calc(100% - 130px)' }}
        >
          {safeItems.length === 0 ? (
            <p className="text-gray-500 text-center py-10">سبد خرید خالی است</p>
          ) : (
            safeItems.map((item) => (
              <div key={item.product.id} className="flex gap-3 border-b pb-3">
                <img
                  src={item.product.image || 'https://via.placeholder.com/64'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-500">{item.product.brand}</p>
                  <p className="text-sm font-bold mt-1">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="bg-gray-200 px-2 py-0.5 rounded text-xs disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="bg-gray-200 px-2 py-0.5 rounded text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-400 hover:text-red-600 self-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {safeItems.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full border-t bg-white p-4">
            <div className="flex justify-between font-bold text-lg mb-3">
              <span>مجموع:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-2 rounded-lg transition"
            >
              ادامه فرایند خرید
            </Link>
          </div>
        )}
      </div>
    </>
  );
}