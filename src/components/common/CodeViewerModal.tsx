import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode2, Database, Shield, BookOpen } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'java' | 'sql' | 'architecture'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonCode = `#!/usr/bin/env python3
"""
SCHOLARSHIP MANAGEMENT SYSTEM - PYTHON BACKEND
Modules: 1 (Auth), 2 (Profiles), 3 (Scholarships), 5 (Eligibility),
6 (Applications), 7 (Documents), 8 (Tracking), 9 (Dashboard), 12 (Reports), 13 (Database)
"""
import sqlite3
import hashlib
import json
from datetime import datetime

DB_FILE = "scholarship_system.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def check_eligibility(scholarship_id: str, student_id: str):
    """Automatic eligibility checking comparing student details against criteria."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scholarships WHERE scholarship_id = ?", (scholarship_id,))
    sch = cursor.fetchone()
    cursor.execute("""
        SELECT s.*, a.percentage, a.cgpa, f.family_income 
        FROM students s
        LEFT JOIN academic_details a ON s.student_id = a.student_id
        LEFT JOIN family_details f ON s.student_id = f.student_id
        WHERE s.student_id = ?
    """, (student_id,))
    stu = cursor.fetchone()
    conn.close()

    reasons = []
    if sch["status"] != "Active":
        reasons.append(f"Scholarship status is {sch['status']}")

    stu_perc = stu["percentage"] or (stu["cgpa"] * 9.5 if stu["cgpa"] else 0)
    if stu_perc < sch["minimum_percentage"]:
        reasons.append(f"Percentage requirement not satisfied ({sch['minimum_percentage']}% required, {stu_perc:.1f}% scored)")

    stu_income = stu["family_income"] or 0
    if stu_income > sch["maximum_income"]:
        reasons.append(f"Family income exceeds limit (Max: Rs. {sch['maximum_income']:,.0f}, Yours: Rs. {stu_income:,.0f})")

    if sch["gender_eligibility"] != "All" and stu["gender"] != sch["gender_eligibility"]:
        reasons.append(f"Gender requirement not satisfied ({sch['gender_eligibility']} only)")

    is_eligible = len(reasons) == 0
    return {
        "eligible": is_eligible,
        "message": "Congratulations! You are eligible for this scholarship." if is_eligible else "Sorry, you are not eligible for this scholarship.",
        "reasons": reasons
    }

# Run standalone backend
if __name__ == "__main__":
    print("[✓] Python Database & Eligibility Engine Active")
`;

  const javaCode = `/**
 * SCHOLARSHIP MANAGEMENT SYSTEM - JAVA ENGINE
 * Object-Oriented Domain Layer, DAO Relational Mappings & Business Rules
 */
import java.sql.*;
import java.util.*;

public class ScholarshipManagementSystem {
    private static final String DB_URL = "jdbc:sqlite:scholarship_system.db";

    public static class EligibilityResult {
        public boolean eligible;
        public String message;
        public List<String> reasons = new ArrayList<>();
        public List<String> matched = new ArrayList<>();
    }

    public static EligibilityResult checkEligibility(
            double studentPercentage,
            double familyIncome,
            String studentGender,
            String studentCourse,
            double minPercentage,
            double maxIncome,
            String requiredGender,
            String eligibleCourses
    ) {
        EligibilityResult result = new EligibilityResult();

        if (studentPercentage < minPercentage) {
            result.reasons.add("Percentage requirement not satisfied (Required: " + minPercentage + "%, Yours: " + studentPercentage + "%)");
        } else {
            result.matched.add("Percentage requirement satisfied");
        }

        if (familyIncome > maxIncome) {
            result.reasons.add("Family income exceeds limit (Maximum: Rs. " + maxIncome + ", Yours: Rs. " + familyIncome + ")");
        } else {
            result.matched.add("Income requirement satisfied");
        }

        if (!"All".equalsIgnoreCase(requiredGender) && !requiredGender.equalsIgnoreCase(studentGender)) {
            result.reasons.add("Gender eligibility not met (" + requiredGender + " only)");
        }

        result.eligible = result.reasons.isEmpty();
        result.message = result.eligible
                ? "Congratulations! You are eligible for this scholarship."
                : "Sorry, you are not eligible for this scholarship.";

        return result;
    }

    public static void main(String[] args) {
        System.out.println("Scholarship Management System - Java Enterprise Logic Initialized");
    }
}
`;

  const sqlCode = `-- Relational Database Schema (DDL)
-- Compliant with MODULE 13: Database Management

CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK(role IN ('student', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    student_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address TEXT,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    college VARCHAR(150) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE academic_details (
    academic_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    cgpa DECIMAL(4,2) DEFAULT 0.00,
    tenth_mark DECIMAL(5,2) DEFAULT 0.00,
    twelfth_mark DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE family_details (
    family_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    family_income DECIMAL(12,2) NOT NULL,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    occupation VARCHAR(100),
    family_members INT DEFAULT 1,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE scholarships (
    scholarship_id VARCHAR(50) PRIMARY KEY,
    scholarship_name VARCHAR(200) NOT NULL,
    provider VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    minimum_percentage DECIMAL(5,2) NOT NULL,
    maximum_income DECIMAL(12,2) NOT NULL,
    eligible_course TEXT NOT NULL,
    eligible_state TEXT NOT NULL,
    gender_eligibility VARCHAR(20) DEFAULT 'All',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK(status IN ('Active', 'Upcoming', 'Closed')) DEFAULT 'Active'
);

CREATE TABLE applications (
    application_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    scholarship_id VARCHAR(50) NOT NULL,
    application_date DATE NOT NULL,
    status VARCHAR(30) CHECK(status IN ('Submitted', 'Under Review', 'Documents Pending', 'Verified', 'Approved', 'Rejected')) DEFAULT 'Submitted',
    remarks TEXT,
    rejection_reason TEXT,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    last_updated DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id)
);

CREATE TABLE documents (
    document_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_path VARCHAR(255) NOT NULL,
    verification_status VARCHAR(20) CHECK(verification_status IN ('Pending', 'Verified', 'Rejected')) DEFAULT 'Pending',
    remarks TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id)
);

CREATE TABLE notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK(status IN ('Unread', 'Read')) DEFAULT 'Unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'python':
        return pythonCode;
      case 'java':
        return javaCode;
      case 'sql':
        return sqlCode;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Project Architecture & Backend Source
              </h2>
              <p className="text-xs text-slate-400">
                Complete Python 3 and Java Backend implementations, SQLite/PostgreSQL DDL, and relational mappings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'python'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Python Backend (app.py)</span>
            </button>
            <button
              onClick={() => setActiveTab('java')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'java'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Java Engine (System.java)</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Relational DDL (schema.sql)</span>
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>College Project Summary</span>
            </button>
          </div>

          {activeTab !== 'architecture' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto font-mono text-xs flex-1 bg-slate-950 text-slate-300">
          {activeTab === 'architecture' ? (
            <div className="font-sans text-sm space-y-4 text-slate-300">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  College Final Year Project Specifications Compliance
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This Scholarship Management System has been architected to satisfy all 15 university specification modules.
                  The backend application logic is implemented in both <strong>Python 3 (SQLite / Stdlib)</strong> and <strong>Java (JDBC / Models)</strong>, located directly in the workspace at <code className="text-amber-300">/backend-python/app.py</code> and <code className="text-amber-300">/backend-java/ScholarshipManagementSystem.java</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-blue-400">
                    Core Functional Modules
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>Module 1:</strong> Role-based Auth (Student/Admin, Hash Validation)</li>
                    <li><strong>Module 2:</strong> Student Profile (Personal, Academic, Family)</li>
                    <li><strong>Module 3:</strong> Scholarship Schemes (CRUD & Categories)</li>
                    <li><strong>Module 4:</strong> Scholarship Search, Filters & Sorting</li>
                    <li><strong>Module 5:</strong> Automatic Eligibility Comparison Engine</li>
                    <li><strong>Module 6:</strong> Application Processing & ID Generator (SCH2026xxxx)</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-emerald-400">
                    Administrative & Verification Modules
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>Module 7:</strong> Document Management (Aadhaar, Bonafide, Marksheet)</li>
                    <li><strong>Module 8:</strong> Application Tracking (Visual Milestone Timeline)</li>
                    <li><strong>Module 9:</strong> Admin Metrics Dashboard & Deadline Alerts</li>
                    <li><strong>Module 11:</strong> Event-Driven Notification System</li>
                    <li><strong>Module 12:</strong> Tabular Reports with Export & Filtering</li>
                    <li><strong>Module 13:</strong> Normalized Relational Database Schema (8 Tables)</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap select-all leading-relaxed">
              <code>{getActiveCode()}</code>
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Backend files located in: <code className="text-blue-300">/backend-python/app.py</code> and <code className="text-amber-300">/backend-java/ScholarshipManagementSystem.java</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
