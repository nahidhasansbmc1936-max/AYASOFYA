import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatDateTime } from '../../utils/format';
const G='#1a3a2a';
export default function AdminCustomersPage() {
  const [customers,setCustomers]=useState([]);const [total,setTotal]=useState(0);const [loading,setLoading]=useState(true);const [search,setSearch]=useState('');
  const fetch=(s=search)=>{setLoading(true);const p=new URLSearchParams({limit:20});if(s)p.set('search',s);adminApi.get(`/customers/admin/all?${p}`).then(res=>{setCustomers(res.data.customers||[]);setTotal(res.data.total||0);}).finally(()=>setLoading(false));};
  useEffect(()=>{fetch();}, []);
  return(
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Customers ({total})</h1>
      <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3">
        <div className="flex-1 flex items-center gap-2 border-2 border-gray-200 rounded-lg px-3">
          <Search size={15} className="text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetch()} placeholder="Search by name, email, phone..." className="flex-1 py-2 text-sm focus:outline-none"/>
        </div>
        <button onClick={()=>fetch()} className="px-4 py-2 text-white rounded-lg text-sm" style={{background:G}}>Search</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b"><tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left hidden sm:table-cell">Phone</th><th className="px-4 py-3 text-left hidden md:table-cell">Joined</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading?[...Array(8)].map((_,i)=><tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-5 bg-gray-100 animate-pulse rounded"/></td></tr>)
            :customers.map(c=>(
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background:G}}>{c.name?.[0]}</div><div><p className="font-medium">{c.name}</p><p className="text-xs text-gray-400">{c.email}</p></div></div></td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{c.phone}</td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{formatDateTime(c.created_at)}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${c.is_active?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{c.is_active?'Active':'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length===0&&!loading&&<div className="text-center py-10 text-gray-400"><Users size={36} className="mx-auto mb-2 text-gray-300"/>No customers found</div>}
      </div>
    </div>
  );
}
