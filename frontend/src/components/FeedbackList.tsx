import React, { useState } from "react";
import type { FeedbackItem } from "../App";
import FeedbackCard from "./FeedbackCard";
import "../styles/FeedbackList.css";

/**
 * FeedbackList
 * - items: tableau de feedbacks (non trié ou trié selon appelant)
 * - mode: 'summary' => affiche les cards résumé (groupées par category) ;
 *         'full' => affiche la liste chronologique (items tels quels)
 * - onDelete: optional delete handler
 */
export default function FeedbackList({
  items,
  mode = "summary",
  onDelete,
}: {
  items: FeedbackItem[];
  mode?: "summary" | "full";
  onDelete?: (id: string) => void;
}) {
  // group by category only si mode summary
  if (mode === "summary") {
    const groups = items.reduce<Record<string, FeedbackItem[]>>((acc, it) => {
      acc[it.category] = acc[it.category] || [];
      acc[it.category].push(it);
      return acc;
    }, {});

    // state d'expansion par catégorie
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (cat: string) => {
      setExpandedCategories((s) => ({ ...s, [cat]: !s[cat] }));
    };

    return (
      <div className="summary-list">
        {Object.entries(groups).map(([category, arr]) => {
          const avg = arr.reduce((s, a) => s + a.rating, 0) / arr.length;
          const count = arr.length;
          const isExpanded = !!expandedCategories[category];

          return (
            <div key={category} className="summary-card">
              <div className="summary-top">
                <div className="summary-left">
                  <span className="category-pill">{category}</span>
                  <span className="summary-count">{count} feedback{count>1?'s':''}</span>
                </div>

                <div className="summary-right">
                  <div className="summary-rating">
                    {/* étoiles visuelles */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(avg) ? "#ffd166" : "none"} stroke="#ffd166" strokeWidth="1.2">
                        <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.6L19.5 24 12 19.897 4.5 24l1.75-8.65L.5 9.75l7.832-1.732z" />
                      </svg>
                    ))}
                    <span className="avg-text">{avg.toFixed(1)}</span>
                  </div>

                  <button className="summary-toggle" onClick={() => toggleCategory(category)}>
                    {isExpanded ? "˄" : "˅"}
                  </button>
                </div>
              </div>

              {/* panneau déroulant : liste des feedbacks pour cette catégorie */}
              <div className={`summary-expanded ${isExpanded ? "open" : ""}`}>
                {isExpanded ? (
                  <div className="summary-expanded-list">
                    {arr
                      // on peut trier par date décroissante si besoin :
                      .slice()
                      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
                      .map((f) => (
                        // Réutilise FeedbackCard pour afficher chaque retour — note: FeedbackCard n'a pas de toggle.
                        <FeedbackCard key={f.id} item={f} onDelete={onDelete} />
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // mode full => liste chrono (plus récente en haut)
  const chrono = items.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="full-list">
      {chrono.length === 0 ? (
        <div className="empty">Aucun feedback pour le moment — soyez le premier !</div>
      ) : (
        chrono.map((it) => <FeedbackCard key={it.id} item={it} onDelete={onDelete} />)
      )}
    </div>
  );
}
