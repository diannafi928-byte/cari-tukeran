import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { District, Level, Position, ProfileInput, Subject, Sudin, TeacherProfile, Village } from '../types';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  MapPin,
  GraduationCap,
  Info,
  Loader2,
  RefreshCw,
  Globe,
  Check,
} from 'lucide-react';

interface ProfileEditProps {
  onSaved: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ onSaved }) => {
  const [loading, setLoading] = useState(true);
  const [sudins, setSudins] = useState<Sudin[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [existingProfile, setExistingProfile] = useState<TeacherProfile | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [employmentType, setEmploymentType] = useState<'PNS'>('PNS');
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');

  // Origin State
  const [sudinId, setSudinId] = useState<number>(1);
  const [districtCode, setDistrictCode] = useState<string>('');
  const [villageCode, setVillageCode] = useState<string>('');
  const [villageName, setVillageName] = useState<string>('');
  const [position, setPosition] = useState<Position>('guru_kelas');
  const [level, setLevel] = useState<Level>('SD');
  const [subjectId, setSubjectId] = useState<number | ''>('');

  // Destination State
  const [destinationSudinId, setDestinationSudinId] = useState<number>(2);
  const [destinationDistrictCodes, setDestinationDistrictCodes] = useState<string[]>([]);

  // Districts and Villages for current origin and destination
  const [originDistricts, setOriginDistricts] = useState<District[]>([]);
  const [originVillages, setOriginVillages] = useState<Village[]>([]);
  const [loadingVillages, setLoadingVillages] = useState<boolean>(false);
  const [destinationDistricts, setDestinationDistricts] = useState<District[]>([]);

  // UI state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [statusNotice, setStatusNotice] = useState<{ type: 'info' | 'success'; text: string } | null>(
    null
  );

  // Helpers for safe District normalization & code extraction
  const getDistrictCode = (d: any): string => {
    if (!d) return '';
    if (typeof d === 'string') return d.trim();
    return String(d.code || d.district_code || d.id || '').trim();
  };

  const getDistrictName = (d: any): string => {
    if (!d) return '';
    if (typeof d === 'string') return d.trim();
    return String(d.name || d.district_name || d.nama || d.code || '').trim();
  };

  const normalizeDistrictList = (list: any[]): District[] => {
    if (!Array.isArray(list)) return [];
    return list
      .map((item) => {
        const code = getDistrictCode(item);
        const name = getDistrictName(item);
        return {
          code,
          name,
          regency_code: String(item.regency_code || item.kode_kabupaten || ''),
          regency_name: String(item.regency_name || item.nama_kabupaten || ''),
        };
      })
      .filter(
        (d) =>
          Boolean(d.code && d.name) &&
          d.code !== 'undefined' &&
          d.code !== 'null'
      );
  };

  // Helper to load villages for a Sudin and District
  const loadVillages = async (
    sId: number,
    dCode: string,
    targetVillageCode?: string,
    targetVillageName?: string
  ) => {
    if (!sId || !dCode) {
      setOriginVillages([]);
      setVillageCode('');
      setVillageName('');
      return;
    }
    setLoadingVillages(true);
    try {
      const res = await api.getVillagesByDistrict(sId, dCode);
      if (res.status !== 200 || !Array.isArray(res.data)) {
        throw new Error(res.message || 'Gagal memuat daftar kelurahan dari server.');
      }
      const rawList = res.data;
      const list: Village[] = rawList
        .map((v: any) => ({
          code: String(v.code || v.village_code || v.id || '').trim(),
          name: String(v.name || v.village_name || v.nama || '').trim(),
          district_code: dCode,
        }))
        .filter((v: Village) => Boolean(v.code && v.name));
      setOriginVillages(list);
      if (list.length > 0) {
        const matched = targetVillageCode
          ? list.find((v) => v.code === targetVillageCode)
          : targetVillageName
          ? list.find((v) => v.name.toLowerCase() === targetVillageName.toLowerCase())
          : null;
        const selected =
          matched || (!targetVillageCode && !targetVillageName ? list[0] : undefined);
        setVillageCode(selected?.code || '');
        setVillageName(selected?.name || '');
      } else {
        setVillageCode('');
        setVillageName('');
      }
    } catch (err) {
      setOriginVillages([]);
      setVillageCode('');
      setVillageName('');
      setErrors((previous) => ({
        ...previous,
        general: [
          err instanceof Error ? err.message : 'Gagal memuat daftar kelurahan dari server.',
        ],
      }));
    } finally {
      setLoadingVillages(false);
    }
  };

  const fetchProfileFromApi = useCallback(async () => {
    setLoading(true);
    setErrors({});
    setStatusNotice(null);

    try {
      // 1. Fetch Sudins from API
      const sudinsRes = await api.getSudinsAsync();
      if (sudinsRes.status !== 200 || !Array.isArray(sudinsRes.data)) {
        throw new Error(sudinsRes.message || 'Gagal memuat daftar Sudin dari server.');
      }
      const loadedSudins = sudinsRes.data;
      setSudins(loadedSudins);

      // 2. Fetch Subjects from API
      const subjectsRes = await api.getSubjectsAsync();
      if (subjectsRes.status === 200 && Array.isArray(subjectsRes.data)) {
        setSubjects(subjectsRes.data);
        if (subjectsRes.data.length === 0) {
          setErrors({
            subjects: ['API Laravel tidak menyediakan data mata pelajaran untuk akun ini.'],
          });
        }
      } else {
        setSubjects([]);
        setErrors({
          subjects: [
            subjectsRes.message ||
              'Daftar mata pelajaran tidak tersedia untuk akun ini melalui API Laravel.',
          ],
        });
      }

      // 3. Fetch User's Profile from API (GET /api/profile)
      const profileRes = await api.getProfileAsync();
      if (profileRes.status !== 200) {
        throw new Error(profileRes.message || 'Gagal memuat profil dari server.');
      }
      const currentUser = api.getActiveUser();

      if (profileRes.data) {
        const p: any = profileRes.data;
        setExistingProfile(p);
        setStatusNotice({
          type: 'success',
          text: `Data profil berhasil dimuat dari server (${p.school_name || 'Terdaftar'}).`,
        });

        setName(p.name || currentUser?.name || '');
        setPhone(p.phone || '');
        setEmploymentType(p.employment_type || 'PNS');
        setSchoolName(p.school_name || '');
        setSchoolAddress(p.school_address || '');

        const curSudinId = Number(p.sudin_id) || (loadedSudins[0]?.id ?? 0);
        setSudinId(curSudinId);
        const curDistrictCode = getDistrictCode(p.district_code || p.district);
        const curVillageCode = p.village_code || '';
        const curVillageName = p.village_name || '';

        const profilePosition = p.position || 'guru_kelas';
        setPosition(profilePosition);
        setLevel(profilePosition === 'guru_kelas' ? 'SD' : p.level || 'SD');
        setSubjectId(p.subject_id ? Number(p.subject_id) : '');

        const curDestSudinId =
          Number(p.destination_sudin_id) ||
          (loadedSudins[1]?.id ?? loadedSudins[0]?.id ?? 0);
        setDestinationSudinId(curDestSudinId);

        // Normalize destination districts (strictly clean codes)
        let parsedDistrictCodes: string[] = [];
        const rawDistList =
          p.destination_district_codes ||
          p.destinationDistricts ||
          p.destination_districts ||
          [];

        if (Array.isArray(rawDistList)) {
          parsedDistrictCodes = rawDistList
            .map((item: any) => getDistrictCode(item))
            .filter((c: string) => c.length > 0 && c !== 'undefined' && c !== 'null');
        }
        setDestinationDistrictCodes(parsedDistrictCodes);

        // Load districts for origin & destination
        const originDistRes = await api.getDistrictsBySudin(curSudinId);
        if (originDistRes.status !== 200 || !Array.isArray(originDistRes.data)) {
          throw new Error(originDistRes.message || 'Gagal memuat kecamatan asal dari server.');
        }
        const originDists = normalizeDistrictList(originDistRes.data);
        setOriginDistricts(originDists);

        const destDistRes = await api.getDistrictsBySudin(curDestSudinId);
        if (destDistRes.status !== 200 || !Array.isArray(destDistRes.data)) {
          throw new Error(destDistRes.message || 'Gagal memuat kecamatan tujuan dari server.');
        }
        setDestinationDistricts(normalizeDistrictList(destDistRes.data));

        const effectiveDistrictCode = curDistrictCode || originDists[0]?.code || '';
        setDistrictCode(effectiveDistrictCode);

        // Load villages for origin district
        if (effectiveDistrictCode) {
          await loadVillages(curSudinId, effectiveDistrictCode, curVillageCode, curVillageName);
        }
      } else {
        // Profile is null (not yet created on server)
        setExistingProfile(null);
        setStatusNotice({
          type: 'info',
          text: 'Anda belum memiliki profil mutasi di server. Silakan lengkapi form di bawah untuk membuat profil baru.',
        });

        // Pre-fill user's name if logged in
        if (currentUser?.name) {
          setName(currentUser.name);
        }

        const initialSudinId = loadedSudins[0]?.id ?? 0;
        const initialDestSudinId = loadedSudins[1]?.id ?? loadedSudins[0]?.id ?? 0;
        setSudinId(initialSudinId);
        setDestinationSudinId(initialDestSudinId);

        const originDistRes = await api.getDistrictsBySudin(initialSudinId);
        if (originDistRes.status !== 200 || !Array.isArray(originDistRes.data)) {
          throw new Error(originDistRes.message || 'Gagal memuat kecamatan asal dari server.');
        }
        const originDists = normalizeDistrictList(originDistRes.data);
        setOriginDistricts(originDists);

        const destDistRes = await api.getDistrictsBySudin(initialDestSudinId);
        if (destDistRes.status !== 200 || !Array.isArray(destDistRes.data)) {
          throw new Error(destDistRes.message || 'Gagal memuat kecamatan tujuan dari server.');
        }
        setDestinationDistricts(normalizeDistrictList(destDistRes.data));

        if (originDists.length > 0) {
          const firstDistrict = originDists[0];
          setDistrictCode(firstDistrict.code);
          await loadVillages(initialSudinId, firstDistrict.code);
        }
      }
    } catch (err) {
      setErrors({
        general: [
          err instanceof Error ? err.message : 'Gagal memuat profil dan data form dari server.',
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileFromApi();
  }, [fetchProfileFromApi]);

  const handleSudinChange = async (newSudinId: number) => {
    setSudinId(newSudinId);
    const res = await api.getDistrictsBySudin(newSudinId);
    if (res.status !== 200 || !Array.isArray(res.data)) {
      setErrors({ general: [res.message || 'Gagal memuat kecamatan asal dari server.'] });
      return;
    }
    const dists = normalizeDistrictList(res.data);
    if (dists.length > 0) {
      setOriginDistricts(dists);
      const firstDistrict = dists[0];
      setDistrictCode(firstDistrict.code);
      await loadVillages(newSudinId, firstDistrict.code);
    } else {
      setOriginDistricts([]);
      setDistrictCode('');
      setOriginVillages([]);
      setVillageCode('');
      setVillageName('');
    }
  };

  const handleDistrictChange = async (newDistrictCode: string) => {
    const cleanCode = getDistrictCode(newDistrictCode);
    setDistrictCode(cleanCode);
    await loadVillages(sudinId, cleanCode);
  };

  const handleVillageChange = (newVillageCode: string) => {
    setVillageCode(newVillageCode);
    const found = originVillages.find((v) => v.code === newVillageCode);
    if (found) {
      setVillageName(found.name);
    }
  };

  const handlePositionChange = (newPosition: Position) => {
    setPosition(newPosition);
    if (newPosition === 'guru_kelas') {
      setLevel('SD');
      setSubjectId('');
    }
  };

  const handleDestinationSudinChange = async (newSudinId: number) => {
    setDestinationSudinId(newSudinId);
    setDestinationDistrictCodes([]); // reset destination districts filter
    const res = await api.getDistrictsBySudin(newSudinId);
    if (res.status === 200 && Array.isArray(res.data)) {
      setDestinationDistricts(normalizeDistrictList(res.data));
    } else {
      setDestinationDistricts([]);
      setErrors({ general: [res.message || 'Gagal memuat kecamatan tujuan dari server.'] });
    }
  };

  const toggleDestinationDistrict = (rawCode: string) => {
    const code = String(rawCode || '').trim();
    if (!code || code === 'undefined' || code === 'null') return;

    setDestinationDistrictCodes((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    setSuccessMsg('');

    const originDistrict = originDistricts.find((d) => d.code === districtCode);
    const selectedVillage = originVillages.find((v) => v.code === villageCode);
    const validationErrors: Record<string, string[]> = {};

    if (!sudins.some((sudin) => sudin.id === Number(sudinId))) {
      validationErrors.sudin_id = ['Pilih Sudin asal dari daftar server.'];
    }
    if (
      !sudins.some((sudin) => sudin.id === Number(destinationSudinId)) ||
      Number(destinationSudinId) === Number(sudinId)
    ) {
      validationErrors.destination_sudin_id = ['Pilih Sudin tujuan yang berbeda dari Sudin asal.'];
    }
    if (!originDistrict) {
      validationErrors.district_code = ['Pilih kecamatan asal dari daftar server.'];
    } else if (!originDistrict.regency_code || !originDistrict.regency_name) {
      validationErrors.district_code = [
        'Data kabupaten/kota untuk kecamatan asal tidak lengkap dari server.',
      ];
    }
    if (!selectedVillage) {
      validationErrors.village_code = ['Pilih kelurahan asal dari daftar server.'];
    }
    if (position === 'guru_kelas' && level !== 'SD') {
      validationErrors.level = ['Untuk Guru Kelas, jenjang yang dapat dipilih hanya SD.'];
    }
    if (position === 'guru_mapel' && subjectId === '') {
      validationErrors.subject_id = ['Pilih mata pelajaran asal.'];
    }
    if (
      position === 'guru_mapel' &&
      subjects.length === 0
    ) {
      validationErrors.subjects =
        errors.subjects || ['Daftar mata pelajaran tidak tersedia dari server.'];
    }
    if (
      position === 'guru_mapel' &&
      subjectId !== '' &&
      !subjects.some((subject) => subject.id === Number(subjectId))
    ) {
      validationErrors.subject_id = ['Pilih mata pelajaran dari daftar server.'];
    }

    if (Object.keys(validationErrors).length > 0) {
      setSaving(false);
      setErrors(validationErrors);
      return;
    }
    if (!originDistrict || !selectedVillage) {
      setSaving(false);
      return;
    }

    const payload: ProfileInput = {
      name,
      phone,
      employment_type: employmentType,
      school_name: schoolName,
      school_address: schoolAddress,
      sudin_id: Number(sudinId),
      position,
      level,
      ...(position === 'guru_mapel' && subjectId !== '' ? { subject_id: Number(subjectId) } : {}),
      destination_sudin_id: Number(destinationSudinId),
      ...(destinationDistrictCodes.length > 0
        ? { destination_district_codes: destinationDistrictCodes }
        : {}),
      province_code: '31',
      regency_code: originDistrict.regency_code,
      regency_name: originDistrict.regency_name,
      district_code: originDistrict.code,
      district_name: originDistrict.name,
      village_code: selectedVillage.code,
      village_name: selectedVillage.name,
    };

    const res = await api.saveProfile(payload);
    setSaving(false);

    if (res.status === 200 || res.status === 201) {
      setSuccessMsg(res.message || 'Profil berhasil disimpan!');
      setExistingProfile(res.data || null);
      setTimeout(() => {
        onSaved();
      }, 1200);
    } else if (res.errors) {
      setErrors(res.errors);
    } else {
      setErrors({ general: [res.message || 'Gagal menyimpan profil ke server API.'] });
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <main className="dashboard-main max-w-4xl py-20 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Menghubungkan ke Server...</h2>
        </main>
      </div>
    );
  }

  const selectedOriginSudin = sudins.find((s) => s.id === sudinId);
  const selectedDestSudin = sudins.find((s) => s.id === destinationSudinId);

  return (
    <div className="page-shell">
      <main className="dashboard-main max-w-4xl">
        {/* Intro */}
        <section className="admin-intro flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />

            </div>
            <h1>{existingProfile ? 'Ubah Profil Mutasi' : 'Lengkapi Profil Mutasi'}</h1>
            <p>
              Data profil disimpan langsung ke server backend untuk diproses oleh algoritma
              pencocokan dua arah Cari Tukeran Guru DKI Jakarta.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfileFromApi}
            className="button button-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            title="Muat ulang data profil terbaru dari server"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkronkan API</span>
          </button>
        </section>

        {/* Status Notice Banner from API */}
        {statusNotice && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-xs animate-in fade-in ${
              statusNotice.type === 'success'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}
          >
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-sky-600 shrink-0" />
            )}
            <span>{statusNotice.text}</span>
          </div>
        )}

        {/* Success alert */}
        {successMsg && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* General error alert */}
        {errors.general && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errors.general[0]}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Identitas Guru & Kepegawaian */}
          <div className="panel p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">
                1. Identitas Guru & Kepegawaian
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="field">
                <label htmlFor="p-name">Nama Lengkap (beserta gelar)</label>
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`app-input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  required
                />
                {errors.name && <p className="field-error">{errors.name[0]}</p>}
              </div>

              <div className="field">
                <label htmlFor="p-phone">Nomor Telepon / WhatsApp</label>
                <input
                  id="p-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`app-input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Contoh: 081234567890"
                  required
                />
                <p className="field-help">Disimpan dalam format +62 untuk koordinasi calon rekan tukaran.</p>
                {errors.phone && <p className="field-error">{errors.phone[0]}</p>}
              </div>

              <div className="field">
                <label htmlFor="p-emp">Status Kepegawaian</label>
                <select
                  id="p-emp"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as 'PNS')}
                  className="app-input"
                >
                  <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                </select>
                {errors.employment_type && (
                  <p className="field-error">{errors.employment_type[0]}</p>
                )}
              </div>

              <div className="field">
                <label htmlFor="p-school">Nama Sekolah Asal</label>
                <input
                  id="p-school"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className={`app-input ${errors.school_name ? 'border-red-500' : ''}`}
                  placeholder="Contoh: SDN Cipayung 01 Pagi"
                  required
                />
                {errors.school_name && <p className="field-error">{errors.school_name[0]}</p>}
              </div>

              <div className="field md:col-span-2">
                <label htmlFor="p-address">Alamat Lengkap Sekolah Asal</label>
                <textarea
                  id="p-address"
                  rows={2}
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  className={`app-input ${errors.school_address ? 'border-red-500' : ''}`}
                  placeholder="Alamat jalan, kelurahan, kecamatan, dan kota sekolah asal"
                  required
                />
                {errors.school_address && (
                  <p className="field-error">{errors.school_address[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Jabatan, Jenjang & Wilayah Asal */}
          <div className="panel p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">
                2. Jabatan, Jenjang & Wilayah Asal
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="field">
                <label htmlFor="p-pos">Jabatan Asal</label>
                <select
                  id="p-pos"
                  value={position}
                  onChange={(e) => handlePositionChange(e.target.value as Position)}
                  className="app-input"
                >
                  <option value="guru_kelas">Guru Kelas</option>
                  <option value="guru_mapel">Guru Mata Pelajaran (Mapel)</option>
                </select>
                {errors.position && <p className="field-error">{errors.position[0]}</p>}
              </div>

              <div className="field">
                <label htmlFor="p-level">Jenjang Asal</label>
                {position === 'guru_kelas' ? (
                  <div id="p-level" className="app-input flex items-center bg-slate-100 text-slate-600">
                    SD (Sekolah Dasar)
                  </div>
                ) : (
                  <select
                    id="p-level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    className="app-input"
                  >
                    <option value="SD">SD (Sekolah Dasar)</option>
                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                    <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                    <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                  </select>
                )}
                {errors.level && <p className="field-error">{errors.level[0]}</p>}
              </div>

              {position === 'guru_mapel' && (
                <div className="field md:col-span-2">
                  <label htmlFor="p-subj">Mata Pelajaran yang Diampu</label>
                  <select
                    id="p-subj"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : '')}
                    className={`app-input ${errors.subject_id ? 'border-red-500' : ''}`}
                    required={position === 'guru_mapel'}
                  >
                    <option value="">-- Pilih Mata Pelajaran --</option>
                    {subjects.map((sub) => (
                      <option key={`orig-sub-${sub.id}`} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject_id && <p className="field-error">{errors.subject_id[0]}</p>}
                  {errors.subjects && <p className="field-error">{errors.subjects[0]}</p>}
                </div>
              )}

              <div className="field">
                <label htmlFor="p-sudin">Sudin Pendidikan Asal</label>
                <select
                  id="p-sudin"
                  value={sudinId}
                  onChange={(e) => handleSudinChange(Number(e.target.value))}
                  className="app-input"
                >
                  {sudins.map((s) => (
                    <option key={`p-sudin-${s.id}`} value={s.id}>
                      {s.name} {s.abbreviation ? `(${s.abbreviation})` : ''}
                    </option>
                  ))}
                </select>
                {errors.sudin_id && <p className="field-error">{errors.sudin_id[0]}</p>}
              </div>

              <div className="field">
                <label htmlFor="p-dist">Kecamatan Asal</label>
                <select
                  id="p-dist"
                  value={districtCode}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="app-input"
                >
                  {originDistricts.map((d) => (
                    <option key={`orig-dist-${d.code}`} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.district_code && (
                  <p className="field-error">{errors.district_code[0]}</p>
                )}
              </div>

              <div className="field md:col-span-2">
                <label htmlFor="p-vill" className="flex items-center justify-between">
                  <span>Kelurahan Asal</span>
                  {loadingVillages && (
                    <span className="text-[11px] font-normal text-blue-600 flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat daftar kelurahan...
                    </span>
                  )}
                </label>
                <select
                  id="p-vill"
                  value={villageCode}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  disabled={loadingVillages || originVillages.length === 0}
                  className="app-input disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {originVillages.length === 0 ? (
                    <option value="">-- Tidak ada data kelurahan --</option>
                  ) : (
                    originVillages.map((v) => (
                      <option key={`orig-vill-${v.code}`} value={v.code}>
                        {v.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.village_code && (
                  <p className="field-error">{errors.village_code[0]}</p>
                )}
                {errors.village_name && (
                  <p className="field-error">{errors.village_name[0]}</p>
                )}
                <p className="field-help">
                  Daftar kelurahan dimuat secara dinamis berdasarkan Sudin dan Kecamatan asal yang dipilih.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Preferensi Penempatan Tujuan Mutasi */}
          <div className="panel p-6 shadow-xs border-blue-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">
                3. Preferensi Tujuan Mutasi (Penempatan Baru)
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="field">
                  <label htmlFor="p-dest-sudin">Sudin Pendidikan Tujuan</label>
                  <select
                    id="p-dest-sudin"
                    value={destinationSudinId}
                    onChange={(e) => handleDestinationSudinChange(Number(e.target.value))}
                    className="app-input"
                  >
                    {sudins
                      .filter((s) => s.id !== sudinId)
                      .map((s) => (
                        <option key={`dest-s-${s.id}`} value={s.id}>
                          {s.name} {s.abbreviation ? `(${s.abbreviation})` : ''}
                        </option>
                      ))}
                  </select>
                  <p className="field-help">Sudin yang Anda tuju untuk penempatan baru.</p>
                  {errors.destination_sudin_id && (
                    <p className="field-error">{errors.destination_sudin_id[0]}</p>
                  )}
                </div>

              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-950">
                <p className="font-semibold">Jabatan, jenjang, dan mapel tujuan mengikuti data asal</p>
                <p className="mt-1 text-sky-800">
                  {position === 'guru_kelas' ? 'Guru Kelas · SD' : 'Guru Mapel'} · {level}
                  {position === 'guru_mapel' && subjectId !== ''
                    ? ` · ${subjects.find((subject) => subject.id === Number(subjectId))?.name || 'Mapel terpilih'}`
                    : ''}
                </p>
              </div>

              {/* Destination Districts Multi-Select Section */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Pilihan Kecamatan Tujuan di {selectedDestSudin?.name || 'Sudin Tujuan'}:
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pilih <strong>satu</strong>, <strong>beberapa</strong>, atau biarkan kosong bila bersedia ditempatkan di semua kecamatan.
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {destinationDistrictCodes.length === 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        Semua Kecamatan ({destinationDistricts.length})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        Terpilih: {destinationDistrictCodes.length} dari {destinationDistricts.length} Kecamatan
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Selection Actions */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setDestinationDistrictCodes([])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition ${
                      destinationDistrictCodes.length === 0
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Terima Semua Kecamatan
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDestinationDistrictCodes(
                        destinationDistricts.map((d) => getDistrictCode(d)).filter(Boolean)
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 font-medium transition"
                  >
                    Pilih Semua ({destinationDistricts.length})
                  </button>

                  {destinationDistrictCodes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDestinationDistrictCodes([])}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-medium ml-auto"
                    >
                      Reset / Batalkan Pilihan
                    </button>
                  )}
                </div>

                {/* Grid of Selectable Districts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {destinationDistricts.map((d) => {
                    const code = getDistrictCode(d);
                    if (!code) return null;
                    const isSelected = Boolean(code && destinationDistrictCodes.includes(code));
                    return (
                      <button
                        key={`dest-dist-${code}`}
                        type="button"
                        onClick={() => toggleDestinationDistrict(code)}
                        className={`text-left p-3 rounded-xl text-xs transition border flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-950 border-blue-500 shadow-xs ring-1 ring-blue-500/30'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Checkbox Icon */}
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div className="truncate">
                            <p className={`font-semibold text-xs truncate ${isSelected ? 'text-blue-950 font-bold' : 'text-slate-800'}`}>
                              {d.name}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                            Aktif
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {errors.destination_district_codes && (
                  <p className="field-error mt-2">{errors.destination_district_codes[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="button button-primary px-6 py-2.5 flex items-center gap-2 shadow-md bg-blue-700 hover:bg-blue-800 border-blue-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke API...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Profil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <footer className="footer">
        <span>Cari Tukeran Guru · Form Profil Mutasi</span>
      </footer>
    </div>
  );
};
