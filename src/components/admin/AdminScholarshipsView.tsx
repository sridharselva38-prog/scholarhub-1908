import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scholarship, ScholarshipCategory, ScholarshipStatus } from '../../types';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Building,
  Calendar,
  IndianRupee
} from 'lucide-react';

interface AdminScholarshipsViewProps {
  onOpenAddModal: () => void;
  onEditScholarship: (s: Scholarship) => void;
  onViewApplicants: (s: Scholarship) => void;
}

export const AdminScholarshipsView: React.FC<AdminScholarshipsViewProps> = ({
  onOpenAddModal,
  onEditScholarship,
  onViewApplicants
}) => {
  const { scholarships, deleteScholarship, applications } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredScholarships = scholarships.filter(s => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.provider.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    deleteScholarship(id);
    setDeleteConfirmId(null);
  };

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2 border border-purple-100">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>Module 3: Scheme Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Scholarship Schemes & Programs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, update cut-off thresholds, manage application deadlines, and monitor applicant rosters
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scholarship Scheme</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search scheme name or provider..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800"
          >
            <option value="All">All Categories</option>
            <option value="Merit-Based">Merit-Based</option>
            <option value="Need-Based">Need-Based</option>
            <option value="STEM">STEM</option>
            <option value="Women in Tech">Women in Tech</option>
            <option value="Minority Welfare">Minority Welfare</option>
          </select>
        </div>
      </div>

      {/* Scholarships Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Scheme Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Grant Amount</th>
                <th className="py-3 px-4">Eligibility Criteria</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applicants</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScholarships.map(s => {
                const appCount = applications.filter(a => a.scholarshipId === s.id).length;
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{s.provider}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {s.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatINR(s.amount)}
                      <span className="text-[10px] text-slate-400 block font-normal">/ student / yr</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>Min {s.minimumPercentage}%</div>
                      <div className="text-[10px] text-slate-400">≤ {formatINR(s.maximumIncome)}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{s.endDate}</span>
                      <span className="text-[10px] text-slate-400 block">From: {s.startDate}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          s.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Upcoming'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onViewApplicants(s)}
                        className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{appCount} Applied</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditScholarship(s)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Scheme Parameters"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Scholarship Scheme?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this scholarship from the portal? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
