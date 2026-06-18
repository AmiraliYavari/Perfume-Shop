import useCartStore from '../store/useCartStore';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore(s => s.totalPrice());

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-10 text-center">
        <p className="text-gray-500 text-lg">سبد خرید شما خالی است.</p>
        <Link to="/" className="text-amber-600 hover:underline">بازگشت به فروشگاه</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
      <div className="space-y-2">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
      <div className="mt-6 text-left">
        <p className="text-xl font-bold">
          مجموع: {totalPrice.toLocaleString('fa-IR')} تومان
        </p>
        <Link
          to="/checkout"
          className="mt-4 inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
        >
          ادامه فرایند خرید
        </Link>
      </div>
    </div>
  );
}