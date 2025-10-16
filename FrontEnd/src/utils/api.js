// CURRENT: return local JSON (works for frontend-only)
import partners from "../data/partners.json";

export function fetchPartnersLocal() {
  return Promise.resolve(partners);
}

// LATER (when you have backend):
// export async function fetchPartnersFromAPI() {
//   const res = await fetch("http://localhost:5000/api/partners");
//   if (!res.ok) throw new Error("Network error");
//   return res.json();
// }
