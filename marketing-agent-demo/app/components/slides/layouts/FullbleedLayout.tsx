"use client";
/**
 * Fullbleed — pure image, with only an optional title in the corner.
 */
export default function FullbleedLayout({ slide }) {
    const [img] = slide.images;
    return (
        <div className="relative w-full h-full bg-[#0d100f]">
            <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/30" />

            <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-16 lg:px-24 pb-[14vh] max-w-4xl">
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
                    className="font-serif-display text-white text-[clamp(2.4rem,5.5vw,5.5rem)] leading-[0.98] tracking-tight"
                >
                    {slide.title}
                </h1>
                {slide.subtitle && (
                    <p className="mt-6 font-serif-display italic text-[#C5A059] text-xl md:text-2xl">
                        {slide.subtitle}
                    </p>
                )}
                {slide.body && (
                    <p
                        data-testid="slide-body"
                        className="mt-6 font-body text-white/85 text-[15px] leading-[1.85] max-w-xl"
                    >
                        {slide.body}
                    </p>
                )}
            </div>
        </div>
    );
}
