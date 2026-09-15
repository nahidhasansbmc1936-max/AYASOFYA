import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      toast.success('Account created successfully!');
      navigate('/account');
    } catch (err) { toast.error(err.response?.data?.error || 'Registration failed'); }
  };

  const inputStyle = { onFocus: e => e.target.style.borderColor = G, onBlur: e => e.target.style.borderColor = '#e5e7eb' };
  const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#fffbe6' }}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: GOLD }}>
            <UserPlus size={24} style={{ color: G }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display',serif", color: G }}>Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join AYASOFYA for exclusive benefits</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name *', placeholder: 'Your full name', rules: { required: 'Required' } },
            { name: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
            { name: 'phone', label: 'Phone *', placeholder: '01XXXXXXXXX', rules: { required: 'Required' } },
          ].map(f => (
            <div key={f.name}>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{f.label}</label>
              <input {...register(f.name, f.rules)} type={f.type || 'text'} placeholder={f.placeholder} className={inputClass} {...inputStyle} />
              {errors[f.name] && <p className="text-xs text-red-500 mt-1">{errors[f.name].message}</p>}
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Password *</label>
            <div className="relative">
              <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} type={showPass ? 'text' : 'password'} placeholder="Create a password" className={inputClass + ' pr-12'} {...inputStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: GOLD, color: G }}>
            {isLoading ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Creating...</> : <><UserPlus size={16} />Create Account</>}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-semibold hover:opacity-70" style={{ color: G }}>Sign In</Link></p>
      </div>
    </div>
  );
}
