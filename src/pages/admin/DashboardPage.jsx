import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, Users, Package, AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/format';

const G = '#1a3a2a';
const GOLD = '#f5c518';

function StatCard({ title, value, icon: Icon, color, sub, link }) {
  return (
    <Link to={link || '#'} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow block">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{title}</p>
      {sub && <p className="text-xs font-medium mt-1" style={{ color }}>{sub}</p>}
    </Link>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.get('/orders/admin/stats/summary'),
      adminApi.get('/orders/admin/all?limit=5&page=1'),
    ]).then(([sRes, oRes]) => {
      setStats(sRes.data.stats);
      setRecentOrders(oRes.data.orders || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 h-28 animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome to AYASOFYA Admin Panel</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatPrice(stats?.total_revenue || 0)} icon={DollarSign} color={G} sub={`Today: ${formatPrice(stats?.today_revenue || 0)}`} link="/admin/orders" />
        <StatCard title="Total Orders" value={stats?.total_orders || 0} icon={ShoppingCart} color="#d97706" sub={`Today: ${stats?.today_orders || 0}`} link="/admin/orders" />
        <StatCard title="Customers" value={stats?.total_customers || 0} icon={Users} color="#3b82f6" link="/admin/customers" />
        <StatCard title="Products" value={stats?.total_products || 0} icon={Package} color="#8b5cf6" link="/admin/products" />
        <StatCard title="Pending" value={stats?.pending || 0} icon={Clock} color="#f59e0b" link="/admin/orders?status=pending" />
        <StatCard title="Confirmed" value={stats?.confirmed || 0} icon={CheckCircle} color="#10b981" link="/admin/orders?status=confirmed" />
        <StatCard title="Low Stock" value={stats?.low_stock || 0} icon={AlertTriangle} color="#ef4444" link="/admin/products" />
        <StatCard title="Out of Stock" value={stats?.out_of_stock || 0} icon={AlertTriangle} color="#dc2626" link="/admin/products" />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Add Product', path: '/admin/products/new', bg: G },
          { label: 'View Orders', path: '/admin/orders', bg: '#d97706' },
          { label: 'Manage Banners', path: '/admin/banners', bg: '#3b82f6' },
          { label: 'Site Settings', path: '/admin/settings', bg: '#8b5cf6' },
        ].map(a => (
          <Link key={a.path} to={a.path} className="flex items-center justify-center py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: a.bg }}>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium hover:opacity-70" style={{ color: G }}>View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold" style={{ color: G }}>
                    <Link to={`/admin/orders/${order.id}`}>#{order.order_number}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{formatDateTime(order.created_at)}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: G }}>{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <div className="text-center py-8 text-gray-400">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
