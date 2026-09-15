import { useState, useEffect } from 'react';
import { Plus, Trash2, Image } from 'lucide-react';
import { adminApi } from '../../api/axios';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminBannersPage() {
  const [banners,setBanners]=useState([]);const [showForm,setShowForm]=useState(false);const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({title:'',subtitle:'',heading:'',subheading:'',button_text:'SHOP NOW',button_url:'/shop',sort_order:0,type:'hero'});
  const [desktopFile,setDesktopFile]=useState(null);const [mobileFile,setMobileFile]=useState(null);
  const fetch=()=>adminApi.get('/settings/admin/banners').then(res=>setBanners(res.data.banners||[]));
  useEffect(()=>{fetch();}, []);
  const save=async(e)=>{e.preventDefault();setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v));if(desktopFile)fd.append('desktop_image',desktopFile);if(mobileFile)fd.append('mobile_image',mobileFile);await adminApi.post('/settings/admin/banners',fd,{headers:{'Content-Type':'multipart/form-data'}});toast.success('Banner created!');setShowForm(false);setDesktopFile(null);setMobileFile(null);setForm({title:'',subtitle:'',heading:'',subheading:'',button_text:'SHOP NOW',button_url:'/shop',sort_order:0,type:'hero'});fetch();}catch{toast.error('Failed');}finally{setSaving(false);}};
  const del=async(id)=>{if(!confirm('Delete?'))return;await adminApi.delete(`/settings/admin/banners/${id}`);fetch();toast.success('Deleted');};
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  const onF=e=>e.target.style.borderColor=G;const onB=e=>e.target.style.borderColor='#e5e7eb';
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Banners & Sliders</h1>
        <button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm" style={{background:G}}><Plus size={16}/>Add Banner</button>
      </div>
      {showForm&&(
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">New Banner</h2>
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            {[{k:'title',l:'Title *',r:true},{k:'subtitle',l:'Subtitle / Badge'},{k:'heading',l:'Main Heading'},{k:'subheading',l:'Subheading'},{k:'button_text',l:'Button Text'},{k:'button_url',l:'Button URL'}].map(f=>(
              <div key={f.k}><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{f.l}</label><input value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} required={f.r} className={ic} onFocus={onF} onBlur={onB}/></div>
            ))}
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Desktop Image</label><input type="file" accept="image/*" onChange={e=>setDesktopFile(e.target.files[0])} className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-3"/></div>
            <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Mobile Image</label><input type="file" accept="image/*" onChange={e=>setMobileFile(e.target.files[0])} className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-3"/></div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 text-white rounded-xl font-semibold text-sm disabled:opacity-70" style={{background:'#d97706'}}>{saving?'Saving...':'Create'}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-6 py-2.5 border text-gray-600 rounded-xl text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="grid gap-4">
        {banners.map(banner=>(
          <div key={banner.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-24 h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{background:`linear-gradient(135deg, ${G}, #2a5c3f)`}}>
              {banner.desktop_image?<img src={banner.desktop_image} alt={banner.title} className="w-full h-full object-cover"/>:<Image size={24} className="text-white/40"/>}
            </div>
            <div className="flex-1"><p className="font-bold text-gray-800">{banner.title}</p><p className="text-sm text-gray-500">{banner.heading}</p></div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${banner.is_active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{banner.is_active?'Active':'Inactive'}</span>
              <button onClick={()=>del(banner.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
        {banners.length===0&&<div className="text-center py-10 text-gray-400 bg-white rounded-2xl">No banners yet</div>}
      </div>
    </div>
  );
}
