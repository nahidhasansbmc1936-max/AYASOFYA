import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/account';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: '#fffbe6' }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full p-6 sm:p-8"
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <div className="text-center mb-7">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: G }}
          >
            <Lock size={24} className="text-white" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: G }}
          >
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your AYASOFYA account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email / Phone */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
            >
              Email or Phone
            </label>
            <input
              id="login-email"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="Enter email or phone"
              {...register('email', { required: 'Email or phone is required' })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 transition-colors"
              style={{ fontSize: '16px' /* prevents iOS zoom */ }}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
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
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: G, minHeight: '48px' }}
          >
            {isLoading ? (
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

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold hover:underline"
              style={{ color: G }}
            >
              Create Account
            </Link>
          </p>
          <Link
            to="/track-order"
            className="block text-sm text-gray-400 hover:text-gray-600"
          >
            Track order without account →
          </Link>
        </div>
      </div>
    </div>
  );
}
