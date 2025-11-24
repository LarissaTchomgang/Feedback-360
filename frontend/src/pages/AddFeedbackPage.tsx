import React from "react";
import FeedbackForm from "../components/FeedbackForm";

type FeedbackData = {
  category: string;
  comment: string;
  rating: number;
  author?: string;
  email?: string; // ✅ si ton formulaire inclut aussi l'email
};

type Props = {
  onSubmit: (fb: FeedbackData) => void;
};

const AddFeedbackPage: React.FC<Props> = ({ onSubmit }) => {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: "#e8f2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2a10 10 0 100 20 10 10 0 000-20z"
              fill="#2b8cf6"
            />
          </svg>
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>Ajouter un Feedback</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Partagez votre avis — court et précis
          </div>
        </div>
      </div>

      {/* ✅ Appel du composant FeedbackForm */}
      <FeedbackForm onSubmit={onSubmit} />
    </div>
  );
};

export default AddFeedbackPage;
