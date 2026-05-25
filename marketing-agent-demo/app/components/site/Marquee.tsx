"use client";
const ITEMS = [
    "LEED Platinum Certified",
    "Featured in The Times — UK",
    "South China Morning Post",
    "Home Journal — Hong Kong",
    "HK Golfer",
    "Hindustan Times",
    "The Economic Times",
    "CNBC TV18",
];

export const Marquee = () => {
    const doubled = [
        ...ITEMS.map((text) => ({ text, uid: `${text}-a` })),
        ...ITEMS.map((text) => ({ text, uid: `${text}-b` })),
    ];
    return (
        <section
            data-testid="accolades-marquee"
            aria-label="Press and recognition"
            className="bg-[#FAF9F6] border-y border-[#E5E0D5] overflow-hidden"
        >
            <div className="py-7 md:py-9 relative">
                <div className="marquee-track flex gap-16 md:gap-24 whitespace-nowrap will-change-transform">
                    {doubled.map((item) => (
                        <div
                            key={item.uid}
                            className="flex items-center gap-16 md:gap-24"
                        >
                            <span className="font-serif-display italic text-2xl md:text-3xl text-[#1A362D]">
                                {item.text}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                        </div>
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAF9F6] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAF9F6] to-transparent" />
            </div>
        </section>
    );
};

export default Marquee;
