import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, User, X, Check, Mail, Sparkles, ArrowRight } from 'lucide-react';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

// Google 4-color G SVG icon
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'student'
}) => {
  const { loginWithGoogle } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');

  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  if (!isOpen) return null;

  const handleSelectAccount = (name: string, email: string, avatarUrl?: string) => {
    loginWithGoogle({
      name,
      email,
      avatarUrl,
      role: selectedRole
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    if (!customName.trim()) {
      setCustomError('Please enter your full name.');
      return;
    }
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setCustomError('Please enter a valid Google email address.');
      return;
    }

    loginWithGoogle({
      name: customName.trim(),
      email: customEmail.trim(),
      role: selectedRole
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <GoogleIcon className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sign in with Google</h3>
              <p className="text-[11px] text-slate-500">to continue to Scholarship Management System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Log in as:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-purple-600 bg-purple-50 text-purple-800 ring-2 ring-purple-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          {/* Account Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Choose an account
            </div>

            {/* Primary Google Account from active session */}
            <button
              type="button"
              onClick={() =>
                handleSelectAccount(
                  'Sridhar Selva',
                  'sridhar.selva38@gmail.com',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                )
              }
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  S
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Sridhar Selva
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    sridhar.selva38@gmail.com
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                Active Session
              </span>
            </button>

            {/* Secondary Academic Google Workspace Account */}
            <button
              type="button"
              onClick={() =>
                handleSelectAccount(
                  'Rahul Sharma',
                  'rahul.sharma@college.edu'
                )
              }
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  R
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Rahul Sharma
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    rahul.sharma@college.edu
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
                Google Workspace
              </span>
            </button>

            {/* Use Another Account Toggle */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Use another Google account</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">Enter Google Account Details</div>
                {customError && (
                  <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {customError}
                  </div>
                )}
                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-0.5">Google Email Address</label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    placeholder="e.g. ananya.roy@gmail.com"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Privacy footer */}
          <div className="pt-2 text-[10px] text-slate-400 text-center leading-relaxed">
            By continuing, Google will share your name, email address, and profile picture with Scholarship Management System.
          </div>
        </div>
      </div>
    </div>
  );
};
