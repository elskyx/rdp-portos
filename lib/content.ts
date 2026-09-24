/**
 * All site copy and data in one place. Replace the placeholder links and
 * project details below with real ones — components read only from here.
 */

export const site = {
  name: "Rizky Dwi Putra",
  fullName: "Rizky Dwi Putra Piliang",
  initials: "RDP.",
  role: "Creative Developer",
  tagline: "Creative developer building cinematic 3D, web and interactive experiences.",
  location: "Indonesia",
  year: 2026,
  /** PLACEHOLDERS — replace with real handles before publishing. */
  links: {
    email: "hello@rizkydwiputra.dev",
    github: "https://github.com/rizkydwiputra",
    instagram: "https://instagram.com/rizkydwiputra",
  },
} as const;

export type NavId = "work" | "experiments" | "about" | "contact";

/** Section anchors. `nav` groups sub-sections under one nav item. */
export const sections = {
  hero: { id: "top", nav: null },
  work: { id: "work", nav: "work", index: "01", label: "Selected Work" },
  archive: { id: "archive", nav: "work", index: "01.2", label: "Archive" },
  experiments: { id: "experiments", nav: "experiments", index: "02", label: "Experiments" },
  about: { id: "about", nav: "about", index: "03", label: "About" },
  skills: { id: "skills", nav: "about", index: "03.2", label: "Capabilities" },
  contact: { id: "contact", nav: "contact", index: "04", label: "Contact" },
} as const;

export const navItems: { id: NavId; label: string; href: string }[] = [
  { id: "work", label: "Work", href: "#work" },
  { id: "experiments", label: "Experiments", href: "#experiments" },
  { id: "about", label: "About", href: "#about" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const hero = {
  titleLines: ["Rizky", "Dwi Putra"],
  subtitleLines: ["Creative Developer", "• 3D • Web • Interactive"],
  cta: { label: "Explore Work", href: "#work" },
  scrollHint: "Scroll to discover",
  /** Small technical readouts around the frame. */
  meta: [
    { k: "Based", v: "Indonesia" },
    { k: "Discipline", v: "3D / Web / Game" },
    { k: "Status", v: "Available — 2026" },
  ],
} as const;

export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  year: string;
  role: string;
  image: string;
  imageAlt: string;
  href: string;
};

export const projects: Project[] = [
  {
    id: "nfs",
    index: "01",
    title: "Need For Speed Inspired Experience",
    category: "Game / Unity / 3D",
    description:
      "An experimental automotive racing experience inspired by cinematic street racing games — night streets, wet asphalt, and a camera that feels every gear change.",
    tech: ["Unity", "C#", "Blender", "Vehicle Physics", "HDRP"],
    year: "2026",
    role: "Game Dev / Vehicle Systems",
    image: "/images/projects/01-nfs.webp",
    imageAlt: "Black sports car on a wet night street lit by cold blue streetlights",
    href: "#",
  },
  {
    id: "automotive-ui",
    index: "02",
    title: "Interactive Automotive UI",
    category: "Web / Interaction / UI",
    description:
      "A configurator-style interface that reads a car's systems at a glance — telemetry, drive modes and a live 3D model that reacts to every control.",
    tech: ["React", "TypeScript", "Motion", "Three.js"],
    year: "2026",
    role: "UI Engineering / Motion",
    image: "/images/projects/02-automotive-ui.webp",
    imageAlt: "Dark automotive heads-up display with speed and telemetry readouts",
    href: "#",
  },
  {
    id: "digital-experience",
    index: "03",
    title: "3D Digital Experience",
    category: "Three.js / WebGL",
    description:
      "A scroll-driven WebGL journey through a sky of clouds, built around a single hero object and a slow, damped cinematic camera.",
    tech: ["Three.js", "React Three Fiber", "GLSL", "Blender"],
    year: "2025",
    role: "Creative Development",
    image: "/images/projects/03-digital-experience.webp",
    imageAlt: "Black sports car suspended above a sea of clouds in a deep blue sky",
    href: "#",
  },
  {
    id: "web-experiment",
    index: "04",
    title: "Creative Web Experiment",
    category: "Web / Motion",
    description:
      "A playground of kinetic typography and shader-driven surfaces — testing where motion stops being decoration and starts being interface.",
    tech: ["Next.js", "GSAP", "Motion", "WebGL"],
    year: "2025",
    role: "Design + Development",
    image: "/images/projects/04-web-experiment.webp",
    imageAlt: "Abstract electric-blue light streaks flowing across a black surface",
    href: "#",
  },
];

export type GalleryItem = {
  id: string;
  index: string;
  label: string;
  caption: string;
  image: string;
  imageAlt: string;
};

export const gallery: GalleryItem[] = [
  {
    id: "automotive",
    index: "01",
    label: "Automotive",
    caption: "Forged mesh wheel study — lighting a single rim until it reads like jewellery.",
    image: "/images/gallery/01-automotive.webp",
    imageAlt: "Close-up of a mesh alloy wheel with a polished lip on a black car",
  },
  {
    id: "game-design",
    index: "02",
    label: "Game Design",
    caption: "Blockout of a night circuit — sightlines, braking zones and camera rails.",
    image: "/images/gallery/02-game-design.webp",
    imageAlt: "Top-down blueprint of a racing circuit with a car marker",
  },
  {
    id: "webgl",
    index: "03",
    label: "WebGL",
    caption: "Wireframe pass of the hero vehicle, rendered in real time in the browser.",
    image: "/images/gallery/03-webgl.webp",
    imageAlt: "Blue wireframe render of a sports car on a technical grid",
  },
  {
    id: "ui-system",
    index: "04",
    label: "UI System",
    caption: "Instrument cluster components — one type scale, one grid, zero decoration.",
    image: "/images/gallery/04-ui-system.webp",
    imageAlt: "Grid of dark automotive interface components and gauges",
  },
  {
    id: "experimental",
    index: "05",
    label: "Experimental",
    caption: "Light-trail shader — scroll velocity drawn as long-exposure streaks.",
    image: "/images/gallery/05-experimental.webp",
    imageAlt: "Long-exposure style light trails in electric blue",
  },
];

export type ExperimentPreview = "shader" | "wireframe" | "orbit" | "hud" | "grid" | "type";

export type Experiment = {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  description: string;
  preview: ExperimentPreview;
};

export const experiments: Experiment[] = [
  {
    id: "cloud-volume",
    index: "E.01",
    title: "Cloud Volume",
    category: "Shader",
    year: "2026",
    description: "Raymarched cumulus with cheap light scattering, tuned for 60fps on a laptop.",
    preview: "shader",
  },
  {
    id: "mesh-wheel",
    index: "E.02",
    title: "Mesh Wheel",
    category: "3D",
    year: "2026",
    description: "Procedural cross-spoke rim generator — one parameter set, infinite wheels.",
    preview: "wireframe",
  },
  {
    id: "drift-camera",
    index: "E.03",
    title: "Drift Camera",
    category: "Motion",
    year: "2025",
    description: "A chase camera with inertia and lag that makes slow orbits feel heavy.",
    preview: "orbit",
  },
  {
    id: "hud-kit",
    index: "E.04",
    title: "HUD Kit",
    category: "UI",
    year: "2025",
    description: "Speed, gear and G-force readouts as reusable, animated React components.",
    preview: "hud",
  },
  {
    id: "night-run",
    index: "E.05",
    title: "Night Run",
    category: "Game Prototype",
    year: "2025",
    description: "Unity arcade racer prototype — handling model, drift scoring and a ghost car.",
    preview: "grid",
  },
  {
    id: "magnetic-type",
    index: "E.06",
    title: "Magnetic Type",
    category: "Motion / UI",
    year: "2024",
    description: "Typography that leans toward the cursor with spring physics per glyph.",
    preview: "type",
  },
];

export const about = {
  headlineLines: ["I build digital", "experiences", "that feel alive."],
  body: "Developer focused on interactive web experiences, creative coding, 3D, game development and motion.",
  bodyLong:
    "I'm a Software Engineering (RPL) student in Class XI who treats every project like a film shot — composition first, then light, then motion. I move between Unity, Blender and the browser to build things that feel physical.",
  facts: [
    { k: "Location", v: "Indonesia" },
    { k: "Focus", v: "Web / 3D / Game Development" },
    { k: "Tools", v: "Unity / Blender / React / Three.js" },
    { k: "Currently", v: "Building new experiences" },
    { k: "Education", v: "XI RPL — Software Engineering" },
  ],
  stats: [
    { value: 3, suffix: "", pad: 2, label: "Years writing code" },
    { value: 24, suffix: "+", pad: 2, label: "Experiments built" },
    { value: 8, suffix: "", pad: 2, label: "Shipped projects" },
    { value: 1, suffix: "", pad: 2, label: "Racing game in progress" },
  ],
} as const;

export type SkillGroup = { id: string; index: string; title: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    id: "development",
    index: "S.01",
    title: "Development",
    items: ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    id: "3d",
    index: "S.02",
    title: "3D",
    items: ["Blender", "Three.js", "React Three Fiber"],
  },
  {
    id: "game",
    index: "S.03",
    title: "Game Development",
    items: ["Unity", "C#", "Game UI", "Vehicle Systems"],
  },
  {
    id: "design",
    index: "S.04",
    title: "Design",
    items: ["UI/UX", "Motion Design", "Visual Design"],
  },
];

export const contact = {
  headlineLines: ["Let's build", "something."],
  availableFor: ["Creative projects", "Interactive websites", "3D experiences", "Game prototypes"],
  buttons: [
    { label: "Email me", href: `mailto:${site.links.email}`, external: false },
    { label: "GitHub", href: site.links.github, external: true },
    { label: "Instagram", href: site.links.instagram, external: true },
  ],
} as const;

export const footer = {
  links: [
    { label: "Instagram", href: site.links.instagram, external: true },
    { label: "GitHub", href: site.links.github, external: true },
    { label: "Email", href: `mailto:${site.links.email}`, external: false },
  ],
} as const;
