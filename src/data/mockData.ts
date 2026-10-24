/**
 * Master Data DKI Jakarta for Ruang Tukar Guru
 * Includes 11 Suku Dinas Pendidikan (Sudin) & Districts in DKI Jakarta (Province 31),
 * Official Subjects list, and Seed Users/Teachers.
 */
import { District, Village, Sudin, Subject, TeacherProfile, User, DeletionRequest, MatchNotificationPair } from '../types';

export const INITIAL_SUDINS: Sudin[] = [
  {
    id: 1,
    name: 'Sudin Pendidikan Jakarta Pusat Wilayah I',
    abbreviation: 'JP I',
    districts: [
      { code: '31.71.01', name: 'Gambir', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.02', name: 'Sawah Besar', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.03', name: 'Kemayoran', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.04', name: 'Cempaka Putih', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
    ],
  },
  {
    id: 2,
    name: 'Sudin Pendidikan Jakarta Pusat Wilayah II',
    abbreviation: 'JP II',
    districts: [
      { code: '31.71.05', name: 'Senen', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.06', name: 'Tanah Abang', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.07', name: 'Menteng', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.08', name: 'Johar Baru', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
    ],
  },
  {
    id: 3,
    name: 'Sudin Pendidikan Jakarta Utara Wilayah I',
    abbreviation: 'JU I',
    districts: [
      { code: '31.72.01', name: 'Penjaringan', regency_code: '31.72', regency_name: 'Kota Administrasi Jakarta Utara' },
      { code: '31.72.02', name: 'Pademangan', regency_code: '31.72', regency_name: 'Kota Administrasi Jakarta Utara' },
      { code: '31.72.03', name: 'Tanjung Priok', regency_code: '31.72', regency_name: 'Kota Administrasi Jakarta Utara' },
    ],
  },
  {
    id: 4,
    name: 'Sudin Pendidikan Jakarta Utara Wilayah II',
    abbreviation: 'JU II',
    districts: [
      { code: '31.72.04', name: 'Koja', regency_code: '31.72', regency_name: 'Kota Administrasi Jakarta Utara' },
      { code: '31.72.05', name: 'Kelapa Gading', regency_code: '31.72', regency_name: 'Kota Administrasi Jakarta Utara' },
      { code: '31.72.06', name: 'Cilincing', regency_code: '31.72', regency_name: 'Kota Administrasi Jakarta Utara' },
    ],
  },
  {
    id: 5,
    name: 'Sudin Pendidikan Jakarta Barat Wilayah I',
    abbreviation: 'JB I',
    districts: [
      { code: '31.73.01', name: 'Cengkareng', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
      { code: '31.73.02', name: 'Kalideres', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
      { code: '31.73.03', name: 'Tambora', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
    ],
  },
  {
    id: 6,
    name: 'Sudin Pendidikan Jakarta Barat Wilayah II',
    abbreviation: 'JB II',
    districts: [
      { code: '31.73.04', name: 'Grogol Petamburan', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
      { code: '31.73.05', name: 'Taman Sari', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
      { code: '31.73.06', name: 'Kebon Jeruk', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
      { code: '31.73.07', name: 'Palmerah', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
      { code: '31.73.08', name: 'Kembangan', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
    ],
  },
  {
    id: 7,
    name: 'Sudin Pendidikan Jakarta Selatan Wilayah I',
    abbreviation: 'JS I',
    districts: [
      { code: '31.74.01', name: 'Jagakarsa', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.02', name: 'Pasar Minggu', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.03', name: 'Cilandak', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.04', name: 'Pesanggrahan', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.05', name: 'Kebayoran Lama', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
    ],
  },
  {
    id: 8,
    name: 'Sudin Pendidikan Jakarta Selatan Wilayah II',
    abbreviation: 'JS II',
    districts: [
      { code: '31.74.06', name: 'Tebet', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.07', name: 'Setiabudi', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.08', name: 'Mampang Prapatan', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.09', name: 'Pancoran', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.10', name: 'Kebayoran Baru', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
    ],
  },
  {
    id: 9,
    name: 'Sudin Pendidikan Jakarta Timur Wilayah I',
    abbreviation: 'JT I',
    districts: [
      { code: '31.75.01', name: 'Matraman', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.02', name: 'Jatinegara', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.03', name: 'Duren Sawit', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.04', name: 'Pulogadung', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.05', name: 'Cakung', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
    ],
  },
  {
    id: 10,
    name: 'Sudin Pendidikan Jakarta Timur Wilayah II',
    abbreviation: 'JT II',
    districts: [
      { code: '31.75.06', name: 'Kramat Jati', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.07', name: 'Cipayung', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.08', name: 'Ciracas', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.09', name: 'Pasar Rebo', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.10', name: 'Makasar', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
    ],
  },
  {
    id: 11,
    name: 'Sudin Pendidikan Kepulauan Seribu',
    abbreviation: 'Kep. Seribu',
    districts: [
      { code: '31.01.01', name: 'Kepulauan Seribu Utara', regency_code: '31.01', regency_name: 'Kabupaten Administrasi Kepulauan Seribu' },
      { code: '31.01.02', name: 'Kepulauan Seribu Selatan', regency_code: '31.01', regency_name: 'Kabupaten Administrasi Kepulauan Seribu' },
    ],
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 1, name: 'Matematika' },
  { id: 2, name: 'Bahasa Indonesia' },
  { id: 3, name: 'Bahasa Inggris' },
  { id: 4, name: 'Ilmu Pengetahuan Alam (IPA)' },
  { id: 5, name: 'Ilmu Pengetahuan Sosial (IPS)' },
  { id: 6, name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)' },
  { id: 7, name: 'Pendidikan Pancasila dan Kewarganegaraan (PPKn)' },
  { id: 8, name: 'Seni Budaya' },
  { id: 9, name: 'Informatika' },
  { id: 10, name: 'Bimbingan Konseling (BK)' },
  { id: 11, name: 'Pendidikan Agama Islam' },
  { id: 12, name: 'Pendidikan Agama Kristen' },
  { id: 13, name: 'Prakarya dan Kewirausahaan' },
  { id: 14, name: 'Fisika' },
  { id: 15, name: 'Biologi' },
  { id: 16, name: 'Kimia' },
  { id: 17, name: 'Ekonomi' },
  { id: 18, name: 'Geografi' },
  { id: 19, name: 'Sosiologi' },
  { id: 20, name: 'Sejarah' },
];

// Official Villages (Kelurahan) in DKI Jakarta per District
export const DKI_VILLAGES: Record<string, Village[]> = {
  // Jakarta Timur
  '31.75.07': [
    { code: '31.75.07.1001', name: 'Cipayung', district_code: '31.75.07' },
    { code: '31.75.07.1002', name: 'Ceger', district_code: '31.75.07' },
    { code: '31.75.07.1003', name: 'Munjul', district_code: '31.75.07' },
    { code: '31.75.07.1004', name: 'Pondok Ranggon', district_code: '31.75.07' },
    { code: '31.75.07.1005', name: 'Cilangkap', district_code: '31.75.07' },
    { code: '31.75.07.1006', name: 'Setu', district_code: '31.75.07' },
    { code: '31.75.07.1007', name: 'Bambu Apus', district_code: '31.75.07' },
    { code: '31.75.07.1008', name: 'Lubang Buaya', district_code: '31.75.07' },
  ],
  '31.75.08': [
    { code: '31.75.08.1001', name: 'Ciracas', district_code: '31.75.08' },
    { code: '31.75.08.1002', name: 'Cibubur', district_code: '31.75.08' },
    { code: '31.75.08.1003', name: 'Kelapa Dua Wetan', district_code: '31.75.08' },
    { code: '31.75.08.1004', name: 'Susukan', district_code: '31.75.08' },
    { code: '31.75.08.1005', name: 'Rambutan', district_code: '31.75.08' },
  ],
  '31.75.06': [
    { code: '31.75.06.1001', name: 'Kramat Jati', district_code: '31.75.06' },
    { code: '31.75.06.1002', name: 'Batu Ampar', district_code: '31.75.06' },
    { code: '31.75.06.1003', name: 'Balekambang', district_code: '31.75.06' },
    { code: '31.75.06.1004', name: 'Kampung Tengah', district_code: '31.75.06' },
    { code: '31.75.06.1005', name: 'Dukuh', district_code: '31.75.06' },
    { code: '31.75.06.1006', name: 'Cawang', district_code: '31.75.06' },
    { code: '31.75.06.1007', name: 'Cililitan', district_code: '31.75.06' },
  ],
  '31.75.09': [
    { code: '31.75.09.1001', name: 'Pekayon', district_code: '31.75.09' },
    { code: '31.75.09.1002', name: 'Kampung Gedong', district_code: '31.75.09' },
    { code: '31.75.09.1003', name: 'Cijantung', district_code: '31.75.09' },
    { code: '31.75.09.1004', name: 'Kampung Baru', district_code: '31.75.09' },
    { code: '31.75.09.1005', name: 'Kalisari', district_code: '31.75.09' },
  ],
  '31.75.10': [
    { code: '31.75.10.1001', name: 'Makasar', district_code: '31.75.10' },
    { code: '31.75.10.1002', name: 'Pinang Ranti', district_code: '31.75.10' },
    { code: '31.75.10.1003', name: 'Kebon Pala', district_code: '31.75.10' },
    { code: '31.75.10.1004', name: 'Halim Perdanakusuma', district_code: '31.75.10' },
    { code: '31.75.10.1005', name: 'Cipinang Melayu', district_code: '31.75.10' },
  ],
  '31.75.01': [
    { code: '31.75.01.1001', name: 'Pisangan Baru', district_code: '31.75.01' },
    { code: '31.75.01.1002', name: 'Utan Kayu Selatan', district_code: '31.75.01' },
    { code: '31.75.01.1003', name: 'Utan Kayu Utara', district_code: '31.75.01' },
    { code: '31.75.01.1004', name: 'Kayu Manis', district_code: '31.75.01' },
    { code: '31.75.01.1005', name: 'Pal Meriam', district_code: '31.75.01' },
    { code: '31.75.01.1006', name: 'Kebon Manggis', district_code: '31.75.01' },
  ],
  '31.75.02': [
    { code: '31.75.02.1001', name: 'Bali Mester', district_code: '31.75.02' },
    { code: '31.75.02.1002', name: 'Kampung Melayu', district_code: '31.75.02' },
    { code: '31.75.02.1003', name: 'Bidaracina', district_code: '31.75.02' },
    { code: '31.75.02.1004', name: 'Cipinang Cempedak', district_code: '31.75.02' },
    { code: '31.75.02.1005', name: 'Rawa Bunga', district_code: '31.75.02' },
    { code: '31.75.02.1006', name: 'Cipinang Besar Utara', district_code: '31.75.02' },
    { code: '31.75.02.1007', name: 'Cipinang Besar Selatan', district_code: '31.75.02' },
    { code: '31.75.02.1008', name: 'Cipinang Muara', district_code: '31.75.02' },
  ],
  '31.75.03': [
    { code: '31.75.03.1001', name: 'Pondok Bambu', district_code: '31.75.03' },
    { code: '31.75.03.1002', name: 'Duren Sawit', district_code: '31.75.03' },
    { code: '31.75.03.1003', name: 'Pondok Kelapa', district_code: '31.75.03' },
    { code: '31.75.03.1004', name: 'Malaka Sari', district_code: '31.75.03' },
    { code: '31.75.03.1005', name: 'Malaka Jaya', district_code: '31.75.03' },
    { code: '31.75.03.1006', name: 'Klender', district_code: '31.75.03' },
    { code: '31.75.03.1007', name: 'Pondok Kopi', district_code: '31.75.03' },
  ],
  '31.75.04': [
    { code: '31.75.04.1001', name: 'Kayu Putih', district_code: '31.75.04' },
    { code: '31.75.04.1002', name: 'Rawamangun', district_code: '31.75.04' },
    { code: '31.75.04.1003', name: 'Pisangan Timur', district_code: '31.75.04' },
    { code: '31.75.04.1004', name: 'Cipinang', district_code: '31.75.04' },
    { code: '31.75.04.1005', name: 'Jatinegara Kaum', district_code: '31.75.04' },
    { code: '31.75.04.1006', name: 'Jati', district_code: '31.75.04' },
    { code: '31.75.04.1007', name: 'Pulo Gadung', district_code: '31.75.04' },
  ],
  '31.75.05': [
    { code: '31.75.05.1001', name: 'Cakung Barat', district_code: '31.75.05' },
    { code: '31.75.05.1002', name: 'Cakung Timur', district_code: '31.75.05' },
    { code: '31.75.05.1003', name: 'Rawa Terate', district_code: '31.75.05' },
    { code: '31.75.05.1004', name: 'Jatinegara', district_code: '31.75.05' },
    { code: '31.75.05.1005', name: 'Penggilingan', district_code: '31.75.05' },
    { code: '31.75.05.1006', name: 'Pulogebang', district_code: '31.75.05' },
    { code: '31.75.05.1007', name: 'Ujung Menteng', district_code: '31.75.05' },
  ],

  // Jakarta Selatan
  '31.74.01': [
    { code: '31.74.01.1001', name: 'Tanjung Barat', district_code: '31.74.01' },
    { code: '31.74.01.1002', name: 'Lenteng Agung', district_code: '31.74.01' },
    { code: '31.74.01.1003', name: 'Jagakarsa', district_code: '31.74.01' },
    { code: '31.74.01.1004', name: 'Ciganjur', district_code: '31.74.01' },
    { code: '31.74.01.1005', name: 'Srengseng Sawah', district_code: '31.74.01' },
    { code: '31.74.01.1006', name: 'Cipedak', district_code: '31.74.01' },
  ],
  '31.74.02': [
    { code: '31.74.02.1001', name: 'Pejaten Barat', district_code: '31.74.02' },
    { code: '31.74.02.1002', name: 'Pejaten Timur', district_code: '31.74.02' },
    { code: '31.74.02.1003', name: 'Pasar Minggu', district_code: '31.74.02' },
    { code: '31.74.02.1004', name: 'Kebagusan', district_code: '31.74.02' },
    { code: '31.74.02.1005', name: 'Jati Padang', district_code: '31.74.02' },
    { code: '31.74.02.1006', name: 'Ragunan', district_code: '31.74.02' },
    { code: '31.74.02.1007', name: 'Cilandak Timur', district_code: '31.74.02' },
  ],
  '31.74.03': [
    { code: '31.74.03.1001', name: 'Cipete Selatan', district_code: '31.74.03' },
    { code: '31.74.03.1002', name: 'Gandaria Selatan', district_code: '31.74.03' },
    { code: '31.74.03.1003', name: 'Cilandak Barat', district_code: '31.74.03' },
    { code: '31.74.03.1004', name: 'Lebak Bulus', district_code: '31.74.03' },
    { code: '31.74.03.1005', name: 'Pondok Labu', district_code: '31.74.03' },
  ],
  '31.74.04': [
    { code: '31.74.04.1001', name: 'Ulujami', district_code: '31.74.04' },
    { code: '31.74.04.1002', name: 'Petukangan Utara', district_code: '31.74.04' },
    { code: '31.74.04.1003', name: 'Petukangan Selatan', district_code: '31.74.04' },
    { code: '31.74.04.1004', name: 'Pesanggrahan', district_code: '31.74.04' },
    { code: '31.74.04.1005', name: 'Bintaro', district_code: '31.74.04' },
  ],
  '31.74.05': [
    { code: '31.74.05.1001', name: 'Grogol Utara', district_code: '31.74.05' },
    { code: '31.74.05.1002', name: 'Grogol Selatan', district_code: '31.74.05' },
    { code: '31.74.05.1003', name: 'Cipulir', district_code: '31.74.05' },
    { code: '31.74.05.1004', name: 'Kebayoran Lama Utara', district_code: '31.74.05' },
    { code: '31.74.05.1005', name: 'Kebayoran Lama Selatan', district_code: '31.74.05' },
    { code: '31.74.05.1006', name: 'Pondok Pinang', district_code: '31.74.05' },
  ],
  '31.74.06': [
    { code: '31.74.06.1001', name: 'Tebet Barat', district_code: '31.74.06' },
    { code: '31.74.06.1002', name: 'Tebet Timur', district_code: '31.74.06' },
    { code: '31.74.06.1003', name: 'Kebon Baru', district_code: '31.74.06' },
    { code: '31.74.06.1004', name: 'Bukit Duri', district_code: '31.74.06' },
    { code: '31.74.06.1005', name: 'Manggarai', district_code: '31.74.06' },
    { code: '31.74.06.1006', name: 'Manggarai Selatan', district_code: '31.74.06' },
    { code: '31.74.06.1007', name: 'Menteng Dalam', district_code: '31.74.06' },
  ],
  '31.74.07': [
    { code: '31.74.07.1001', name: 'Setiabudi', district_code: '31.74.07' },
    { code: '31.74.07.1002', name: 'Karet', district_code: '31.74.07' },
    { code: '31.74.07.1003', name: 'Karet Semanggi', district_code: '31.74.07' },
    { code: '31.74.07.1004', name: 'Karet Kuningan', district_code: '31.74.07' },
    { code: '31.74.07.1005', name: 'Kuningan Timur', district_code: '31.74.07' },
    { code: '31.74.07.1006', name: 'Menteng Atas', district_code: '31.74.07' },
    { code: '31.74.07.1007', name: 'Pasar Manggis', district_code: '31.74.07' },
    { code: '31.74.07.1008', name: 'Guntur', district_code: '31.74.07' },
  ],
  '31.74.08': [
    { code: '31.74.08.1001', name: 'Kuningan Barat', district_code: '31.74.08' },
    { code: '31.74.08.1002', name: 'Pela Mampang', district_code: '31.74.08' },
    { code: '31.74.08.1003', name: 'Bangka', district_code: '31.74.08' },
    { code: '31.74.08.1004', name: 'Tegal Parang', district_code: '31.74.08' },
    { code: '31.74.08.1005', name: 'Mampang Prapatan', district_code: '31.74.08' },
  ],
  '31.74.09': [
    { code: '31.74.09.1001', name: 'Kalibata', district_code: '31.74.09' },
    { code: '31.74.09.1002', name: 'Rawa Jati', district_code: '31.74.09' },
    { code: '31.74.09.1003', name: 'Duren Tiga', district_code: '31.74.09' },
    { code: '31.74.09.1004', name: 'Cikoko', district_code: '31.74.09' },
    { code: '31.74.09.1005', name: 'Pengadegan', district_code: '31.74.09' },
    { code: '31.74.09.1006', name: 'Pancoran', district_code: '31.74.09' },
  ],
  '31.74.10': [
    { code: '31.74.10.1001', name: 'Selong', district_code: '31.74.10' },
    { code: '31.74.10.1002', name: 'Gunung', district_code: '31.74.10' },
    { code: '31.74.10.1003', name: 'Kramat Pela', district_code: '31.74.10' },
    { code: '31.74.10.1004', name: 'Gandaria Utara', district_code: '31.74.10' },
    { code: '31.74.10.1005', name: 'Cipete Utara', district_code: '31.74.10' },
    { code: '31.74.10.1006', name: 'Pulo', district_code: '31.74.10' },
    { code: '31.74.10.1007', name: 'Melawai', district_code: '31.74.10' },
    { code: '31.74.10.1008', name: 'Petogogan', district_code: '31.74.10' },
    { code: '31.74.10.1009', name: 'Rawa Barat', district_code: '31.74.10' },
    { code: '31.74.10.1010', name: 'Senayan', district_code: '31.74.10' },
  ],

  // Jakarta Pusat
  '31.71.01': [
    { code: '31.71.01.1001', name: 'Gambir', district_code: '31.71.01' },
    { code: '31.71.01.1002', name: 'Kebon Kelapa', district_code: '31.71.01' },
    { code: '31.71.01.1003', name: 'Petojo Selatan', district_code: '31.71.01' },
    { code: '31.71.01.1004', name: 'Duri Pulo', district_code: '31.71.01' },
    { code: '31.71.01.1005', name: 'Petojo Utara', district_code: '31.71.01' },
    { code: '31.71.01.1006', name: 'Cideng', district_code: '31.71.01' },
  ],
  '31.71.02': [
    { code: '31.71.02.1001', name: 'Pasar Baru', district_code: '31.71.02' },
    { code: '31.71.02.1002', name: 'Gunung Sahari Utara', district_code: '31.71.02' },
    { code: '31.71.02.1003', name: 'Mangga Dua Selatan', district_code: '31.71.02' },
    { code: '31.71.02.1004', name: 'Karang Anyar', district_code: '31.71.02' },
    { code: '31.71.02.1005', name: 'Kartini', district_code: '31.71.02' },
  ],
  '31.71.03': [
    { code: '31.71.03.1001', name: 'Gunung Sahari Selatan', district_code: '31.71.03' },
    { code: '31.71.03.1002', name: 'Kemayoran', district_code: '31.71.03' },
    { code: '31.71.03.1003', name: 'Kebon Kosong', district_code: '31.71.03' },
    { code: '31.71.03.1004', name: 'Harapan Mulya', district_code: '31.71.03' },
    { code: '31.71.03.1005', name: 'Cempaka Baru', district_code: '31.71.03' },
    { code: '31.71.03.1006', name: 'Utan Panjang', district_code: '31.71.03' },
    { code: '31.71.03.1007', name: 'Serdang', district_code: '31.71.03' },
    { code: '31.71.03.1008', name: 'Sumur Batu', district_code: '31.71.03' },
  ],
  '31.71.04': [
    { code: '31.71.04.1001', name: 'Cempaka Putih Timur', district_code: '31.71.04' },
    { code: '31.71.04.1002', name: 'Cempaka Putih Barat', district_code: '31.71.04' },
    { code: '31.71.04.1003', name: 'Rawasari', district_code: '31.71.04' },
  ],
  '31.71.05': [
    { code: '31.71.05.1001', name: 'Senen', district_code: '31.71.05' },
    { code: '31.71.05.1002', name: 'Kwitang', district_code: '31.71.05' },
    { code: '31.71.05.1003', name: 'Kenari', district_code: '31.71.05' },
    { code: '31.71.05.1004', name: 'Paseban', district_code: '31.71.05' },
    { code: '31.71.05.1005', name: 'Kramat', district_code: '31.71.05' },
    { code: '31.71.05.1006', name: 'Bungur', district_code: '31.71.05' },
  ],
  '31.71.06': [
    { code: '31.71.06.1001', name: 'Bendungan Hilir', district_code: '31.71.06' },
    { code: '31.71.06.1002', name: 'Karet Tengsin', district_code: '31.71.06' },
    { code: '31.71.06.1003', name: 'Kebon Melati', district_code: '31.71.06' },
    { code: '31.71.06.1004', name: 'Kebon Kacang', district_code: '31.71.06' },
    { code: '31.71.06.1005', name: 'Kampung Bali', district_code: '31.71.06' },
    { code: '31.71.06.1006', name: 'Petamburan', district_code: '31.71.06' },
    { code: '31.71.06.1007', name: 'Gelora', district_code: '31.71.06' },
  ],
  '31.71.07': [
    { code: '31.71.07.1001', name: 'Menteng', district_code: '31.71.07' },
    { code: '31.71.07.1002', name: 'Pegangsaan', district_code: '31.71.07' },
    { code: '31.71.07.1003', name: 'Cikini', district_code: '31.71.07' },
    { code: '31.71.07.1004', name: 'Kebon Sirih', district_code: '31.71.07' },
    { code: '31.71.07.1005', name: 'Gondangdia', district_code: '31.71.07' },
  ],
  '31.71.08': [
    { code: '31.71.08.1001', name: 'Johar Baru', district_code: '31.71.08' },
    { code: '31.71.08.1002', name: 'Kampung Rawa', district_code: '31.71.08' },
    { code: '31.71.08.1003', name: 'Galur', district_code: '31.71.08' },
    { code: '31.71.08.1004', name: 'Tanah Tinggi', district_code: '31.71.08' },
  ],

  // Jakarta Barat
  '31.73.01': [
    { code: '31.73.01.1001', name: 'Kedaung Kali Angke', district_code: '31.73.01' },
    { code: '31.73.01.1002', name: 'Kapuk', district_code: '31.73.01' },
    { code: '31.73.01.1003', name: 'Cengkareng Barat', district_code: '31.73.01' },
    { code: '31.73.01.1004', name: 'Cengkareng Timur', district_code: '31.73.01' },
    { code: '31.73.01.1005', name: 'Rawa Buaya', district_code: '31.73.01' },
    { code: '31.73.01.1006', name: 'Duri Kosambi', district_code: '31.73.01' },
  ],
  '31.73.02': [
    { code: '31.73.02.1001', name: 'Kamal', district_code: '31.73.02' },
    { code: '31.73.02.1002', name: 'Tegal Alur', district_code: '31.73.02' },
    { code: '31.73.02.1003', name: 'Pegadungan', district_code: '31.73.02' },
    { code: '31.73.02.1004', name: 'Kalideres', district_code: '31.73.02' },
    { code: '31.73.02.1005', name: 'Semanan', district_code: '31.73.02' },
  ],
  '31.73.03': [
    { code: '31.73.03.1001', name: 'Roa Malaka', district_code: '31.73.03' },
    { code: '31.73.03.1002', name: 'Pekojan', district_code: '31.73.03' },
    { code: '31.73.03.1003', name: 'Tambora', district_code: '31.73.03' },
    { code: '31.73.03.1004', name: 'Tanah Sereal', district_code: '31.73.03' },
    { code: '31.73.03.1005', name: 'Krendang', district_code: '31.73.03' },
    { code: '31.73.03.1006', name: 'Duri Utara', district_code: '31.73.03' },
    { code: '31.73.03.1007', name: 'Duri Selatan', district_code: '31.73.03' },
    { code: '31.73.03.1008', name: 'Kalianyar', district_code: '31.73.03' },
    { code: '31.73.03.1009', name: 'Jembatan Besi', district_code: '31.73.03' },
    { code: '31.73.03.1010', name: 'Angke', district_code: '31.73.03' },
    { code: '31.73.03.1011', name: 'Jembatan Lima', district_code: '31.73.03' },
  ],
  '31.73.04': [
    { code: '31.73.04.1001', name: 'Tomang', district_code: '31.73.04' },
    { code: '31.73.04.1002', name: 'Grogol', district_code: '31.73.04' },
    { code: '31.73.04.1003', name: 'Jelambar', district_code: '31.73.04' },
    { code: '31.73.04.1004', name: 'Jelambar Baru', district_code: '31.73.04' },
    { code: '31.73.04.1005', name: 'Wijaya Kusuma', district_code: '31.73.04' },
    { code: '31.73.04.1006', name: 'Tanjung Duren Utara', district_code: '31.73.04' },
    { code: '31.73.04.1007', name: 'Tanjung Duren Selatan', district_code: '31.73.04' },
  ],
  '31.73.05': [
    { code: '31.73.05.1001', name: 'Pinangsia', district_code: '31.73.05' },
    { code: '31.73.05.1002', name: 'Glodok', district_code: '31.73.05' },
    { code: '31.73.05.1003', name: 'Keagungan', district_code: '31.73.05' },
    { code: '31.73.05.1004', name: 'Krukut', district_code: '31.73.05' },
    { code: '31.73.05.1005', name: 'Maphar', district_code: '31.73.05' },
    { code: '31.73.05.1006', name: 'Tangki', district_code: '31.73.05' },
    { code: '31.73.05.1007', name: 'Mangga Besar', district_code: '31.73.05' },
    { code: '31.73.05.1008', name: 'Taman Sari', district_code: '31.73.05' },
  ],
  '31.73.06': [
    { code: '31.73.06.1001', name: 'Duri Kepa', district_code: '31.73.06' },
    { code: '31.73.06.1002', name: 'Kedoya Selatan', district_code: '31.73.06' },
    { code: '31.73.06.1003', name: 'Kedoya Utara', district_code: '31.73.06' },
    { code: '31.73.06.1004', name: 'Kebon Jeruk', district_code: '31.73.06' },
    { code: '31.73.06.1005', name: 'Sukabumi Utara', district_code: '31.73.06' },
    { code: '31.73.06.1006', name: 'Kelapa Dua', district_code: '31.73.06' },
    { code: '31.73.06.1007', name: 'Sukabumi Selatan', district_code: '31.73.06' },
  ],
  '31.73.07': [
    { code: '31.73.07.1001', name: 'Slipi', district_code: '31.73.07' },
    { code: '31.73.07.1002', name: 'Kota Bambu Utara', district_code: '31.73.07' },
    { code: '31.73.07.1003', name: 'Jati Pulo', district_code: '31.73.07' },
    { code: '31.73.07.1004', name: 'Palmerah', district_code: '31.73.07' },
    { code: '31.73.07.1005', name: 'Kemanggisan', district_code: '31.73.07' },
    { code: '31.73.07.1006', name: 'Kota Bambu Selatan', district_code: '31.73.07' },
  ],
  '31.73.08': [
    { code: '31.73.08.1001', name: 'Kembangan Barat', district_code: '31.73.08' },
    { code: '31.73.08.1002', name: 'Kembangan Timur', district_code: '31.73.08' },
    { code: '31.73.08.1003', name: 'Meruya Utara', district_code: '31.73.08' },
    { code: '31.73.08.1004', name: 'Srengseng', district_code: '31.73.08' },
    { code: '31.73.08.1005', name: 'Joglo', district_code: '31.73.08' },
    { code: '31.73.08.1006', name: 'Meruya Selatan', district_code: '31.73.08' },
  ],

  // Jakarta Utara
  '31.72.01': [
    { code: '31.72.01.1001', name: 'Penjaringan', district_code: '31.72.01' },
    { code: '31.72.01.1002', name: 'Pluit', district_code: '31.72.01' },
    { code: '31.72.01.1003', name: 'Pejagalan', district_code: '31.72.01' },
    { code: '31.72.01.1004', name: 'Kapuk Muara', district_code: '31.72.01' },
    { code: '31.72.01.1005', name: 'Kamal Muara', district_code: '31.72.01' },
  ],
  '31.72.02': [
    { code: '31.72.02.1001', name: 'Pademangan Timur', district_code: '31.72.02' },
    { code: '31.72.02.1002', name: 'Pademangan Barat', district_code: '31.72.02' },
    { code: '31.72.02.1003', name: 'Ancol', district_code: '31.72.02' },
  ],
  '31.72.03': [
    { code: '31.72.03.1001', name: 'Tanjung Priok', district_code: '31.72.03' },
    { code: '31.72.03.1002', name: 'Kebon Bawang', district_code: '31.72.03' },
    { code: '31.72.03.1003', name: 'Sungai Bambu', district_code: '31.72.03' },
    { code: '31.72.03.1004', name: 'Papanggo', district_code: '31.72.03' },
    { code: '31.72.03.1005', name: 'Warakas', district_code: '31.72.03' },
    { code: '31.72.03.1006', name: 'Sunter Agung', district_code: '31.72.03' },
    { code: '31.72.03.1007', name: 'Sunter Jaya', district_code: '31.72.03' },
  ],
  '31.72.04': [
    { code: '31.72.04.1001', name: 'Koja', district_code: '31.72.04' },
    { code: '31.72.04.1002', name: 'Rawa Badak Utara', district_code: '31.72.04' },
    { code: '31.72.04.1003', name: 'Rawa Badak Selatan', district_code: '31.72.04' },
    { code: '31.72.04.1004', name: 'Tugu Utara', district_code: '31.72.04' },
    { code: '31.72.04.1005', name: 'Tugu Selatan', district_code: '31.72.04' },
    { code: '31.72.04.1006', name: 'Lagoa', district_code: '31.72.04' },
  ],
  '31.72.05': [
    { code: '31.72.05.1001', name: 'Kelapa Gading Barat', district_code: '31.72.05' },
    { code: '31.72.05.1002', name: 'Kelapa Gading Timur', district_code: '31.72.05' },
    { code: '31.72.05.1003', name: 'Pegangsaan Dua', district_code: '31.72.05' },
  ],
  '31.72.06': [
    { code: '31.72.06.1001', name: 'Kali Baru', district_code: '31.72.06' },
    { code: '31.72.06.1002', name: 'Cilincing', district_code: '31.72.06' },
    { code: '31.72.06.1003', name: 'Semper Barat', district_code: '31.72.06' },
    { code: '31.72.06.1004', name: 'Semper Timur', district_code: '31.72.06' },
    { code: '31.72.06.1005', name: 'Sukapura', district_code: '31.72.06' },
    { code: '31.72.06.1006', name: 'Rorotan', district_code: '31.72.06' },
    { code: '31.72.06.1007', name: 'Marunda', district_code: '31.72.06' },
  ],

  // Kepulauan Seribu
  '31.01.01': [
    { code: '31.01.01.1001', name: 'Pulau Panggang', district_code: '31.01.01' },
    { code: '31.01.01.1002', name: 'Pulau Kelapa', district_code: '31.01.01' },
    { code: '31.01.01.1003', name: 'Pulau Harapan', district_code: '31.01.01' },
  ],
  '31.01.02': [
    { code: '31.01.02.1001', name: 'Pulau Untung Jawa', district_code: '31.01.02' },
    { code: '31.01.02.1002', name: 'Pulau Pari', district_code: '31.01.02' },
    { code: '31.01.02.1003', name: 'Pulau Tidung', district_code: '31.01.02' },
  ],
};

// Helper to find district by code
export function findDistrict(code: string): District | undefined {
  for (const s of INITIAL_SUDINS) {
    const d = s.districts.find((item) => item.code === code);
    if (d) return d;
  }
  return undefined;
}

// Helper to find villages by district code
export function findVillagesByDistrict(districtCode: string): Village[] {
  return DKI_VILLAGES[districtCode] || [
    { code: `${districtCode}.1001`, name: 'Kelurahan 01', district_code: districtCode },
    { code: `${districtCode}.1002`, name: 'Kelurahan 02', district_code: districtCode },
  ];
}

// Seed Users
export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Admin Disdik DKI',
    email: 'admin@disdik.jakarta.go.id',
    role: 'admin',
    email_verified_at: '2026-01-01T08:00:00Z',
    created_at: '2026-01-01T08:00:00Z',
  },
  {
    id: 2,
    name: 'Budi Santoso, S.Pd.',
    email: 'budi.santoso@guru.sd.belajar.id',
    role: 'guru',
    email_verified_at: '2026-01-10T09:30:00Z',
    created_at: '2026-01-10T09:30:00Z',
  },
  {
    id: 3,
    name: 'Siti Nurhaliza, M.Pd.',
    email: 'siti.nurhaliza@guru.sd.belajar.id',
    role: 'guru',
    email_verified_at: '2026-01-12T10:15:00Z',
    created_at: '2026-01-12T10:15:00Z',
  },
  {
    id: 4,
    name: 'Ahmad Fauzi, S.Pd.',
    email: 'ahmad.fauzi@guru.smp.belajar.id',
    role: 'guru',
    email_verified_at: '2026-01-15T14:20:00Z',
    created_at: '2026-01-15T14:20:00Z',
  },
  {
    id: 5,
    name: 'Dewi Lestari, S.Pd.',
    email: 'dewi.lestari@guru.smp.belajar.id',
    role: 'guru',
    email_verified_at: '2026-01-18T11:00:00Z',
    created_at: '2026-01-18T11:00:00Z',
  },
  {
    id: 6,
    name: 'Rian Pratama, S.Pd.',
    email: 'rian.pratama@guru.sma.belajar.id',
    role: 'guru',
    email_verified_at: '2026-02-01T08:45:00Z',
    created_at: '2026-02-01T08:45:00Z',
  },
  {
    id: 7,
    name: 'Endang Kusuma, S.Pd.',
    email: 'endang.kusuma@guru.sd.belajar.id',
    role: 'guru',
    email_verified_at: '2026-02-05T09:10:00Z',
    created_at: '2026-02-05T09:10:00Z',
  },
  {
    id: 8,
    name: 'Hendra Gunawan',
    email: 'hendra.gunawan@guru.smk.belajar.id',
    role: 'guru',
    email_verified_at: '2026-02-10T13:00:00Z',
    created_at: '2026-02-10T13:00:00Z',
  },
];

// Seed Profiles (Budi & Siti are a 100% two-way match for Guru Kelas!)
// Ahmad & Dewi are a 100% two-way match for Guru Mapel Matematika SMP!
export const INITIAL_PROFILES: TeacherProfile[] = [
  {
    id: 1,
    user_id: 2, // Budi Santoso
    name: 'Budi Santoso, S.Pd.',
    phone: '+6281234567890',
    employment_type: 'PNS',
    school_name: 'SDN Cipayung 01 Pagi',
    school_address: 'Jl. Raya Cipayung No. 12, RT.02/RW.04, Cipayung, Jakarta Timur',
    sudin_id: 10, // JT II
    position: 'guru_kelas',
    level: 'SD',
    subject_id: null,
    province_code: '31',
    regency_code: '31.75',
    regency_name: 'Kota Administrasi Jakarta Timur',
    district_code: '31.75.07',
    district_name: 'Cipayung',
    village_code: '31.75.07.1001',
    village_name: 'Cipayung',
    destination_sudin_id: 7, // JS I (Jakarta Selatan I)
    destination_position: 'guru_kelas',
    destination_levels: ['SD'],
    destinationLevels: [{ level: 'SD' }],
    destination_district_codes: ['31.74.02', '31.74.03'], // Pasar Minggu, Cilandak
    destinationDistricts: [
      { code: '31.74.02', name: 'Pasar Minggu', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
      { code: '31.74.03', name: 'Cilandak', regency_code: '31.74', regency_name: 'Kota Administrasi Jakarta Selatan' },
    ],
    is_mutated: false,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 2,
    user_id: 3, // Siti Nurhaliza
    name: 'Siti Nurhaliza, M.Pd.',
    phone: '+6285712345678',
    employment_type: 'PNS',
    school_name: 'SDN Pasar Minggu 03 Pagi',
    school_address: 'Jl. Pejaten Raya No. 45, Pasar Minggu, Jakarta Selatan',
    sudin_id: 7, // JS I
    position: 'guru_kelas',
    level: 'SD',
    subject_id: null,
    province_code: '31',
    regency_code: '31.74',
    regency_name: 'Kota Administrasi Jakarta Selatan',
    district_code: '31.74.02',
    district_name: 'Pasar Minggu',
    village_code: '31.74.02.1002',
    village_name: 'Pasar Minggu',
    destination_sudin_id: 10, // JT II (Jakarta Timur II)
    destination_position: 'guru_kelas',
    destination_levels: ['SD'],
    destinationLevels: [{ level: 'SD' }],
    destination_district_codes: ['31.75.07', '31.75.08'], // Cipayung, Ciracas
    destinationDistricts: [
      { code: '31.75.07', name: 'Cipayung', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.08', name: 'Ciracas', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
    ],
    is_mutated: false,
    created_at: '2026-01-12T10:30:00Z',
    updated_at: '2026-01-12T10:30:00Z',
  },
  {
    id: 3,
    user_id: 4, // Ahmad Fauzi
    name: 'Ahmad Fauzi, S.Pd.',
    phone: '+6287890123456',
    employment_type: 'PPPK',
    school_name: 'SMPN 111 Jakarta Barat',
    school_address: 'Jl. Bhakti VII No. 1, Kemanggisan, Palmerah, Jakarta Barat',
    sudin_id: 6, // JB II
    position: 'guru_mapel',
    level: 'SMP',
    subject_id: 1, // Matematika
    province_code: '31',
    regency_code: '31.73',
    regency_name: 'Kota Administrasi Jakarta Barat',
    district_code: '31.73.07',
    district_name: 'Palmerah',
    village_code: '31.73.07.1001',
    village_name: 'Kemanggisan',
    destination_sudin_id: 1, // JP I
    destination_position: 'guru_mapel',
    destination_levels: ['SMP'],
    destinationLevels: [{ level: 'SMP' }],
    destination_subject_ids: [1], // Matematika
    destinationSubjects: [{ id: 1, name: 'Matematika' }],
    destination_district_codes: ['31.71.01', '31.71.03'], // Gambir, Kemayoran
    destinationDistricts: [
      { code: '31.71.01', name: 'Gambir', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
      { code: '31.71.03', name: 'Kemayoran', regency_code: '31.71', regency_name: 'Kota Administrasi Jakarta Pusat' },
    ],
    is_mutated: false,
    created_at: '2026-01-15T15:00:00Z',
    updated_at: '2026-01-15T15:00:00Z',
  },
  {
    id: 4,
    user_id: 5, // Dewi Lestari
    name: 'Dewi Lestari, S.Pd.',
    phone: '+6281345678901',
    employment_type: 'PNS',
    school_name: 'SMPN 10 Jakarta Pusat',
    school_address: 'Jl. Sumur Batu No. 2, Kemayoran, Jakarta Pusat',
    sudin_id: 1, // JP I
    position: 'guru_mapel',
    level: 'SMP',
    subject_id: 1, // Matematika
    province_code: '31',
    regency_code: '31.71',
    regency_name: 'Kota Administrasi Jakarta Pusat',
    district_code: '31.71.03',
    district_name: 'Kemayoran',
    village_code: '31.71.03.1002',
    village_name: 'Sumur Batu',
    destination_sudin_id: 6, // JB II
    destination_position: 'guru_mapel',
    destination_levels: ['SMP'],
    destinationLevels: [{ level: 'SMP' }],
    destination_subject_ids: [1], // Matematika
    destinationSubjects: [{ id: 1, name: 'Matematika' }],
    destination_district_codes: ['31.73.07'], // Palmerah
    destinationDistricts: [
      { code: '31.73.07', name: 'Palmerah', regency_code: '31.73', regency_name: 'Kota Administrasi Jakarta Barat' },
    ],
    is_mutated: false,
    created_at: '2026-01-18T12:00:00Z',
    updated_at: '2026-01-18T12:00:00Z',
  },
  {
    id: 5,
    user_id: 6, // Rian Pratama
    name: 'Rian Pratama, S.Pd.',
    phone: '+6289987654321',
    employment_type: 'KKI',
    school_name: 'SMAN 21 Jakarta Timur',
    school_address: 'Jl. Tanah Mas Raya No. 1, Pulogadung, Jakarta Timur',
    sudin_id: 9, // JT I
    position: 'guru_mapel',
    level: 'SMA',
    subject_id: 3, // Bahasa Inggris
    province_code: '31',
    regency_code: '31.75',
    regency_name: 'Kota Administrasi Jakarta Timur',
    district_code: '31.75.04',
    district_name: 'Pulogadung',
    village_code: '31.75.04.1001',
    village_name: 'Kayu Putih',
    destination_sudin_id: 8, // JS II
    destination_position: 'guru_mapel',
    destination_levels: ['SMA', 'SMK'],
    destinationLevels: [{ level: 'SMA' }, { level: 'SMK' }],
    destination_subject_ids: [3],
    destinationSubjects: [{ id: 3, name: 'Bahasa Inggris' }],
    destination_district_codes: [], // Any district in JS II
    destinationDistricts: [],
    is_mutated: false,
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z',
  },
  {
    id: 6,
    user_id: 7, // Endang Kusuma
    name: 'Endang Kusuma, S.Pd.',
    phone: '+6282111223344',
    employment_type: 'PNS',
    school_name: 'SDN Kelapa Gading Barat 01',
    school_address: 'Jl. Raya Boulevard Timur, Kelapa Gading, Jakarta Utara',
    sudin_id: 4, // JU II
    position: 'guru_kelas',
    level: 'SD',
    subject_id: null,
    province_code: '31',
    regency_code: '31.72',
    regency_name: 'Kota Administrasi Jakarta Utara',
    district_code: '31.72.05',
    district_name: 'Kelapa Gading',
    village_code: '31.72.05.1001',
    village_name: 'Kelapa Gading Barat',
    destination_sudin_id: 9, // JT I
    destination_position: 'guru_kelas',
    destination_levels: ['SD'],
    destinationLevels: [{ level: 'SD' }],
    destination_district_codes: ['31.75.03', '31.75.04'], // Duren Sawit, Pulogadung
    destinationDistricts: [
      { code: '31.75.03', name: 'Duren Sawit', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
      { code: '31.75.04', name: 'Pulogadung', regency_code: '31.75', regency_name: 'Kota Administrasi Jakarta Timur' },
    ],
    is_mutated: true, // Marked mutated for testing deletion request!
    deletion_request_status: 'pending',
    deletion_request_id: 1,
    created_at: '2026-02-05T09:30:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 7,
    user_id: 8, // Hendra Gunawan
    name: 'Hendra Gunawan, S.Kom.',
    phone: '+6285299887766',
    employment_type: 'PPPK',
    school_name: 'SMKN 26 Jakarta Timur',
    school_address: 'Jl. Balai Pustaka Baru I, Rawamangun, Pulogadung, Jakarta Timur',
    sudin_id: 9, // JT I
    position: 'guru_mapel',
    level: 'SMK',
    subject_id: 9, // Informatika
    province_code: '31',
    regency_code: '31.75',
    regency_name: 'Kota Administrasi Jakarta Timur',
    district_code: '31.75.04',
    district_name: 'Pulogadung',
    village_code: '31.75.04.1002',
    village_name: 'Rawamangun',
    destination_sudin_id: 1, // JP I
    destination_position: 'guru_mapel',
    destination_levels: ['SMK', 'SMA'],
    destinationLevels: [{ level: 'SMK' }, { level: 'SMA' }],
    destination_subject_ids: [9],
    destinationSubjects: [{ id: 9, name: 'Informatika' }],
    destination_district_codes: [],
    destinationDistricts: [],
    is_mutated: false,
    created_at: '2026-02-10T13:30:00Z',
    updated_at: '2026-02-10T13:30:00Z',
  },
];

export const INITIAL_DELETION_REQUESTS: DeletionRequest[] = [
  {
    id: 1,
    user_id: 7,
    user_name: 'Endang Kusuma, S.Pd.',
    user_email: 'endang.kusuma@guru.sd.belajar.id',
    teacher_profile_id: 6,
    school_name: 'SDN Kelapa Gading Barat 01',
    sudin_name: 'Sudin Pendidikan Jakarta Utara Wilayah II (JU II)',
    status: 'pending',
    requested_at: '2026-02-16T10:30:00Z',
  },
];

export const INITIAL_MATCH_PAIRS: MatchNotificationPair[] = [
  {
    id: 101,
    teacher_a: INITIAL_PROFILES[0], // Budi Santoso
    teacher_b: INITIAL_PROFILES[1], // Siti Nurhaliza
    status: 'pending',
    scanned_at: '2026-02-18T08:00:00Z',
  },
  {
    id: 102,
    teacher_a: INITIAL_PROFILES[2], // Ahmad Fauzi
    teacher_b: INITIAL_PROFILES[3], // Dewi Lestari
    status: 'pending',
    scanned_at: '2026-02-18T08:00:00Z',
  },
];
