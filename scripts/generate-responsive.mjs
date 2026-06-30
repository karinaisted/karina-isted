#!/usr/bin/env node
// Generates responsive image variants for every raster image under
// public/cdn-assets/. For each source image we emit width-suffixed JPG/PNG
// variants plus matching WebP at common breakpoints, written next to the
// original (e.g. hero.jpg -> hero-480.jpg, hero-480.webp, hero-768.jpg, ...).
// The build-time `assetUrl` / `responsiveImg` helper composes srcSet from
// these files.
import { readdir, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const ASSETS_DIR = path.join(ROOT, "public", "cdn-assets");
const WIDTHS = [480, 768, 1200, 1920];
const RASTER = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile()) yield p;
  }
}

function isVariant(name) {
  // matches "<base>-<width>.<ext>" produced by this script
  return /-(\d{3,4})\.(jpe?g|png|webp)$/i.test(name);
}

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER.has(ext)) return [];
  const base = file.slice(0, -ext.length);
  if (isVariant(path.basename(file))) return [];

  const meta = await sharp(file).metadata();
  const srcWidth = meta.width || 0;
  const created = [];

  for (const w of WIDTHS) {
    if (srcWidth && w > srcWidth) continue;
    const outRaster = `${base}-${w}${ext}`;
    const outWebp = `${base}-${w}.webp`;
    if (!existsSync(outRaster)) {
      const pipe = sharp(file).resize({ width: w, withoutEnlargement: true });
      if (ext === ".png") await pipe.png({ quality: 80, compressionLevel: 9 }).toFile(outRaster);
      else await pipe.jpeg({ quality: 78, mozjpeg: true }).toFile(outRaster);
      created.push(outRaster);
    }
    if (!existsSync(outWebp)) {
      await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 75 }).toFile(outWebp);
      created.push(outWebp);
    }
  }
  return created;
}

if (!existsSync(ASSETS_DIR)) {
  console.log("[responsive] no cdn-assets/ — skipping");
  process.exit(0);
}

let total = 0;
for await (const file of walk(ASSETS_DIR)) {
  try {
    const created = await processOne(file);
    total += created.length;
  } catch (err) {
    console.error(`[responsive] ${file}: ${err.message}`);
    process.exitCode = 1;
  }
}
console.log(`[responsive] generated ${total} new image variants`);