import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TeacherProfile, TwoWayMatch } from '../types';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Building,
  CheckCircle,
  Check,
  AlertTriangle,
  ArrowRightLeft,
  MapPin,
  Send,
  Trash2,
  Filter,
} from 'lucide-react';

interface DashboardMatchesProps {
  onNavigateToProfile: () => void;
}

export const DashboardMatches: React.FC<DashboardMatchesProps> = ({ onNavigateToProfile }) => {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [matches, setMatches] = useState<TwoWayMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const loadData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const profRes = await api.getProfileAsync();
      if (profRes.status !== 200) {
        throw new Error(profRes.message || 'Gagal memuat profil dari server.');
      }
      setProfile(profRes.data || null);

      if (profRes.data) {
        const matchRes = await api.getMatchesAsync(districtFilter || undefined);
        if (matchRes.status !== 200 || !Array.isArray(matchRes.data)) {
          throw new Error(matchRes.message || 'Gagal mencari kecocokan dari server.');
        }
        setMatches(matchRes.data);
      } else {
        setMatches([]);
      }
    } catch (err) {
      setMatches([]);
      setLoadError(
        err instanceof Error ? err.message : 'Gagal memuat data kecocokan dari server.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = api.subscribe(loadData);
    return unsub;
  }, [districtFilter]);

  if (loading) {
    return (
      <div className="page-shell">
        <main className="dashboard-main py-20 text-center">
          <p className="text-sm text-slate-500">Memuat kecocokan dari server...</p>
        </main>
      </div>
    );
  }

  const handleToggleMutationStatus = async () => {
    if (!profile) return;
    setIsUpdatingStatus(true);
    const newStatus = !profile.is_mutated;
    const res = await api.updateMutationStatus(newStatus);
    setIsUpdatingStatus(false);

    if (res.status === 200) {
      setFeedbackMsg({
        type: 'success',
        text: res.message || 'Status mutasi berhasil diperbarui.',
      });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.message || 'Gagal mengubah status mutasi.',
      });
    }
  };

  const handleRequestDeletion = async () => {
    if (!profile) return;
    if (!profile.is_mutated) {
      setFeedbackMsg({
        type: 'error',
        text: 'Anda harus menandai status profil sebagai "Sudah Mutasi" terlebih dahulu sebelum mengajukan permohonan penghapusan.',
      });
      return;
    }

    setIsRequestingDeletion(true);
    const res = await api.requestProfileDeletion();
    setIsRequestingDeletion(false);

    if (res.status === 201 || res.status === 200) {
      setFeedbackMsg({
        type: 'success',
        text: res.message || 'Permohonan penghapusan profil berhasil diajukan.',
      });
      setTimeout(() => setFeedbackMsg(null), 5000);
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.message || 'Gagal mengajukan penghapusan.',
      });
    }
  };

  if (!profile) {
    return (
      <div className="page-shell">
        <main className="dashboard-main">
          <section className="admin-intro">
            <p className="eyebrow">CARI TUKERAN</p>
            <h1>Calon Tukeran Dua Arah</h1>
            <p>Temukan rekan guru yang saling membutuhkan penempatan di sekolah dan Sudin Anda.</p>
          </section>

          <section className="panel admin-users-panel">
            <div className="empty-state">
              {loadError ? (
                <div className="space-y-3">
                  <p className="text-rose-700">{loadError}</p>
                  <button type="button" onClick={loadData} className="button button-secondary text-xs">
                    Coba lagi
                  </button>
                </div>
              ) : (
                <>
                  <span className="empty-symbol">⌁</span>
                  <p>
                    Lengkapi{' '}
                    <button
                      type="button"
                      onClick={onNavigateToProfile}
                      className="font-bold text-sky-600 underline hover:text-sky-800"
                    >
                      profil mutasi
                    </button>{' '}
                    terlebih dahulu agar sistem dapat menghitung kecocokan dua arah.
                  </p>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Destination districts for filter
  const availableDistrictsForFilter = profile.destinationSudin?.districts || [];

  return (
    <div className="page-shell">
      <main className="dashboard-main">
        {/* Intro */}
        <section className="admin-intro flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="eyebrow">DASHBOARD MUTASI</p>
            <h1>Calon Tukeran Dua Arah</h1>
            <p>
              Pencocokan sistem dua arah: Rekan guru di bawah memiliki jabatan & jenjang yang sama,
              berasal dari Sudin tujuanmu, dan ingin mutasi ke Sudin asalmu.
            </p>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="button button-secondary text-xs self-start md:self-auto shrink-0"
          >
            Ubah Profil & Preferensi Saya
          </button>
        </section>

        {/* Feedback message */}
        {feedbackMsg && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Status Card & Mutation Lifecycle Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: My Profile Summary */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="eyebrow">PROFIL SAYA</p>
            <h3 className="font-bold text-slate-800 text-base">{profile.name}</h3>
            <p className="text-xs text-slate-500 mb-3">{profile.school_name}</p>

            <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Jabatan:</span>
                <span className="font-semibold text-slate-700">
                  {profile.position === 'guru_kelas' ? 'Guru Kelas' : 'Guru Mapel'} ({profile.level})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sudin Asal:</span>
                <span className="font-semibold text-slate-700">
                  {profile.sudin?.abbreviation || 'Sudin Asal'} · {profile.district_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sudin Tujuan:</span>
                <span className="font-semibold text-sky-700">
                  {profile.destinationSudin?.abbreviation || 'Sudin Tujuan'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Mutation Status Toggle */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="eyebrow">STATUS PROSES MUTASI</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    profile.is_mutated
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      profile.is_mutated ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  ></span>
                  {profile.is_mutated ? 'Sudah Mutasi (Selesai SK)' : 'Belum Mutasi (Mencari)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Tandai sudah mutasi bila SK perpindahan telah diterbitkan Dinas Pendidikan DKI.
              </p>
            </div>

            <button
              onClick={handleToggleMutationStatus}
              disabled={isUpdatingStatus}
              className={`button text-xs mt-3 ${
                profile.is_mutated ? 'button-secondary' : 'button-success'
              }`}
            >
              {profile.is_mutated ? 'Kembalikan ke Belum Mutasi' : 'Tandai Sudah Mutasi'}
            </button>
          </div>

          {/* Card 3: Deletion Request */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <p className="eyebrow">HAPUS DATA SETELAH MUTASI</p>
              <h4 className="font-bold text-slate-800 text-sm">Pengajuan Hapus Profil</h4>
              <p className="text-xs text-slate-500 mt-1">
                Sesuai ketentuan, profil yang sudah mutasi dapat mengajukan penghapusan akun ke admin
                Dinas Pendidikan.
              </p>
              {profile.deletion_request_status && (
                <div className="mt-2 text-xs">
                  <span className="text-slate-500">Status pengajuan: </span>
                  <span
                    className={`font-semibold ${
                      profile.deletion_request_status === 'pending'
                        ? 'text-amber-600'
                        : profile.deletion_request_status === 'approved'
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {profile.deletion_request_status === 'pending'
                      ? 'Menunggu Peninjauan Admin'
                      : profile.deletion_request_status === 'approved'
                      ? 'Disetujui'
                      : 'Ditolak'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleRequestDeletion}
              disabled={isRequestingDeletion || profile.deletion_request_status === 'pending'}
              className="button button-danger text-xs mt-3 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {profile.deletion_request_status === 'pending'
                ? 'Pengajuan Sedang Diproses'
                : 'Ajukan Penghapusan'}
            </button>
          </div>
        </div>

        {/* Matches Section Header & Optional Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-800">
              Hasil Kecocokan ({matches.length})
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Saling Cocok
            </span>
          </div>

          {/* Candidate Origin District Filter (GET /api/matches?candidate_origin_district_code=...) */}
          {availableDistrictsForFilter.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="app-input text-xs py-1.5 px-3 rounded-lg"
              >
                <option value="">Semua Kecamatan di {profile.destinationSudin?.abbreviation}</option>
                {availableDistrictsForFilter.map((d) => (
                  <option key={d.code} value={d.code}>
                    Kecamatan {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Matches Cards */}
        {matches.length === 0 ? (
          <div className="panel p-8 text-center bg-white">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-600">
                <ArrowRightLeft className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Belum Ada Kecocokan Dua Arah
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Sistem terus memindai saat guru lain mendaftarkan profil mereka. Anda juga dapat
                memperbarui preferensi profil agar hasil pencarian sesuai dengan kebutuhan mutasi Anda.
              </p>
              {districtFilter && (
                <button
                  onClick={() => setDistrictFilter('')}
                  className="button button-secondary text-xs"
                >
                  Hapus Filter Kecamatan
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => {
              const partner = match.partner;
              const waNumberClean = partner.phone.replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `Halo Ibu/Bapak ${partner.name}, saya ${profile.name} dari ${profile.school_name} (${profile.sudin?.name}). Saya melihat kecocokan mutasi dua arah kita di platform Ruang Tukar Guru DKI. Apakah berkenan untuk koordinasi proses tukaran ini? Terima kasih.`
              );
              const waUrl = `https://wa.me/${waNumberClean}?text=${waText}`;

              return (
                <div
                  key={match.id}
                  className="bg-white border-2 border-emerald-500/40 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Top Match Banner */}
                  <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 px-6 py-2.5 text-white flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="font-bold text-sm tracking-wide">
                        Kecocokan Dua Arah
                      </span>
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full font-medium">
                      {match.matchReason || 'Sudin, jabatan, jenjang, mapel, dan wilayah sesuai'}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1: Candidate Profile & School */}
                      <div className="lg:border-r border-slate-100 lg:pr-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="dt-badge dt-badge-primary mb-1">
                              {partner.employment_type}
                            </span>
                            <h3 className="text-lg font-extrabold text-slate-900">{partner.name}</h3>
                            <p className="text-xs font-semibold text-sky-700 mt-0.5">
                              {partner.position === 'guru_kelas' ? 'Guru Kelas' : 'Guru Mapel'} ·{' '}
                              {partner.level}
                              {partner.subject ? ` (${partner.subject.name})` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                          <div className="flex items-center gap-2 font-semibold text-slate-800">
                            <Building className="w-4 h-4 text-slate-500" />
                            <span>{partner.school_name}</span>
                          </div>
                          <p className="text-slate-500 pl-6">{partner.school_address}</p>
                          <div className="flex items-center gap-1.5 pl-6 pt-1 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Kec. {partner.district_name}, {partner.regency_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Exchange Flow Visualizer */}
                      <div className="flex flex-col justify-center bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                        <p className="eyebrow text-center mb-3">ARAH PERPINDAHAN</p>

                        <div className="space-y-3 text-xs">
                          {/* Flow 1: You */}
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-slate-700 block mb-1">
                              Anda ({profile.name}):
                            </span>
                            <div className="flex items-center gap-2 text-slate-600">
                              <span className="font-medium text-slate-800">
                                {profile.sudin?.abbreviation} ({profile.district_name})
                              </span>
                              <span className="text-sky-600 font-bold">➔</span>
                              <span className="font-medium text-sky-700">
                                {profile.destinationSudin?.abbreviation} (Sekolah Rekan)
                              </span>
                            </div>
                          </div>

                          {/* Flow 2: Partner */}
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="font-bold text-slate-700 block mb-1">
                              Rekan ({partner.name}):
                            </span>
                            <div className="flex items-center gap-2 text-slate-600">
                              <span className="font-medium text-slate-800">
                                {partner.sudin?.abbreviation} ({partner.district_name})
                              </span>
                              <span className="text-emerald-600 font-bold">➔</span>
                              <span className="font-medium text-emerald-700">
                                {partner.destinationSudin?.abbreviation} (Sekolah Anda)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Contact & Direct Action (WhatsApp / Phone) */}
                      <div className="flex flex-col justify-between bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-emerald-700" />
                            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                              Kontak Terbuka
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-3">
                            Nomor kontak terbuka resmi untuk koordinasi mutasi antar guru yang saling
                            cocok.
                          </p>

                          <div className="bg-white p-3 rounded-lg border border-emerald-200 text-sm font-bold text-slate-800 tracking-wide mb-3 flex items-center justify-between">
                            <span>{partner.phone}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                              Aktif
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mt-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full button button-success text-xs py-2.5 flex items-center justify-center gap-2 shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Hubungi via WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${partner.phone}`}
                            className="w-full button button-secondary text-xs py-2 flex items-center justify-center gap-2"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-600" />
                            <span>Panggil Telepon</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Ruang Tukar Guru · Hasil Kecocokan</span>
        <span>Kecocokan dihitung otomatis dua arah sesuai regulasi mutasi DKI Jakarta</span>
      </footer>
    </div>
  );
};
