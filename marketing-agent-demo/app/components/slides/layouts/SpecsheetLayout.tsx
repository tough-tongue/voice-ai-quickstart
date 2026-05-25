"use client";
/**
 * Specsheet — text + structured spec table + 1 image.
 */
export default function SpecsheetLayout({ slide }) {
    const [img] = slide.images;
    return (
        <div className="w-full h-full grid lg:grid-cols-12 bg-[#FAF9F6]">
            <div className="lg:col-span-7 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 overflow-y-auto">
                {slide.eyebrow && (
                    <span className="overline" data-testid="slide-eyebrow">
                        {slide.eyebrow}
                    </span>
                )}
                <h1
                    data-testid="slide-title"
                    className="font-serif-display text-[#1A362D] text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-tight mt-6"
                >
                    {slide.title}
                </h1>
                {slide.subtitle && (
                    <p className="mt-5 font-serif-display italic text-[#59615D] text-base md:text-lg">
                        {slide.subtitle}
                    </p>
                )}
                <span className="gold-divider mt-8" />

                <dl
                    data-testid="slide-specs"
                    className="mt-10 divide-y divide-[#E5E0D5] border-y border-[#E5E0D5]"
                >
                    {slide.specs?.map((s) => (
                        <div
                            key={s.label}
                            className="grid grid-cols-12 py-4 md:py-5 gap-4"
                        >
                            <dt className="col-span-5 overline text-[#59615D] self-center">
                                {s.label}
                            </dt>
                            <dd className="col-span-7 font-serif-display text-[#1A362D] text-xl md:text-2xl">
                                {s.value}
                                {s.unit && (
                                    <span className="ml-2 text-sm font-body tracking-[0.22em] uppercase text-[#59615D]">
                                        {s.unit}
                                    </span>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="lg:col-span-5 relative overflow-hidden min-h-[40vh] lg:min-h-0 bg-[#1A362D]">
                <img
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
