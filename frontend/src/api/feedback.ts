// frontend/src/api/feedback.ts
const DEFAULT_PROXY = "/api/proxy.php";
const RAW_API_URL = (import.meta.env.VITE_API_URL as string) ?? "";
export const API_URL = RAW_API_URL.trim() === "" ? DEFAULT_PROXY : RAW_API_URL.trim();

// types
export type NewFeedbackPayload = {
  category: string;
  comment: string;
  rating: number;
  author?: string;
  email?: string;
};

export type FeedbackFromServer = {
  id: string;
  category: string;
  comment: string;
  rating: number;
  author?: string;
  email?: string;
  createdAt: string; // ISO string
};

// helper to build URL depending on proxy vs direct API
function buildUrl(resourcePath: string) {
  // resourcePath should start with a "/"
  if (!resourcePath.startsWith("/")) {
    resourcePath = "/" + resourcePath;
  }

  // If we're using the internal proxy, call it as: /api/proxy.php?path=/feedbacks/...
  if (API_URL === DEFAULT_PROXY || API_URL.endsWith("/api/proxy.php")) {
    // encode path to be safe in query param; PHP will urldecode it
    return `${API_URL}?path=${encodeURIComponent(resourcePath)}`;
  }

  // Otherwise assume API_URL is a base URL (absolute or relative) and join with resourcePath
  // remove trailing slash from API_URL
  const base = API_URL.replace(/\/+$/, "");
  // remove leading slashes from resourcePath
  const tail = resourcePath.replace(/^\/+/, "");
  return `${base}/${tail}`;
}

async function handleRes(res: Response) {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text().catch(() => "");

  // si la réponse n'est pas du JSON, retourne un message d'erreur utile (debug)
  if (!ct.includes("application/json")) {
    if (res.ok) {
      // réponse 200 mais pas JSON -> probablement index.html rendu par le serveur
      throw new Error(
        `Réponse inattendue (pas du JSON). Status ${res.status}. Début du corps: ${text.slice(0, 300)}`
      );
    } else {
      // erreur côté serveur mais corps non-JSON -> extraire un message si possible
      let detail = "";
      try {
        const parsed = JSON.parse(text);
        detail = parsed?.detail || parsed?.message || "";
      } catch {
        detail = text.slice(0, 300);
      }
      throw new Error(detail || `Erreur API (${res.status})`);
    }
  }

  // à partir d'ici on sait que c'est JSON
  if (!res.ok) {
    const data = JSON.parse(text || "{}");
    const detail = data?.detail || data?.message || JSON.stringify(data);
    throw new Error(detail || `Erreur API (${res.status})`);
  }

  if (res.status === 204) return null;
  return JSON.parse(text);
}

// GET all feedbacks
export async function getFeedbacks(): Promise<FeedbackFromServer[]> {
  const url = buildUrl("/feedbacks/");
  const res = await fetch(url, { method: "GET" });
  return handleRes(res);
}

// POST new feedback
export async function postFeedback(payload: NewFeedbackPayload): Promise<FeedbackFromServer | null> {
  const url = buildUrl("/feedbacks/");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

// DELETE feedback by id
export async function deleteFeedbackApi(id: string): Promise<{ message?: string }> {
  const safeId = encodeURIComponent(id);
  const url = buildUrl(`/feedbacks/${safeId}`);
  const res = await fetch(url, {
    method: "DELETE",
  });
  return handleRes(res);
}
