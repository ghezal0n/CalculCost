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
    description: "Direct delivery from the mill by road transport",
    // features: [
    //   "Direct pickup at the mill",
    //   "Flexible road transport",
    //   "Optimized lead times",
    //   "Reduced costs for short distances",
    // ],
    svgPaths: [
      "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z",
      "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    ],
  },
  {
    key: "fca-mill-container",
    title: "FCA Mill in Container",
    description: "Goods packed in container from the mill",
    // features: [
    //   "Containerization at the mill",
    //   "Maximum protection",
    //   "Logistics optimization",
    //   "Reduced handling",
    // ],
    svgPaths: [
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ],
  },
  {
    key: "fca-port-truck",
    title: "FCA Port by Truck",
    description: "Delivery to port by road transport",
    // features: [
    //   "Direct delivery to port",
    //   "Flexible scheduling",
    //   "Timing control",
    //   "Adaptation to port constraints",
    // ],
    svgPaths: [
      "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z",
      "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    ],
  },
  {
    key: "fca-port-container",
    title: "FCA Port in Container",
    description: "Goods delivered to port in container ready for shipment",
    // features: [
    //   "Container ready for export",
    //   "Maximum port efficiency",
    //   "Reduced waiting times",
    //   "Streamlined process",
    // ],
    svgPaths: [
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ],
  },
  {
    key: "fob-container",
    title: "FOB",
    description: "Free On Board delivery",
    // features: [
    //   "Container ready for export",
    //   "Maximum efficiency",
    //   "Streamlined process",
    //   "Cost-effective solution",
    // ],
    svgPaths: [
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    ],
  },
];

const TransportChoicePage = () => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const countryId =
    location.state?.countryId ||
    localStorage.getItem("selectedCountryId") ||
    null;

  const selectedMillName =
    location.state?.selectedMill?.name ||
    localStorage.getItem("selectedMillName") ||
    null;

  const allowedChoices =
    location.state?.allowedChoices ||
    JSON.parse(localStorage.getItem("allowedChoices") || "null") ||
    null;

  // Sauvegarde des données importantes dans localStorage
  useEffect(() => {
    if (location.state?.countryId) {
      localStorage.setItem("selectedCountryId", location.state.countryId);
    }
    if (location.state?.allowedChoices) {
      localStorage.setItem(
        "allowedChoices",
        JSON.stringify(location.state.allowedChoices)
      );
    }
  }, [location.state]);

  // filtrage améliorée
  const getFilteredChoices = () => {
    console.log("countryId:", countryId);
    console.log("allowedChoices:", allowedChoices);

    if (Array.isArray(allowedChoices) && allowedChoices.length > 0) {
      console.log("Debug - Utilisation des allowedChoices:", allowedChoices);
      return choices.filter((c) => allowedChoices.includes(c.key));
    }

    if (
      countryId === "spain" ||
      countryId === "usa" ||
      countryId === "slovenia"
    ) {
      console.log("filtrage par pays pour:", countryId);
      return choices.filter(
        (c) => c.key === "fca-port-truck" || c.key === "fob-container"
      );
    }

    // Par défaut, tous les choix
    console.log("Debug - Tous les choix disponibles");
    return choices;
  };

  const filteredChoices = getFilteredChoices();

  useEffect(() => {
    // Animation d'entrée
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
  }, [filteredChoices]); // Relancer l'animation quand filteredChoices change

  const buildPropositionsForChoice = (choiceKey) => {
    const millProps = [
      "Ocean freight",
      "THC Origin",
      "Pre Carriage Niederauer Mühle",
      "ALL IN BY CONTAINER",
      "ALL IN BY TON",
    ];
    const portProps = [
      "Ocean freight",
      "THC Origin",
      "Container Pre-collection",
      "Container discharge + Container stuffing",
      "ALL IN BY CONTAINER",
      "ALL IN BY TON",
    ];
    const defaultProps = [
      "Ocean freight",
      "ALL IN BY CONTAINER",
      "ALL IN BY TON",
    ];

    if (choiceKey === "fca-mill-truck" || choiceKey === "fca-mill-container")
      return millProps;
    if (choiceKey === "fca-port-truck" || choiceKey === "fca-port-container")
      return portProps;
    if (choiceKey === "fob-container") return defaultProps;
    return defaultProps;
  };

  const handleCardClick = (choiceKey) => {
    setSelectedChoice(choiceKey);
    localStorage.setItem("selectedFCAMode", choiceKey);
    localStorage.setItem("selectedFCAModeLabel", choiceConfig[choiceKey]);

    const propositions = buildPropositionsForChoice(choiceKey);

    navigate("/calcul", {
      state: {
        countryId,
        selectedChoice: choiceKey,
        selectedChoiceLabel: choiceConfig[choiceKey],
        propositions,
        allowedChoices, // Transmettre les allowedChoices pour maintenir la cohérence
      },
    });
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
          <h1>Transport Mode</h1>
        </div>
        <p className="header-subtitle">Select your preferred delivery method</p>
        <p className="header-description">
          {/*           
          Click on a transport mode to access the calculator directly */}

          {countryId && (
            <span className="header-mode-description">
              Region:{" "}
              {countryId === "usa"
                ? "United States"
                : countryId === "spain"
                ? "Spain"
                : countryId === "slovenia"
                ? "Slovenia"
                : "Belgium - Germany - Netherlands"}
            </span>
          )}
          <p className="header-region-description">
            Selected factory:{" "}
            {selectedMillName ? selectedMillName : "No factory selected"}
          </p>
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
            <ul className="choice-features"></ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportChoicePage;
