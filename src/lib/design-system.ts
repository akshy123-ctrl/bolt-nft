/**
 * Design System Tokens
 * Used for Framer Motion, Three.js, and JS-based styling
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: "#0a0f1e",
    accent: {
      violet: "#7c3aed",
      cyan: "#06b6d4",
      pink: "#c026d3",
    },
    glass: {
      bg: "rgba(255, 255, 255, 0.03)",
      border: "rgba(255, 255, 255, 0.1)",
      highlight: "rgba(255, 255, 255, 0.05)",
    },
  },
  gradients: {
    violet: "linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)",
    cosmic: "linear-gradient(to right, #06b6d4, #7c3aed)",
    shimmer: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
  },
  shadows: {
    violetGlow: "0 0 20px rgba(124, 58, 237, 0.3)",
    cyanGlow: "0 0 20px rgba(6, 182, 212, 0.3)",
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
  },
  animation: {
    transitions: {
      spring: { type: "spring", stiffness: 300, damping: 30 },
      smooth: { type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.4 },
    },
    hover: {
      scale: 1.05,
      y: -5,
    },
    tap: {
      scale: 0.95,
    },
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
