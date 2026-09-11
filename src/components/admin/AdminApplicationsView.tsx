import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus, DocumentRecord } from '../../types';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  CreditCard,
  Building,
  GraduationCap,
  FileCheck,
  Eye,
  Check,
  MessageSquare,
  AlertTriangle,
  Send
} from 'lucide-react';

export const AdminApplicationsView: React.FC = () => {
  const {
    applications,
    scholarships,
    students,
    users,
    academicDetails,
    familyDetails,
    documents,
    updateApplicationStatus,
    updateDocumentStatus
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scholarshipFilter, setScholarshipFilter] = useState('All');

  // Selected application for detailed review modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [officerRemarksInput, setOfficerRemarksInput] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const filteredApplications = applications.filter(app => {
    const student = students.find(s => s.studentId === app.studentId);
    const user = student ? users.find(u => u.id === student.userId) : null;
    const sch = scholarships.find(s => s.id === app.scholarshipId);

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = app.id.toLowerCase().includes(q);
      const matchName = user?.name.toLowerCase().includes(q);
      const matchSch = sch?.name.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchSch) return false;
    }

    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (scholarshipFilter !== 'All' && app.scholarshipId !== scholarshipFilter) return false;

    return true;
  });

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

  const handleAction = (status: ApplicationStatus) => {
    if (!selectedApp) return;

    if (status === 'Rejected' && !rejectReasonInput.trim()) {
      alert('Please provide an official rejection reason.');
      return;
    }

    updateApplicationStatus(
      selectedApp.id,
      status,
      officerRemarksInput || undefined,
      status === 'Rejected' ? rejectReasonInput : undefined
    );

    // Refresh selected app
    const updated = applications.find(a => a.id === selectedApp.id);
    if (updated) {
      setSelectedApp({
        ...updated,
        status,
        remarks: officerRemarksInput || updated.remarks,
        rejectionReason: status === 'Rejected' ? rejectReasonInput : updated.rejectionReason
      });
    }
    setShowRejectBox(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2 border border-purple-100">
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          <span>Module 6 & 7: Verification & Adjudication</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Verification & Sanction Queue
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review student credentials, authenticate supporting documents, approve grants or issue clarification notices
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name or application ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="Verified">Verified</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <span className="text-slate-500 ml-2">Scheme:</span>
          <select
            value={scholarshipFilter}
            onChange={e => setScholarshipFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 max-w-[200px] truncate"
          >
            <option value="All">All Scholarships</option>
            {scholarships.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant Student</th>
                <th className="py-3 px-4">Scheme Applied</th>
                <th className="py-3 px-4">Academic Score</th>
                <th className="py-3 px-4">Family Income</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No applications match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map(app => {
                  const student = students.find(s => s.studentId === app.studentId);
                  const user = student ? users.find(u => u.id === student.userId) : null;
                  const sch = scholarships.find(s => s.id === app.scholarshipId);
                  const acad = student ? academicDetails.find(a => a.studentId === student.studentId) : null;
                  const fam = student ? familyDetails.find(f => f.studentId === student.studentId) : null;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {app.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{user?.name || 'Student'}</div>
                        <div className="text-[10px] text-slate-500">
                          {student?.college} • {student?.course} ({student?.yearOfStudy})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{sch?.name}</div>
                        <div className="text-[10px] text-slate-400">₹{(sch?.amount || 0).toLocaleString()} / yr</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-700">{acad?.percentage || 0}%</span>
                        <span className="text-[10px] text-slate-400 block">Req: Min {sch?.minimumPercentage}%</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">
                          ₹{(fam?.familyIncome || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Cap: ≤ ₹{(sch?.maximumIncome || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {app.applicationDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setOfficerRemarksInput(app.remarks || '');
                            setRejectReasonInput(app.rejectionReason || '');
                            setShowRejectBox(false);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED VERIFICATION MODAL */}
      {selectedApp && (() => {
        const student = students.find(s => s.studentId === selectedApp.studentId);
        const user = student ? users.find(u => u.id === student.userId) : null;
        const sch = scholarships.find(s => s.id === selectedApp.scholarshipId);
        const acad = student ? academicDetails.find(a => a.studentId === student.studentId) : null;
        const fam = student ? familyDetails.find(f => f.studentId === student.studentId) : null;
        const appDocs = documents.filter(d => d.applicationId === selectedApp.id);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                      {selectedApp.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                        selectedApp.status
                      )}`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Application Review: {user?.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Scheme & Student Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Target Scholarship Scheme
                    </span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{sch?.name}</div>
                    <div className="text-blue-700 font-semibold mt-0.5">
                      Grant: ₹{(sch?.amount || 0).toLocaleString()} / yr
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Student Academic Standing
                    </span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {student?.college}
                    </div>
                    <div className="text-slate-600">
                      {student?.course} • {student?.yearOfStudy} • Domicile: {student?.state}
                    </div>
                  </div>
                </div>

                {/* Score vs Cutoff Comparison */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Scored Percentage:</span>
                    <span className="text-base font-extrabold text-emerald-700">
                      {acad?.percentage || 0}%
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Req: Min {sch?.minimumPercentage}%
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Annual Income:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{(fam?.familyIncome || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Cap: ≤ ₹{(sch?.maximumIncome || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Bank Account:</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {selectedApp.bankDetails.bankName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      A/C: ••••{selectedApp.bankDetails.accountNumber.slice(-4)}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                    <span className="font-mono font-bold text-blue-700 block">
                      {selectedApp.bankDetails.ifscCode}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Holder: {selectedApp.bankDetails.accountHolderName}
                    </span>
                  </div>
                </div>

                {/* MODULE 7: Document Verification Section */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>Supporting Document Verification ({appDocs.length} Documents)</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      Authenticate marksheets, certificates and identity proofs
                    </span>
                  </h4>

                  {appDocs.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                      No documents uploaded for this application.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {appDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">{doc.documentType}</div>
                              <div className="text-[10px] text-slate-500">
                                File: <span className="font-mono text-slate-700">{doc.fileName}</span> ({doc.fileSize}) • Path: <code className="text-slate-500">{doc.documentPath}</code>
                              </div>
                              {doc.remarks && (
                                <div className="text-[10px] text-amber-700 mt-0.5">
                                  Verification Note: {doc.remarks}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
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

                            <button
                              type="button"
                              onClick={() => updateDocumentStatus(doc.id, 'Verified', 'Document verified successfully')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => updateDocumentStatus(doc.id, 'Rejected', 'Illegible or mismatch with records')}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Officer Remarks Input */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Administrative Remarks / Case Notes
                  </label>
                  <input
                    type="text"
                    value={officerRemarksInput}
                    onChange={e => setOfficerRemarksInput(e.target.value)}
                    placeholder="e.g. Verified against university enrollment roster and income certificate."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                {/* Rejection reason box (conditional) */}
                {showRejectBox && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                    <label className="block font-bold text-red-900">
                      Reason for Application Rejection *
                    </label>
                    <textarea
                      rows={2}
                      value={rejectReasonInput}
                      onChange={e => setRejectReasonInput(e.target.value)}
                      placeholder="e.g. Annual family income exceeds the statutory ceiling of ₹6,00,000 for this scheme."
                      className="w-full px-3 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-600/30 bg-white"
                      required
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectBox(false)}
                        className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('Rejected')}
                        className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                >
                  Close
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction('Under Review')}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-semibold text-xs cursor-pointer"
                  >
                    Set Under Review
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('Documents Pending')}
                    className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl font-semibold text-xs cursor-pointer"
                  >
                    Request Documents
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sanction & Approve Grant</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
