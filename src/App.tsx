import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Scholarship } from './types';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { CodeViewerModal } from './components/common/CodeViewerModal';
import { NotificationsView } from './components/common/NotificationsView';
import { AuthView } from './components/auth/AuthView';

// Student views & modals
import { StudentHomeView } from './components/student/StudentHomeView';
import { ScholarshipSearchView } from './components/student/ScholarshipSearchView';
import { EligibilityView } from './components/student/EligibilityView';
import { ApplicationTrackingView } from './components/student/ApplicationTrackingView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { ScholarshipDetailModal } from './components/student/ScholarshipDetailModal';
import { EligibilityModal } from './components/student/EligibilityModal';
import { ApplicationModal } from './components/student/ApplicationModal';

// Admin views & modals
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminScholarshipsView } from './components/admin/AdminScholarshipsView';
import { AdminApplicationsView } from './components/admin/AdminApplicationsView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { ScholarshipFormModal } from './components/admin/ScholarshipFormModal';

export default function App() {
  const { currentUser, activeTab, setActiveTab, applications } = useApp();

  // Common modals
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Student modals state
  const [detailModalScholarship, setDetailModalScholarship] = useState<Scholarship | null>(null);
  const [eligibilityModalScholarship, setEligibilityModalScholarship] = useState<Scholarship | null>(null);
  const [applyModalScholarship, setApplyModalScholarship] = useState<Scholarship | null>(null);

  // Admin modals state
  const [isScholarshipFormOpen, setIsScholarshipFormOpen] = useState(false);
  const [scholarshipToEdit, setScholarshipToEdit] = useState<Scholarship | null>(null);

  // Handlers for student flow
  const handleViewDetails = (scholarship: Scholarship) => {
    setDetailModalScholarship(scholarship);
  };

  const handleCheckEligibility = (scholarship: Scholarship) => {
    setEligibilityModalScholarship(scholarship);
  };

  const handleApply = (scholarship: Scholarship) => {
    setApplyModalScholarship(scholarship);
  };

  // Handlers for admin flow
  const handleOpenAddScholarship = () => {
    setScholarshipToEdit(null);
    setIsScholarshipFormOpen(true);
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setScholarshipToEdit(scholarship);
    setIsScholarshipFormOpen(true);
  };

  const handleViewApplicants = (scholarship: Scholarship) => {
    setActiveTab('admin-applications');
  };

  // Render view based on authentication and activeTab
  const renderContent = () => {
    if (!currentUser) {
      return <AuthView />;
    }

    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'admin-dashboard':
          return (
            <AdminDashboardView
              onAddScholarship={handleOpenAddScholarship}
              onNavigateTab={setActiveTab}
            />
          );
        case 'admin-scholarships':
          return (
            <AdminScholarshipsView
              onOpenAddModal={handleOpenAddScholarship}
              onEditScholarship={handleEditScholarship}
              onViewApplicants={handleViewApplicants}
            />
          );
        case 'admin-applications':
          return <AdminApplicationsView />;
        case 'admin-reports':
          return <AdminReportsView />;
        case 'notifications':
          return <NotificationsView />;
        default:
          return (
            <AdminDashboardView
              onAddScholarship={handleOpenAddScholarship}
              onNavigateTab={setActiveTab}
            />
          );
      }
    }

    // Student Role views
    switch (activeTab) {
      case 'home':
        return (
          <StudentHomeView
            onViewDetails={handleViewDetails}
            onCheckEligibility={handleCheckEligibility}
            onApply={handleApply}
          />
        );
      case 'scholarships':
        return (
          <ScholarshipSearchView
            onViewDetails={handleViewDetails}
            onCheckEligibility={handleCheckEligibility}
            onApply={handleApply}
          />
        );
      case 'eligibility':
        return (
          <EligibilityView
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
        );
      case 'applications':
        return <ApplicationTrackingView />;
      case 'profile':
        return <StudentProfileView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return (
          <StudentHomeView
            onViewDetails={handleViewDetails}
            onCheckEligibility={handleCheckEligibility}
            onApply={handleApply}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Toast notifications */}
      <Toast />

      {/* Top Application Header */}
      <Header onOpenCodeModal={() => setIsCodeModalOpen(true)} />

      {/* Main Page Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      {/* Student Modals */}
      <ScholarshipDetailModal
        scholarship={detailModalScholarship}
        onClose={() => setDetailModalScholarship(null)}
        onCheckEligibility={handleCheckEligibility}
        onApply={handleApply}
        hasApplied={
          detailModalScholarship
            ? applications.some(a => a.scholarshipId === detailModalScholarship.id)
            : false
        }
      />

      <EligibilityModal
        scholarship={eligibilityModalScholarship}
        onClose={() => setEligibilityModalScholarship(null)}
        onApply={handleApply}
        hasApplied={
          eligibilityModalScholarship
            ? applications.some(a => a.scholarshipId === eligibilityModalScholarship.id)
            : false
        }
      />

      <ApplicationModal
        scholarship={applyModalScholarship}
        onClose={() => setApplyModalScholarship(null)}
      />

      {/* Admin Modals */}
      <ScholarshipFormModal
        isOpen={isScholarshipFormOpen}
        onClose={() => setIsScholarshipFormOpen(false)}
        scholarshipToEdit={scholarshipToEdit}
      />

      {/* Backend Code & Relational Schema Modal */}
      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Standard Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Scholarship Management System</span>
            <span>•</span>
            <span>Higher Education & Welfare Schemes Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              View Python & Java Backend Source
            </button>
            <span>•</span>
            <span>SQLite3 / Normalized Relational Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
