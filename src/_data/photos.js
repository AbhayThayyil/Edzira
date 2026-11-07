// Lists optimised photos in src/assets/photos so templates can fall back to a
// branded placeholder until a real photo is added (see scripts/optimize-photos.mjs).
import fs from "node:fs";
const dir = "src/assets/photos";
export default () => {
  const names = {};
  if (!fs.existsSync(dir)) return names;
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(.+)-(\d+)\.webp$/);
    if (m) (names[m[1]] ||= []).push(Number(m[2]));
  }
  for (const k in names) names[k].sort((a, b) => a - b);
  return names;
};
