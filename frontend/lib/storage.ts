/**
 * lib/storage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all client-side localStorage persistence.
 * All functions are safe to call during SSR (window guard included).
 *
 * Keys
 *   adpilot_user_v1      – logged-in user profile
 *   adpilot_settings_v1  – UI settings (locale, notification prefs)
 *   adpilot_history_v1   – tool usage history (RSA / CTR / moderation)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredUser {
  name: string;
  email: string;
  company: string;
  role: string;
  /** Two-letter uppercase initials derived from name */
  initials: string;
}

export interface StoredSettings {
  locale: "en" | "ru";
  notifications: Record<string, boolean>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const USER_KEY     = "adpilot_user_v1";
export const SETTINGS_KEY = "adpilot_settings_v1";
export const HISTORY_KEY  = "adpilot_history_v1";

const DEFAULT_USER: StoredUser = {
  name:     "Demo User",
  email:    "demo@adpilot.ai",
  company:  "",
  role:     "",
  initials: "DU",
};

const DEFAULT_SETTINGS: StoredSettings = {
  locale: "en",
  notifications: {
    api_limit: true,
    incidents: true,
    weekly:    false,
    product:   true,
    tips:      false,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): boolean {
  if (!isClient()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[storage] Failed to write "${key}":`, e);
    return false;
  }
}

/** Derive two-letter initials from a full name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── User API ─────────────────────────────────────────────────────────────────

/** Return the saved user, or the default if nothing is stored. */
export function loadUser(): StoredUser {
  return readJson<StoredUser>(USER_KEY) ?? DEFAULT_USER;
}

/** Persist a user profile. Returns true on success. */
export function saveUser(user: Partial<StoredUser> & { name: string; email: string }): boolean {
  const full: StoredUser = {
    ...DEFAULT_USER,
    ...user,
    initials: getInitials(user.name),
  };
  return writeJson(USER_KEY, full);
}

/** True if a non-default user session exists (mock "logged in"). */
export function isLoggedIn(): boolean {
  return readJson<StoredUser>(USER_KEY) !== null;
}

/** Clear user session (mock logout). */
export function clearUser(): void {
  if (isClient()) localStorage.removeItem(USER_KEY);
}

// ─── Settings API ─────────────────────────────────────────────────────────────

export function loadSettings(): StoredSettings {
  const saved = readJson<StoredSettings>(SETTINGS_KEY);
  if (!saved) return DEFAULT_SETTINGS;
  // Merge to ensure all keys exist even if schema evolved
  return {
    locale: saved.locale ?? DEFAULT_SETTINGS.locale,
    notifications: { ...DEFAULT_SETTINGS.notifications, ...saved.notifications },
  };
}

export function saveSettings(settings: Partial<StoredSettings>): boolean {
  const current = loadSettings();
  return writeJson(SETTINGS_KEY, { ...current, ...settings });
}

// ─── History API ──────────────────────────────────────────────────────────────
// (re-exported from history.ts via the same key; kept here for completeness)

export { HISTORY_KEY as historyKey };
