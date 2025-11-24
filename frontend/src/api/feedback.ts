// src/api/feedback.ts
const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";

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

async function handleRes(res: Response) {
  if (!res.ok) {
    // Essaie de lire la réponse JSON
    const data = await res.json().catch(() => null);
    const detail = data?.detail || data?.message || (await res.text().catch(() => ""));
    throw new Error(detail || `Erreur API (${res.status})`);
  }
  return res.json();
}

export async function getFeedbacks(): Promise<FeedbackFromServer[]> {
  const res = await fetch(`${API_URL}/feedbacks/`, { headers: { "Accept": "application/json" } });
  return handleRes(res);
}

export async function postFeedback(payload: NewFeedbackPayload): Promise<FeedbackFromServer> {
  const res = await fetch(`${API_URL}/feedbacks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function deleteFeedbackApi(id: string): Promise<{ message?: string }> {
  const res = await fetch(`${API_URL}/feedbacks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleRes(res);
}
