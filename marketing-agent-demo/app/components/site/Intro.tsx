"use client";
import useReveal from "@/hooks/useReveal";

export const Intro = () => {
    const r1 = useReveal<HTMLDivElement>();
    const r2 = useReveal<HTMLDivElement>();
    const r3 = useReveal<HTMLDivElement>();

    return (
        <section
            id="intro"
            data-testid="intro-section"
            className="bg-[#FAF9F6] py-28 md:py-40"
        >
            <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-16">
                <div ref={r1} className="reveal text-center mb-16">
                    <span className="overline">The Inspiration</span>
                    <span className="gold-divider ml-4 mb-1" />
                </div>

                <h2
                    ref={r2}
                    data-testid="intro-headline"
                    className="reveal font-serif-display text-[#1A362D] text-center text-[clamp(1.85rem,3.6vw,3.4rem)] leading-[1.15] tracking-tight max-w-5xl mx-auto"
                >
                    The name draws from one of Asia&rsquo;s most beautiful native
                    flowering species — the Camellia, a blossom that unfolds in
                    a spectrum of quiet colour.
                </h2>

                <div
                    ref={r3}
                    className="reveal mt-20 grid md:grid-cols-2 gap-14 md:gap-20 max-w-5xl mx-auto"
                >
                    <p
                        className="text-[#2C302E] font-body text-[15px] md:text-base leading-[1.9] tracking-wide"
                        data-testid="intro-paragraph-1"
                    >
                        The architecture reveals itself with quiet authority.
                        Sixteen towers, ranging from eighteen to thirty-eight
                        storeys, compose a distinctive skyline against the
                        setting sun — crowned by a tower that rises a luminous
                        one hundred and fifty-six metres into the air.
                    </p>
                    <p
                        className="text-[#59615D] font-body text-[15px] md:text-base leading-[1.9] tracking-wide"
                        data-testid="intro-paragraph-2"
                    >
                        The Camellias is the pinnacle of DLF&rsquo;s acclaimed
                        super-luxury portfolio — following in the footsteps of
                        The Aralias and The Magnolias. Together, these
                        residences have set pioneering benchmarks in amenity,
                        view and bespoke service.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Intro;
