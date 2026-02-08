/**
 * Admin users and scoped assignments (Journalist / Match Reporter).
 * Offline-safe: uses in-memory + optional localStorage fallback.
 */

import type { AdminUserRBAC, ScopedAssignment, RoleKey } from "@/types/rbac";

const STORAGE_KEY_USERS = "2020news_admin_users";
const STORAGE_KEY_SCOPED = "2020news_admin_scoped_assignments";

/** Default users with RBAC roles */
const defaultUsers: AdminUserRBAC[] = [
  {
    id: "1",
    name: "مدیر کل",
    email: "admin@2020news.ir",
    role: "super_admin",
    lastLogin: null,
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "2",
    name: "علی رضایی",
    email: "ali@2020news.ir",
    role: "editor",
    lastLogin: null,
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "3",
    name: "احمد محمدی",
    email: "ahmad@2020news.ir",
    role: "match_reporter",
    lastLogin: null,
    createdAt: new Date().toISOString(),
    isActive: true,
    scopedAssignments: [],
  },
];

const defaultScoped: ScopedAssignment[] = [];

function loadUsers(): AdminUserRBAC[] {
  if (typeof window === "undefined") return defaultUsers;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminUserRBAC[];
      return parsed.map((u) => ({
        ...u,
        scopedAssignments: loadScopedForUser(u.id),
      }));
    }
  } catch {
    // ignore
  }
  return defaultUsers.map((u) => ({
    ...u,
    scopedAssignments: u.scopedAssignments || [],
  }));
}

function loadScopedAssignments(): ScopedAssignment[] {
  if (typeof window === "undefined") return defaultScoped;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCOPED);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultScoped;
}

function loadScopedForUser(userId: string): ScopedAssignment[] {
  return loadScopedAssignments().filter((a) => a.userId === userId);
}

function saveUsers(users: AdminUserRBAC[]) {
  if (typeof window === "undefined") return;
  try {
    const toSave = users.map(({ scopedAssignments: _, ...u }) => u);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

function saveScoped(assignments: ScopedAssignment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SCOPED, JSON.stringify(assignments));
  } catch {
    // ignore
  }
}

export function getAllUsers(): AdminUserRBAC[] {
  return loadUsers();
}

export function getUserById(id: string): AdminUserRBAC | undefined {
  return loadUsers().find((u) => u.id === id);
}

export function updateUserRole(userId: string, role: RoleKey): AdminUserRBAC | null {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], role };
  saveUsers(users);
  return users[idx];
}

export function updateUser(
  userId: string,
  patch: Partial<Pick<AdminUserRBAC, "name" | "email" | "isActive" | "role">>
): AdminUserRBAC | null {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return users[idx];
}

export function getScopedAssignmentsForUser(userId: string): ScopedAssignment[] {
  return loadScopedForUser(userId);
}

export function getAllScopedAssignments(): ScopedAssignment[] {
  return loadScopedAssignments();
}

export function createScopedAssignment(
  assignment: Omit<ScopedAssignment, "id" | "createdAt" | "updatedAt">
): ScopedAssignment {
  const list = loadScopedAssignments();
  const now = new Date().toISOString();
  const newOne: ScopedAssignment = {
    ...assignment,
    id: `scope-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };
  list.push(newOne);
  saveScoped(list);
  return newOne;
}

export function updateScopedAssignment(
  id: string,
  patch: Partial<Pick<ScopedAssignment, "startDateTime" | "endDateTime" | "enabled">>
): ScopedAssignment | null {
  const list = loadScopedAssignments();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  saveScoped(list);
  return list[idx];
}

export function deleteScopedAssignment(id: string): boolean {
  const list = loadScopedAssignments().filter((a) => a.id !== id);
  if (list.length === loadScopedAssignments().length) return false;
  saveScoped(list);
  return true;
}

export function createUser(user: Omit<AdminUserRBAC, "id" | "lastLogin" | "createdAt">): AdminUserRBAC {
  const users = loadUsers();
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  const newUser: AdminUserRBAC = {
    ...user,
    id,
    lastLogin: null,
    createdAt: now,
    scopedAssignments: user.scopedAssignments || [],
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}
