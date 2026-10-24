import React, { useState } from 'react';
import { api } from '../services/api';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const res = await api.login(email, password, 'Aplikasi Web');
    setLoading(false);

    if (res.status === 200) {
      onSuccess();
    } else if (res.errors) {
      setErrors(res.errors);
    } else {
      setErrors({ email: [res.message || 'Kredensial yang diberikan tidak valid.'] });
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md mb-3">
            <svg
              className="w-6 h-6 text-emerald-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8h16" />
              <path d="m15 4 4 4-4 4" />
              <path d="M21 16H5" />
              <path d="m9 12-4 4 4 4" />
            </svg>
          </div>
          <p className="eyebrow text-emerald-800">RUANG TUKAR GURU · DKI JAKARTA</p>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk ke akun</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan email dan kata sandi Anda untuk melanjutkan.
          </p>
        </div>

        {/* Error notification */}
        {errors.email && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3.5 py-3 rounded-lg flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errors.email[0]}</span>
          </div>
        )}

        {/* Clean Login Form: Only Email, Password, & Login Button */}
        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="field">
            <label htmlFor="login-email" className="text-xs font-semibold text-slate-700">
              Alamat email
            </label>
            <input
              id="login-email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="nama@email.com"
            />
          </div>

          <div className="field">
            <label htmlFor="login-password" className="text-xs font-semibold text-slate-700">
              Kata sandi
            </label>
            <input
              id="login-password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full button button-primary py-2.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <span>{loading ? 'Memproses...' : 'Masuk'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="auth-switch text-xs text-center text-slate-500 mt-6 pt-4 border-t border-slate-100">
          Belum punya akun?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="auth-link text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer border-none bg-transparent"
          >
            Daftar baru
          </button>
        </p>
      </div>
    </div>
  );
};
