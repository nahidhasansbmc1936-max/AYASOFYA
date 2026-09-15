import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Image, FileText, Settings, LogOut, Menu, X, Percent, MessageSquare, BarChart2, Globe, BookOpen, Sliders } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const G = '#1a3a2a';
const GOLD = '#f5c518';
const SIDEBAR_BG = '#0d2218';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: Tags, path: '/admin/categories' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Coupons', icon: Percent, path: '/admin/coupons' },
  { label: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  { label: 'Blog', icon: BookOpen, path: '/admin/blog' },
  { label: 'Banners', icon: Image, path: '/admin/banners' },
  { label: 'Media', icon: Image, path: '/admin/media' },
  { label: 'Pages', icon: FileText, path: '/admin/pages' },
  { label: 'Homepage', icon: Globe, path: '/admin/homepage' },
  { label: 'Customizer', icon: Sliders, path: '/admin/customizer' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!admin && !localStorage.getItem('ayasofya_admin_token')) navigate('/admin/login');
  }, [admin]);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <Link to="/admin" className="flex items-center gap-2.5">
          <div style={{ width: 36, height: 36, background: GOLD, borderRadius: 8, flexShrink: 0 }} className="flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C8 3 4 6 4 11C4 14 6 16 9 17L7 21L10 21L11.5 17.8C11.7 17.9 11.85 18 12 18C16 18 20 15 20 11C20 6 16 3 12 3Z" fill={G}/>
              <path d="M9 14C7.5 13 6.5 12 6.5 11C6.5 7.5 9 5 12 5C15 5 17.5 7.5 17.5 11C17.5 13 15.5 15.5 12 15.8L13 13C14.5 12.5 15.5 11.8 15.5 11C15.5 8.5 14 7 12 7C10 7 8.5 8.5 8.5 11C8.5 12 9 13 10 13.8Z" fill={GOLD}/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: '#fff', fontSize: 17, letterSpacing: '0.06em' }}>AYASOFYA</div>
            <div style={{ color: GOLD, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map(item => {
          const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all"
              style={{ background: active ? GOLD : 'transparent', color: active ? G : 'rgba(255,255,255,0.7)' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div style={{ width: 32, height: 32, background: GOLD, borderRadius: '50%' }} className="flex items-center justify-center font-bold text-sm flex-shrink-0" style2={{ color: G }}>
            <span style={{ color: G, fontWeight: 700, fontSize: 14 }}>{admin?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
            <p className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.45)' }}>{admin?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors" style={{ color: '#f87171' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={13} /> Sign Out
        </button>
        <Link to="/" target="_blank" className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <Globe size={13} /> View Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0" style={{ background: SIDEBAR_BG }}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full flex flex-col" style={{ background: SIDEBAR_BG }}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/70"><X size={20} /></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-500">Store Online</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-gray-500 hover:text-gray-800">View Store →</Link>
            <div style={{ width: 32, height: 32, background: G }} className="rounded-full flex items-center justify-center text-white text-sm font-bold">
              {admin?.name?.[0]}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
