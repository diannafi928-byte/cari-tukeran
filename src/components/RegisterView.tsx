import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface RegisterViewProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await api.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.status === 201) {
        if (res.isLive) {
          setSuccessMsg(
            res.message || 'Pendaftaran berhasil. Silakan periksa email untuk verifikasi akun.'
          );
          setRegistered(true);
        } else {
          onSuccess();
        }
      } else {
        const responseErrors = res.errors || {};
        setErrors({
          ...responseErrors,
          ...(responseErrors.network && !responseErrors.general
            ? { general: responseErrors.network }
            : {}),
          ...(Object.keys(responseErrors).length === 0
            ? { general: [res.message || 'Pendaftaran gagal. Silakan coba lagi.'] }
            : {}),
        });
      }
    } catch (error) {
      setErrors({
        general: [
          error instanceof Error ? error.message : 'Pendaftaran gagal karena terjadi kesalahan.',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">MULAI PERJALANANMU</p>
          <h2>Buat akun baru</h2>
          <p>Daftar untuk menemukan calon tukeran guru di DKI Jakarta.</p>
        </div>

        {successMsg && (
          <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {registered ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="button button-primary auth-submit"
          >
            Kembali ke halaman masuk
          </button>
        ) : (
          <>
            {errors.general && (
              <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errors.general[0]}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="name">Nama lengkap</label>
            <input
              id="name"
              className={`auth-input ${errors.name ? 'border-red-500' : ''}`}
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              autoComplete="name"
              placeholder="Contoh: Muhammad Ilham, S.Pd."
            />
            {errors.name && <p className="field-error">{errors.name[0]}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Alamat email</label>
            <input
              id="email"
              className={`auth-input ${errors.email ? 'border-red-500' : ''}`}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="nama@guru.sd.belajar.id"
            />
            {errors.email && <p className="field-error">{errors.email[0]}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Kata sandi</label>
            <input
              id="password"
              className={`auth-input ${errors.password ? 'border-red-500' : ''}`}
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
            />
            {errors.password && <p className="field-error">{errors.password[0]}</p>}
          </div>

          <div className="field">
            <label htmlFor="password_confirmation">Ulangi kata sandi</label>
            <input
              id="password_confirmation"
              className={`auth-input ${errors.password_confirmation ? 'border-red-500' : ''}`}
              type="password"
              name="password_confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Ketik ulang kata sandi"
            />
            {errors.password_confirmation && (
              <p className="field-error">{errors.password_confirmation[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button button-primary auth-submit flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Membuat akun...' : 'Buat akun'}</span>
            <span aria-hidden="true">→</span>
          </button>
            </form>

            <p className="auth-switch">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="auth-link cursor-pointer border-none bg-transparent"
              >
                Masuk
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
