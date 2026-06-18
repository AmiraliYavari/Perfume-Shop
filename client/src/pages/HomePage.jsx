import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchFilters } from '../api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import HeroSection from '../components/HeroSection';

export default function HomePage() {
  const [discountProducts, setDiscountProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [springProducts, setSpringProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [discRes, latestRes, springRes, filtersRes] = await Promise.all([
          fetchProducts({ featured: 'discount', limit: 4 }),
          fetchProducts({ limit: 8, sort: 'id_desc' }),
          fetchProducts({ season: 'بهار', limit: 4 }),
          fetchFilters()
        ]);
        setDiscountProducts(discRes.data.products || discRes.data);
        setLatestProducts(latestRes.data.products || latestRes.data);
        setSpringProducts(springRes.data.products || springRes.data);
        setBrands(filtersRes.data.brands || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        {/* برندها */}
        <SectionTitle title="برندهای محبوب" />
        <div className="flex flex-wrap justify-center gap-6">
          {brands.map(brand => (
            <Link
              key={brand}
              to={`/shop?brand=${encodeURIComponent(brand)}`}
              className="bg-white shadow rounded-xl px-6 py-4 hover:shadow-lg transition text-sm font-medium text-gray-700 hover:text-primary"
            >
              {brand}
            </Link>
          ))}
        </div>

        {/* تخفیف‌های ویژه */}
        {discountProducts.length > 0 && (
          <>
            <SectionTitle title="پیشنهادهای ویژه" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : discountProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-6">
              <Link to="/shop?discount=true" className="text-primary hover:underline">مشاهده همه</Link>
            </div>
          </>
        )}

        {/* مناسب بهار */}
        {springProducts.length > 0 && (
          <>
            <SectionTitle title="مناسب بهار" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : springProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        {/* جدیدترین‌ها */}
        <SectionTitle title="جدیدترین محصولات" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : latestProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-6">
          <Link to="/shop" className="text-primary hover:underline">مشاهده فروشگاه</Link>
        </div>

        {/* بنر تبلیغاتی */}
        <div className="my-12 bg-gradient-to-r from-primary to-dark-light text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-3">ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان</h2>
          <Link to="/shop" className="inline-block bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">همین حالا خرید کنید</Link>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="text-center my-10">
      <h2 className="text-2xl font-bold text-gray-800 inline-block relative">
        {title}
        <span className="block h-1 w-20 bg-primary mx-auto mt-2 rounded-full"></span>
      </h2>
    </div>
  );
}