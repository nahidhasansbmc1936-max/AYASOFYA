export const formatPrice = (price) => {
  if (price == null) return '৳0';
  return `৳${Number(price).toLocaleString('en-BD')}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-BD', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    packed: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status) => {
  const map = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', packed: 'Packed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned' };
  return map[status] || status;
};

export const truncate = (str, n = 80) => str?.length > n ? str.slice(0, n) + '...' : str;

export const imgUrl = (p) => {
  if (!p) return '/placeholder.jpg';
  if (p.startsWith('http')) return p;
  // Both /api/media/img/:id and /uploads/... paths need the backend prefix in production
  const backend = (import.meta.env.VITE_API_URL || 'https://ayasofya-backend.onrender.com').replace(/\/$/, '');
  return backend + p;
};
