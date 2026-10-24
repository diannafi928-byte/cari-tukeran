import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Code2,
  Play,
  Copy,
  Check,
  ShieldAlert,
  Key,
  BookOpen,
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  category: 'guru' | 'admin' | 'auth';
  title: string;
  description: string;
  sampleBody?: string;
  run: (body?: any) => Promise<any> | any;
}

export const ApiConsole: React.FC = () => {
  const session = api.getCurrentSession();
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(2); // Default to GET /api/matches
  const [customBody, setCustomBody] = useState<string>('');
  const [responseOutput, setResponseOutput] = useState<{
    status: number;
    data: any;
    timeMs: number;
  } | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const endpoints: EndpointSpec[] = [
    // Auth
    {
      method: 'POST',
      path: '/api/login',
      category: 'auth',
      title: 'Tukar Kredensial Akun ke Token Bearer',
      description: 'Menerima email, password, dan device_name. Mengembalikan Bearer Token Sanctum.',
      sampleBody: JSON.stringify(
        {
          email: 'budi.santoso@guru.sd.belajar.id',
          password: 'password',
          device_name: 'Aplikasi Android',
        },
        null,
        2
      ),
      run: async (body) => {
        const parsed = JSON.parse(body || '{}');
        return await api.login(parsed.email, parsed.password, parsed.device_name);
      },
    },
    {
      method: 'DELETE',
      path: '/api/logout',
      category: 'auth',
      title: 'Cabut Token Bearer (Logout)',
      description: 'Mencabut token Bearer Sanctum yang sedang aktif.',
      run: async () => {
        return await api.logout();
      },
    },

    // Guru
    {
      method: 'GET',
      path: '/api/matches',
      category: 'guru',
      title: 'Daftar Calon Tukeran Cocok Dua Arah',
      description: 'Hanya mencakup kecocokan dua arah berdasarkan Sudin, jabatan, jenjang, mapel, dan kecamatan.',
      run: () => {
        return api.getMatches();
      },
    },
    {
      method: 'GET',
      path: '/api/profile',
      category: 'guru',
      title: 'Profil Guru Saat Ini',
      description: 'Mengambil profil mutasi guru yang terautentikasi.',
      run: () => {
        return api.getProfile();
      },
    },
    {
      method: 'POST',
      path: '/api/profile',
      category: 'guru',
      title: 'Buat atau Perbarui Profil Guru',
      description: 'Menyimpan preferensi mutasi ke sistem dinas pendidikan DKI.',
      sampleBody: JSON.stringify(
        {
          name: 'Budi Santoso, S.Pd.',
          phone: '+6281234567890',
          employment_type: 'PNS',
          school_name: 'SDN Cipayung 01 Pagi',
          school_address: 'Jl. Raya Cipayung No. 12, Jakarta Timur',
          sudin_id: 10,
          position: 'guru_kelas',
          level: 'SD',
          destination_position: 'guru_kelas',
          destination_levels: ['SD'],
          destination_sudin_id: 7,
          destination_district_codes: ['31.74.02'],
          province_code: '31',
          regency_code: '31.75',
          regency_name: 'Kota Administrasi Jakarta Timur',
          district_code: '31.75.07',
          district_name: 'Cipayung',
          village_code: '31.75.07.1001',
          village_name: 'Cipayung',
        },
        null,
        2
      ),
      run: async (body) => {
        const parsed = JSON.parse(body || '{}');
        return await api.saveProfile(parsed);
      },
    },
    {
      method: 'GET',
      path: '/api/sudins',
      category: 'guru',
      title: 'Daftar Sudin Pendidikan DKI',
      description: 'Mengambil 11 Sudin Pendidikan DKI beserta kecamatan di dalamnya.',
      run: () => {
        return api.getSudins();
      },
    },
    {
      method: 'GET',
      path: '/api/sudins/10/districts',
      category: 'guru',
      title: 'Daftar Kecamatan dalam Sudin',
      description: 'Mengambil kecamatan dalam Sudin Jakarta Timur Wilayah II (ID: 10).',
      run: () => {
        return api.getDistrictsBySudin(10);
      },
    },
    {
      method: 'PATCH',
      path: '/api/teacher-profile/status',
      category: 'guru',
      title: 'Perbarui Status Mutasi Guru',
      description: 'Memperbarui boolean is_mutated pada profil.',
      sampleBody: JSON.stringify({ is_mutated: true }, null, 2),
      run: async (body) => {
        const parsed = JSON.parse(body || '{"is_mutated": true}');
        return await api.updateMutationStatus(Boolean(parsed.is_mutated));
      },
    },
    {
      method: 'POST',
      path: '/api/teacher-profile/deletion-request',
      category: 'guru',
      title: 'Ajukan Penghapusan Profil Mutasi',
      description: 'Hanya dapat diajukan setelah status profil ditandai sudah mutasi.',
      run: async () => {
        return await api.requestProfileDeletion();
      },
    },

    // Admin
    {
      method: 'GET',
      path: '/api/admin/districts',
      category: 'admin',
      title: 'Daftar Semua Kecamatan DKI (Admin)',
      description: 'Memerlukan role admin untuk mengambil seluruh hierarki kecamatan.',
      run: () => {
        return api.getAllDistricts();
      },
    },
    {
      method: 'GET',
      path: '/api/admin/subjects',
      category: 'admin',
      title: 'Daftar Mata Pelajaran (Admin)',
      description: 'Mengambil master data mapel.',
      run: () => {
        return api.getSubjects();
      },
    },
    {
      method: 'POST',
      path: '/api/admin/match-notifications/scan',
      category: 'admin',
      title: 'Pindai Pasangan Kecocokan Baru (Admin)',
      description: 'Memindai profil baru dan menyusun pasangan kecocokan dua arah.',
      run: async () => {
        return await api.adminScanMatches();
      },
    },
    {
      method: 'POST',
      path: '/api/admin/match-notifications/send-pending',
      category: 'admin',
      title: 'Kirim Notifikasi Email Tertunda (Admin)',
      description: 'Mengirim email notifikasi resmi ke pasangan guru yang cocok.',
      run: async () => {
        return await api.adminSendPendingNotifications();
      },
    },
  ];

  const currentEp = endpoints[selectedEndpointIndex];

  const handleSelectEndpoint = (idx: number) => {
    setSelectedEndpointIndex(idx);
    setCustomBody(endpoints[idx].sampleBody || '');
    setResponseOutput(null);
  };

  const executeRequest = async () => {
    const start = performance.now();
    try {
      const res = await currentEp.run(customBody || currentEp.sampleBody);
      const timeMs = Math.round(performance.now() - start);
      setResponseOutput({
        status: res.status || 200,
        data: res,
        timeMs,
      });
    } catch (err: any) {
      const timeMs = Math.round(performance.now() - start);
      setResponseOutput({
        status: 500,
        data: { error: err.message || 'Eksekusi gagal' },
        timeMs,
      });
    }
  };

  const currentBaseUrl = api.getApiConfig().baseUrl || 'http://localhost:8000';
  const curlCommand = `curl -X ${currentEp.method} \\
  "${currentBaseUrl}${currentEp.path}" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer ${session?.token || 'YOUR_SANCTUM_TOKEN'}" \\
  ${
    currentEp.method !== 'GET' && currentEp.method !== 'DELETE'
      ? `-H "Content-Type: application/json" \\\n  -d '${(customBody || currentEp.sampleBody || '{}').replace(/\n/g, '')}'`
      : ''
  }`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copyJson = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput.data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="page-shell">
      <main className="dashboard-main max-w-7xl">
        <section className="admin-intro">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-600" />
            <p className="eyebrow">API SPECIFICATION & LIVE RUNNER</p>
          </div>
          <h1>Dokumentasi & Pengujian API Ruang Tukar</h1>
          <p>
            Semua endpoint memakai prefix <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-xs">/api</code>,
            mengembalikan JSON, dan diautentikasi menggunakan personal access token Laravel Sanctum.
          </p>
        </section>

        {/* Sanctum Token Status Card */}
        <div className="bg-slate-900 text-white p-4 rounded-xl mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400">Bearer Token Aktif (Sanctum): </span>
              <span className="font-mono text-sky-300 font-bold truncate max-w-md inline-block align-bottom">
                {session?.token || 'Belum Login (Header Authorization: Bearer null)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">
              Abilities: [{session?.abilities.join(', ') || 'guest'}]
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded">
              Role: {session?.user.role || 'Unauthenticated'}
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Endpoints Explorer & Execution Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Endpoints List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-xs uppercase text-slate-400 px-2 mb-2 tracking-wider">
                Daftar Endpoint API
              </h3>

              <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
                {endpoints.map((ep, idx) => {
                  const isSelected = selectedEndpointIndex === idx;
                  const methodColor =
                    ep.method === 'GET'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ep.method === 'POST'
                      ? 'bg-sky-100 text-sky-800'
                      : ep.method === 'PATCH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800';

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectEndpoint(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition border flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${methodColor}`}>
                          {ep.method}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase ${
                            isSelected ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {ep.category}
                        </span>
                      </div>
                      <p className={`font-mono text-[11px] truncate ${isSelected ? 'text-sky-300' : 'text-slate-800'}`}>
                        {ep.path}
                      </p>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {ep.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Runner & Response (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Endpoint Header */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                      currentEp.method === 'GET'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentEp.method === 'POST'
                        ? 'bg-sky-100 text-sky-800'
                        : currentEp.method === 'PATCH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {currentEp.method}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {currentEp.path}
                  </span>
                </div>

                <button
                  onClick={executeRequest}
                  className="button button-primary text-xs py-1.5 px-4 flex items-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Kirim Permintaan (Send Request)</span>
                </button>
              </div>

              <h2 className="text-base font-bold text-slate-900">{currentEp.title}</h2>
              <p className="text-xs text-slate-600 mt-1">{currentEp.description}</p>

              {/* Request Body if applicable */}
              {(currentEp.method === 'POST' ||
                currentEp.method === 'PATCH' ||
                currentEp.method === 'PUT') && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">Request Body (JSON):</label>
                    <span className="text-[10px] text-slate-400">Content-Type: application/json</span>
                  </div>
                  <textarea
                    rows={7}
                    value={customBody || currentEp.sampleBody || ''}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="app-input font-mono text-xs bg-slate-900 text-emerald-400 border-slate-800"
                  />
                </div>
              )}

              {/* Curl snippet */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1 text-xs text-slate-500 font-semibold">
                  <span>cURL Command</span>
                  <button
                    onClick={copyCurl}
                    className="flex items-center gap-1 text-sky-600 hover:text-sky-800 text-[11px]"
                  >
                    {copiedCurl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCurl ? 'Tersalin' : 'Salin cURL'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre">
                  {curlCommand}
                </pre>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-slate-800 text-sm">Response Body</span>
                </div>

                {responseOutput && (
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        responseOutput.status >= 200 && responseOutput.status < 300
                          ? 'bg-emerald-100 text-emerald-800'
                          : responseOutput.status === 422
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Status: {responseOutput.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {responseOutput.timeMs}ms
                    </span>
                    <button
                      onClick={copyJson}
                      className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      {copiedJson ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedJson ? 'Tersalin' : 'Salin JSON'}</span>
                    </button>
                  </div>
                )}
              </div>

              {responseOutput ? (
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 whitespace-pre leading-relaxed">
                  {JSON.stringify(responseOutput.data, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                  Klik tombol <strong>"Kirim Permintaan"</strong> di atas untuk mengeksekusi endpoint ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>Ruang Tukar Guru · API Documentation & Sandbox</span>
        <span>Conforms to Laravel Sanctum Bearer Auth Specifications</span>
      </footer>
    </div>
  );
};
