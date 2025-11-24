import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";

type Props = {
  page: "add" | "view";
  setPage: (p: "add" | "view") => void;
  total?: number; // total des feedbacks
};

const Navbar: React.FC<Props> = ({ page, setPage, total = 0 }) => {
  const [count, setCount] = useState(total);

  // 🔁 Met à jour automatiquement le compteur si la prop "total" change
  useEffect(() => {
    setCount(total);
  }, [total]);

  return (
    <nav className="navbar">
      <button
          className={`nav-btn ${page === "add" ? "active" : ""}`}
          onClick={() => setPage("add")}
      >
        Ajouter un Feedback
      </button>
      <button
        className={`nav-btn ${page === "view" ? "active" : ""}`}
        onClick={() => setPage("view")}
      >
        Voir les Feedbacks <span className="badge">{total}</span>
      </button>
    </nav>
  );
};

export default Navbar;

