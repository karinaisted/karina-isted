## Problem
Lavkontrast tekst flere steder, særligt på sand-tonede baggrunde:
- `--muted-foreground` er en lys blå-grå (oklch 0.554) som er for lys mod `bg-sand-muted` / `bg-sand-deep` kort
- `text-zinc-500` i header-nav og `text-zinc-600` i footer (på mørke/sand baggrunde) — under WCAG AA
- Diverse shadcn-komponenter (card description, breadcrumb, accordion-ikon) arver `text-muted-foreground`

## Plan

**1. Forstærk semantiske tokens i `src/styles.css`**
- Gør `--muted-foreground` markant mørkere og afstem den med sage/ink-paletten (fx oklch(0.38 0.015 140) — varm mørk grå der harmonerer med sand+sage) så den opfylder AA mod både hvid sand og `--color-sand-muted`.
- Sæt `--foreground` til `--color-ink` og `--border` til en lidt mørkere sand-tone for konsistens.

**2. Erstat hardcoded zinc-farver med tokens**
- `src/components/site-header.tsx`: `text-zinc-500` → `text-ink-soft` (eller ny `text-foreground/80`).
- `src/components/site-footer.tsx`: `text-zinc-600` → `text-ink-soft`.
- Tjek øvrige sider for `text-zinc-*` / `text-stone-*` / `text-neutral-*` og udskift.

**3. Audit-verifikation**
- Kør Playwright efter ændringerne: åbn alle 6 sider, screenshot mobil (375px) + desktop (1280px), inspicér mod WCAG AA (4.5:1 normal, 3:1 large) på muted-tekst og links over sand-baggrunde.
- Rapportér tilbage med før/efter-screenshots af 1–2 typiske sektioner.

**4. Ingen ændringer i indhold eller layout** — kun farve-tokens og udskiftning af zinc-utility-klasser.

## Filer der røres
- `src/styles.css` (token-værdier)
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- Evt. enkelte route-filer hvis zinc/stone dukker op
