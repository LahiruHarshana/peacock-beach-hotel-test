import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set(["node_modules", ".next", "out", "coverage", "peacock-app", ".git"]);

const patterns: Array<{ name: string; regex: RegExp }> = [
  { name: "mongodb-credential-uri", regex: /mongodb(?:\+srv)?:\/\/[^:\s]+:[^@\s]+@/i },
  { name: "private-key-block", regex: /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/ },
  { name: "aws-access-key", regex: /AKIA[0-9A-Z]{16}/ },
];

function trackedFiles(): string[] | null {
  try {
    const output = execFileSync("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.split("\n").map((line) => line.trim()).filter(Boolean);
  } catch {
    return null;
  }
}

function walk(dir: string, files: string[]) {
  for (const entry of readdirSync(dir)) {
    if (skipDirs.has(entry) || entry.startsWith(".env")) continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (stat.isFile() && stat.size < 1_000_000) files.push(full);
  }
}

const fromGit = trackedFiles();
const files = fromGit
  ? fromGit
      .filter((file) => !file.startsWith("peacock-app/") && !file.includes("node_modules/"))
      .map((file) => path.join(root, file))
  : (() => {
      const found: string[] = [];
      walk(root, found);
      return found;
    })();

const hits: string[] = [];
for (const file of files) {
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const pattern of patterns) {
    const matches = text.match(new RegExp(pattern.regex.source, pattern.regex.flags.includes("g") ? pattern.regex.flags : `${pattern.regex.flags}g`));
    if (!matches) continue;
    const blocked = matches.filter((match) => !/REPLACE_|<[^>]+>|USER:PASSWORD|user:password|example:example/i.test(match));
    if (blocked.length) {
      hits.push(`${path.relative(root, file)} matched ${pattern.name}`);
    }
  }
}

if (hits.length) {
  console.error("Secret scan failed. Matching values were not printed.");
  for (const hit of hits) console.error(hit);
  process.exit(1);
}

console.log(`Secret scan checked ${files.length} files. No blocked patterns.`);
