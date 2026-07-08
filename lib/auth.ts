import { apiUrl } from "@/lib/api";

export type AuthUser = {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
};

const JWT_STORAGE_KEY = "jwt";
const USER_STORAGE_KEY = "user";

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(JWT_STORAGE_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function storeAuthSession(jwt: string, user?: AuthUser) {
  localStorage.setItem(JWT_STORAGE_KEY, jwt);

  if (user) {
    storeAuthUser(user);
  }
}

export function storeAuthUser(user: AuthUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(JWT_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export async function fetchCurrentUser() {
  const response = await fetch(apiUrl("/api/users/profile"), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Unable to verify the current session.");
  }

  return (await response.json()) as AuthUser;
}

export function hasRole(user: AuthUser | null | undefined, role: string) {
  return user?.role === role;
}
