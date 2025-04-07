import { Variants } from "framer-motion";

// Fade up animation (for text, images)
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100,
      duration: 0.5,
      delay: custom * 0.1,
    },
  }),
};

// Scale up animation (for cards, buttons)
export const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100,
      duration: 0.4,
      delay: custom * 0.1,
    },
  }),
};

// Slide in from left
export const slideInLeftVariant: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 100,
      duration: 0.6,
      delay: custom * 0.1,
    },
  }),
};

// Slide in from right
export const slideInRightVariant: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 100,
      duration: 0.6,
      delay: custom * 0.1,
    },
  }),
};

// Stagger container
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Text character reveal animation
export const charRevealVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 200,
    },
  },
};

// Hover scale effect
export const hoverScaleVariant = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Hover lift effect
export const hoverLiftVariant = {
  whileHover: { y: -5 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Path drawing animation (for SVG)
export const pathDrawVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
      delay: custom * 0.1,
    },
  }),
};

// Pulse animation
export const pulseVariant: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

// Flip card effect
export const flipCardVariant = {
  front: {
    rotateY: 0,
    transition: { duration: 0.4 },
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.4 },
  },
};

// Page transition
export const pageTransitionVariant: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}; 