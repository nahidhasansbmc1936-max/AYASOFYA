import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { adminApi } from '../../api/axios';
import useAdminStore from '../../store/useAdminStore';
import toast from 'react-hot-toast';

const G    = '#1a3a2a';
const GOLD = '#f5c518';

const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 transition-colors bg-white';
const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${G}15` }}>
          <Icon size={18} style={{ color: G }} />
        </div>
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function PasswordInput({ id, label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} value={value} onChange={onChange}
          autoComplete={autoComplete}
          className={inputCls + ' pr-12'} style={{ fontSize: 16 }} />
        <button type="button" onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          aria-label={show ? 'Hide' : 'Show'}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminAccountPage() {
  const { admin, setAdmin } = useAdminStore();

  // ── Change Email state ────────────────────────────────
  const [emailForm, setEmailForm] = useState({ new_email: '', password: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailDone, setEmailDone] = useState(false);

  // ── Change Password state ─────────────────────────────
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwDone, setPwDone] = useState(false);

  // ── Handlers ──────────────────────────────────────────
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await adminApi.put('/admin-users/account/change-email', emailForm);
      setEmailDone(true);
      setEmailForm({ new_email: '', password: '' });
      if (setAdmin) setAdmin({ ...admin, email: emailForm.new_email.trim().toLowerCase() });
      toast.success('Email updated successfully!');
      setTimeout(() => setEmailDone(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update email');
    } finally { setEmailLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error('New passwords do not match'); return;
    }
    if (pwForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setPwLoading(true);
    try {
      await adminApi.put('/admin-users/account/change-password', pwForm);
      setPwDone(true);
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
      toast.success('Password changed successfully!');
      setTimeout(() => setPwDone(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally { setPwLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Account & Security</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account credentials</p>
      </div>

      {/* Current account info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background: GOLD, color: G }}>
          {admin?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{admin?.name}</p>
          <p className="text-sm text-gray-500">{admin?.email}</p>
          <span className="inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize"
            style={{ background: `${G}15`, color: G }}>
            {admin?.role?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Change Email */}
      <Card icon={Mail} title="Change Email Address">
        {emailDone ? (
          <div className="flex items-center gap-2 text-green-600 font-medium py-2">
            <CheckCircle size={18} /> Email updated successfully
          </div>
        ) : (
          <form onSubmit={handleEmailChange} className="space-y-4" noValidate>
            <div>
              <label htmlFor="new-email" className={labelCls}>New Email Address</label>
              <input id="new-email" type="email" inputMode="email" autoComplete="email"
                value={emailForm.new_email}
                onChange={e => setEmailForm(f => ({ ...f, new_email: e.target.value }))}
                required placeholder="new@gmail.com"
                className={inputCls} style={{ fontSize: 16 }} />
            </div>
            <PasswordInput id="email-confirm-pw" label="Confirm with Current Password"
              value={emailForm.password}
              onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password" />
            <button type="submit" disabled={emailLoading}
              className="w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
              style={{ background: G, color: '#fff', minHeight: 48 }}>
              {emailLoading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                : <><Mail size={16} /> Update Email</>}
            </button>
            <p className="text-xs text-gray-400 text-center">
              You must enter your current password to change your email.
            </p>
          </form>
        )}
      </Card>

      {/* Change Password */}
      <Card icon={Lock} title="Change Password">
        {pwDone ? (
          <div className="flex items-center gap-2 text-green-600 font-medium py-2">
            <CheckCircle size={18} /> Password changed successfully
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
            <PasswordInput id="cur-pw" label="Current Password"
              value={pwForm.current_password}
              onChange={e => setPwForm(f => ({ ...f, current_password: e.target.value }))}
              autoComplete="current-password" />
            <PasswordInput id="new-pw" label="New Password (min 8 characters)"
              value={pwForm.new_password}
              onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))}
              autoComplete="new-password" />
            <PasswordInput id="confirm-pw" label="Confirm New Password"
              value={pwForm.confirm_password}
              onChange={e => setPwForm(f => ({ ...f, confirm_password: e.target.value }))}
              autoComplete="new-password" />
            <button type="submit" disabled={pwLoading}
              className="w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
              style={{ background: G, color: '#fff', minHeight: 48 }}>
              {pwLoading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><Lock size={16} /> Change Password</>}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Passwords are never stored in plain text. Always use a strong, unique password.
            </p>
          </form>
        )}
      </Card>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: `${G}08`, borderColor: `${G}20` }}>
        <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" style={{ color: G }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: G }}>Security Tips</p>
          <ul className="text-xs text-gray-500 mt-1 space-y-1 list-disc list-inside">
            <li>Use a strong password with letters, numbers & symbols</li>
            <li>Never share your admin credentials</li>
            <li>Change your password regularly</li>
            <li>Your password is securely hashed — we never see it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
