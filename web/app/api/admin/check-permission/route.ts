import { NextRequest, NextResponse } from "next/server";
import { can } from "@/lib/admin/rbac";
import type { AdminUserRBAC, ModuleKey, ActionKey } from "@/types/rbac";

/**
 * POST: Check permission. Body: { user: AdminUserRBAC, module, action, matchId?, newsId? }
 * Returns 200 { allowed: true } or 403 { allowed: false, reason }.
 * Use from client before sensitive actions; validate again in real API handlers.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, module, action, matchId, newsId } = body as {
      user: AdminUserRBAC | null;
      module: ModuleKey;
      action: ActionKey;
      matchId?: string;
      newsId?: string;
    };
    if (!module || !action) {
      return NextResponse.json(
        { allowed: false, reason: "ماژول و عملیات الزامی است" },
        { status: 400 }
      );
    }
    const result = can(user ?? null, module, action, { matchId, newsId });
    if (result.allowed) {
      return NextResponse.json({ allowed: true });
    }
    return NextResponse.json(
      { allowed: false, reason: result.reason || "دسترسی غیرمجاز" },
      { status: 403 }
    );
  } catch {
    return NextResponse.json(
      { allowed: false, reason: "خطای سرور" },
      { status: 500 }
    );
  }
}
