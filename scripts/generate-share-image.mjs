import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sources = [
  path.join(root, "assets/share/social-preview-a.b64"),
  path.join(root, "assets/share/social-preview-b.b64"),
];
const outputDir = path.join(root, "public");
const output = path.join(outputDir, "finds-after-dark-share.jpg");

const base64 = sources.map((source) => fs.readFileSync(source, "utf8").trim()).join("");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(output, Buffer.from(base64, "base64"));

console.log("Generated public/finds-after-dark-share.jpg");
