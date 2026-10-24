/**
 * Type definitions for Ruang Tukar Guru DKI Jakarta
 * Conforming to API documentation API_24e1f6c8.md
 */

export type Role = 'guru' | 'admin';
export type Ability = 'guru' | 'admin';

export type EmploymentType = 'PNS' | 'PPPK' | 'KKI';
export type Position = 'guru_kelas' | 'guru_mapel';
export type Level = 'SD' | 'SMP' | 'SMA' | 'SMK';

export interface District {
  code: string; // e.g. "31.75.07"
  name: string; // e.g. "Cipayung"
  regency_code: string; // e.g. "31.75"
  regency_name: string; // e.g. "Kota Administrasi Jakarta Timur"
}

export interface Village {
  code: string; // e.g. "31.75.07.1001"
  name: string; // e.g. "Cipayung"
  district_code?: string;
}

export interface Sudin {
  id: number;
  name: string;
  abbreviation: string; // e.g. "JT II", "JP I"
  districts: District[];
}

export interface Subject {
  id: number;
  name: string;
}

export interface DestinationLevelItem {
  id?: number;
  level: Level;
}

export interface TeacherProfile {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  employment_type: EmploymentType;
  school_name: string;
  school_address: string;
  
  // Origin
  sudin_id: number;
  sudin?: Sudin;
  position: Position;
  level: Level;
  subject_id?: number | null;
  subject?: Subject | null;
  province_code: '31';
  regency_code: string;
  regency_name: string;
  district_code: string;
  district_name: string;
  village_code: string;
  village_name: string;

  // Destination Preference
  destination_sudin_id: number;
  destinationSudin?: Sudin;
  destination_position: Position;
  destination_levels: Level[];
  destinationLevels?: DestinationLevelItem[];
  destination_subject_ids?: number[];
  destinationSubjects?: Subject[];
  destination_district_codes?: string[];
  destinationDistricts?: District[];

  // Mutation status & deletion
  is_mutated: boolean;
  deletion_request_status?: 'pending' | 'approved' | 'rejected' | null;
  deletion_request_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  email_verified_at: string | null;
  created_at: string;
  profile?: TeacherProfile | null;
}

export interface AuthSession {
  token: string;
  token_type: 'Bearer';
  abilities: Ability[];
  expires_at: string;
  user: User;
}

export interface ProfileInput {
  name: string;
  phone: string;
  employment_type: EmploymentType;
  school_name: string;
  school_address: string;
  sudin_id: number;
  position: Position;
  level: Level;
  subject_id?: number | null;
  destination_position: Position;
  destination_levels: Level[];
  destination_subject_ids?: number[];
  destination_sudin_id: number;
  destination_district_codes?: string[];
  province_code: '31';
  regency_code: string;
  regency_name: string;
  district_code: string;
  district_name: string;
  village_code: string;
  village_name: string;
}

export interface TwoWayMatch {
  id: number;
  partner: TeacherProfile;
  matchScore: number;
  matchReason: string;
  isOriginDistrictMatched: boolean;
  isDestinationDistrictMatched: boolean;
}

export interface DeletionRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  teacher_profile_id: number;
  school_name: string;
  sudin_name: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface MatchNotificationPair {
  id: number;
  teacher_a: TeacherProfile;
  teacher_b: TeacherProfile;
  status: 'pending' | 'sent';
  scanned_at: string;
  sent_at?: string | null;
}
