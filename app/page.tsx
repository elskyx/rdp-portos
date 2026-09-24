import { Counter } from "@/components/ui/counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ScrambleText } from "@/components/ui/scramble-text";
import { SectionLabel } from "@/components/ui/section-label";
import { TextReveal } from "@/components/ui/text-reveal";

// Temporary specimen page — replaced by the full composition after the build phase.
export default function Home() {
  return (
    <main id="main" className="px-gutter flex min-h-dvh flex-col justify-center gap-10 py-24">
      <SectionLabel index="01" label="Selected Work" rule aside="(04)" />
      <TextReveal as="h1" lines={["Rizky", "Dwi Putra"]} className="font-display text-mega" trigger />
      <TextReveal as="h2" variant="mask" lines={["Building digital", "experiences"]} className="font-display text-display" trigger />
      <p className="max-w-md text-fg-muted">Developer focused on interactive web experiences, creative coding, 3D, game development and motion.</p>
      <div className="flex flex-wrap gap-4">
        <MagneticButton href="#work" variant="solid" size="lg">Explore Work</MagneticButton>
        <MagneticButton href="#contact" icon="arrow-right">Email me</MagneticButton>
        <MagneticButton icon="arrow-down" variant="ghost" size="sm">Scroll to discover</MagneticButton>
      </div>
      <div className="text-meta flex gap-10 text-fg-muted">
        <span>Location <ScrambleText text="INDONESIA" className="text-fg" trigger /></span>
        <span className="font-display text-headline text-fg"><Counter value={24} suffix="+" /></span>
      </div>
    </main>
  );
}
