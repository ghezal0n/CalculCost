import React, { useEffect } from "react";
import "../assets/styles/Usine.css";
import { useNavigate, useLocation } from "react-router-dom";

const UsinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const propositions = location.state?.propositions || [];

  const countryId =
    location.state?.countryId ||
    localStorage.getItem("selectedCountryId") ||
    null;

  // Sauvegarder les propositions dans localStorage
  useEffect(() => {
    if (propositions && propositions.length > 0) {
      localStorage.setItem("usinePropositions", JSON.stringify(propositions));
    }
  }, [propositions]);

  // Sécurité : si on arrive sur /usine sans propositions, on redirige vers /transport
  useEffect(() => {
    if (!propositions || propositions.length === 0) {
      const countryId = location.state?.countryId;
      navigate("/transport", { state: { countryId } });
    }
  }, [propositions, navigate, location.state]);

  const handleMillClick = (mill) => {
    if (!mill.clickable) return;

    // persist selection
    localStorage.setItem("selectedMill", mill.id);
    localStorage.setItem("selectedMillName", mill.name);

    const countryId =
      location.state?.countryId || localStorage.getItem("selectedCountryId");

    // Comportement spécifique selon l'usine
    if (mill.id === "nm") {
      const millPropositions = [
        "Ocean freight",
        "THC Origin",
        "Pre Carriage Niederauer Mühle",
        "ALL IN BY CONTAINER",
        "ALL IN BY TON",
      ];

      navigate("/transport", {
        state: {
          countryId,
          selectedMill: mill,
          propositions: millPropositions,
          allowedChoices: ["fca-mill-truck", "fca-mill-container"],
        },
      });
      return;
    }

    if (mill.id === "sp") {
      localStorage.setItem("selectedFCAMode", "cip-terneuzen");
      localStorage.setItem("selectedFCAModeLabel", "CIP Terneuzen");
      const spPropositions = [
        "Ocean freight",
        "ALL IN BY CONTAINER",
        "ALL IN BY TON",
      ];

      navigate("/calcul", {
        state: {
          countryId,
          selectedMill: mill,
          propositions: spPropositions,
        },
      });
      return;
    }

    if (mill.id === "other") {
      navigate("/transport", {
        state: {
          countryId,
          selectedMill: mill,
          allowedChoices: [
            "fca-port-truck",
            "fob-container",
            "fca-mill-truck",
            "fca-mill-container",
          ],
        },
      });
      return;
    }

    // comportement par défaut : envoyer vers /transport
    navigate("/transport", {
      state: { countryId, selectedMill: mill, propositions },
    });
  };

  return (
    <div className="app-container">
      <div className="main-container">
        <header className="app-header">
          <div className="header-title">
            <svg
              className="factory-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h1 className="app-title">Select your mill</h1>
          </div>
          <p className="app-subtitle">Choose a mill to access the calculator</p>
          <span className="header-region-description">
            Region :{" "}
            {countryId === "usa"
              ? "United States"
              : countryId === "spain"
              ? "Spain"
              : countryId === "slovenia"
              ? "Slovenia"
              : "Belgium - Germany - Netherlands"}
          </span>
        </header>

        <ul className="countries-list">
          {propositions.map((mill) => (
            <li
              key={mill.id}
              onClick={() => handleMillClick(mill)}
              className={`country-item ${
                mill.clickable ? "clickable" : "disabled"
              }`}
            >
              <div className="item-content">
                <div className="item-header">
                  <h2
                    className={`country-name ${
                      mill.clickable ? "active" : "inactive"
                    }`}
                  >
                    {mill.name}
                  </h2>
                  {mill.clickable && (
                    <div className="item-icon">
                      <svg className="arrow-icon" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {mill.clickable && (
                  <div className="access-link">
                    <svg className="external-arrow" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UsinePage;
