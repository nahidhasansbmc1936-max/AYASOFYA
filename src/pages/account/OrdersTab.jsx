import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/format';
const G = '#1a3a2a';
export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  useEffect(() => { api.get('/orders/my/orders').then(res=>setOrders(res.data.orders||[])).finally(()=>setLoading(false)); }, []);
  if(loading) return <div className="bg-white rounded-2xl p-6"><div className="animate-pulse space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-20 bg-gray-100 rounded-xl"/>)}</div></div>;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6" style={{fontFamily:"'Playfair Display',serif",color:G}}>My Orders ({orders.length})</h2>
      {orders.length===0?(
        <div className="text-center py-12"><Package size={48} className="mx-auto mb-3" style={{color:'#d1d5db'}}/><p className="text-gray-400">No orders yet</p><Link to="/shop" className="mt-3 inline-block text-white px-6 py-2.5 rounded-xl text-sm font-medium" style={{background:G}}>Shop Now</Link></div>
      ):(
        <div className="space-y-3">
          {orders.map(order=>(
            <div key={order.id} className="border-2 border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={()=>setExpandedId(expandedId===order.id?null:order.id)}>
                <div className="flex items-center gap-4">
                  <div><p className="font-bold text-sm" style={{color:G}}>#{order.order_number}</p><p className="text-xs text-gray-400">{formatDateTime(order.created_at)}</p></div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold" style={{color:G}}>{formatPrice(order.total)}</span>
                  {expandedId===order.id?<ChevronUp size={16} className="text-gray-400"/>:<ChevronDown size={16} className="text-gray-400"/>}
                </div>
              </div>
              {expandedId===order.id&&(
                <div className="border-t p-4 bg-gray-50">
                  <div className="space-y-2 mb-3">
                    {(order.items||[]).map((item,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.image||'/placeholder.jpg'} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-200"/>
                        <div className="flex-1"><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p></div>
                        <p className="text-sm font-bold" style={{color:G}}>{formatPrice(item.total)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
                    <p>Delivery: {order.full_address}, {order.thana}, {order.district}</p>
                    <p>Payment: <span className="capitalize">{order.payment_method}</span></p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
