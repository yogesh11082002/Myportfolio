"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstMount, setIsFirstMount] = useState(true);

  // Only animate after first mount
  useEffect(() => {
    setTimeout(() => {
      setIsFirstMount(false);
    }, 500);
  }, []);

  const variants = {
    hidden: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.33, 1, 0.68, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  // Simpler overlay animation
  const overlayVariants = {
    initial: { y: "100%" },
    animate: {
      y: ["100%", "0%", "-100%"],
      transition: {
        duration: 0.7,
        times: [0, 0.4, 1],
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={isFirstMount ? false : "hidden"}
          animate="enter"
          exit="exit"
          variants={variants}
          className="min-h-screen"
        >
          {!isFirstMount && (
            <motion.div
              className="fixed inset-0 z-[100] bg-black pointer-events-none"
              initial="initial"
              animate="animate"
              variants={overlayVariants}
              key={`overlay-${pathname}`}
            />
          )}
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
