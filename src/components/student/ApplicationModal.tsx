import React, { useState } from 'react';
import { Scholarship, BankDetails } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  CreditCard,
  User,
  GraduationCap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ApplicationModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ scholarship, onClose }) => {
  const {
    currentUser,
    currentStudentProfile,
    currentAcademicDetails,
    currentFamilyDetails,
    applyForScholarship,
    setActiveTab
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: currentUser?.name || '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: ''
  });

  const [uploadedDocs, setUploadedDocs] = useState<
    Array<{ docType: string; fileName: string; fileSize: string }>
  >([]);

  const [declaration, setDeclaration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  if (!scholarship || !currentUser) return null;

  const handleDocumentSelect = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      setUploadedDocs(prev => [
        ...prev.filter(d => d.docType !== docType),
        { docType, fileName: file.name, fileSize: fileSize === '0.0 MB' ? '850 KB' : fileSize }
      ]);
    }
  };

  const handleSimulateAutoUpload = (docType: string) => {
    const defaultName = `${docType.replace(/\s+/g, '_')}_${currentUser.name.replace(/\s+/g, '')}.pdf`;
    setUploadedDocs(prev => [
      ...prev.filter(d => d.docType !== docType),
      { docType, fileName: defaultName, fileSize: '1.4 MB' }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!bankDetails.bankName.trim() || !bankDetails.accountNumber.trim() || !bankDetails.ifscCode.trim()) {
      setErrorMessage('Please enter complete bank account details.');
      return;
    }

    if (!declaration) {
      setErrorMessage('You must accept the self-declaration to submit.');
      return;
    }

    const res = applyForScholarship(scholarship.id, bankDetails, uploadedDocs);
    if (res.success && res.applicationId) {
      setSubmittedAppId(res.applicationId);
    } else {
      setErrorMessage(res.error || 'Could not submit application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Module 6: Scholarship Application
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Apply for {scholarship.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Wizard Bar (if not yet submitted) */}
        {!submittedAppId && (
          <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                1
              </span>
              <span className={`font-medium ${step === 1 ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>
                Student & Academic Summary
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                2
              </span>
              <span className={`font-medium ${step === 2 ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>
                Bank & Direct Benefit Transfer
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                3
              </span>
              <span className={`font-medium ${step === 3 ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>
                Documents & Submit
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {submittedAppId ? (
            /* SUCCESS SUBMITTED STATE */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your scholarship application has been registered in the database and forwarded for administrative verification.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-left">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Unique Application ID
                </div>
                <div className="text-lg font-mono font-bold text-blue-700 mt-0.5">
                  {submittedAppId}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-2">
                  Status: <span className="font-semibold text-blue-600">Submitted (Under Review)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('applications');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Track Application Status
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: Student, Academic & Family Review */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Student Personal Credentials</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Name:</span>
                        <span className="font-semibold text-slate-800">{currentUser.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Email:</span>
                        <span className="font-semibold text-slate-800 truncate">{currentUser.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mobile:</span>
                        <span className="font-semibold text-slate-800">{currentUser.mobile}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">DOB:</span>
                        <span className="font-semibold text-slate-800">{currentStudentProfile?.dateOfBirth || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Gender:</span>
                        <span className="font-semibold text-slate-800">{currentStudentProfile?.gender || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Domicile State:</span>
                        <span className="font-semibold text-slate-800">{currentStudentProfile?.state || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>Academic & Institution Details</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">College:</span>
                        <span className="font-semibold text-slate-800">{currentStudentProfile?.college || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Course:</span>
                        <span className="font-semibold text-slate-800">{currentStudentProfile?.course || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Year of Study:</span>
                        <span className="font-semibold text-slate-800">{currentStudentProfile?.yearOfStudy || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Percentage:</span>
                        <span className="font-semibold text-emerald-700">{currentAcademicDetails?.percentage || 0}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CGPA:</span>
                        <span className="font-semibold text-slate-800">{currentAcademicDetails?.cgpa || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Class 12 Score:</span>
                        <span className="font-semibold text-slate-800">{currentAcademicDetails?.twelfthMark || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Family & Income Profile</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Father's Name:</span>
                        <span className="font-semibold text-slate-800">{currentFamilyDetails?.fatherName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Annual Family Income:</span>
                        <span className="font-semibold text-emerald-700">₹{(currentFamilyDetails?.familyIncome || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Family Members:</span>
                        <span className="font-semibold text-slate-800">{currentFamilyDetails?.familyMembers || 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Bank Details Form */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>
                      Direct Benefit Transfer (DBT): Grant amount will be credited directly to this verified bank account.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Bank Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountHolderName}
                        onChange={e => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                        placeholder="As per bank passbook"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankDetails.bankName}
                        onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                        placeholder="e.g. State Bank of India"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="password"
                        value={bankDetails.accountNumber}
                        onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                        placeholder="Enter bank account number"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={bankDetails.ifscCode}
                        onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. SBIN0001423"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        value={bankDetails.branchName}
                        onChange={e => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                        placeholder="e.g. University Campus Branch"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Document Uploads & Declaration */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Mandatory Document Uploads ({scholarship.requiredDocuments.length})
                    </h4>
                    <p className="text-slate-500 mb-3 text-[11px]">
                      Upload PDF or scanned copies. Max 5MB per file.
                    </p>

                    <div className="space-y-2">
                      {scholarship.requiredDocuments.map((docType, idx) => {
                        const existing = uploadedDocs.find(d => d.docType === docType);
                        return (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <FileCheck className={`w-4 h-4 ${existing ? 'text-emerald-600' : 'text-slate-400'}`} />
                              <div>
                                <div className="font-semibold text-slate-800">{docType}</div>
                                {existing ? (
                                  <span className="text-[10px] text-emerald-600 font-medium">
                                    Uploaded: {existing.fileName} ({existing.fileSize})
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Not uploaded yet</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 cursor-pointer text-[11px] flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                <span>Browse</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={e => handleDocumentSelect(docType, e)}
                                />
                              </label>

                              {!existing && (
                                <button
                                  type="button"
                                  onClick={() => handleSimulateAutoUpload(docType)}
                                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 text-[10px] font-semibold cursor-pointer"
                                  title="Quick sample upload"
                                >
                                  Attach Demo File
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Declaration */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declaration}
                        onChange={e => setDeclaration(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-600 cursor-pointer"
                      />
                      <span className="text-slate-700 text-[11px] leading-relaxed">
                        I hereby declare that the particulars furnished above are true and correct to the best of my knowledge. I agree that in case of any discrepancy or false documentation, my application and scholarship grant shall stand cancelled.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!submittedAppId && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && (!bankDetails.bankName || !bankDetails.accountNumber)) {
                    setErrorMessage('Please fill in bank name and account number.');
                    return;
                  }
                  setErrorMessage('');
                  setStep((step + 1) as any);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit Final Application</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
