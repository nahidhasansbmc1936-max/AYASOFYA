import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';
const G = '#1a3a2a';
export default function ProfileTab() {
  const { customer, setCustomer } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({ defaultValues: { name: customer?.name, phone: customer?.phone, email: customer?.email } });
  const onSave = async (data) => {
    setLoading(true);
    try { await api.put('/auth/customer/profile', data); setCustomer({ ...customer, ...data }); toast.success('Profile updated!'); }
    catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };
  const ic = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display',serif", color: G }}>My Profile</h2>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4 max-w-md">
        {[{n:'name',l:'Full Name'},{n:'phone',l:'Phone'},{n:'email',l:'Email',t:'email'}].map(f=>(
          <div key={f.n}>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{f.l}</label>
            <input {...register(f.n)} type={f.t||'text'} className={ic} onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'} />
          </div>
        ))}
        <button type="submit" disabled={loading} className="text-white px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-70" style={{background:G}}>{loading?'Saving...':'Save Changes'}</button>
      </form>
    </div>
  );
}
