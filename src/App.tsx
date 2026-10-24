import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Header } from './components/Header';
import { TeacherDirectory } from './components/TeacherDirectory';
import { DashboardMatches } from './components/DashboardMatches';
import { ProfileEdit } from './components/ProfileEdit';
import { AdminPanel } from './components/AdminPanel';
import { ApiConsole } from './components/ApiConsole';
import { RegisterView } from './components/RegisterView';
import { LoginView } from './components/LoginView';

export default function App() {
  const [currentUser, setCurrentUser] = useState(api.getActiveUser());
  const [currentTab, setCurrentTab] = useState<string>(
    api.getActiveUser() ? 'directory' : 'login'
  );

  useEffect(() => {
    const update = () => {
      const activeUser = api.getActiveUser();
      setCurrentUser(activeUser);
      if (!activeUser && currentTab !== 'register') {
        setCurrentTab('login');
      }
    };
    update();
    const unsub = api.subscribe(update);
    return unsub;
  }, [currentTab]);

  const handleAuthSuccess = () => {
    setCurrentTab('directory');
  };

  const handleLogout = () => {
    setCurrentTab('login');
  };

  const isAuthPage = currentTab === 'login' || currentTab === 'register' || !currentUser;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar is strictly NOT displayed on login or register pages */}
      {!isAuthPage && (
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onLogout={handleLogout}
        />
      )}

      <div className="flex-1">
        {currentTab === 'login' && (
          <LoginView
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterView
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setCurrentTab('login')}
          />
        )}

        {!isAuthPage && currentTab === 'directory' && (
          <TeacherDirectory
            onNavigateToProfile={() => setCurrentTab('profile')}
            onNavigateToMatches={() => setCurrentTab('matches')}
          />
        )}

        {!isAuthPage && currentTab === 'matches' && (
          <DashboardMatches onNavigateToProfile={() => setCurrentTab('profile')} />
        )}

        {!isAuthPage && currentTab === 'profile' && (
          <ProfileEdit onSaved={() => setCurrentTab('matches')} />
        )}

        {!isAuthPage && currentTab === 'admin' && <AdminPanel />}

        {!isAuthPage && currentTab === 'api' && <ApiConsole />}
      </div>
    </div>
  );
}
