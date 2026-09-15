import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
const G='#1a3a2a';
export default function ChangePasswordTab() {
  const [loading,setLoading]=useState(false);
  const {register,handleSubmit,reset,formState:{errors}}=useForm();
  const onSubmit=async(data)=>{
    if(data.new_password!==data.confirm_password){toast.error("Passwords don't match");return;}
    setLoading(true);
    try{await api.put('/auth/customer/change-password',{current_password:data.current_password,new_password:data.new_password});toast.success('Password changed!');reset();}
    catch(err){toast.error(err.response?.data?.error||'Failed');}
    finally{setLoading(false);}
  };
  const ic="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  return(
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{fontFamily:"'Playfair Display',serif",color:G}}><Lock size={20}/>Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {[{n:'current_password',l:'Current Password',r:{required:'Required'}},{n:'new_password',l:'New Password',r:{required:'Required',minLength:{value:6,message:'Min 6 chars'}}},{n:'confirm_password',l:'Confirm New Password',r:{required:'Required'}}].map(f=>(
          <div key={f.n}>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{f.l}</label>
            <input {...register(f.n,f.r)} type="password" className={ic} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
            {errors[f.n]&&<p className="text-xs text-red-500 mt-1">{errors[f.n].message}</p>}
          </div>
        ))}
        <button type="submit" disabled={loading} className="text-white px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-70" style={{background:G}}>{loading?'Saving...':'Update Password'}</button>
      </form>
    </div>
  );
}
