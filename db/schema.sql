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
        CHECK (
            length(id) > 0
            AND id NOT GLOB '*[^A-Za-z0-9_-]*'
        ),
    hypothesis_id TEXT NOT NULL,
    medium TEXT NOT NULL
        CHECK (medium IN ('slideshow', 'video')),
    format_id TEXT NOT NULL
        CHECK (
            length(format_id) > 0
            AND format_id = lower(format_id)
            AND format_id NOT GLOB '*[^a-z0-9-]*'
            AND format_id NOT GLOB '-*'
            AND format_id NOT GLOB '*-'
            AND format_id NOT GLOB '*--*'
        ),
    message_id TEXT NOT NULL CHECK (length(trim(message_id)) > 0),
    message_version NOT NULL
        CHECK (typeof(message_version) = 'integer' AND message_version > 0),
    copywriting_version NOT NULL
        CHECK (
            typeof(copywriting_version) = 'integer'
            AND copywriting_version > 0
        ),
    caption TEXT NOT NULL,
    copy_snapshot_json TEXT NOT NULL
        CHECK (
            CASE
                WHEN json_valid(copy_snapshot_json)
                THEN json_type(copy_snapshot_json) = 'object'
                ELSE 0
            END
        ),
    final_project_path TEXT NOT NULL UNIQUE
        CHECK (
            final_project_path = (
                'renderer/' || medium || '/formats/' || format_id
                || '/contents/' || id || '.json'
            )
        ),
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

CREATE TRIGGER IF NOT EXISTS preserve_hypothesis_lineage
BEFORE UPDATE OF parent_hypothesis_id, change_axis ON hypotheses
WHEN
    NEW.parent_hypothesis_id IS NOT OLD.parent_hypothesis_id
    OR NEW.change_axis IS NOT OLD.change_axis
BEGIN
    SELECT RAISE(ABORT, 'hypothesis lineage cannot change after creation');
END;

CREATE TRIGGER IF NOT EXISTS require_open_hypothesis_parent
BEFORE INSERT ON hypotheses
WHEN
    NEW.parent_hypothesis_id IS NOT NULL
    AND (
        NOT EXISTS (
            SELECT 1
            FROM hypotheses AS parent
            WHERE parent.id = NEW.parent_hypothesis_id
        )
        OR EXISTS (
            SELECT 1
            FROM hypotheses AS parent
            WHERE parent.id = NEW.parent_hypothesis_id
              AND parent.closed_at IS NOT NULL
        )
    )
BEGIN
    SELECT RAISE(ABORT, 'hypothesis parent must exist and be open');
END;

CREATE TRIGGER IF NOT EXISTS require_leaf_hypothesis_closure
BEFORE UPDATE OF closed_at ON hypotheses
WHEN
    NEW.closed_at IS NOT NULL
    AND EXISTS (
        SELECT 1
        FROM hypotheses AS child
        WHERE child.parent_hypothesis_id = NEW.id
    )
BEGIN
    SELECT RAISE(ABORT, 'branched hypotheses cannot be closed');
END;

CREATE TRIGGER IF NOT EXISTS preserve_hypothesis_closure
BEFORE UPDATE OF closed_at, closure_reason ON hypotheses
WHEN
    OLD.closed_at IS NOT NULL
    AND (
        NEW.closed_at IS NOT OLD.closed_at
        OR NEW.closure_reason IS NOT OLD.closure_reason
    )
BEGIN
    SELECT RAISE(ABORT, 'closed hypothesis cannot be reopened or rewritten');
END;

CREATE TRIGGER IF NOT EXISTS require_active_leaf_content
BEFORE INSERT ON contents
WHEN
    NOT EXISTS (
        SELECT 1
        FROM hypotheses AS selected
        WHERE selected.id = NEW.hypothesis_id
    )
    OR EXISTS (
        SELECT 1
        FROM hypotheses AS selected
        WHERE selected.id = NEW.hypothesis_id
          AND (
              selected.closed_at IS NOT NULL
              OR EXISTS (
                  SELECT 1
                  FROM hypotheses AS child
                  WHERE child.parent_hypothesis_id = selected.id
              )
          )
)
BEGIN
    SELECT RAISE(ABORT, 'contents must belong to an active leaf hypothesis');
END;

CREATE TRIGGER IF NOT EXISTS preserve_content_hypothesis
BEFORE UPDATE OF hypothesis_id ON contents
WHEN NEW.hypothesis_id IS NOT OLD.hypothesis_id
BEGIN
    SELECT RAISE(ABORT, 'content hypothesis cannot change after creation');
END;

CREATE TRIGGER IF NOT EXISTS require_contents_copy_snapshot_insert
BEFORE INSERT ON contents
WHEN
    json_valid(NEW.copy_snapshot_json)
    AND (
    (
        (
            NEW.medium = 'slideshow'
            AND (SELECT count(*) FROM json_each(NEW.copy_snapshot_json)) <> 1
        )
        OR
        (
            NEW.medium = 'video'
            AND (SELECT count(*) FROM json_each(NEW.copy_snapshot_json)) <> 2
        )
    )
    OR
    (
        NEW.medium = 'slideshow'
        AND (
            COALESCE(json_type(NEW.copy_snapshot_json, '$.slides'), '') <> 'array'
            OR json_array_length(NEW.copy_snapshot_json, '$.slides') = 0
            OR EXISTS (
                SELECT 1
                FROM json_each(NEW.copy_snapshot_json) AS member
                WHERE member.key <> 'slides'
            )
            OR EXISTS (
                SELECT 1
                FROM json_each(NEW.copy_snapshot_json, '$.slides') AS slide
                WHERE
                    slide.type <> 'array'
                    OR CASE
                        WHEN slide.type = 'array'
                        THEN
                            json_array_length(slide.value) = 0
                            OR EXISTS (
                                SELECT 1
                                FROM json_each(slide.value) AS text_layer
                                WHERE
                                    text_layer.type <> 'text'
                                    OR length(trim(text_layer.value)) = 0
                            )
                        ELSE 0
                    END
            )
        )
    )
    OR
    (
        NEW.medium = 'video'
        AND (
            COALESCE(json_type(NEW.copy_snapshot_json, '$.on_screen_text'), '') <> 'array'
            OR COALESCE(json_type(NEW.copy_snapshot_json, '$.spoken_text'), '') <> 'array'
            OR EXISTS (
                SELECT 1
                FROM json_each(NEW.copy_snapshot_json) AS member
                WHERE member.key NOT IN ('on_screen_text', 'spoken_text')
            )
            OR CASE
                WHEN json_type(NEW.copy_snapshot_json, '$.on_screen_text') = 'array'
                THEN EXISTS (
                    SELECT 1
                    FROM json_each(NEW.copy_snapshot_json, '$.on_screen_text') AS text_layer
                    WHERE
                        text_layer.type <> 'text'
                        OR length(trim(text_layer.value)) = 0
                )
                ELSE 0
            END
            OR CASE
                WHEN json_type(NEW.copy_snapshot_json, '$.spoken_text') = 'array'
                THEN EXISTS (
                    SELECT 1
                    FROM json_each(NEW.copy_snapshot_json, '$.spoken_text') AS spoken_layer
                    WHERE
                        spoken_layer.type <> 'text'
                        OR length(trim(spoken_layer.value)) = 0
                )
                ELSE 0
            END
        )
    )
    )
BEGIN
    SELECT RAISE(ABORT, 'copy_snapshot_json must match the selected medium');
END;

CREATE TRIGGER IF NOT EXISTS require_contents_copy_snapshot_update
BEFORE UPDATE OF medium, copy_snapshot_json ON contents
WHEN
    json_valid(NEW.copy_snapshot_json)
    AND (
    (
        (
            NEW.medium = 'slideshow'
            AND (SELECT count(*) FROM json_each(NEW.copy_snapshot_json)) <> 1
        )
        OR
        (
            NEW.medium = 'video'
            AND (SELECT count(*) FROM json_each(NEW.copy_snapshot_json)) <> 2
        )
    )
    OR
    (
        NEW.medium = 'slideshow'
        AND (
            COALESCE(json_type(NEW.copy_snapshot_json, '$.slides'), '') <> 'array'
            OR json_array_length(NEW.copy_snapshot_json, '$.slides') = 0
            OR EXISTS (
                SELECT 1
                FROM json_each(NEW.copy_snapshot_json) AS member
                WHERE member.key <> 'slides'
            )
            OR EXISTS (
                SELECT 1
                FROM json_each(NEW.copy_snapshot_json, '$.slides') AS slide
                WHERE
                    slide.type <> 'array'
                    OR CASE
                        WHEN slide.type = 'array'
                        THEN
                            json_array_length(slide.value) = 0
                            OR EXISTS (
                                SELECT 1
                                FROM json_each(slide.value) AS text_layer
                                WHERE
                                    text_layer.type <> 'text'
                                    OR length(trim(text_layer.value)) = 0
                            )
                        ELSE 0
                    END
            )
        )
    )
    OR
    (
        NEW.medium = 'video'
        AND (
            COALESCE(json_type(NEW.copy_snapshot_json, '$.on_screen_text'), '') <> 'array'
            OR COALESCE(json_type(NEW.copy_snapshot_json, '$.spoken_text'), '') <> 'array'
            OR EXISTS (
                SELECT 1
                FROM json_each(NEW.copy_snapshot_json) AS member
                WHERE member.key NOT IN ('on_screen_text', 'spoken_text')
            )
            OR CASE
                WHEN json_type(NEW.copy_snapshot_json, '$.on_screen_text') = 'array'
                THEN EXISTS (
                    SELECT 1
                    FROM json_each(NEW.copy_snapshot_json, '$.on_screen_text') AS text_layer
                    WHERE
                        text_layer.type <> 'text'
                        OR length(trim(text_layer.value)) = 0
                )
                ELSE 0
            END
            OR CASE
                WHEN json_type(NEW.copy_snapshot_json, '$.spoken_text') = 'array'
                THEN EXISTS (
                    SELECT 1
                    FROM json_each(NEW.copy_snapshot_json, '$.spoken_text') AS spoken_layer
                    WHERE
                        spoken_layer.type <> 'text'
                        OR length(trim(spoken_layer.value)) = 0
                )
                ELSE 0
            END
        )
    )
    )
BEGIN
    SELECT RAISE(ABORT, 'copy_snapshot_json must match the selected medium');
END;

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
    collection_source TEXT NOT NULL
        CHECK (length(trim(collection_source)) > 0),
    raw_json TEXT NOT NULL DEFAULT '{}'
        CHECK (json_valid(raw_json)),
    FOREIGN KEY (content_id)
        REFERENCES contents(id) ON DELETE RESTRICT,
    UNIQUE (content_id, target_hours)
);

CREATE TABLE IF NOT EXISTS account_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collected_at TEXT NOT NULL
        CHECK (length(trim(collected_at)) > 0),
    followers NOT NULL
        CHECK (typeof(followers) = 'integer' AND followers >= 0),
    collection_source TEXT NOT NULL
        CHECK (length(trim(collection_source)) > 0),
    raw_json TEXT NOT NULL DEFAULT '{}'
        CHECK (json_valid(raw_json))
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

CREATE TRIGGER IF NOT EXISTS require_integer_content_metrics_insert
BEFORE INSERT ON content_results
WHEN
    (NEW.views IS NOT NULL AND typeof(NEW.views) <> 'integer')
    OR (NEW.likes IS NOT NULL AND typeof(NEW.likes) <> 'integer')
    OR (NEW.comments IS NOT NULL AND typeof(NEW.comments) <> 'integer')
    OR (NEW.shares IS NOT NULL AND typeof(NEW.shares) <> 'integer')
    OR (NEW.saves IS NOT NULL AND typeof(NEW.saves) <> 'integer')
BEGIN
    SELECT RAISE(ABORT, 'content metrics must be integers');
END;

CREATE TRIGGER IF NOT EXISTS require_integer_content_metrics_update
BEFORE UPDATE OF views, likes, comments, shares, saves ON content_results
WHEN
    (NEW.views IS NOT NULL AND typeof(NEW.views) <> 'integer')
    OR (NEW.likes IS NOT NULL AND typeof(NEW.likes) <> 'integer')
    OR (NEW.comments IS NOT NULL AND typeof(NEW.comments) <> 'integer')
    OR (NEW.shares IS NOT NULL AND typeof(NEW.shares) <> 'integer')
    OR (NEW.saves IS NOT NULL AND typeof(NEW.saves) <> 'integer')
BEGIN
    SELECT RAISE(ABORT, 'content metrics must be integers');
END;

CREATE INDEX IF NOT EXISTS idx_hypotheses_parent
    ON hypotheses(parent_hypothesis_id);

CREATE INDEX IF NOT EXISTS idx_contents_hypothesis
    ON contents(hypothesis_id);

CREATE INDEX IF NOT EXISTS idx_contents_message
    ON contents(message_id, message_version);

CREATE INDEX IF NOT EXISTS idx_contents_format_copywriting
    ON contents(medium, format_id, copywriting_version);

DROP INDEX IF EXISTS idx_content_results_content;

CREATE INDEX IF NOT EXISTS idx_contents_published_at
    ON contents(published_at, id)
    WHERE tiktok_url IS NOT NULL AND published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_account_results_collected
    ON account_results(collected_at);

CREATE INDEX IF NOT EXISTS idx_hypothesis_evidence_result
    ON hypothesis_evidence(content_result_id);

PRAGMA user_version = 12;

COMMIT;
