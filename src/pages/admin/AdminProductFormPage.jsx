import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { imgUrl } from '../../utils/format';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ label, checked, onChange }) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer select-none"
      style={{ minHeight: 40 }}
      onClick={() => onChange(!checked)}
    >
      <div
        className="relative rounded-full transition-colors flex-shrink-0"
        style={{ width: 44, height: 24, background: checked ? G : '#d1d5db' }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(4px)' }}
        />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}

// ── Input helpers ─────────────────────────────────────────────────────────────
const inputCls =
  'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 transition-colors bg-white';
const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminProductFormPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = !!id;

  const [loading, setLoading]               = useState(false);
  const [categories, setCategories]         = useState([]);
  const [imgFiles, setImgFiles]             = useState([]);
  const [imgPreviews, setImgPreviews]       = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    name: '', sku: '', description: '', short_description: '',
    category_id: '', regular_price: '', sale_price: '', stock_quantity: '',
    tags: '', is_featured: false, is_bestseller: false, is_new_arrival: false,
    is_on_offer: false, is_published: true, specifications: '',
    delivery_info: '', return_policy: '', meta_title: '', meta_description: '',
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    adminApi.get('/categories/flat').then((res) => setCategories(res.data.categories || []));

    if (isEdit) {
      adminApi.get('/products/admin/all?limit=1000').then((res) => {
        const p = res.data.products?.find((x) => x.id === id);
        if (p) {
          setForm({
            name: p.name || '', sku: p.sku || '', description: p.description || '',
            short_description: p.short_description || '', category_id: p.category_id || '',
            regular_price: p.regular_price || '', sale_price: p.sale_price || '',
            stock_quantity: p.stock_quantity || '', tags: (p.tags || []).join(', '),
            is_featured: !!p.is_featured, is_bestseller: !!p.is_bestseller,
            is_new_arrival: !!p.is_new_arrival, is_on_offer: !!p.is_on_offer,
            is_published: !!p.is_published, specifications: p.specifications || '',
            delivery_info: p.delivery_info || '', return_policy: p.return_policy || '',
            meta_title: p.meta_title || '', meta_description: p.meta_description || '',
          });
          setExistingImages(p.images || []);
        }
      }).catch(() => {});
    }
  }, [id]);

  const handleImages = (e) => {
    const files = [...e.target.files];
    setImgFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = (ev) => setImgPreviews((prev) => [...prev, ev.target.result]);
      r.readAsDataURL(f);
    });
  };

  const removeNewImage = (i) => {
    setImgPreviews((prev) => prev.filter((_, j) => j !== i));
    setImgFiles((prev) => prev.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, typeof v === 'boolean' ? String(v) : v));
      if (form.tags) {
        const tagsArr = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
        fd.set('tags', JSON.stringify(tagsArr));
      }
      imgFiles.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await adminApi.put(`/products/admin/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await adminApi.post('/products/admin', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          style={{ minWidth: 40, minHeight: 40 }}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/*
          On mobile: single column — options card first so save button is reachable
          without scrolling past all the text fields.
          On large: 2/3 + 1/3 side-by-side.
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">

          {/* ── RIGHT sidebar (rendered first on mobile via order) ── */}
          <div className="lg:col-start-3 lg:row-start-1 space-y-5 order-first lg:order-none">

            {/* Pricing & Stock */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">Pricing & Stock</h2>

              <div>
                <label htmlFor="reg-price" className={labelCls}>Regular Price (৳) *</label>
                <input id="reg-price" type="number" inputMode="decimal" value={form.regular_price}
                  onChange={(e) => set('regular_price', e.target.value)} required placeholder="0"
                  className={inputCls} style={{ fontSize: 16 }} />
              </div>
              <div>
                <label htmlFor="sale-price" className={labelCls}>Sale Price (৳)</label>
                <input id="sale-price" type="number" inputMode="decimal" value={form.sale_price}
                  onChange={(e) => set('sale_price', e.target.value)} placeholder="Leave blank if no discount"
                  className={inputCls} style={{ fontSize: 16 }} />
              </div>
              <div>
                <label htmlFor="stock-qty" className={labelCls}>Stock Quantity</label>
                <input id="stock-qty" type="number" inputMode="numeric" value={form.stock_quantity}
                  onChange={(e) => set('stock_quantity', e.target.value)} placeholder="0"
                  className={inputCls} style={{ fontSize: 16 }} />
              </div>
            </div>

            {/* Product Options */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-1">
              <h2 className="font-semibold text-gray-700 border-b pb-2 mb-3">Product Options</h2>
              <Toggle label="Published"       checked={form.is_published}  onChange={(v) => set('is_published', v)} />
              <Toggle label="Featured Product" checked={form.is_featured}   onChange={(v) => set('is_featured', v)} />
              <Toggle label="Best Seller"      checked={form.is_bestseller} onChange={(v) => set('is_bestseller', v)} />
              <Toggle label="New Arrival"      checked={form.is_new_arrival} onChange={(v) => set('is_new_arrival', v)} />
              <Toggle label="On Offer / Sale"  checked={form.is_on_offer}   onChange={(v) => set('is_on_offer', v)} />
            </div>

            {/* Save button — visible on mobile right below options */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 shadow-md transition-opacity hover:opacity-90"
              style={{ background: GOLD, color: G, minHeight: 52 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : isEdit ? '💾 Update Product' : '✨ Create Product'}
            </button>
          </div>

          {/* ── LEFT main content (2 cols on desktop) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">Basic Information</h2>

              <div>
                <label htmlFor="prod-name" className={labelCls}>Product Name *</label>
                <input id="prod-name" value={form.name} onChange={(e) => set('name', e.target.value)}
                  required placeholder="e.g. Premium Katan Jubba"
                  className={inputCls} style={{ fontSize: 16 }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prod-sku" className={labelCls}>SKU</label>
                  <input id="prod-sku" value={form.sku} onChange={(e) => set('sku', e.target.value)}
                    placeholder="e.g. AYA-001" className={inputCls} style={{ fontSize: 16 }} />
                </div>
                <div>
                  <label htmlFor="prod-cat" className={labelCls}>Category</label>
                  <select id="prod-cat" value={form.category_id}
                    onChange={(e) => set('category_id', e.target.value)}
                    className={inputCls} style={{ fontSize: 16 }}>
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.parent_id ? `  └ ${c.name}` : c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="short-desc" className={labelCls}>Short Description</label>
                <textarea id="short-desc" value={form.short_description}
                  onChange={(e) => set('short_description', e.target.value)}
                  rows={2} placeholder="Brief product description…"
                  className={inputCls + ' resize-none'} style={{ fontSize: 16 }} />
              </div>

              <div>
                <label htmlFor="full-desc" className={labelCls}>Full Description</label>
                <textarea id="full-desc" value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={5} placeholder="Detailed product description…"
                  className={inputCls + ' resize-none'} style={{ fontSize: 16 }} />
              </div>

              <div>
                <label htmlFor="specs" className={labelCls}>Specifications</label>
                <textarea id="specs" value={form.specifications}
                  onChange={(e) => set('specifications', e.target.value)}
                  rows={3} placeholder="Material, size chart, etc."
                  className={inputCls + ' resize-none'} style={{ fontSize: 16 }} />
              </div>

              <div>
                <label htmlFor="tags" className={labelCls}>Tags (comma separated)</label>
                <input id="tags" value={form.tags} onChange={(e) => set('tags', e.target.value)}
                  placeholder="jubba, katan, premium, eid"
                  className={inputCls} style={{ fontSize: 16 }} />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 border-b pb-2 mb-4">Product Images</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {/* Existing images */}
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {/* New image previews */}
                {imgPreviews.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full flex items-center justify-center"
                      style={{ width: 20, height: 20 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {/* Upload button */}
                <label
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-green-700 flex-shrink-0"
                  style={{ minWidth: 80 }}
                >
                  <Upload size={18} className="text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-400 text-center">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400">Tap an image to replace. First image is the main product photo.</p>
            </div>

            {/* Delivery & Returns */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">Delivery & Returns</h2>
              <div>
                <label htmlFor="del-info" className={labelCls}>Delivery Info</label>
                <textarea id="del-info" value={form.delivery_info}
                  onChange={(e) => set('delivery_info', e.target.value)}
                  rows={2} className={inputCls + ' resize-none'} style={{ fontSize: 16 }} />
              </div>
              <div>
                <label htmlFor="ret-pol" className={labelCls}>Return Policy</label>
                <textarea id="ret-pol" value={form.return_policy}
                  onChange={(e) => set('return_policy', e.target.value)}
                  rows={2} className={inputCls + ' resize-none'} style={{ fontSize: 16 }} />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">SEO</h2>
              <div>
                <label htmlFor="meta-title" className={labelCls}>Meta Title</label>
                <input id="meta-title" value={form.meta_title}
                  onChange={(e) => set('meta_title', e.target.value)}
                  placeholder="SEO page title" className={inputCls} style={{ fontSize: 16 }} />
              </div>
              <div>
                <label htmlFor="meta-desc" className={labelCls}>Meta Description</label>
                <textarea id="meta-desc" value={form.meta_description}
                  onChange={(e) => set('meta_description', e.target.value)}
                  rows={2} className={inputCls + ' resize-none'} style={{ fontSize: 16 }} />
              </div>
            </div>

            {/* Second save button at the bottom for convenience on long desktop forms */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 shadow-md transition-opacity hover:opacity-90"
              style={{ background: GOLD, color: G, minHeight: 52 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : isEdit ? '💾 Update Product' : '✨ Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
