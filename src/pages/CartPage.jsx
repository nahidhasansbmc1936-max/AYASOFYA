import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import { formatPrice } from '../utils/format';
import api from '../api/axios';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, coupon, couponDiscount, setCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState('outside');
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal >= 2000 ? 0 : (deliveryType === 'inside' ? 60 : 120);
  const total = subtotal - couponDiscount + deliveryCharge;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await api.post('/orders/validate-coupon', { code: couponCode, subtotal });
      setCoupon(res.data.coupon, res.data.discount);
      toast.success(`Coupon applied! You save ${formatPrice(res.data.discount)}`);
      setCouponCode('');
    } catch (err) { toast.error(err.response?.data?.error || 'Invalid coupon'); }
    finally { setCouponLoading(false); }
  };

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fffbe6' }}>
      <div className="text-center">
        <ShoppingBag size={64} className="mx-auto mb-4" style={{ color: '#d1d5db' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display',serif", color: G }}>Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to continue shopping</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: G }}>
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8" style={{ background: '#fffbe6' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "'Playfair Display',serif", color: G }}>Shopping Cart ({items.length})</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.key} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
                  <Link to={`/product/${item.slug}`}>
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="font-semibold text-gray-800 text-sm md:text-base hover:opacity-80 line-clamp-2 block" style={{ color: G }}>{item.name}</Link>
                    {Object.entries(item.variations || {}).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.variations).map(([k, v]) => (
                          <span key={k} className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#fffbe6', color: G }}>{k}: {v}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Minus size={13} /></button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Plus size={13} /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold" style={{ color: G }}>{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.key)} className="text-gray-400 hover:text-red-500 p-1 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium mt-2 hover:opacity-70" style={{ color: G }}>← Continue Shopping</Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Delivery */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Delivery Area</h3>
              {[{ val: 'inside', label: 'Inside Dhaka', price: '৳60' }, { val: 'outside', label: 'Outside Dhaka', price: '৳120' }].map(opt => (
                <label key={opt.val} className="flex items-center justify-between cursor-pointer p-2.5 rounded-lg border-2 transition-all mb-2"
                  style={{ borderColor: deliveryType === opt.val ? G : '#e5e7eb' }}>
                  <div className="flex items-center gap-2">
                    <input type="radio" value={opt.val} checked={deliveryType === opt.val} onChange={e => setDeliveryType(e.target.value)} style={{ accentColor: G }} />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: G }}>{subtotal >= 2000 ? 'FREE' : opt.price}</span>
                </label>
              ))}
              {subtotal >= 2000 && <p className="text-xs text-green-600 mt-2 text-center">🎉 You qualify for free delivery!</p>}
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-1.5"><Tag size={15} style={{ color: GOLD }} /> Coupon Code</h3>
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2.5 rounded-lg">
                  <div><p className="text-xs font-bold text-green-700">{coupon.code} applied!</p><p className="text-xs text-green-600">Saving {formatPrice(couponDiscount)}</p></div>
                  <button onClick={removeCoupon} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none uppercase" onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  <button onClick={applyCoupon} disabled={couponLoading || !couponCode} className="px-4 py-2 text-white rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: G }}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="font-medium">{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span></div>
                <div className="border-t pt-2.5 flex justify-between font-bold text-base" style={{ color: G }}>
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout', { state: { deliveryType, deliveryCharge } })}
                className="w-full mt-5 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-md text-sm tracking-wide"
                style={{ background: GOLD, color: G }}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
