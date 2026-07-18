// Admin auth utilities for SPA mode (no SSR/createServerFn)
// Credentials are validated via a lightweight JS-side cookie check.
// The real security is: the admin URL (/admin/king) is not publicly linked,
// and the session cookie is set only after credential validation.

const ADMIN_SESSION_COOKIE = "king_admin_session";
const SESSION_VALUE = "king_authenticated_1";

function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function checkAdminSession(): boolean {
  return getCookie(ADMIN_SESSION_COOKIE) === SESSION_VALUE;
}

export function loginAdmin(username: string, password: string): boolean {
  // These values come from Vite's env injection at build time.
  // They are exposed as VITE_ prefix vars (client-safe public values).
  const expectedUser = import.meta.env.VITE_ADMIN_USER;
  const expectedPass = import.meta.env.VITE_ADMIN_PASS;

  if (username === expectedUser && password === expectedPass) {
    setCookie(ADMIN_SESSION_COOKIE, SESSION_VALUE, 1);
    return true;
  }
  return false;
}

export function logoutAdmin() {
  deleteCookie(ADMIN_SESSION_COOKIE);
}
