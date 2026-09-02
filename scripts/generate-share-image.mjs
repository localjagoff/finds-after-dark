import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "assets", "share");
const outputDir = path.join(root, "public");
const output = path.join(outputDir, "finds-after-dark-share.jpg");
const chunks = [
  "apple-og-01.b64",
  "apple-og-02a.b64",
  "apple-og-02b.b64",
  "apple-og-03a.b64",
  "apple-og-03b.b64",
  "apple-og-04.b64",
  "apple-og-05.b64",
  "apple-og-06.b64",
];

const base64 = chunks
  .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8").trim())
  .join("");
const image = Buffer.from(base64, "base64");
const expectedBytes = 19791;
const expectedSha256 = "4889c527376ed14c55a611a141d4bd7e32213a41e3c296e60203bae26919aada";
const actualSha256 = crypto.createHash("sha256").update(image).digest("hex");

if (image.length !== expectedBytes) {
  throw new Error(`Unexpected social preview image size: ${image.length} bytes; expected ${expectedBytes}`);
}
if (actualSha256 !== expectedSha256) {
  throw new Error(`Unexpected social preview SHA-256: ${actualSha256}`);
}
if (image[0] !== 0xff || image[1] !== 0xd8 || image.at(-2) !== 0xff || image.at(-1) !== 0xd9) {
  throw new Error("Social preview is not a complete JPEG file");
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(output, image);
console.log(`Generated public/finds-after-dark-share.jpg (1200x630, ${image.length} bytes, SHA-256 verified)`);
