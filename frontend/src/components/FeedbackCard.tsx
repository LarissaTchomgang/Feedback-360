import React from "react";
import "../styles/FeedbackCard.css";
import type { FeedbackItem } from "../App";

/**
 * Composant qui affiche une carte de feedback.
 * - Affiche directement le commentaire, l’auteur et son email.
 */
const FeedbackCard: React.FC<{ item: FeedbackItem; onDelete?: (id: string) => void }> = ({ item, onDelete }) => {
  return (
    <article className="feedback-card">
      {/* --- Ligne principale : catégorie, date, étoiles, note --- */}
      <div className="card-top">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="cat-pill">{item.category}</span>
          <div style={{ color: "var(--muted)" }}>
            {new Date(item.createdAt).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={i < item.rating ? "#ffd166" : "none"}
                stroke="#ffd166"
                strokeWidth="1.2"
              >
                <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.6L19.5 24 12 19.897 4.5 24l1.75-8.65L.5 9.75l7.832-1.732z" />
              </svg>
            ))}
          </div>

          <div style={{ fontWeight: 700 }}>{item.rating}.0</div>

          {onDelete && (
            <button
              className="delete-btn"
              onClick={() => onDelete(item.id)}
              title="Supprimer ce feedback"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff4d4d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* --- Commentaire principal --- */}
      <p className="comment">{item.comment}</p>

      {/* --- Infos auteur directement visibles --- */}
      <div className="details">
        <div>
          <strong>Auteur :</strong> {item.author ? item.author : "Anonyme"}
        </div>
        {item.email && (
          <div>
            <strong>Email :</strong> {item.email}
          </div>
        )}
      </div>
    </article>
  );
};

export default FeedbackCard;
