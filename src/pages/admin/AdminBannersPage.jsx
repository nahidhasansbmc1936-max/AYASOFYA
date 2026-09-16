/**
 * Admin: Banners & Sliders
 *
 * Hero banner field mapping:
 *   button_text / button_url  → Button 1 (e.g. OFFER SALE)
 *   heading     / subheading  → Button 2 text / Button 2 URL (e.g. EID COLLECTION)
 *   subtitle                  → leave empty (unused for hero)
 *   desktop_image             → Hero background image
 *
 * Leave "heading" blank to hide Button 2.
 * Leave "button_text" blank to hide Button 1.
 */

import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Edit2 } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { imgUrl } from '../../utils/format';
import toast from 'react-hot-toast';

const G    = '#1a3a2a';
const GOLD = '#f5c518';

const EMPTY_FORM = {
  title:       '',
  button_text: 'OFFER SALE',
  button_url:  '/offers',
  heading:     'EID COLLECTION',   // btn2 text
  subheading:  '/category/cloth',  // btn2 url
  sort_order:  0,
  type:        'hero',
  // subtitle & subheading reused — leave other fields empty
  subtitle:    '',
};

const ic  = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 transition-colors';

export default function AdminBannersPage() {
  const [banners,     setBanners]     = useState([]);
  const [showForm,    setShowForm]    = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile,  setMobileFile]  = useState(null);
  const [saving,      setSaving]      = useState(false);

  const fetchBanners = () =>
    adminApi.get('/settings/admin/banners').then(res => setBanners(res.data.banners || []));

  useEffect(() => { fetchBanners(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setDesktopFile(null);
    setMobileFile(null);
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditId(b.id);
    setForm({
      title:      b.title      || '',
      button_text: b.button_text || '',
      button_url:  b.button_url  || '',
      heading:    b.heading    || '',   // btn2 text
      subheading: b.subheading || '',   // btn2 url
      sort_order: b.sort_order || 0,
      type:       b.type       || 'hero',
      subtitle:   b.subtitle   || '',
    });
    setDesktopFile(null);
    setMobileFile(null);
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (desktopFile) fd.append('desktop_image', desktopFile);
      if (mobileFile)  fd.append('mobile_image',  mobileFile);

      if (editId) {
        await adminApi.put(`/settings/admin/banners/${editId}`, fd);
        toast.success('Banner updated!');
      } else {
        await adminApi.post('/settings/admin/banners', fd);
        toast.success('Banner created!');
      }
      setShowForm(false);
      setEditId(null);
      setDesktopFile(null);
      setMobileFile(null);
      fetchBanners();
    } catch {
      toast.error('Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await adminApi.delete(`/settings/admin/banners/${id}`);
    fetchBanners();
    toast.success('Deleted');
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Banners & Sliders</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: G }}
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4 text-gray-800">
            {editId ? 'Edit Banner' : 'New Banner'}
          </h2>
          <form onSubmit={save} className="space-y-5">

            {/* Internal title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Internal Title *
              </label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                required
                placeholder="e.g. Eid Sale Banner"
                className={ic}
                style={{ fontSize: 16 }}
              />
            </div>

            {/* Button 1 */}
            <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                Button 1 (Solid — e.g. OFFER SALE)
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Button Text
                  </label>
                  <input
                    value={form.button_text}
                    onChange={e => set('button_text', e.target.value)}
                    placeholder="OFFER SALE"
                    className={ic}
                    style={{ fontSize: 16 }}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Leave blank to hide this button</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Button Link
                  </label>
                  <input
                    value={form.button_url}
                    onChange={e => set('button_url', e.target.value)}
                    placeholder="/offers"
                    className={ic}
                    style={{ fontSize: 16 }}
                  />
                </div>
              </div>
            </div>

            {/* Button 2 */}
            <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: G }}>
                Button 2 (Outline — e.g. EID COLLECTION)
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Button Text
                  </label>
                  <input
                    value={form.heading}
                    onChange={e => set('heading', e.target.value)}
                    placeholder="EID COLLECTION"
                    className={ic}
                    style={{ fontSize: 16 }}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Leave blank to hide this button</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Button Link
                  </label>
                  <input
                    value={form.subheading}
                    onChange={e => set('subheading', e.target.value)}
                    placeholder="/category/cloth"
                    className={ic}
                    style={{ fontSize: 16 }}
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Desktop Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setDesktopFile(e.target.files[0])}
                  className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-3"
                />
                {form.desktop_image && (
                  <img
                    src={imgUrl(form.desktop_image)}
                    alt="current"
                    className="mt-2 h-16 rounded-lg object-cover"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Mobile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setMobileFile(e.target.files[0])}
                  className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => set('sort_order', e.target.value)}
                className={ic}
                style={{ fontSize: 16, maxWidth: 120 }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-2.5 text-white rounded-xl font-semibold text-sm disabled:opacity-70"
                style={{ background: GOLD, color: G }}
              >
                {saving ? 'Saving…' : editId ? 'Update Banner' : 'Create Banner'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditId(null); }}
                className="px-7 py-2.5 border text-gray-600 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Banner list ── */}
      <div className="grid gap-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
            {/* Preview */}
            <div
              className="w-24 h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${G}, #2a5c3f)` }}
            >
              {banner.desktop_image
                ? <img src={imgUrl(banner.desktop_image)} alt={banner.title} className="w-full h-full object-cover" />
                : <ImageIcon size={22} className="text-white/40" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate">{banner.title}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {banner.button_text && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: GOLD, color: G }}
                  >
                    {banner.button_text}
                  </span>
                )}
                {banner.heading && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded border"
                    style={{ borderColor: G, color: G }}
                  >
                    {banner.heading}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {banner.is_active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => openEdit(banner)}
                className="p-1.5 text-white rounded-lg"
                style={{ background: G }}
                title="Edit"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => del(banner.id)}
                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl">
            No banners yet — click "Add Banner" to create one
          </div>
        )}
      </div>
    </div>
  );
}
