import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Phone, User, Heart, ShoppingCart, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';
import useSettingsStore from '../../store/useSettingsStore';
import { imgUrl } from '../../utils/format';

// Brand colors from AYASOFYA identity
const G = '#1a3a2a';   // Dark Green
const GOLD = '#f5c518'; // Bright Golden Yellow

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'All Products', url: '/shop' },
  { label: 'Cloth', url: '/category/cloth', children: [
    { label: 'Jubba', url: '/category/jubba' },
    { label: 'Panjabi', url: '/category/panjabi' },
    { label: 'Three Piece', url: '/category/three-piece' },
    { label: 'Katan', url: '/category/katan' },
    { label: 'T-Shirt', url: '/category/t-shirt' },
    { label: 'Waistcoat', url: '/category/waistcoat' },
  ]},
  { label: "Women's Collection", url: '/category/womens-collection', children: [
    { label: 'Abaya', url: '/category/abaya' },
    { label: 'Hijab', url: '/category/hijab' },
    { label: 'Salat Hijab', url: '/category/salat-hijab' },
    { label: 'Dresses', url: '/category/dresses' },
  ]},
  { label: "Men's Collection", url: '/category/mens-collection' },
  { label: 'Offer Sale', url: '/offers', highlight: true },
  { label: 'Perfume', url: '/category/perfume', children: [
    { label: 'Arabic Perfume', url: '/category/arabic-perfume' },
    { label: 'Premium Perfume', url: '/category/premium-perfume' },
  ]},
  { label: 'Watch', url: '/category/watch' },
  { label: 'Shoes', url: '/category/shoes' },
  { label: 'Sunnah', url: '/category/sunnah' },
  { label: 'Blog', url: '/blog' },
];

// AYASOFYA Logo SVG — matches the brand image (golden A with swirl on dark green)
function AyasofyaLogo({ size = 'md' }) {
  const h = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;
  return (
    <div className="flex items-center gap-2.5">
      {/* Icon */}
      <div style={{ width: h, height: h, background: GOLD, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={h * 0.6} height={h * 0.6} viewBox="0 0 24 24" fill="none">
          <path d="M12 3 C8 3 4 6 4 11 C4 14 6 16 9 17 L7 21 L10 21 L11.5 17.8 C11.7 17.9 11.85 18 12 18 C16 18 20 15 20 11 C20 6 16 3 12 3 Z" fill={G} />
          <path d="M9 14 C7.5 13 6.5 12 6.5 11 C6.5 7.5 9 5 12 5 C15 5 17.5 7.5 17.5 11 C17.5 13 15.5 15.5 12 15.8 L13 13 C14.5 12.5 15.5 11.8 15.5 11 C15.5 8.5 14 7 12 7 C10 7 8.5 8.5 8.5 11 C8.5 12 9 13 10 13.8 Z" fill={GOLD} />
        </svg>
      </div>
      {/* Text */}
      <div className="hidden sm:block">
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: size === 'sm' ? 16 : 20, color: '#fff', letterSpacing: '0.08em', lineHeight: 1.1 }}>
          AYASOFYA
        </div>
        <div style={{ color: GOLD, fontSize: 9, letterSpacing: '0.25em', fontWeight: 600, textTransform: 'uppercase' }}>
          Fashion & Lifestyle
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCartStore();
  const { customer, logout } = useAuthStore();
  const { get: getSetting } = useSettingsStore();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); setAccountOpen(false); }, [location.pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartCount = getItemCount();
  const phone = getSetting('site_phone', '+880 1700-000000');

  return (
    <>
      {/* Top announcement bar */}
      <div style={{ background: '#0d2218', color: '#fff' }} className="text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>🚚 Free delivery on orders above ৳2000 | Cash on delivery available</span>
          <a href={`tel:${phone}`} style={{ color: GOLD }} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Phone size={11} /> {phone}
          </a>
        </div>
      </div>

      {/* Main header */}
      <header style={{ background: G }} className={`text-white header-sticky transition-shadow duration-300 ${scrolled ? 'shadow-2xl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu */}
            <button className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/10" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo — uses uploaded logo_url from settings if available, else SVG fallback */}
            <Link to="/" className="flex-shrink-0">
              {getSetting('logo_url')
                ? <img src={imgUrl(getSetting('logo_url'))} alt={getSetting('site_name','AYASOFYA')} style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
                : <AyasofyaLogo />}
            </Link>

            {/* Search — desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full px-4 py-2.5 text-sm text-gray-800 bg-white rounded-l-lg focus:outline-none"
                  style={{ '--tw-ring-color': GOLD }}
                />
                <button type="submit" style={{ background: GOLD }} className="hover:opacity-90 px-5 py-2.5 rounded-r-lg transition-opacity">
                  <Search size={18} style={{ color: G }} />
                </button>
              </form>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search toggle */}
              <button className="md:hidden p-2 hover:bg-white/10 rounded-lg" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={20} />
              </button>

              {/* Phone */}
              <a href={`tel:${phone}`} className="hidden sm:flex flex-col items-center p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone size={18} />
                <span className="text-[10px] font-medium mt-0.5" style={{ color: GOLD }}>Call</span>
              </a>

              {/* Account */}
              <div className="relative">
                <button className="flex flex-col items-center p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setAccountOpen(!accountOpen)}>
                  <User size={20} />
                  <span className="text-[10px] font-medium mt-0.5 hidden sm:block" style={{ color: GOLD }}>Account</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    {customer ? (
                      <>
                        <div className="px-4 py-3 border-b" style={{ background: '#f0f7f0' }}>
                          <p className="text-xs text-gray-500">Hello,</p>
                          <p className="font-bold text-sm truncate" style={{ color: G }}>{customer.name}</p>
                        </div>
                        <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <User size={14} /> My Account
                        </Link>
                        <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                        <Link to="/account/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Wishlist</Link>
                        <button onClick={() => { logout(); setAccountOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center gap-2 px-4 py-3 text-sm font-bold hover:bg-gray-50" style={{ color: G }}>Sign In</Link>
                        <Link to="/register" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">Create Account</Link>
                        <div className="border-t px-4 py-2.5">
                          <Link to="/track-order" className="text-xs text-gray-400 hover:text-gray-600">Track Order</Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to={customer ? "/account/wishlist" : "/login"} className="flex flex-col items-center p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Heart size={20} />
                <span className="text-[10px] font-medium mt-0.5 hidden sm:block" style={{ color: GOLD }}>Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex flex-col items-center p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                <div className="relative">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span style={{ background: GOLD, color: G }} className="absolute -top-2 -right-2 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-0.5 hidden sm:block" style={{ color: GOLD }}>Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden mt-3">
              <form onSubmit={handleSearch} className="flex">
                <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..." className="flex-1 px-4 py-2.5 text-sm text-gray-800 bg-white rounded-l-lg focus:outline-none" />
                <button type="submit" style={{ background: GOLD }} className="px-4 py-2.5 rounded-r-lg">
                  <Search size={16} style={{ color: G }} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <nav style={{ background: '#152e22' }} className="hidden lg:block border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center">
              {NAV_ITEMS.map(item => (
                <li key={item.url} className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.url)}
                  onMouseLeave={() => setOpenDropdown(null)}>
                  <Link to={item.url}
                    className="flex items-center gap-1 px-3.5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap"
                    style={{ color: item.highlight ? GOLD : (location.pathname === item.url ? GOLD : 'rgba(255,255,255,0.88)') }}>
                    {item.label}
                    {item.children && <ChevronDown size={11} className="opacity-60" />}
                  </Link>
                  {item.children && openDropdown === item.url && (
                    <div className="absolute top-full left-0 bg-white rounded-b-xl shadow-2xl min-w-[190px] z-50 py-1.5"
                      style={{ borderTop: `3px solid ${GOLD}` }}>
                      {item.children.map(child => (
                        <Link key={child.url} to={child.url}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          style={{ borderLeft: '3px solid transparent' }}
                          onMouseEnter={e => e.currentTarget.style.borderLeftColor = GOLD}
                          onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'transparent'}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[85%] max-w-sm h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div style={{ background: G }} className="px-4 py-4 flex justify-between items-center flex-shrink-0">
              <AyasofyaLogo size="sm" />
              <button onClick={() => setMobileOpen(false)} className="text-white p-1"><X size={22} /></button>
            </div>
            {customer && (
              <div style={{ background: '#f0f7f0' }} className="px-4 py-3 border-b">
                <p className="text-xs text-gray-500">Hello,</p>
                <p className="font-bold" style={{ color: G }}>{customer.name}</p>
              </div>
            )}
            <ul className="flex-1 py-1">
              {NAV_ITEMS.map(item => (
                <li key={item.url} className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <Link to={item.url} className="flex-1 px-4 py-3.5 text-sm font-medium"
                      style={{ color: item.highlight ? '#d4920a' : '#1a1a1a' }}>
                      {item.label}
                    </Link>
                    {item.children && (
                      <button className="px-4 py-3.5 text-gray-400" onClick={() => setOpenDropdown(openDropdown === item.url ? null : item.url)}>
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === item.url ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {item.children && openDropdown === item.url && (
                    <div className="bg-gray-50 pl-6 border-t border-gray-100">
                      {item.children.map(child => (
                        <Link key={child.url} to={child.url} className="block px-4 py-2.5 text-sm text-gray-600 border-b border-gray-100 last:border-0">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="p-4 border-t" style={{ background: '#f9f9f9' }}>
              {customer ? (
                <div className="space-y-2">
                  <Link to="/account" style={{ background: G }} className="block w-full text-center py-2.5 text-white rounded-xl text-sm font-bold">My Account</Link>
                  <button onClick={logout} className="block w-full text-center py-2.5 border border-red-300 text-red-500 rounded-xl text-sm">Sign Out</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" style={{ background: G }} className="block w-full text-center py-2.5 text-white rounded-xl text-sm font-bold">Sign In</Link>
                  <Link to="/register" className="block w-full text-center py-2.5 text-sm rounded-xl border-2 font-semibold" style={{ borderColor: G, color: G }}>Create Account</Link>
                </div>
              )}
              <a href={`tel:${phone}`} style={{ color: G }} className="flex items-center justify-center gap-2 mt-3 text-sm font-medium">
                <Phone size={14} /> {phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {accountOpen && <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />}
    </>
  );
}
