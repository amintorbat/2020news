"use client";

import { useEffect, useState } from "react";
import { heroSlides } from "@/data/content";
import { HeroSlide } from "./HeroSlide";

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container" aria-label="تیترهای مهم">
      <HeroSlide item={heroSlides[active]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4" dir="rtl">
        <div className="flex flex-wrap items-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all ${
                active === index ? "w-10 bg-primary" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`نمایش اسلاید ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
            />
          ))}
        </div>
        <p className="text-xs text-white/60">
          {active + 1} از {heroSlides.length}
        </p>
      </div>
    </section>
  );
}
