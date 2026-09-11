import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scholarship } from '../../types';
import { checkScholarshipEligibility } from '../../services/eligibilityService';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  User,
  GraduationCap
} from 'lucide-react';

interface EligibilityViewProps {
  onApply: (scholarship: Scholarship) => void;
  onViewDetails: (scholarship: Scholarship) => void;
}

export const EligibilityView: React.FC<EligibilityViewProps> = ({ onApply, onViewDetails }) => {
  const {
    scholarships,
    currentStudentProfile,
    currentAcademicDetails,
    currentFamilyDetails,
    applications,
    setActiveTab
  } = useApp();

  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>(
    scholarships[0]?.id || ''
  );

  const selectedScholarship = scholarships.find(s => s.id === selectedScholarshipId) || scholarships[0];

  const singleResult = selectedScholarship
    ? checkScholarshipEligibility(
        selectedScholarship,
        currentStudentProfile,
        currentAcademicDetails,
        currentFamilyDetails
      )
    : null;

  // Run automatic batch evaluation across all scholarships
  const allAssessments = scholarships.map(sch => {
    const result = checkScholarshipEligibility(
      sch,
      currentStudentProfile,
      currentAcademicDetails,
      currentFamilyDetails
    );
    const hasApplied = currentStudentProfile
      ? applications.some(
          a => a.studentId === currentStudentProfile.studentId && a.scholarshipId === sch.id
        )
      : false;
    return {
      scholarship: sch,
      result,
      hasApplied
    };
  });

  const eligibleSchemes = allAssessments.filter(a => a.result.eligible);
  const ineligibleSchemes = allAssessments.filter(a => !a.result.eligible);

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Module 5: Automated Evaluation Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Automatic Scholarship Eligibility Verification
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Our intelligent system evaluates your profile against statutory rules to determine grant qualification instantly.
        </p>
      </div>

      {/* STUDENT CREDENTIAL PROFILE STRIP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Evaluated Student Baseline
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Edit Profile Parameters →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Academic Score:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {currentAcademicDetails?.percentage || 0}%
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Annual Income:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{(currentFamilyDetails?.familyIncome || 0).toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Course:</span>
            <span className="font-bold text-slate-900 truncate block">
              {currentStudentProfile?.course || 'Not specified'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Year of Study:</span>
            <span className="font-bold text-slate-900 truncate block">
              {currentStudentProfile?.yearOfStudy || 'Not specified'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Domicile State:</span>
            <span className="font-bold text-slate-900 truncate block">
              {currentStudentProfile?.state || 'Not specified'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Gender:</span>
            <span className="font-bold text-slate-900 block">
              {currentStudentProfile?.gender || 'Not specified'}
            </span>
          </div>
        </div>
      </div>

      {/* SINGLE SCHOLARSHIP INTERACTIVE TEST BENCH */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Select Scheme to Verify
          </h3>
          <p className="text-xs text-slate-500">
            Pick any scholarship to trigger the automatic comparison algorithm
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedScholarshipId}
            onChange={e => setSelectedScholarshipId(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600/30 bg-white"
          >
            {scholarships.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category}) - ₹{s.amount.toLocaleString()}/yr
              </option>
            ))}
          </select>

          <button
            onClick={() => onViewDetails(selectedScholarship)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer whitespace-nowrap"
          >
            View Scheme Details
          </button>
        </div>

        {/* VERDICT CONTAINER */}
        {singleResult && (
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            {singleResult.eligible ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-base font-bold text-emerald-900">
                      Eligible: Congratulations! You are eligible for this scholarship.
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your profile satisfies all minimum academic score limits, family income caps, and category eligibility rules.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onApply(selectedScholarship)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Apply Now →
                </button>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-base font-bold text-red-900">
                    Not Eligible: Sorry, you are not eligible for this scholarship.
                  </div>
                  <p className="text-xs text-red-700 mt-0.5">
                    The automated check identified one or more criteria that do not match the scheme parameters.
                  </p>
                </div>
              </div>
            )}

            {/* Rejection Reasons Box */}
            {singleResult.reasons.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-red-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Reasons for Non-Eligibility:</span>
                </h4>
                <ul className="space-y-1.5">
                  {singleResult.reasons.map((r, i) => (
                    <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Matched Criteria */}
            {singleResult.matchedCriteria.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Satisfied Conditions:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {singleResult.matchedCriteria.map((m, i) => (
                    <div key={i} className="text-xs text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPLETE PORTAL SCHOLARSHIP ELIGIBILITY MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Complete Eligibility Matrix ({eligibleSchemes.length} of {scholarships.length} Eligible)
          </h3>
          <p className="text-xs text-slate-500">
            Overview of your qualification status for every scholarship currently on the portal
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Scheme Name</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Grant Amount</th>
                <th className="py-2.5 px-3">Academic Req.</th>
                <th className="py-2.5 px-3">Income Cap</th>
                <th className="py-2.5 px-3">Eligibility Verdict</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allAssessments.map(({ scholarship, result, hasApplied }) => (
                <tr key={scholarship.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{scholarship.name}</div>
                    <span className="text-[10px] text-slate-400">{scholarship.category}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{scholarship.provider}</td>
                  <td className="py-3 px-3 font-bold text-blue-700">
                    ₹{scholarship.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-700">Min {scholarship.minimumPercentage}%</td>
                  <td className="py-3 px-3 text-slate-700">≤ ₹{scholarship.maximumIncome.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    {result.eligible ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 font-medium bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        <XCircle className="w-3 h-3 text-red-500" />
                        Not Eligible
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {hasApplied ? (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Applied
                      </span>
                    ) : result.eligible ? (
                      <button
                        onClick={() => onApply(scholarship)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-lg shadow-xs cursor-pointer"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedScholarshipId(scholarship.id);
                          window.scrollTo({ top: 150, behavior: 'smooth' });
                        }}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        View Discrepancy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
