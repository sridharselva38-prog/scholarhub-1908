import React from 'react';
import { Scholarship } from '../../types';
import { X, Calendar, Building, FileCheck, IndianRupee, Award, ArrowRight } from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onCheckEligibility: (scholarship: Scholarship) => void;
  onApply: (scholarship: Scholarship) => void;
  hasApplied?: boolean;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onCheckEligibility,
  onApply,
  hasApplied = false
}) => {
  if (!scholarship) return null;

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {scholarship.category}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{scholarship.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Provider & Amount Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-500 block">Sponsoring Body / Provider</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Building className="w-4 h-4 text-slate-400" />
                {scholarship.provider}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Financial Assistance</span>
              <span className="text-lg font-extrabold text-blue-700">
                {formatINR(scholarship.amount)}
                <span className="text-xs text-slate-500 font-normal"> / academic year</span>
              </span>
            </div>
          </div>

          {/* Scheme Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Scheme Description & Scope
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed">
              {scholarship.description || 'No detailed description specified for this scheme.'}
            </p>
          </div>

          {/* Eligibility Criteria Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Statutory Eligibility Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Academic Merit Threshold:</span>
                <span className="font-bold text-slate-900">Minimum {scholarship.minimumPercentage}% or equivalent CGPA</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Family Annual Income Ceiling:</span>
                <span className="font-bold text-slate-900">Up to {formatINR(scholarship.maximumIncome)}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Eligible Degree / Courses:</span>
                <span className="font-bold text-slate-900">{scholarship.eligibleCourse.join(', ')}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Gender Eligibility:</span>
                <span className="font-bold text-slate-900">{scholarship.genderEligibility}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Eligible Years of Study:</span>
                <span className="font-bold text-slate-900">{scholarship.eligibleYear.join(', ')}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">State Domicile:</span>
                <span className="font-bold text-slate-900">{scholarship.eligibleState.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mandatory Documents for Upload
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scholarship.requiredDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Application Window Open:</span>
              <div className="font-semibold text-slate-800">{scholarship.startDate}</div>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Closing Deadline:</span>
              <div className="font-bold text-red-700">{scholarship.endDate}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onCheckEligibility(scholarship);
            }}
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Check Automatic Eligibility
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
            >
              Close
            </button>

            {hasApplied ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                Already Applied
              </span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onApply(scholarship);
                }}
                disabled={scholarship.status !== 'Active'}
                className={`px-5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                  scholarship.status === 'Active'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
