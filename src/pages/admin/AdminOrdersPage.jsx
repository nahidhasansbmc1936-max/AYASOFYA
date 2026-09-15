import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/format';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const STATUSES = ['all','pending','confirmed','processing','packed','shipped','delivered','cancelled','returned'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (status && status !== 'all') p.set('status', status);
    if (search) p.set('search', search);
    adminApi.get(`/orders/admin/all?${p}`).then(res => {
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    }).finally(() => setLoading(false));
  }, [status, page, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminApi.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Orders ({total})</h1>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setSearchParams({ status: s, page: '1' })}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all"
            style={{ background: status === s ? G : '#fff', color: status === s ? '#fff' : '#4b5563', border: status === s ? 'none' : '1px solid #e5e7eb' }}>
            {s === 'all' ? 'All' : getStatusLabel(s)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
        <div className="flex-1 flex items-center gap-2 border-2 border-gray-200 rounded-lg px-3" onFocus={e => e.currentTarget.style.borderColor = G} onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchOrders()} placeholder="Search by order#, name, phone..." className="flex-1 py-2 text-sm focus:outline-none" />
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ background: G }}>Search</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(8)].map((_,i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-5 bg-gray-100 animate-pulse rounded" /></td></tr>
              )) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold" style={{ color: G }}>#{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{(order.items || []).length} item(s)</td>
                  <td className="px-4 py-3 font-bold" style={{ color: G }}>{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-xs capitalize text-gray-600">{order.payment_method}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} disabled={updating === order.id}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1.5 rounded-full border-0 cursor-pointer ${getStatusColor(order.status)}`}>
                      {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order.id}`} className="p-1.5 text-white rounded-lg inline-flex" style={{ background: G }}>
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && <div className="text-center py-10 text-gray-400">No orders found</div>}
        </div>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(Math.min(pages, 7))].map((_, i) => (
            <button key={i} onClick={() => setSearchParams({ status, page: String(i + 1) })}
              className="w-9 h-9 rounded-lg text-sm font-medium"
              style={{ background: i + 1 === page ? G : '#fff', color: i + 1 === page ? '#fff' : '#374151', border: i + 1 === page ? 'none' : '1px solid #e5e7eb' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
