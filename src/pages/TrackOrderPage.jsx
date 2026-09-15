import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package } from 'lucide-react';
import api from '../api/axios';
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../utils/format';
const G='#1a3a2a';const GOLD='#f5c518';
const STEPS=['pending','confirmed','processing','packed','shipped','delivered'];
export default function TrackOrderPage() {
  const [searchParams]=useSearchParams();
  const [orderNumber,setOrderNumber]=useState(searchParams.get('order')||'');
  const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  const track=async(e)=>{
    e?.preventDefault();if(!orderNumber.trim())return;
    setLoading(true);setError('');setResult(null);
    try{const res=await api.get(`/orders/track/${orderNumber.trim()}`);setResult(res.data);}
    catch{setError('Order not found. Please check your order number.');}
    finally{setLoading(false);}
  };
  const step=result?STEPS.indexOf(result.order.status):-1;
  return(
    <div className="min-h-screen py-12" style={{background:'#fffbe6'}}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <Package size={40} className="mx-auto mb-3" style={{color:G}}/>
          <h1 className="text-2xl font-bold" style={{fontFamily:"'Playfair Display',serif",color:G}}>Track Your Order</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your order number to track status</p>
        </div>
        <form onSubmit={track} className="flex gap-3 mb-6">
          <input value={orderNumber} onChange={e=>setOrderNumber(e.target.value)} placeholder="e.g. AYA-10001" className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
          <button type="submit" disabled={loading} className="text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-70" style={{background:G}}>
            <Search size={16}/>{loading?'...':'Track'}
          </button>
        </form>
        {error&&<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center mb-4">{error}</div>}
        {result&&(
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="font-bold text-lg" style={{color:G}}>#{result.order.order_number}</h3><p className="text-xs text-gray-400">{formatDateTime(result.order.created_at)}</p></div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(result.order.status)}`}>{getStatusLabel(result.order.status)}</span>
              </div>
              {result.order.status!=='cancelled'&&result.order.status!=='returned'&&(
                <div className="relative mt-4 mb-2">
                  <div className="flex justify-between relative z-10">
                    {STEPS.map((s,i)=>(
                      <div key={s} className="flex flex-col items-center gap-1" style={{flex:1}}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{background:i<=step?G:'#e5e7eb',color:i<=step?'#fff':'#9ca3af'}}>
                          {i<step?'✓':i+1}
                        </div>
                        <span className="text-[9px] text-center text-gray-500 capitalize hidden sm:block">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-3.5 left-[3.5%] right-[3.5%] h-0.5 bg-gray-200 -z-0">
                    <div className="h-full transition-all" style={{width:`${(step/(STEPS.length-1))*100}%`,background:G}}/>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Items Ordered</h3>
              <div className="space-y-2">
                {(result.order.items||[]).map((item,i)=>(
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100"/>
                    <div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-xs text-gray-400">×{item.quantity}</p></div>
                    <p className="font-bold" style={{color:G}}>{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t text-sm font-bold flex justify-between" style={{color:G}}>
                <span>Total</span><span>{formatPrice(result.order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
