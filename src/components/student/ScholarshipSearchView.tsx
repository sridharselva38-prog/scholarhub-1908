import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Scholarship, ScholarshipCategory } from '../../types';
import { ScholarshipCard } from './ScholarshipCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  IndianRupee,
  Layers,
  GraduationCap,
  Calendar
} from 'lucide-react';

interface ScholarshipSearchViewProps {
  onViewDetails: (s: Scholarship) => void;
  onCheckEligibility: (s: Scholarship) => void;
  onApply: (s: Scholarship) => void;
}

export const ScholarshipSearchView: React.FC<ScholarshipSearchViewProps> = ({
  onViewDetails,
  onCheckEligibility,
  onApply
}) => {
  const { scholarships, currentStudentProfile, applications } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [maxIncomeFilter, setMaxIncomeFilter] = useState<number>(1000000);
  const [minPercentageFilter, setMinPercentageFilter] = useState<number>(50);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'amount-desc' | 'amount-asc' | 'deadline' | 'name'>('amount-desc');

  // Categories list
  const categories: ScholarshipCategory[] = [
    'Merit-Based',
    'Need-Based',
    'STEM',
    'Women in Tech',
    'Minority Welfare',
    'Disability Support',
    'Research & Innovation'
  ];

  const coursesList = ['All', 'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'Ph.D'];
  const statesList = ['All', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Karnataka', 'Delhi'];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCourse('All');
    setSelectedState('All');
    setSelectedGender('All');
    setMaxIncomeFilter(1000000);
    setMinPercentageFilter(50);
    setStatusFilter('All');
    setSortBy('amount-desc');
  };

  const filteredScholarships = useMemo(() => {
    return scholarships
      .filter(s => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchProvider = s.provider.toLowerCase().includes(q);
          const matchDesc = s.description.toLowerCase().includes(q);
          if (!matchName && !matchProvider && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;

        // Status
        if (statusFilter !== 'All' && s.status !== statusFilter) return false;

        // Course
        if (selectedCourse !== 'All') {
          if (!s.eligibleCourse.includes('All') && !s.eligibleCourse.includes(selectedCourse)) {
            return false;
          }
        }

        // State
        if (selectedState !== 'All') {
          if (!s.eligibleState.includes('All') && !s.eligibleState.includes(selectedState)) {
            return false;
          }
        }

        // Gender
        if (selectedGender !== 'All' && s.genderEligibility !== 'All' && s.genderEligibility !== selectedGender) {
          return false;
        }

        // Percentage threshold
        if (s.minimumPercentage < minPercentageFilter) return false;

        // Max income ceiling
        if (s.maximumIncome > maxIncomeFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        if (sortBy === 'deadline') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        return a.name.localeCompare(b.name);
      });
  }, [
    scholarships,
    searchQuery,
    selectedCategory,
    selectedCourse,
    selectedState,
    selectedGender,
    maxIncomeFilter,
    minPercentageFilter,
    statusFilter,
    sortBy
  ]);

  const myAppIds = currentStudentProfile
    ? applications.filter(a => a.studentId === currentStudentProfile.studentId).map(a => a.scholarshipId)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Scholarship Discovery & Search
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search available government and private scholarship opportunities with multidimensional filters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          >
            <option value="amount-desc">Grant Amount (High to Low)</option>
            <option value="amount-asc">Grant Amount (Low to High)</option>
            <option value="deadline">Application Deadline (Soonest)</option>
            <option value="name">Scheme Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by scholarship title, sponsor name, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Eligible Course</label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              {coursesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">State Domicile</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              {statesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male Only</option>
              <option value="Female">Female Only</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Scheme Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{filteredScholarships.length}</strong> scholarship schemes
          </div>
          {currentStudentProfile && (
            <div className="text-blue-600 font-medium">
              Profile matching auto-applied for course: {currentStudentProfile.course} ({currentStudentProfile.yearOfStudy})
            </div>
          )}
        </div>
      </div>

      {/* SCHOLARSHIP CARDS GRID */}
      {filteredScholarships.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Scholarships Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No scholarship schemes matched your current filter criteria. Try adjusting the category, course, or clearing filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map(s => {
            const hasApplied = myAppIds.includes(s.id);
            return (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                onViewDetails={onViewDetails}
                onCheckEligibility={onCheckEligibility}
                onApply={onApply}
                hasApplied={hasApplied}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
