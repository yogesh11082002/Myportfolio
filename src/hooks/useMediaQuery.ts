"use client";

import { useState, useEffect } from "react";

type MediaQueryType = 
  | "sm" // 640px
  | "md" // 768px
  | "lg" // 1024px
  | "xl" // 1280px
  | "2xl" // 1536px
  | string; // Custom query

const getMediaQueryString = (query: MediaQueryType): string => {
  switch (query) {
    case "sm": return "(min-width: 640px)";
    case "md": return "(min-width: 768px)";
    case "lg": return "(min-width: 1024px)";
    case "xl": return "(min-width: 1280px)";
    case "2xl": return "(min-width: 1536px)";
    default: return query; // Assume it's a custom query string
  }
};

/**
 * Hook to check if media query matches
 * @param query Media query to check (can be predefined like "sm", "md", etc. or a custom media query string)
 * @param defaultState Default state to return if SSR
 * @returns Boolean indicating if the media query matches
 */
export default function useMediaQuery(
  query: MediaQueryType,
  defaultState = false
): boolean {
  const [matches, setMatches] = useState(defaultState);
  const mediaQuery = getMediaQueryString(query);

  useEffect(() => {
    // In SSR, there's no window object
    if (typeof window !== "undefined") {
      const media = window.matchMedia(mediaQuery);
      
      // Set initial value
      setMatches(media.matches);
      
      // Set up listener for changes
      const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
      media.addEventListener("change", listener);
      
      // Clean up
      return () => media.removeEventListener("change", listener);
    }
    
    return undefined;
  }, [mediaQuery]);

  return matches;
} 