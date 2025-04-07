"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  UserIcon,
  CodeIcon,
  LayoutIcon,
  PhoneIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/about", label: "About", icon: UserIcon },
  { href: "/projects", label: "Projects", icon: CodeIcon },
  { href: "/services", label: "Services", icon: LayoutIcon },
  { href: "/contact", label: "Contact", icon: PhoneIcon },
];

const MobileBottomMenu = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior - hide menu when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    // Add event listener with a throttle to improve performance
    let timeoutId: NodeJS.Timeout;
    const throttledScrollHandler = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = undefined;
        }, 150);
      }
    };

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <nav className="flex justify-around items-center h-16">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link href={item.href} key={item.href} className="relative">
                  <div className="flex flex-col items-center justify-center w-16 h-full">
                    {isActive && (
                      <motion.div
                        layoutId="bottomMenuIndicator"
                        className="absolute inset-0 bg-purple-500/20 rounded-md z-0"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <item.icon
                      className={`relative z-10 w-5 h-5 mb-1 ${
                        isActive ? "text-purple-500" : "text-gray-400"
                      }`}
                    />

                    <span
                      className={`text-xs relative z-10 ${
                        isActive
                          ? "text-purple-500 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomMenu;
