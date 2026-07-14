import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";

type JsonProject = Record<string, unknown> & { slides: unknown[] };
type AcceptsProject = (value: unknown) => value is JsonProject;

export const readTemplatePackages = async (directory: string, acceptsFile: AcceptsProject) => {
  await mkdir(directory, { recursive: true });
  const packageNames = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const templates = await Promise.all(
    packageNames.map(async (id) => {
      try {
        const value = JSON.parse(await readFile(path.join(directory, id, "template.json"), "utf8"));
        if (!acceptsFile(value)) return null;

        return {
          ...value,
          id,
          name: typeof value.name === "string" && value.name.trim() ? value.name : id,
        };
      } catch {
        return null;
      }
    }),
  );

  return templates.filter((template) => template !== null);
};
