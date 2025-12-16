import type { AuthState, StoredUser } from "../types/auth";

const USERS_KEY = "users";
const AUTH_KEY = "auth";

export const storage = {
  // Users "DB"
  getUsers(): StoredUser[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  },
  setUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getAuth(): AuthState {
    if (typeof window === "undefined") return { user: null, admin: null };
    return JSON.parse(
      localStorage.getItem(AUTH_KEY) || '{"user":null,"admin":null}',
    );
  },
  setAuth(auth: AuthState) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  },
  clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  },
};
