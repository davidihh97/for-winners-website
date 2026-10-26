
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    person_type TEXT NOT NULL
        CHECK (person_type IN (
            'student', 'teacher', 'parent', 'admin'
        )),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL
        CHECK (category IN (
            'english', 'academic_support',
            'pre_university', 'other'
        )),
    description TEXT,
    modality TEXT NOT NULL DEFAULT 'in_person'
        CHECK (modality IN (
            'in_person', 'online', 'hybrid'
        )),
    price REAL NOT NULL DEFAULT 0 CHECK (price >= 0),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    teacher_id INTEGER,
    group_name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
    status TEXT NOT NULL DEFAULT 'planned'
        CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES people(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending', 'active', 'completed', 'cancelled'
        )),
    agreed_price REAL NOT NULL DEFAULT 0
        CHECK (agreed_price >= 0),
    FOREIGN KEY (student_id) REFERENCES people(id),
    FOREIGN KEY (group_id) REFERENCES course_groups(id),
    UNIQUE (student_id, group_id)
);

CREATE TABLE IF NOT EXISTS class_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    session_date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    topic TEXT,
    notes TEXT,
    FOREIGN KEY (group_id) REFERENCES course_groups(id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    status TEXT NOT NULL
        CHECK (status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES class_sessions(id),
    FOREIGN KEY (student_id) REFERENCES people(id),
    UNIQUE (session_id, student_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK (amount > 0),
    payment_date TEXT,
    payment_method TEXT,
    reference TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'void')),
    notes TEXT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    interested_course TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN (
            'new', 'contacted', 'enrolled', 'closed'
        )),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_people_type
    ON people(person_type);

CREATE INDEX IF NOT EXISTS idx_courses_status
    ON courses(status);

CREATE INDEX IF NOT EXISTS idx_groups_course
    ON course_groups(course_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_student
    ON enrollments(student_id);

CREATE INDEX IF NOT EXISTS idx_sessions_group_date
    ON class_sessions(group_id, session_date);

CREATE INDEX IF NOT EXISTS idx_payments_enrollment
    ON payments(enrollment_id, status);

CREATE INDEX IF NOT EXISTS idx_inquiries_status
    ON inquiries(status);
