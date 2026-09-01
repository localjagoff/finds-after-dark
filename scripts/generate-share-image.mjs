import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "assets/share/direct-preview.b64");
const outputDir = path.join(root, "public");
const output = path.join(outputDir, "finds-after-dark-share.jpg");

const base64 = fs.readFileSync(source, "utf8").trim();
const image = Buffer.from(base64, "base64");

if (image.length !== 9705) {
  throw new Error(`Unexpected social preview image size: ${image.length} bytes`);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(output, image);

console.log("Generated public/finds-after-dark-share.jpg (600x315, 9.7 KB)");
