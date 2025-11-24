import React from "react";
import FeedbackList from "../components/FeedbackList";
import type { FeedbackItem } from "../App";
import "../styles/FeedbackList.css";

/**
 * ViewFeedbackPage
 * - Affiche la zone résumé (summary cards groupées par produit)
 *   avec possibilité de dérouler les retours pour chaque produit.
 * - Puis affiche la liste chronologique complète en bas (full list).
 */
const ViewFeedbackPage: React.FC<{ items: FeedbackItem[]; onDelete?: (id: string) => void }> = ({ items, onDelete }) => {
  return (
    <div>
      {/* Résumé par produit : cartes expandables */}
      <div style={{ marginBottom: 18 }}>
        <FeedbackList items={items} mode="summary" onDelete={onDelete} />
      </div>

      {/* Liste classique chronologique globale (TOUT feedbacks), inchangée */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Tous les retours (chronologique)</h3>
        <FeedbackList items={items} mode="full" onDelete={onDelete} />
      </div>
    </div>
  );
};

export default ViewFeedbackPage;
