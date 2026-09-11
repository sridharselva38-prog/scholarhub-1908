import {
  AcademicDetails,
  Application,
  DocumentRecord,
  FamilyDetails,
  NotificationItem,
  Scholarship,
  StudentProfile,
  SystemSettings,
  User
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR_ADMIN_01',
    name: 'Dr. Alok Verma',
    email: 'admin@scholarships.gov.in',
    mobile: '9876543210',
    password: 'admin',
    role: 'admin',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'USR_STU_01',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    mobile: '9123456780',
    password: 'password123',
    role: 'student',
    createdAt: '2026-01-15T10:30:00Z'
  },
  {
    id: 'USR_STU_02',
    name: 'Priya Patel',
    email: 'priya.patel@engineering.edu',
    mobile: '9898989898',
    password: 'password123',
    role: 'student',
    createdAt: '2026-02-01T11:15:00Z'
  },
  {
    id: 'USR_STU_03',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@univ.edu',
    mobile: '9765432109',
    password: 'password123',
    role: 'student',
    createdAt: '2026-02-12T14:20:00Z'
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    studentId: 'STU_001',
    userId: 'USR_STU_01',
    dateOfBirth: '2004-05-14',
    gender: 'Male',
    address: 'Flat 402, Shivam Residency, MG Road',
    district: 'Pune',
    state: 'Maharashtra',
    college: 'Pune Institute of Computer Technology (PICT)',
    university: 'Savitribai Phule Pune University',
    course: 'B.Tech',
    department: 'Computer Engineering',
    yearOfStudy: '3rd Year',
    semester: '6th Semester'
  },
  {
    studentId: 'STU_002',
    userId: 'USR_STU_02',
    dateOfBirth: '2005-08-22',
    gender: 'Female',
    address: 'B-12, Green Enclave, SG Highway',
    district: 'Ahmedabad',
    state: 'Gujarat',
    college: 'L.D. College of Engineering',
    university: 'Gujarat Technological University',
    course: 'B.Tech',
    department: 'Information Technology',
    yearOfStudy: '2nd Year',
    semester: '4th Semester'
  },
  {
    studentId: 'STU_003',
    userId: 'USR_STU_03',
    dateOfBirth: '2003-11-05',
    gender: 'Female',
    address: '14/2, Temple Street, Mylapore',
    district: 'Chennai',
    state: 'Tamil Nadu',
    college: 'College of Engineering, Guindy',
    university: 'Anna University',
    course: 'B.Sc',
    department: 'Mathematics & Computing',
    yearOfStudy: '3rd Year',
    semester: '5th Semester'
  }
];

export const INITIAL_ACADEMIC: AcademicDetails[] = [
  {
    academicId: 'ACAD_001',
    studentId: 'STU_001',
    percentage: 82.5,
    cgpa: 8.68,
    tenthMark: 91.2,
    twelfthMark: 87.4
  },
  {
    academicId: 'ACAD_002',
    studentId: 'STU_002',
    percentage: 89.0,
    cgpa: 9.35,
    tenthMark: 94.6,
    twelfthMark: 92.0
  },
  {
    academicId: 'ACAD_003',
    studentId: 'STU_003',
    percentage: 76.0,
    cgpa: 7.9,
    tenthMark: 88.0,
    twelfthMark: 82.5
  }
];

export const INITIAL_FAMILY: FamilyDetails[] = [
  {
    familyId: 'FAM_001',
    studentId: 'STU_001',
    familyIncome: 320000,
    fatherName: 'Ramesh Sharma',
    motherName: 'Sunita Sharma',
    guardianName: 'Ramesh Sharma',
    occupation: 'Small Business / Shopkeeper',
    familyMembers: 4
  },
  {
    familyId: 'FAM_002',
    studentId: 'STU_002',
    familyIncome: 210000,
    fatherName: 'Bharat Patel',
    motherName: 'Geeta Patel',
    guardianName: 'Bharat Patel',
    occupation: 'Clerk / Private Sector',
    familyMembers: 4
  },
  {
    familyId: 'FAM_003',
    studentId: 'STU_003',
    familyIncome: 450000,
    fatherName: 'Sundaram Iyer',
    motherName: 'Lakshmi Iyer',
    guardianName: 'Sundaram Iyer',
    occupation: 'Accountant',
    familyMembers: 3
  }
];

export const INITIAL_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'SCH_001',
    name: 'National Merit Scholarship Scheme 2026',
    provider: 'Ministry of Education, Govt. of India',
    category: 'Merit-Based',
    description: 'Awarded to high-achieving undergraduate and postgraduate students demonstrating outstanding academic performance in professional and technical degree programs.',
    amount: 50000,
    minimumPercentage: 80,
    maximumIncome: 600000,
    eligibleCourse: ['All'],
    eligibleYear: ['All'],
    eligibleState: ['All'],
    genderEligibility: 'All',
    startDate: '2026-01-01',
    endDate: '2026-10-31',
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      '10th Marksheet',
      '12th Marksheet',
      'College ID',
      'Bank Passbook'
    ],
    status: 'Active',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'SCH_002',
    name: 'Post-Matric STEM Excellence Scholarship',
    provider: 'Department of Science & Technology',
    category: 'STEM',
    description: 'Financial assistance program aimed at supporting promising engineering, technology, and pure sciences students from middle and lower-income families.',
    amount: 75000,
    minimumPercentage: 75,
    maximumIncome: 450000,
    eligibleCourse: ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA'],
    eligibleYear: ['2nd Year', '3rd Year', '4th Year'],
    eligibleState: ['All'],
    genderEligibility: 'All',
    startDate: '2026-01-15',
    endDate: '2026-11-15',
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      '12th Marksheet',
      'Bonafide Certificate',
      'College ID',
      'Bank Passbook'
    ],
    status: 'Active',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'SCH_003',
    name: 'Pragati Scholarship Scheme for Girl Students',
    provider: 'All India Council for Technical Education (AICTE)',
    category: 'Women in Tech',
    description: 'Empowering young women pursuing technical education with annual tuition grant and contingency allowance to advance women participation in technical fields.',
    amount: 50000,
    minimumPercentage: 65,
    maximumIncome: 800000,
    eligibleCourse: ['B.Tech', 'M.Tech', 'MCA', 'B.Sc'],
    eligibleYear: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    eligibleState: ['All'],
    genderEligibility: 'Female',
    startDate: '2026-02-01',
    endDate: '2026-12-15',
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      'Community Certificate',
      '10th Marksheet',
      '12th Marksheet',
      'Bonafide Certificate',
      'Bank Passbook',
      'Passport Size Photo'
    ],
    status: 'Active',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'SCH_004',
    name: 'EWS Higher Education Support Grant',
    provider: 'State Higher Education Welfare Council',
    category: 'Need-Based',
    description: 'Direct financial subsidy for meritorious candidates from economically weaker sections to cover college tuition and hostel accommodation expenses.',
    amount: 40000,
    minimumPercentage: 60,
    maximumIncome: 250000,
    eligibleCourse: ['All'],
    eligibleYear: ['All'],
    eligibleState: ['Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu'],
    genderEligibility: 'All',
    startDate: '2026-01-10',
    endDate: '2026-09-30',
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      'Community Certificate',
      'College ID',
      'Bank Passbook'
    ],
    status: 'Active',
    createdAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'SCH_005',
    name: 'Dr. APJ Abdul Kalam Research & Innovation Fellowship',
    provider: 'National Innovation Foundation',
    category: 'Research & Innovation',
    description: 'Prestigious national scholarship awarded to exceptional young researchers and innovators working on patentable engineering projects and scientific breakthroughs.',
    amount: 120000,
    minimumPercentage: 85,
    maximumIncome: 1000000,
    eligibleCourse: ['B.Tech', 'M.Tech', 'M.Sc', 'Ph.D'],
    eligibleYear: ['3rd Year', '4th Year'],
    eligibleState: ['All'],
    genderEligibility: 'All',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    requiredDocuments: [
      'Aadhaar Card',
      'Bonafide Certificate',
      'College ID',
      '12th Marksheet',
      'Passport Size Photo'
    ],
    status: 'Upcoming',
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'SCH_006',
    name: 'Central Sector Scheme for University Students 2025',
    provider: 'Department of Higher Education',
    category: 'Merit-Based',
    description: 'Annual stipend for top percentile scorers in Class 12 board examinations pursuing regular degree courses in recognized universities.',
    amount: 20000,
    minimumPercentage: 80,
    maximumIncome: 450000,
    eligibleCourse: ['All'],
    eligibleYear: ['1st Year'],
    eligibleState: ['All'],
    genderEligibility: 'All',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    requiredDocuments: [
      'Aadhaar Card',
      'Income Certificate',
      '12th Marksheet',
      'Bank Passbook'
    ],
    status: 'Closed',
    createdAt: '2025-08-01T00:00:00Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'SCH20260001',
    studentId: 'STU_001',
    scholarshipId: 'SCH_001',
    applicationDate: '2026-02-10',
    status: 'Verified',
    remarks: 'All academic credentials and income certificates verified by administrative officer.',
    lastUpdated: '2026-02-18',
    bankDetails: {
      accountHolderName: 'Rahul Sharma',
      bankName: 'State Bank of India',
      accountNumber: '30981273918',
      ifscCode: 'SBIN0001423',
      branchName: 'Pune University Campus Branch'
    },
    declarationAccepted: true
  },
  {
    id: 'SCH20260002',
    studentId: 'STU_002',
    scholarshipId: 'SCH_003',
    applicationDate: '2026-02-14',
    status: 'Approved',
    remarks: 'Application sanctioned for grant disbursement. First installment processed.',
    lastUpdated: '2026-02-25',
    bankDetails: {
      accountHolderName: 'Priya Patel',
      bankName: 'Bank of Baroda',
      accountNumber: '48190283019',
      ifscCode: 'BARB0AHMEDA',
      branchName: 'Navrangpura Branch'
    },
    declarationAccepted: true
  },
  {
    id: 'SCH20260003',
    studentId: 'STU_001',
    scholarshipId: 'SCH_002',
    applicationDate: '2026-03-01',
    status: 'Under Review',
    remarks: 'Application under administrative review. Document verification in progress.',
    lastUpdated: '2026-03-02',
    bankDetails: {
      accountHolderName: 'Rahul Sharma',
      bankName: 'State Bank of India',
      accountNumber: '30981273918',
      ifscCode: 'SBIN0001423',
      branchName: 'Pune University Campus Branch'
    },
    declarationAccepted: true
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'DOC_001',
    applicationId: 'SCH20260001',
    studentId: 'STU_001',
    documentType: 'Aadhaar Card',
    fileName: 'Aadhaar_RahulSharma.pdf',
    fileSize: '1.2 MB',
    verificationStatus: 'Verified',
    remarks: 'Aadhaar details match student profile name and DOB.',
    uploadedAt: '2026-02-10T11:00:00Z'
  },
  {
    id: 'DOC_002',
    applicationId: 'SCH20260001',
    studentId: 'STU_001',
    documentType: 'Income Certificate',
    fileName: 'Income_Certificate_2025_26.pdf',
    fileSize: '1.8 MB',
    verificationStatus: 'Verified',
    remarks: 'Revenue authority seal valid. Income Rs. 3,20,000 verified.',
    uploadedAt: '2026-02-10T11:05:00Z'
  },
  {
    id: 'DOC_003',
    applicationId: 'SCH20260001',
    studentId: 'STU_001',
    documentType: '10th Marksheet',
    fileName: 'Class_10_Marksheet.pdf',
    fileSize: '2.1 MB',
    verificationStatus: 'Verified',
    remarks: 'Percentage 91.2% verified against board roll number.',
    uploadedAt: '2026-02-10T11:08:00Z'
  },
  {
    id: 'DOC_004',
    applicationId: 'SCH20260002',
    studentId: 'STU_002',
    documentType: 'Aadhaar Card',
    fileName: 'Priya_Patel_Aadhaar.pdf',
    fileSize: '950 KB',
    verificationStatus: 'Verified',
    remarks: 'Verified successfully.',
    uploadedAt: '2026-02-14T12:00:00Z'
  },
  {
    id: 'DOC_005',
    applicationId: 'SCH20260002',
    studentId: 'STU_002',
    documentType: 'Bonafide Certificate',
    fileName: 'LDCE_Bonafide_Certificate.pdf',
    fileSize: '1.4 MB',
    verificationStatus: 'Verified',
    remarks: 'College principal signature and stamp verified.',
    uploadedAt: '2026-02-14T12:05:00Z'
  },
  {
    id: 'DOC_006',
    applicationId: 'SCH20260003',
    studentId: 'STU_001',
    documentType: 'Bonafide Certificate',
    fileName: 'PICT_Bonafide_2026.pdf',
    fileSize: '1.1 MB',
    verificationStatus: 'Pending',
    remarks: 'Awaiting review from officer.',
    uploadedAt: '2026-03-01T15:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF_001',
    userId: 'USR_STU_01',
    title: 'Document Verified',
    message: 'Your documents for scholarship application SCH20260001 have been verified successfully.',
    status: 'Read',
    createdAt: '2026-02-18T14:00:00Z',
    type: 'success'
  },
  {
    id: 'NOTIF_002',
    userId: 'USR_STU_01',
    title: 'Application Submitted',
    message: 'Your scholarship application SCH20260003 for Post-Matric STEM Excellence Scholarship was submitted successfully.',
    status: 'Unread',
    createdAt: '2026-03-01T15:35:00Z',
    type: 'info'
  },
  {
    id: 'NOTIF_003',
    userId: 'USR_STU_02',
    title: 'Application Approved! 🎉',
    message: 'Congratulations! Your application SCH20260002 for Pragati Scholarship Scheme has been approved by the Administrator.',
    status: 'Unread',
    createdAt: '2026-02-25T16:20:00Z',
    type: 'success'
  },
  {
    id: 'NOTIF_004',
    userId: 'USR_ADMIN_01',
    title: 'New Application Received',
    message: 'Student Rahul Sharma submitted application SCH20260003 for Post-Matric STEM Excellence Scholarship.',
    status: 'Unread',
    createdAt: '2026-03-01T15:35:00Z',
    type: 'info'
  },
  {
    id: 'NOTIF_005',
    userId: 'USR_ADMIN_01',
    title: 'Upcoming Deadline Alert',
    message: 'National Merit Scholarship Scheme 2026 deadline is approaching in 45 days.',
    status: 'Read',
    createdAt: '2026-02-28T09:00:00Z',
    type: 'warning'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  allowNewRegistrations: true,
  maintenanceMode: false,
  academicYear: '2025 - 2026',
  contactEmail: 'support@scholarships.gov.in',
  helplineNumber: '1800-118-005 (Toll Free: 9 AM - 6 PM)'
};
