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