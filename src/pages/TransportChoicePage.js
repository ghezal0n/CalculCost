import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/TransportChoice.css";

const choiceConfig = {
  "fca-mill-truck": "FCA Mill by Truck",
  "fca-mill-container": "FCA Mill in Container",
  "fca-port-truck": "FCA Port by Truck",
  "fca-port-container": "FCA Port in Container",
  "fob-container": "FOB",
};

const choices = [
  {
    key: "fca-mill-truck",
    title: "FCA Mill by Truck",
    description: "Livraison directe depuis l'usine par transport routier",
    features: [
      "Pickup direct à l'usine",
      "Transport routier flexible",
      "Délais optimisés",
      "Coûts réduits sur courtes distances",
    ],
    svgPaths: [
      "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z",
      "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    ],
  },
  {
    key: "fca-mill-container",
    title: "FCA Mill in Container",
    description: "Marchandises emballées en conteneur depuis l'usine",
    features: [
      "Conteneurisation à l'usine",
      "Protection maximale",
      "Optimisation logistique",
      "Réduction des manipulations",
    ],
    svgPaths: [
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ],
  },
  {
    key: "fca-port-truck",
    title: "FCA Port by Truck",
    description: "Livraison au port par transport routier",
    features: [
      "Livraison directe au port",
      "Flexibilité des horaires",
      "Contrôle du timing",
      "Adaptation aux contraintes portuaires",
    ],
    svgPaths: [
      "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z",
      "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    ],
  },
  {
    key: "fca-port-container",
    title: "FCA Port in Container",
    description: "Marchandises livrées au port en conteneur prêt à expédier",
    features: [
      "Conteneur prêt pour l'export",
      "Efficacité portuaire maximale",
      "Réduction des temps d'attente",
      "Processus streamliné",
    ],
    svgPaths: [
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ],
  },
  {
    key: "fob-container",
    title: "FOB",
    description: "",
    features: [],
    svgPaths: [
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ],
  },
];

const TransportChoicePage = () => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const countryId = location.state?.countryId || null;
  const filteredChoices =
    countryId === "spain" || countryId === "usa"
      ? choices.filter(
          (c) => c.key === "fca-port-truck" || c.key === "fob-container"
        )
      : choices;

  useEffect(() => {
    // animation d'entrée similaire
    const cards = document.querySelectorAll(".choice-card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 150);
    });
  }, []);

  const handleCardClick = (choiceKey) => {
    setSelectedChoice(choiceKey);
    localStorage.setItem("selectedFCAMode", choiceKey);
    localStorage.setItem("selectedFCAModeLabel", choiceConfig[choiceKey]);

    if (choiceKey === "fca-mill-truck" || choiceKey === "fca-mill-container") {
      navigate("/usine", {
        state: {
          countryId: countryId,
          propositions: [
            "Ocean freight",
            "THC Origin",
            "Pre Carriage Niederauer Mühle",
            "ALL IN BY CONTAINER",
            "ALL IN BY TON",
          ],
        },
      });
    } else if (
      choiceKey === "fca-port-truck" ||
      choiceKey === "fca-port-container"
    ) {
      navigate("/calcul", {
        state: {
          countryId: countryId,
          propositions: [
            "Ocean freight",
            "THC Origin",
            "Container Pre-collection",
            "Container discharge + Container stuffing",
            "ALL IN BY CONTAINER",
            "ALL IN BY TON",
          ],
        },
      });
    } else if (choiceKey === "fob-container") {
      // Navigation pour FOB - va directement au calculateur
      navigate("/calcul", {
        state: {
          countryId: countryId,
          propositions: [
            "Ocean freight",
            "ALL IN BY CONTAINER",
            "ALL IN BY TON",
          ],
        },
      });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-title">
          <svg
            className="ship-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
          <h1>Mode de Transport FCA</h1>
        </div>
        {/* <p className="header-subtitle">Choisissez votre mode de livraison préféré</p> */}
        <p className="header-description">
          {/* Sélectionnez l'option qui correspond le mieux à vos besoins logistiques. 
              Chaque mode offre des avantages spécifiques selon votre situation. */}
          Cliquez sur un mode de transport pour accéder directement au
          calculateur
          {countryId && (
            <p className="header-region-description">
              Région sélectionnée :{" "}
              {countryId === "usa"
                ? "États-Unis"
                : countryId === "spain"
                ? "Espagne"
                : "Benelux-Allemagne"}
            </p>
          )}
        </p>
      </div>

      <div className="choices-grid">
        {filteredChoices.map((c) => (
          <div
            key={c.key}
            className={`choice-card ${
              selectedChoice === c.key ? "selected" : ""
            }`}
            data-choice={c.key}
            onClick={() => handleCardClick(c.key)}
          >
            <div className="choice-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {c.svgPaths.map((d, i) => (
                  <path
                    key={i}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={d}
                  />
                ))}
              </svg>
            </div>
            <h3 className="choice-title">{c.title}</h3>
            <p className="choice-description">{c.description}</p>
            <ul className="choice-features">
              {c.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportChoicePage;
