import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatPrice } from '../../utils/format';
import toast from 'react-hot-toast';

const G = '#1a3a2a';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (search) p.set('search', search);
    adminApi.get(`/products/admin/all?${p}`).then(res => {
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminApi.delete(`/products/admin/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Products ({total})</h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90" style={{ background: G }}>
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
        <div className="flex-1 flex items-center gap-2 border-2 border-gray-200 rounded-lg px-3">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts()} placeholder="Search products by name or SKU..." className="flex-1 py-2 text-sm focus:outline-none" />
        </div>
        <button onClick={fetchProducts} className="px-4 py-2 text-white rounded-lg text-sm" style={{ background: G }}>Search</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">SKU</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(8)].map((_,i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-5 bg-gray-100 animate-pulse rounded" /></td></tr>
              )) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <Package size={16} className="text-gray-400 m-auto mt-2.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-1">{p.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {p.is_featured && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 rounded">Featured</span>}
                          {p.is_bestseller && <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 rounded">Best</span>}
                          {p.is_new_arrival && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 rounded">New</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{p.sku || '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{p.category_name || '-'}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-xs" style={{ color: G }}>{formatPrice(p.sale_price || p.regular_price)}</p>
                    {p.sale_price && <p className="text-xs text-gray-400 line-through">{formatPrice(p.regular_price)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.stock_quantity} left
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link to={`/product/${p.slug}`} target="_blank" className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><Eye size={13} /></Link>
                      <Link to={`/admin/products/${p.id}/edit`} className="p-1.5 text-white rounded-lg" style={{ background: G }}><Edit size={13} /></Link>
                      <button onClick={() => deleteProduct(p.id, p.name)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && !loading && <div className="text-center py-10 text-gray-400">No products found</div>}
        </div>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(Math.min(pages, 7))].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className="w-9 h-9 rounded-lg text-sm font-medium"
              style={{ background: i + 1 === page ? G : '#fff', color: i + 1 === page ? '#fff' : '#374151', border: i + 1 === page ? 'none' : '1px solid #e5e7eb' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
