import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { District, Sudin, TeacherDirectoryEntry } from '../types';
import { AlertCircle, Info, Loader2, RefreshCw, Search, X } from 'lucide-react';

interface TeacherDirectoryProps {
  onNavigateToProfile: () => void;
  onNavigateToMatches: () => void;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  onNavigateToProfile,
  onNavigateToMatches,
}) => {
  const [sudins, setSudins] = useState<Sudin[]>([]);
  const [teachers, setTeachers] = useState<TeacherDirectoryEntry[]>([]);
  const [position, setPosition] = useState<string | null>(null);
  const [positionLabel, setPositionLabel] = useState<string | null>(null);
  const [originSudinId, setOriginSudinId] = useState<number | ''>('');
  const [destinationSudinId, setDestinationSudinId] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDirectoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sudinsRes, directoryRes] = await Promise.all([
        api.getSudinsAsync(),
        api.getTeacherDirectoryAsync(),
      ]);

      if (sudinsRes.status !== 200 || !Array.isArray(sudinsRes.data)) {
        throw new Error(sudinsRes.message || 'Gagal memuat daftar Sudin dari server.');
      }
      if (
        directoryRes.status !== 200 ||
        !directoryRes.data ||
        !Array.isArray(directoryRes.data.teachers)
      ) {
        throw new Error(directoryRes.message || 'Gagal memuat daftar guru dari server.');
      }

      setSudins(sudinsRes.data);
      setTeachers(directoryRes.data.teachers);
      setPosition(directoryRes.data.position);
      setPositionLabel(directoryRes.data.positionLabel);
    } catch (loadError) {
      setTeachers([]);
      setPosition(null);
      setPositionLabel(null);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Terjadi kesalahan saat memuat daftar guru.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    return api.subscribe(loadData);
  }, [loadData]);

  const filteredTeachers = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    return teachers.filter((teacher) => {
      if (originSudinId !== '' && teacher.origin.sudin !== sudins.find((s) => s.id === originSudinId)?.name) {
        return false;
      }
      if (
        destinationSudinId !== '' &&
        teacher.destination.sudin !== sudins.find((s) => s.id === destinationSudinId)?.name
      ) {
        return false;
      }
      if (!query) return true;

      const searchable = [
        teacher.name,
        teacher.position_label,
        teacher.level,
        teacher.subject,
        teacher.origin.sudin,
        teacher.origin.district,
        teacher.origin.regency,
        teacher.destination.sudin,
        ...teacher.destination.levels,
        ...teacher.destination.subjects,
        ...teacher.destination.districts.map((district) => district.name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase();
      return searchable.includes(query);
    });
  }, [teachers, sudins, originSudinId, destinationSudinId, searchTerm]);

  const totalTeachers = filteredTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalTeachers / pageSize));
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeachers.slice(start, start + pageSize);
  }, [filteredTeachers, currentPage, pageSize]);
  const activeFilterCount =
    (originSudinId !== '' ? 1 : 0) +
    (destinationSudinId !== '' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setOriginSudinId('');
    setDestinationSudinId('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const sudinName = (name: string | null) =>
    name
      ? sudins.find((sudin) => sudin.name === name)?.abbreviation || name
      : 'Sudin belum tersedia';
  const districtNames = (districts: Array<Pick<District, 'name'>>) =>
    districts.map((district) => district.name).join(', ');

  return (
    <div className="page-shell">
      <main className="dashboard-main">
        <section className="admin-intro">
          <p className="eyebrow">DAFTAR GURU</p>
          <h1>{positionLabel ? `${positionLabel} lain yang ingin tukeran` : 'Daftar guru'}</h1>
          <p>
            Daftar ini hanya menampilkan guru dengan jabatan yang sama seperti profilmu. Nama
            disamarkan untuk menjaga privasi.
          </p>
        </section>

        {loading ? (
          <section className="panel admin-users-panel">
            <div className="empty-state flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <p>Memuat daftar guru...</p>
            </div>
          </section>
        ) : error ? (
          <section className="panel admin-users-panel">
            <div className="empty-state">
              <AlertCircle className="mx-auto mb-2 h-6 w-6 text-rose-600" />
              <p className="text-rose-700">{error}</p>
              <button
                type="button"
                onClick={loadData}
                className="button button-secondary mt-4 inline-flex items-center gap-2 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Coba lagi
              </button>
            </div>
          </section>
        ) : !position ? (
          <section className="panel admin-users-panel">
            <div className="empty-state">
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
                terlebih dahulu agar daftar guru dengan jabatan yang sama dapat ditampilkan.
              </p>
            </div>
          </section>
        ) : (
          <section className="panel admin-users-panel shadow-sm">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">{positionLabel?.toUpperCase()}</p>
                <h2>Guru terdaftar</h2>
              </div>
              <span className="step-number">{totalTeachers}</span>
            </div>

            <div className="dt-filters">
              <div className="dt-filter">
                <label htmlFor="dt-origin">Sudin asal</label>
                <select
                  id="dt-origin"
                  value={originSudinId}
                  onChange={(event) => {
                    setOriginSudinId(event.target.value ? Number(event.target.value) : '');
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Sudin asal</option>
                  {sudins.map((sudin) => (
             <option key={sudin.id} value={sudin.id}>
  {sudin.abbreviation || sudin.name}
</option>
                  ))}
                </select>
              </div>

              <div className="dt-filter-arrow" aria-hidden="true">
                →
              </div>

              <div className="dt-filter">
                <label htmlFor="dt-destination">Sudin tujuan</label>
                <select
                  id="dt-destination"
                  value={destinationSudinId}
                  onChange={(event) => {
                    setDestinationSudinId(event.target.value ? Number(event.target.value) : '');
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Sudin tujuan</option>
                  {sudins.map((sudin) => (
                    <option key={sudin.id} value={sudin.id}>
                      {sudin.abbreviation || sudin.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dt-filter">
                <label htmlFor="dt-search">Cari nama tersamarkan / wilayah</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id="dt-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Nama, Sudin, kecamatan, jenjang..."
                    className="app-input py-2 pl-8 pr-8 text-xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      aria-label="Hapus pencarian"
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="button button-secondary dt-reset"
                onClick={handleResetFilters}
              >
                Reset filter
              </button>
            </div>

            <div className="dt-toolbar">
              <label className="dt-length">
                <span>Tampilkan</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>data per halaman</span>
              </label>
              {activeFilterCount > 0 && (
                <span className="dt-active-filters">{activeFilterCount} filter aktif</span>
              )}
            </div>

            <div className="dt-scroll">
              <table className="dt-table">
                <thead>
                  <tr>
                    <th>Nama (disamarkan)</th>
                    <th>Asal</th>
                    <th>Tujuan</th>
                    <th className="dt-nosort text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <strong>{teacher.name}</strong>
                          <span className="dt-badge dt-badge-soft">{teacher.employment_type}</span>
                        </div>
                      </td>
                      <td>
                        <span className="dt-badge">{sudinName(teacher.origin.sudin)}</span>
                        <small>
                          {teacher.level}
                          {teacher.subject ? ` · ${teacher.subject}` : ''} · {teacher.origin.district}
                        </small>
                      </td>
                      <td>
                        <span className="dt-badge">{sudinName(teacher.destination.sudin)}</span>
                        <small>
                          {teacher.destination.levels.join(', ') || teacher.level}
                          {teacher.destination.subjects.length
                            ? ` · ${teacher.destination.subjects.join(', ')}`
                            : teacher.subject
                            ? ` · ${teacher.subject}`
                            : ''}
                          {teacher.destination.districts.length
                            ? ` · ${districtNames(teacher.destination.districts)}`
                            : ' · Semua kec.'}
                        </small>
                      </td>
                      <td className="text-right">
                        <button
                          className="button button-secondary dt-detail-button px-3 py-1.5 text-xs"
                          type="button"
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedTeachers.length === 0 && (
              <div className="dt-empty">Tidak ada guru yang sesuai dengan filter ini.</div>
            )}

            <div className="dt-footer">
              <p className="admin-pagination-summary">
                {totalTeachers > 0
                  ? `Menampilkan ${(currentPage - 1) * pageSize + 1} sampai ${Math.min(
                      currentPage * pageSize,
                      totalTeachers
                    )} dari ${totalTeachers} guru`
                  : 'Tidak ada data'}
              </p>
              {totalPages > 1 && (
                <div className="admin-pagination-links">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="page-btn"
                  >
                    ‹ Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="page-btn"
                  >
                    Selanjutnya ›
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {selectedTeacher && (
        <div
          className="user-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Detail guru"
          onClick={() => setSelectedTeacher(null)}
        >
          <div className="user-modal-box" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="user-modal-close"
              aria-label="Tutup"
              onClick={() => setSelectedTeacher(null)}
            >
              ×
            </button>
            <div className="teacher-detail">
              <p className="eyebrow">{positionLabel?.toUpperCase()}</p>
              <h3>{selectedTeacher.name}</h3>
              <div className="teacher-detail-grid">
                <section>
                  <h4>Asal</h4>
                  <dl>
                    <dt>Sudin</dt>
                    <dd>{sudinName(selectedTeacher.origin.sudin)}</dd>
                    <dt>Status</dt>
                    <dd>{selectedTeacher.employment_type}</dd>
                    <dt>Jabatan</dt>
                    <dd>{selectedTeacher.position_label}</dd>
                    <dt>Jenjang</dt>
                    <dd>{selectedTeacher.level}</dd>
                    {selectedTeacher.subject && (
                      <>
                        <dt>Mata pelajaran</dt>
                        <dd>{selectedTeacher.subject}</dd>
                      </>
                    )}
                    <dt>Wilayah</dt>
                    <dd>
                      {selectedTeacher.origin.district}, {selectedTeacher.origin.regency}
                    </dd>
                  </dl>
                </section>
                <section>
                  <h4>Tujuan</h4>
                  <dl>
                    <dt>Sudin</dt>
                    <dd>{sudinName(selectedTeacher.destination.sudin)}</dd>
                    <dt>Jabatan</dt>
                    <dd>{selectedTeacher.destination.position_label || selectedTeacher.position_label}</dd>
                    <dt>Jenjang</dt>
                    <dd>
                      {selectedTeacher.destination.levels.join(', ') || selectedTeacher.level}
                    </dd>
                    {selectedTeacher.destination.subjects.length > 0 && (
                      <>
                        <dt>Mata pelajaran</dt>
                        <dd>{selectedTeacher.destination.subjects.join(', ')}</dd>
                      </>
                    )}
                    <dt>Kecamatan</dt>
                    <dd>
                      {selectedTeacher.destination.districts.length > 0
                        ? districtNames(selectedTeacher.destination.districts)
                        : 'Semua kecamatan di Sudin tujuan'}
                    </dd>
                  </dl>
                </section>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg border border-sky-100 bg-sky-50 p-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                <p className="field-help m-0 text-sky-900">
                  Nama guru disamarkan dan detail kontak tidak ditampilkan di daftar. Lihat{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTeacher(null);
                      onNavigateToMatches();
                    }}
                    className="font-bold text-sky-700 underline hover:text-sky-900"
                  >
                    Cari Tukeran
                  </button>{' '}
                  untuk melihat kecocokan dua arah.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>Cari Tukeran Guru · Daftar guru</span>
        <span>Aplikasi ini dibangun secara swadaya, di luar naungan resmi Dinas Pendidikan Provinsi DKI Jakarta.</span>
      </footer>
    </div>
  );
};
