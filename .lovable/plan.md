## Lighthouse-resultater (mobil, dev-preview)

| Kategori | Score |
|---|---|
| Performance | **37** |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |

Accessibility / Best Practices / SEO er stort set i mål. Performance trækker ned. Bemærk at dev-preview måler unminified JS som "unused" — det forsvinder i produktion. Der er dog ægte problemer at fikse.

### De reelle problemer

1. **CLS 0.902 (kritisk)** — hero-karusellen og billeder uden `width`/`height` skubber layoutet voldsomt, mens fonte og billeder loader.
2. **Image delivery ~7,4 MB spildt** — selvom vi har responsive varianter, leverer vi stadig for store filer på mobil (mange er JPG/PNG i stedet for WebP/AVIF til LCP, og `sizes`-attribut matcher ikke den faktiske bredde).
3. **Render-blocking ~1030 ms** — Google Fonts `<link rel="stylesheet">` blokerer first paint.
4. **Unsized images** — flere `<img>` mangler `width`/`height` og bidrager til CLS.
5. **Touch targets** — nogle links/knapper (særligt i footer og inline mailto/tel) ligger for tæt eller er for små på mobil.
6. **bf-cache afvist** — formentlig pga. EasyPractice-iframe på /kontakt; svært at fjerne, lav prioritet.
7. **Duplicated JS (8 KiB)** — mindre, sandsynligvis React/Router chunks; lav prioritet.

### Plan — i prioriteret rækkefølge

**1. Fjern CLS i hero-karusellen (`src/routes/index.tsx`)**
- Sæt fast `aspect-ratio` på karusel-wrapperen så højden er låst før billedet loader.
- Tilføj `width`/`height` til alle `<img>` (hero, klinikbilleder, portræt, logo).
- Tilføj `font-display: swap` allerede er aktiv, men reservér plads ved at sætte `size-adjust`-fallback via en lokal `@font-face` fallback (eller acceptér den lille font-shift).

**2. Optimér LCP-billedet (hero)**
- Sørg for `<img loading="eager" fetchpriority="high" decoding="async">` på første hero-slide.
- Tilføj `<link rel="preload" as="image" imagesrcset=... imagesizes=...>` i route-head for `/` så browseren henter LCP-billedet parallelt med JS.
- Generér også AVIF (sharp understøtter det) i `scripts/generate-responsive.mjs` og brug `<picture>` med AVIF → WebP → JPG fallback for hero + portræt.
- Ret `sizes`-attributten så den matcher den faktiske rendered bredde (fx `(max-width: 768px) 100vw, 1200px` i stedet for `100vw`).

**3. Stop render-blocking på Google Fonts**
- Skift fra `<link rel="stylesheet" href="fonts.googleapis.com/...">` til preconnect + non-blocking pattern: `<link rel="preload" as="style" onload="this.rel='stylesheet'">` med `<noscript>` fallback, ELLER selvhost de to fonts (Fraunces + Inter) via `@fontsource/*` så de bundles og preload'es lokalt. Selvhosting fjerner også preconnect-roundtrips.

**4. Tap-targets på mobil**
- Audit `src/components/site-footer.tsx` og `src/routes/kontakt.tsx`: hæv padding på inline `mailto:`/`tel:` links og burger-knap til min 44×44 px (`min-h-11 min-w-11`).

**5. Iframe og bf-cache på /kontakt**
- Loader EasyPractice-iframen lazy (`loading="lazy"`) hvis ikke allerede gjort, så den ikke trækker performance på første visit. bf-cache bliver svær — accepterer vi.

**6. Verifikation**
- Efter ændringer: kør produktions-build (`bun run build && bun run preview`) og kør Lighthouse mod den, da dev-tallene for JS-vægt er misvisende. Mål: Performance ≥ 90, CLS < 0.1, LCP < 2.5 s på mobil.

### Filer der røres
- `src/routes/index.tsx` (hero, billed-dimensioner, preload, picture-tags)
- `src/routes/om-mig.tsx` (portræt picture-tag + dimensioner)
- `src/components/site-header.tsx` (logo dimensioner)
- `src/components/site-footer.tsx` (tap-targets)
- `src/routes/kontakt.tsx` (iframe lazy, tap-targets)
- `src/routes/__root.tsx` (fonts-loading strategi, preload-hints)
- `scripts/generate-responsive.mjs` (AVIF-output)
- `src/lib/asset-url.ts` (helper til `<picture>` med AVIF/WebP/JPG)
- evt. `package.json` (`@fontsource/fraunces`, `@fontsource/inter` hvis vi selvhoster)

### Hvad jeg IKKE rører
- JSON-LD, robots.txt, sitemap, metadata, indhold — er allerede gode (SEO 100, BP 100).
- Lovable-style farver/typografi — kun teknisk performance.
