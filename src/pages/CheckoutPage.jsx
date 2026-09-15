import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { formatPrice } from '../utils/format';
import api from '../api/axios';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';
const DISTRICTS = ['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barishal','Mymensingh','Rangpur','Comilla','Narayanganj','Gazipur','Other'];
const PAYMENTS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
  { id: 'bkash', label: 'bKash', icon: '📱', desc: 'bKash mobile banking' },
  { id: 'nagad', label: 'Nagad', icon: '📲', desc: 'Nagad mobile banking' },
  { id: 'card', label: 'Card Payment', icon: '💳', desc: 'Visa / Mastercard' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getSubtotal, coupon, couponDiscount, clearCart } = useCartStore();
  const { customer } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  const deliveryType = location.state?.deliveryType || 'outside';
  const subtotal = getSubtotal();
  const deliveryCharge = location.state?.deliveryCharge ?? (subtotal >= 2000 ? 0 : (deliveryType === 'inside' ? 60 : 120));
  const total = subtotal - couponDiscount + deliveryCharge;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { customer_name: customer?.name || '', customer_phone: customer?.phone || '', customer_email: customer?.email || '' }
  });

  if (items.length === 0) { navigate('/cart'); return null; }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const orderItems = items.map(item => ({ product_id: item.id, quantity: item.quantity, variations: item.variations }));
      const res = await api.post('/orders', { ...data, items: orderItems, payment_method: paymentMethod, delivery_type: deliveryType, coupon_code: coupon?.code });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { state: { order: res.data.order, whatsapp_url: res.data.whatsapp_url } });
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to place order'); }
    finally { setSubmitting(false); }
  };

  const Field = ({ label, error, children }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  const inputStyle = { transition: 'border-color 0.2s' };

  return (
    <div className="min-h-screen py-8" style={{ background: '#fffbe6' }}>
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "'Playfair Display',serif", color: G }}>Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Customer info */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 text-white rounded-full text-xs flex items-center justify-center font-bold" style={{ background: G }}>1</span>
                  Customer Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name *" error={errors.customer_name?.message}>
                    <input {...register('customer_name', { required: 'Name is required' })} placeholder="Your full name" className={inputClass} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                  <Field label="Mobile Number *" error={errors.customer_phone?.message}>
                    <input {...register('customer_phone', { required: 'Phone is required' })} placeholder="01XXXXXXXXX" className={inputClass} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                  <Field label="Email (optional)">
                    <input {...register('customer_email')} type="email" placeholder="your@email.com" className={`${inputClass} sm:col-span-2`} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 text-white rounded-full text-xs flex items-center justify-center font-bold" style={{ background: G }}>2</span>
                  Delivery Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="District *" error={errors.district?.message}>
                    <select {...register('district', { required: 'District is required' })} className={inputClass + ' bg-white'} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                      <option value="">Select District</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Thana / Upazila *" error={errors.thana?.message}>
                    <input {...register('thana', { required: 'Thana is required' })} placeholder="Thana / Upazila" className={inputClass} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                  <Field label="Area / Village">
                    <input {...register('area')} placeholder="Area / Village" className={inputClass} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                  <Field label="Full Address *" error={errors.full_address?.message}>
                    <input {...register('full_address', { required: 'Address is required' })} placeholder="House, Road, Block..." className={inputClass} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </Field>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Order Note</label>
                    <textarea {...register('order_note')} rows={2} placeholder="Special instructions..." className={inputClass + ' resize-none'} style={inputStyle} onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 text-white rounded-full text-xs flex items-center justify-center font-bold" style={{ background: G }}>3</span>
                  Payment Method
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PAYMENTS.map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                      style={{ borderColor: paymentMethod === method.id ? G : '#e5e7eb', background: paymentMethod === method.id ? '#f0f7f0' : '#fff' }}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ accentColor: G }} />
                      <span className="text-xl">{method.icon}</span>
                      <div><p className="font-semibold text-sm text-gray-800">{method.label}</p><p className="text-xs text-gray-500">{method.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
                <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.key} className="flex gap-3">
                      <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                        {Object.entries(item.variations || {}).map(([k, v]) => <p key={k} className="text-xs text-gray-400">{k}: {v}</p>)}
                        <p className="text-sm font-bold" style={{ color: G }}>{formatPrice(item.price * item.quantity)} <span className="text-xs text-gray-400 font-normal">×{item.quantity}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                  <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span></div>
                  <div className="border-t pt-2 flex justify-between font-bold text-base" style={{ color: G }}><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <button type="submit" disabled={submitting} className="w-full mt-5 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-md disabled:opacity-70 text-sm"
                  style={{ background: GOLD, color: G }}>
                  {submitting ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Placing Order...</> : <><ShieldCheck size={17} />Place Order</>}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure & protected checkout</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
