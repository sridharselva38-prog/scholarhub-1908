import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleIcon } from '../auth/GoogleLoginModal';
import {
  User,
  GraduationCap,
  Users,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const {
    currentUser,
    currentStudentProfile,
    currentAcademicDetails,
    currentFamilyDetails,
    updateStudentProfile
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'academic' | 'family'>('personal');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [dob, setDob] = useState(currentStudentProfile?.dateOfBirth || '');
  const [gender, setGender] = useState(currentStudentProfile?.gender || 'Male');
  const [address, setAddress] = useState(currentStudentProfile?.address || '');
  const [state, setState] = useState(currentStudentProfile?.state || '');
  const [district, setDistrict] = useState(currentStudentProfile?.district || '');

  // Academic details
  const [college, setCollege] = useState(currentStudentProfile?.college || '');
  const [course, setCourse] = useState(currentStudentProfile?.course || '');
  const [yearOfStudy, setYearOfStudy] = useState(currentStudentProfile?.yearOfStudy || '3rd Year');
  const [percentage, setPercentage] = useState<number>(currentAcademicDetails?.percentage || 0);
  const [cgpa, setCgpa] = useState<number>(currentAcademicDetails?.cgpa || 0);
  const [tenthMark, setTenthMark] = useState<number>(currentAcademicDetails?.tenthMark || 0);
  const [twelfthMark, setTwelfthMark] = useState<number>(currentAcademicDetails?.twelfthMark || 0);

  // Family details
  const [familyIncome, setFamilyIncome] = useState<number>(currentFamilyDetails?.familyIncome || 0);
  const [fatherName, setFatherName] = useState(currentFamilyDetails?.fatherName || '');
  const [motherName, setMotherName] = useState(currentFamilyDetails?.motherName || '');
  const [fatherOccupation, setFatherOccupation] = useState(currentFamilyDetails?.fatherOccupation || '');
  const [familyMembers, setFamilyMembers] = useState<number>(currentFamilyDetails?.familyMembers || 4);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateStudentProfile(
      {
        name,
        mobile,
        dateOfBirth: dob,
        gender: gender as any,
        address,
        state,
        district,
        college,
        course,
        yearOfStudy
      },
      {
        percentage: Number(percentage),
        cgpa: Number(cgpa),
        tenthMark: Number(tenthMark),
        twelfthMark: Number(twelfthMark)
      },
      {
        familyIncome: Number(familyIncome),
        fatherName,
        motherName,
        fatherOccupation,
        familyMembers: Number(familyMembers)
      }
    );

    setSuccessMsg('Student profile & academic parameters updated successfully in database!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Module 2: Student Master Profile</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Student Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Keep your academic percentage and income data updated for automatic eligibility scoring across all schemes
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Sub-tabs for Section Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('personal')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'personal'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Personal & Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('academic')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'academic'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>2. Academic & Marks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('family')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeSubTab === 'family'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Family & Income</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {/* SECTION 1: PERSONAL */}
          {activeSubTab === 'personal' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Personal & Identity Information</h3>
                {currentUser?.authProvider === 'google' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold">
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Verified via Google Identity</span>
                  </span>
                )}
              </div>

              {currentUser?.authProvider === 'google' && (
                <div className="p-3.5 bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900">Google OAuth 2.0 Identity</div>
                      <div className="text-[11px] text-slate-600">{currentUser.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                    Linked & Active
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used as unique portal identity</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State (Domicile) *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Permanent Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Residential address with postal code"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ACADEMIC */}
          {activeSubTab === 'academic' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900">College & Academic Performance</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">College / University Name *</label>
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. Pune Institute of Computer Technology"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrolled Degree / Course *</label>
                  <input
                    type="text"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Year of Study *</label>
                  <select
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Current Aggregate Percentage (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={e => setPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 font-bold text-blue-700"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Used for merit-based thresholds</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={e => setCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class 10th Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={tenthMark}
                    onChange={e => setTenthMark(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class 12th / Diploma (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={twelfthMark}
                    onChange={e => setTwelfthMark(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: FAMILY */}
          {activeSubTab === 'family' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Family & Socio-Economic Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Annual Family Income (₹) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={familyIncome}
                    onChange={e => setFamilyIncome(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30 font-bold text-emerald-700"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    Used for need-based scholarship income ceilings
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Family Members</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={familyMembers}
                    onChange={e => setFamilyMembers(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    placeholder="Father / Guardian name"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={e => setFatherOccupation(e.target.value)}
                    placeholder="e.g. Teacher, Farmer, Private Service"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={e => setMotherName(e.target.value)}
                    placeholder="Mother's name"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeSubTab === 'personal' && (
                <button
                  type="button"
                  onClick={() => setActiveSubTab('academic')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl cursor-pointer"
                >
                  Next: Academic Details →
                </button>
              )}
              {activeSubTab === 'academic' && (
                <button
                  type="button"
                  onClick={() => setActiveSubTab('family')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl cursor-pointer"
                >
                  Next: Family Details →
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
