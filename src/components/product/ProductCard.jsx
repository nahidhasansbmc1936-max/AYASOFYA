import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice, imgUrl } from '../../utils/format';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function ProductCard({ product, index = 0 }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { customer } = useAuthStore();

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const img = imgUrl(images[0]);
  const price = product.sale_price || product.regular_price;
  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
  const discount = hasDiscount ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100) : 0;
  const outOfStock = product.stock_status === 'out_of_stock';

  const handleAddToCart = (e) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    addItem(product, 1, {});
    toast.success(`${product.name} added to cart!`, { icon: '🛒', duration: 2000 });
    setTimeout(() => setAdding(false), 500);
  };

  const handleWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!customer) { toast.error('Please login to add to wishlist'); return; }
    try {
      const res = await api.post(`/customers/wishlist/${product.id}`);
      setWishlisted(res.data.added);
      toast.success(res.data.message);
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}
      className="product-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          {img ? (
            <img src={img} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: '#fffbe6' }}>👔</div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && discount > 0 && (
              <span className="badge-discount">{discount}% OFF</span>
            )}
            {product.is_new_arrival && !hasDiscount && (
              <span className="badge-new">NEW</span>
            )}
            {product.is_bestseller && (
              <span className="badge-hot">HOT</span>
            )}
          </div>

          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded">Out of Stock</span>
            </div>
          )}

          {/* Wishlist */}
          <button onClick={handleWishlist} className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-all opacity-0 group-hover:opacity-100">
            <Heart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
          </button>

          {/* Quick add */}
          <div className="product-actions absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2">
              <button onClick={handleAddToCart} disabled={outOfStock || adding}
                className="flex-1 text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                style={{ background: GOLD, color: G }}>
                <ShoppingCart size={13} />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <Link to={`/product/${product.slug}`} className="flex items-center justify-center w-9 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg" title="View">
                <Zap size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs font-medium mb-1 truncate" style={{ color: G }}>{product.category_name || ''}</p>
          <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          {product.rating_count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.round(product.rating_avg) ? GOLD : 'none'} style={{ color: s <= Math.round(product.rating_avg) ? GOLD : '#d1d5db' }} />)}
              </div>
              <span className="text-xs text-gray-400">({product.rating_count})</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: G }}>{formatPrice(price)}</span>
            {hasDiscount && <span className="text-xs text-gray-400 line-through">{formatPrice(product.regular_price)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
