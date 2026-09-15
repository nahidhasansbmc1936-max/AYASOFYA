import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { adminApi } from '../../api/axios';
import toast from 'react-hot-toast';
const G='#1a3a2a';const GOLD='#f5c518';
const Toggle=({label,checked,onChange})=>(
  <label className="flex items-center gap-3 cursor-pointer" onClick={()=>onChange(!checked)}>
    <div className="relative w-11 h-6 rounded-full transition-colors" style={{background:checked?G:'#d1d5db'}}>
      <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform" style={{transform:checked?'translateX(24px)':'translateX(4px)'}}/>
    </div>
    <span className="text-sm text-gray-600">{label}</span>
  </label>
);
export default function AdminProductFormPage() {
  const {id}=useParams();const navigate=useNavigate();const isEdit=!!id;
  const [loading,setLoading]=useState(false);const [categories,setCategories]=useState([]);
  const [imgFiles,setImgFiles]=useState([]);const [imgPreviews,setImgPreviews]=useState([]);const [existingImages,setExistingImages]=useState([]);
  const [form,setForm]=useState({name:'',sku:'',description:'',short_description:'',category_id:'',regular_price:'',sale_price:'',stock_quantity:'',tags:'',is_featured:false,is_bestseller:false,is_new_arrival:false,is_on_offer:false,is_published:true,specifications:'',delivery_info:'',return_policy:'',meta_title:'',meta_description:''});
  useEffect(()=>{
    adminApi.get('/categories/flat').then(res=>setCategories(res.data.categories||[]));
    if(isEdit){
      adminApi.get(`/products/admin/all?limit=1000`).then(res=>{
        const p=res.data.products?.find(x=>x.id===id);
        if(p){setForm({name:p.name||'',sku:p.sku||'',description:p.description||'',short_description:p.short_description||'',category_id:p.category_id||'',regular_price:p.regular_price||'',sale_price:p.sale_price||'',stock_quantity:p.stock_quantity||'',tags:(p.tags||[]).join(', '),is_featured:!!p.is_featured,is_bestseller:!!p.is_bestseller,is_new_arrival:!!p.is_new_arrival,is_on_offer:!!p.is_on_offer,is_published:!!p.is_published,specifications:p.specifications||'',delivery_info:p.delivery_info||'',return_policy:p.return_policy||'',meta_title:p.meta_title||'',meta_description:p.meta_description||''});setExistingImages(p.images||[]);}
      }).catch(()=>{});
    }
  }, [id]);
  const handleImages=(e)=>{const files=[...e.target.files];setImgFiles(prev=>[...prev,...files]);files.forEach(f=>{const r=new FileReader();r.onload=ev=>setImgPreviews(prev=>[...prev,ev.target.result]);r.readAsDataURL(f);});};
  const handleSubmit=async(e)=>{
    e.preventDefault();setLoading(true);
    try{
      const fd=new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,typeof v==='boolean'?String(v):v));
      if(form.tags){const t=form.tags.split(',').map(x=>x.trim()).filter(Boolean);fd.set('tags',JSON.stringify(t));}
      imgFiles.forEach(f=>fd.append('images',f));
      if(isEdit)await adminApi.put(`/products/admin/${id}`,fd,{headers:{'Content-Type':'multipart/form-data'}});
      else await adminApi.post('/products/admin',fd,{headers:{'Content-Type':'multipart/form-data'}});
      toast.success(isEdit?'Product updated!':'Product created!');navigate('/admin/products');
    }catch(err){toast.error(err.response?.data?.error||'Failed');}
    finally{setLoading(false);}
  };
  const set=(k,v)=>setForm(prev=>({...prev,[k]:v}));
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  const onF=e=>{e.target.style.borderColor=G;}; const onB=e=>{e.target.style.borderColor='#e5e7eb';};
  return(
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <h1 className="text-xl font-bold text-gray-800">{isEdit?'Edit Product':'Add New Product'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">Basic Information</h2>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Product Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required placeholder="e.g. Premium Katan Jubba" className={ic} onFocus={onF} onBlur={onB}/></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">SKU</label><input value={form.sku} onChange={e=>set('sku',e.target.value)} placeholder="e.g. AYA-001" className={ic} onFocus={onF} onBlur={onB}/></div>
                <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Category</label>
                  <select value={form.category_id} onChange={e=>set('category_id',e.target.value)} className={ic+' bg-white'} onFocus={onF} onBlur={onB}>
                    <option value="">Select Category</option>
                    {categories.map(c=><option key={c.id} value={c.id}>{c.parent_id?`  └ ${c.name}`:c.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Short Description</label><textarea value={form.short_description} onChange={e=>set('short_description',e.target.value)} rows={2} className={ic+' resize-none'} onFocus={onF} onBlur={onB}/></div>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Full Description</label><textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={5} className={ic+' resize-none'} onFocus={onF} onBlur={onB}/></div>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Tags (comma separated)</label><input value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="jubba, katan, premium, eid" className={ic} onFocus={onF} onBlur={onB}/></div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 border-b pb-2 mb-4">Product Images</h2>
              <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map((img,i)=><div key={i} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100"><img src={img} alt="" className="w-full h-full object-cover"/></div>)}
                {imgPreviews.map((img,i)=>(
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 relative">
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                    <button type="button" onClick={()=>{setImgPreviews(p=>p.filter((_,j)=>j!==i));setImgFiles(p=>p.filter((_,j)=>j!==i));}} className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">×</button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition-colors">
                  <Upload size={16} className="text-gray-400 mb-1"/><span className="text-[10px] text-gray-400">Add Photo</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages}/>
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">Pricing & Stock</h2>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Regular Price (৳) *</label><input type="number" value={form.regular_price} onChange={e=>set('regular_price',e.target.value)} required placeholder="0" className={ic} onFocus={onF} onBlur={onB}/></div>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Sale Price (৳)</label><input type="number" value={form.sale_price} onChange={e=>set('sale_price',e.target.value)} placeholder="Leave blank if no discount" className={ic} onFocus={onF} onBlur={onB}/></div>
              <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Stock Quantity</label><input type="number" value={form.stock_quantity} onChange={e=>set('stock_quantity',e.target.value)} placeholder="0" className={ic} onFocus={onF} onBlur={onB}/></div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 border-b pb-2">Product Options</h2>
              <Toggle label="Published" checked={form.is_published} onChange={v=>set('is_published',v)}/>
              <Toggle label="Featured Product" checked={form.is_featured} onChange={v=>set('is_featured',v)}/>
              <Toggle label="Best Seller" checked={form.is_bestseller} onChange={v=>set('is_bestseller',v)}/>
              <Toggle label="New Arrival" checked={form.is_new_arrival} onChange={v=>set('is_new_arrival',v)}/>
              <Toggle label="On Offer / Sale" checked={form.is_on_offer} onChange={v=>set('is_on_offer',v)}/>
            </div>
            <button type="submit" disabled={loading} className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 text-sm tracking-wide" style={{background:GOLD,color:G}}>
              {loading?<><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>Saving...</>:(isEdit?'💾 Update Product':'✨ Create Product')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
