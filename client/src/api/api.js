// Small wrapper around the Fetch API. Adds the JWT, parses JSON and throws helpful errors.
// The API address comes from an environment variable (see .env.example).
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getToken = () => {
  try { return localStorage.getItem("skillswap_token"); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem("skillswap_token", t) : localStorage.removeItem("skillswap_token"); } catch { /* ignore */ }
};

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    // network failure (server down, no internet)
    throw new Error("Cannot reach the server. Check that the backend is running and try again.");
  }

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
