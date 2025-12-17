import { liveMatches } from "@/data/content";

export function LiveResults() {
  return (
    <section className="container space-y-6" id="live-results">
      <header className="space-y-2">
        <p className="section-subtitle">پیگیری لحظه‌ای نتایج</p>
        <h2 className="section-title">نتایج زنده امروز</h2>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {liveMatches.map((match) => (
          <article key={match.id} className="rounded-3xl border border-[var(--border)] bg-white px-5 py-4 shadow-card" dir="rtl">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{match.league}</span>
              <span>
                وضعیت: <strong className="text-brand">{match.status}</strong>
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <TeamBlock name={match.home.name} score={match.home.score} align="right" />
              <div className="text-center text-3xl font-black text-[var(--foreground)]">
                {match.home.score}
                <span className="mx-2 text-xl text-[var(--muted)]">-</span>
                {match.away.score}
                <p className="mt-1 text-xs text-[var(--muted)]">{match.time}</p>
              </div>
              <TeamBlock name={match.away.name} score={match.away.score} align="left" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type TeamBlockProps = {
  name: string;
  score: number;
  align: "right" | "left";
};

function TeamBlock({ name, score, align }: TeamBlockProps) {
  const alignment = align === "right" ? "items-end text-right" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignment}`}>
      <p className="text-sm font-semibold text-[var(--foreground)]">{name}</p>
      <span className="text-xs text-[var(--muted)]">امتیاز {score}</span>
    </div>
  );
}
