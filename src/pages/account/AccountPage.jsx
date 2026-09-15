import { useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { User, Package, Heart, MapPin, Lock, LogOut, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const NAV = [
  { label: 'My Profile', icon: User, path: '/account' },
  { label: 'My Orders', icon: Package, path: '/account/orders' },
  { label: 'Wishlist', icon: Heart, path: '/account/wishlist' },
  { label: 'Change Password', icon: Lock, path: '/account/change-password' },
];

export default function AccountPage() {
  const { customer, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!customer) navigate('/login', { state: { from: location.pathname } });
  }, [customer]);

  if (!customer) return null;

  return (
    <div className="min-h-screen py-8" style={{ background: '#fffbe6' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 text-white" style={{ background: G }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mb-3" style={{ background: GOLD, color: G }}>
                  {customer.name?.[0]?.toUpperCase()}
                </div>
                <h2 className="font-semibold text-lg leading-tight">{customer.name}</h2>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{customer.email || customer.phone}</p>
              </div>
              <nav className="p-2">
                {NAV.map(item => (
                  <Link key={item.path} to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-0.5 transition-colors"
                    style={{ background: location.pathname === item.path ? '#f0f7f0' : 'transparent', color: location.pathname === item.path ? G : '#4b5563' }}>
                    <item.icon size={17} style={{ color: location.pathname === item.path ? G : '#9ca3af' }} />
                    {item.label}
                    <ChevronRight size={13} className="ml-auto text-gray-300" />
                  </Link>
                ))}
                <button onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mt-1 text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={17} /> Sign Out
                </button>
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
