import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAdminStore from '../store/useAdminStore';
import SearchAutocomplete from './SearchAutocomplete';

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const token = useAdminStore((s) => s.token);

  return (
    <nav className="bg-dark text-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-primary transition">
          عطرخانه
        </Link>
        <div className="hidden md:flex flex-1 justify-center">
          <SearchAutocomplete />
        </div>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-primary transition">خانه</Link>
          <Link to="/shop" className="hover:text-primary transition">فروشگاه</Link>
          
          {/* دکمه پنل ادمین همیشگی */}
          <Link
            to={token ? '/admin' : '/admin/login'}
            className="hover:text-primary transition"
          >
            {token ? 'پنل ادمین' : 'ورود ادمین'}
          </Link>

          <button onClick={toggleCart} className="relative hover:text-primary transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* جستجو در موبایل */}
      <div className="md:hidden px-4 pb-3">
        <SearchAutocomplete />
      </div>
    </nav>
  );
}