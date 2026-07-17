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
  const directory = await mkdtemp(path.join(os.tmpdir(), "env-schema-test-"));
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
  imageryVersion = "NULL",
) {
  const suffix = `${copywritingVersion}-${messageVersion}-${imageryVersion}`.replace(
    /[^a-z0-9]/gi,
    "-",
  );

  return spawnSync("sqlite3", [databasePath], {
    input: `
      INSERT INTO contents (
        id,
        hypothesis_id,
        message_id,
        message_version,
        format_id,
        copywriting_version,
        imagery_version,
        template_path,
        template_sha256,
        caption,
        final_project_path,
        final_project_sha256
      ) VALUES (
        'c-${suffix}',
        'h-1',
        'msg-focus-is-a-system',
        ${messageVersion},
        'denzel',
        ${copywritingVersion},
        ${imageryVersion},
        'renderer/slideshow/templates/denzel/template.json',
        '${"a".repeat(64)}',
        'caption',
        'renderer/slideshow/contents/c-${suffix}.json',
        '${"b".repeat(64)}'
      );
    `,
    encoding: "utf8",
  });
}

test("contents records the format execution versions used by publication-ready content", async () => {
  await withDatabase(async (databasePath) => {
    const columns = JSON.parse(query(databasePath, "PRAGMA table_info(contents);"));
    const copywritingVersion = columns.find(
      (column) => column.name === "copywriting_version",
    );

    assert.ok(copywritingVersion);
    assert.equal(copywritingVersion.notnull, 1);

    const imageryVersion = columns.find(
      (column) => column.name === "imagery_version",
    );
    assert.ok(imageryVersion);
    assert.equal(imageryVersion.notnull, 0);

    const indexes = JSON.parse(query(databasePath, "PRAGMA index_list(contents);"));
    const formatIndex = indexes.find(
      (index) => index.name === "idx_contents_format_versions",
    );
    assert.ok(formatIndex);

    const indexColumns = JSON.parse(
      query(databasePath, "PRAGMA index_info(idx_contents_format_versions);"),
    );
    assert.deepEqual(
      indexColumns.map((column) => column.name),
      ["format_id", "copywriting_version", "imagery_version"],
    );
  });
});

test("contents accepts positive integer strategy versions", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    const inserted = insertContent(databasePath, "1", "1", "1");

    assert.equal(inserted.status, 0, inserted.stderr);
  });
});

test("contents accepts null imagery version for historical content", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    const inserted = insertContent(databasePath, "1");

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

test("contents rejects invalid imagery versions", async () => {
  await withDatabase(async (databasePath) => {
    execFileSync("sqlite3", [databasePath, `
      INSERT INTO hypotheses (id, statement) VALUES ('h-1', 'root');
    `]);

    for (const version of ["0", "-1", "1.5", "'1'", "'1.0'", "'abc'"]) {
      const inserted = insertContent(databasePath, "1", "1", version);
      assert.notEqual(inserted.status, 0, `accepted ${version}`);
      assert.match(inserted.stderr, /CHECK constraint failed/);
    }
  });
});

test("schema version identifies the imagery-version structure", async () => {
  await withDatabase(async (databasePath) => {
    const version = query(databasePath, "PRAGMA user_version;").trim();
    assert.equal(version, '[{"user_version":5}]');
  });
});
