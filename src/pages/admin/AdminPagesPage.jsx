import { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { adminApi } from '../../api/axios';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminPagesPage() {
  const [pages,setPages]=useState([]);const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({title:'',content:'',meta_title:'',meta_description:'',is_published:true});
  useEffect(()=>{adminApi.get('/settings/admin/pages').then(res=>setPages(res.data.pages||[]));}, []);
  const save=async()=>{try{await adminApi.put(`/settings/admin/pages/${editing}`,form);setPages(prev=>prev.map(p=>p.id===editing?{...p,...form}:p));setEditing(null);toast.success('Updated!');}catch{toast.error('Failed');}};
  const edit=(page)=>{setEditing(page.id);setForm({title:page.title,content:page.content||'',meta_title:page.meta_title||'',meta_description:page.meta_description||'',is_published:!!page.is_published});};
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  const onF=e=>e.target.style.borderColor=G;const onB=e=>e.target.style.borderColor='#e5e7eb';
  return(
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Pages</h1>
      <div className="grid gap-4">
        {pages.map(page=>(
          <div key={page.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div><h3 className="font-semibold text-gray-800">{page.title}</h3><p className="text-xs text-gray-400">/{page.slug}</p></div>
              {editing===page.id?(
                <div className="flex gap-2">
                  <button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs" style={{background:G}}><Save size={12}/>Save</button>
                  <button onClick={()=>setEditing(null)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg"><X size={14}/></button>
                </div>
              ):(
                <button onClick={()=>edit(page)} className="p-1.5 text-white rounded-lg" style={{background:G}}><Edit size={14}/></button>
              )}
            </div>
            {editing===page.id&&(
              <div className="p-5 space-y-4">
                <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Title</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} className={ic} onFocus={onF} onBlur={onB}/></div>
                <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Content (HTML)</label><textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={8} className={ic+' resize-none font-mono'} onFocus={onF} onBlur={onB}/></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Meta Title</label><input value={form.meta_title} onChange={e=>setForm(p=>({...p,meta_title:e.target.value}))} className={ic} onFocus={onF} onBlur={onB}/></div>
                  <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Meta Description</label><input value={form.meta_description} onChange={e=>setForm(p=>({...p,meta_description:e.target.value}))} className={ic} onFocus={onF} onBlur={onB}/></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
