import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, MessageCircle } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/format';
import toast from 'react-hot-toast';
const G='#1a3a2a';const GOLD='#f5c518';
const STATUSES=['pending','confirmed','processing','packed','shipped','delivered','cancelled','returned'];
export default function AdminOrderDetailPage() {
  const {id}=useParams();const [data,setData]=useState(null);const [loading,setLoading]=useState(true);const [newStatus,setNewStatus]=useState('');const [note,setNote]=useState('');
  useEffect(()=>{adminApi.get(`/orders/admin/${id}`).then(res=>{setData(res.data);setNewStatus(res.data.order.status);}).finally(()=>setLoading(false));}, [id]);
  const updateStatus=async()=>{
    try{await adminApi.put(`/orders/admin/${id}/status`,{status:newStatus,note});setData(prev=>({...prev,order:{...prev.order,status:newStatus}}));toast.success('Status updated');setNote('');}
    catch{toast.error('Failed');}
  };
  if(loading) return<div className="animate-pulse space-y-4"><div className="h-8 bg-gray-100 rounded w-48"/><div className="h-64 bg-gray-100 rounded-2xl"/></div>;
  if(!data) return<div>Order not found</div>;
  const {order,history}=data;const items=order.items||[];
  return(
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <h1 className="text-xl font-bold text-gray-800">Order #{order.order_number}</h1>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
        <button onClick={()=>window.print()} className="ml-auto p-2 hover:bg-gray-100 rounded-lg"><Printer size={18}/></button>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item,i)=>(
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-gray-100"/>
                  <div className="flex-1"><p className="font-semibold text-sm">{item.name}</p>{Object.entries(item.variations||{}).map(([k,v])=><p key={k} className="text-xs text-gray-400">{k}: {v}</p>)}<p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p></div>
                  <p className="font-bold" style={{color:G}}>{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount_amount>0&&<div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{formatPrice(order.delivery_charge)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2" style={{color:G}}><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Order Timeline</h2>
            <div className="space-y-3">
              {(history||[]).map(h=>(
                <div key={h.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background:G}}/>
                  <div><p className="text-sm font-semibold capitalize" style={{color:G}}>{getStatusLabel(h.status)}</p>{h.note&&<p className="text-xs text-gray-500">{h.note}</p>}<p className="text-xs text-gray-400">{formatDateTime(h.created_at)}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t">
              <h3 className="font-medium text-sm mb-3">Update Status</h3>
              <div className="flex gap-2 flex-wrap">
                <select value={newStatus} onChange={e=>setNewStatus(e.target.value)} className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}>
                  {STATUSES.map(s=><option key={s} value={s}>{getStatusLabel(s)}</option>)}
                </select>
                <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add note (optional)" className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
                <button onClick={updateStatus} className="px-5 py-2 text-white rounded-lg text-sm font-semibold" style={{background:G}}>Update</button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Name:</span> <span className="font-medium">{order.customer_name}</span></p>
              <p><span className="text-gray-400">Phone:</span> <span className="font-medium">{order.customer_phone}</span></p>
              {order.customer_email&&<p><span className="text-gray-400">Email:</span> <span className="font-medium">{order.customer_email}</span></p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Delivery</h2>
            <p className="text-sm text-gray-600">{order.full_address}<br/>{order.area&&`${order.area}, `}{order.thana}, {order.district}</p>
            {order.order_note&&<p className="mt-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 p-2 rounded-lg">Note: {order.order_note}</p>}
          </div>
          <a href={`https://wa.me/${order.customer_phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${order.customer_name}, Your order #${order.order_number} from AYASOFYA is ${getStatusLabel(order.status)}.`)}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold text-sm w-full" style={{background:'#25D366'}}>
            <MessageCircle size={16}/> Message Customer
          </a>
        </div>
      </div>
    </div>
  );
}
