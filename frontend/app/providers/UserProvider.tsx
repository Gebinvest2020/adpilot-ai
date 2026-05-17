"use client";

/**
 * app/providers/UserProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Single global source of truth for the authenticated user.
 *
 * Usage
 *   Wrap the dashboard layout (or app root) with <UserProvider>.
 *   Any descendant can then call useUser() to read or update the user.
 *
 * Guarantees
 *   • SSR-safe: default values are served during pre-render; localStorage is
 *     read only after the first client-side effect.
 *   • Instant propagation: calling updateUser() re-renders ALL consumers in
 *     one React state update — no polling, no window-focus hacks needed.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loadUser, saveUser, type StoredUser } from "@/lib/storage";

// ─── Context type ─────────────────────────────────────────────────────────────

interface UserContextValue {
  user: StoredUser;
  /**
   * Persist profile updates to localStorage and instantly sync all consumers.
   * Returns true on success (false if localStorage is blocked).
   */
  updateUser: (data: Partial<StoredUser> & { name: string; email: string }) => boolean;
  /** Re-read user from localStorage (e.g. after an external write). */
  refreshUser: () => void;
  /** False until the first client-side hydration completes. */
  isLoaded: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_USER: StoredUser = {
  name:     "Demo User",
  email:    "demo@adpilot.ai",
  company:  "",
  role:     "",
  initials: "DU",
};

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue>({
  user:        DEFAULT_USER,
  updateUser:  () => false,
  refreshUser: () => {},
  isLoaded:    false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,     setUser]     = useState<StoredUser>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    setUser(loadUser());
    setIsLoaded(true);
  }, []);

  const updateUser = useCallback(
    (data: Partial<StoredUser> & { name: string; email: string }): boolean => {
      const ok = saveUser(data);
      // Re-read after save so computed fields (e.g. initials) stay in sync
      if (ok) setUser(loadUser());
      return ok;
    },
    []
  );

  const refreshUser = useCallback(() => {
    setUser(loadUser());
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, refreshUser, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the global user state from any component inside <UserProvider>.
 *
 * @example
 *   const { user, updateUser } = useUser();
 */
export function useUser(): UserContextValue {
  return useContext(UserContext);
}
