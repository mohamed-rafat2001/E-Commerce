export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const fadeUp = (element, options = {}) => ({
  from: { opacity: 0, y: options.y ?? 40 },
  to: {
    opacity: 1,
    y: 0,
    duration: options.duration ?? 0.7,
    ease: options.ease ?? "power2.out",
    ...options,
  },
});

export const staggerFadeUp = (elements, options = {}) => ({
  targets: elements,
  from: { opacity: 0, y: options.y ?? 50 },
  to: {
    opacity: 1,
    y: 0,
    duration: options.duration ?? 0.6,
    ease: options.ease ?? "power2.out",
    stagger: options.stagger ?? 0.12,
    ...options,
  },
});

export const drawUnderline = (element, options = {}) => ({
  from: { scaleX: 0 },
  to: {
    scaleX: 1,
    transformOrigin: "left",
    duration: options.duration ?? 0.6,
    ease: options.ease ?? "power2.out",
    ...options,
  },
});
