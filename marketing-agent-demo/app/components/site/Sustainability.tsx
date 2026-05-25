"use client";
import useReveal from "@/hooks/useReveal";
import useParallax from "@/hooks/useParallax";
import { Leaf, Droplets, Sun, Recycle } from "lucide-react";

const PILLARS = [
    {
        icon: Leaf,
        label: "Native Landscape",
        text: "A planting palette of indigenous species supports biodiversity and resilient ecosystems on site.",
    },
    {
        icon: Droplets,
        label: "Water Stewardship",
        text: "Rainwater harvesting and recycled water for plumbing reduce potable water demand by up to forty-five percent.",
    },
    {
        icon: Sun,
        label: "Energy Efficiency",
        text: "Insulated façades, high-efficiency VRV systems and solar hot water deliver thirty-two percent savings against ASHRAE benchmarks.",
    },
    {
        icon: Recycle,
        label: "Healthy Materials",
        text: "Low-VOC finishes, non-CFC refrigerants and recycled-content construction materials run through every detail.",
    },
];

export const Sustainability = () => {
    const rTitle = useReveal<HTMLDivElement>();
    const rBody = useReveal<HTMLDivElement>();
    const rImage = useReveal<HTMLDivElement>();
    const parallaxRef = useParallax<HTMLDivElement>(0.2);

    return (
        <section
            id="sustainability"
            data-testid="sustainability-section"
            className="bg-[#1A362D] text-[#FAF9F6] py-28 md:py-40 overflow-hidden"
        >
            <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    <div className="lg:col-span-5">
                        <div ref={rTitle} className="reveal">
                            <span
                                className="overline"
                                style={{ color: "#C5A059" }}
                            >
                                Project Pulse
                            </span>
                            <h2 className="font-serif-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-tight mt-4">
                                A quiet
                                <br />
                                commitment
                                <br />
                                <span className="italic text-[#C5A059]">
                                    to the earth.
                                </span>
                            </h2>
                        </div>
                        <div
                            ref={rBody}
                            className="reveal mt-10 max-w-md text-[15px] font-body leading-[1.95] opacity-85"
                        >
                            <p data-testid="sustainability-paragraph">
                                The Camellias is the first residential project
                                in India to achieve{" "}
                                <span className="text-[#C5A059]">
                                    LEED Platinum
                                </span>{" "}
                                certification from the USGBC — the most
                                respected green-building benchmark in the
                                world. Every choice, from site management to
                                material sourcing, has been shaped by a
                                long-term view of place.
                            </p>
                        </div>
                        <div
                            ref={rImage}
                            className="reveal mt-12 inline-flex items-baseline gap-4 border-t border-[#C5A059]/40 pt-6"
                        >
                            <span
                                className="font-serif-display text-5xl md:text-6xl leading-none"
                                style={{ color: "#C5A059" }}
                                data-testid="leed-stat-number"
                            >
                                01
                            </span>
                            <span className="text-xs tracking-[0.22em] uppercase opacity-85 max-w-[12rem] leading-[1.7]">
                                First residential project in India with LEED
                                Platinum
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div
                            ref={parallaxRef}
                            className="relative aspect-[5/4] overflow-hidden border border-[#C5A059]/20"
                        >
                            <img
                                data-parallax-img
                                src="/images/events/sustainable_effort.jpg"
                                alt="The Camellias — sustainable design and landscape"
                                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                                style={{ transform: "scale(1.15)" }}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A362D]/40 via-transparent to-transparent" />
                        </div>

                        <div className="mt-12 grid sm:grid-cols-2 gap-px bg-[#C5A059]/15">
                            {PILLARS.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <div
                                        key={p.label}
                                        data-testid={`pillar-${i}`}
                                        className="bg-[#1A362D] p-7 md:p-8 flex flex-col gap-4"
                                    >
                                        <Icon
                                            size={22}
                                            style={{ color: "#C5A059" }}
                                            strokeWidth={1.4}
                                        />
                                        <h4 className="font-serif-display text-2xl leading-tight">
                                            {p.label}
                                        </h4>
                                        <p className="text-[13.5px] font-body leading-[1.85] opacity-80">
                                            {p.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sustainability;
