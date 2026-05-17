"use client";

/**
 * app/providers/UserProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Single global source of truth for the authenticated user.
 *
 * Sources of data (in priority order):
 *   1. Supabase auth session   →  supabaseUser (the auth.users row)
 *   2. Supabase profiles table →  user (display name, language, country, niche)
 *   3. DEFAULT_PROFILE         →  fallback during hydration / not logged in
 *
 * Usage
 *   Wrap the dashboard layout with <UserProvider>.
 *   Children call useUser() to read or update profile data.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;          // maps to profiles.full_name
  email: string;
  language: "en" | "ru";
  country: string;
  niche: string;
  initials: string;      // computed from name
}

export type ProfileUpdate = Partial<
  Pick<UserProfile, "name" | "language" | "country" | "niche">
>;

interface UserContextValue {
  /** Always non-null. Falls back to DEFAULT_PROFILE before hydration. */
  user: UserProfile;
  /** Raw Supabase auth user (null if not logged in). */
  supabaseUser: User | null;
  /**
   * Persist profile updates to Supabase and re-render all consumers.
   * Returns true on success, false if Supabase returned an error.
   */
  updateProfile: (data: ProfileUpdate) => Promise<boolean>;
  /** False until the first auth check + profile fetch completes. */
  isLoaded: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  id:       "",
  name:     "Demo User",
  email:    "",
  language: "en",
  country:  "",
  niche:    "",
  initials: "DU",
};

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue>({
  user:          DEFAULT_PROFILE,
  supabaseUser:  null,
  updateProfile: async () => false,
  isLoaded:      false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile,     setProfile]     = useState<UserProfile>(DEFAULT_PROFILE);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoaded,    setIsLoaded]    = useState(false);

  // Stable client instance — createBrowserClient() returns a singleton
  const supabase = useMemo(() => createClient(), []);

  /** Fetch the profiles row and update local state. */
  const loadProfile = useCallback(
    async (userId: string, email: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, language, country, niche")
        .eq("id", userId)
        .single();

      if (error || !data) {
        // Profile row may not exist yet (trigger fires async after insert).
        // Build a reasonable fallback from the auth user's email.
        const fallbackName = email.split("@")[0]?.replace(/[._-]/g, " ")
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") ?? "User";

        setProfile({
          id:       userId,
          name:     fallbackName,
          email,
          language: "en",
          country:  "",
          niche:    "",
          initials: getInitials(fallbackName),
        });
        return;
      }

      const fullName =
        (data.full_name as string | null) ||
        email.split("@")[0] ||
        "User";

      setProfile({
        id:       data.id as string,
        name:     fullName,
        email:    (data.email as string) || email,
        language: ((data.language as string) === "ru" ? "ru" : "en"),
        country:  (data.country as string) || "",
        niche:    (data.niche as string) || "",
        initials: getInitials(fullName),
      });
    },
    [supabase]
  );

  useEffect(() => {
    // ── Initial session check ───────────────────────────────────────────────
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setSupabaseUser(user);
      if (user) await loadProfile(user.id, user.email ?? "");
      setIsLoaded(true);
    };

    init();

    // ── Subscribe to auth state changes ─────────────────────────────────────
    // Fires on login, logout, and token refresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setSupabaseUser(u);

      if (u) {
        await loadProfile(u.id, u.email ?? "");
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Update profile in Supabase and optimistically reflect changes locally. */
  const updateProfile = useCallback(
    async (data: ProfileUpdate): Promise<boolean> => {
      if (!supabaseUser) return false;

      // Map our UserProfile field names to the DB column names
      const dbUpdate: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (data.name     !== undefined) dbUpdate.full_name = data.name;
      if (data.language !== undefined) dbUpdate.language  = data.language;
      if (data.country  !== undefined) dbUpdate.country   = data.country;
      if (data.niche    !== undefined) dbUpdate.niche     = data.niche;

      const { error } = await supabase
        .from("profiles")
        .update(dbUpdate)
        .eq("id", supabaseUser.id);

      if (error) {
        console.warn("[UserProvider] updateProfile:", error.message);
        return false;
      }

      // Optimistic local update — no need to refetch
      setProfile((prev) => {
        const newName = data.name ?? prev.name;
        return {
          ...prev,
          ...data,
          name:     newName,
          initials: getInitials(newName),
        };
      });

      return true;
    },
    [supabase, supabaseUser]
  );

  return (
    <UserContext.Provider
      value={{ user: profile, supabaseUser, updateProfile, isLoaded }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUser(): UserContextValue {
  return useContext(UserContext);
}
