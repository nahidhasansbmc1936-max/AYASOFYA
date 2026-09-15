import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'top_rated', label: 'Top Rated' },
];

export default function ShopPage({ title, categorySlug }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'latest';
  const search = searchParams.get('search') || '';
  const category = categorySlug || searchParams.get('category') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const inStock = searchParams.get('in_stock') || '';
  const newArrival = searchParams.get('new_arrival') || '';
  const bestseller = searchParams.get('bestseller') || '';
  const offer = searchParams.get('offer') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, sort });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      if (inStock) params.set('in_stock', inStock);
      if (newArrival) params.set('new_arrival', newArrival);
      if (bestseller) params.set('bestseller', bestseller);
      if (offer) params.set('offer', offer);
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, sort, search, category, minPrice, maxPrice, inStock, newArrival, bestseller, offer]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get('/categories/flat').then(res => setCategories(res.data.categories || [])); }, []);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };
  const clearFilters = () => setSearchParams({});

  const pageTitle = title || (search ? `Search: "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products');

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-wide" style={{ color: G }}>Categories</h3>
        <div className="space-y-1">
          <button onClick={() => setParam('category', '')} className="block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors" style={{ background: !category ? G : 'transparent', color: !category ? '#fff' : '#4b5563' }}>All Products</button>
          {categories.filter(c => !c.parent_id).map(cat => (
            <button key={cat.id} onClick={() => setParam('category', cat.slug)} className="block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors" style={{ background: category === cat.slug ? G : 'transparent', color: category === cat.slug ? '#fff' : '#4b5563' }}>{cat.name}</button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-wide" style={{ color: G }}>Price Range</h3>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => setParam('min_price', e.target.value)} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          <span className="text-gray-400 text-xs">—</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => setParam('max_price', e.target.value)} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3 uppercase tracking-wide" style={{ color: G }}>Filters</h3>
        <div className="space-y-2">
          {[{ key: 'in_stock', label: 'In Stock Only' }, { key: 'new_arrival', label: 'New Arrivals' }, { key: 'bestseller', label: 'Best Sellers' }, { key: 'offer', label: 'On Sale' }].map(filter => (
            <label key={filter.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={searchParams.get(filter.key) === '1'} onChange={e => setParam(filter.key, e.target.checked ? '1' : '')} className="w-4 h-4 rounded" style={{ accentColor: G }} />
              <span className="text-sm text-gray-600">{filter.label}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={clearFilters} className="w-full py-2 border border-red-300 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors">Clear All Filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="py-8 text-white" style={{ background: G }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display',serif" }}>{pageTitle}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <button onClick={() => setFilterOpen(!filterOpen)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
            <select value={sort} onChange={e => setParam('sort', e.target.value)} className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white border rounded-xl p-5 sticky top-24"><FilterPanel /></div>
          </aside>

          {/* Mobile filter */}
          <AnimatePresence>
            {filterOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }} className="relative w-72 bg-white h-full overflow-y-auto p-5">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg" style={{ color: G }}>Filters</h2>
                    <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
                  </div>
                  <FilterPanel />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-t-xl"></div>
                    <div className="p-3 space-y-2"><div className="h-3 bg-gray-200 rounded w-2/3"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="px-6 py-2.5 text-white rounded-lg text-sm font-medium" style={{ background: G }}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button disabled={page === 1} onClick={() => setParam('page', String(page - 1))} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
                    {[...Array(Math.min(pages, 7))].map((_, i) => (
                      <button key={i} onClick={() => setParam('page', String(i + 1))} className="w-9 h-9 rounded-lg text-sm font-medium" style={{ background: i + 1 === page ? G : 'white', color: i + 1 === page ? '#fff' : '#374151', border: i + 1 === page ? 'none' : '1px solid #e5e7eb' }}>{i + 1}</button>
                    ))}
                    <button disabled={page === pages} onClick={() => setParam('page', String(page + 1))} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
