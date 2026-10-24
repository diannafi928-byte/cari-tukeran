import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import {
  ArrowLeftRight,
  BookOpenCheck,
  ContactRound,
  GraduationCap,
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
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setCurrentUser(api.getActiveUser());
    };
    update();
    const unsub = api.subscribe(update);
    return unsub;
  }, []);

  useEffect(() => {
    if (!showUserMenu) return;

    const closeOnOutsideInteraction = (event: Event) => {
      if (event.target instanceof Node && !userMenuRef.current?.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideInteraction, true);
    document.addEventListener('click', closeOnOutsideInteraction, true);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideInteraction, true);
      document.removeEventListener('click', closeOnOutsideInteraction, true);
    };
  }, [showUserMenu]);

  const handleLogoutClick = async () => {
    setShowUserMenu(false);
    await api.logout();
    onLogout();
  };

  const myProfile = api.getProfile().data;

  return (
    <header className="brand-header text-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onSelectTab('matches')}
          >
            <div className="brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
              <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Cari Tukeran Guru
                </span>
                <span className="brand-badge text-[10px] font-bold px-2 py-0.5 rounded">
                  DKI JAKARTA
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onSelectTab('directory')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentTab === 'directory'
                  ? 'bg-slate-800 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Daftar Guru</span>
            </button>

            <button
              onClick={() => onSelectTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentTab === 'matches'
                  ? 'bg-slate-800 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Cari Tukeran</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${
                currentTab === 'profile'
                  ? 'bg-slate-800 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ContactRound className="w-4 h-4" />
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs">
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
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
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
          onClick={() => onSelectTab('directory')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            currentTab === 'directory' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Daftar Guru</span>
        </button>
        <button
          onClick={() => onSelectTab('matches')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            currentTab === 'matches' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Cari Tukeran</span>
        </button>
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${
            currentTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ContactRound className="w-4 h-4" />
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
