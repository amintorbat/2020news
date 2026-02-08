"use client";

import { useAuth } from "@/contexts/AuthContext";
import type { ModuleKey, ActionKey } from "@/types/rbac";

type CanProps = {
  module: ModuleKey;
  action: ActionKey;
  matchId?: string;
  newsId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Renders children only when the current user has permission.
 * Use for hiding buttons/links by role (RTL, Persian, mobile-first).
 */
export function Can({ module, action, matchId, newsId, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth();
  const allowed = hasPermission(module, action, { matchId, newsId });
  if (allowed) return <>{children}</>;
  return <>{fallback}</>;
}
