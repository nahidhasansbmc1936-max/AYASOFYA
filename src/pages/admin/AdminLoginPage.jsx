import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAdminStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome to AYASOFYA Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: `linear-gradient(135deg, #0d2218 0%, ${G} 100%)` }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full p-6 sm:p-8"
        style={{ maxWidth: '440px' }}
      >
        {/* Logo / header */}
        <div className="text-center mb-7">
          <div
            className="mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ width: 64, height: 64, background: GOLD }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3C8 3 4 6 4 11C4 14 6 16 9 17L7 21L10 21L11.5 17.8C11.7 17.9 11.85 18 12 18C16 18 20 15 20 11C20 6 16 3 12 3Z"
                fill={G}
              />
              <path
                d="M9 14C7.5 13 6.5 12 6.5 11C6.5 7.5 9 5 12 5C15 5 17.5 7.5 17.5 11C17.5 13 15.5 15.5 12 15.8L13 13C14.5 12.5 15.5 11.8 15.5 11C15.5 8.5 14 7 12 7C10 7 8.5 8.5 8.5 11C8.5 12 9 13 10 13.8Z"
                fill={GOLD}
              />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: G }}
          >
            AYASOFYA Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ayasofya.com"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 transition-colors"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-green-800 transition-colors"
                style={{ fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: G, minHeight: '48px' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <Lock size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Security note — no credentials displayed */}
        <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1">
          <ShieldCheck size={12} /> Secure admin access
        </p>
      </div>
    </div>
  );
}
