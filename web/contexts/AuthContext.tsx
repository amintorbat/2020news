"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AdminUserRBAC, ModuleKey, ActionKey } from "@/types/rbac";
import { can } from "@/lib/admin/rbac";
import { getAllUsers, getScopedAssignmentsForUser } from "@/lib/admin/usersData";

const CURRENT_USER_ID_KEY = "2020news_admin_current_user_id";

interface AuthContextType {
  currentUser: AdminUserRBAC | null;
  currentUserId: string | null;
  login: (userId: string) => void;
  logout: () => void;
  hasPermission: (module: ModuleKey, action: ActionKey, context?: { matchId?: string; newsId?: string }) => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveUser(userId: string): AdminUserRBAC | null {
  const users = getAllUsers();
  const u = users.find((x) => x.id === userId);
  if (!u) return null;
  const scoped = getScopedAssignmentsForUser(u.id);
  return { ...u, scopedAssignments: scoped.length ? scoped : u.scopedAssignments };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUserRBAC | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (stored) {
      const user = resolveUser(stored);
      setCurrentUserId(stored);
      setCurrentUser(user);
    }
  }, []);

  const refreshUser = useCallback(() => {
    if (!currentUserId) return;
    const user = resolveUser(currentUserId);
    setCurrentUser(user);
  }, [currentUserId]);

  const login = useCallback((userId: string) => {
    const user = resolveUser(userId);
    if (user) {
      setCurrentUserId(userId);
      setCurrentUser(user);
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENT_USER_ID_KEY, userId);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUserId(null);
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_ID_KEY);
    }
  }, []);

  const hasPermission = useCallback(
    (module: ModuleKey, action: ActionKey, context?: { matchId?: string; newsId?: string }) => {
      return can(currentUser, module, action, context).allowed;
    },
    [currentUser]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserId,
        login,
        logout,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
