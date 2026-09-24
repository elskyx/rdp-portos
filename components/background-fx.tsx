/**
 * Global film grain. Static SVG noise, shifted in 6 discrete steps — a single
 * composited transform, never a repaint. Sits above content, below the cursor.
 * Disabled animation under reduced motion (globals.css).
 */
export function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <div className="grain" />
    </div>
  );
}
