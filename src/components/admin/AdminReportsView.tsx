import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Download,
  Filter,
  FileSpreadsheet,
  PieChart,
  BarChart2,
  Calendar,
  IndianRupee,
  Building,
  GraduationCap,
  Printer
} from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const { applications, scholarships, students, users } = useApp();

  const [reportType, setReportType] = useState<
    'scheme' | 'college' | 'category' | 'course' | 'status' | 'disbursement'
  >('scheme');

  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const sch = scholarships.find(s => s.id === app.scholarshipId);
    if (filterCategory !== 'All' && sch?.category !== filterCategory) return false;
    if (filterStatus !== 'All' && app.status !== filterStatus) return false;
    return true;
  });

  // Calculate aggregation groups
  const generateReportData = () => {
    switch (reportType) {
      case 'scheme': {
        return scholarships.map(sch => {
          const apps = filteredApps.filter(a => a.scholarshipId === sch.id);
          const approved = apps.filter(a => a.status === 'Approved').length;
          const pending = apps.filter(a => ['Submitted', 'Under Review', 'Documents Pending'].includes(a.status)).length;
          const rejected = apps.filter(a => a.status === 'Rejected').length;
          const totalAmount = approved * sch.amount;

          return {
            key: sch.id,
            label: sch.name,
            subLabel: sch.provider,
            totalApps: apps.length,
            approved,
            pending,
            rejected,
            disbursed: totalAmount
          };
        });
      }

      case 'college': {
        const collegeMap = new Map<string, { total: number; approved: number; pending: number; rejected: number; disbursed: number }>();
        filteredApps.forEach(app => {
          const stu = students.find(s => s.studentId === app.studentId);
          const sch = scholarships.find(s => s.id === app.scholarshipId);
          const collegeName = stu?.college || 'Unknown College';

          if (!collegeMap.has(collegeName)) {
            collegeMap.set(collegeName, { total: 0, approved: 0, pending: 0, rejected: 0, disbursed: 0 });
          }
          const item = collegeMap.get(collegeName)!;
          item.total += 1;
          if (app.status === 'Approved') {
            item.approved += 1;
            item.disbursed += (sch ? sch.amount : 0);
          } else if (app.status === 'Rejected') {
            item.rejected += 1;
          } else {
            item.pending += 1;
          }
        });

        return Array.from(collegeMap.entries()).map(([name, data]) => ({
          key: name,
          label: name,
          subLabel: 'Higher Education Institution',
          totalApps: data.total,
          approved: data.approved,
          pending: data.pending,
          rejected: data.rejected,
          disbursed: data.disbursed
        }));
      }

      case 'category': {
        const categories = [
          'Merit-Based',
          'Need-Based',
          'STEM',
          'Women in Tech',
          'Minority Welfare',
          'Disability Support',
          'Research & Innovation'
        ];

        return categories.map(cat => {
          const catSchIds = scholarships.filter(s => s.category === cat).map(s => s.id);
          const apps = filteredApps.filter(a => catSchIds.includes(a.scholarshipId));
          const approved = apps.filter(a => a.status === 'Approved');
          const pending = apps.filter(a => ['Submitted', 'Under Review', 'Documents Pending'].includes(a.status)).length;
          const rejected = apps.filter(a => a.status === 'Rejected').length;
          const disbursed = approved.reduce((acc, a) => {
            const sch = scholarships.find(s => s.id === a.scholarshipId);
            return acc + (sch ? sch.amount : 0);
          }, 0);

          return {
            key: cat,
            label: cat,
            subLabel: 'Statutory Scholarship Category',
            totalApps: apps.length,
            approved: approved.length,
            pending,
            rejected,
            disbursed
          };
        });
      }

      case 'course': {
        const courseMap = new Map<string, { total: number; approved: number; pending: number; rejected: number; disbursed: number }>();
        filteredApps.forEach(app => {
          const stu = students.find(s => s.studentId === app.studentId);
          const sch = scholarships.find(s => s.id === app.scholarshipId);
          const course = stu?.course || 'General';

          if (!courseMap.has(course)) {
            courseMap.set(course, { total: 0, approved: 0, pending: 0, rejected: 0, disbursed: 0 });
          }
          const item = courseMap.get(course)!;
          item.total += 1;
          if (app.status === 'Approved') {
            item.approved += 1;
            item.disbursed += (sch ? sch.amount : 0);
          } else if (app.status === 'Rejected') {
            item.rejected += 1;
          } else {
            item.pending += 1;
          }
        });

        return Array.from(courseMap.entries()).map(([name, data]) => ({
          key: name,
          label: name,
          subLabel: 'Academic Program',
          totalApps: data.total,
          approved: data.approved,
          pending: data.pending,
          rejected: data.rejected,
          disbursed: data.disbursed
        }));
      }

      case 'status': {
        const statuses = ['Submitted', 'Under Review', 'Documents Pending', 'Verified', 'Approved', 'Rejected'];
        return statuses.map(st => {
          const apps = filteredApps.filter(a => a.status === st);
          const disbursed = st === 'Approved'
            ? apps.reduce((acc, a) => {
                const sch = scholarships.find(s => s.id === a.scholarshipId);
                return acc + (sch ? sch.amount : 0);
              }, 0)
            : 0;

          return {
            key: st,
            label: st,
            subLabel: 'Workflow State',
            totalApps: apps.length,
            approved: st === 'Approved' ? apps.length : 0,
            pending: ['Submitted', 'Under Review', 'Documents Pending', 'Verified'].includes(st) ? apps.length : 0,
            rejected: st === 'Rejected' ? apps.length : 0,
            disbursed
          };
        });
      }

      case 'disbursement': {
        return filteredApps
          .filter(a => a.status === 'Approved')
          .map(app => {
            const stu = students.find(s => s.studentId === app.studentId);
            const user = stu ? users.find(u => u.id === stu.userId) : null;
            const sch = scholarships.find(s => s.id === app.scholarshipId);

            return {
              key: app.id,
              label: `${user?.name || 'Student'} (${app.id})`,
              subLabel: `${sch?.name || 'Scheme'} • A/C: ••••${app.bankDetails.accountNumber.slice(-4)}`,
              totalApps: 1,
              approved: 1,
              pending: 0,
              rejected: 0,
              disbursed: sch?.amount || 0
            };
          });
      }
    }
  };

  const reportData = generateReportData();

  const totalAppsInReport = reportData.reduce((acc, r) => acc + r.totalApps, 0);
  const totalApprovedInReport = reportData.reduce((acc, r) => acc + r.approved, 0);
  const totalDisbursedInReport = reportData.reduce((acc, r) => acc + r.disbursed, 0);

  const handleExportCSV = () => {
    let csv = 'Entity Name,Details,Total Applications,Approved,Pending,Rejected,Sanctioned Amount (INR)\n';
    reportData.forEach(row => {
      csv += `"${row.label}","${row.subLabel}",${row.totalApps},${row.approved},${row.pending},${row.rejected},${row.disbursed}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Scholarship_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2 border border-purple-100">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>Module 12: Reports & Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Reports & Sanction Disbursals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and export multidimensional audit reports across colleges, categories, courses, and disbursements
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* REPORT TYPE SELECTOR PILLS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1.5">
        <button
          onClick={() => setReportType('scheme')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            reportType === 'scheme'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Scholarship-Wise
        </button>

        <button
          onClick={() => setReportType('college')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            reportType === 'college'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          College-Wise
        </button>

        <button
          onClick={() => setReportType('category')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            reportType === 'category'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Category-Wise
        </button>

        <button
          onClick={() => setReportType('course')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            reportType === 'course'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Course-Wise
        </button>

        <button
          onClick={() => setReportType('status')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            reportType === 'status'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Status-Wise
        </button>

        <button
          onClick={() => setReportType('disbursement')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            reportType === 'disbursement'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Disbursed Grants DBT
        </button>
      </div>

      {/* FILTER BAR & SUMMARY TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">Evaluated Submissions</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalAppsInReport}</div>
          <span className="text-[10px] text-slate-400">Applications within active scope</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">Sanctioned Grants</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{totalApprovedInReport}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Successfully verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium">Total Sanctioned Disbursal</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{formatINR(totalDisbursedInReport)}</div>
          <span className="text-[10px] text-slate-400">Direct Benefit Transfer</span>
        </div>
      </div>

      {/* REPORT DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {reportType.toUpperCase()} AGGREGATION AUDIT TABLE
          </div>
          <span className="text-xs text-slate-500">{reportData.length} records in view</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] bg-slate-50/50">
                <th className="py-3 px-4">Entity Identifier</th>
                <th className="py-3 px-4">Classification Details</th>
                <th className="py-3 px-4 text-center">Total Applications</th>
                <th className="py-3 px-4 text-center">Approved</th>
                <th className="py-3 px-4 text-center">Pending Review</th>
                <th className="py-3 px-4 text-center">Rejected</th>
                <th className="py-3 px-4 text-right">Disbursed Grant Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No data available for this report type with current filters.
                  </td>
                </tr>
              ) : (
                reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {row.label}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {row.subLabel}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {row.totalApps}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {row.approved}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600">
                      {row.pending}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-red-600">
                      {row.rejected}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-blue-700">
                      {formatINR(row.disbursed)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {reportData.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                  <td className="py-3 px-4">TOTAL SUMMARY</td>
                  <td className="py-3 px-4 text-slate-500">Consolidated Metrics</td>
                  <td className="py-3 px-4 text-center">{totalAppsInReport}</td>
                  <td className="py-3 px-4 text-center text-emerald-700">{totalApprovedInReport}</td>
                  <td className="py-3 px-4 text-center text-amber-600">
                    {reportData.reduce((a, b) => a + b.pending, 0)}
                  </td>
                  <td className="py-3 px-4 text-center text-red-600">
                    {reportData.reduce((a, b) => a + b.rejected, 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-700">
                    {formatINR(totalDisbursedInReport)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
