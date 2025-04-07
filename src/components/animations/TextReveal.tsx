"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import useScrollAnimation from "@/hooks/useScrollAnimation";

interface TextRevealProps {
  text: string;
  className?: string;
  element?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  direction?: "up" | "down" | "left" | "right";
  staggerChildren?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  element = "p",
  direction = "up",
  staggerChildren = 0.03,
  delay = 0,
  once = true,
  threshold = 0.2,
}) => {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>({
    threshold,
    once,
  });

  // Split text into words
  const words = text.split(" ");

  // Get the appropriate animation variant based on direction
  const getAnimationVariant = (): Variants => {
    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              opacity: { duration: 0.5 },
              y: { type: "spring", stiffness: 100, damping: 12 },
              delay: i * staggerChildren + delay,
            },
          }),
        };
      case "down":
        return {
          hidden: { opacity: 0, y: -20 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              opacity: { duration: 0.5 },
              y: { type: "spring", stiffness: 100, damping: 12 },
              delay: i * staggerChildren + delay,
            },
          }),
        };
      case "left":
        return {
          hidden: { opacity: 0, x: 20 },
          visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
              opacity: { duration: 0.5 },
              x: { type: "spring", stiffness: 100, damping: 12 },
              delay: i * staggerChildren + delay,
            },
          }),
        };
      case "right":
        return {
          hidden: { opacity: 0, x: -20 },
          visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
              opacity: { duration: 0.5 },
              x: { type: "spring", stiffness: 100, damping: 12 },
              delay: i * staggerChildren + delay,
            },
          }),
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              opacity: { duration: 0.5 },
              y: { type: "spring", stiffness: 100, damping: 12 },
              delay: i * staggerChildren + delay,
            },
          }),
        };
    }
  };

  // Create the component based on the desired element
  const Element = motion[element];

  // Animation variants
  const variants = getAnimationVariant();

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block" style={{ whiteSpace: "pre" }}>
          <Element
            custom={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </Element>
        </span>
      ))}
    </div>
  );
};

export default TextReveal;
