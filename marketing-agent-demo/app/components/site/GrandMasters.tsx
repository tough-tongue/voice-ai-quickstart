"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useReveal from "@/hooks/useReveal";

const MASTERS = [
    {
        name: "Hafeez Contractor",
        role: "Architecture",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=80",
        text: "Associated with DLF since the 1980s, the renowned architect counts The Camellias among the projects he is proudest of. Every building, he insists, is more than a building — and here, the ambition begins with the environment itself.",
    },
    {
        name: "Shawn Sullivan",
        role: "Interior Design",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
        text: "Based in New York, the Rockwell Group has shaped some of the world's most acclaimed hospitality spaces — Nobu, 15 Hudson Yards, the Casino at Marina Bay Sands and the Penthouse at the Greenwich Hotel.",
    },
    {
        name: "Gerdo Aquino",
        role: "Landscape",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80",
        text: "Led by Gerdo Aquino, SWA is a landscape architecture and urban design firm behind some of the world's most iconic projects, including the Burj Khalifa, Samsung's American Headquarters and the Shenzhen Bay.",
    },
    {
        name: "Jay Wright",
        role: "Wellness",
        image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80",
        text: "The Wright Fit specialises in fitness centre design and management for the world's most prestigious properties — from 15 Central Park West to Palazzo del Sol in Miami.",
    },
    {
        name: "Arnold Chan",
        role: "Lighting",
        image: "/images/arnold-bg.jpg",
        text: "Principal designer at Isometrix Lighting + Design, Arnold's atmospheres define spaces from Edition hotels and Public Hotel to Mandarin Oriental — lighting that orchestrates calm at every hour.",
    },
    {
        name: "Ingo Schweder",
        role: "Hospitality",
        image: "/images/ingo-banner.jpg",
        text: "Goco Hospitality, with offices in Shanghai, Bangkok, Los Angeles and Berlin, has shaped over thirty-five prestigious projects — from Bulgari Hotels Beijing to The Ritz-Carlton Melbourne and Waldorf Astoria Maldives.",
    },
];

export const GrandMasters = () => {
    const [index, setIndex] = useState(0);
    const rTitle = useReveal<HTMLDivElement>();
    const rCard = useReveal<HTMLDivElement>();

    const next = () => setIndex((i) => (i + 1) % MASTERS.length);
    const prev = () =>
        setIndex((i) => (i - 1 + MASTERS.length) % MASTERS.length);

    const active = MASTERS[index];

    return (
        <section
            id="masters"
            data-testid="grand-masters-section"
            className="bg-[#F0EBE1] py-28 md:py-36"
        >
            <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16">
                <div
                    ref={rTitle}
                    className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
                >
                    <div>
                        <span className="overline">Collaborators</span>
                        <h2 className="font-serif-display text-[#1A362D] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-tight mt-4">
                            The Grand Masters
                        </h2>
                    </div>
                    <p
                        data-testid="masters-intro"
                        className="max-w-md text-[#59615D] font-body text-sm md:text-base leading-relaxed"
                    >
                        Six visionary studios from across the world were
                        entrusted with shaping every dimension of the
                        residence — architecture, interiors, landscape,
                        wellness, lighting and hospitality.
                    </p>
                </div>

                <div
                    ref={rCard}
                    className="reveal grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
                >
                    <div className="lg:col-span-7 relative overflow-hidden bg-[#1A362D] h-[60vh] lg:h-[72vh]">
                        <img
                            key={active.image}
                            src={active.image}
                            alt={active.name}
                            data-testid="master-image"
                            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <span className="text-[12px] tracking-[0.32em] uppercase opacity-85">
                                {active.role}
                            </span>
                            <h3
                                data-testid="master-name-overlay"
                                className="font-serif-display text-3xl md:text-5xl mt-2 leading-none"
                            >
                                {active.name}
                            </h3>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF9F6] p-10 md:p-14">
                        <div>
                            <span className="text-[13px] tracking-[0.3em] uppercase text-[#C5A059]">
                                {String(index + 1).padStart(2, "0")} /{" "}
                                {String(MASTERS.length).padStart(2, "0")}
                            </span>
                            <h4
                                data-testid="master-name"
                                className="font-serif-display text-[#1A362D] text-4xl md:text-5xl mt-6 leading-tight tracking-tight"
                            >
                                {active.name}
                            </h4>
                            <span className="gold-divider mt-6 mb-8" />
                            <p
                                data-testid="master-bio"
                                className="text-[#2C302E] font-body text-[15px] leading-[1.95] tracking-wide"
                            >
                                {active.text}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#E5E0D5]">
                            <div className="flex gap-2">
                                {MASTERS.map((m, i) => (
                                    <button
                                        key={m.name}
                                        data-testid={`master-dot-${i}`}
                                        onClick={() => setIndex(i)}
                                        aria-label={`Go to ${m.name}`}
                                        className={`h-[3px] transition-all duration-500 ${
                                            i === index
                                                ? "w-10 bg-[#1A362D]"
                                                : "w-5 bg-[#E5E0D5]"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    data-testid="masters-prev"
                                    onClick={prev}
                                    aria-label="Previous"
                                    className="w-11 h-11 border border-[#1A362D] flex items-center justify-center text-[#1A362D] hover:bg-[#1A362D] hover:text-[#FAF9F6] transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <button
                                    data-testid="masters-next"
                                    onClick={next}
                                    aria-label="Next"
                                    className="w-11 h-11 border border-[#1A362D] flex items-center justify-center text-[#1A362D] hover:bg-[#1A362D] hover:text-[#FAF9F6] transition-colors"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GrandMasters;
