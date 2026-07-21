import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const schemaPath = path.join(repoRoot, "db/schema.sql");

async function withDatabase(run) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "lift-code-schema-test-"));
  const databasePath = path.join(directory, "test.sqlite");

  try {
    const applied = spawnSync("sqlite3", [databasePath], {
      input: readFileSync(schemaPath, "utf8"),
      encoding: "utf8",
    });
    assert.equal(applied.status, 0, applied.stderr);
    await run(databasePath);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function query(databasePath, sql) {
  return execFileSync("sqlite3", ["-json", databasePath, sql], {
    encoding: "utf8",
  });
}

function insertContent(
  databasePath,
  copywritingVersion,
  messageVersion = "1",
  formatId = "denzel",
  slideCopyJson = '[["hook"]]',
) {
  const suffix = `${copywritingVersion}-${messageVersion}`.replace(
    /[^a-z0-9]/gi,
    "-",
  );

  return spawnSync("sqlite3", [databasePath], {
    input: `
      INSERT INTO contents (
        id,
        hypothesis_id,
        format_id,
        message_id,
        message_version,
        copywriting_version,
        caption,
        slide_copy_json,
        final_project_path,
        final_project_sha256
      ) VALUES (
        'c-${suffix}',
        'h-1',
        '${formatId}',
        'msg-trust-the-next-set',
        ${messageVersion},
        ${copywritingVersion},
        'caption',
        '${slideCopyJson.replaceAll("'", "''")}',
        'renderer/slideshow/formats/${formatId}/contents/c-${suffix}.json',
        '${"b".repeat(64)}'
      );
    `,
    encoding: "utf8",
  });
}

function insertResult(databasePath, collectionSource) {
  return spawnSync("sqlite3", [databasePath], {
    input: `
      INSERT INTO content_results (
        content_id,
        target_hours,
        collected_at,
        collection_source
      ) VALUES (
        'c-1-1',
        24,
        '2026-07-18T00:00:00Z',
        ${collectionSource}
      );
    `,
    encoding: "utf8",
  });
}

test("contents records format and strategy versions with the self-contained project identity", async () => {
  await withDatabase(async (databasePath) => {
    const columns = JSON.parse(query(databasePath, "PRAGMA table_info(contents);"));
    const copywritingVersion = columns.find(
      (column) => column.name === "copywriting_version",
    );
    const formatId = columns.find((column) => column.name === "format_id");
    const slideCopyJson = columns.find((column) => column.name === "slide_copy_json");

    assert.ok(copywritingVersion);
    assert.equal(copywritingVersion.notnull, 1);
    assert.ok(formatId);
    assert.equal(formatId.notnull, 1);
    assert.ok(slideCopyJson);
    assert.equal(slideCopyJson.notnull, 1);

    for (const removedColumn of ["imagery_version", "template_path", "template_sha256"]) {
      assert.equal(columns.some((column) => column.name === removedColumn), false);
    }
  });
});

test("contents rejects unsafe format IDs", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    for (const formatId of ["", "Denzel", "../denzel", "denzel/reference", "denzel space"]) {
      const inserted = insertContent(databasePath, "1", "1", formatId);
      assert.notEqual(inserted.status, 0, `accepted ${formatId}`);
      assert.match(inserted.stderr, /CHECK constraint failed/);
    }
  });
});

test("contents accepts positive integer strategy versions", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    const inserted = insertContent(databasePath, "1", "1");

    assert.equal(inserted.status, 0, inserted.stderr);
  });
});

test("contents rejects slides without text strings", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    for (const slideCopyJson of ["[]", '["hook"]', "[[1]]", "[[]]"]) {
      const inserted = insertContent(databasePath, "1", "1", "denzel", slideCopyJson);
      assert.notEqual(inserted.status, 0, `accepted ${slideCopyJson}`);
      assert.match(inserted.stderr, /slide_copy_json/);
    }
  });
});

test("closed hypotheses cannot be reopened", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
      UPDATE hypotheses
      SET closed_at = '2026-07-18T00:00:00Z', closure_reason = 'closed'
      WHERE id = 'h-1';
    `]);

    const reopened = spawnSync("sqlite3", [databasePath], {
      input: `
        UPDATE hypotheses
        SET closed_at = NULL, closure_reason = NULL
        WHERE id = 'h-1';
      `,
      encoding: "utf8",
    });
    assert.notEqual(reopened.status, 0);
    assert.match(reopened.stderr, /closed hypothesis cannot be reopened/);
  });
});

test("content results require normalized collection provenance", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);
    const content = insertContent(databasePath, "1", "1");
    assert.equal(content.status, 0, content.stderr);

    const columns = JSON.parse(query(databasePath, "PRAGMA table_info(content_results);"));
    const collectionSource = columns.find((column) => column.name === "collection_source");
    assert.ok(collectionSource);
    assert.equal(collectionSource.notnull, 1);

    for (const source of ["NULL", "''", "'   '"]) {
      const inserted = insertResult(databasePath, source);
      assert.notEqual(inserted.status, 0, `accepted ${source}`);
      assert.match(inserted.stderr, /(NOT NULL|CHECK) constraint failed/);
    }

    const inserted = insertResult(databasePath, "'TikWM public API'");
    assert.equal(inserted.status, 0, inserted.stderr);
  });
});

test("contents rejects invalid copywriting versions", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    for (const version of ["0", "-1", "1.5", "'1'", "'1.0'", "'abc'"]) {
      const inserted = insertContent(databasePath, version);
      assert.notEqual(inserted.status, 0, `accepted ${version}`);
      assert.match(inserted.stderr, /CHECK constraint failed/);
    }
  });
});

test("contents rejects invalid message versions", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    for (const version of ["0", "-1", "1.5", "'1'", "'1.0'", "'abc'"]) {
      const inserted = insertContent(databasePath, "1", version);
      assert.notEqual(inserted.status, 0, `accepted ${version}`);
      assert.match(inserted.stderr, /CHECK constraint failed/);
    }
  });
});

test("schema version identifies the current structure", async () => {
  await withDatabase(async (databasePath) => {
    const version = query(databasePath, "PRAGMA user_version;").trim();
    assert.equal(version, '[{"user_version":11}]');
  });
});
