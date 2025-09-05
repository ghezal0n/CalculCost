import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Stepper() {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    { path: "/", label: "Région", step: 1 },
    { path: "/transport", label: "Transport", step: 2 },
    { path: "/usine", label: "Usine", step: 3 },
    { path: "/calcul", label: "Calcul", step: 4 },
  ];

  const getCurrentStep = () => {
    const currentStep = steps.find((step) => step.path === location.pathname);
    return currentStep ? currentStep.step : 1;
  };

  const currentStepNumber = getCurrentStep();

  // Fonction pour gérer la navigation avec conservation des données
  const handleStepClick = (step) => {
    // Récupérer les données stockées dans location.state ou localStorage
    const countryId =
      location.state?.countryId || localStorage.getItem("selectedCountryId");
    const selectedFCAMode = localStorage.getItem("selectedFCAMode");

    if (step.path === "/transport") {
      // Pour la page transport, on doit conserver le countryId
      if (countryId) {
        navigate(step.path, { state: { countryId: countryId } });
      } else {
        // Si pas de countryId, rediriger vers la page région
        navigate("/");
      }
    } else if (step.path === "/calcul") {
      // Pour la page calcul, on doit conserver le countryId
      if (countryId) {
        navigate(step.path, { state: { countryId: countryId } });
      } else {
        navigate("/");
      }
    } else if (step.path === "/usine") {
      // Pour la page usine, on doit conserver le countryId
      if (countryId) {
        navigate(step.path, { state: { countryId: countryId } });
      } else {
        navigate("/");
      }
    } else {
      // Pour les autres pages, navigation normale
      navigate(step.path);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "2rem",
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
                      fontSize: "0.875rem",
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
