"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ParallaxEffectProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  speed?: number; // 0 to 10, where 10 is the fastest
  className?: string;
  offset?: [number, number]; // Input range [start, end] as percentage of viewport
  outputRange?: [number, number]; // Output range in pixels
}

const ParallaxEffect: React.FC<ParallaxEffectProps> = ({
  children,
  direction = "up",
  speed = 5,
  className = "",
  offset = [0, 1],
  outputRange = [-50, 50],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Normalize speed to a value between 0 and 1
  const normalizedSpeed = speed / 10;

  // Calculate the output range based on speed and direction
  let transformRange: [number, number] = [...outputRange];

  if (direction === "down" || direction === "right") {
    transformRange = [outputRange[1], outputRange[0]];
  }

  // Scale output range by speed
  transformRange = transformRange.map((val) => val * normalizedSpeed) as [
    number,
    number
  ];

  // Create transform motion value
  const motionValue = getMotionValue(
    direction,
    scrollYProgress,
    transformRange
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={getMotionStyle(direction, motionValue)}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Helper function to get the appropriate motion value based on direction
function getMotionValue(
  direction: "up" | "down" | "left" | "right",
  scrollYProgress: MotionValue<number>,
  outputRange: [number, number]
): MotionValue<number> {
  switch (direction) {
    case "up":
    case "down":
      return useTransform(scrollYProgress, [0, 1], outputRange);
    case "left":
    case "right":
      return useTransform(scrollYProgress, [0, 1], outputRange);
    default:
      return useTransform(scrollYProgress, [0, 1], outputRange);
  }
}

// Helper function to get the motion style based on direction
function getMotionStyle(
  direction: "up" | "down" | "left" | "right",
  motionValue: MotionValue<number>
): { y?: MotionValue<number>; x?: MotionValue<number> } {
  switch (direction) {
    case "up":
    case "down":
      return { y: motionValue };
    case "left":
    case "right":
      return { x: motionValue };
    default:
      return { y: motionValue };
  }
}

export default ParallaxEffect;
