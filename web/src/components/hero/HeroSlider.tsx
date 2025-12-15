"use client";

import { useState } from "react";
import { heroItems } from "./hero-data";
import { HeroSlide } from "./HeroSlide";

export function HeroSlider() {
  const [active, setActive] = useState(0);

  return (
    <section className="container mt-6">
      <HeroSlide item={heroItems[active]} />

      {/* Controls */}
      <div className="mt-4 flex justify-center gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-2 w-2 rounded-full transition ${
              active === index ? "bg-primary" : "bg-muted/40"
            }`}
            aria-label={`اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
