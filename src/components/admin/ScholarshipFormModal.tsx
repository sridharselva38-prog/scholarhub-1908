import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scholarship, ScholarshipCategory, ScholarshipStatus } from '../../types';
import { X, Award, Save, IndianRupee, Calendar, FileCheck, CheckCircle2 } from 'lucide-react';

interface ScholarshipFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarshipToEdit?: Scholarship | null;
}

export const ScholarshipFormModal: React.FC<ScholarshipFormModalProps> = ({
  isOpen,
  onClose,
  scholarshipToEdit
}) => {
  const { addScholarship, updateScholarship } = useApp();

  const isEditing = Boolean(scholarshipToEdit);

  // Form states
  const [name, setName] = useState(scholarshipToEdit?.name || '');
  const [provider, setProvider] = useState(scholarshipToEdit?.provider || '');
  const [description, setDescription] = useState(scholarshipToEdit?.description || '');
  const [category, setCategory] = useState<ScholarshipCategory>(
    scholarshipToEdit?.category || 'Merit-Based'
  );
  const [amount, setAmount] = useState<number>(scholarshipToEdit?.amount || 50000);
  const [minimumPercentage, setMinimumPercentage] = useState<number>(
    scholarshipToEdit?.minimumPercentage || 75
  );
  const [maximumIncome, setMaximumIncome] = useState<number>(
    scholarshipToEdit?.maximumIncome || 600000
  );
  const [eligibleCourseStr, setEligibleCourseStr] = useState(
    scholarshipToEdit?.eligibleCourse.join(', ') || 'B.Tech, M.Tech, BCA, MCA, B.Sc'
  );
  const [eligibleYearStr, setEligibleYearStr] = useState(
    scholarshipToEdit?.eligibleYear.join(', ') || '1st Year, 2nd Year, 3rd Year, 4th Year'
  );
  const [eligibleStateStr, setEligibleStateStr] = useState(
    scholarshipToEdit?.eligibleState.join(', ') || 'All'
  );
  const [genderEligibility, setGenderEligibility] = useState<'All' | 'Male' | 'Female'>(
    scholarshipToEdit?.genderEligibility || 'All'
  );
  const [startDate, setStartDate] = useState(scholarshipToEdit?.startDate || '2026-06-01');
  const [endDate, setEndDate] = useState(scholarshipToEdit?.endDate || '2026-09-30');
  const [status, setStatus] = useState<ScholarshipStatus>(scholarshipToEdit?.status || 'Active');
  const [requiredDocsStr, setRequiredDocsStr] = useState(
    scholarshipToEdit?.requiredDocuments.join(', ') ||
      'Income Certificate, College ID, 12th Marksheet, Bonafide Certificate'
  );

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) return setErrorMsg('Scheme name is required.');
    if (!provider.trim()) return setErrorMsg('Provider / Ministry name is required.');
    if (amount <= 0) return setErrorMsg('Amount must be positive.');

    const eligibleCourse = eligibleCourseStr.split(',').map(s => s.trim()).filter(Boolean);
    const eligibleYear = eligibleYearStr.split(',').map(s => s.trim()).filter(Boolean);
    const eligibleState = eligibleStateStr.split(',').map(s => s.trim()).filter(Boolean);
    const requiredDocuments = requiredDocsStr.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name,
      provider,
      description,
      category,
      amount: Number(amount),
      minimumPercentage: Number(minimumPercentage),
      maximumIncome: Number(maximumIncome),
      eligibleCourse: eligibleCourse.length ? eligibleCourse : ['All'],
      eligibleYear: eligibleYear.length ? eligibleYear : ['All'],
      eligibleState: eligibleState.length ? eligibleState : ['All'],
      genderEligibility,
      startDate,
      endDate,
      status,
      requiredDocuments: requiredDocuments.length ? requiredDocuments : ['Income Certificate', 'Marksheet']
    };

    if (isEditing && scholarshipToEdit) {
      updateScholarship(scholarshipToEdit.id, payload);
    } else {
      addScholarship(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              Module 3: Scholarship Scheme Configuration
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {isEditing ? 'Edit Scholarship Scheme' : 'Add New Scholarship Scheme'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Scholarship Scheme Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. National Merit Engineering Fellowship 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sponsoring Provider / Department *</label>
              <input
                type="text"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                placeholder="e.g. Ministry of Electronics & IT"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scholarship Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
              >
                <option value="Merit-Based">Merit-Based</option>
                <option value="Need-Based">Need-Based</option>
                <option value="STEM">STEM</option>
                <option value="Women in Tech">Women in Tech</option>
                <option value="Minority Welfare">Minority Welfare</option>
                <option value="Disability Support">Disability Support</option>
                <option value="Research & Innovation">Research & Innovation</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Scheme Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Objectives and scope of the scholarship..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Annual Grant Amount (₹) *</label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 font-bold text-blue-700"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scheme Status *</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 font-semibold"
              >
                <option value="Active">Active (Accepting Applications)</option>
                <option value="Upcoming">Upcoming (Announced)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum Percentage Cut-off (%) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={minimumPercentage}
                onChange={e => setMinimumPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maximum Family Income Limit (₹) *</label>
              <input
                type="number"
                step="10000"
                min="0"
                value={maximumIncome}
                onChange={e => setMaximumIncome(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender Eligibility</label>
              <select
                value={genderEligibility}
                onChange={e => setGenderEligibility(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Eligible States (comma separated)</label>
              <input
                type="text"
                value={eligibleStateStr}
                onChange={e => setEligibleStateStr(e.target.value)}
                placeholder="e.g. All or Maharashtra, Gujarat"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Eligible Degrees / Courses (comma separated)</label>
              <input
                type="text"
                value={eligibleCourseStr}
                onChange={e => setEligibleCourseStr(e.target.value)}
                placeholder="e.g. B.Tech, M.Tech, BCA, MCA"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Application Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Application Deadline Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 font-semibold text-red-600"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Required Documents (comma separated)</label>
              <input
                type="text"
                value={requiredDocsStr}
                onChange={e => setRequiredDocsStr(e.target.value)}
                placeholder="e.g. Income Certificate, College ID, Marksheet"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Scholarship'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
