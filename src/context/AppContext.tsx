import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ACADEMIC,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_FAMILY,
  INITIAL_NOTIFICATIONS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_USERS
} from '../data/initialData';
import {
  AcademicDetails,
  Application,
  ApplicationStatus,
  BankDetails,
  DocumentRecord,
  DocumentVerificationStatus,
  FamilyDetails,
  NotificationItem,
  Scholarship,
  StudentProfile,
  SystemSettings,
  User,
  UserRole
} from '../types';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface RegisterStudentData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  district: string;
  college: string;
  course: string;
  yearOfStudy: string;
}

interface AppContextType {
  currentUser: User | null;
  currentStudentProfile: StudentProfile | null;
  currentAcademicDetails: AcademicDetails | null;
  currentFamilyDetails: FamilyDetails | null;
  users: User[];
  students: StudentProfile[];
  academicDetails: AcademicDetails[];
  familyDetails: FamilyDetails[];
  scholarships: Scholarship[];
  applications: Application[];
  documents: DocumentRecord[];
  notifications: NotificationItem[];
  settings: SystemSettings;
  activeTab: string;
  toast: ToastState | null;
  showToast: (message: string, type?: ToastState['type']) => void;
  setActiveTab: (tab: string) => void;
  login: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  loginWithGoogle: (googleProfile: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: UserRole;
  }) => { success: boolean; error?: string };
  loginAsDemoStudent: (studentEmail?: string) => void;
  loginAsDemoAdmin: () => void;
  registerStudent: (data: RegisterStudentData) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (
    profile: Partial<StudentProfile>,
    academic: Partial<AcademicDetails>,
    family: Partial<FamilyDetails>
  ) => void;
  updateStudentProfile: (
    profile: Partial<StudentProfile>,
    academic: Partial<AcademicDetails>,
    family: Partial<FamilyDetails>
  ) => void;
  addScholarship: (scholarship: Omit<Scholarship, 'id' | 'createdAt'>) => void;
  updateScholarship: (scholarship: Scholarship) => void;
  deleteScholarship: (id: string) => void;
  applyForScholarship: (
    scholarshipId: string,
    bankDetails: BankDetails,
    uploadedDocuments: Array<{ docType: string; fileName: string; fileSize: string }>
  ) => { success: boolean; applicationId?: string; error?: string };
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
    remarks: string,
    rejectionReason?: string
  ) => void;
  updateDocumentStatus: (
    docId: string,
    status: DocumentVerificationStatus,
    remarks?: string
  ) => void;
  uploadDocumentForApplication: (
    applicationId: string,
    documentType: string,
    fileName: string,
    fileSize: string
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'sms_users_v1',
  STUDENTS: 'sms_students_v1',
  ACADEMIC: 'sms_academic_v1',
  FAMILY: 'sms_family_v1',
  SCHOLARSHIPS: 'sms_scholarships_v1',
  APPLICATIONS: 'sms_applications_v1',
  DOCUMENTS: 'sms_documents_v1',
  NOTIFICATIONS: 'sms_notifications_v1',
  SETTINGS: 'sms_settings_v1',
  CURRENT_USER: 'sms_current_user_v1'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [students, setStudents] = useState<StudentProfile[]>(() => loadStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS));
  const [academicDetails, setAcademicDetails] = useState<AcademicDetails[]>(() => loadStorage(STORAGE_KEYS.ACADEMIC, INITIAL_ACADEMIC));
  const [familyDetails, setFamilyDetails] = useState<FamilyDetails[]>(() => loadStorage(STORAGE_KEYS.FAMILY, INITIAL_FAMILY));
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => loadStorage(STORAGE_KEYS.SCHOLARSHIPS, INITIAL_SCHOLARSHIPS));
  const [applications, setApplications] = useState<Application[]>(() => loadStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS));
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => loadStorage(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  const [settings, setSettings] = useState<SystemSettings>(() => loadStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1])); // Default to Rahul Sharma for instant demo
  const [activeTab, setActiveTab] = useState<string>('home');
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(academicDetails));
  }, [academicDetails]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(familyDetails));
  }, [familyDetails]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
  }, [scholarships]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Find logged in student details
  const currentStudentProfile = currentUser && currentUser.role === 'student'
    ? students.find(s => s.userId === currentUser.id) || null
    : null;

  const currentAcademicDetails = currentStudentProfile
    ? academicDetails.find(a => a.studentId === currentStudentProfile.studentId) || null
    : null;

  const currentFamilyDetails = currentStudentProfile
    ? familyDetails.find(f => f.studentId === currentStudentProfile.studentId) || null
    : null;

  const login = (email: string, password: string, role: UserRole) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail && u.role === role);

    if (!user) {
      return { success: false, error: `No account found with this email for role ${role}.` };
    }

    if (user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('home');
    }
    showToast(`Welcome back, ${user.name}! Logged in as ${user.role}.`, 'success');
    return { success: true };
  };

  const loginWithGoogle = (googleProfile: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: UserRole;
  }) => {
    const trimmedEmail = googleProfile.email.trim().toLowerCase();
    const targetRole = googleProfile.role || 'student';

    // Check if user already exists
    let user = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      // Create user
      const userId = `USR_G_${Date.now().toString().slice(-4)}`;
      user = {
        id: userId,
        name: googleProfile.name.trim() || trimmedEmail.split('@')[0],
        email: trimmedEmail,
        mobile: '9876543210',
        role: targetRole,
        authProvider: 'google',
        avatarUrl: googleProfile.avatarUrl,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [user!, ...prev]);

      if (targetRole === 'student') {
        const studentId = `STU_G_${Date.now().toString().slice(-4)}`;
        const newProfile: StudentProfile = {
          studentId,
          userId,
          dateOfBirth: '2004-05-15',
          gender: 'Male',
          address: 'Main University Enclave',
          district: 'Chennai',
          state: 'Tamil Nadu',
          college: 'Government College of Engineering',
          university: 'State Technological University',
          course: 'B.Tech',
          department: 'Computer Science and Engineering',
          yearOfStudy: '3rd Year',
          semester: '5th Semester'
        };

        const newAcademic: AcademicDetails = {
          academicId: `ACAD_G_${Date.now().toString().slice(-4)}`,
          studentId,
          percentage: 84.5,
          cgpa: 8.7,
          tenthMark: 91.0,
          twelfthMark: 88.5
        };

        const newFamily: FamilyDetails = {
          familyId: `FAM_G_${Date.now().toString().slice(-4)}`,
          studentId,
          familyIncome: 350000,
          fatherName: 'Father / Guardian',
          motherName: 'Mother',
          guardianName: 'Father / Guardian',
          occupation: 'Salaried / Private Service',
          familyMembers: 4
        };

        setStudents(prev => [newProfile, ...prev]);
        setAcademicDetails(prev => [newAcademic, ...prev]);
        setFamilyDetails(prev => [newFamily, ...prev]);
      }
    } else {
      // If user exists, update avatar or provider if not set
      if (googleProfile.avatarUrl || user.authProvider !== 'google') {
        user = {
          ...user,
          avatarUrl: googleProfile.avatarUrl || user.avatarUrl,
          authProvider: 'google'
        };
        setUsers(prev => prev.map(u => (u.id === user!.id ? user! : u)));
      }
    }

    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('home');
    }
    showToast(`Signed in with Google as ${user.name} (${user.email})`, 'success');
    return { success: true };
  };

  const loginAsDemoStudent = (email?: string) => {
    const targetEmail = email || 'rahul.sharma@college.edu';
    const user = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase() && u.role === 'student');
    if (user) {
      setCurrentUser(user);
      setActiveTab('home');
      showToast(`Logged in as Student: ${user.name}`, 'success');
    }
  };

  const loginAsDemoAdmin = () => {
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      setCurrentUser(admin);
      setActiveTab('admin-dashboard');
      showToast(`Logged in as Administrator: ${admin.name}`, 'success');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('login');
    showToast('You have been logged out successfully.', 'info');
  };

  const registerStudent = (data: RegisterStudentData) => {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const userId = `USR_STU_${Date.now().toString().slice(-4)}`;
    const studentId = `STU_${Date.now().toString().slice(-4)}`;

    const newUser: User = {
      id: userId,
      name: data.name.trim(),
      email: trimmedEmail,
      mobile: data.mobile.trim(),
      password: data.password,
      role: 'student',
      createdAt: new Date().toISOString()
    };

    const newProfile: StudentProfile = {
      studentId,
      userId,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: '',
      district: data.district,
      state: data.state,
      college: data.college,
      university: '',
      course: data.course,
      department: '',
      yearOfStudy: data.yearOfStudy,
      semester: '1st Semester'
    };

    const newAcademic: AcademicDetails = {
      academicId: `ACAD_${Date.now().toString().slice(-4)}`,
      studentId,
      percentage: 0,
      cgpa: 0,
      tenthMark: 0,
      twelfthMark: 0
    };

    const newFamily: FamilyDetails = {
      familyId: `FAM_${Date.now().toString().slice(-4)}`,
      studentId,
      familyIncome: 0,
      fatherName: '',
      motherName: '',
      guardianName: '',
      occupation: '',
      familyMembers: 1
    };

    const welcomeNotification: NotificationItem = {
      id: `NOTIF_${Date.now()}`,
      userId,
      title: 'Welcome to Scholarship Portal',
      message: 'Welcome! Please complete your academic and family details in your profile to discover eligible scholarships.',
      status: 'Unread',
      createdAt: new Date().toISOString(),
      type: 'info'
    };

    setUsers(prev => [...prev, newUser]);
    setStudents(prev => [...prev, newProfile]);
    setAcademicDetails(prev => [...prev, newAcademic]);
    setFamilyDetails(prev => [...prev, newFamily]);
    setNotifications(prev => [welcomeNotification, ...prev]);

    setCurrentUser(newUser);
    setActiveTab('profile');
    showToast('Registration successful! Please complete your profile.', 'success');
    return { success: true };
  };

  const updateProfile = (
    profileUpdates: Partial<StudentProfile>,
    academicUpdates: Partial<AcademicDetails>,
    familyUpdates: Partial<FamilyDetails>
  ) => {
    if (!currentStudentProfile) return;

    setStudents(prev =>
      prev.map(p => (p.studentId === currentStudentProfile.studentId ? { ...p, ...profileUpdates } : p))
    );

    setAcademicDetails(prev =>
      prev.map(a => (a.studentId === currentStudentProfile.studentId ? { ...a, ...academicUpdates } : a))
    );

    setFamilyDetails(prev =>
      prev.map(f => (f.studentId === currentStudentProfile.studentId ? { ...f, ...familyUpdates } : f))
    );

    showToast('Profile updated successfully!', 'success');
  };

  const addScholarship = (scholarshipData: Omit<Scholarship, 'id' | 'createdAt'>) => {
    const newId = `SCH_${(scholarships.length + 1).toString().padStart(3, '0')}`;
    const newScholarship: Scholarship = {
      ...scholarshipData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    setScholarships(prev => [newScholarship, ...prev]);

    // Send notification to all students
    const newNotifs: NotificationItem[] = students.map(s => ({
      id: `NOTIF_${Date.now()}_${s.studentId}`,
      userId: s.userId,
      title: 'New Scholarship Available',
      message: `A new scholarship "${newScholarship.name}" with grant amount of ₹${newScholarship.amount.toLocaleString()} is now open for applications.`,
      status: 'Unread',
      createdAt: new Date().toISOString(),
      type: 'info'
    }));

    setNotifications(prev => [...newNotifs, ...prev]);
    showToast(`Scholarship "${newScholarship.name}" created successfully.`, 'success');
  };

  const updateScholarship = (updated: Scholarship) => {
    setScholarships(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    showToast(`Scholarship "${updated.name}" updated successfully.`, 'success');
  };

  const deleteScholarship = (id: string) => {
    const target = scholarships.find(s => s.id === id);
    setScholarships(prev => prev.filter(s => s.id !== id));
    showToast(`Scholarship "${target?.name || id}" was deleted.`, 'info');
  };

  const applyForScholarship = (
    scholarshipId: string,
    bankDetails: BankDetails,
    uploadedDocuments: Array<{ docType: string; fileName: string; fileSize: string }>
  ) => {
    if (!currentStudentProfile || !currentUser) {
      return { success: false, error: 'You must be logged in as a student to apply.' };
    }

    const existingApp = applications.find(
      a => a.studentId === currentStudentProfile.studentId && a.scholarshipId === scholarshipId
    );
    if (existingApp) {
      return {
        success: false,
        error: `You have already submitted an application (${existingApp.id}) for this scholarship.`
      };
    }

    const targetScholarship = scholarships.find(s => s.id === scholarshipId);
    if (!targetScholarship) {
      return { success: false, error: 'Scholarship scheme not found.' };
    }

    const seqNumber = (applications.length + 1).toString().padStart(4, '0');
    const newAppId = `SCH2026${seqNumber}`;
    const today = new Date().toISOString().split('T')[0];

    const newApplication: Application = {
      id: newAppId,
      studentId: currentStudentProfile.studentId,
      scholarshipId,
      applicationDate: today,
      status: 'Submitted',
      remarks: 'Application submitted successfully. Under preliminary review.',
      lastUpdated: today,
      bankDetails,
      declarationAccepted: true
    };

    const newDocs: DocumentRecord[] = uploadedDocuments.map((doc, idx) => ({
      id: `DOC_${Date.now()}_${idx}`,
      applicationId: newAppId,
      studentId: currentStudentProfile.studentId,
      documentType: doc.docType,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      verificationStatus: 'Pending',
      remarks: 'Awaiting administrative verification.',
      uploadedAt: new Date().toISOString()
    }));

    const studentNotif: NotificationItem = {
      id: `NOTIF_${Date.now()}_STU`,
      userId: currentUser.id,
      title: 'Application Submitted',
      message: `Your scholarship application ${newAppId} for ${targetScholarship.name} was submitted successfully.`,
      status: 'Unread',
      createdAt: new Date().toISOString(),
      type: 'success'
    };

    const adminUsers = users.filter(u => u.role === 'admin');
    const adminNotifs: NotificationItem[] = adminUsers.map(a => ({
      id: `NOTIF_${Date.now()}_ADM_${a.id}`,
      userId: a.id,
      title: 'New Application Received',
      message: `Student ${currentUser.name} submitted application ${newAppId} for ${targetScholarship.name}.`,
      status: 'Unread',
      createdAt: new Date().toISOString(),
      type: 'info'
    }));

    setApplications(prev => [newApplication, ...prev]);
    setDocuments(prev => [...newDocs, ...prev]);
    setNotifications(prev => [studentNotif, ...adminNotifs, ...prev]);

    showToast(`Application ${newAppId} submitted successfully!`, 'success');
    return { success: true, applicationId: newAppId };
  };

  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    remarks: string,
    rejectionReason?: string
  ) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    const student = students.find(s => s.studentId === app.studentId);
    const scholarship = scholarships.find(s => s.id === app.scholarshipId);

    const today = new Date().toISOString().split('T')[0];
    setApplications(prev =>
      prev.map(a =>
        a.id === applicationId
          ? {
              ...a,
              status,
              remarks,
              rejectionReason: status === 'Rejected' ? rejectionReason || remarks : undefined,
              lastUpdated: today
            }
          : a
      )
    );

    if (student) {
      let notifTitle = `Application Status Updated: ${status}`;
      let notifType: NotificationItem['type'] = 'info';

      if (status === 'Approved') {
        notifTitle = 'Scholarship Application Approved! 🎉';
        notifType = 'success';
      } else if (status === 'Rejected') {
        notifTitle = 'Scholarship Application Rejected';
        notifType = 'error';
      } else if (status === 'Verified') {
        notifTitle = 'Documents & Eligibility Verified';
        notifType = 'success';
      }

      const notifMsg =
        status === 'Rejected'
          ? `Your application ${applicationId} for ${scholarship?.name || 'Scholarship'} was rejected. Reason: ${rejectionReason || remarks}`
          : `Your scholarship application ${applicationId} for ${scholarship?.name || 'Scholarship'} has moved to status: "${status}". Remarks: ${remarks}`;

      const newNotif: NotificationItem = {
        id: `NOTIF_${Date.now()}`,
        userId: student.userId,
        title: notifTitle,
        message: notifMsg,
        status: 'Unread',
        createdAt: new Date().toISOString(),
        type: notifType
      };

      setNotifications(prev => [newNotif, ...prev]);
    }

    showToast(`Application ${applicationId} marked as ${status}.`, 'success');
  };

  const updateDocumentStatus = (
    docId: string,
    status: DocumentVerificationStatus,
    remarks?: string
  ) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, verificationStatus: status, remarks: remarks || d.remarks } : d))
    );

    const student = students.find(s => s.studentId === doc.studentId);
    if (student) {
      const isVerified = status === 'Verified';
      const newNotif: NotificationItem = {
        id: `NOTIF_${Date.now()}`,
        userId: student.userId,
        title: isVerified ? 'Document Verified' : 'Document Rejected / Correction Needed',
        message: isVerified
          ? `Your document "${doc.documentType}" for application ${doc.applicationId} has been verified.`
          : `Your document "${doc.documentType}" for application ${doc.applicationId} was rejected. Reason: ${remarks || 'Please re-upload a clear copy.'}`,
        status: 'Unread',
        createdAt: new Date().toISOString(),
        type: isVerified ? 'success' : 'error'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    showToast(`Document marked as ${status}.`, 'info');
  };

  const uploadDocumentForApplication = (
    applicationId: string,
    documentType: string,
    fileName: string,
    fileSize: string
  ) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    const newDoc: DocumentRecord = {
      id: `DOC_${Date.now()}`,
      applicationId,
      studentId: app.studentId,
      documentType,
      fileName,
      fileSize,
      verificationStatus: 'Pending',
      remarks: 'Newly re-uploaded document pending officer verification.',
      uploadedAt: new Date().toISOString()
    };

    setDocuments(prev => [...prev, newDoc]);
    showToast(`Document "${fileName}" uploaded successfully.`, 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, status: 'Read' } : n)));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.userId === currentUser.id ? { ...n, status: 'Read' } : n))
    );
    showToast('All notifications marked as read.', 'info');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('System settings updated successfully.', 'success');
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setStudents(INITIAL_STUDENTS);
    setAcademicDetails(INITIAL_ACADEMIC);
    setFamilyDetails(INITIAL_FAMILY);
    setScholarships(INITIAL_SCHOLARSHIPS);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(INITIAL_USERS[1]);
    setActiveTab('home');
    showToast('System restored to sample college demonstration state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentStudentProfile,
        currentAcademicDetails,
        currentFamilyDetails,
        users,
        students,
        academicDetails,
        familyDetails,
        scholarships,
        applications,
        documents,
        notifications,
        settings,
        activeTab,
        toast,
        showToast,
        setActiveTab,
        login,
        loginWithGoogle,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        registerStudent,
        logout,
        updateProfile,
        updateStudentProfile: updateProfile,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        applyForScholarship,
        updateApplicationStatus,
        updateDocumentStatus,
        uploadDocumentForApplication,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateSettings,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
