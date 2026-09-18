/**
 * PHOTO GALLERY
 * Master image library — all uploaded images live here permanently.
 * Images are stored as base64 in the database, so they never disappear
 * even when Render restarts or the ephemeral filesystem is wiped.
 */
import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Copy, X, ZoomIn } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { imgUrl } from '../../utils/format';
import toast from 'react-hot-toast';

const G    = '#1a3a2a';
const GOLD = '#f5c518';

export default function AdminMediaPage() {
  const [files,     setFiles]     = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(null); // enlarged preview
  const inputRef = useRef();

  const fetch = () => {
    setLoading(true);
    adminApi.get('/media?limit=100').then(res => {
      setFiles(res.data.files || []);
      setTotal(res.data.total || 0);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const upload = async (e) => {
    const selected = [...e.target.files];
    if (!selected.length) return;
    setUploading(true);
    const fd = new FormData();
    selected.forEach(f => fd.append('files', f));
    try {
      await adminApi.post('/media/upload', fd);
      toast.success(`${selected.length} image(s) uploaded to Photo Gallery!`);
      fetch();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const softDelete = async (id) => {
    await adminApi.delete(`/media/${id}`);
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success('Moved to trash');
  };

  const copy = (url) => {
    const full = imgUrl(url);
    navigator.clipboard.writeText(full);
    toast.success('URL copied to clipboard');
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Photo Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} image{total !== 1 ? 's' : ''} — stored permanently in database
          </p>
        </div>
        <label
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: G, minHeight: 44 }}
        >
          <Upload size={16} />
          {uploading ? 'Uploading…' : 'Upload Images'}
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={upload} disabled={uploading} />
        </label>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl text-sm" style={{ background: `${G}10`, border: `1px solid ${G}25` }}>
        <span className="text-green-700 font-bold flex-shrink-0">✓</span>
        <p className="text-gray-600">
          Images are saved directly in the database — they <strong>never disappear</strong> after server restart or deploy.
          Use Photo Gallery images when adding products to avoid re-uploading the same file.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: '#f9f9f9', border: '2px dashed #e5e7eb' }}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">No images yet</p>
          <p className="text-gray-300 text-sm mt-1">Click to upload your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {files.map(file => (
            <div
              key={file.id}
              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-green-700 transition-all bg-gray-100"
            >
              <img
                src={imgUrl(file.url)}
                alt={file.alt_text || file.original_name}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                <button
                  onClick={() => setPreview(file)}
                  className="p-1.5 bg-white/90 rounded-lg hover:bg-white"
                  title="Preview"
                >
                  <ZoomIn size={13} className="text-gray-700" />
                </button>
                <button
                  onClick={() => copy(file.url)}
                  className="p-1.5 bg-white/90 rounded-lg hover:bg-white"
                  title="Copy URL"
                >
                  <Copy size={13} className="text-gray-700" />
                </button>
                <button
                  onClick={() => softDelete(file.id)}
                  className="p-1.5 bg-red-500 rounded-lg hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-medium text-sm text-gray-800 truncate">{preview.original_name}</p>
              <button onClick={() => setPreview(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <img
              src={imgUrl(preview.url)}
              alt={preview.original_name}
              className="w-full max-h-[60vh] object-contain bg-gray-50"
            />
            <div className="px-4 py-3 flex items-center justify-between border-t">
              <div className="text-xs text-gray-500 space-x-3">
                <span>{formatSize(preview.size)}</span>
                <span>{preview.mimetype}</span>
                <span>{new Date(preview.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { copy(preview.url); }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg text-white"
                  style={{ background: G }}
                >
                  Copy URL
                </button>
                <button
                  onClick={() => { softDelete(preview.id); setPreview(null); }}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
