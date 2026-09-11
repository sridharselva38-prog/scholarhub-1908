import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scholarship } from '../../types';
import { ScholarshipCard } from './ScholarshipCard';
import { checkScholarshipEligibility } from '../../services/eligibilityService';
import {
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  FileText,
  UserCheck,
  AlertCircle,
  Bell,
  ChevronRight
} from 'lucide-react';

interface StudentHomeViewProps {
  onViewDetails: (s: Scholarship) => void;
  onCheckEligibility: (s: Scholarship) => void;
  onApply: (s: Scholarship) => void;
}

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  onViewDetails,
  onCheckEligibility,
  onApply
}) => {
  const {
    currentUser,
    currentStudentProfile,
    currentAcademicDetails,
    currentFamilyDetails,
    scholarships,
    applications,
    notifications,
    setActiveTab
  } = useApp();

  // Calculate Profile Completion %
  const calculateProfileCompletion = () => {
    let score = 0;
    let total = 8;
    if (currentUser?.name && currentUser?.email) score += 2;
    if (currentStudentProfile?.college && currentStudentProfile?.course) score += 2;
    if (currentStudentProfile?.state && currentStudentProfile?.dateOfBirth) score += 1;
    if (currentAcademicDetails && currentAcademicDetails.percentage > 0) score += 2;
    if (currentFamilyDetails && currentFamilyDetails.familyIncome > 0) score += 1;
    return Math.round((score / total) * 100);
  };

  const profilePercent = calculateProfileCompletion();

  // Statistics
  const availableCount = scholarships.filter(s => s.status === 'Active').length;
  const eligibleCount = scholarships.filter(
    s =>
      s.status === 'Active' &&
      checkScholarshipEligibility(
        s,
        currentStudentProfile,
        currentAcademicDetails,
        currentFamilyDetails
      ).eligible
  ).length;

  const myApps = currentStudentProfile
    ? applications.filter(a => a.studentId === currentStudentProfile.studentId)
    : [];
  const appliedCount = myApps.length;
  const pendingCount = myApps.filter(a => ['Submitted', 'Under Review', 'Documents Pending'].includes(a.status)).length;
  const approvedCount = myApps.filter(a => a.status === 'Approved').length;

  const activeScholarships = scholarships.filter(s => s.status === 'Active').slice(0, 3);
  const studentNotifs = currentUser
    ? notifications.filter(n => n.userId === currentUser.id).slice(0, 3)
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>National Higher Education Scholarship Gateway</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find the Right Scholarship for Your Education
          </h1>

          <p className="mt-3 text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            Discover scholarships, check your eligibility, and track your application in one place.
          </p>

          {/* Quick Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('scholarships')}
              className="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Find Scholarship</span>
            </button>

            <button
              onClick={() => setActiveTab('eligibility')}
              className="px-5 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/40 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>Check Eligibility</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className="px-5 py-2.5 bg-slate-900/60 hover:bg-slate-900 text-slate-100 border border-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>My Applications</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* WELCOME & PROFILE COMPLETION BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Welcome, {currentUser?.name || 'Student'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {currentStudentProfile?.college ? `${currentStudentProfile.college} • ${currentStudentProfile.course}` : 'Student Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your academic percentage and income details to receive tailored scheme recommendations.
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div className="w-full md:w-72 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Profile Completion</span>
            <span className="text-xs font-extrabold text-blue-700">{profilePercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                profilePercent >= 80 ? 'bg-emerald-500' : profilePercent >= 50 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${profilePercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              {profilePercent === 100 ? 'All Details Complete' : 'Additional info needed'}
            </span>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Update Profile →
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Available</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{availableCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active Schemes</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Eligible</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{eligibleCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Matching your profile</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Applied</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{appliedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Submissions made</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{pendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">In verification</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Approved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{approvedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Disbursed grants</div>
        </div>
      </div>

      {/* FEATURED SCHOLARSHIPS CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Featured Active Scholarships</h3>
            <p className="text-xs text-slate-500">Government and Institutional schemes currently accepting student applications</p>
          </div>
          <button
            onClick={() => setActiveTab('scholarships')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Schemes ({scholarships.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeScholarships.map(s => {
            const hasApplied = myApps.some(a => a.scholarshipId === s.id);
            return (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                onViewDetails={onViewDetails}
                onCheckEligibility={onCheckEligibility}
                onApply={onApply}
                hasApplied={hasApplied}
              />
            );
          })}
        </div>
      </div>

      {/* RECENT NOTIFICATIONS PREVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Alerts & Updates</h3>
          </div>
          <button
            onClick={() => setActiveTab('notifications')}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            View All Notifications
          </button>
        </div>

        {studentNotifs.length === 0 ? (
          <div className="text-xs text-slate-400 py-3 text-center">No notifications at this time.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {studentNotifs.map(n => (
              <div key={n.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    {n.status === 'Unread' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                    <span>{n.title}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
