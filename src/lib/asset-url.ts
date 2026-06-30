// Resolves a Lovable asset pointer (*.asset.json) to a URL that works both in
// the Lovable preview (where /__l5e/... is served by the platform) and in
// static deploys like GitHub Pages, where the file is bundled into
// public/cdn-assets/<asset_id>/<filename> by scripts/download-assets.mjs.

type AssetPointer = {
  asset_id: string;
  original_filename: string;
  url: string;
};

// In the Lovable dev preview we use the platform CDN (/__l5e/...). In any
// production build (GitHub Pages, custom domain, etc.) we use the locally
// bundled copy under public/cdn-assets/ — Lovable's CDN is not reachable
// from those hosts.
export function assetUrl(asset: AssetPointer): string {
  const base = import.meta.env.BASE_URL || "/";
  if (import.meta.env.DEV) return asset.url;
  return `${base}cdn-assets/${asset.asset_id}/${asset.original_filename}`;
}

const RESPONSIVE_WIDTHS = [480, 768, 1200, 1920];

function splitExt(filename: string): [string, string] {
  const i = filename.lastIndexOf(".");
  if (i < 0) return [filename, ""];
  return [filename.slice(0, i), filename.slice(i)];
}

/**
 * Returns the props for a responsive <img>: a fallback `src`, a multi-width
 * `srcSet`, and the caller-provided `sizes` string. In dev we serve the
 * original Lovable CDN URL (no resized variants exist); in production builds
 * we point at the width-suffixed files emitted by scripts/generate-responsive.mjs.
 */
export function responsiveImg(
  asset: AssetPointer,
  sizes: string = "100vw",
): { src: string; srcSet?: string; sizes: string } {
  if (import.meta.env.DEV) {
    return { src: asset.url, sizes };
  }
  const base = import.meta.env.BASE_URL || "/";
  const dir = `${base}cdn-assets/${asset.asset_id}`;
  const [stem, ext] = splitExt(asset.original_filename);
  const isRaster = /\.(jpe?g|png)$/i.test(ext);
  if (!isRaster) {
    return { src: `${dir}/${asset.original_filename}`, sizes };
  }
  const srcSet = RESPONSIVE_WIDTHS
    .map((w) => `${dir}/${stem}-${w}${ext} ${w}w`)
    .join(", ");
  // Fallback to the largest variant for browsers that ignore srcSet
  const src = `${dir}/${stem}-${RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1]}${ext}`;
  return { src, srcSet, sizes };
}

export type PictureSources = {
  src: string;
  srcSet?: string;
  sizes: string;
  avifSrcSet?: string;
  webpSrcSet?: string;
};

/**
 * Like responsiveImg, but also returns AVIF and WebP srcSets so callers can
 * render a <picture> element with progressively better formats.
 */
export function responsivePicture(
  asset: AssetPointer,
  sizes: string = "100vw",
): PictureSources {
  if (import.meta.env.DEV) {
    return { src: asset.url, sizes };
  }
  const base = import.meta.env.BASE_URL || "/";
  const dir = `${base}cdn-assets/${asset.asset_id}`;
  const [stem, ext] = splitExt(asset.original_filename);
  const isRaster = /\.(jpe?g|png)$/i.test(ext);
  if (!isRaster) {
    return { src: `${dir}/${asset.original_filename}`, sizes };
  }
  const srcSet = RESPONSIVE_WIDTHS.map((w) => `${dir}/${stem}-${w}${ext} ${w}w`).join(", ");
  const webpSrcSet = RESPONSIVE_WIDTHS.map((w) => `${dir}/${stem}-${w}.webp ${w}w`).join(", ");
  const avifSrcSet = RESPONSIVE_WIDTHS.map((w) => `${dir}/${stem}-${w}.avif ${w}w`).join(", ");
  const src = `${dir}/${stem}-${RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1]}${ext}`;
  return { src, srcSet, sizes, webpSrcSet, avifSrcSet };
}