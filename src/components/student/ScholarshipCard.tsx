import React from 'react';
import { Scholarship } from '../../types';
import { Calendar, Award, Building, IndianRupee, CheckCircle2, ArrowRight } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onViewDetails: (scholarship: Scholarship) => void;
  onCheckEligibility: (scholarship: Scholarship) => void;
  onApply: (scholarship: Scholarship) => void;
  hasApplied?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onViewDetails,
  onCheckEligibility,
  onApply,
  hasApplied = false
}) => {
  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

  const getStatusBadge = () => {
    switch (scholarship.status) {
      case 'Active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Active
          </span>
        );
      case 'Upcoming':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Upcoming
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
            {scholarship.category}
          </span>
          {getStatusBadge()}
        </div>

        {/* Title & Provider */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
          {scholarship.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </div>

        {/* Amount Block */}
        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Scholarship Amount
            </span>
            <span className="text-xl font-extrabold text-blue-700">
              {formatINR(scholarship.amount)}
            </span>
            <span className="text-xs text-slate-500 font-normal"> / year</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
              Application Deadline
            </span>
            <span className="text-xs font-semibold text-slate-800 flex items-center justify-end gap-1 mt-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {scholarship.endDate}
            </span>
          </div>
        </div>

        {/* Quick Criteria Highlights */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-2">
          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500">Academic Score:</span>
            <span className="font-semibold text-slate-800">Min {scholarship.minimumPercentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500">Max Family Income:</span>
            <span className="font-semibold text-slate-800">≤ {formatINR(scholarship.maximumIncome)}</span>
          </div>
          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500">Eligible Courses:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[150px]">
              {scholarship.eligibleCourse.join(', ')}
            </span>
          </div>
          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-500">Gender Eligibility:</span>
            <span className="font-semibold text-slate-800">{scholarship.genderEligibility}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 grid grid-cols-3 gap-2">
        <button
          onClick={() => onViewDetails(scholarship)}
          className="py-2 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-center"
        >
          View Details
        </button>

        <button
          onClick={() => onCheckEligibility(scholarship)}
          className="py-2 px-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer text-center"
        >
          Check Eligibility
        </button>

        {hasApplied ? (
          <div className="py-2 px-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Applied</span>
          </div>
        ) : (
          <button
            onClick={() => onApply(scholarship)}
            disabled={scholarship.status !== 'Active'}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              scholarship.status === 'Active'
                ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-xs'
                : 'text-slate-400 bg-slate-200 cursor-not-allowed'
            }`}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};
