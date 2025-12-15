import type { LiveMatch } from "@/data/content";

type MatchCardProps = {
  match: LiveMatch;
};

function statusColors(status: LiveMatch["status"]) {
  switch (status) {
    case "زنده":
      return "bg-danger text-white";
    case "پایان یافته":
      return "bg-white/10 text-white";
    default:
      return "bg-white/20 text-white";
  }
}

function sportBadgeClass(sport: LiveMatch["sport"]) {
  return sport === "futsal" ? "bg-primary/15 text-primary" : "bg-amber-200/15 text-amber-200";
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-l from-[#050f23] via-[#0f172a]/75 to-[#050f23] p-5 text-white" dir="rtl">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${sportBadgeClass(match.sport)}`}>
          {match.sport === "futsal" ? "فوتسال" : "فوتبال ساحلی"}
        </span>
        <span>{match.competition}</span>
      </div>

      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <TeamStack team={match.home} align="right" />

        <div className="flex w-full flex-col items-center justify-center text-center md:w-auto">
          <span className={`mb-2 rounded-full px-4 py-1 text-[11px] font-bold ${statusColors(match.status)}`}>
            {match.status}
          </span>
          <p className="text-3xl font-black tracking-tight">
            {match.home.score} <span className="text-white/60">-</span> {match.away.score}
          </p>
          <p className="mt-1 text-xs text-white/60">{match.time}</p>
        </div>

        <TeamStack team={match.away} align="left" />
      </div>
    </div>
  );
}

type TeamStackProps = {
  team: LiveMatch["home"];
  align: "right" | "left";
};

function TeamStack({ team, align }: TeamStackProps) {
  const justification = align === "right" ? "justify-start" : "justify-end";
  const textAlign = align === "right" ? "text-right" : "text-left";

  return (
    <div className={`flex w-full items-center gap-3 ${justification} md:w-auto`}>
      {align === "right" && <TeamLogo code={team.logo} />}
      <div className={`space-y-1 ${textAlign}`}>
        <p className="text-sm font-bold text-white">{team.name}</p>
        <p className="text-xs text-white/50">باشگاهی</p>
      </div>
      {align === "left" && <TeamLogo code={team.logo} />}
    </div>
  );
}

type TeamLogoProps = {
  code: string;
};

function TeamLogo({ code }: TeamLogoProps) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-black text-white">
      {code}
    </span>
  );
}
