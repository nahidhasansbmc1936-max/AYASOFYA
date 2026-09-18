import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Image as ImageIcon,
  FileText, Settings, LogOut, Menu, X, Percent, MessageSquare, Globe,
  BookOpen, Sliders, ChevronRight, ShieldCheck,
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const G          = '#1a3a2a';
const GOLD       = '#f5c518';
const SIDEBAR_BG = '#0d2218';

const NAV = [
  { label: 'Dashboard',  icon: LayoutDashboard, path: '/admin' },
  { label: 'Orders',     icon: ShoppingCart,    path: '/admin/orders' },
  { label: 'Products',   icon: Package,         path: '/admin/products' },
  { label: 'Categories', icon: Tags,            path: '/admin/categories' },
  { label: 'Customers',  icon: Users,           path: '/admin/customers' },
  { label: 'Coupons',    icon: Percent,         path: '/admin/coupons' },
  { label: 'Reviews',    icon: MessageSquare,   path: '/admin/reviews' },
  { label: 'Blog',       icon: BookOpen,        path: '/admin/blog' },
  { label: 'Banners',    icon: ImageIcon,       path: '/admin/banners' },
  { label: 'Photo Gallery', icon: ImageIcon,       path: '/admin/media' },
  { label: 'Pages',      icon: FileText,        path: '/admin/pages' },
  { label: 'Homepage',   icon: Globe,           path: '/admin/homepage' },
  { label: 'Customizer', icon: Sliders,         path: '/admin/customizer' },
  { label: 'Settings',   icon: Settings,        path: '/admin/settings' },
  { label: 'Account',    icon: ShieldCheck,     path: '/admin/account' },
];

export default function AdminLayout() {
  const { admin, logout }         = useAdminStore();
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!admin && !localStorage.getItem('ayasofya_admin_token')) {
      navigate('/admin/login');
    }
  }, [admin]);

  // Close mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // ── Shared sidebar content ────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="px-4 py-5 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <Link to="/admin" className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-lg"
            style={{ width: 36, height: 36, background: GOLD }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3C8 3 4 6 4 11C4 14 6 16 9 17L7 21L10 21L11.5 17.8C11.7 17.9 11.85 18 12 18C16 18 20 15 20 11C20 6 16 3 12 3Z" fill={G} />
              <path d="M9 14C7.5 13 6.5 12 6.5 11C6.5 7.5 9 5 12 5C15 5 17.5 7.5 17.5 11C17.5 13 15.5 15.5 12 15.8L13 13C14.5 12.5 15.5 11.8 15.5 11C15.5 8.5 14 7 12 7C10 7 8.5 8.5 8.5 11C8.5 12 9 13 10 13.8Z" fill={GOLD} />
            </svg>
          </div>
          <div>
            <div
              className="font-bold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, letterSpacing: '0.06em' }}
            >
              AYASOFYA
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-semibold" style={{ color: GOLD }}>
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? GOLD : 'transparent',
                color: active ? G : 'rgba(255,255,255,0.72)',
                minHeight: 44, // touch-friendly target
                alignItems: 'center',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <item.icon size={16} className="flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin info + actions */}
      <div
        className="p-4 border-t flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {/* Admin name / role */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ width: 32, height: 32, background: GOLD, color: G }}
          >
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
            <p className="text-[10px] capitalize" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {admin?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ color: '#f87171', minHeight: 40 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={13} /> Sign Out
        </button>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors mt-0.5"
          style={{ color: 'rgba(255,255,255,0.42)', minHeight: 40 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')}
        >
          <Globe size={13} /> View Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0"
        style={{ background: SIDEBAR_BG }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer panel */}
          <aside
            className="relative flex flex-col h-full"
            style={{ width: 272, background: SIDEBAR_BG }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg"
              style={{ color: 'rgba(255,255,255,0.7)' }}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0" style={{ height: 56 }}>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg -ml-1"
            aria-label="Open menu"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Menu size={22} />
          </button>

          {/* Store status indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 hidden sm:block">Store Online</span>
          </div>

          {/* Right: view store + admin avatar */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-800 hidden sm:block"
            >
              View Store →
            </Link>
            <div
              className="rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ width: 32, height: 32, background: G, flexShrink: 0 }}
            >
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
