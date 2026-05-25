"use client";

import { useEffect, useRef } from "react";

/**
 * Applies a CSS translateY parallax to a `[data-parallax-img]` child
 * based on the element's scroll offset from the viewport center.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(speed = 0.18) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const img = node.querySelector<HTMLElement>("[data-parallax-img]");
    if (!img) return;

    let raf: number | null = null;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
      img.style.transform = `translate3d(0, ${offset * speed * 100}px, 0) scale(1.15)`;
      raf = null;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}
export default useParallax;
