PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE IF NOT EXISTS contents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    problem TEXT NOT NULL CHECK (length(trim(problem)) > 0),
    hook_direction TEXT NOT NULL CHECK (length(trim(hook_direction)) > 0),
    core_perspective TEXT NOT NULL CHECK (length(trim(core_perspective)) > 0),
    objective TEXT NOT NULL DEFAULT 'persuasion'
        CHECK (objective IN ('persuasion', 'virality', 'mixed')),
    experiment_hypothesis TEXT NOT NULL CHECK (length(trim(experiment_hypothesis)) > 0),
    fixed_elements TEXT,
    changed_elements TEXT NOT NULL CHECK (length(trim(changed_elements)) > 0),
    expected_signal TEXT NOT NULL CHECK (length(trim(expected_signal)) > 0),
    message_id TEXT NOT NULL CHECK (length(trim(message_id)) > 0),
    format_id TEXT NOT NULL CHECK (length(trim(format_id)) > 0),
    template_id TEXT NOT NULL CHECK (length(trim(template_id)) > 0),
    template_path TEXT NOT NULL CHECK (length(trim(template_path)) > 0),
    template_sha256 TEXT NOT NULL
        CHECK (
            length(template_sha256) = 64
            AND template_sha256 NOT GLOB '*[^0-9a-f]*'
        ),
    slides_json TEXT NOT NULL
        CHECK (
            json_valid(slides_json)
            AND json_type(slides_json) = 'array'
            AND json_array_length(slides_json) > 0
        ),
    caption TEXT NOT NULL,
    final_project_path TEXT NOT NULL CHECK (length(trim(final_project_path)) > 0),
    final_project_sha256 TEXT NOT NULL
        CHECK (
            length(final_project_sha256) = 64
            AND final_project_sha256 NOT GLOB '*[^0-9a-f]*'
        ),
    status TEXT NOT NULL DEFAULT 'ready_to_post'
        CHECK (status IN ('ready_to_post', 'telegram_delivered', 'published')),
    telegram_delivered_at TEXT,
    tiktok_url TEXT UNIQUE,
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    CHECK (
        (
            status = 'ready_to_post'
            AND telegram_delivered_at IS NULL
            AND tiktok_url IS NULL
            AND published_at IS NULL
        )
        OR
        (
            status = 'telegram_delivered'
            AND telegram_delivered_at IS NOT NULL
            AND tiktok_url IS NULL
            AND published_at IS NULL
        )
        OR
        (
            status = 'published'
            AND telegram_delivered_at IS NOT NULL
            AND tiktok_url IS NOT NULL
            AND published_at IS NOT NULL
        )
    )
);

CREATE TABLE IF NOT EXISTS performance_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id TEXT NOT NULL,
    target_hours INTEGER NOT NULL CHECK (target_hours IN (24, 48, 72)),
    collected_at TEXT NOT NULL,
    views INTEGER CHECK (views IS NULL OR views >= 0),
    likes INTEGER CHECK (likes IS NULL OR likes >= 0),
    comments INTEGER CHECK (comments IS NULL OR comments >= 0),
    shares INTEGER CHECK (shares IS NULL OR shares >= 0),
    saves INTEGER CHECK (saves IS NULL OR saves >= 0),
    comment_summary TEXT,
    source TEXT NOT NULL CHECK (length(trim(source)) > 0),
    raw_json TEXT NOT NULL DEFAULT '{}'
        CHECK (json_valid(raw_json)),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    UNIQUE (content_id, target_hours)
);

CREATE TABLE IF NOT EXISTS content_reviews (
    content_id TEXT PRIMARY KEY,
    reviewed_at TEXT NOT NULL,
    observed_summary TEXT NOT NULL CHECK (length(trim(observed_summary)) > 0),
    message_interpretation TEXT NOT NULL CHECK (length(trim(message_interpretation)) > 0),
    format_interpretation TEXT NOT NULL CHECK (length(trim(format_interpretation)) > 0),
    limitations TEXT NOT NULL CHECK (length(trim(limitations)) > 0),
    hypothesis_outcome TEXT NOT NULL
        CHECK (hypothesis_outcome IN ('supported', 'contradicted', 'inconclusive')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contents_message
    ON contents(message_id, published_at);

CREATE INDEX IF NOT EXISTS idx_contents_format
    ON contents(format_id, template_id, published_at);

CREATE INDEX IF NOT EXISTS idx_snapshots_content
    ON performance_snapshots(content_id, target_hours);

PRAGMA user_version = 1;

COMMIT;
