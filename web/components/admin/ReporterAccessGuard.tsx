"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAssignmentForUserAndMatch } from "@/lib/admin/reporterAssignments";
import { canAccessMatch } from "@/lib/admin/reporterPermissions";

// Mock: Current user ID (in real app, this would come from auth context)
const CURRENT_USER_ID = "3"; // احمد محمدی (reporter)

interface ReporterAccessGuardProps {
  matchId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard component to check reporter access to a match
 * Returns 403-style error if access is denied
 */
export function ReporterAccessGuard({
  matchId,
  children,
  fallback,
}: ReporterAccessGuardProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    const assignment = getAssignmentForUserAndMatch(CURRENT_USER_ID, matchId);
    const check = canAccessMatch(CURRENT_USER_ID, matchId, assignment);
    
    setHasAccess(check.allowed);
    setReason(check.reason || "");
  }, [matchId]);

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-500">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-slate-50" dir="rtl">
          <div className="max-w-md mx-auto p-8 text-center">
            <div className="rounded-xl border border-red-200 bg-red-50 p-8">
              <h1 className="text-2xl font-bold text-red-900 mb-2">403 - دسترسی مجاز نیست</h1>
              <p className="text-sm text-red-700 mb-4">{reason}</p>
              <button
                onClick={() => router.push("/admin/reporter")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors"
              >
                بازگشت به داشبورد
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
