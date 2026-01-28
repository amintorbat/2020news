import MatchDetailsClient from "./MatchDetailsClient";
import { mockMatches } from "@/lib/admin/matchesData";

export default function MatchDetailsPage({ params }: { params: { id: string } }) {
  const match = mockMatches.find((m) => m.id === params.id);

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 mb-2">مسابقه یافت نشد</p>
          <p className="text-sm text-slate-600">مسابقه مورد نظر وجود ندارد یا حذف شده است.</p>
        </div>
      </div>
    );
  }

  return <MatchDetailsClient match={match} />;
}
