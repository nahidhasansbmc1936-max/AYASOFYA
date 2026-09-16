import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { imgUrl } from '../../utils/format';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const SECTIONS = [
  { key: 'general', label: 'General', fields: [
    { key: 'site_name', label: 'Site Name', type: 'text' },
    { key: 'site_tagline', label: 'Tagline', type: 'text' },
    { key: 'site_phone', label: 'Phone', type: 'text' },
    { key: 'site_whatsapp', label: 'WhatsApp Number', type: 'text' },
    { key: 'site_email', label: 'Email', type: 'text' },
    { key: 'site_address', label: 'Address', type: 'text' },
    { key: 'about_text', label: 'About Text', type: 'textarea' },
  ]},
  { key: 'appearance', label: 'Appearance', fields: [
    { key: 'primary_color', label: 'Primary Color (Green)', type: 'color' },
    { key: 'secondary_color', label: 'Secondary Color (Gold)', type: 'color' },
    { key: 'header_bg', label: 'Header Background', type: 'color' },
    { key: 'footer_bg', label: 'Footer Background', type: 'color' },
    { key: 'button_color', label: 'Button Color', type: 'color' },
    { key: 'font_family', label: 'Font Family', type: 'text' },
  ]},
  { key: 'delivery', label: 'Delivery', fields: [
    { key: 'delivery_inside_dhaka', label: 'Inside Dhaka (৳)', type: 'number' },
    { key: 'delivery_outside_dhaka', label: 'Outside Dhaka (৳)', type: 'number' },
    { key: 'free_delivery_above', label: 'Free Delivery Above (৳)', type: 'number' },
  ]},
  { key: 'payment', label: 'Payment', fields: [
    { key: 'payment_cod', label: 'Enable Cash on Delivery', type: 'toggle' },
    { key: 'payment_bkash', label: 'Enable bKash', type: 'toggle' },
    { key: 'payment_nagad', label: 'Enable Nagad', type: 'toggle' },
    { key: 'payment_card', label: 'Enable Card Payment', type: 'toggle' },
    { key: 'bkash_number', label: 'bKash Number', type: 'text' },
    { key: 'nagad_number', label: 'Nagad Number', type: 'text' },
  ]},
  { key: 'social', label: 'Social Media', fields: [
    { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
    { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'text' },
  ]},
  { key: 'seo', label: 'SEO', fields: [
    { key: 'seo_title', label: 'Default SEO Title', type: 'text' },
    { key: 'seo_description', label: 'Default Meta Description', type: 'textarea' },
    { key: 'meta_pixel', label: 'Facebook Pixel ID', type: 'text' },
    { key: 'google_analytics', label: 'Google Analytics ID', type: 'text' },
  ]},
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    adminApi.get('/settings/admin/all').then(res => {
      const obj = {};
      (res.data.settings || []).forEach(s => { obj[s.key] = s.value; });
      setSettings(obj);
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.put('/settings/admin', { settings });
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const uploadLogo = async (file, type) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await adminApi.post(`/settings/admin/upload/${type}`, fd);
      setSettings(prev => ({ ...prev, [res.data.key]: res.data.url }));
      toast.success('Uploaded successfully!');
    } catch { toast.error('Upload failed'); }
  };

  const section = SECTIONS.find(s => s.key === activeSection);

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-70" style={{ background: G }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="flex gap-5">
        {/* Section tabs */}
        <aside className="w-44 flex-shrink-0 space-y-1">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: activeSection === s.key ? G : 'transparent', color: activeSection === s.key ? '#fff' : '#4b5563' }}
              onMouseEnter={e => { if (activeSection !== s.key) e.currentTarget.style.background = '#f3f4f6'; }}
              onMouseLeave={e => { if (activeSection !== s.key) e.currentTarget.style.background = 'transparent'; }}>
              {s.label}
            </button>
          ))}
          <button onClick={() => setActiveSection('logo')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: activeSection === 'logo' ? G : 'transparent', color: activeSection === 'logo' ? '#fff' : '#4b5563' }}>
            Logo & Favicon
          </button>
        </aside>

        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
          {activeSection === 'logo' ? (
            <div className="space-y-6">
              <h2 className="font-semibold text-gray-700 text-lg border-b pb-2">Logo & Favicon</h2>
              {[
                { type: 'logo', label: 'Main Logo', key: 'logo_url' },
                { type: 'favicon', label: 'Favicon', key: 'favicon_url' },
                { type: 'mobile_logo', label: 'Mobile Logo', key: 'mobile_logo_url' },
                { type: 'footer_logo', label: 'Footer Logo', key: 'footer_logo_url' },
              ].map(item => (
                <div key={item.type} className="flex items-center gap-5">
                  <div className="w-28 h-16 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: G }}>
                    {settings[item.key]
                      ? <img src={imgUrl(settings[item.key])} alt={item.label} className="max-w-full max-h-full object-contain p-2" />
                      : <span className="text-white/40 text-xs">{item.label}</span>}
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-2">{item.label}</p>
                    <label className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: G, color: G }}>
                      <Upload size={14} /> Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadLogo(e.target.files[0], item.type)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : section ? (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-700 text-lg border-b pb-2">{section.label} Settings</h2>
              {section.fields.map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea value={settings[field.key] || ''} onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.value }))} rows={3}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                      onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  ) : field.type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings[field.key] || '#000000'} onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.value }))} className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer" />
                      <input type="text" value={settings[field.key] || ''} onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.value }))} placeholder="#000000" className="w-32 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                  ) : field.type === 'toggle' ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings[field.key] === '1'} onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.checked ? '1' : '0' }))} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" style={{ '--tw-peer-checked-bg': G }}></div>
                    </label>
                  ) : (
                    <input type={field.type} value={settings[field.key] || ''} onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                      onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
