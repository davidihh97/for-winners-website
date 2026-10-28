-- Límite de intentos por IP para que nadie pueda descargar los bancos de preguntas en masa.
CREATE TABLE IF NOT EXISTS rate_limits (
    k TEXT PRIMARY KEY,
    n INTEGER NOT NULL DEFAULT 0,
    reset_at INTEGER NOT NULL
);
