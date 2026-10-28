-- Resultados de simuladores, diagnósticos y test vocacional (cada uno es también un contacto comercial).
CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    quiz TEXT NOT NULL,
    level TEXT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    score_pct INTEGER,
    result_json TEXT NOT NULL,
    email_status TEXT,
    whatsapp_status TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_quiz_date
    ON assessments(quiz, created_at);
