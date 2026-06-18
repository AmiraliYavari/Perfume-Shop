import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchFilters } from '../api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Pagination from '../components/Pagination';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [allFilters, setAllFilters] = useState({ brands: [], notes: [], genders: [], concentrations: [], seasons: [] });
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';

  const loadProducts = async (page = 1) => {
    setLoading(true);
    const params = { ...filters, page, limit: 50 };
    if (searchQuery) params.search = searchQuery;
    if (sort) params.sort = sort;
    if (searchParams.get('discount') === 'true') params.featured = 'discount';
    try {
      const res = await fetchProducts(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters().then(res => setAllFilters(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    loadProducts(currentPage);
  }, [filters, sort, searchQuery, currentPage]);

  const handleFilterToggle = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      return { ...prev, [type]: current === value ? undefined : value };
    });
    // ریست صفحه
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow-md h-fit">
          <h2 className="font-bold text-lg mb-4">فیلترها</h2>
          <FilterGroup title="جنسیت" items={allFilters.genders} type="gender" current={filters.gender} onToggle={handleFilterToggle} />
          <FilterGroup title="غلظت" items={allFilters.concentrations} type="concentration" current={filters.concentration} onToggle={handleFilterToggle} />
          <FilterGroup title="برند" items={allFilters.brands} type="brand" current={filters.brand} onToggle={handleFilterToggle} />
          <FilterGroup title="فصل" items={allFilters.seasons} type="season" current={filters.season} onToggle={handleFilterToggle} />
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-600">نت‌های بویایی</h4>
            <div className="flex flex-wrap gap-2">
              {allFilters.notes.map(note => (
                <button
                  key={note}
                  onClick={() => handleFilterToggle('note', note)}
                  className={`px-3 py-1 rounded-full text-xs border ${filters.note === note ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-gray-100'}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => { setFilters({}); setSearchParams({}); }} className="w-full bg-gray-100 py-2 rounded text-sm hover:bg-gray-200">
            حذف فیلترها
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h1 className="text-xl font-bold">
              {searchQuery ? `نتایج جستجو برای "${searchQuery}"` : 'فروشگاه'}
              <span className="text-sm font-normal text-gray-500 mr-2">({pagination.total} محصول)</span>
            </h1>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">مرتب‌سازی پیش‌فرض</option>
              <option value="price_asc">ارزان‌ترین</option>
              <option value="price_desc">گران‌ترین</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) :
              products.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
          {!loading && products.length === 0 && <p className="text-center text-gray-500 py-20">محصولی یافت نشد.</p>}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}

function FilterGroup({ title, items, type, current, onToggle }) {
  if (!items?.length) return null;
  return (
    <div className="mb-5">
      <h4 className="font-medium mb-2 text-gray-700">{title}</h4>
      <div className="space-y-2">
        {items.map(item => (
          <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={current === item}
              onChange={() => onToggle(type, item)}
              className="accent-primary"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}