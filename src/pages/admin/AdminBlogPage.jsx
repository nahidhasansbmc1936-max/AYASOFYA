import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { formatDate } from '../../utils/format';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminBlogPage() {
  const [posts,setPosts]=useState([]);const [loading,setLoading]=useState(true);const [showForm,setShowForm]=useState(false);const [editing,setEditing]=useState(null);const [categories,setCategories]=useState([]);
  const [form,setForm]=useState({title:'',excerpt:'',content:'',category_id:'',is_published:false});const [imgFile,setImgFile]=useState(null);
  const fetch=()=>{setLoading(true);adminApi.get('/blog/admin/all').then(res=>setPosts(res.data.posts||[])).finally(()=>setLoading(false));};
  useEffect(()=>{fetch();adminApi.get('/blog/categories').then(res=>setCategories(res.data.categories||[]));}, []);
  const save=async(e)=>{
    e.preventDefault();const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v));if(imgFile)fd.append('featured_image',imgFile);
    try{if(editing)await adminApi.put(`/blog/admin/${editing}`,fd,{headers:{'Content-Type':'multipart/form-data'}});else await adminApi.post('/blog/admin',fd,{headers:{'Content-Type':'multipart/form-data'}});
    toast.success(editing?'Updated!':'Created!');setShowForm(false);setEditing(null);setForm({title:'',excerpt:'',content:'',category_id:'',is_published:false});setImgFile(null);fetch();}catch{toast.error('Failed');}
  };
  const del=async(id)=>{if(!confirm('Delete?'))return;await adminApi.delete(`/blog/admin/${id}`);fetch();toast.success('Deleted');};
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm" style={{background:G}}><Plus size={16}/>New Post</button>
      </div>
      {showForm&&(
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <form onSubmit={save} className="space-y-4">
            <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required placeholder="Post title" className={ic} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            <textarea value={form.excerpt} onChange={e=>setForm(p=>({...p,excerpt:e.target.value}))} rows={2} placeholder="Short excerpt..." className={ic+' resize-none'} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            <textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={6} placeholder="Post content..." className={ic+' resize-none font-mono'} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            <div className="flex gap-3 flex-wrap">
              <select value={form.category_id} onChange={e=>setForm(p=>({...p,category_id:e.target.value}))} className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-white" onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}>
                <option value="">Select Category</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="file" accept="image/*" onChange={e=>setImgFile(e.target.files[0])} className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm"/>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 border-gray-200 rounded-xl text-sm">
                <input type="checkbox" checked={form.is_published} onChange={e=>setForm(p=>({...p,is_published:e.target.checked}))} style={{accentColor:G}}/> Publish
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 text-sm font-semibold rounded-xl" style={{background:'#d97706',color:'#fff'}}>{editing?'Update':'Create'}</button>
              <button type="button" onClick={()=>{setShowForm(false);setEditing(null);}} className="px-6 py-2.5 border text-gray-600 rounded-xl text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b"><tr><th className="px-4 py-3 text-left">Title</th><th className="px-4 py-3 text-left hidden sm:table-cell">Category</th><th className="px-4 py-3 text-left hidden md:table-cell">Date</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading?[...Array(5)].map((_,i)=><tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-5 bg-gray-100 animate-pulse rounded"/></td></tr>)
            :posts.map(p=>(
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{p.category_name||'-'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.is_published?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{p.is_published?'Published':'Draft'}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1.5">
                  <button onClick={()=>{setEditing(p.id);setForm({title:p.title,excerpt:p.excerpt||'',content:p.content||'',category_id:p.category_id||'',is_published:!!p.is_published});setShowForm(true);}} className="p-1.5 text-white rounded-lg" style={{background:G}}><Edit size={13}/></button>
                  <button onClick={()=>del(p.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={13}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length===0&&!loading&&<div className="text-center py-8 text-gray-400">No blog posts</div>}
      </div>
    </div>
  );
}
