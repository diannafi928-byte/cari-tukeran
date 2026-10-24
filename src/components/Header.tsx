import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import {
  Compass,
  UserCheck,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(api.getActiveUser());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      setCurrentUser(api.getActiveUser());
    };
    update();
    const unsub = api.subscribe(update);
    return unsub;
  }, []);

  const handleLogoutClick = async () => {
    setShowUserMenu(false);
    await api.logout();
    onLogout();
  };

  const myProfile = api.getProfile().data;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onSelectTab('matches')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md border border-emerald-500/30 shrink-0">
              <svg
                className="w-5 h-5 text-emerald-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h16" />
                <path d="m15 4 4 4-4 4" />
                <path d="M21 16H5" />
                <path d="m9 12-4 4 4 4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Ruang Tukar Guru
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  DKI JAKARTA
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onSelectTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentTab === 'matches'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Cari Tukeran</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentTab === 'profile'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profil Mutasi</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                  currentTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-amber-300/80 hover:text-amber-200 hover:bg-slate-800/60'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Panel Admin</span>
              </button>
            )}

  
          </nav>

          {/* User Account / Profile Dropdown */}
          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="font-semibold text-white leading-tight truncate max-w-[140px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {currentUser.role === 'admin'
                        ? 'Administrator'
                        : myProfile?.employment_type || 'Guru'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold text-slate-800 text-sm truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      {myProfile && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {myProfile.position === 'guru_kelas' ? 'Guru Kelas' : 'Guru Mapel'}
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                            {myProfile.sudin?.abbreviation || 'Sudin DKI'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 px-1">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-md font-medium flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar (Logout)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 py-2 px-1 text-xs">
        <button
          onClick={() => onSelectTab('matches')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            currentTab === 'matches' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Cari Tukeran</span>
        </button>
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            currentTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profil</span>
        </button>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => onSelectTab('admin')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
              currentTab === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-500/70'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
