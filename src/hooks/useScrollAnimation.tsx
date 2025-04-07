import { useRef, useState, useEffect, MutableRefObject } from "react";

interface ScrollOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

/**
 * Custom hook for detecting when an element is visible in the viewport
 * @param options Configuration options for the IntersectionObserver
 * @returns [ref, isInView] - Ref to attach to the element and boolean indicating if it's in view
 */
export default function useScrollAnimation<
  T extends HTMLElement = HTMLDivElement
>(options: ScrollOptions = {}): [MutableRefObject<T | null>, boolean] {
  const { threshold = 0.1, once = true, rootMargin = "0px" } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when element enters viewport
        if (entry.isIntersecting) {
          setIsInView(true);

          // If once is true, disconnect observer after element is in view
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          // If once is false, update state when element exits viewport
          setIsInView(false);
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    // Clean up observer on unmount
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, once, rootMargin]);

  return [ref, isInView];
}
