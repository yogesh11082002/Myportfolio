"use client";

import { useEffect, useRef } from "react";

// Placeholder function that always returns a null reference
export function useSmoothScroll() {
  return useRef(null);
}

// Simple direct scroll without smoothing
export function scrollToElement(
  selector: string,
  options: { offset?: number; duration?: number } = {}
) {
  try {
    const element = document.querySelector(selector);
    if (element) {
      // Use standard scrollIntoView without smooth behavior
      element.scrollIntoView();
      
      // Apply offset if specified
      if (options.offset) {
        window.scrollBy(0, options.offset);
      }
    }
  } catch (error) {
    console.error("Error scrolling to element:", error);
  }
}

// Simple scroll to top without smoothing
export function scrollToTop() {
  try {
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error scrolling to top:", error);
  }
}

export default useSmoothScroll; 