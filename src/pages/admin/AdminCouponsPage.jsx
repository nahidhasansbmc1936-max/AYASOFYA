import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatPrice, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminCouponsPage() {
  const [coupons,setCoupons]=useState([]);const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({code:'',discount_type:'percentage',discount_value:'',minimum_order:'',maximum_discount:'',usage_limit:'',expiry_date:'',is_active:true});
  useEffect(()=>{adminApi.get('/coupons/admin/all').then(res=>setCoupons(res.data.coupons||[]));}, []);
  const save=async(e)=>{e.preventDefault();try{await adminApi.post('/coupons/admin',form);toast.success('Coupon created!');setShowForm(false);adminApi.get('/coupons/admin/all').then(r=>setCoupons(r.data.coupons||[]));}catch(err){toast.error(err.response?.data?.error||'Failed');}};
  const del=async(id,code)=>{if(!confirm(`Delete "${code}"?`))return;await adminApi.delete(`/coupons/admin/${id}`);setCoupons(prev=>prev.filter(c=>c.id!==id));toast.success('Deleted');};
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  const onF=e=>e.target.style.borderColor=G;const onB=e=>e.target.style.borderColor='#e5e7eb';
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
        <button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm" style={{background:G}}><Plus size={16}/>Create Coupon</button>
      </div>
      {showForm&&(
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">New Coupon</h2>
          <form onSubmit={save} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[{k:'code',l:'Coupon Code *',ph:'EID2024',r:true},{k:'discount_value',l:'Discount Value *',t:'number',r:true},{k:'minimum_order',l:'Min Order (৳)',t:'number'},{k:'maximum_discount',l:'Max Discount (৳)',t:'number'},{k:'usage_limit',l:'Usage Limit',t:'number'},{k:'expiry_date',l:'Expiry Date',t:'date'}].map(f=>(
              <div key={f.k}><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{f.l}</label><input type={f.t||'text'} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} required={f.r} placeholder={f.ph} className={ic} onFocus={onF} onBlur={onB}/></div>
            ))}
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Discount Type</label>
              <select value={form.discount_type} onChange={e=>setForm(p=>({...p,discount_type:e.target.value}))} className={ic+' bg-white'} onFocus={onF} onBlur={onB}>
                <option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>
            <div className="sm:col-span-2 md:col-span-3 flex gap-3">
              <button type="submit" className="px-6 py-2.5 text-white rounded-xl font-semibold text-sm" style={{background:'#d97706'}}>Create Coupon</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-6 py-2.5 border text-gray-600 rounded-xl text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b"><tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Discount</th><th className="px-4 py-3 text-left hidden sm:table-cell">Min Order</th><th className="px-4 py-3 text-left hidden md:table-cell">Used</th><th className="px-4 py-3 text-left hidden md:table-cell">Expires</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(c=>(
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold font-mono" style={{color:G}}>{c.code}</td>
                <td className="px-4 py-3 font-semibold">{c.discount_type==='percentage'?`${c.discount_value}%`:formatPrice(c.discount_value)}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{c.minimum_order?formatPrice(c.minimum_order):'-'}</td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500">{c.used_count}/{c.usage_limit||'∞'}</td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500">{c.expiry_date?formatDate(c.expiry_date):'No expiry'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.is_active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{c.is_active?'Active':'Inactive'}</span></td>
                <td className="px-4 py-3"><button onClick={()=>del(c.id,c.code)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length===0&&<div className="text-center py-8 text-gray-400">No coupons yet</div>}
      </div>
    </div>
  );
}
