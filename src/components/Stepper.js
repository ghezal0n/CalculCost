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
    { path: "/usine", label: "Mill", step: 3 },
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
      if (countryId) {
        const navigationState = { countryId: countryId };
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
        if (allowedChoices) {
          navigationState.allowedChoices = allowedChoices;
        }
        navigate(step.path, { state: navigationState });
      } else {
        navigate("/");
      }
    } else if (step.path === "/usine") {
      // bloquer l'accès
      if (countryId !== "belgium-germany") {
        return;
      }

      // sinon
      let propositions = [];
      try {
        const storedPropositions = localStorage.getItem("usinePropositions");
        if (storedPropositions) {
          propositions = JSON.parse(storedPropositions);
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des propositions:", e);
      }

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
          {
            id: "other",
            name: "Other",
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
      {/* Stepper Desktop */}
      <div
        className="stepper-desktop"
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

      {/* Stepper Mobile - Affichage des étapes */}
      <div className="stepper-mobile" style={{ display: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.25rem",
            padding: "0 0.5rem",
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.path}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: "0 0 auto",
                }}
              >
                {step.step <= currentStepNumber ? (
                  <div
                    onClick={() => handleStepClick(step)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#28a745",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        border:
                          step.step === currentStepNumber
                            ? "2px solid #007bff"
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
                        marginTop: "0.25rem",
                        fontSize: "0.625rem",
                        color:
                          step.step === currentStepNumber
                            ? "#007bff"
                            : "#28a745",
                        fontWeight:
                          step.step === currentStepNumber ? "bold" : "normal",
                        textAlign: "center",
                        maxWidth: "50px",
                        lineHeight: "1.2",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#dee2e6",
                        color: "#6c757d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        opacity: "0.6",
                      }}
                    >
                      {step.step}
                    </div>
                    <span
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.625rem",
                        color: "#6c757d",
                        textAlign: "center",
                        maxWidth: "50px",
                        lineHeight: "1.2",
                        opacity: "0.6",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: "1 1 auto",
                    height: "2px",
                    backgroundColor:
                      step.step < currentStepNumber ? "#28a745" : "#dee2e6",
                    minWidth: "8px",
                    maxWidth: "30px",
                    marginTop: "-16px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stepper-desktop {
            display: none !important;
          }
          .stepper-mobile {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .stepper-desktop {
            display: flex !important;
          }
          .stepper-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Stepper;
