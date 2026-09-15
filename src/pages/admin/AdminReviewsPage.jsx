import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatDateTime } from '../../utils/format';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminReviewsPage() {
  const [reviews,setReviews]=useState([]);const [loading,setLoading]=useState(true);const [status,setStatus]=useState('all');
  const fetch=(s=status)=>{setLoading(true);adminApi.get(`/customers/admin/reviews?status=${s}`).then(res=>setReviews(res.data.reviews||[])).finally(()=>setLoading(false));};
  useEffect(()=>{fetch();}, []);
  const approve=async(id,val)=>{await adminApi.put(`/customers/admin/reviews/${id}`,{is_approved:val});fetch(status);toast.success(val?'Approved':'Rejected');};
  const del=async(id)=>{if(!confirm('Delete?'))return;await adminApi.delete(`/customers/admin/reviews/${id}`);setReviews(prev=>prev.filter(r=>r.id!==id));toast.success('Deleted');};
  return(
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
      <div className="flex gap-2">
        {['all','pending','approved'].map(s=>(
          <button key={s} onClick={()=>{setStatus(s);fetch(s);}} className="px-4 py-2 rounded-full text-xs font-semibold capitalize" style={{background:status===s?G:'#fff',color:status===s?'#fff':'#4b5563',border:status===s?'none':'1px solid #e5e7eb'}}>{s}</button>
        ))}
      </div>
      <div className="space-y-3">
        {loading?[...Array(5)].map((_,i)=><div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl"/>)
        :reviews.map(r=>(
          <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{r.customer_name}</span>
                <div className="flex">{[1,2,3,4,5].map(s=><Star key={s} size={11} fill={s<=r.rating?'#f5c518':'none'} style={{color:s<=r.rating?'#f5c518':'#e5e7eb'}}/>)}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.is_approved?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{r.is_approved?'Approved':'Pending'}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{r.body}</p>
              <p className="text-xs text-gray-400">Product: {r.product_name} · {formatDateTime(r.created_at)}</p>
            </div>
            <div className="flex gap-1.5 items-start">
              {!r.is_approved&&<button onClick={()=>approve(r.id,true)} className="p-1.5 bg-green-100 text-green-600 rounded-lg"><Check size={14}/></button>}
              {r.is_approved&&<button onClick={()=>approve(r.id,false)} className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg"><X size={14}/></button>}
              <button onClick={()=>del(r.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
        {reviews.length===0&&!loading&&<div className="text-center py-10 text-gray-400">No reviews</div>}
      </div>
    </div>
  );
}
