/**
 * Decode a JWT token payload (no signature verification — client-side only)
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Returns true if the stored JWT contains an ADMIN role.
 * Checks common claim names: role, roles, authorities, ROLE
 */
export const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload) return false;

  // Check all common ways Spring Boot / JWT libraries encode roles
  const roleClaims = ["role", "roles", "authorities", "ROLE", "userRole"];
  for (const claim of roleClaims) {
    const value = payload[claim];
    if (!value) continue;
    if (typeof value === "string") {
      if (value.toUpperCase().includes("ADMIN")) return true;
    }
    if (Array.isArray(value)) {
      if (value.some((r) => String(r).toUpperCase().includes("ADMIN")))
        return true;
    }
  }

  // Fallback: check localStorage flag set at login
  return localStorage.getItem("isAdmin") === "true";
};

/**
 * Call after login to persist admin flag for current session
 */
export const persistAdminFlag = (token) => {
  const payload = decodeToken(token);
  if (!payload) return;
  const roleClaims = ["role", "roles", "authorities", "ROLE", "userRole"];
  for (const claim of roleClaims) {
    const value = payload[claim];
    if (!value) continue;
    const isAdminRole =
      typeof value === "string"
        ? value.toUpperCase().includes("ADMIN")
        : Array.isArray(value) &&
          value.some((r) => String(r).toUpperCase().includes("ADMIN"));
    if (isAdminRole) {
      localStorage.setItem("isAdmin", "true");
      return;
    }
  }
  localStorage.removeItem("isAdmin");
};
