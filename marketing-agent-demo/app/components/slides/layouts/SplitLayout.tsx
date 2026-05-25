"use client";
/**
 * Split — left text panel, right single image (or right text, left image alt).
 */
export default function SplitLayout({ slide }) {
    const [img] = slide.images;
    return (
        <div className="w-full h-full grid lg:grid-cols-12 bg-[#FAF9F6]">
            <div className="lg:col-span-5 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16">
                {slide.eyebrow && (
                    <span className="overline" data-testid="slide-eyebrow">
                        {slide.eyebrow}
                    </span>
                )}
                <h1
                    data-testid="slide-title"
                    className="font-serif-display text-[#1A362D] text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02] tracking-tight mt-6"
                >
                    {slide.title}
                </h1>
                {slide.subtitle && (
                    <p
                        data-testid="slide-subtitle"
                        className="mt-5 font-serif-display italic text-[#C5A059] text-xl md:text-2xl"
                    >
                        {slide.subtitle}
                    </p>
                )}
                <span className="gold-divider mt-8" />
                {slide.body && (
                    <p
                        data-testid="slide-body"
                        className="mt-8 font-body text-[#2C302E] text-[15px] leading-[1.95] max-w-md"
                    >
                        {slide.body}
                    </p>
                )}
            </div>

            <div className="lg:col-span-7 relative overflow-hidden min-h-[40vh] lg:min-h-0 bg-[#1A362D]">
                <img
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {img.caption && (
                    <div className="absolute bottom-6 left-6 text-white/85 text-xs tracking-[0.22em] uppercase">
                        {img.caption}
                    </div>
                )}
            </div>
        </div>
    );
}
