-- ==========================================================
-- SCHOLARSHIP MANAGEMENT SYSTEM
-- Relational Database Schema (DDL)
-- Compliant with MODULE 13: Database Management
-- Compatible with SQLite, PostgreSQL, and MySQL
-- ==========================================================

-- 1. Users Table (Students & Administrators)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK(role IN ('student', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Profile Table
CREATE TABLE IF NOT EXISTS students (
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

-- 3. Academic Details Table
CREATE TABLE IF NOT EXISTS academic_details (
    academic_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    cgpa DECIMAL(4,2) DEFAULT 0.00,
    tenth_mark DECIMAL(5,2) DEFAULT 0.00,
    twelfth_mark DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- 4. Family Details Table
CREATE TABLE IF NOT EXISTS family_details (
    family_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    family_income DECIMAL(12,2) NOT NULL,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    occupation VARCHAR(100),
    family_members INT DEFAULT 1,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- 5. Scholarships Schemes Table
CREATE TABLE IF NOT EXISTS scholarships (
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
    status VARCHAR(20) CHECK(status IN ('Active', 'Upcoming', 'Closed')) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id VARCHAR(50) PRIMARY KEY, -- e.g. 'SCH20260001'
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
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
);

-- 7. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    document_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_path VARCHAR(255) NOT NULL,
    verification_status VARCHAR(20) CHECK(verification_status IN ('Pending', 'Verified', 'Rejected')) DEFAULT 'Pending',
    remarks TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK(status IN ('Unread', 'Read')) DEFAULT 'Unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_app ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
