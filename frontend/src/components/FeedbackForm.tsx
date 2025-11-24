import React, { useState } from "react";
import "../styles/FeedbackForm.css";

export type NewFeedback = {
  category: string;
  comment: string;
  rating: number;
  author?: string;
  email?: string;
};

type Props = {
  onSubmit: (payload: NewFeedback) => void;
};

const categories = [
  { name: "Formation React", img: "/assets/react.png" },
  { name: "Produit - Laptop Pro", img: "/assets/ordinateur.jpg" },
  { name: "Événement Tech Summit", img: "/assets/summit.jpg" },
  { name: "Produit - SmartPhone", img: "/assets/smartphone.jpg" },
  { name: "Formation TypeScript", img: "/assets/typescript.png" },
  { name: "Formation Python", img: "/assets/python.png" },
];

const FeedbackForm: React.FC<Props> = ({ onSubmit }) => {
  const [category, setCategory] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [author, setAuthor] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return alert("Veuillez choisir une catégorie");
    if (!comment.trim()) return alert("Veuillez saisir votre avis");
    if (rating === 0) return alert("Veuillez sélectionner une note");
    if (!author.trim()) return alert("Veuillez entrer votre nom");
    if (!email.trim()) return alert("Veuillez entrer votre adresse email");

    onSubmit({
      category,
      comment: comment.trim(),
      rating,
      author: author.trim(),
      email: email.trim(),
    });

    setCategory("");
    setComment("");
    setRating(0);
    setAuthor("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="fb-form">
      <h2 className="form-title">Donnez votre avis</h2>

      {/* Grille des catégories */}
      <label className="lbl">Choisissez une catégorie</label>
      <div className="category-grid">
        {categories.map((c) => (
          <div
            key={c.name}
            className={`category-card ${category === c.name ? "selected" : ""}`}
            onClick={() => setCategory(c.name)}
          >
            <img src={c.img} alt={c.name} className="category-img" />
            <div className="category-title">{c.name}</div>
          </div>
        ))}
      </div>

      {/* --- Section en deux colonnes --- */}
      <div className="feedback-columns">
        {/* Colonne gauche : nom + email */}
        <div className="feedback-left">
          <label className="lbl">Votre nom</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex. : Line Audrey"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label className="lbl">Adresse e-mail</label>
          <input
            type="email"
            className="input-field"
            placeholder="Ex. : line.audrey@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Colonne droite : avis */}
        <div className="feedback-right">
          <label className="lbl">Exprimez-vous !</label>
          <textarea
            className="txt"
            placeholder="Votre avis"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>

      {/* --- Ligne des notes sur toute la largeur --- */}
      <label className="lbl">Note</label>
      <div className="emoji-row full-width">
        {["😁", "😊", "😐", "😕", "😡"].map((em, idx) => {
          const val = 5 - idx;
          return (
            <button
              key={val}
              type="button"
              className={`emoji-btn ${rating === val ? "active" : ""}`}
              onClick={() => setRating(val)}
            >
              <span className="emoji">{em}</span>
            </button>
          );
        })}
      </div>

      <button type="submit" className="submit-btn">
        Envoyer
      </button>
    </form>
  );
};

export default FeedbackForm;
