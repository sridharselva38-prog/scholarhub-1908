import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Upload,
  Building,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';

export const ApplicationTrackingView: React.FC = () => {
  const {
    currentUser,
    currentStudentProfile,
    applications,
    scholarships,
    documents,
    uploadDocumentForApplication,
    setActiveTab
  } = useApp();

  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [reuploadDocType, setReuploadDocType] = useState<string>('Bonafide Certificate');

  const myApplications = currentStudentProfile
    ? applications.filter(a => a.studentId === currentStudentProfile.studentId)
    : [];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Documents Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Verified':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const renderTimeline = (app: Application) => {
    const isRejected = app.status === 'Rejected';

    if (isRejected) {
      return (
        <div className="py-4">
          <div className="flex items-center justify-between relative max-w-lg mx-auto">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-red-200 z-0" />

            {/* Step 1: Submitted */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5">Submitted</span>
              <span className="text-[9px] text-slate-400">{app.applicationDate}</span>
            </div>

            {/* Step 2: Under Review */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5">Under Review</span>
              <span className="text-[9px] text-slate-400">Reviewed</span>
            </div>

            {/* Step 3: Rejected */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✕
              </div>
              <span className="text-[11px] font-bold text-red-700 mt-1.5">Rejected</span>
              <span className="text-[9px] text-red-500">{app.lastUpdated}</span>
            </div>
          </div>

          {/* Rejection Notice Card */}
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-red-900">
                Application Rejection Reason
              </div>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {app.rejectionReason || app.remarks || 'Application did not fulfill criteria or document discrepancy detected.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Normal Positive Timeline:
    // Submitted -> Under Review -> Document Verification -> Approved
    const steps = [
      { key: 'Submitted', label: 'Submitted' },
      { key: 'Under Review', label: 'Under Review' },
      { key: 'Verified', label: 'Document Verification' },
      { key: 'Approved', label: 'Approved' }
    ];

    const getStepStatus = (stepKey: string) => {
      const order = ['Submitted', 'Under Review', 'Verified', 'Approved'];
      const currentIdx = order.indexOf(
        app.status === 'Documents Pending' ? 'Under Review' : app.status
      );
      const stepIdx = order.indexOf(stepKey);

      if (stepIdx < currentIdx) return 'completed';
      if (stepIdx === currentIdx) return 'current';
      return 'upcoming';
    };

    return (
      <div className="py-4">
        <div className="flex items-center justify-between relative max-w-xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />

          {steps.map((s, idx) => {
            const status = getStepStatus(s.key);
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    status === 'completed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : status === 'current'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {status === 'completed' ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 max-w-[90px] leading-tight ${
                    status === 'current' ? 'text-blue-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  {s.label}
                </span>
                {status === 'current' && (
                  <span className="text-[9px] text-blue-600 font-bold uppercase mt-0.5">
                    In Progress
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {app.status === 'Documents Pending' && (
          <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Action Required:</strong> Documents Pending verification or clarification. Please re-upload required documents below.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSimulateReupload = (appId: string) => {
    const fileName = `Corrected_${reuploadDocType.replace(/\s+/g, '_')}.pdf`;
    uploadDocumentForApplication(appId, reuploadDocType, fileName, '1.2 MB');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Module 8: Real-Time Application Tracking</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Tracking & Milestones
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your submitted scholarship proposals, officer verification notes, and grant disbursement milestones
        </p>
      </div>

      {myApplications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You have not applied for any scholarships yet. Explore active schemes and check your automated eligibility.
          </p>
          <button
            onClick={() => setActiveTab('scholarships')}
            className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            Browse Available Scholarships
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map(app => {
            const sch = scholarships.find(s => s.id === app.scholarshipId);
            const appDocs = documents.filter(d => d.applicationId === app.id);
            const isExpanded = expandedAppId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Summary Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                          {app.id}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        {sch?.name || 'Scholarship Scheme'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span>Application Date: {app.applicationDate}</span>
                        <span>•</span>
                        <span>Last Updated: {app.lastUpdated}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Scheme Grant</div>
                      <div className="text-lg font-extrabold text-slate-900">
                        ₹{(sch?.amount || 0).toLocaleString()}
                        <span className="text-xs text-slate-500 font-normal"> / yr</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline Component */}
                  <div className="pt-2 border-t border-slate-100">
                    {renderTimeline(app)}
                  </div>

                  {/* Officer Remarks Strip */}
                  {app.remarks && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Administrative Officer Note: </span>
                      {app.remarks}
                    </div>
                  )}

                  {/* Expand / Collapse Details Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Submission Details' : 'View Submission & Uploaded Documents'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {appDocs.length} Attached Document{appDocs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-200 space-y-4 text-xs">
                    {/* Bank Details Review */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Registered Bank Account (Direct Benefit Transfer)</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Account Holder:</span>
                          <span className="font-semibold text-slate-800">{app.bankDetails.accountHolderName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Bank:</span>
                          <span className="font-semibold text-slate-800">{app.bankDetails.bankName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Account No:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {app.bankDetails.accountNumber ? `••••${app.bankDetails.accountNumber.slice(-4)}` : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                          <span className="font-mono font-semibold text-slate-800">{app.bankDetails.ifscCode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attached Documents Table */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <h4 className="font-bold text-slate-900 mb-2">
                        Uploaded Verification Documents
                      </h4>
                      {appDocs.length === 0 ? (
                        <div className="text-slate-400 text-xs py-2">No documents attached.</div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {appDocs.map(doc => (
                            <div key={doc.id} className="py-2.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="font-semibold text-slate-800">{doc.documentType}</div>
                                  <span className="text-[10px] text-slate-400">
                                    {doc.fileName} • {doc.fileSize}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    doc.verificationStatus === 'Verified'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : doc.verificationStatus === 'Rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {doc.verificationStatus}
                                </span>
                                {doc.remarks && (
                                  <span className="text-[10px] text-slate-500 italic max-w-xs truncate hidden sm:block">
                                    Note: {doc.remarks}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Re-upload simulation for corrections */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={reuploadDocType}
                            onChange={e => setReuploadDocType(e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1"
                          >
                            <option value="Income Certificate">Income Certificate</option>
                            <option value="Bonafide Certificate">Bonafide Certificate</option>
                            <option value="12th Marksheet">12th Marksheet</option>
                            <option value="College ID">College ID</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleSimulateReupload(app.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Document Copy</span>
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Re-uploaded documents notify verification officers immediately
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
