import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  DeletionRequest,
  District,
  MatchNotificationPair,
  Subject,
  Sudin,
  TeacherProfile,
  User,
} from '../types';
import {
  Shield,
  MapPin,
  BookOpen,
  Users,
  Trash2,
  Mail,
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Search,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'notifications' | 'deletions' | 'sudins' | 'subjects' | 'users'
  >('notifications');

  // Data states
  const [sudins, setSudins] = useState<Sudin[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
  const [matchPairs, setMatchPairs] = useState<MatchNotificationPair[]>([]);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Sudin form modal / state
  const [newSudinName, setNewSudinName] = useState('');
  const [newSudinAbbr, setNewSudinAbbr] = useState('');
  const [newSudinDistrictCode, setNewSudinDistrictCode] = useState('');
  const [newSudinDistrictName, setNewSudinDistrictName] = useState('');

  // New Subject
  const [newSubjectName, setNewSubjectName] = useState('');
  const [csvContent, setCsvContent] = useState('');

  const loadAll = () => {
    setSudins(api.getSudins().data || []);
    setSubjects(api.getSubjects().data || []);
    setUsers(api.getAllUsers().data || []);
    setDeletionRequests(api.getDeletionRequests().data || []);
    setMatchPairs(api.getMatchNotifications().data || []);
  };

  useEffect(() => {
    loadAll();
    const unsub = api.subscribe(loadAll);
    return unsub;
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4500);
  };

  // Review deletion
  const handleReviewDeletion = async (id: number, decision: 'approve' | 'reject') => {
    const res = await api.adminReviewDeletionRequest(id, decision);
    if (res.status === 200) {
      showNotification('success', res.message || 'Tinjauan berhasil diproses.');
    } else {
      showNotification('error', res.message || 'Gagal memproses tinjauan.');
    }
  };

  // Scan matches
  const handleScanMatches = async () => {
    const res = await api.adminScanMatches();
    if (res.status === 200) {
      showNotification('success', res.message || 'Pemindaian selesai.');
    }
  };

  // Send pending notifications
  const handleSendPending = async () => {
    const res = await api.adminSendPendingNotifications();
    if (res.status === 200) {
      showNotification('success', res.message || 'Notifikasi email berhasil dikirim.');
    }
  };

  // Resend single pair
  const handleResendPair = async (id: number) => {
    const res = await api.adminSendPairNotification(id);
    if (res.status === 200) {
      showNotification('success', res.message || 'Notifikasi berhasil dikirim ulang.');
    }
  };

  // Create Subject
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const res = await api.adminCreateSubject(newSubjectName);
    if (res.status === 201) {
      setNewSubjectName('');
      showNotification('success', res.message || 'Mata pelajaran berhasil ditambahkan.');
    } else {
      showNotification('error', res.message || 'Gagal menambahkan mata pelajaran.');
    }
  };

  // Delete Subject
  const handleDeleteSubject = async (id: number) => {
    const res = await api.adminDeleteSubject(id);
    if (res.status === 200) {
      showNotification('success', res.message || 'Mata pelajaran dihapus.');
    } else {
      showNotification('error', res.message || 'Gagal menghapus mata pelajaran.');
    }
  };

  // Import CSV
  const handleImportCsv = async () => {
    if (!csvContent.trim()) return;
    const res = await api.adminImportSubjectsCsv(csvContent);
    if (res.status === 200) {
      setCsvContent('');
      showNotification('success', res.message || 'Impor CSV selesai.');
    } else {
      showNotification('error', res.message || 'Gagal mengimpor CSV.');
    }
  };

  // Create Sudin
  const handleCreateSudin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSudinName.trim() || !newSudinDistrictCode.trim() || !newSudinDistrictName.trim()) {
      showNotification('error', 'Semua field wajib diisi.');
      return;
    }

    const res = await api.adminCreateSudin({
      name: newSudinName,
      abbreviation: newSudinAbbr,
      districts: [
        {
          code: newSudinDistrictCode,
          name: newSudinDistrictName,
          regency_code: '31.75',
          regency_name: 'Kota Administrasi DKI Jakarta',
        },
      ],
    });

    if (res.status === 201) {
      setNewSudinName('');
      setNewSudinAbbr('');
      setNewSudinDistrictCode('');
      setNewSudinDistrictName('');
      showNotification('success', res.message || 'Sudin berhasil ditambahkan.');
    } else {
      showNotification('error', res.message || 'Gagal menambahkan Sudin.');
    }
  };

  // Delete Sudin
  const handleDeleteSudin = async (id: number) => {
    const res = await api.adminDeleteSudin(id);
    if (res.status === 200) {
      showNotification('success', res.message || 'Sudin dihapus.');
    } else {
      showNotification('error', res.message || 'Gagal menghapus Sudin.');
    }
  };

  // Verify email
  const handleVerifyEmail = async (userId: number) => {
    const res = await api.adminVerifyEmail(userId);
    if (res.status === 200) {
      showNotification('success', res.message || 'Email user diverifikasi.');
    }
  };

  // Reset password
  const handleResetPassword = async (userId: number) => {
    const res = await api.adminResetPassword(userId);
    if (res.status === 200) {
      showNotification('success', res.message || 'Tautan reset password terkirim.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Yakin ingin menghapus permanen user dan profil terkait?')) return;
    const res = await api.adminDeleteUser(userId);
    if (res.status === 200) {
      showNotification('success', res.message || 'User berhasil dihapus.');
    } else {
      showNotification('error', res.message || 'Gagal menghapus user.');
    }
  };

  return (
    <div className="page-shell">
      <main className="dashboard-main">
        <section className="admin-intro flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <p className="eyebrow text-amber-600">PANEL ADMINISTRATOR</p>
            </div>
            <h1>Kelola Sistem Cari Tukeran Guru</h1>
            <p>
              Operasi resmi Dinas Pendidikan DKI Jakarta: Notifikasi kecocokan, verifikasi akun,
              tinjauan penghapusan, dan manajemen master data wilayah/mapel.
            </p>
          </div>
        </section>

        {msg && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in ${
              msg.type === 'success'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 ${
              activeSubTab === 'notifications'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Notifikasi Kecocokan</span>
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
              {matchPairs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('deletions')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 ${
              activeSubTab === 'deletions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Tinjau Penghapusan</span>
            {deletionRequests.filter((d) => d.status === 'pending').length > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {deletionRequests.filter((d) => d.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('sudins')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 ${
              activeSubTab === 'sudins'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Sudin & Kecamatan ({sudins.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 ${
              activeSubTab === 'subjects'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Mata Pelajaran ({subjects.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition shrink-0 ${
              activeSubTab === 'users'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Pengguna ({users.length})</span>
          </button>
        </div>

        {/* 1. MATCH NOTIFICATIONS */}
        {activeSubTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Pemindaian & Pengiriman Email Kecocokan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algoritma background yang mencari pasangan guru cocok dua arah dan mengirimkan
                  notifikasi email resmi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScanMatches}
                  className="button button-secondary text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Pindai Pasangan Baru (Scan)</span>
                </button>

                <button
                  onClick={handleSendPending}
                  className="button button-primary text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Semua Pending</span>
                </button>
              </div>
            </div>

            <div className="panel overflow-hidden">
              <div className="panel-heading">
                <h2>Daftar Pasangan Kecocokan Terdeteksi</h2>
                <span className="step-number">{matchPairs.length}</span>
              </div>

              <div className="dt-scroll">
                <table className="dt-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Guru A</th>
                      <th>Arah A</th>
                      <th>Guru B</th>
                      <th>Arah B</th>
                      <th>Status Email</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchPairs.map((pair) => (
                      <tr key={pair.id}>
                        <td className="font-mono text-xs text-slate-500">#{pair.id}</td>
                        <td>
                          <strong>{pair.teacher_a.name}</strong>
                          <small>
                            {pair.teacher_a.sudin?.abbreviation} · {pair.teacher_a.school_name}
                          </small>
                        </td>
                        <td>
                          <span className="dt-badge dt-badge-primary">
                            {pair.teacher_a.sudin?.abbreviation} ➔{' '}
                            {pair.teacher_a.destinationSudin?.abbreviation}
                          </span>
                        </td>
                        <td>
                          <strong>{pair.teacher_b.name}</strong>
                          <small>
                            {pair.teacher_b.sudin?.abbreviation} · {pair.teacher_b.school_name}
                          </small>
                        </td>
                        <td>
                          <span className="dt-badge dt-badge-primary">
                            {pair.teacher_b.sudin?.abbreviation} ➔{' '}
                            {pair.teacher_b.destinationSudin?.abbreviation}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`dt-badge ${
                              pair.status === 'sent' ? 'dt-badge-success' : 'dt-badge-warning'
                            }`}
                          >
                            {pair.status === 'sent' ? 'Terkirim' : 'Tertunda (Pending)'}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleResendPair(pair.id)}
                            className="button button-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            Kirim Ulang
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. DELETION REQUESTS REVIEW */}
        {activeSubTab === 'deletions' && (
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">PENGAJUAN HAPUS PROFIL MUTASI</p>
                <h2>Tinjauan Permohonan Penghapusan (Soft Delete)</h2>
              </div>
              <span className="step-number">{deletionRequests.length}</span>
            </div>

            <div className="dt-scroll">
              <table className="dt-table">
                <thead>
                  <tr>
                    <th>Pemohon</th>
                    <th>Sekolah & Sudin</th>
                    <th>Waktu Pengajuan</th>
                    <th>Status</th>
                    <th className="text-right">Keputusan Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {deletionRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                        Belum ada pengajuan penghapusan profil mutasi.
                      </td>
                    </tr>
                  ) : (
                    deletionRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <strong>{req.user_name}</strong>
                          <small>{req.user_email}</small>
                        </td>
                        <td>
                          <p className="font-semibold text-slate-800 text-xs">{req.school_name}</p>
                          <small>{req.sudin_name}</small>
                        </td>
                        <td className="text-xs text-slate-500">
                          {new Date(req.requested_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td>
                          <span
                            className={`dt-badge ${
                              req.status === 'approved'
                                ? 'dt-badge-success'
                                : req.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'dt-badge-warning'
                            }`}
                          >
                            {req.status === 'approved'
                              ? 'Disetujui'
                              : req.status === 'rejected'
                              ? 'Ditolak'
                              : 'Menunggu Review'}
                          </span>
                        </td>
                        <td className="text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReviewDeletion(req.id, 'approve')}
                                className="button button-success text-xs py-1 px-2.5"
                              >
                                Setujui (Hapus)
                              </button>
                              <button
                                onClick={() => handleReviewDeletion(req.id, 'reject')}
                                className="button button-danger text-xs py-1 px-2.5"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Selesai ditinjau</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SUDINS & DISTRICTS */}
        {activeSubTab === 'sudins' && (
          <div className="space-y-6">
            {/* Add Sudin Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Tambah Sudin Baru</span>
              </h3>
              <form onSubmit={handleCreateSudin} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="field">
                  <label>Nama Sudin</label>
                  <input
                    type="text"
                    value={newSudinName}
                    onChange={(e) => setNewSudinName(e.target.value)}
                    placeholder="Contoh: Sudin Pendidikan Khusus"
                    className="app-input text-xs"
                    required
                  />
                </div>
                <div className="field">
                  <label>Singkatan</label>
                  <input
                    type="text"
                    value={newSudinAbbr}
                    onChange={(e) => setNewSudinAbbr(e.target.value)}
                    placeholder="Contoh: SPK"
                    className="app-input text-xs"
                  />
                </div>
                <div className="field">
                  <label>Kode Kecamatan Utama</label>
                  <input
                    type="text"
                    value={newSudinDistrictCode}
                    onChange={(e) => setNewSudinDistrictCode(e.target.value)}
                    placeholder="31.75.99"
                    className="app-input text-xs"
                    required
                  />
                </div>
                <div className="field">
                  <label>Nama Kecamatan Utama</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSudinDistrictName}
                      onChange={(e) => setNewSudinDistrictName(e.target.value)}
                      placeholder="Contoh: Wilayah Khusus"
                      className="app-input text-xs"
                      required
                    />
                    <button type="submit" className="button button-primary text-xs shrink-0 px-3">
                      Tambah
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h2>Daftar Sudin Pendidikan DKI Jakarta</h2>
                <span className="step-number">{sudins.length}</span>
              </div>

              <div className="dt-scroll">
                <table className="dt-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Sudin</th>
                      <th>Singkatan</th>
                      <th>Cakupan Kecamatan Terdaftar</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sudins.map((s) => (
                      <tr key={s.id}>
                        <td className="font-mono text-xs text-slate-400">#{s.id}</td>
                        <td>
                          <strong>{s.name}</strong>
                        </td>
                        <td>
                          <span className="dt-badge">{s.abbreviation || '-'}</span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {s.districts.map((d) => (
                              <span
                                key={d.code}
                                className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]"
                              >
                                {d.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteSudin(s.id)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-semibold p-1"
                            title="Hapus Sudin (Hanya jika belum dipakai guru)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. SUBJECTS & CSV IMPORT */}
        {activeSubTab === 'subjects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Add Single Subject */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>Tambah Mata Pelajaran Satuan</span>
                </h3>
                <form onSubmit={handleCreateSubject} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="Contoh: Bahasa Mandarin / Robotika"
                    className="app-input text-xs"
                    required
                  />
                  <button type="submit" className="button button-primary text-xs shrink-0 px-4">
                    Simpan
                  </button>
                </form>
              </div>

              {/* CSV Bulk Import */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Impor CSV Mata Pelajaran (POST /api/admin/subjects/import)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mb-2">
                  Format satu nama mapel per baris (kolom pertama). Duplikat akan otomatis dilewati.
                </p>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    placeholder="Matematika Lanjut&#10;Teknik Pengelasan&#10;Desain Grafis"
                    className="app-input text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleImportCsv}
                    className="button button-success text-xs shrink-0 px-4"
                  >
                    Impor
                  </button>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h2>Daftar Mata Pelajaran Aktif</h2>
                <span className="step-number">{subjects.length}</span>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs flex items-center justify-between group"
                  >
                    <span className="font-semibold text-slate-800">{sub.name}</span>
                    <button
                      onClick={() => handleDeleteSubject(sub.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Hapus mapel (Hanya jika belum dipakai profil)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. USER ACCOUNTS & EMAIL VERIFY */}
        {activeSubTab === 'users' && (
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">PENGGUNA TERDAFTAR</p>
                <h2>Manajemen Akun Guru & Administrator</h2>
              </div>
              <span className="step-number">{users.length}</span>
            </div>

            <div className="dt-scroll">
              <table className="dt-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verifikasi Email</th>
                    <th className="text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <small className="text-slate-400">ID: #{u.id}</small>
                      </td>
                      <td className="text-xs font-mono text-slate-700">{u.email}</td>
                      <td>
                        <span
                          className={`dt-badge ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'dt-badge-soft'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {u.email_verified_at ? (
                          <span className="dt-badge dt-badge-success">Terverifikasi</span>
                        ) : (
                          <button
                            onClick={() => handleVerifyEmail(u.id)}
                            className="button button-secondary text-[11px] py-1 px-2"
                          >
                            Verifikasi Sekarang
                          </button>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResetPassword(u.id)}
                            className="button button-secondary text-[11px] py-1 px-2"
                            title="Kirim link reset password ke email user"
                          >
                            Kirim Reset Sandi
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                            title="Hapus permanen akun user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Cari Tukeran Guru · Admin Console</span>
        <span>Akses restricted khusus Dinas Pendidikan Provinsi DKI Jakarta</span>
      </footer>
    </div>
  );
};
