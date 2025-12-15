import { HeroItem } from "./hero-data";

export function HeroSlide({ item }: { item: HeroItem }) {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl bg-surface">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${item.image})` }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
        {item.badge && (
          <span
            className={`mb-3 inline-block w-fit rounded px-3 py-1 text-xs font-bold ${
              item.badge === "live"
                ? "bg-danger text-white"
                : "bg-primary text-black"
            }`}
          >
            {item.badge === "live" ? "زنده" : "خبر فوری"}
          </span>
        )}

        <h2 className="mb-2 text-2xl md:text-3xl font-bold leading-tight">
          {item.title}
        </h2>

        <p className="max-w-2xl text-sm md:text-base text-muted">
          {item.excerpt}
        </p>
      </div>
    </div>
  );
}
