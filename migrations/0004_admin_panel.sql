-- Panel de administración (admin.forwinnersec.com): contenido editable de la web,
-- usuarios del panel y datos de gestión (estudiantes, pagos, asistencia, notas, profesores).
-- La web pública solo LEE la fila content.key = 'site_published'.

CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,                -- 'operations' | 'site_draft' | 'site_published'
    value TEXT NOT NULL,                 -- JSON
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT
);

CREATE TABLE IF NOT EXISTS content_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saved_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_content_history_key ON content_history(key, saved_at);

CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    pass_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
    perms TEXT NOT NULL DEFAULT '[]',    -- JSON: módulos a los que tiene acceso
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- Imágenes subidas desde el panel (servidas por la web en /m/<id>).
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    mime TEXT NOT NULL,
    data BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notas de simulacros y pruebas.
CREATE TABLE IF NOT EXISTS exam_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    group_id INTEGER,
    exam_name TEXT NOT NULL,
    exam_date TEXT,
    score REAL NOT NULL,
    max_score REAL NOT NULL DEFAULT 100,
    sections TEXT,                       -- JSON: puntaje por sección
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES people(id),
    FOREIGN KEY (group_id) REFERENCES course_groups(id)
);
CREATE INDEX IF NOT EXISTS idx_exam_scores_student ON exam_scores(student_id, exam_date);

-- Pagos a profesores por periodo.
CREATE TABLE IF NOT EXISTS teacher_payouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    period TEXT NOT NULL,                -- 'AAAA-MM'
    hours REAL NOT NULL DEFAULT 0,
    amount REAL NOT NULL DEFAULT 0,
    paid_at TEXT,
    notes TEXT,
    FOREIGN KEY (teacher_id) REFERENCES people(id),
    UNIQUE (teacher_id, period)
);

-- Columnas nuevas en las tablas existentes.
ALTER TABLE people ADD COLUMN notes TEXT;
ALTER TABLE people ADD COLUMN hourly_rate REAL;
ALTER TABLE people ADD COLUMN guardian_name TEXT;
ALTER TABLE people ADD COLUMN guardian_phone TEXT;
ALTER TABLE people ADD COLUMN school TEXT;
ALTER TABLE people ADD COLUMN target TEXT;           -- universidad / carrera objetivo
ALTER TABLE people ADD COLUMN subjects TEXT;         -- profesores: materias que dicta

ALTER TABLE courses ADD COLUMN course_key TEXT;      -- id del curso en el panel (ej. utn-normal-fica)
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_key ON courses(course_key);

ALTER TABLE course_groups ADD COLUMN schedule_note TEXT;
ALTER TABLE course_groups ADD COLUMN plan_id TEXT;   -- plan de clases asociado

ALTER TABLE enrollments ADD COLUMN installments INTEGER NOT NULL DEFAULT 1;
ALTER TABLE enrollments ADD COLUMN discount TEXT;
ALTER TABLE enrollments ADD COLUMN notes TEXT;

ALTER TABLE payments ADD COLUMN due_date TEXT;
ALTER TABLE payments ADD COLUMN installment_no INTEGER;
CREATE INDEX IF NOT EXISTS idx_payments_due ON payments(status, due_date);

ALTER TABLE class_sessions ADD COLUMN teacher_id INTEGER;

ALTER TABLE inquiries ADD COLUMN notes TEXT;
ALTER TABLE inquiries ADD COLUMN student_id INTEGER;
ALTER TABLE inquiries ADD COLUMN updated_at TEXT;
