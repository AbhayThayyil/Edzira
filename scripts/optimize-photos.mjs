// Optimise stock photos for the web.
// Put originals in ./photos-inbox (e.g. hero-campus.jpg) and run: npm run photos
// Writes AVIF + WebP at several widths to src/assets/photos/<name>-<width>.<ext>
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IN = process.env.PHOTOS_IN || "photos-inbox";
const OUT = "src/assets/photos";
const WIDTHS = [640, 1024, 1600];
fs.mkdirSync(OUT, { recursive: true });

const files = fs.existsSync(IN) ? fs.readdirSync(IN).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
if (!files.length) console.log(`No photos found in ${IN}/`);
for (const file of files) {
  const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const src = sharp(path.join(IN, file)).rotate();
  const { width } = await src.metadata();
  for (const w of WIDTHS.filter((w) => w <= width || w === WIDTHS[0])) {
    const r = src.clone().resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 50, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`);
    await r.clone().webp({ quality: 72, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  console.log(`✓ ${name}`);
}
