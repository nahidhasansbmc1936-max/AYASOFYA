import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { adminApi } from '../../api/axios';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminCategoriesPage() {
  const [categories,setCategories]=useState([]);const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:'',description:'',parent_id:'',sort_order:0});
  const fetch=()=>{setLoading(true);adminApi.get('/categories/admin/all').then(res=>setCategories(res.data.categories||[])).finally(()=>setLoading(false));};
  useEffect(()=>{fetch();}, []);
  const save=async(e)=>{e.preventDefault();try{if(editing)await adminApi.put(`/categories/admin/${editing}`,form);else await adminApi.post('/categories/admin',form);toast.success(editing?'Updated!':'Created!');setForm({name:'',description:'',parent_id:'',sort_order:0});setEditing(null);setShowForm(false);fetch();}catch(err){toast.error(err.response?.data?.error||'Failed');}};
  const edit=(cat)=>{setEditing(cat.id);setForm({name:cat.name,description:cat.description||'',parent_id:cat.parent_id||'',sort_order:cat.sort_order||0});setShowForm(true);};
  const del=async(id,name)=>{if(!confirm(`Delete "${name}"?`))return;try{await adminApi.delete(`/categories/admin/${id}`);fetch();toast.success('Deleted');}catch{toast.error('Failed');}};
  const parents=categories.filter(c=>!c.parent_id);const children=categories.filter(c=>c.parent_id);
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  const onF=e=>e.target.style.borderColor=G;const onB=e=>e.target.style.borderColor='#e5e7eb';
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={()=>{setShowForm(!showForm);setEditing(null);setForm({name:'',description:'',parent_id:'',sort_order:0});}} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm" style={{background:G}}><Plus size={16}/>Add Category</button>
      </div>
      {showForm&&(
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">{editing?'Edit Category':'New Category'}</h2>
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required className={ic} onFocus={onF} onBlur={onB}/></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Parent Category</label>
              <select value={form.parent_id} onChange={e=>setForm(p=>({...p,parent_id:e.target.value}))} className={ic+' bg-white'} onFocus={onF} onBlur={onB}>
                <option value="">None (Top Level)</option>
                {parents.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Description</label><input value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className={ic} onFocus={onF} onBlur={onB}/></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Sort Order</label><input type="number" value={form.sort_order} onChange={e=>setForm(p=>({...p,sort_order:e.target.value}))} className={ic} onFocus={onF} onBlur={onB}/></div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="px-6 py-2.5 text-white rounded-xl font-semibold text-sm" style={{background:'#d97706'}}>{editing?'Update':'Create'}</button>
              <button type="button" onClick={()=>{setShowForm(false);setEditing(null);}} className="px-6 py-2.5 border text-gray-600 rounded-xl text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b"><tr><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left hidden sm:table-cell">Type</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading?[...Array(8)].map((_,i)=><tr key={i}><td colSpan={3} className="px-4 py-3"><div className="h-5 bg-gray-100 animate-pulse rounded"/></td></tr>)
            :parents.map(parent=>(
              <>
                <tr key={parent.id} style={{background:'#f9fafb'}}>
                  <td className="px-4 py-3 font-bold" style={{color:G}}>{parent.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs text-white px-2 py-0.5 rounded" style={{background:G}}>Parent</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={()=>edit(parent)} className="p-1.5 text-white rounded-lg" style={{background:G}}><Edit size={13}/></button>
                      <button onClick={()=>del(parent.id,parent.name)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
                {children.filter(c=>c.parent_id===parent.id).map(child=>(
                  <tr key={child.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2 text-gray-700 pl-8"><ChevronRight size={12} className="text-gray-400"/>{child.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Sub</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={()=>edit(child)} className="p-1.5 text-white rounded-lg" style={{background:G}}><Edit size={13}/></button>
                        <button onClick={()=>del(child.id,child.name)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
