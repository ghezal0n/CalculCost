import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Région" },
    { path: "/transport", label: "Transport" },
    { path: "/usine", label: "Usine" },
    { path: "/calcul", label: "Calcul" },
    { path: "/historique", label: "Historique" },
  ];

  return (
    <nav
      style={{
        backgroundColor: "#343a40",
        padding: "1rem 2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100vw",
        margin: 0,
        boxSizing: "border-box",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Logo à gauche */}
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "white",
            position: "absolute",
            left: 0,
          }}
        >
          Shipmate
        </div>

        {/* Boutons centrés */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: "0 auto",
            padding: 0,
            gap: "2rem",
          }}
        >
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: location.pathname === item.path ? "#ffc107" : "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  transition: "color 0.3s",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.color = "#ffc107";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.color = "white";
                  }
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
