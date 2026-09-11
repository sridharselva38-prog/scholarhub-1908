export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  authProvider?: 'local' | 'google';
}

export interface StudentProfile {
  studentId: string;
  userId: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  district: string;
  state: string;
  college: string;
  university: string;
  course: string;
  department: string;
  yearOfStudy: string;
  semester: string;
}

export interface AcademicDetails {
  academicId: string;
  studentId: string;
  percentage: number;
  cgpa: number;
  tenthMark: number;
  twelfthMark: number;
}

export interface FamilyDetails {
  familyId: string;
  studentId: string;
  familyIncome: number;
  fatherName: string;
  motherName: string;
  guardianName: string;
  occupation: string;
  familyMembers: number;
}

export type ScholarshipCategory =
  | 'Merit-Based'
  | 'Need-Based'
  | 'STEM'
  | 'Women in Tech'
  | 'Minority Welfare'
  | 'Disability Support'
  | 'Research & Innovation';

export type ScholarshipStatus = 'Active' | 'Upcoming' | 'Closed';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  category: ScholarshipCategory;
  description: string;
  amount: number;
  minimumPercentage: number;
  maximumIncome: number;
  eligibleCourse: string[];
  eligibleYear: string[];
  eligibleState: string[];
  genderEligibility: 'All' | 'Male' | 'Female' | 'Other';
  startDate: string;
  endDate: string;
  requiredDocuments: string[];
  status: ScholarshipStatus;
  createdAt: string;
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Documents Pending'
  | 'Verified'
  | 'Approved'
  | 'Rejected';

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
}

export interface Application {
  id: string; // e.g. "SCH20260001"
  studentId: string;
  scholarshipId: string;
  applicationDate: string;
  status: ApplicationStatus;
  remarks: string;
  rejectionReason?: string;
  lastUpdated: string;
  bankDetails: BankDetails;
  declarationAccepted: boolean;
}

export type DocumentVerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export interface DocumentRecord {
  id: string;
  applicationId: string;
  studentId: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  fileDataUrl?: string;
  verificationStatus: DocumentVerificationStatus;
  remarks?: string;
  uploadedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  status: 'Unread' | 'Read';
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SystemSettings {
  allowNewRegistrations: boolean;
  maintenanceMode: boolean;
  academicYear: string;
  contactEmail: string;
  helplineNumber: string;
}
