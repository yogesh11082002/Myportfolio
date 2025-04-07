"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, animate } from "framer-motion";
import useMediaQuery from "@/hooks/useMediaQuery";

interface CursorFollowerProps {
  color?: string;
  size?: number;
  blur?: number;
  mixBlendMode?: string;
  showOnMobile?: boolean;
  trailEffect?: boolean;
  trailCount?: number;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({
  color = "rgba(147, 51, 234, 0.5)", // Purple
  size = 40,
  blur = 10,
  mixBlendMode = "normal",
  showOnMobile = false,
  trailEffect = false,
  trailCount = 5,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trailPositions, setTrailPositions] = useState<
    { x: number; y: number }[]
  >([]);

  const isDesktop = useMediaQuery("md");
  const shouldRender = showOnMobile || isDesktop;

  // Smooth spring animation for cursor movement
  const springConfig = { damping: 30, stiffness: 300 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    if (!shouldRender) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (trailEffect) {
        setTrailPositions((prev) => {
          const newPositions = [...prev, { x: e.clientX, y: e.clientY }];
          // Keep only the last {trailCount} positions
          if (newPositions.length > trailCount) {
            return newPositions.slice(newPositions.length - trailCount);
          }
          return newPositions;
        });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldRender, trailEffect, trailCount]);

  if (!shouldRender || !isHovering) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          x: cursorX,
          y: cursorY,
          height: size,
          width: size,
          borderRadius: "50%",
          backgroundColor: color,
          filter: `blur(${blur}px)`,
          mixBlendMode: mixBlendMode as any,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Trail effects */}
      {trailEffect &&
        trailPositions.map((pos, index) => {
          const opacity = 1 - index / trailCount;
          const scale = 1 - index / (trailCount * 2);

          return (
            <motion.div
              key={index}
              className="fixed pointer-events-none z-40"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity,
                scale,
                x: pos.x,
                y: pos.y,
              }}
              transition={{
                opacity: { duration: 0.5 },
                x: { type: "spring", damping: 40, stiffness: 400 },
                y: { type: "spring", damping: 40, stiffness: 400 },
              }}
              style={{
                height: size * scale,
                width: size * scale,
                borderRadius: "50%",
                backgroundColor: color,
                filter: `blur(${blur * scale}px)`,
                mixBlendMode: mixBlendMode as any,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
    </>
  );
};

export default CursorFollower;
