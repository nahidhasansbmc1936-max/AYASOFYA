import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';

const G = '#1a3a2a';
const GOLD = '#f5c518';
const FOOTER_BG = '#0d2218';

const FacebookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const InstagramIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const YoutubeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>;

export default function Footer() {
  const { get: getSetting } = useSettingsStore();

  return (
    <footer style={{ background: FOOTER_BG }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div style={{ width: 42, height: 42, background: GOLD, borderRadius: 10 }} className="flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C8 3 4 6 4 11C4 14 6 16 9 17L7 21L10 21L11.5 17.8C11.7 17.9 11.85 18 12 18C16 18 20 15 20 11C20 6 16 3 12 3Z" fill={G}/>
                  <path d="M9 14C7.5 13 6.5 12 6.5 11C6.5 7.5 9 5 12 5C15 5 17.5 7.5 17.5 11C17.5 13 15.5 15.5 12 15.8L13 13C14.5 12.5 15.5 11.8 15.5 11C15.5 8.5 14 7 12 7C10 7 8.5 8.5 8.5 11C8.5 12 9 13 10 13.8Z" fill={GOLD}/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '0.08em' }}>AYASOFYA</div>
                <div style={{ color: GOLD, fontSize: 9, letterSpacing: '0.25em', fontWeight: 600, textTransform: 'uppercase' }}>Fashion & Lifestyle</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {getSetting('about_text', 'AYASOFYA is a premium fashion & lifestyle brand offering curated collections for the modern Muslim family.')}
            </p>
            <div className="space-y-2.5">
              <a href={`tel:${getSetting('site_phone')}`} className="flex items-center gap-2.5 text-sm transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <Phone size={13} style={{ color: GOLD, flexShrink: 0 }} /> {getSetting('site_phone', '+880 1700-000000')}
              </a>
              <a href={`mailto:${getSetting('site_email')}`} className="flex items-center gap-2.5 text-sm transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <Mail size={13} style={{ color: GOLD, flexShrink: 0 }} /> {getSetting('site_email', 'ayasofyabrand@gmail.com')}
              </a>
              <div className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <MapPin size={13} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} /> {getSetting('site_address', 'Dhaka, Bangladesh')}
              </div>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-2.5 mt-5">
              {getSetting('facebook_url') && (
                <a href={getSetting('facebook_url')} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <FacebookIcon />
                </a>
              )}
              {getSetting('instagram_url') && (
                <a href={getSetting('instagram_url')} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <InstagramIcon />
                </a>
              )}
              {getSetting('youtube_url') && (
                <a href={getSetting('youtube_url')} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <YoutubeIcon />
                </a>
              )}
              {getSetting('site_whatsapp') && (
                <a href={`https://wa.me/${getSetting('site_whatsapp').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#25D366'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <MessageCircle size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: GOLD }}>Important Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', url: '/about' },
                { label: 'Contact Us', url: '/contact' },
                { label: 'Blog', url: '/blog' },
                { label: 'Offer Sale', url: '/offers' },
                { label: 'Track Order', url: '/track-order' },
                { label: 'My Account', url: '/account' },
              ].map(link => (
                <li key={link.url}>
                  <Link to={link.url} className="flex items-center gap-2 text-sm transition-colors hover:opacity-100" style={{ color: 'rgba(255,255,255,0.65)' }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                    <span style={{ width: 5, height: 5, background: GOLD, borderRadius: '50%', flexShrink: 0 }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: GOLD }}>Categories</h4>
            <ul className="space-y-2">
              {[
                { label: 'Cloth', url: '/category/cloth' },
                { label: "Women's Collection", url: '/category/womens-collection' },
                { label: "Men's Collection", url: '/category/mens-collection' },
                { label: 'Perfume', url: '/category/perfume' },
                { label: 'Watch', url: '/category/watch' },
                { label: 'Shoes', url: '/category/shoes' },
                { label: 'Sunnah', url: '/category/sunnah' },
              ].map(link => (
                <li key={link.url}>
                  <Link to={link.url} className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                    <span style={{ width: 5, height: 5, background: GOLD, borderRadius: '50%', flexShrink: 0 }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: GOLD }}>Customer Service</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', url: '/privacy-policy' },
                { label: 'Return & Refund', url: '/return-refund-policy' },
                { label: 'Terms & Conditions', url: '/terms-conditions' },
                { label: 'FAQ', url: '/faq' },
              ].map(link => (
                <li key={link.url}>
                  <Link to={link.url} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                    <span style={{ width: 5, height: 5, background: GOLD, borderRadius: '50%', flexShrink: 0 }}></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h5 className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Payment Methods</h5>
              <div className="flex flex-wrap gap-2">
                {['VISA', 'Mastercard', 'bKash', 'Nagad', 'COD'].map(m => (
                  <span key={m} className="text-xs px-2.5 py-1 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>© 2024 AYASOFYA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>ayasofyabrand@gmail.com</p>
            <Link
              to="/admin/login"
              className="text-xs font-medium transition-opacity hover:opacity-80"
              style={{ color: GOLD, opacity: 0.6 }}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      {getSetting('site_whatsapp') && (
        <a href={`https://wa.me/${getSetting('site_whatsapp').replace(/\D/g,'')}`}
          target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-5 z-40 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:scale-110 transition-transform lg:bottom-8"
          style={{ background: '#25D366' }}
          title="Chat on WhatsApp">
          <MessageCircle size={26} />
        </a>
      )}
    </footer>
  );
}
