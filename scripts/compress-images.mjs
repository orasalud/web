// Runs before `npm run dev` and `npm run build`.
//
// Prepares the photos in public/images/ in place:
// - applies the camera rotation, then removes metadata (EXIF, GPS location, camera info),
// - shrinks anything larger than MAX_EDGE px on its long side,
// - re-compresses heavy files.
// Files that are already clean, small enough and light are left untouched, so
// running this on every build does not keep degrading them. next/image then
// serves resized AVIF/WebP versions to each device.

import { readdir, rename, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import sharp from "sharp";

const DIR = join(process.cwd(), "public", "images");
const MAX_EDGE = 2400;
const HEAVY_BYTES = 700 * 1024;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function processFile(file) {
  const path = join(DIR, file);
  const { size } = await stat(path);
  const meta = await sharp(path).metadata();

  const hasMetadata = Boolean(meta.exif || meta.xmp || meta.iptc);
  const tooLarge = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;
  const heavy = size > HEAVY_BYTES;
  if (!hasMetadata && !tooLarge && !heavy) return null;

  let pipeline = sharp(path)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  const ext = extname(file).toLowerCase();
  if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9, effort: 8 });
  else if (ext === ".webp") pipeline = pipeline.webp({ quality: 80 });
  else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });

  const output = await pipeline.toBuffer();
  // Metadata and oversize are always fixed; weight alone only if it's a real gain.
  if (!hasMetadata && !tooLarge && output.length > size * 0.85) return null;

  const tmp = `${path}.tmp`;
  await writeFile(tmp, output);
  await rename(tmp, path);
  return `${file}: ${kb(size)} → ${kb(output.length)}${hasMetadata ? " (metadata removed)" : ""}`;
}

let files = [];
try {
  files = (await readdir(DIR)).filter((file) => EXTENSIONS.has(extname(file).toLowerCase()));
} catch {
  // No public/images yet: nothing to do.
}

for (const file of files) {
  try {
    const result = await processFile(file);
    if (result) console.log(`[images] ${result}`);
  } catch (error) {
    console.warn(`[images] Skipped ${file}: ${error.message}`);
  }
}
