import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Stepper() {
  const location = useLocation();
  const navigate = useNavigate();

  const allowedPaths = [
    "/",
    "/department",
    "/region",
    "/usine",
    "/transport",
    "/calcul",
  ];

  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  const steps = [
    { path: "/", label: "Department", step: 1 },
    { path: "/region", label: "Region", step: 2 },
    { path: "/usine", label: "Usine", step: 3 },
    { path: "/transport", label: "Transport", step: 4 },
    { path: "/calcul", label: "Calcul", step: 5 },
  ];

  const getCurrentStep = () => {
    const currentStep = steps.find((step) => step.path === location.pathname);
    return currentStep ? currentStep.step : 1;
  };

  const currentStepNumber = getCurrentStep();

  // navigation avec conservation des données
  const handleStepClick = (step) => {
    // Récupérer les données stockées dans location.state et localStorage
    const countryId =
      location.state?.countryId || localStorage.getItem("selectedCountryId");
    const selectedFCAMode = localStorage.getItem("selectedFCAMode");
    const allowedChoices =
      location.state?.allowedChoices ||
      JSON.parse(localStorage.getItem("allowedChoices") || "null");

    if (step.path === "/transport") {
      // Pour la page transport, on doit conserver le countryId ET les allowedChoices
      if (countryId) {
        const navigationState = { countryId: countryId };

        // Ajouter allowedChoices si disponibles
        if (allowedChoices) {
          navigationState.allowedChoices = allowedChoices;
        }

        navigate(step.path, { state: navigationState });
      } else {
        navigate("/");
      }
    } else if (step.path === "/calcul") {
      if (countryId) {
        const navigationState = { countryId: countryId };

        // Ajouter allowedChoices si disponibles
        if (allowedChoices) {
          navigationState.allowedChoices = allowedChoices;
        }

        navigate(step.path, { state: navigationState });
      } else {
        navigate("/");
      }
    } else if (step.path === "/usine") {
      if (countryId) {
        const forbiddenCountries = [
          "Spain",
          "United States of America",
          "Slovenia",
        ];
        const selectedCountry =
          location.state?.countryName ||
          localStorage.getItem("selectedCountryName");

        if (forbiddenCountries.includes(selectedCountry)) {
          // bloquer l'accès à /usine
          alert("L'accès à l'étape Usine n'est pas disponible pour ce pays.");
          return; // on ne fait rien
        }

        // Récupérer les propositions depuis localStorage ou créer les propositions par défaut
        let propositions = [];
        try {
          const storedPropositions = localStorage.getItem("usinePropositions");
          if (storedPropositions) {
            propositions = JSON.parse(storedPropositions);
          }
        } catch (e) {
          console.error("Erreur lors de la récupération des propositions:", e);
        }

        // Si pas de propositions stockées, créer les propositions par défaut
        if (!propositions || propositions.length === 0) {
          propositions = [
            {
              id: "nm",
              name: "Niederauer Mühle",
              clickable: true,
            },
            {
              id: "sp",
              name: "Smurfit Piteå",
              clickable: true,
            },
          ];
        }

        navigate(step.path, {
          state: {
            countryId: countryId,
            propositions: propositions,
          },
        });
      } else {
        navigate("/");
      }
    } else {
      navigate(step.path);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1.5rem",
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
      {/* Stepper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.path}>
            {/* Step Circle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {step.step <= currentStepNumber ? (
                <div
                  onClick={() => handleStepClick(step)}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#28a745",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border:
                        step.step === currentStepNumber
                          ? "3px solid #007bff"
                          : "none",
                      boxShadow:
                        step.step === currentStepNumber
                          ? "0 0 0 2px rgba(0,123,255,0.25)"
                          : "none",
                    }}
                  >
                    {step.step < currentStepNumber ? "✓" : step.step}
                  </div>
                  <span
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.800rem",
                      color:
                        step.step === currentStepNumber ? "#007bff" : "#28a745",
                      fontWeight:
                        step.step === currentStepNumber ? "bold" : "normal",
                      textAlign: "center",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "not-allowed",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#dee2e6",
                      color: "#6c757d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      cursor: "not-allowed",
                      opacity: "0.6",
                    }}
                  >
                    {step.step}
                  </div>
                  <span
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#6c757d",
                      fontWeight: "normal",
                      textAlign: "center",
                      opacity: "0.6",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              )}
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor:
                    step.step < currentStepNumber ? "#28a745" : "#dee2e6",
                  margin: "0 1rem",
                  marginTop: "-20px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Stepper;
