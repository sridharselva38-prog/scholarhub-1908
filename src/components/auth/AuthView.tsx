import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { GoogleLoginButton } from './GoogleLoginButton';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { login, registerStudent, loginAsDemoStudent, loginAsDemoAdmin } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginRole, setLoginRole] = useState<UserRole>('student');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    state: '',
    district: '',
    college: '',
    course: '',
    yearOfStudy: '1st Year'
  });
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    const res = login(loginEmail, loginPassword, loginRole);
    if (!res.success) {
      setLoginError(res.error || 'Login failed. Please verify your credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    // Validation
    if (!regData.name.trim()) return setRegError('Please enter your full name.');
    if (!regData.email.trim() || !regData.email.includes('@')) return setRegError('Please enter a valid email address.');
    if (!regData.mobile.trim() || regData.mobile.length < 10) return setRegError('Please enter a valid 10-digit mobile number.');
    if (regData.password.length < 6) return setRegError('Password must be at least 6 characters long.');
    if (regData.password !== regData.confirmPassword) return setRegError('Passwords do not match. Please re-check.');
    if (!regData.dateOfBirth) return setRegError('Please select your Date of Birth.');
    if (!regData.state.trim()) return setRegError('State is required.');
    if (!regData.district.trim()) return setRegError('District is required.');
    if (!regData.college.trim()) return setRegError('College name is required.');
    if (!regData.course.trim()) return setRegError('Course is required.');

    const res = registerStudent(regData);
    if (!res.success) {
      setRegError(res.error || 'Registration could not be completed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Top brand hero card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-md mb-4">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scholarship Management System
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Official Higher Education Portal for Scholarship Discovery, Automatic Eligibility & Document Verification
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Main Top Tab: Login vs Register */}
          <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
            <button
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => {
                setMode('register');
                setRegError('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Student Registration
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {mode === 'login' ? (
              /* LOGIN FORM */
              <div>
                {/* Role Switcher */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Your Portal Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLoginRole('student')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-sm font-semibold transition-all cursor-pointer ${
                        loginRole === 'student'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-800 ring-2 ring-blue-600/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Student Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('admin')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-sm font-semibold transition-all cursor-pointer ${
                        loginRole === 'admin'
                          ? 'border-purple-600 bg-purple-50/60 text-purple-800 ring-2 ring-purple-600/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Login</span>
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Google Sign-in action */}
                <div className="mb-5">
                  <GoogleLoginButton role={loginRole} text="continue_with" />
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
                      Or continue with credentials
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder={loginRole === 'student' ? 'e.g. rahul.sharma@college.edu' : 'e.g. admin@scholarships.gov.in'}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <span className="text-[11px] text-slate-400">Never share your password</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Login to {loginRole === 'admin' ? 'Admin Portal' : 'Student Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick 1-Click Demo Evaluation Section */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quick Demo Evaluation Logins</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => loginAsDemoStudent('rahul.sharma@college.edu')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all cursor-pointer group"
                    >
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        1-Click: Student (Rahul Sharma)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        B.Tech 3rd Year • 82.5% • Income: ₹3.2L
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={loginAsDemoAdmin}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all cursor-pointer group"
                    >
                      <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                        1-Click: Admin (Dr. Verma)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Scholarship Schemes, Approvals & Verification
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <div>
                <div className="mb-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Student Portal Registration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete your primary credentials to discover and apply for national & state scholarships.
                  </p>
                </div>

                {regError && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                    <span>{regError}</span>
                  </div>
                )}

                {/* Google Sign-up action */}
                <div className="mb-5">
                  <GoogleLoginButton role="student" text="signup_with" />
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
                      Or register with email details
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        value={regData.name}
                        onChange={e => setRegData({ ...regData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={regData.email}
                        onChange={e => setRegData({ ...regData, email: e.target.value })}
                        placeholder="e.g. rahul@college.edu"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={regData.mobile}
                        onChange={e => setRegData({ ...regData, mobile: e.target.value })}
                        placeholder="10-digit number"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={regData.dateOfBirth}
                        onChange={e => setRegData({ ...regData, dateOfBirth: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={regData.gender}
                        onChange={e => setRegData({ ...regData, gender: e.target.value as any })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State (Domicile) *
                      </label>
                      <input
                        type="text"
                        value={regData.state}
                        onChange={e => setRegData({ ...regData, state: e.target.value })}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        District *
                      </label>
                      <input
                        type="text"
                        value={regData.district}
                        onChange={e => setRegData({ ...regData, district: e.target.value })}
                        placeholder="e.g. Pune"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        College Name *
                      </label>
                      <input
                        type="text"
                        value={regData.college}
                        onChange={e => setRegData({ ...regData, college: e.target.value })}
                        placeholder="e.g. PICT"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Course *
                      </label>
                      <input
                        type="text"
                        value={regData.course}
                        onChange={e => setRegData({ ...regData, course: e.target.value })}
                        placeholder="e.g. B.Tech"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Year of Study *
                      </label>
                      <select
                        value={regData.yearOfStudy}
                        onChange={e => setRegData({ ...regData, yearOfStudy: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Final Year">Final Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        value={regData.password}
                        onChange={e => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={regData.confirmPassword}
                        onChange={e => setRegData({ ...regData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Complete Registration & Open Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom security assurance badge */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured with relational integrity constraints and encrypted password hashing</span>
        </div>
      </div>
    </div>
  );
};
