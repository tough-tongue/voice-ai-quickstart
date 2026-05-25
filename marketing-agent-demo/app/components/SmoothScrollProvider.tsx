"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/** Activates Lenis smooth scroll for the wrapped subtree. */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();
  return <>{children}</>;
}
