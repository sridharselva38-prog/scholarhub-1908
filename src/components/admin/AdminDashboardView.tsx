import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Building,
  Plus
} from 'lucide-react';

interface AdminDashboardViewProps {
  onAddScholarship: () => void;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onAddScholarship,
  onNavigateTab
}) => {
  const { students, scholarships, applications, users } = useApp();

  // Metric computations
  const totalStudents = students.length;
  const totalScholarships = scholarships.length;
  const activeScholarships = scholarships.filter(s => s.status === 'Active').length;
  const totalApplications = applications.length;

  const pendingApplications = applications.filter(a =>
    ['Submitted', 'Under Review', 'Documents Pending'].includes(a.status)
  ).length;

  const approvedApplications = applications.filter(a => a.status === 'Approved').length;
  const rejectedApplications = applications.filter(a => a.status === 'Rejected').length;

  // Calculate total disbursed amount from approved applications
  const totalDisbursedAmount = applications
    .filter(a => a.status === 'Approved')
    .reduce((acc, app) => {
      const sch = scholarships.find(s => s.id === app.scholarshipId);
      return acc + (sch ? sch.amount : 0);
    }, 0);

  // Check deadline approaching (within next 30 days)
  const today = new Date();
  const approachingDeadlines = scholarships.filter(s => {
    if (s.status !== 'Active') return false;
    const end = new Date(s.endDate);
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md inline-block border border-purple-100 mb-1">
            Module 9: Admin Management System
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Administrative Control Panel
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time analytics, scheme creation, document verification, and sanction tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddScholarship}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Scholarship</span>
          </button>
        </div>
      </div>

      {/* DEADLINE APPROACHING ALERT BANNER */}
      {approachingDeadlines.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Application Deadlines Approaching (Next 30 Days)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {approachingDeadlines.length} scholarship scheme{approachingDeadlines.length > 1 ? 's are' : ' is'} closing soon. Expedite student verification to prevent cutoff lapses.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {approachingDeadlines.map(s => (
                  <span
                    key={s.id}
                    className="text-[11px] bg-white border border-amber-300 text-amber-900 px-2.5 py-0.5 rounded-md font-medium"
                  >
                    {s.name} (Closes: {s.endDate})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE 7 METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Registered Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-1">Verified college profiles</div>
        </div>

        {/* Total Scholarships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Scholarship Schemes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalScholarships}</div>
          <div className="text-[11px] text-slate-500 mt-1">{activeScholarships} currently active</div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Applications Received</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalApplications}</div>
          <div className="text-[11px] text-slate-500 mt-1">Total student submissions</div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Pending Verification</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{pendingApplications}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">Action required</div>
        </div>

        {/* Approved Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Approved Grants</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{approvedApplications}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Eligible & Sanctioned</div>
        </div>

        {/* Rejected Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Rejected Applications</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-600">{rejectedApplications}</div>
          <div className="text-[11px] text-slate-500 mt-1">Ineligible / Discrepancy</div>
        </div>

        {/* Total Disbursed Amount Banner */}
        <div className="bg-linear-to-br from-blue-700 to-indigo-800 text-white p-5 rounded-2xl border border-blue-600 shadow-xs col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Total Sanctioned / Disbursed Amount
            </span>
            <IndianRupee className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">
            {formatINR(totalDisbursedAmount)}
          </div>
          <div className="text-xs text-blue-100 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Benefit Transfer allocations across approved students</span>
          </div>
        </div>
      </div>

      {/* QUICK WORKFLOW SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('admin-applications')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
            Application Verification Queue ({pendingApplications})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Review applicant marks, inspect certificates, approve or reject applications with official remarks.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('admin-scholarships')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
            Manage Schemes & Criteria ({totalScholarships})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Add new scholarship programs, configure cut-off percentages, income ceilings, and upload dates.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('admin-reports')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
            Reports & Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate category-wise, college-wise, and disbursement reports with one-click CSV export.
          </p>
        </div>
      </div>
    </div>
  );
};
