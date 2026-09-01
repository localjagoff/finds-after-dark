import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const names = [
  "preview-01.b64",
  "preview-02.b64",
  "preview-03.b64",
  "preview-04.b64",
  "preview-05.b64",
  "preview-06a.b64",
  "preview-06b.b64",
  "preview-06c.b64",
  "preview-06d.b64",
  "preview-07.b64",
];
const sources = names.map((name) => path.join(root, "assets/share", name));
const outputDir = path.join(root, "public");
const output = path.join(outputDir, "finds-after-dark-share.jpg");

const base64 = sources.map((source) => fs.readFileSync(source, "utf8").trim()).join("");
const image = Buffer.from(base64, "base64");

if (base64.length !== 12940 || image.length !== 9705) {
  throw new Error(`Unexpected social preview payload size: ${base64.length} chars / ${image.length} bytes`);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(output, image);

console.log("Generated public/finds-after-dark-share.jpg (600x315, 9.7 KB)");
