PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE IF NOT EXISTS hypotheses (
    id TEXT PRIMARY KEY
        CHECK (length(trim(id)) > 0),
    parent_hypothesis_id TEXT,
    change_axis TEXT,
    statement TEXT NOT NULL
        CHECK (length(trim(statement)) > 0),
    last_evaluated_at TEXT,
    created_at TEXT NOT NULL
        DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    closed_at TEXT,
    closure_reason TEXT,
    FOREIGN KEY (parent_hypothesis_id)
        REFERENCES hypotheses(id) ON DELETE RESTRICT,
    CHECK (
        parent_hypothesis_id IS NULL
        OR parent_hypothesis_id <> id
    ),
    CHECK (
        (parent_hypothesis_id IS NULL AND change_axis IS NULL)
        OR
        (
            parent_hypothesis_id IS NOT NULL
            AND change_axis IS NOT NULL
            AND change_axis IN ('message', 'copywriting')
        )
    ),
    CHECK (
        (closed_at IS NULL AND closure_reason IS NULL)
        OR
        (
            closed_at IS NOT NULL
            AND closure_reason IS NOT NULL
            AND length(trim(closure_reason)) > 0
        )
    )
);

CREATE TABLE IF NOT EXISTS contents (
    id TEXT PRIMARY KEY
        CHECK (length(trim(id)) > 0),
    hypothesis_id TEXT NOT NULL,
    message_id TEXT NOT NULL CHECK (length(trim(message_id)) > 0),
    message_version NOT NULL
        CHECK (typeof(message_version) = 'integer' AND message_version > 0),
    format_id TEXT NOT NULL CHECK (length(trim(format_id)) > 0),
    copywriting_version NOT NULL
        CHECK (
            typeof(copywriting_version) = 'integer'
            AND copywriting_version > 0
        ),
    template_path TEXT NOT NULL CHECK (length(trim(template_path)) > 0),
    template_sha256 TEXT NOT NULL
        CHECK (
            length(template_sha256) = 64
            AND template_sha256 NOT GLOB '*[^0-9a-f]*'
        ),
    caption TEXT NOT NULL,
    final_project_path TEXT NOT NULL UNIQUE
        CHECK (length(trim(final_project_path)) > 0),
    final_project_sha256 TEXT NOT NULL
        CHECK (
            length(final_project_sha256) = 64
            AND final_project_sha256 NOT GLOB '*[^0-9a-f]*'
        ),
    tiktok_url TEXT UNIQUE
        CHECK (tiktok_url IS NULL OR length(trim(tiktok_url)) > 0),
    published_at TEXT,
    FOREIGN KEY (hypothesis_id)
        REFERENCES hypotheses(id) ON DELETE RESTRICT,
    CHECK (
        (tiktok_url IS NULL AND published_at IS NULL)
        OR
        (tiktok_url IS NOT NULL AND published_at IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS content_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id TEXT NOT NULL,
    target_hours INTEGER NOT NULL CHECK (target_hours IN (24, 48, 72)),
    collected_at TEXT NOT NULL,
    views INTEGER CHECK (views IS NULL OR views >= 0),
    likes INTEGER CHECK (likes IS NULL OR likes >= 0),
    comments INTEGER CHECK (comments IS NULL OR comments >= 0),
    shares INTEGER CHECK (shares IS NULL OR shares >= 0),
    saves INTEGER CHECK (saves IS NULL OR saves >= 0),
    observed_summary TEXT,
    interpretation TEXT,
    limitations TEXT,
    raw_json TEXT NOT NULL DEFAULT '{}'
        CHECK (json_valid(raw_json)),
    FOREIGN KEY (content_id)
        REFERENCES contents(id) ON DELETE RESTRICT,
    UNIQUE (content_id, target_hours)
);

CREATE TABLE IF NOT EXISTS hypothesis_evidence (
    hypothesis_id TEXT NOT NULL,
    content_result_id INTEGER NOT NULL,
    PRIMARY KEY (hypothesis_id, content_result_id),
    FOREIGN KEY (hypothesis_id)
        REFERENCES hypotheses(id) ON DELETE RESTRICT,
    FOREIGN KEY (content_result_id)
        REFERENCES content_results(id) ON DELETE RESTRICT
);

CREATE TRIGGER IF NOT EXISTS preserve_contents_published_at
BEFORE UPDATE OF published_at ON contents
WHEN
    OLD.published_at IS NOT NULL
    AND (
        NEW.published_at IS NULL
        OR NEW.published_at <> OLD.published_at
    )
BEGIN
    SELECT RAISE(ABORT, 'published_at cannot change after publication');
END;

CREATE INDEX IF NOT EXISTS idx_hypotheses_parent
    ON hypotheses(parent_hypothesis_id);

CREATE INDEX IF NOT EXISTS idx_contents_hypothesis
    ON contents(hypothesis_id);

CREATE INDEX IF NOT EXISTS idx_contents_message
    ON contents(message_id, message_version);

CREATE INDEX IF NOT EXISTS idx_contents_format_copywriting
    ON contents(format_id, copywriting_version);

CREATE INDEX IF NOT EXISTS idx_content_results_content
    ON content_results(content_id, target_hours);

CREATE INDEX IF NOT EXISTS idx_hypothesis_evidence_result
    ON hypothesis_evidence(content_result_id);

PRAGMA user_version = 4;

COMMIT;
