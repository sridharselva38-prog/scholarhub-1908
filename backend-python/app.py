#!/usr/bin/env python3
"""
SCHOLARSHIP MANAGEMENT SYSTEM
Final-Year College Project - Python Backend Implementation
Modules 1 through 15: Authentication, Profiles, Scholarships, Eligibility, Applications,
Documents, Tracking, Admin Dashboard, Reports, Database Management, and Security.
"""

import sqlite3
import hashlib
import json
import os
import sys
from datetime import datetime

DB_FILE = "scholarship_system.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def initialize_database():
    """Initializes the relational schema with constraints and foreign keys."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mobile TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('student', 'admin')) NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
        student_id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT NOT NULL,
        address TEXT,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        college TEXT NOT NULL,
        course TEXT NOT NULL,
        year TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS academic_details (
        academic_id TEXT PRIMARY KEY,
        student_id TEXT UNIQUE NOT NULL,
        percentage REAL DEFAULT 0.0,
        cgpa REAL DEFAULT 0.0,
        tenth_mark REAL DEFAULT 0.0,
        twelfth_mark REAL DEFAULT 0.0,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS family_details (
        family_id TEXT PRIMARY KEY,
        student_id TEXT UNIQUE NOT NULL,
        family_income REAL DEFAULT 0.0,
        father_name TEXT,
        mother_name TEXT,
        occupation TEXT,
        family_members INTEGER DEFAULT 1,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scholarships (
        scholarship_id TEXT PRIMARY KEY,
        scholarship_name TEXT NOT NULL,
        provider TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        amount REAL NOT NULL,
        minimum_percentage REAL NOT NULL,
        maximum_income REAL NOT NULL,
        eligible_course TEXT NOT NULL, -- JSON array string or 'All'
        eligible_state TEXT NOT NULL,  -- JSON array string or 'All'
        gender_eligibility TEXT DEFAULT 'All',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        status TEXT CHECK(status IN ('Active', 'Upcoming', 'Closed')) DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS applications (
        application_id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        scholarship_id TEXT NOT NULL,
        application_date TEXT NOT NULL,
        status TEXT CHECK(status IN ('Submitted', 'Under Review', 'Documents Pending', 'Verified', 'Approved', 'Rejected')) DEFAULT 'Submitted',
        remarks TEXT,
        rejection_reason TEXT,
        bank_name TEXT,
        account_number TEXT,
        ifsc_code TEXT,
        last_updated TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS documents (
        document_id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        document_type TEXT NOT NULL,
        document_path TEXT NOT NULL,
        verification_status TEXT CHECK(verification_status IN ('Pending', 'Verified', 'Rejected')) DEFAULT 'Pending',
        remarks TEXT,
        uploaded_at TEXT NOT NULL,
        FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
        notification_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT CHECK(status IN ('Unread', 'Read')) DEFAULT 'Unread',
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    """)

    # Seed Admin if not exists
    cursor.execute("SELECT user_id FROM users WHERE email = 'admin@scholarships.gov.in'")
    if not cursor.fetchone():
        now = datetime.now().isoformat()
        cursor.execute("""
            INSERT INTO users (user_id, name, email, mobile, password, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ('USR_ADMIN_01', 'Dr. Alok Verma', 'admin@scholarships.gov.in', '9876543210', hash_password('admin'), 'admin', now))

        # Seed sample scholarship
        cursor.execute("""
            INSERT INTO scholarships (
                scholarship_id, scholarship_name, provider, category, description,
                amount, minimum_percentage, maximum_income, eligible_course, eligible_state,
                gender_eligibility, start_date, end_date, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            'SCH_001',
            'National Merit Scholarship Scheme 2026',
            'Ministry of Education, Govt. of India',
            'Merit-Based',
            'Direct financial subsidy for meritorious students across India.',
            50000.0,
            80.0,
            600000.0,
            json.dumps(['All']),
            json.dumps(['All']),
            'All',
            '2026-01-01',
            '2026-10-31',
            'Active'
        ))

    conn.commit()
    conn.close()

# ----------------- MODULE 1: AUTHENTICATION -----------------

def register_student(name, email, mobile, password, dob, gender, state, district, college, course, year):
    conn = get_connection()
    cursor = conn.cursor()
    user_id = f"USR_STU_{int(datetime.now().timestamp())}"
    student_id = f"STU_{int(datetime.now().timestamp())}"
    now = datetime.now().isoformat()

    try:
        cursor.execute("""
            INSERT INTO users (user_id, name, email, mobile, password, role, created_at)
            VALUES (?, ?, ?, ?, ?, 'student', ?)
        """, (user_id, name, email.lower().strip(), mobile, hash_password(password), now))

        cursor.execute("""
            INSERT INTO students (student_id, user_id, date_of_birth, gender, state, district, college, course, year)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (student_id, user_id, dob, gender, state, district, college, course, year))

        cursor.execute("""
            INSERT INTO academic_details (academic_id, student_id, percentage, cgpa, tenth_mark, twelfth_mark)
            VALUES (?, ?, 0.0, 0.0, 0.0, 0.0)
        """, (f"ACAD_{int(datetime.now().timestamp())}", student_id))

        cursor.execute("""
            INSERT INTO family_details (family_id, student_id, family_income, family_members)
            VALUES (?, ?, 0.0, 1)
        """, (f"FAM_{int(datetime.now().timestamp())}", student_id))

        conn.commit()
        return {"success": True, "student_id": student_id, "user_id": user_id}
    except sqlite3.IntegrityError as e:
        return {"success": False, "error": f"Email already exists or invalid data: {e}"}
    finally:
        conn.close()

def login_user(email, password, expected_role):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND role = ?", (email.lower().strip(), expected_role))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return {"success": False, "error": "Account not found for this role."}
    if user["password"] != hash_password(password):
        return {"success": False, "error": "Incorrect password."}

    return {"success": True, "user": dict(user)}

# ----------------- MODULE 5: ELIGIBILITY CHECKING -----------------

def check_eligibility(scholarship_id: str, student_id: str):
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

    if not sch:
        return {"eligible": False, "message": "Scholarship not found.", "reasons": ["Invalid scholarship ID"]}
    if not stu:
        return {"eligible": False, "message": "Student profile not found.", "reasons": ["Incomplete student profile"]}

    reasons = []
    matched = []

    # Check status
    if sch["status"] != "Active":
        reasons.append(f"Scholarship status is {sch['status']}")

    # Academic score
    stu_perc = stu["percentage"] or (stu["cgpa"] * 9.5 if stu["cgpa"] else 0)
    if stu_perc < sch["minimum_percentage"]:
        reasons.append(f"Percentage requirement not satisfied (Required: {sch['minimum_percentage']}%, Yours: {stu_perc:.1f}%)")
    else:
        matched.append(f"Percentage satisfied ({stu_perc:.1f}% >= {sch['minimum_percentage']}%)")

    # Income
    stu_income = stu["family_income"] or 0
    if stu_income > sch["maximum_income"]:
        reasons.append(f"Family income exceeds limit (Max: Rs. {sch['maximum_income']:,.0f}, Yours: Rs. {stu_income:,.0f})")
    else:
        matched.append(f"Family income within limit (Rs. {stu_income:,.0f} <= Rs. {sch['maximum_income']:,.0f})")

    # Gender
    if sch["gender_eligibility"] != "All" and stu["gender"] != sch["gender_eligibility"]:
        reasons.append(f"Gender requirement not satisfied ({sch['gender_eligibility']} only)")

    is_eligible = len(reasons) == 0
    return {
        "eligible": is_eligible,
        "message": "Congratulations! You are eligible for this scholarship." if is_eligible else "Sorry, you are not eligible for this scholarship.",
        "reasons": reasons,
        "matched_criteria": matched
    }

# ----------------- MODULE 6: SCHOLARSHIP APPLICATION -----------------

def submit_application(student_id: str, scholarship_id: str, bank_name: str, account_no: str, ifsc: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM applications")
    count = cursor.fetchone()[0] + 1
    app_id = f"SCH2026{count:04d}"
    now = datetime.now().strftime("%Y-%m-%d")

    try:
        cursor.execute("""
            INSERT INTO applications (application_id, student_id, scholarship_id, application_date, status, remarks, bank_name, account_number, ifsc_code, last_updated)
            VALUES (?, ?, ?, ?, 'Submitted', 'Application submitted by student.', ?, ?, ?, ?)
        """, (app_id, student_id, scholarship_id, now, bank_name, account_no, ifsc, now))

        # Send notification
        cursor.execute("SELECT user_id FROM students WHERE student_id = ?", (student_id,))
        user_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO notifications (notification_id, user_id, title, message, status, created_at)
            VALUES (?, ?, ?, ?, 'Unread', ?)
        """, (f"NOTIF_{int(datetime.now().timestamp())}", user_id, "Application Submitted", f"Your application {app_id} was submitted successfully.", datetime.now().isoformat()))

        conn.commit()
        return {"success": True, "application_id": app_id}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        conn.close()

# ----------------- MODULE 9 & 12: ADMIN DASHBOARD & REPORTS -----------------

def get_admin_dashboard_metrics():
    conn = get_connection()
    cursor = conn.cursor()

    metrics = {}
    metrics["total_students"] = cursor.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    metrics["total_scholarships"] = cursor.execute("SELECT COUNT(*) FROM scholarships").fetchone()[0]
    metrics["active_scholarships"] = cursor.execute("SELECT COUNT(*) FROM scholarships WHERE status = 'Active'").fetchone()[0]
    metrics["total_applications"] = cursor.execute("SELECT COUNT(*) FROM applications").fetchone()[0]
    metrics["pending_applications"] = cursor.execute("SELECT COUNT(*) FROM applications WHERE status IN ('Submitted', 'Under Review')").fetchone()[0]
    metrics["approved_applications"] = cursor.execute("SELECT COUNT(*) FROM applications WHERE status = 'Approved'").fetchone()[0]
    metrics["rejected_applications"] = cursor.execute("SELECT COUNT(*) FROM applications WHERE status = 'Rejected'").fetchone()[0]
    metrics["documents_pending"] = cursor.execute("SELECT COUNT(*) FROM documents WHERE verification_status = 'Pending'").fetchone()[0]

    conn.close()
    return metrics

if __name__ == "__main__":
    print("=" * 65)
    print("  SCHOLARSHIP MANAGEMENT SYSTEM - PYTHON BACKEND SERVICE")
    print("=" * 65)
    initialize_database()
    print("[✓] Database initialized successfully (SQLite)")
    print(f"[✓] Admin metrics: {get_admin_dashboard_metrics()}")
    print("[✓] System ready.")
