import { liveMatches } from "@/lib/data";
import { SectionHeader } from "@/components/common/SectionHeader";

export function LiveScores() {
  return (
    <section className="container space-y-6" id="live">
      <SectionHeader title="نتایج زنده امروز" subtitle="پیگیری لحظه‌ای" />
      <div className="grid gap-4 md:grid-cols-2">
        {liveMatches.map((match) => (
          <article key={match.id} className="rounded-3xl border border-[var(--border)] bg-white px-5 py-4 shadow-card" dir="rtl">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{match.league}</span>
              <span className="font-semibold text-brand">{match.status}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
              <TeamBlock name={match.home.name} align="right" />
              <div className="text-center">
                <p className="text-3xl font-black text-[var(--foreground)]">
                  {match.home.score}
                  <span className="mx-2 text-xl text-[var(--muted)]">-</span>
                  {match.away.score}
                </p>
                <p className="text-xs">{match.time}</p>
              </div>
              <TeamBlock name={match.away.name} align="left" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type TeamBlockProps = {
  name: string;
  align: "right" | "left";
};

function TeamBlock({ name, align }: TeamBlockProps) {
  return (
    <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
      <p className="text-base font-semibold text-[var(--foreground)]">{name}</p>
      <span className="text-xs text-[var(--muted)]">باشگاهی</span>
    </div>
  );
}
