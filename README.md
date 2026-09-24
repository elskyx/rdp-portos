# RDP. — Rizky Dwi Putra · Creative Developer

A cinematic, automotive, interactive 3D portfolio. One continuous scroll-driven
sequence: a glossy black coupe floating through a cold-blue sky above a sea of
clouds, descending into a dark studio, then the work, experiments, about,
capabilities and a headlight-lit finale.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · Motion (`motion/react`) · React Three Fiber + drei + postprocessing ·
Three.js · GSAP (scroll choreography only) · Lenis (inertia scroll) · Lucide.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/                 layout (fonts, providers), page (composition), globals.css (design tokens)
components/          one file per section + global chrome
  three/             procedural car, sky, studio, camera rig, effects
  ui/                shared primitives (adapted from 21st.dev patterns)
lib/                 content, animation tokens, scroll/app stores, device tiers, gsap
public/images/       rendered project + gallery imagery
DESIGN.md            art direction + build contract — read this first
```

## Make it yours

- **Copy, links, projects:** everything lives in `lib/content.ts`
  (`site.links` holds placeholder email / GitHub / Instagram — replace them).
- **Images:** `public/images/projects/*.webp` (16:10) and
  `public/images/gallery/*.webp` (4:5).
- **Real car model:** export a compressed GLB (Draco/Meshopt) to
  `public/models/car.glb` and set `CAR_MODEL_URL` in
  `components/three/car-model.tsx`.

## Performance & accessibility

- One WebGL canvas for the whole site; rendering stops when it's covered.
- Quality tiers (`lib/device.ts`): post-processing, depth of field, clouds and
  particles scale down on tablets and phones; DPR is capped.
- `prefers-reduced-motion`: native scrolling, no camera motion, no custom
  cursor, content shown immediately.
