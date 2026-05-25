"use client";
/**
 * Mosaic — text + 2–3 images arranged asymmetrically.
 */
export default function MosaicLayout({ slide }) {
    const [a, b, c] = slide.images;
    return (
        <div className="w-full h-full grid lg:grid-cols-12 bg-[#F0EBE1]">
            <div className="lg:col-span-4 flex flex-col justify-center px-10 md:px-14 py-16 bg-[#FAF9F6]">
                {slide.eyebrow && (
                    <span className="overline" data-testid="slide-eyebrow">
                        {slide.eyebrow}
                    </span>
                )}
                <h1
                    data-testid="slide-title"
                    className="font-serif-display text-[#1A362D] text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.02] tracking-tight mt-6"
                >
                    {slide.title}
                </h1>
                {slide.subtitle && (
                    <p className="mt-5 font-serif-display italic text-[#C5A059] text-lg md:text-xl">
                        {slide.subtitle}
                    </p>
                )}
                <span className="gold-divider mt-8" />
                {slide.body && (
                    <p
                        data-testid="slide-body"
                        className="mt-8 font-body text-[#2C302E] text-[14.5px] leading-[1.9] max-w-md"
                    >
                        {slide.body}
                    </p>
                )}
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 grid-rows-2 gap-2 md:gap-3 p-2 md:p-3">
                <div className="relative overflow-hidden row-span-2">
                    <img
                        src={a.src}
                        alt={a.alt}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                {b && (
                    <div className="relative overflow-hidden">
                        <img
                            src={b.src}
                            alt={b.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                )}
                {c && (
                    <div className="relative overflow-hidden">
                        <img
                            src={c.src}
                            alt={c.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
