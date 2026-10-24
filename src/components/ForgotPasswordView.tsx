import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { api } from '../services/api';

interface ForgotPasswordViewProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.requestPasswordReset(email);
      if (response.status === 200) {
        setMessage(
          response.message ||
            'Jika alamat email terdaftar, tautan untuk mengatur ulang kata sandi akan dikirim.'
        );
      } else {
        setError(
          response.errors?.email?.[0] ||
            response.errors?.general?.[0] ||
            response.message ||
            'Tautan reset kata sandi gagal dikirim. Silakan coba lagi.'
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Permintaan gagal karena terjadi kesalahan.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card max-w-md w-full">
        <div className="text-center mb-6">
          <div className="brand-mark mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="eyebrow">BANTUAN AKUN</p>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lupa kata sandi?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Masukkan email akunmu. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="mb-5 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="reset-email">Alamat email</label>
            <input
              id="reset-email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="nama@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="button button-primary auth-submit"
          >
            {loading ? 'Mengirim tautan...' : 'Kirim tautan reset'}
          </button>
        </form>

        <p className="auth-switch">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-link inline-flex items-center gap-1 cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke halaman masuk
          </button>
        </p>
      </div>
    </div>
  );
};
