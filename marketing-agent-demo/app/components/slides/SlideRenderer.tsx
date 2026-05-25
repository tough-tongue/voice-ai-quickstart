"use client";

import type { Slide } from "@/data/slides/schema";
import HeroLayout from "./layouts/HeroLayout";
import SplitLayout from "./layouts/SplitLayout";
import MosaicLayout from "./layouts/MosaicLayout";
import SpecsheetLayout from "./layouts/SpecsheetLayout";
import FullbleedLayout from "./layouts/FullbleedLayout";

const LAYOUTS = {
  hero: HeroLayout,
  split: SplitLayout,
  mosaic: MosaicLayout,
  specsheet: SpecsheetLayout,
  fullbleed: FullbleedLayout,
};

export default function SlideRenderer({ slide }: { slide: Slide }) {
  const Layout = LAYOUTS[slide.layout] ?? HeroLayout;
  return (
    <div
      className="w-full h-full"
      data-testid={`slide-${slide.id}`}
      data-slide-layout={slide.layout}
    >
      <Layout slide={slide} />
      {slide.draft && (
        <div
          data-testid="draft-stamp"
          className="absolute top-24 right-6 md:right-10 z-30 px-3 py-1.5 border border-[#C5A059] text-[#C5A059] text-[10px] tracking-[0.3em] uppercase bg-black/30 backdrop-blur-sm"
        >
          Draft
        </div>
      )}
    </div>
  );
}
