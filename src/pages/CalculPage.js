import React, { useState, useEffect } from "react";
import { Ship, Calculator, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import "../assets/styles/CalculPage.css";
import { freightData, spainFreightData, usaFreightData } from "./Data.js";

const CalculPage = () => {
  const location = useLocation();
  const countryId = location.state?.countryId || "benelux-germany"; // Par défaut benelux-germany

  const [formData, setFormData] = useState({
    origin: countryId === "benelux-germany" ? "Antwerp" : "",
    destination: "",
    carrier: "",
    oceanFreight: "",
  });

  const selectedFCAMode = localStorage.getItem("selectedFCAMode");

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [showCalculations, setShowCalculations] = useState(false);

  const getCurrency = () => {
    return countryId === "usa" ? "$" : "€";
  };

  // Fonction pour créer les données pour l'Espagne
  function getSpainFreightData() {
    const spainData = [];

    spainFreightData.forEach((route) => {
      spainData.push({
        ...route,
        origin: "Barcelone/Valence",
      });
    });
    return spainData;
  }

  // Sélectionner les données selon le pays
  const getCurrentFreightData = () => {
    if (countryId === "spain") {
      return getSpainFreightData();
    } else if (countryId === "usa") {
      return usaFreightData;
    }
    return freightData; //benelux-germany
  };

  const currentFreightData = getCurrentFreightData();

  const fixedRatesAntwerp = {
    thcOrigin: 200.0,
    containerPreCollection: 255.0,
    stowage: 237.5,
    preCarriageNiederauer: 675.0,
    preCarriageDurenKreuzau: 540.0,
    tonWeight: 24,
  };

  const fixedRatesHamburg = {
    thcOrigin: 250.0,
    stowage: 650.0,
    preCarriageNiederauer: 675.0,
    tonWeight: 24,
  };

  const fixedRatesSpain = {
    thcOrigin: 150.0,
    stowage: 400.0,
    preCarriageNiederauer: 500.0,
    tonWeight: 24,
  };

  const fixedRatesUSA = {
    Savannah: {
      handlingInOutDrayage: 890,
      tonWeight: 24,
    },
    "New Orleans": {
      handlingInOutDrayage: 800,
      drayagePortsOfAmerica: 235,
      tonWeight: 24,
    },
    Houston: {
      handlingInOutDrayagesChassis: 725,
      tonWeight: 24,
    },
  };

  // Extraire les valeurs uniques
  const origins = [...new Set(currentFreightData.map((item) => item.origin))];

  useEffect(() => {
    if (countryId === "spain" && origins.length === 1 && !formData.origin) {
      setFormData((prev) => ({
        ...prev,
        origin: origins[0],
      }));
    }
  }, [origins, formData.origin]);
  const destinations = [
    ...new Set(currentFreightData.map((item) => item.destination)),
  ].sort();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setShowCalculations(false);
  };

  const searchRoutes = () => {
    if (!formData.origin || !formData.destination) return;

    const matchingRoutes = currentFreightData.filter(
      (route) =>
        route.origin === formData.origin &&
        route.destination === formData.destination
    );

    setAvailableRoutes(matchingRoutes);
    setShowCalculations(true);
  };

  // Fonction de calcul selon le mode FCA
  const getCalculationType = () => {
    if (selectedFCAMode === "fca-mill-container") {
      return "mill-container";
    }
    if (selectedFCAMode === "fca-port-container") {
      return "port-container";
    }
    if (selectedFCAMode === "fca-mill-truck") {
      return "mill-truck";
    }
    if (selectedFCAMode === "fob-container") {
      return "fob-container";
    }
    return "standard";
  };

  const calculateTotal = (oceanFreight, origin) => {
    let fixedRates;

    // Sélectionner les tarifs selon l'origine et le pays
    if (countryId === "spain") {
      fixedRates = fixedRatesSpain;
    } else if (countryId === "usa") {
      fixedRates = fixedRatesUSA[origin] || fixedRatesUSA["Savannah"];
    } else if (origin === "Hamburg") {
      fixedRates = fixedRatesHamburg;
    } else {
      fixedRates = fixedRatesAntwerp;
    }

    const calculationType = getCalculationType();
    const isHamburg = origin === "Hamburg";

    let calculation = {
      oceanFreight,
      totalFobPreCarrier: 695,
      thcOrigin: fixedRates.thcOrigin,
      tonWeight: fixedRates.tonWeight,
    };

    // Mode FOB : seulement Ocean freight
    if (calculationType === "fob-container") {
      calculation = {
        ...calculation,
        allInByContainer: oceanFreight,
        allInByTon: oceanFreight / fixedRates.tonWeight,
        calculationType: "fob-container",
      };
      return calculation;
    }

    // Gestion spéciale pour les USA
    if (countryId === "usa") {
      if (origin === "Savannah") {
        calculation = {
          ...calculation,
          handlingInOutDrayage: fixedRates.handlingInOutDrayage,
          allInByContainer: oceanFreight + fixedRates.handlingInOutDrayage,
        };
      } else if (origin === "New Orleans") {
        calculation = {
          ...calculation,
          handlingInOutDrayage: fixedRates.handlingInOutDrayage,
          drayagePortsOfAmerica: fixedRates.drayagePortsOfAmerica,
          allInByContainer: oceanFreight + fixedRates.handlingInOutDrayage,
          allInByContainerWithPorts:
            oceanFreight +
            fixedRates.handlingInOutDrayage +
            fixedRates.drayagePortsOfAmerica,
        };
      } else if (origin === "Houston") {
        calculation = {
          ...calculation,
          handlingInOutDrayagesChassis: fixedRates.handlingInOutDrayagesChassis,
          allInByContainer:
            oceanFreight + fixedRates.handlingInOutDrayagesChassis,
        };
      }
      calculation.allInByTon =
        calculation.allInByContainer / fixedRates.tonWeight;
      calculation.calculationType = "usa";
      return calculation;
    }

    // Gestion spéciale pour l'Espagne en mode FCA port by truck
    if (countryId === "spain" && selectedFCAMode === "fca-port-truck") {
      calculation = {
        ...calculation,
        fobCharges: 695,
        allInByContainer: oceanFreight + 695,
        allInByTon: (oceanFreight + 695) / fixedRates.tonWeight,
        calculationType: "spain-fca-port-truck",
      };
      return calculation;
    }

    if (calculationType === "mill-container") {
      //FCA Mill in Container : Ocean freight + THC Origin + Pre Carriage Niederauer Mühle
      calculation = {
        ...calculation,
        preCarriageNiederauer: fixedRates.preCarriageNiederauer,
        allInByContainer:
          oceanFreight +
          fixedRates.thcOrigin +
          fixedRates.preCarriageNiederauer,
      };
    } else if (calculationType === "port-container") {
      calculation = {
        ...calculation,
        preCarriageNiederauer: fixedRates.preCarriageNiederauer,
        allInByContainer: oceanFreight + fixedRates.thcOrigin,
      };
    } else if (calculationType === "mill-truck" && origin === "Antwerp") {
      //FCA Mill by Truck (Antwerp) : Ocean freight + THC Origin + Container Pre-collection + Container discharge + Container stuffing + Pre Carriage Düren/Kreuzau

      calculation = {
        ...calculation,
        containerPreCollection: fixedRates.containerPreCollection,
        stowage: fixedRates.stowage,
        preCarriageDurenKreuzau: fixedRates.preCarriageDurenKreuzau,
        allInByContainer:
          oceanFreight +
          fixedRates.thcOrigin +
          fixedRates.containerPreCollection +
          fixedRates.stowage +
          fixedRates.preCarriageDurenKreuzau,
      };
    } else {
      // Pour tous les autres cas : Ocean freight + THC Origin + Container Pre-collection + Container discharge + Container stuffing
      const containerPreCollection =
        countryId === "spain" || isHamburg
          ? 0
          : fixedRatesAntwerp.containerPreCollection;

      calculation = {
        ...calculation,
        containerPreCollection:
          containerPreCollection > 0 ? containerPreCollection : null,
        stowage: fixedRates.stowage,
        allInByContainer:
          containerPreCollection > 0
            ? oceanFreight +
              fixedRates.thcOrigin +
              containerPreCollection +
              fixedRates.stowage
            : oceanFreight + fixedRates.thcOrigin + fixedRates.stowage,
      };
    }

    calculation.allInByTon =
      calculation.allInByContainer / fixedRates.tonWeight;
    calculation.calculationType = calculationType;

    return calculation;
  };

  const isFormValid = () => {
    return formData.origin && formData.destination;
  };

  const CarrierProposal = ({ route, index }) => {
    const calculation = calculateTotal(route.oceanFreight, route.origin);

    return (
      <div className="proposal-card">
        <div className="proposal-header">
          <h3 className="proposal-title">
            <Ship className="title-icon" />
            Proposition {index + 1}
          </h3>
          <div className="carrier-badge">{route.carrier}</div>
        </div>

        {/* Tableau de calcul */}
        <div className="calculation-table">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="table-label">Ocean freight</td>
                <td className="table-value">
                  {calculation.oceanFreight.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {getCurrency()}
                </td>
              </tr>

              {/* Affichage conditionnel selon le type de calcul - FOB simplifié */}
              {calculation.calculationType ===
              "fob-container" ? // Pour FOB - seulement Ocean freight (déjà affiché ci-dessus), pas d'autres lignes
              null : calculation.calculationType === "mill-container" ? (
                // Pour FCA Mill in Container
                <>
                  <tr>
                    <td className="table-label">THC Origin</td>
                    <td className="table-value">
                      {calculation.thcOrigin.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">
                      Pre Carriage Niederauer Mühle
                    </td>
                    <td className="table-value">
                      {calculation.preCarriageNiederauer.toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                </>
              ) : calculation.calculationType === "port-container" ? (
                // Pour FCA Port in Container
                <tr>
                  <td className="table-label">THC Origin</td>
                  <td className="table-value">
                    {calculation.thcOrigin.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {getCurrency()}
                  </td>
                </tr>
              ) : calculation.calculationType === "mill-truck" &&
                route.origin === "Antwerp" ? (
                // Pour FCA Mill by Truck (uniquement pour Antwerp)
                <>
                  <tr>
                    <td className="table-label">THC Origin</td>
                    <td className="table-value">
                      {calculation.thcOrigin.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">Container Pre-collection</td>
                    <td className="table-value">
                      {calculation.containerPreCollection.toLocaleString(
                        "fr-FR",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">
                      Container discharge + Container stuffing
                    </td>
                    <td className="table-value">
                      {calculation.stowage.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">
                      Pre Carriage Düren/Kreuzau - Van Moer
                    </td>
                    <td className="table-value">
                      {calculation.preCarriageDurenKreuzau.toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                </>
              ) : calculation.calculationType === "spain-fca-port-truck" ? (
                <>
                  <tr>
                    <td className="table-label">Container FOB Charges</td>
                    <td className="table-value">
                      {calculation.fobCharges.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                </>
              ) : countryId === "usa" ? (
                // Affichage spécial pour les USA
                <>
                  {route.origin === "Savannah" && (
                    <tr>
                      <td className="table-label">Handling in/out/drayage</td>
                      <td className="table-value">
                        {calculation.handlingInOutDrayage.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        {getCurrency()}
                      </td>
                    </tr>
                  )}

                  {route.origin === "New Orleans" && (
                    <>
                      <tr>
                        <td className="table-label">
                          Handling in/out/drayage per container
                        </td>
                        <td className="table-value">
                          {calculation.handlingInOutDrayage.toLocaleString(
                            "fr-FR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          {getCurrency()}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">
                          Drayage/container additional if Ports of America
                        </td>
                        <td className="table-value">
                          {calculation.drayagePortsOfAmerica.toLocaleString(
                            "fr-FR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          {getCurrency()}
                        </td>
                      </tr>
                    </>
                  )}

                  {route.origin === "Houston" && (
                    <tr>
                      <td className="table-label">
                        Container handling in/out, drayage, chassis
                      </td>
                      <td className="table-value">
                        {calculation.handlingInOutDrayagesChassis.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        {getCurrency()}
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                // Pour tous les autres cas
                <>
                  <tr>
                    <td className="table-label">THC Origin</td>
                    <td className="table-value">
                      {calculation.thcOrigin.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                  {calculation.containerPreCollection !== null && (
                    <tr>
                      <td className="table-label">Container Pre-collection</td>
                      <td className="table-value">
                        {calculation.containerPreCollection.toLocaleString(
                          "fr-FR",
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}{" "}
                        {getCurrency()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="table-label">
                      Container discharge + Container stuffing
                    </td>
                    <td className="table-value">
                      {calculation.stowage.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                </>
              )}

              <tr className="table-total-container">
                <td className="table-total-label">ALL IN BY CONTAINER</td>
                <td className="table-total-value">
                  {calculation.allInByContainer.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {getCurrency()}
                </td>
              </tr>
              <tr className="table-ton-container">
                <td className="table-ton-label">ALL IN BY TON</td>
                <td className="table-ton-value">
                  {calculation.allInByTon.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {getCurrency()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Prix total en évidence */}
        <div className="final-price">
          <div className="text-center">
            <p className="green-label">PRIX TOTAL PAR CONTENEUR</p>
            <p className="text-3xl font-bold text-green-700">
              {calculation.allInByContainer.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {getCurrency()}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Soit{" "}
              {calculation.allInByTon.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {getCurrency()} par tonne
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Trouver la meilleure offre
  const bestOffer =
    availableRoutes.length > 0
      ? availableRoutes.reduce((best, current) => {
          const currentCalc = calculateTotal(
            current.oceanFreight,
            current.origin
          );
          const bestCalc = calculateTotal(best.oceanFreight, best.origin);
          return currentCalc.allInByContainer < bestCalc.allInByContainer
            ? current
            : best;
        })
      : null;

  return (
    <div className="main-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="header mb-8">
          <div className="header-title">
            <Ship className="ship-icon" />
            <h1>Calculateur de Fret Maritime</h1>
          </div>
          <p className="header-subtitle">
            Comparez les offres de plusieurs transporteurs
          </p>
          {selectedFCAMode && (
            <p className="header-mode-description">
              Mode sélectionné :{" "}
              {localStorage.getItem("selectedFCAModeLabel") || selectedFCAMode}
            </p>
          )}
          {countryId && (
            <p className="header-region-description">
              Région :
              {countryId === "usa"
                ? " États-Unis"
                : countryId === "spain"
                ? " Espagne"
                : " Benelux-Allemagne"}
            </p>
          )}
        </div>

        {/* Formulaire de recherche */}
        <div className="results-header">
          <h2 className="proposal-title">
            <Calculator className="card-title-icon" />
            Rechercher des offres
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Origine */}
            <div>
              <label className="form-label">
                <span className="label-icon-text">
                  <MapPin className="mappin-icon" />
                  <span>Port d'origine</span>
                </span>
              </label>

              <select
                className="form-select"
                value={formData.origin}
                onChange={(e) => handleInputChange("origin", e.target.value)}
              >
                <option value="">Sélectionnez le port d'origine</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="form-label">
                <span className="label-icon-text">
                  <MapPin className="mappin-icon" />
                  <span>Port de destination</span>
                </span>
              </label>
              <select
                className="form-select"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange("destination", e.target.value)
                }
              >
                <option value="">Sélectionnez le port de destination</option>
                {destinations.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton Rechercher */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <button
                onClick={searchRoutes}
                disabled={!isFormValid()}
                className={`btn ${isFormValid() ? "btn-primary" : ""}`}
              >
                <Calculator className="icon" />
                Valider
              </button>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {showCalculations && (
          <div className="space-y-6">
            {availableRoutes.length === 0 && (
              <div className="no-routes-message">
                <div className="no-routes-icon">⚠️</div>
                <h3 className="no-routes-title">Aucune route disponible</h3>
                <p className="no-routes-description">
                  Aucune offre trouvée pour {formData.origin} /{" "}
                  {formData.destination}.
                </p>
              </div>
            )}
            {availableRoutes.length > 0 && (
              <>
                {/* En-tête des résultats */}
                <div className="results-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {formData.origin} → {formData.destination}
                      </h2>
                      <p className="text-gray-600">
                        {availableRoutes.length} offre
                        {availableRoutes.length > 1 ? "s" : ""} disponible
                        {availableRoutes.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    {bestOffer && (
                      <div className="text-right">
                        <p className="text-sm text-green-600">
                          Meilleure offre
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          {calculateTotal(
                            bestOffer.oceanFreight,
                            bestOffer.origin
                          ).allInByContainer.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {getCurrency()}
                        </p>
                        <p className="text-sm text-green-600">
                          {bestOffer.carrier}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Propositions */}
                <div className="grid gap-6">
                  {availableRoutes
                    .sort(
                      (a, b) =>
                        calculateTotal(a.oceanFreight, a.origin)
                          .allInByContainer -
                        calculateTotal(b.oceanFreight, b.origin)
                          .allInByContainer
                    )
                    .map((route, index) => (
                      <CarrierProposal
                        key={`${route.carrier}-${index}`}
                        route={route}
                        index={index}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculPage;
