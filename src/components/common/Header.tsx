import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleIcon, GoogleLoginModal } from '../auth/GoogleLoginModal';
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle,
  Clock,
  BookOpen,
  Settings,
  Database,
  Users,
  Code2
} from 'lucide-react';

interface HeaderProps {
  onOpenCodeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCodeModal }) => {
  const {
    currentUser,
    notifications,
    activeTab,
    setActiveTab,
    logout,
    loginAsDemoStudent,
    loginAsDemoAdmin
  } = useApp();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const unreadCount = currentUser
    ? notifications.filter(n => n.userId === currentUser.id && n.status === 'Unread').length
    : 0;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top utility alert bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">National Scholarship Portal (SMS)</span>
          <span className="hidden sm:inline text-slate-400">| Academic Year 2025–2026</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-600/40 rounded text-xs font-medium cursor-pointer transition-colors"
            title="View Python, Java & Relational SQL Backend Source"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Python & Java Architecture</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Demo Switcher</span>
              <span className="text-[10px] text-amber-300 font-mono">▼</span>
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800 p-2 z-50">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
                  Switch Active Role
                </div>
                <button
                  onClick={() => {
                    loginAsDemoStudent('rahul.sharma@college.edu');
                    setShowRoleSwitcher(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Rahul Sharma</div>
                    <div className="text-slate-500 text-[11px]">Student (B.Tech 3rd Yr)</div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">Student</span>
                </button>
                <button
                  onClick={() => {
                    loginAsDemoStudent('priya.patel@engineering.edu');
                    setShowRoleSwitcher(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Priya Patel</div>
                    <div className="text-slate-500 text-[11px]">Student (Approved Grant)</div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">Student</span>
                </button>
                <button
                  onClick={() => {
                    loginAsDemoAdmin();
                    setShowRoleSwitcher(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-slate-100 flex items-center justify-between cursor-pointer border-t border-slate-100 mt-1 pt-1.5"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Dr. Alok Verma</div>
                    <div className="text-slate-500 text-[11px]">Admin (Director of Grants)</div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-medium">Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick(currentUser?.role === 'admin' ? 'admin-dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                Scholarship Management System
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Discovery, Automatic Eligibility & Verification Portal
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentUser?.role === 'student' && (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('scholarships')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'scholarships'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Scholarships
                </button>
                <button
                  onClick={() => handleNavClick('eligibility')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'eligibility'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Eligibility
                </button>
                <button
                  onClick={() => handleNavClick('applications')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Applications
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Profile
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('admin-students')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-students'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => handleNavClick('admin-scholarships')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-scholarships'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Scholarships
                </button>
                <button
                  onClick={() => handleNavClick('admin-applications')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-applications'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Applications
                </button>
                <button
                  onClick={() => handleNavClick('admin-documents')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-documents'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => handleNavClick('admin-reports')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-reports'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => handleNavClick('admin-settings')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-settings'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Settings
                </button>
              </>
            )}
          </nav>

          {/* Right Actions: Notifications & Profile/Logout */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin-notifications' : 'notifications')}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                        currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                      }`}
                    >
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center justify-end gap-1.5">
                      <span>{currentUser.name}</span>
                      {currentUser.authProvider === 'google' && (
                        <span title="Signed in with Google" className="inline-flex">
                          <GoogleIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 capitalize">
                      {currentUser.role === 'admin' ? 'Grants Administrator' : 'Verified Student'}
                    </div>
                  </div>

                  <span
                    className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {currentUser.role}
                  </span>

                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGoogleModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs flex items-center gap-2 cursor-pointer"
                  title="Sign in with Google"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Google Login</span>
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        {currentUser && (
          <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs">
            {currentUser.role === 'student' ? (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('scholarships')}
                  className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'scholarships' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Scholarships
                </button>
                <button
                  onClick={() => handleNavClick('eligibility')}
                  className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'eligibility' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Eligibility
                </button>
                <button
                  onClick={() => handleNavClick('applications')}
                  className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'applications' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Applications
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin-dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('admin-students')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin-students' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Students
                </button>
                <button
                  onClick={() => handleNavClick('admin-scholarships')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin-scholarships' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Scholarships
                </button>
                <button
                  onClick={() => handleNavClick('admin-applications')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin-applications' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Applications
                </button>
                <button
                  onClick={() => handleNavClick('admin-documents')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin-documents' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Documents
                </button>
                <button
                  onClick={() => handleNavClick('admin-reports')}
                  className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin-reports' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Reports
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <GoogleLoginModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </header>
  );
};
