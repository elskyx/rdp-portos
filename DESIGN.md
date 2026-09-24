# RDP. — Design & Build Contract

A cinematic, automotive, 3D creative-developer portfolio for **Rizky Dwi Putra**.
Reference mood: a black glossy coupe (M4-like: long hood, fastback roof, tall
kidney grille, laser "J" headlights, swan-neck wing, mesh multi-spoke wheels
with polished lips, red slash tail-lights) floating / falling through a cold
blue sky above a sea of clouds, shot with long lenses and extreme close-ups.

The first 5 seconds must say: **"this is a 3D creative developer portfolio."**
It must NOT look like a SaaS landing page, Tailwind template, or dashboard.

---

## 1. Art direction

CINEMATIC · AUTOMOTIVE · FUTURISTIC · DARK · MINIMAL · PREMIUM · IMMERSIVE · TECHNICAL

- Composition like film frames: huge type anchored to edges/corners, tiny
  technical metadata around it (crop marks, indices, readouts). Never a centred
  hero with an avatar and cards.
- Contrast of scale: enormous display type vs 11px mono labels.
- Hairlines (1px, `border-line`) instead of boxes. Radius is `rounded-[2px]`
  at most. **No giant rounded cards, no glassmorphism stacks, no rainbow
  gradients, no emoji, no drop-shadow soup.** Blur only for the scrolled nav.
- Colour is almost monochrome. Electric blue is an *accent* (a dot, an active
  line, a glow at 10–20% alpha) — never a background fill for large areas.

### Tokens (Tailwind v4, defined in `app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `bg-ink` | #050505 | page background, opaque sections |
| `bg-graphite` | #0b0d10 | raised panels |
| `bg-charcoal` | #121418 | image placeholders, inputs |
| `bg-steel` | #1b1f25 | hover fills |
| `text-fg` | #f3f5f8 | primary text |
| `text-fg-muted` | #8b929c | secondary text |
| `text-fg-dim` | #565c66 | tertiary / separators |
| `text-silver` | #c9ced6 | subtle highlights |
| `electric` | #3d8bff | accent (dots, active states, glows) |
| `electric-soft` | #7fb0ff | accent text on dark |
| `cold` | #8fb3dc | sky-tinted text |
| `sky-deep` | #0a1a33 | deep blue tints |
| `border-line` / `border-line-strong` | white 8% / 16% | hairlines |

### Typography

- **Display** `font-display` → Archivo, `font-stretch:125%`, 800, uppercase,
  tracking −0.045em. Sizes: `text-mega` (hero name), `text-giant`,
  `text-display`, `text-headline` (all fluid clamps). Always set an explicit
  `leading-[0.85]`–`leading-[0.95]` on multi-line display text.
- **Wide** `font-wide` → Archivo 118% width for medium titles (normal case OK).
- **Body** `font-sans` → Archivo normal width, `text-fg-muted`, 15–18px,
  max-width ~ 36–44ch.
- **Meta** `text-meta` → Geist Mono 11px, uppercase, tracking 0.18em. Used for
  labels like `01 / SELECTED WORK`, `LOCATION`, `(04)`, `2024 — 2026`.
- Verify every display heading at **360px** width — expanded type is wide.
  Override the fluid size with a smaller clamp per component if it overflows.

### Layout

- Horizontal padding: `px-gutter` (clamp 16px → 48px). Nav height `--nav-h`.
- 12-column thinking; asymmetric placement; generous vertical rhythm
  (`py-32 md:py-48` for sections).
- Section headers: `<SectionLabel index="02" label="Experiments" rule aside="(06)" />`
  then an oversized heading.

---

## 2. Motion system (`lib/animations.ts`)

| Surface | Character | Tools |
|---|---|---|
| Hero | slow + cinematic | `duration.cinematic`, `ease.outExpo`, `spring.drift` |
| Navigation | fast + responsive | `duration.fast`, `spring.snappy` |
| Project cards | medium + tactile | `spring.tactile`, `springValue.tilt` |
| Section transitions | slow + dramatic | `ease.cinematic`, clip-path, scale, blur |
| Buttons | fast + responsive | `MagneticButton` (built-in) |

- Signature text entrance: blur(14px)→0, opacity 0→1, rise 0.35em, staggered
  per line (`<TextReveal variant="blur">`). Oversized headings: masked line
  rise (`<TextReveal variant="mask">`). Don't animate everything at once —
  stagger meta → title → body → CTA.
- Animate only `transform`, `opacity`, `filter`, `clip-path`. No layout
  properties in loops. Per-frame code: no allocations, `for` loops.
- No bouncy overshoot. No random spinning. Few particles.
- Prefer Motion (`motion/react`) for component motion and scroll-linked
  values (`useScroll` + `useTransform`). GSAP (`@/lib/gsap`) only for complex
  pinned/scrubbed choreography. **Never import `framer-motion`.**
- `prefers-reduced-motion`: show content immediately, drop scroll-linked
  transforms, parallax, tilt, cursor, camera motion. Shared primitives and
  `usePrefersReducedMotion()` handle this — honour it in custom code.

---

## 3. Shared modules (owned by the lead — do not edit; request changes)

- `lib/content.ts` — ALL copy & data (projects, gallery, experiments, about,
  skills, contact, nav, site links). Components read only from here.
- `lib/animations.ts` — easings, durations, springs, `damp`, `clamp`,
  `progressBetween`, `smoothstep`, `lerp`.
- `lib/scroll-store.ts` — `scrollState` (mutable, per-frame), `onScroll(cb)`,
  `emitScroll()`, `getLenis()`, `scrollToTarget(target)`.
- `lib/app-store.ts` — `appStore.get/set/subscribe`, `useAppStore(selector)`;
  flags `loaded`, `sceneReady`, `webglFailed`, `menuOpen`.
- `lib/device.ts` — `useDeviceTier()`, `DPR_CAP`, `useFinePointer()`,
  `usePrefersReducedMotion()`, `useIsMobile()`, `supportsWebGL()`.
- `lib/gsap.ts` — `gsap`, `ScrollTrigger`, `useGSAP` (registered once).
- `components/smooth-scroll.tsx` — Lenis ↔ GSAP ticker ↔ scrollState; locks
  scroll until `loaded` and while `menuOpen`.
- `components/ui/*` primitives (adapted from 21st.dev patterns):
  `Magnetic`, `MagneticButton`, `TextReveal`, `SectionLabel`, `Spotlight`,
  `TiltCard`/`TiltLayer`, `ScrambleText`, `Counter`.
- `components/lab/lab-ready.tsx` — `<LabReady/>` for dev preview routes.

---

## 4. Page composition & layering

```
<LoadingScreen/>        z-[90]  fixed; sets appStore.loaded
<CustomCursor/>         z-[100] fixed; desktop fine pointer only
<Navigation/>           z-40    fixed top (mobile menu overlay z-[60])
<SceneCanvas/>          z-0     fixed full-viewport WebGL, pointer-events:none
<main id="main" class="relative z-10">
  <CinematicHero/>      #top          transparent, ~300svh with sticky overlay
  <ProjectShowcase/>    #work         transparent intro band (≈100svh) → opaque bg-ink
  <ProjectGallery/>     #archive      opaque
  <Experiments/>        #experiments  opaque
  <AboutSection/>       #about        opaque
  <SkillsSection/>      #skills       opaque
  <ContactSection/>     #contact      top fades from ink → transparent (finale car visible)
</main>
<Footer/>               opaque bg-ink, relative z-10
<BackgroundFx/>         z-[80] film grain
```

Every section root: `<section id="…" data-nav="work|experiments|about|contact">`
(hero has no `data-nav`). Navigation reads `[data-nav]` for the active item.
Only the hero has an `<h1>`; sections use `<h2>`.

### Cursor contract (`data-cursor` attributes)

- `a`, `button`, `[role=button]`, `[data-cursor="hover"]` → dot expands to ring
- `data-cursor="view"` → large disc "VIEW / PROJECT" (project images)
- `data-cursor="drag"` → disc "DRAG" with ← → (gallery track)
- `data-cursor-label="…"` → custom text in the disc (with `view` style)
- `data-cursor="hide"` → hide custom cursor

---

## 5. Scroll ↔ 3D choreography (`scrollState`)

Written by the hero (`heroProgress`, `heroExit`) and contact (`finaleProgress`);
read every frame by the WebGL scene.

- `heroProgress` 0→1 over the hero sequence (#top height − 1 viewport):
  - **0.00–0.45 SKY** — blue sky, volumetric-looking clouds + sea of clouds
    below, car floats nose-down like the reference, slow orbit, scroll dollies
    camera forward, car yaws with scroll, clouds drift slower than the car.
  - **0.45–0.75 DESCENT** — sky darkens to navy then black, clouds sink & fade,
    car rises and turns to a clean profile, lights begin to glow.
  - **0.75–1.00 STUDIO** — dark studio: reflective floor, overhead strip
    softboxes sweeping reflections across the paint, cold blue rim light.
- `heroExit` 0→1 over the next 2 viewports (showcase intro band scrolls over
  the studio). Scene stops rendering at 1 unless the finale is active.
- `finaleProgress` 0→1 as #contact enters (top at viewport bottom → top).
  Finale: black void, car front 3/4 low angle, headlights on, slow push-in.

---

## 6. Performance

- Three.js only inside the one fixed `<SceneCanvas/>` (dynamic import,
  `ssr:false`). No other WebGL contexts — previews use CSS/SVG/canvas2D.
- DPR capped per tier (`DPR_CAP`). Tier `low`: no post-processing, minimal
  clouds/particles; `mid`: no DOF; `high`: full.
- Pause loops off-screen (IntersectionObserver). Stop rendering the canvas
  when not visible.
- `next/image` for raster images with correct `sizes`; `quality` ∈ {60,75,85}.
- No runtime network fetches for 3D assets (no drei presets / CDN HDRIs /
  CDN cloud textures). Generate textures procedurally or ship them in
  `public/textures`.

---

## 7. Replacing placeholders

- Links & email: `lib/content.ts → site.links`.
- Project images: `public/images/projects/*.webp` (16:10, ≥1920×1200).
- Gallery images: `public/images/gallery/*.webp` (4:5, ≥1280×1600).
- 3D car: drop a compressed GLB at `public/models/car.glb` and set
  `CAR_MODEL_URL` in `components/three/car-model.tsx`.
