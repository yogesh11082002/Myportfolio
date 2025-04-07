"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import {
  fadeUpVariant,
  scaleUpVariant,
  slideInLeftVariant,
  slideInRightVariant,
} from "@/lib/animations";

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: "fadeUp" | "scaleUp" | "slideInLeft" | "slideInRight" | "custom";
  customVariant?: Variants;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  childClassName?: string;
  id?: string;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = "fadeUp",
  customVariant,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.2,
  childClassName = "",
  id,
}) => {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>({
    threshold,
    once,
  });

  // Select the appropriate animation variant
  const getVariant = (): Variants => {
    switch (animation) {
      case "fadeUp":
        return fadeUpVariant;
      case "scaleUp":
        return scaleUpVariant;
      case "slideInLeft":
        return slideInLeftVariant;
      case "slideInRight":
        return slideInRightVariant;
      case "custom":
        return customVariant || fadeUpVariant;
      default:
        return fadeUpVariant;
    }
  };

  return (
    <div ref={ref} className={className} id={id}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={getVariant()}
        custom={delay}
        transition={{ duration }}
        className={childClassName}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollAnimation;
