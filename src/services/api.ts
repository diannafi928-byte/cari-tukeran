/**
 * API Service for Cari Tukeran Guru DKI Jakarta
 * Conforming strictly to API_24e1f6c8.md specifications.
 * Supports:
 * 1. REAL LIVE HTTP Fetch to user's Laravel backend (e.g. http://localhost:8000 or custom URL)
 * 2. MOCK FALLBACK Engine for offline/instant preview without server setup.
 */

import {
  AuthSession,
  District,
  Level,
  ProfileInput,
  Subject,
  Sudin,
  TeacherProfile,
  TeacherDirectoryEntry,
  Position,
  TwoWayMatch,
  User,
  DeletionRequest,
  MatchNotificationPair,
  Village,
} from '../types';
import {
  INITIAL_DELETION_REQUESTS,
  INITIAL_MATCH_PAIRS,
  INITIAL_PROFILES,
  INITIAL_SUBJECTS,
  INITIAL_SUDINS,
  INITIAL_USERS,
  findVillagesByDistrict,
} from '../data/mockData';

const STORAGE_KEY_USERS = 'rtg_users_v1';
const STORAGE_KEY_PROFILES = 'rtg_profiles_v1';
const STORAGE_KEY_SUDINS = 'rtg_sudins_v1';
const STORAGE_KEY_SUBJECTS = 'rtg_subjects_v1';
const STORAGE_KEY_SESSION = 'rtg_auth_session_v1';
const STORAGE_KEY_DELETION_REQUESTS = 'rtg_deletion_reqs_v1';
const STORAGE_KEY_MATCH_PAIRS = 'rtg_match_pairs_v1';

const STORAGE_KEY_API_MODE = 'rtg_api_mode_v1'; // 'live' | 'mock'
const STORAGE_KEY_API_URL = 'rtg_api_base_url_v1';

export type ApiMode = 'live' | 'mock';

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  isLive?: boolean;
}

class ApiService {
  private users: User[] = [];
  private profiles: TeacherProfile[] = [];
  private sudins: Sudin[] = [];
  private subjects: Subject[] = [];
  private deletionRequests: DeletionRequest[] = [];
  private matchPairs: MatchNotificationPair[] = [];
  private currentSession: AuthSession | null = null;
  private subscribers: Array<() => void> = [];

  // Live API Connection state
  private apiMode: ApiMode = 'mock';
  private apiBaseUrl: string = '';

  constructor() {
    this.initSettings();
    this.initData();
  }

  public subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => cb());
  }

  private initSettings() {
    const savedMode = localStorage.getItem(STORAGE_KEY_API_MODE) as ApiMode | null;
    const savedUrl = localStorage.getItem(STORAGE_KEY_API_URL);

    // Default to https://mutasi.online as specified by user
    this.apiBaseUrl = savedUrl || 'https://mutasi.online';
    this.apiMode = savedMode || 'live';
  }

  public getApiConfig(): { mode: ApiMode; baseUrl: string } {
    return {
      mode: this.apiMode,
      baseUrl: this.apiBaseUrl,
    };
  }

  public setApiConfig(mode: ApiMode, baseUrl: string) {
    this.apiMode = mode;
    this.apiBaseUrl = baseUrl.replace(/\/+$/, ''); // trim trailing slash
    localStorage.setItem(STORAGE_KEY_API_MODE, this.apiMode);
    localStorage.setItem(STORAGE_KEY_API_URL, this.apiBaseUrl);
    this.notify();
  }

  // Real HTTP Fetch Helper
  private async realFetch<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      isFormData?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const token = this.currentSession?.token;

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!options.isFormData && options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.isFormData
          ? options.body
          : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
      });

      let json: any = {};
      try {
        json = await response.json();
      } catch {
        json = {};
      }

      return {
        status: response.status,
        data: json.data !== undefined ? json.data : json,
        message: json.message,
        errors: json.errors,
        isLive: true,
      };
    } catch (error: any) {
      return {
        status: 0,
        message: `Koneksi ke API Server gagal (${this.apiBaseUrl}). Pastikan server backend Laravel berjalan dan CORS diizinkan. Error: ${error.message}`,
        errors: { network: [error.message || 'Network request failed'] },
        isLive: true,
      };
    }
  }

  public async testLiveConnection(customUrl?: string): Promise<{ success: boolean; message: string; status?: number }> {
    const urlToTest = (customUrl || this.apiBaseUrl).replace(/\/+$/, '');
    if (!urlToTest) {
      return { success: false, message: 'URL API belum ditentukan.' };
    }

    try {
      const res = await fetch(`${urlToTest}/api/sudins`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return { success: true, message: `Terhubung sukses ke server (HTTP ${res.status} OK)`, status: res.status };
      } else if (res.status === 401) {
        return { success: true, message: `Terhubung sukses ke server server! (API siap dengan proteksi Sanctum Bearer)`, status: res.status };
      } else {
        return { success: false, message: `Server merespons dengan status HTTP ${res.status}`, status: res.status };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Tidak dapat menjangkau server di ${urlToTest}. Periksa apakah server aktif dan CORS mengizinkan origin ini. Error: ${err.message}`,
      };
    }
  }

  private initData() {
    // Users
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    this.users = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;

    // Sudins
    const savedSudins = localStorage.getItem(STORAGE_KEY_SUDINS);
    this.sudins = savedSudins ? JSON.parse(savedSudins) : INITIAL_SUDINS;

    // Subjects
    const savedSubjects = localStorage.getItem(STORAGE_KEY_SUBJECTS);
    this.subjects = savedSubjects ? JSON.parse(savedSubjects) : INITIAL_SUBJECTS;

    // Profiles
    const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    this.profiles = savedProfiles ? JSON.parse(savedProfiles) : INITIAL_PROFILES;

    // Deletion requests
    const savedDel = localStorage.getItem(STORAGE_KEY_DELETION_REQUESTS);
    this.deletionRequests = savedDel ? JSON.parse(savedDel) : INITIAL_DELETION_REQUESTS;

    // Match pairs
    const savedPairs = localStorage.getItem(STORAGE_KEY_MATCH_PAIRS);
    this.matchPairs = savedPairs ? JSON.parse(savedPairs) : INITIAL_MATCH_PAIRS;

    // Session
    const savedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.token && !parsed.token.includes('simulated_token') && !parsed.token.includes('switch_')) {
          this.currentSession = parsed;
        } else {
          this.currentSession = null;
          localStorage.removeItem(STORAGE_KEY_SESSION);
        }
      } catch {
        this.currentSession = null;
      }
    } else {
      this.currentSession = null;
    }

    this.hydrateProfilesRelations();
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(this.profiles));
    localStorage.setItem(STORAGE_KEY_SUDINS, JSON.stringify(this.sudins));
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(this.subjects));
    localStorage.setItem(STORAGE_KEY_DELETION_REQUESTS, JSON.stringify(this.deletionRequests));
    localStorage.setItem(STORAGE_KEY_MATCH_PAIRS, JSON.stringify(this.matchPairs));
    this.notify();
  }

  private saveSession() {
    if (this.currentSession) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(this.currentSession));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
    this.notify();
  }

  private hydrateProfilesRelations() {
    this.profiles.forEach((p) => {
      p.sudin = this.sudins.find((s) => s.id === p.sudin_id);
      p.destinationSudin = this.sudins.find((s) => s.id === p.destination_sudin_id);
      p.subject = p.subject_id ? this.subjects.find((s) => s.id === p.subject_id) || null : null;
      if (p.destination_subject_ids) {
        p.destinationSubjects = this.subjects.filter((s) =>
          p.destination_subject_ids?.includes(s.id)
        );
      }
      if (p.destination_district_codes && p.destinationSudin) {
        p.destinationDistricts = p.destinationSudin.districts.filter((d) =>
          p.destination_district_codes?.includes(d.code)
        );
      }
      p.destinationLevels = p.destination_levels?.map((l) => ({ level: l })) || [];
    });
  }

  private normalizeTeacherProfile(profile: TeacherProfile): TeacherProfile {
    const rawProfile = profile as TeacherProfile & {
      destination_sudin?: Sudin;
      destination_subjects?: Subject[];
      destination_districts?: District[];
    };
    const levels = (Array.isArray(profile.destination_levels)
      ? (profile.destination_levels as unknown[])
      : [])
      .map((item) => {
        const value =
          typeof item === 'string'
            ? item
            : item && typeof item === 'object' && 'level' in item
            ? item.level
            : null;
        return ['SD', 'SMP', 'SMA', 'SMK'].includes(String(value)) ? (value as Level) : null;
      })
      .filter((level): level is Level => level !== null);
    const destinationLevels =
      profile.destinationLevels?.length
        ? profile.destinationLevels
        : levels.map((level) => ({ level }));

    return {
      ...profile,
      destinationSudin: profile.destinationSudin ?? rawProfile.destination_sudin,
      destinationLevels,
      destinationSubjects: profile.destinationSubjects ?? rawProfile.destination_subjects,
      destinationDistricts: profile.destinationDistricts ?? rawProfile.destination_districts,
    };
  }

  // ---------------- AUTH METHODS ----------------

  public getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  public getActiveUser(): User | null {
    return this.currentSession?.user || null;
  }

  public async login(
    email: string,
    pass: string,
    device_name: string = 'Web Browser'
  ): Promise<ApiResponse<AuthSession>> {
    // If LIVE mode, send actual POST /api/login to user's Laravel API
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<any>('/api/login', {
        method: 'POST',
        body: { email, password: pass, device_name },
      });

      if (res.status === 200 && res.data) {
        const tokenData = res.data;
        const session: AuthSession = {
          token: tokenData.token,
          token_type: 'Bearer',
          abilities: tokenData.abilities || ['guru'],
          expires_at: tokenData.expires_at || new Date(Date.now() + 30 * 86400000).toISOString(),
          user: tokenData.user || {
            id: 999,
            name: email.split('@')[0],
            email,
            role: tokenData.abilities?.includes('admin') ? 'admin' : 'guru',
            email_verified_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        };
        this.currentSession = session;
        this.saveSession();
        return { status: 200, data: session, message: res.message || 'Login berhasil ke server API Anda.' };
      }
      return res;
    }

    // MOCK MODE
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return {
        status: 422,
        message: 'Kredensial yang diberikan tidak cocok dengan data kami.',
        errors: { email: ['Email atau kata sandi salah.'] },
      };
    }

    const session: AuthSession = {
      token: `${Date.now()}|token_${user.role}_${user.id}_${Math.random().toString(36).substring(2, 9)}`,
      token_type: 'Bearer',
      abilities: [user.role],
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      user: { ...user },
    };

    this.currentSession = session;
    this.saveSession();

    return {
      status: 200,
      data: session,
      message: 'Login berhasil.',
    };
  }

  public async register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse<{ user: User; session: AuthSession }>> {
    // If LIVE mode
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<any>('/api/register', {
        method: 'POST',
        body: payload,
      });

      if (res.status === 201 || res.status === 200) {
        // Auto login after register
        return await this.login(payload.email, payload.password) as any;
      }
      return res;
    }

    // MOCK MODE
    const errors: Record<string, string[]> = {};
    if (!payload.name || payload.name.trim().length < 2) {
      errors.name = ['Nama lengkap minimal 2 karakter.'];
    }
    if (!payload.email || !payload.email.includes('@')) {
      errors.email = ['Alamat email tidak valid.'];
    }
    if (this.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      errors.email = ['Alamat email sudah terdaftar.'];
    }
    if (!payload.password || payload.password.length < 6) {
      errors.password = ['Kata sandi minimal 6 karakter.'];
    }
    if (payload.password !== payload.password_confirmation) {
      errors.password_confirmation = ['Konfirmasi kata sandi tidak cocok.'];
    }

    if (Object.keys(errors).length > 0) {
      return {
        status: 422,
        message: 'Validasi form gagal.',
        errors,
      };
    }

    const newUser: User = {
      id: Math.max(0, ...this.users.map((u) => u.id)) + 1,
      name: payload.name.trim(),
      email: payload.email.trim(),
      role: 'guru',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.users.push(newUser);

    const session: AuthSession = {
      token: `${Date.now()}|token_guru_${newUser.id}_${Math.random().toString(36).substring(2, 9)}`,
      token_type: 'Bearer',
      abilities: ['guru'],
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      user: newUser,
    };

    this.currentSession = session;
    this.persist();
    this.saveSession();

    return {
      status: 201,
      data: { user: newUser, session },
      message: 'Akun berhasil dibuat.',
    };
  }

  public async logout(): Promise<ApiResponse<null>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      await this.realFetch('/api/logout', { method: 'DELETE' });
    }
    this.currentSession = null;
    this.saveSession();
    return {
      status: 200,
      data: null,
      message: 'Token berhasil dicabut dan logout sukses.',
    };
  }

  public switchUser(userId: number) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;
    this.currentSession = {
      token: `${Date.now()}|switch_${user.role}_${user.id}`,
      token_type: 'Bearer',
      abilities: [user.role],
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      user: { ...user },
    };
    this.saveSession();
  }

  // ---------------- GURU ENDPOINTS ----------------

  public async getSudinsAsync(): Promise<ApiResponse<Sudin[]>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<Sudin[]>('/api/sudins');
      if (res.status === 200 && Array.isArray(res.data)) {
        this.sudins = res.data;
        return res;
      }
      return res;
    }
    return { status: 200, data: this.sudins };
  }

  public getSudins(): ApiResponse<Sudin[]> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      // Async trigger to refresh background
      this.getSudinsAsync();
    }
    return {
      status: 200,
      data: this.sudins,
    };
  }

  public async getDistrictsBySudin(sudinId: number): Promise<ApiResponse<District[]>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<any[]>(`/api/sudins/${sudinId}/districts`);
      if (res.status !== 200 || !Array.isArray(res.data)) {
        return res;
      }

      const normalized: District[] = res.data.map((d: any) => ({
        code: String(d.code || d.district_code || d.id || '').trim(),
        name: String(d.name || d.district_name || d.nama || '').trim(),
        regency_code: String(d.regency_code || d.kode_kabupaten || '').trim(),
        regency_name: String(d.regency_name || d.nama_kabupaten || '').trim(),
      }));
      return { ...res, data: normalized };
    }

    const sudin =
      this.sudins.find((s) => s.id === sudinId) ||
      INITIAL_SUDINS.find((s) => s.id === sudinId);
    if (!sudin) {
      return { status: 404, message: 'Sudin tidak ditemukan.', errors: { sudin: ['Sudin tidak ditemukan.'] } };
    }
    return {
      status: 200,
      data: sudin.districts,
    };
  }

  public async getVillagesByDistrict(sudinId: number, districtCode: string): Promise<ApiResponse<Village[]>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<any[]>(
        `/api/sudins/${sudinId}/districts/${encodeURIComponent(districtCode)}/villages`
      );
      if (res.status !== 200 || !Array.isArray(res.data)) {
        return res;
      }

      const normalized: Village[] = res.data.map((v: any) => ({
        code: String(v.code || v.village_code || v.id || '').trim(),
        name: String(v.name || v.village_name || v.nama || '').trim(),
        district_code: districtCode,
      }));
      return { ...res, data: normalized };
    }

    return {
      status: 200,
      data: findVillagesByDistrict(districtCode),
    };
  }

  public async getSubjectsAsync(): Promise<ApiResponse<Subject[]>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const endpoint =
        this.getActiveUser()?.role === 'admin' ? '/api/admin/subjects' : '/api/subjects';
      const res = await this.realFetch<Subject[]>(endpoint);
      if (res.status === 200 && Array.isArray(res.data)) {
        this.subjects = res.data;
        return res;
      }
      return res;
    }
    return { status: 200, data: this.subjects };
  }

  public getSubjects(): ApiResponse<Subject[]> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      this.getSubjectsAsync();
    }
    return {
      status: 200,
      data: this.subjects,
    };
  }

  public async getProfileAsync(): Promise<ApiResponse<TeacherProfile | null>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<TeacherProfile | null>('/api/profile');
      if (res.status === 200 && res.data) {
        return { ...res, data: this.normalizeTeacherProfile(res.data) };
      }
      return res;
    }
    return this.getProfile();
  }

  public getProfile(): ApiResponse<TeacherProfile | null> {
    const user = this.getActiveUser();
    if (!user) {
      return { status: 401, message: 'Unauthenticated.' };
    }

    const profile = this.profiles.find((p) => p.user_id === user.id);
    if (!profile) {
      return { status: 200, data: null };
    }
    return { status: 200, data: profile };
  }

  public async saveProfile(input: ProfileInput): Promise<ApiResponse<TeacherProfile>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const res = await this.realFetch<TeacherProfile>('/api/profile', {
        method: 'POST',
        body: input,
      });
      if ((res.status === 200 || res.status === 201) && res.data) {
        return { ...res, data: this.normalizeTeacherProfile(res.data) };
      }
      return res;
    }

    const user = this.getActiveUser();
    if (!user) {
      return { status: 401, message: 'Unauthenticated.' };
    }

    const errors: Record<string, string[]> = {};
    if (!input.name || input.name.length < 2 || input.name.length > 120) {
      errors.name = ['Nama harus antara 2 hingga 120 karakter.'];
    }

    const phoneRegex = /^[0-9\s+().-]{8,24}$/;
    if (!input.phone || !phoneRegex.test(input.phone)) {
      errors.phone = ['Nomor telepon harus 8-24 karakter (hanya angka, +, (), titik, dan strip).'];
    }

    if (!['PNS', 'PPPK', 'KKI'].includes(input.employment_type)) {
      errors.employment_type = ['Status kepegawaian harus PNS, PPPK, atau KKI.'];
    }

    if (!input.school_name || input.school_name.length > 160) {
      errors.school_name = ['Nama sekolah wajib diisi maksimal 160 karakter.'];
    }

    if (!input.school_address || input.school_address.length > 1000) {
      errors.school_address = ['Alamat sekolah wajib diisi maksimal 1000 karakter.'];
    }

    const originSudin = this.sudins.find((s) => s.id === Number(input.sudin_id));
    if (!originSudin) {
      errors.sudin_id = ['Sudin asal tidak valid.'];
    }

    if (input.position === 'guru_mapel' && !input.subject_id) {
      errors.subject_id = ['Mata pelajaran wajib dipilih untuk jabatan guru_mapel.'];
    }

    if (input.position === 'guru_kelas' && input.level !== 'SD') {
      errors.level = ['Untuk guru_kelas, jenjang yang dapat dipilih hanya SD.'];
    }

    const destSudin = this.sudins.find((s) => s.id === Number(input.destination_sudin_id));
    if (!destSudin) {
      errors.destination_sudin_id = ['Sudin tujuan tidak valid.'];
    }

    if (input.province_code !== '31') {
      errors.province_code = ['Provinsi harus DKI Jakarta (kode 31).'];
    }

    if (originSudin && !originSudin.districts.some((d) => d.code === input.district_code)) {
      errors.district_code = ['Kecamatan asal harus berada dalam Sudin asal yang dipilih.'];
    }

    if (destSudin && input.destination_district_codes && input.destination_district_codes.length > 0) {
      const invalidDistricts = input.destination_district_codes.filter(
        (code) => !destSudin.districts.some((d) => d.code === code)
      );
      if (invalidDistricts.length > 0) {
        errors.destination_district_codes = ['Setiap kecamatan tujuan harus berada dalam Sudin tujuan.'];
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        status: 422,
        message: 'Validasi profil gagal. Periksa isian Anda.',
        errors,
      };
    }

    let formattedPhone = input.phone.trim();
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '+62' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+62' + formattedPhone;
    }

    const existingIndex = this.profiles.findIndex((p) => p.user_id === user.id);
    const isNew = existingIndex === -1;

    const profileData: TeacherProfile = {
      id: isNew ? Math.max(0, ...this.profiles.map((p) => p.id)) + 1 : this.profiles[existingIndex].id,
      user_id: user.id,
      name: input.name.trim(),
      phone: formattedPhone,
      employment_type: input.employment_type,
      school_name: input.school_name.trim(),
      school_address: input.school_address.trim(),
      sudin_id: Number(input.sudin_id),
      position: input.position,
      level: input.level,
      subject_id: input.subject_id ? Number(input.subject_id) : null,
      province_code: '31',
      regency_code: input.regency_code,
      regency_name: input.regency_name,
      district_code: input.district_code,
      district_name: input.district_name,
      village_code: input.village_code,
      village_name: input.village_name,
      destination_sudin_id: Number(input.destination_sudin_id),
      destination_position: input.position,
      destination_levels: [input.level],
      destination_subject_ids:
        input.position === 'guru_mapel' && input.subject_id
          ? [Number(input.subject_id)]
          : [],
      destination_district_codes: input.destination_district_codes || [],
      is_mutated: isNew ? false : this.profiles[existingIndex].is_mutated,
      deletion_request_status: isNew ? null : this.profiles[existingIndex].deletion_request_status,
      deletion_request_id: isNew ? null : this.profiles[existingIndex].deletion_request_id,
      created_at: isNew ? new Date().toISOString() : this.profiles[existingIndex].created_at,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      this.profiles.push(profileData);
    } else {
      this.profiles[existingIndex] = profileData;
    }

    this.hydrateProfilesRelations();
    this.persist();

    return {
      status: isNew ? 201 : 200,
      data: profileData,
      message: isNew ? 'Profil guru berhasil dibuat.' : 'Profil guru berhasil diperbarui.',
    };
  }

  public async getMatchesAsync(candidate_origin_district_code?: string): Promise<ApiResponse<TwoWayMatch[]>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const q = candidate_origin_district_code
        ? `?candidate_origin_district_code=${encodeURIComponent(candidate_origin_district_code)}`
        : '';
      const res = await this.realFetch<TwoWayMatch[]>(`/api/matches${q}`);
      if (res.status === 200 && Array.isArray(res.data)) {
        return {
          ...res,
          data: res.data.map((match) => ({
            ...match,
            partner: this.normalizeTeacherProfile(match.partner),
          })),
        };
      }
      return res;
    }
    return this.getMatches(candidate_origin_district_code);
  }

  public async getTeacherDirectoryAsync(): Promise<
    ApiResponse<{
      teachers: TeacherDirectoryEntry[];
      position: Position | null;
      positionLabel: string | null;
    }>
  > {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const profileRes = await this.getProfileAsync();
      if (profileRes.status !== 200) {
        return { ...profileRes, data: undefined };
      }

      const position = profileRes.data?.position || null;
      const positionLabel =
        position === 'guru_kelas'
          ? 'Guru Kelas'
          : position === 'guru_mapel'
          ? 'Guru Mata Pelajaran'
          : null;

      if (!position) {
        return {
          status: 200,
          data: { teachers: [], position: null, positionLabel: null },
          isLive: true,
        };
      }

      const res = await this.realFetch<TeacherDirectoryEntry[]>('/api/teachers');
      if (res.status !== 200 || !Array.isArray(res.data)) {
        return { ...res, data: undefined };
      }
      return {
        ...res,
        data: { teachers: res.data, position, positionLabel },
      };
    }

    const directory = this.getTeacherDirectory();
    if (directory.status !== 200 || !directory.data) {
      return { ...directory, data: undefined };
    }

    const maskName = (name: string) =>
      name
        .replace(/\S+/gu, (word) =>
          word.length <= 2 ? '*'.repeat(word.length) : `${word[0]}${'*'.repeat(word.length - 2)}${word[word.length - 1]}`
        )
        .toUpperCase();

    return {
      status: 200,
      data: {
        position: directory.data.position as Position | null,
        positionLabel: directory.data.positionLabel,
        teachers: directory.data.teachers.map((teacher) => ({
          id: teacher.id,
          name: maskName(teacher.name),
          employment_type: teacher.employment_type,
          position: teacher.position,
          position_label:
            teacher.position === 'guru_kelas' ? 'Guru Kelas' : 'Guru Mata Pelajaran',
          level: teacher.level,
          subject: teacher.subject?.name || null,
          origin: {
            sudin: teacher.sudin?.name || null,
            district: teacher.district_name,
            regency: teacher.regency_name,
          },
          destination: {
            sudin: teacher.destinationSudin?.name || null,
            position: teacher.destination_position,
            position_label:
              teacher.destination_position === 'guru_kelas'
                ? 'Guru Kelas'
                : 'Guru Mata Pelajaran',
            levels: teacher.destination_levels,
            subjects: teacher.destinationSubjects?.map((subject) => subject.name) || [],
            districts:
              teacher.destinationDistricts?.map(({ code, name }) => ({ code, name })) || [],
          },
        })),
      },
    };
  }

  public getMatches(candidate_origin_district_code?: string): ApiResponse<TwoWayMatch[]> {
    const user = this.getActiveUser();
    if (!user) {
      return { status: 401, message: 'Unauthenticated.' };
    }

    const myProfile = this.profiles.find((p) => p.user_id === user.id);
    if (!myProfile) {
      return {
        status: 400,
        message: 'Lengkapi profil terlebih dahulu sebelum mencari kecocokan.',
        data: [],
      };
    }

    this.hydrateProfilesRelations();

    const matches: TwoWayMatch[] = [];

    for (const candidate of this.profiles) {
      if (candidate.id === myProfile.id || candidate.user_id === user.id) continue;
      if (candidate.is_mutated) continue;

      if (
        candidate_origin_district_code &&
        candidate.district_code !== candidate_origin_district_code
      ) {
        continue;
      }

      const sudinMatch =
        myProfile.destination_sudin_id === candidate.sudin_id &&
        candidate.destination_sudin_id === myProfile.sudin_id;

      if (!sudinMatch) continue;

      const posMatch =
        myProfile.position === candidate.destination_position &&
        candidate.position === myProfile.destination_position;

      if (!posMatch) continue;

      const levelAMatches = candidate.destination_levels.includes(myProfile.level);
      const levelBMatches = myProfile.destination_levels.includes(candidate.level);
      if (!levelAMatches || !levelBMatches) continue;

      if (myProfile.position === 'guru_mapel') {
        if (!myProfile.subject_id) continue;
        if (
          !candidate.destination_subject_ids?.includes(myProfile.subject_id) &&
          candidate.subject_id !== myProfile.subject_id
        ) continue;
      }

      if (candidate.position === 'guru_mapel') {
        if (!candidate.subject_id) continue;
        if (
          !myProfile.destination_subject_ids?.includes(candidate.subject_id) &&
          myProfile.subject_id !== candidate.subject_id
        ) continue;
      }

      let myDistrictSatisfied = true;
      if (
        myProfile.destination_district_codes &&
        myProfile.destination_district_codes.length > 0
      ) {
        myDistrictSatisfied = myProfile.destination_district_codes.includes(
          candidate.district_code
        );
      }

      let candidateDistrictSatisfied = true;
      if (
        candidate.destination_district_codes &&
        candidate.destination_district_codes.length > 0
      ) {
        candidateDistrictSatisfied = candidate.destination_district_codes.includes(
          myProfile.district_code
        );
      }

      if (!myDistrictSatisfied || !candidateDistrictSatisfied) continue;

      let score = 100;
      let reason = 'Cocok Dua Arah Sempurna (Sudin, Jenjang, Jabatan';
      if (myProfile.position === 'guru_mapel') {
        reason += ', Mapel';
      }
      if (
        (myProfile.destination_district_codes?.length || 0) > 0 &&
        (candidate.destination_district_codes?.length || 0) > 0
      ) {
        reason += ', & Spesifik Kecamatan';
      }
      reason += ')';

      matches.push({
        id: candidate.id,
        partner: candidate,
        matchScore: score,
        matchReason: reason,
        isOriginDistrictMatched: myDistrictSatisfied,
        isDestinationDistrictMatched: candidateDistrictSatisfied,
      });
    }

    return {
      status: 200,
      data: matches,
    };
  }

  public getTeacherDirectory(options?: {
    origin_sudin_id?: number | '';
    destination_sudin_id?: number | '';
    search?: string;
  }): ApiResponse<{ teachers: TeacherProfile[]; position: string | null; positionLabel: string | null }> {
    const user = this.getActiveUser();
    this.hydrateProfilesRelations();

    let myProfile: TeacherProfile | undefined;
    if (user) {
      myProfile = this.profiles.find((p) => p.user_id === user.id);
    }

    const position = myProfile?.position || null;
    const positionLabel =
      position === 'guru_kelas'
        ? 'Guru Kelas'
        : position === 'guru_mapel'
        ? 'Guru Mata Pelajaran'
        : null;

    let filtered = this.profiles.filter((p) => {
      if (p.is_mutated) return false;
      if (position && p.position !== position) return false;
      return true;
    });

    if (options?.origin_sudin_id) {
      filtered = filtered.filter((p) => p.sudin_id === Number(options.origin_sudin_id));
    }

    if (options?.destination_sudin_id) {
      filtered = filtered.filter(
        (p) => p.destination_sudin_id === Number(options.destination_sudin_id)
      );
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.school_name.toLowerCase().includes(q) ||
          p.district_name.toLowerCase().includes(q)
      );
    }

    return {
      status: 200,
      data: {
        teachers: filtered,
        position,
        positionLabel,
      },
    };
  }

  public async updateMutationStatus(is_mutated: boolean): Promise<ApiResponse<{ is_mutated: boolean }>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<{ is_mutated: boolean }>('/api/teacher-profile/status', {
        method: 'PATCH',
        body: { is_mutated },
      });
    }

    const user = this.getActiveUser();
    if (!user) return { status: 401, message: 'Unauthenticated.' };

    const profile = this.profiles.find((p) => p.user_id === user.id);
    if (!profile) {
      return { status: 404, message: 'Profil guru tidak ditemukan.' };
    }

    profile.is_mutated = is_mutated;
    profile.updated_at = new Date().toISOString();
    this.persist();

    return {
      status: 200,
      data: { is_mutated: profile.is_mutated },
      message: is_mutated
        ? 'Status mutasi diperbarui: Sudah Mutasi.'
        : 'Status mutasi diperbarui: Belum Mutasi.',
    };
  }

  public async requestProfileDeletion(): Promise<ApiResponse<DeletionRequest>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<DeletionRequest>('/api/teacher-profile/deletion-request', {
        method: 'POST',
      });
    }

    const user = this.getActiveUser();
    if (!user) return { status: 401, message: 'Unauthenticated.' };

    const profile = this.profiles.find((p) => p.user_id === user.id);
    if (!profile) {
      return { status: 404, message: 'Profil guru tidak ditemukan.' };
    }

    if (!profile.is_mutated) {
      return {
        status: 409,
        message: 'Pengajuan penghapusan hanya dapat dilakukan setelah status profil ditandai sudah mutasi.',
      };
    }

    const existing = this.deletionRequests.find(
      (r) => r.teacher_profile_id === profile.id && r.status === 'pending'
    );
    if (existing) {
      return {
        status: 200,
        data: existing,
        message: 'Pengajuan penghapusan sedang menunggu peninjauan admin.',
      };
    }

    const sudin = this.sudins.find((s) => s.id === profile.sudin_id);
    const newReq: DeletionRequest = {
      id: Math.max(0, ...this.deletionRequests.map((d) => d.id)) + 1,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      teacher_profile_id: profile.id,
      school_name: profile.school_name,
      sudin_name: sudin ? `${sudin.name} (${sudin.abbreviation})` : 'Sudin DKI',
      status: 'pending',
      requested_at: new Date().toISOString(),
    };

    profile.deletion_request_status = 'pending';
    profile.deletion_request_id = newReq.id;

    this.deletionRequests.unshift(newReq);
    this.persist();

    return {
      status: 201,
      data: newReq,
      message: 'Permohonan penghapusan profil berhasil diajukan ke dinas pendidikan.',
    };
  }

  // ---------------- ADMIN ENDPOINTS ----------------

  private checkAdmin(): ApiResponse | null {
    const user = this.getActiveUser();
    if (!user) return { status: 401, message: 'Unauthenticated.' };
    if (user.role !== 'admin') {
      return { status: 403, message: 'Akses ditolak. Endpoint ini memerlukan role admin.' };
    }
    return null;
  }

  public getAllDistricts(): ApiResponse<District[]> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      this.realFetch<District[]>('/api/admin/districts');
    }
    const allDistricts = this.sudins.flatMap((s) => s.districts);
    return { status: 200, data: allDistricts };
  }

  public getAllUsers(): ApiResponse<User[]> {
    return { status: 200, data: this.users };
  }

  public async adminCreateSudin(payload: {
    name: string;
    abbreviation?: string;
    districts: District[];
  }): Promise<ApiResponse<Sudin>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<Sudin>('/api/admin/sudins', {
        method: 'POST',
        body: payload,
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    if (!payload.name || payload.districts.length === 0) {
      return {
        status: 422,
        message: 'Nama Sudin dan minimal satu kecamatan wajib diisi.',
      };
    }

    const newSudin: Sudin = {
      id: Math.max(0, ...this.sudins.map((s) => s.id)) + 1,
      name: payload.name.trim(),
      abbreviation: payload.abbreviation?.trim() || '',
      districts: payload.districts,
    };

    this.sudins.push(newSudin);
    this.persist();

    return {
      status: 201,
      data: newSudin,
      message: 'Sudin berhasil ditambahkan.',
    };
  }

  public async adminDeleteSudin(sudinId: number): Promise<ApiResponse<null>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<null>(`/api/admin/sudins/${sudinId}`, { method: 'DELETE' });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const isUsed = this.profiles.some(
      (p) => p.sudin_id === sudinId || p.destination_sudin_id === sudinId
    );
    if (isUsed) {
      return {
        status: 409,
        message: 'Sudin yang masih dipakai oleh profil guru aktif tidak dapat dihapus.',
      };
    }

    this.sudins = this.sudins.filter((s) => s.id !== sudinId);
    this.persist();

    return { status: 200, data: null, message: 'Sudin berhasil dihapus.' };
  }

  public async adminCreateSubject(name: string): Promise<ApiResponse<Subject>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<Subject>('/api/admin/subjects', {
        method: 'POST',
        body: { name },
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    if (!name || name.trim().length === 0) {
      return { status: 422, message: 'Nama mata pelajaran tidak boleh kosong.' };
    }

    const newSubj: Subject = {
      id: Math.max(0, ...this.subjects.map((s) => s.id)) + 1,
      name: name.trim(),
    };

    this.subjects.push(newSubj);
    this.persist();

    return { status: 201, data: newSubj, message: 'Mata pelajaran berhasil ditambahkan.' };
  }

  public async adminDeleteSubject(subjectId: number): Promise<ApiResponse<null>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<null>(`/api/admin/subjects/${subjectId}`, { method: 'DELETE' });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const isUsed = this.profiles.some(
      (p) => p.subject_id === subjectId || p.destination_subject_ids?.includes(subjectId)
    );
    if (isUsed) {
      return {
        status: 409,
        message: 'Mata pelajaran yang masih dipakai oleh profil guru tidak dapat dihapus.',
      };
    }

    this.subjects = this.subjects.filter((s) => s.id !== subjectId);
    this.persist();

    return { status: 200, data: null, message: 'Mata pelajaran berhasil dihapus.' };
  }

  public async adminImportSubjectsCsv(csvContent: string): Promise<ApiResponse<{ added: number; skipped: number }>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      const formData = new FormData();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', blob, 'subjects.csv');
      return await this.realFetch<{ added: number; skipped: number }>('/api/admin/subjects/import', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const lines = csvContent.split(/\r?\n/);
    let added = 0;
    let skipped = 0;

    for (const line of lines) {
      const clean = line.split(',')[0]?.trim();
      if (!clean || clean.toLowerCase() === 'name' || clean.toLowerCase() === 'mata pelajaran') {
        skipped++;
        continue;
      }

      if (this.subjects.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
        skipped++;
        continue;
      }

      this.subjects.push({
        id: Math.max(0, ...this.subjects.map((s) => s.id)) + 1,
        name: clean,
      });
      added++;
    }

    this.persist();

    return {
      status: 200,
      data: { added, skipped },
      message: `Impor selesai: ${added} mapel ditambahkan, ${skipped} dilewati (duplikat/kosong).`,
    };
  }

  public async adminVerifyEmail(userId: number): Promise<ApiResponse<User>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<User>(`/api/admin/users/${userId}/verify-email`, { method: 'PATCH' });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const user = this.users.find((u) => u.id === userId);
    if (!user) return { status: 404, message: 'User tidak ditemukan.' };

    user.email_verified_at = new Date().toISOString();
    this.persist();

    return { status: 200, data: user, message: `Email ${user.email} berhasil diverifikasi.` };
  }

  public async adminResetPassword(userId: number): Promise<ApiResponse<{ reset_link: string }>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<{ reset_link: string }>(`/api/admin/users/${userId}/reset-password`, {
        method: 'PATCH',
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const user = this.users.find((u) => u.id === userId);
    if (!user) return { status: 404, message: 'User tidak ditemukan.' };

    const resetLink = `https://ruangtukar.jakarta.go.id/password-reset?token=${Math.random().toString(36).substring(2)}&email=${encodeURIComponent(user.email)}`;

    return {
      status: 200,
      data: { reset_link: resetLink },
      message: `Tautan reset password berhasil dikirim ke ${user.email}.`,
    };
  }

  public async adminDeleteUser(userId: number): Promise<ApiResponse<null>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<null>(`/api/admin/users/${userId}`, { method: 'DELETE' });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const current = this.getActiveUser();
    if (current && current.id === userId) {
      return { status: 403, message: 'Tidak dapat menghapus akun admin sendiri.' };
    }

    const adminCount = this.users.filter((u) => u.role === 'admin').length;
    const target = this.users.find((u) => u.id === userId);
    if (target?.role === 'admin' && adminCount <= 1) {
      return { status: 403, message: 'Tidak dapat menghapus admin terakhir pada sistem.' };
    }

    this.users = this.users.filter((u) => u.id !== userId);
    this.profiles = this.profiles.filter((p) => p.user_id !== userId);
    this.deletionRequests = this.deletionRequests.filter((d) => d.user_id !== userId);
    this.persist();

    return { status: 200, data: null, message: 'Akun user dan data profil terkait berhasil dihapus permanen.' };
  }

  public async adminReviewDeletionRequest(
    requestId: number,
    decision: 'approve' | 'reject'
  ): Promise<ApiResponse<DeletionRequest>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<DeletionRequest>(
        `/api/admin/profile-deletion-requests/${requestId}/review`,
        {
          method: 'POST',
          body: { decision },
        }
      );
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const req = this.deletionRequests.find((r) => r.id === requestId);
    if (!req) return { status: 404, message: 'Pengajuan tidak ditemukan.' };

    req.status = decision === 'approve' ? 'approved' : 'rejected';
    req.reviewed_at = new Date().toISOString();
    req.reviewed_by = this.getActiveUser()?.name || 'Admin';

    const profile = this.profiles.find((p) => p.id === req.teacher_profile_id);
    if (profile) {
      profile.deletion_request_status = req.status;
      if (decision === 'approve') {
        this.profiles = this.profiles.filter((p) => p.id !== profile.id);
        this.users = this.users.filter((u) => u.id !== profile.user_id);
      }
    }

    this.persist();

    return {
      status: 200,
      data: req,
      message:
        decision === 'approve'
          ? 'Pengajuan penghapusan disetujui. Akun dan profil telah dihapus.'
          : 'Pengajuan penghapusan ditolak.',
    };
  }

  public getDeletionRequests(): ApiResponse<DeletionRequest[]> {
    return { status: 200, data: this.deletionRequests };
  }

  public getMatchNotifications(): ApiResponse<MatchNotificationPair[]> {
    return { status: 200, data: this.matchPairs };
  }

  public async adminScanMatches(): Promise<ApiResponse<{ newMatchesFound: number }>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<{ newMatchesFound: number }>('/api/admin/match-notifications/scan', {
        method: 'POST',
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    this.hydrateProfilesRelations();
    let newFound = 0;

    for (let i = 0; i < this.profiles.length; i++) {
      for (let j = i + 1; j < this.profiles.length; j++) {
        const A = this.profiles[i];
        const B = this.profiles[j];
        if (A.is_mutated || B.is_mutated) continue;

        const sudinMatch =
          A.destination_sudin_id === B.sudin_id && B.destination_sudin_id === A.sudin_id;
        const posMatch =
          A.position === B.destination_position && B.position === A.destination_position;
        const levelMatch =
          A.destination_levels.includes(B.level) && B.destination_levels.includes(A.level);

        let subjectMatch = true;
        if (A.position === 'guru_mapel') {
          subjectMatch =
            !!A.subject_id && (B.destination_subject_ids?.includes(A.subject_id) || false);
        }
        if (B.position === 'guru_mapel' && subjectMatch) {
          subjectMatch =
            !!B.subject_id && (A.destination_subject_ids?.includes(B.subject_id) || false);
        }

        if (sudinMatch && posMatch && levelMatch && subjectMatch) {
          const exists = this.matchPairs.some(
            (m) =>
              (m.teacher_a.id === A.id && m.teacher_b.id === B.id) ||
              (m.teacher_a.id === B.id && m.teacher_b.id === A.id)
          );
          if (!exists) {
            this.matchPairs.unshift({
              id: Math.max(100, ...this.matchPairs.map((m) => m.id)) + 1,
              teacher_a: A,
              teacher_b: B,
              status: 'pending',
              scanned_at: new Date().toISOString(),
            });
            newFound++;
          }
        }
      }
    }

    this.persist();

    return {
      status: 200,
      data: { newMatchesFound: newFound },
      message: `Pemindaian selesai. Ditemukan ${newFound} pasangan kecocokan dua arah baru.`,
    };
  }

  public async adminSendPendingNotifications(): Promise<ApiResponse<{ sentCount: number }>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<{ sentCount: number }>('/api/admin/match-notifications/send-pending', {
        method: 'POST',
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    let sent = 0;
    this.matchPairs.forEach((pair) => {
      if (pair.status === 'pending') {
        pair.status = 'sent';
        pair.sent_at = new Date().toISOString();
        sent++;
      }
    });

    this.persist();

    return {
      status: 200,
      data: { sentCount: sent },
      message: `Berhasil mengirim ${sent} notifikasi email kecocokan ke guru terkait.`,
    };
  }

  public async adminSendPairNotification(pairId: number): Promise<ApiResponse<MatchNotificationPair>> {
    if (this.apiMode === 'live' && this.apiBaseUrl) {
      return await this.realFetch<MatchNotificationPair>(`/api/admin/match-notifications/${pairId}/send`, {
        method: 'POST',
      });
    }

    const adminCheck = this.checkAdmin();
    if (adminCheck) return adminCheck;

    const pair = this.matchPairs.find((p) => p.id === pairId);
    if (!pair) return { status: 404, message: 'Pasangan kecocokan tidak ditemukan.' };

    pair.status = 'sent';
    pair.sent_at = new Date().toISOString();
    this.persist();

    return {
      status: 200,
      data: pair,
      message: `Notifikasi kecocokan berhasil dikirim ulang ke ${pair.teacher_a.name} dan ${pair.teacher_b.name}.`,
    };
  }

  public resetToFactoryDefaults() {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    localStorage.removeItem(STORAGE_KEY_SUDINS);
    localStorage.removeItem(STORAGE_KEY_SUBJECTS);
    localStorage.removeItem(STORAGE_KEY_DELETION_REQUESTS);
    localStorage.removeItem(STORAGE_KEY_MATCH_PAIRS);
    this.initData();
    this.notify();
  }
}

export const api = new ApiService();
