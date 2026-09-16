import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';
import { adminApi } from '../../api/axios';
import { imgUrl } from '../../utils/format';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function AdminMediaPage() {
  const [files,setFiles]=useState([]);const [uploading,setUploading]=useState(false);
  const fetch=()=>adminApi.get('/media').then(res=>setFiles(res.data.files||[]));
  useEffect(()=>{fetch();}, []);
  const upload=async(e)=>{const sel=[...e.target.files];if(!sel.length)return;setUploading(true);const fd=new FormData();sel.forEach(f=>fd.append('files',f));try{await adminApi.post('/media/upload',fd,{headers:{'Content-Type':'multipart/form-data'}});toast.success('Uploaded!');fetch();}catch{toast.error('Failed');}finally{setUploading(false);};};
  const del=async(id)=>{await adminApi.delete(`/media/${id}`);setFiles(prev=>prev.filter(f=>f.id!==id));toast.success('Deleted');};
  const copy=(url)=>{navigator.clipboard.writeText(url);toast.success('URL copied!');};
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Media Library ({files.length})</h1>
        <label className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90" style={{background:G}}>
          <Upload size={16}/>{uploading?'Uploading...':'Upload Files'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={upload} disabled={uploading}/>
        </label>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {files.map(file=>(
          <div key={file.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-green-600 transition-all cursor-pointer">
            <img src={imgUrl(file.url)} alt={file.original_name} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <button onClick={()=>copy(file.url)} className="p-1.5 bg-white text-gray-700 rounded-lg"><Copy size={12}/></button>
              <button onClick={()=>del(file.id)} className="p-1.5 bg-red-500 text-white rounded-lg"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
      {files.length===0&&<div className="text-center py-16 text-gray-400 bg-white rounded-2xl">No files uploaded yet</div>}
    </div>
  );
}
