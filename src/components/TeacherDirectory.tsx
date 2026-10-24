import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Sudin, TeacherProfile } from '../types';
import { Search, X, CheckCircle, Info } from 'lucide-react';

interface TeacherDirectoryProps {
  onNavigateToProfile: () => void;
  onNavigateToMatches: () => void;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  onNavigateToProfile,
  onNavigateToMatches,
}) => {
  const [sudins, setSudins] = useState<Sudin[]>([]);
  const [originSudinId, setOriginSudinId] = useState<number | ''>('');
  const [destinationSudinId, setDestinationSudinId] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

  const [directoryData, setDirectoryData] = useState<{
    teachers: TeacherProfile[];
    position: string | null;
    positionLabel: string | null;
  }>({
    teachers: [],
    position: null,
    positionLabel: null,
  });

  const loadData = async () => {
    const sRes = await api.getSudinsAsync();
    if (sRes.data) setSudins(sRes.data);

    const dirRes = api.getTeacherDirectory({
      origin_sudin_id: originSudinId,
      destination_sudin_id: destinationSudinId,
      search: searchTerm,
    });
    if (dirRes.data) {
      setDirectoryData(dirRes.data);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = api.subscribe(loadData);
    return unsub;
  }, [originSudinId, destinationSudinId, searchTerm]);

  const handleResetFilters = () => {
    setOriginSudinId('');
    setDestinationSudinId('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalTeachers = directoryData.teachers.length;
  const totalPages = Math.max(1, Math.ceil(totalTeachers / pageSize));

  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return directoryData.teachers.slice(start, start + pageSize);
  }, [directoryData.teachers, currentPage, pageSize]);

  const activeFilterCount = (originSudinId !== '' ? 1 : 0) + (destinationSudinId !== '' ? 1 : 0);

  return (
    <div className="page-shell">
      <main className="dashboard-main">
        {/* Intro Section */}
        <section className="admin-intro">
          <p className="eyebrow">DAFTAR GURU</p>
          <h1>
            {directoryData.positionLabel
              ? `${directoryData.positionLabel} lain yang ingin tukeran`
              : 'Daftar guru'}
          </h1>
          <p>
            Daftar otomatis menampilkan guru dengan jabatan yang sama denganmu. Gunakan filter Sudin
            asal dan Sudin tujuan untuk mempersempit.
          </p>
        </section>

        {/* Empty state if user has no position / hasn't completed profile */}
        {!directoryData.position ? (
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
            {/* Panel Heading */}
            <div className="panel-heading">
              <div>
                <p className="eyebrow">{directoryData.positionLabel?.toUpperCase()}</p>
                <h2>Guru terdaftar</h2>
              </div>
              <span className="step-number">{totalTeachers}</span>
            </div>

            {/* Filters Row */}
            <div className="dt-filters">
              <div className="dt-filter">
                <label htmlFor="dt-origin">Sudin asal</label>
                <select
                  id="dt-origin"
                  value={originSudinId}
                  onChange={(e) => {
                    setOriginSudinId(e.target.value === '' ? '' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Sudin asal</option>
                  {sudins.map((s) => (
                    <option key={`origin-${s.id}`} value={s.id}>
                      {s.abbreviation ? `${s.abbreviation} · ` : ''}
                      {s.name}
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
                  onChange={(e) => {
                    setDestinationSudinId(e.target.value === '' ? '' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Semua Sudin tujuan</option>
                  {sudins.map((s) => (
                    <option key={`dest-${s.id}`} value={s.id}>
                      {s.abbreviation ? `${s.abbreviation} · ` : ''}
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dt-filter">
                <label htmlFor="dt-search">Cari Nama / Sekolah</label>
                <div className="relative">
                  <input
                    id="dt-search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Ketik kata kunci..."
                    className="app-input text-xs py-2 pr-8"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="button button-secondary dt-reset"
                id="dt-reset"
                onClick={handleResetFilters}
              >
                Reset filter
              </button>
            </div>

            {/* Toolbar */}
            <div className="dt-toolbar">
              <label className="dt-length">
                <span>Tampilkan</span>
                <select
                  id="dt-length"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
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
                <span className="dt-active-filters" id="dt-active">
                  {activeFilterCount} filter aktif
                </span>
              )}
            </div>

            {/* Table */}
            <div className="dt-scroll">
              <table className="dt-table" id="teachers-table">
                <thead>
                  <tr>
                    <th data-sort="0">Nama</th>
                    <th data-sort="1">Asal</th>
                    <th data-sort="2">Tujuan</th>
                    <th className="dt-nosort text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTeachers.map((teacher) => {
                    const originSubject =
                      teacher.position === 'guru_mapel' ? teacher.subject?.name : null;
                    const destLevels = teacher.destinationLevels?.map((l) => l.level).join(', ');
                    const destSubjects =
                      teacher.destination_position === 'guru_mapel'
                        ? teacher.destinationSubjects?.map((s) => s.name).join(', ')
                        : '';
                    const destDistricts = teacher.destinationDistricts
                      ?.map((d) => d.name)
                      .join(', ');

                    return (
                      <tr
                        key={teacher.id}
                        data-teacher-row
                        data-origin={teacher.sudin_id}
                        data-destination={teacher.destination_sudin_id}
                      >
                        <td data-order={teacher.name.toLowerCase()}>
                          <div className="flex items-center gap-2">
                            <strong>{teacher.name}</strong>
                            <span className="dt-badge dt-badge-soft">{teacher.employment_type}</span>
                          </div>
                          <small className="text-slate-500">{teacher.school_name}</small>
                        </td>

                        <td
                          data-order={(
                            teacher.sudin?.abbreviation ||
                            teacher.sudin?.name ||
                            ''
                          ).toLowerCase()}
                        >
                          <span className="dt-badge">
                            {teacher.sudin?.abbreviation || teacher.sudin?.name || 'Sudin DKI'}
                          </span>
                          <small>
                            {teacher.level}
                            {originSubject ? ` · ${originSubject}` : ''} · {teacher.district_name}
                          </small>
                        </td>

                        <td
                          data-order={(
                            teacher.destinationSudin?.abbreviation ||
                            teacher.destinationSudin?.name ||
                            ''
                          ).toLowerCase()}
                        >
                          <span className="dt-badge">
                            {teacher.destinationSudin?.abbreviation ||
                              teacher.destinationSudin?.name ||
                              '-'}
                          </span>
                          <small>
                            {destLevels}
                            {destSubjects ? ` · ${destSubjects}` : ''}
                            {destDistricts ? ` · ${destDistricts}` : ' · Semua kec.'}
                          </small>
                        </td>

                        <td className="text-right">
                          <button
                            className="button button-secondary dt-detail-button text-xs py-1.5 px-3"
                            type="button"
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty list indicator */}
            {paginatedTeachers.length === 0 && (
              <div className="dt-empty" id="dt-empty">
                Tidak ada data guru yang cocok dengan filter yang dipilih.
              </div>
            )}

            {/* Footer & Pagination */}
            <div className="dt-footer">
              <p className="admin-pagination-summary" id="dt-info">
                {totalTeachers > 0
                  ? `Menampilkan ${(currentPage - 1) * pageSize + 1} sampai ${Math.min(
                      currentPage * pageSize,
                      totalTeachers
                    )} dari ${totalTeachers} guru terdaftar`
                  : 'Tidak ada data'}
              </p>

              {totalPages > 1 && (
                <div className="admin-pagination-links" id="dt-pages">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="page-btn"
                  >
                    ‹ Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Detail Modal */}
      {selectedTeacher && (
        <div
          className="user-modal"
          id="user-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Detail guru"
          onClick={() => setSelectedTeacher(null)}
        >
          <div className="user-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="user-modal-close"
              id="user-modal-close"
              aria-label="Tutup"
              onClick={() => setSelectedTeacher(null)}
            >
              ×
            </button>

            <div className="teacher-detail">
              <p className="eyebrow">{directoryData.positionLabel?.toUpperCase()}</p>
              <h3>{selectedTeacher.name}</h3>

              <div className="teacher-detail-grid">
                <section>
                  <h4>Asal</h4>
                  <dl>
                    <dt>Sudin</dt>
                    <dd>{selectedTeacher.sudin?.name || 'Sudin DKI'}</dd>

                    <dt>Status</dt>
                    <dd>{selectedTeacher.employment_type}</dd>

                    <dt>Jabatan</dt>
                    <dd>{directoryData.positionLabel || 'Guru'}</dd>

                    <dt>Jenjang</dt>
                    <dd>{selectedTeacher.level}</dd>

                    {selectedTeacher.position === 'guru_mapel' && selectedTeacher.subject && (
                      <>
                        <dt>Mata pelajaran</dt>
                        <dd>{selectedTeacher.subject.name}</dd>
                      </>
                    )}

                    <dt>Wilayah</dt>
                    <dd>
                      {selectedTeacher.district_name}, {selectedTeacher.regency_name}
                    </dd>

                    <dt>Sekolah</dt>
                    <dd className="truncate">{selectedTeacher.school_name}</dd>
                  </dl>
                </section>

                <section>
                  <h4>Tujuan</h4>
                  <dl>
                    <dt>Sudin</dt>
                    <dd>{selectedTeacher.destinationSudin?.name || '-'}</dd>

                    <dt>Jabatan</dt>
                    <dd>
                      {selectedTeacher.destination_position === 'guru_kelas'
                        ? 'Guru Kelas'
                        : 'Guru Mapel'}
                    </dd>

                    <dt>Jenjang</dt>
                    <dd>
                      {selectedTeacher.destinationLevels?.map((l) => l.level).join(', ') || '-'}
                    </dd>

                    {selectedTeacher.destination_position === 'guru_mapel' &&
                      selectedTeacher.destinationSubjects && (
                        <>
                          <dt>Mata pelajaran</dt>
                          <dd>
                            {selectedTeacher.destinationSubjects.map((s) => s.name).join(', ')}
                          </dd>
                        </>
                      )}

                    <dt>Kecamatan</dt>
                    <dd>
                      {selectedTeacher.destinationDistricts &&
                      selectedTeacher.destinationDistricts.length > 0
                        ? selectedTeacher.destinationDistricts.map((d) => d.name).join(', ')
                        : 'Semua kecamatan di Sudin tujuan'}
                    </dd>
                  </dl>
                </section>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <p className="field-help text-sky-900 m-0">
                  Nomor kontak hanya tampil bila kamu dan guru ini saling cocok dua arah, di halaman{' '}
                  <button
                    onClick={() => {
                      setSelectedTeacher(null);
                      onNavigateToMatches();
                    }}
                    className="font-bold underline text-sky-700 hover:text-sky-900"
                  >
                    Kecocokan Saya (Dashboard)
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blade Footer */}
      <footer className="footer">
        <span>Ruang Tukar Guru · Daftar guru</span>
        <span>Nomor kontak hanya tampil pada kecocokan di dashboard</span>
      </footer>
    </div>
  );
};
