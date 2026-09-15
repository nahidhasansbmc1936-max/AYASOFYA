import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Printer, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice, formatDateTime, getStatusLabel } from '../utils/format';
import useSettingsStore from '../store/useSettingsStore';
const G='#1a3a2a';const GOLD='#f5c518';
export default function OrderConfirmationPage() {
  const {state}=useLocation();
  const order=state?.order;
  const whatsappUrl=state?.whatsapp_url;
  const {get:getSetting}=useSettingsStore();
  if(!order) return(<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-xl font-bold text-gray-600">No order found</h2><Link to="/" className="mt-2 block" style={{color:G}}>Go Home</Link></div></div>);
  const items=order.items||[];
  return(
    <div className="min-h-screen py-10" style={{background:'#fffbe6'}}>
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="space-y-5">
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring'}}>
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{fontFamily:"'Playfair Display',serif",color:G}}>Order Placed Successfully!</h1>
            <p className="text-gray-500 mb-4">Thank you for shopping with AYASOFYA.</p>
            <div className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-bold text-lg" style={{background:G}}>
              Order #{order.order_number}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold mb-4 border-b pb-2" style={{color:G}}>Order Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Customer</p><p className="font-medium">{order.customer_name}</p></div>
              <div><p className="text-gray-400 text-xs">Phone</p><p className="font-medium">{order.customer_phone}</p></div>
              <div><p className="text-gray-400 text-xs">Payment</p><p className="font-medium capitalize">{order.payment_method}</p></div>
              <div><p className="text-gray-400 text-xs">Status</p><p className="font-medium text-orange-500">{getStatusLabel(order.status)}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Delivery Address</p><p className="font-medium">{order.full_address}, {order.thana}, {order.district}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold mb-4 border-b pb-2" style={{color:G}}>Ordered Items</h2>
            <div className="space-y-3">
              {items.map((item,i)=>(
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <img src={item.image||'/placeholder.jpg'} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-gray-100"/>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {Object.entries(item.variations||{}).map(([k,v])=><p key={k} className="text-xs text-gray-400">{k}: {v}</p>)}
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold" style={{color:G}}>{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-sm border-t pt-3">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount_amount>0&&<div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.delivery_charge===0?'FREE':formatPrice(order.delivery_charge)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-1.5" style={{color:G}}><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {whatsappUrl&&<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm" style={{background:'#25D366'}}><MessageCircle size={18}/>WhatsApp Order</a>}
            <button onClick={()=>window.print()} className="flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm" style={{background:G}}><Printer size={18}/>Print Invoice</button>
            <a href={`tel:${getSetting('site_phone')}`} className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm border-2" style={{borderColor:G,color:G}}><Phone size={18}/>Call Shop</a>
            <Link to="/shop" className="flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm" style={{background:GOLD,color:G}}>Continue Shopping</Link>
          </div>
          <div className="rounded-xl p-4 text-white text-center" style={{background:G}}>
            <p className="text-sm mb-2">Track your order status anytime</p>
            <Link to={`/track-order?order=${order.order_number}`} className="inline-block text-white px-6 py-2 rounded-lg text-sm font-bold" style={{background:GOLD,color:G}}>Track Order</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
