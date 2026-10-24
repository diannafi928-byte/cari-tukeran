import React, { useEffect, useState } from 'react';
import { Info, ShieldCheck, X } from 'lucide-react';

export const AboutView: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(true);

  useEffect(() => {
    if (!isPrivacyOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPrivacyOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isPrivacyOpen]);

  return (
    <div className="page-shell">
      <main className="dashboard-main">
        <section className="admin-intro">
          <p className="eyebrow">TENTANG APLIKASI</p>
          <h1>Cari Tukeran Guru</h1>
          <p>
            Platform mandiri untuk membantu guru menemukan rekan tukeran berdasarkan profil dan
            preferensi yang dimasukkan pengguna.
          </p>
        </section>

        <section className="panel max-w-3xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="brand-mark flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white">
              <Info className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tentang Cari Tukeran Guru</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Aplikasi ini dibuat secara swadaya sebagai sarana saling bantu bagi para guru. Informasi
                kecocokan dan komunikasi melalui aplikasi ini bukan keputusan resmi terkait
                perpindahan atau mutasi.
              </p>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="button button-secondary mt-5 inline-flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Baca kebijakan privasi
              </button>
            </div>
          </div>
        </section>
      </main>

      {isPrivacyOpen && (
        <div
          className="user-modal"
          role="presentation"
          onClick={() => setIsPrivacyOpen(false)}
        >
          <section
            className="user-modal-box max-w-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="user-modal-close"
              aria-label="Tutup kebijakan privasi"
              onClick={() => setIsPrivacyOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pr-8">
              <p className="eyebrow">INFORMASI PENTING</p>
              <h2 id="privacy-title" className="text-xl font-extrabold text-slate-900">
                Kebijakan privasi &amp; tanggung jawab
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <p>
                Cari Tukeran Guru dibangun secara swadaya dan berada di luar naungan maupun
                tanggung jawab Dinas Pendidikan DKI Jakarta. Aplikasi ini bukan layanan atau kanal
                resmi Dinas Pendidikan DKI Jakarta.
              </p>
              <p>
                Informasi dan hasil kecocokan yang ditampilkan hanya merupakan sarana bantu.
                Pengguna bertanggung jawab secara pribadi atas keputusan, komunikasi, dan tindak
                lanjut yang dilakukan berdasarkan informasi dari sistem ini.
              </p>
              <p>
                Hindari membagikan informasi pribadi yang tidak diperlukan. Untuk ketentuan dan
                proses mutasi resmi, silakan konfirmasi kepada instansi yang berwenang.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="button button-primary"
              >
                Saya mengerti
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
