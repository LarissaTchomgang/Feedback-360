import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AddFeedbackPage from "./pages/AddFeedbackPage";
import ViewFeedbackPage from "./pages/ViewFeedbackPage";
import "./index.css";

// 🔹 Import des fonctions d’API existantes
import { getFeedbacks, postFeedback, deleteFeedbackApi } from "./api/feedback";

// Même type que ton backend
export type FeedbackItem = {
  id: string;
  category: string;
  comment: string;
  rating: number;
  author?: string;
  createdAt: string;
  email?: string;
};

const App: React.FC = () => {
  const [page, setPage] = useState<"add" | "view">("add");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Charger les feedbacks depuis le backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await getFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ✅ Ajouter un feedback en base
  const addFeedback = async (fb: Omit<FeedbackItem, "id" | "createdAt">) => {
    try {
      const newItem = await postFeedback(fb);
      if (newItem) {
        setFeedbacks((prev) => [newItem, ...prev]);
        setPage("view");
      } else {
        // Si l'API renvoie 204 ou null
        alert("Le serveur a répondu sans contenu. Le feedback n'a pas été ajouté.");
        console.warn("postFeedback returned null or empty");
      }
    } catch (err: any) {
      // 🔥 Récupère le message du backend s’il existe
      const message = err?.message || "Erreur lors de l'ajout du feedback.";
      alert(`❌ ${message}`);
      console.error("Erreur lors de l'ajout du feedback:", err);
    }
  };

  // ✅ Supprimer un feedback (backend + frontend)
  const deleteFeedback = async (id: string) => {
    try {
      await deleteFeedbackApi(id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
    }
  };

  return (
    <div className="app-root">
      {/* Header */}
      <header className="topbar">
        <div className="title">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
            <path
              d="M2 12a10 10 0 1119.999.001A10 10 0 012 12zm11-5h-6a1 1 0 000 2h6v6a1 1 0 002 0v-6h2a1 1 0 100-2h-2V5a1 1 0 00-2 0v2z"
              fill="#0072E6"
            />
          </svg>
          <h1>FeedBack360</h1>
        </div>
        <p className="subtitle">
          Partagez votre avis sur nos produits, formations et événements
        </p>
      </header>

      {/* Navigation */}
      <Navbar page={page} setPage={setPage} total={feedbacks.length} />

      {/* Contenu dynamique */}
      <main className="main-content">
        {loading ? (
          <p>Chargement des feedbacks...</p>
        ) : page === "add" ? (
          <AddFeedbackPage onSubmit={addFeedback} />
        ) : (
          <ViewFeedbackPage items={feedbacks} onDelete={deleteFeedback} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">© FeedBack360 — Prototype</footer>
    </div>
  );
};

export default App;
