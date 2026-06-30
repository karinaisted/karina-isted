## Problem
Karusel-dots i hero (`src/routes/index.tsx`, l. 105-116) er kun 6px høje og 6-24px brede — langt under WCAG/Apple/Google's anbefalede 44×44px touch target. De sidder også tæt med kun 6px mellemrum, så fingre rammer naboknappen.

## Løsning
Gør hver `<button>` til 44×44px usynligt klik-område via padding, og tegn den synlige dot via et indre `<span>`. Visuelt uændret, fysisk meget større tappable areal.

### Implementation i `src/routes/index.tsx`
- Container-wrapper: behold `absolute bottom-4 right-4`, fjern `gap-1.5` (afstanden kommer fra knap-padding).
- Hver knap:
  - `className="grid place-items-center h-11 w-11 -m-3 first:ml-0 last:mr-0 bg-transparent"` (h-11/w-11 = 44px; `-m-3` trækker knapperne tilbage så de visuelt ligger tæt, men hitbox forbliver fuld 44px og overlapper naboernes padding kun lidt).
  - Indre `<span>` med den nuværende dot-styling (`h-1.5 rounded-full w-6 bg-white` / `w-1.5 bg-white/60`).
  - Behold `aria-label` og `onClick`.
- Tilføj `touch-action: manipulation` og `focus-visible:outline` for tastatur.

### Verifikation
- Playwright: åbn `/` på mobil viewport (375×800), tag elementscreenshot af karusel-dotsektionen før/efter, og log `getBoundingClientRect()` på hver knap for at bekræfte ≥44×44.

## Filer
- `src/routes/index.tsx` (kun karusel-knap-blokken)
