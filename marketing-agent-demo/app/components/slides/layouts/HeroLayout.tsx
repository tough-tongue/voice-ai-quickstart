"use client";
/**
 * Hero — single full-bleed image with text overlay centered or at base.
 */
export default function HeroLayout({ slide }) {
    const [img] = slide.images;
    return (
        <div className="relative w-full h-full bg-[#0d100f]">
            <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/65" />

            <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-8 pb-[14vh]">
                {slide.eyebrow && (
                    <span
                        className="overline text-[#E5E0D5] mb-6"
                        data-testid="slide-eyebrow"
                    >
                        {slide.eyebrow}
                    </span>
                )}
                <h1
                    data-testid="slide-title"
                    className="font-serif-display text-white text-[clamp(2.4rem,5.5vw,5.5rem)] leading-[0.98] tracking-tight max-w-5xl"
                >
                    {slide.title}
                </h1>
                {slide.subtitle && (
                    <p
                        data-testid="slide-subtitle"
                        className="mt-6 font-serif-display italic text-[#C5A059] text-xl md:text-2xl max-w-3xl"
                    >
                        {slide.subtitle}
                    </p>
                )}
                {slide.body && (
                    <p
                        data-testid="slide-body"
                        className="mt-8 font-body text-white/85 text-[15px] md:text-base leading-[1.85] max-w-2xl"
                    >
                        {slide.body}
                    </p>
                )}
            </div>
        </div>
    );
}
