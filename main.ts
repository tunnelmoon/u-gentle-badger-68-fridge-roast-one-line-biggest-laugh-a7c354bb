import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My smart fridge knows the milk expired on Tuesday. It waited until Friday to tell me, out of respect for the cheese.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`entry must be 1 to 200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (/^\s|\s$/.test(LINE)) {
  fail("entry must not have leading or trailing white space");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (/  /.test(LINE)) {
  fail("entry must not contain double spaces");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  fail("round-trip read-back mismatch");
}

console.log(`wrote ${outPath} (${LINE.length} chars)`);
