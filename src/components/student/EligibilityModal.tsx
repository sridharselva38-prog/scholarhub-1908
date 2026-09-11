import React from 'react';
import { Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { checkScholarshipEligibility } from '../../services/eligibilityService';
import { X, CheckCircle2, XCircle, AlertTriangle, ArrowRight, User } from 'lucide-react';

interface EligibilityModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onApply: (scholarship: Scholarship) => void;
  hasApplied?: boolean;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  scholarship,
  onClose,
  onApply,
  hasApplied = false
}) => {
  const { currentStudentProfile, currentAcademicDetails, currentFamilyDetails, setActiveTab } = useApp();

  if (!scholarship) return null;

  const result = checkScholarshipEligibility(
    scholarship,
    currentStudentProfile,
    currentAcademicDetails,
    currentFamilyDetails
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Module 5: Automated Eligibility Check
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Eligibility Assessment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500">Evaluating for Scheme:</div>
            <div className="text-sm font-bold text-slate-900">{scholarship.name}</div>
            <div className="text-xs text-blue-600 font-semibold mt-0.5">
              Grant: ₹{scholarship.amount.toLocaleString()} / year
            </div>
          </div>

          {/* Primary Assessment Verdict Banner */}
          {result.eligible ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-emerald-900">
                  Congratulations! You are eligible for this scholarship.
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  Your academic marks, family income threshold, and course criteria satisfy all statutory scheme requirements.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-red-900">
                  Sorry, you are not eligible for this scholarship.
                </div>
                <p className="text-xs text-red-700 mt-1">
                  Please review the specific rejection reasons identified by the automated system below:
                </p>
              </div>
            </div>
          )}

          {/* Rejection Reasons (if any) */}
          {result.reasons.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Eligibility Discrepancies ({result.reasons.length})</span>
              </h4>
              <ul className="space-y-1.5">
                {result.reasons.map((reason, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 bg-red-50/70 border border-red-100 rounded-lg text-xs text-red-800 flex items-start gap-2"
                  >
                    <span className="text-red-500 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Satisfied Criteria */}
          {result.matchedCriteria.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Satisfied Criteria ({result.matchedCriteria.length})</span>
              </h4>
              <ul className="space-y-1.5">
                {result.matchedCriteria.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-emerald-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile missing details notice */}
          {(!currentAcademicDetails || !currentFamilyDetails) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
              <span>Your profile is missing academic or family details.</span>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('profile');
                }}
                className="font-bold underline cursor-pointer"
              >
                Complete Profile
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
          >
            Close
          </button>

          {result.eligible && !hasApplied && (
            <button
              onClick={() => {
                onClose();
                onApply(scholarship);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {hasApplied && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              Application Already Submitted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
