import React, { useState, useEffect } from "react";
import { Ship, Calculator, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import "../assets/styles/CalculPage.css";
import {
  freightData,
  koperFreightData,
  spainFreightData,
  usaFreightData,
} from "./Data.js";
import ARKAS from "../assets/images/ARKAS-Line.webp";
import CMA_CGM from "../assets/images/CMA_CGM.png";
import Corporation from "../assets/images/Corporation.png";
import COSCO from "../assets/images/COSCO.png";
import Evergreen from "../assets/images/Evergreen.svg";
import Grimaldi from "../assets/images/Grimaldi_Group.png";
import HapagLloyd from "../assets/images/hapag-lloyd.svg";
import IgnazioMessina from "../assets/images/ignazio_messina.jpeg";
import Maersk from "../assets/images/Maersk.png";
import MSC from "../assets/images/MSC.png";
import ONE from "../assets/images/ONE.png";
import OOCL from "../assets/images/OOCL.png";
import SwireShipping from "../assets/images/Swire Shipping.jpg";
import YangMing from "../assets/images/Yang Ming.jpg";
import ZIM from "../assets/images/ZIM.png";

const CalculPage = () => {
  const location = useLocation();
  const countryId = location.state?.countryId || "belgium-germany";

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    carrier: "",
    oceanFreight: "",
  });

  const selectedFCAMode = localStorage.getItem("selectedFCAMode");

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [showCalculations, setShowCalculations] = useState(false);

  const carrierLogos = {
    ARKAS: ARKAS,
    "CMA CGM": CMA_CGM,
    CMA: CMA_CGM,
    Corporation: Corporation,
    COSCO: COSCO,
    Cosco: COSCO,
    Evergreen: Evergreen,
    EVE: Evergreen,
    Grimaldi: Grimaldi,
    GRIMALDI: Grimaldi,
    "Hapag-Lloyd": HapagLloyd,
    HAPAG: HapagLloyd,
    Hapag: HapagLloyd,
    "HAPAG AT": HapagLloyd,
    "Ignazio Messina": IgnazioMessina,
    Maersk: Maersk,
    MAERSK: Maersk,
    MESSINA: IgnazioMessina,
    MSC: MSC,
    "MSC KOPER": MSC,
    "MSC AT": MSC,
    "MSC KP": MSC,
    "Swire Shipping": SwireShipping,
    YML: YangMing,
    ONE: ONE,
    OOCL: OOCL,
    ZIM: ZIM,
  };

  const getCurrency = () => {
    return countryId === "usa" ? "$" : "€";
  };

  // Fonction pour sauvegarder dans l'historique
  const saveToHistory = (origin, destination, routes) => {
    if (!origin || !destination || routes.length === 0) return;

    const calculations = routes.map((route) =>
      calculateTotal(route.oceanFreight, route.origin)
    );

    const bestPrice = Math.min(
      ...calculations.map((calc) => calc.allInByContainer)
    );

    const historyItem = {
      origin,
      destination,
      countryId,
      fcaMode: selectedFCAMode,
      offersCount: routes.length,
      bestPrice,
      currency: getCurrency(),
      timestamp: new Date().toISOString(),
    };

    // Récupérer l'historique existant
    const existingHistory = JSON.parse(
      localStorage.getItem("calculationHistory") || "[]"
    );

    // Ajouter le nouvel élément au début
    const updatedHistory = [historyItem, ...existingHistory];

    // 50 éléments max
    const limitedHistory = updatedHistory.slice(0, 50);

    // Sauvegarder
    localStorage.setItem("calculationHistory", JSON.stringify(limitedHistory));
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

  function getKoperFreightData() {
    const koperData = [];
    koperFreightData.forEach((route) => {
      koperData.push({
        ...route,
        origin: "Koper",
      });
    });
    return koperData;
  }
  const selectedMillName =
    location.state?.selectedMill?.name ||
    localStorage.getItem("selectedMillName") ||
    null;

  // Sélectionner les données selon le pays
  const getCurrentFreightData = () => {
    if (countryId === "spain") {
      return getSpainFreightData();
    } else if (countryId === "usa") {
      return usaFreightData;
    } else if (countryId === "slovenia") {
      return getKoperFreightData();
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

  const fixedRatesKoper = {
    thcOrigin: 150.0,
    stowage: 400.0,
    preCarriageNiederauer: 500.0,
    tonWeight: 24,
  };

  // Extraire les valeurs uniques
  const origins = [...new Set(currentFreightData.map((item) => item.origin))];

  // Effet pour définir l'origine par défaut selon le pays
  useEffect(() => {
    let defaultOrigin = "";

    // Si on vient de l'historique, charger les données sauvegardées
    if (location.state?.fromHistory && location.state?.historyData) {
      const { origin, destination, fcaMode } = location.state.historyData;
      setFormData((prev) => ({
        ...prev,
        origin,
        destination,
      }));

      // Mettre à jour le mode FCA si nécessaire
      if (fcaMode && fcaMode !== selectedFCAMode) {
        localStorage.setItem("selectedFCAMode", fcaMode);
      }

      return;
    }

    if (countryId === "belgium-germany") {
      defaultOrigin = "Antwerp";
    } else if (countryId === "spain" && origins.length === 1) {
      defaultOrigin = origins[0];
    } else if (countryId === "slovenia" && origins.includes("Koper")) {
      defaultOrigin = "Koper";
    }

    if (defaultOrigin && !formData.origin) {
      setFormData((prev) => ({
        ...prev,
        origin: defaultOrigin,
      }));
    }
  }, [origins, countryId, formData.origin, location.state]);

  const destinations = [
    ...new Set(currentFreightData.map((item) => item.destination)),
  ].sort();

  useEffect(() => {
    if (formData.origin && formData.destination) {
      searchRoutes();
    }
  }, [formData.origin, formData.destination]);

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

    // Sauvegarder dans l'historique seulement si on a des routes
    if (matchingRoutes.length > 0) {
      saveToHistory(formData.origin, formData.destination, matchingRoutes);
    }
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
    } else if (countryId === "slovenia") {
      fixedRates = fixedRatesKoper;
    } else if (origin === "Hamburg") {
      fixedRates = fixedRatesHamburg;
    } else {
      fixedRates = fixedRatesAntwerp;
    }

    const calculationType = getCalculationType();
    const isHamburg = origin === "Hamburg";

    let calculation = {
      oceanFreight: Number(oceanFreight) || 0,
      totalFobPreCarrier: 695,
      thcOrigin: fixedRates.thcOrigin,
      tonWeight: fixedRates.tonWeight,
    };

    // Mode FOB : seulement Ocean freight
    if (calculationType === "fob-container") {
      calculation = {
        ...calculation,
        allInByContainer: calculation.oceanFreight,
        allInByTon: calculation.oceanFreight / fixedRates.tonWeight,
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
          allInByContainer:
            calculation.oceanFreight + fixedRates.handlingInOutDrayage,
        };
      } else if (origin === "New Orleans") {
        calculation = {
          ...calculation,
          handlingInOutDrayage: fixedRates.handlingInOutDrayage,
          drayagePortsOfAmerica: fixedRates.drayagePortsOfAmerica,
          allInByContainer:
            calculation.oceanFreight + fixedRates.handlingInOutDrayage,
          allInByContainerWithPorts:
            calculation.oceanFreight +
            fixedRates.handlingInOutDrayage +
            fixedRates.drayagePortsOfAmerica,
        };
      } else if (origin === "Houston") {
        calculation = {
          ...calculation,
          handlingInOutDrayagesChassis: fixedRates.handlingInOutDrayagesChassis,
          allInByContainer:
            calculation.oceanFreight + fixedRates.handlingInOutDrayagesChassis,
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
        allInByContainer: calculation.oceanFreight + 695,
        allInByTon: (calculation.oceanFreight + 695) / fixedRates.tonWeight,
        calculationType: "spain-fca-port-truck",
      };
      return calculation;
    }

    // Gestion spéciale pour la Slovénie
    if (countryId === "slovenia") {
      if (selectedFCAMode === "fca-port-truck") {
        calculation = {
          ...calculation,
          fobCharges: 695,
          allInByContainer: calculation.oceanFreight + 695,
          allInByTon: (calculation.oceanFreight + 695) / fixedRates.tonWeight,
          calculationType: "slovenia-fca-port-truck",
        };
        return calculation;
      }
      // Pour les autres modes FCA en Slovénie
      calculation = {
        ...calculation,
        allInByContainer:
          calculation.oceanFreight + fixedRates.thcOrigin + fixedRates.stowage,
        allInByTon:
          (calculation.oceanFreight +
            fixedRates.thcOrigin +
            fixedRates.stowage) /
          fixedRates.tonWeight,
        calculationType: "slovenia",
        stowage: fixedRates.stowage,
      };
      return calculation;
    }

    //Special case for Smurfit Piteå mill with Antwerp origin**
    const selectedMill = localStorage.getItem("selectedMill");
    if (selectedMill === "sp" && origin === "Antwerp") {
      const preCarriageToAntwerp = 425;
      const lashingAndSecuring = 75;
      const stuffingRate = 7.6;

      calculation = {
        ...calculation,
        preCarriageToAntwerp: preCarriageToAntwerp,
        lashingAndSecuring: lashingAndSecuring,
        stuffingRate: stuffingRate,
        stuffingTotal: stuffingRate * fixedRates.tonWeight,
        allInByContainer:
          calculation.oceanFreight +
          fixedRates.thcOrigin +
          preCarriageToAntwerp +
          lashingAndSecuring +
          stuffingRate * fixedRates.tonWeight,
        calculationType: "smurfit-antwerp",
      };

      calculation.allInByTon =
        calculation.allInByContainer / fixedRates.tonWeight;
      return calculation;
    }

    if (calculationType === "mill-container") {
      //FCA Mill in Container : Ocean freight + THC Origin + Pre Carriage Niederauer Mühle
      calculation = {
        ...calculation,
        preCarriageNiederauer: fixedRates.preCarriageNiederauer,
        allInByContainer:
          calculation.oceanFreight +
          fixedRates.thcOrigin +
          fixedRates.preCarriageNiederauer,
      };
    } else if (calculationType === "port-container") {
      calculation = {
        ...calculation,
        preCarriageNiederauer: fixedRates.preCarriageNiederauer,
        allInByContainer: calculation.oceanFreight + fixedRates.thcOrigin,
      };
    } else if (calculationType === "mill-truck" && origin === "Antwerp") {
      //FCA Mill by Truck (Antwerp) : Ocean freight + THC Origin + Container Pre-collection + Container discharge + Container stuffing + Pre Carriage Düren/Kreuzau
      calculation = {
        ...calculation,
        containerPreCollection: fixedRates.containerPreCollection,
        stowage: fixedRates.stowage,
        preCarriageDurenKreuzau: fixedRates.preCarriageDurenKreuzau,
        allInByContainer:
          calculation.oceanFreight +
          fixedRates.thcOrigin +
          fixedRates.containerPreCollection +
          fixedRates.stowage +
          fixedRates.preCarriageDurenKreuzau,
      };
    } else {
      // Pour tous les autres cas
      const containerPreCollection =
        countryId === "spain" || countryId === "slovenia" || isHamburg
          ? 0
          : fixedRatesAntwerp.containerPreCollection;

      calculation = {
        ...calculation,
        containerPreCollection:
          containerPreCollection > 0 ? containerPreCollection : null,
        stowage: fixedRates.stowage,
        allInByContainer:
          containerPreCollection > 0
            ? calculation.oceanFreight +
              fixedRates.thcOrigin +
              containerPreCollection +
              fixedRates.stowage
            : calculation.oceanFreight +
              fixedRates.thcOrigin +
              fixedRates.stowage,
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
            Proposal {index + 1}
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

              {/* Affichage conditionnel selon le type de calcul */}
              {calculation.calculationType === "smurfit-antwerp" ? (
                // Special display for Smurfit Piteå with Antwerp origin
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
                    <td className="table-label">Pre Carriage to Antwerp</td>
                    <td className="table-value">
                      {calculation.preCarriageToAntwerp.toLocaleString(
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
                    <td className="table-label">Lashing and Securing</td>
                    <td className="table-value">
                      {calculation.lashingAndSecuring.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-label">
                      Stuffing: {calculation.stuffingRate}€ ×{" "}
                      {calculation.tonWeight} tons
                    </td>
                    <td className="table-value">
                      {calculation.stuffingTotal.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {getCurrency()}
                    </td>
                  </tr>
                </>
              ) : calculation.calculationType ===
                "fob-container" ? null : calculation.calculationType ===
                "mill-container" ? (
                // Pour FCA Port in Container
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
              ) : calculation.calculationType === "slovenia-fca-port-truck" ? (
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
              ) : countryId === "slovenia" ? (
                // Affichage pour la Slovénie
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
            <p className="green-label">TOTAL FREIGHT / CONTAINER</p>
            <p className="text-3xl font-bold text-green-700">
              {calculation.allInByContainer.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {getCurrency()}
            </p>
            {route.freetime && (
              <p className="text-m text-black-600 mt-1">
                ⏰ Freetime: {route.freetime}
              </p>
            )}
            {route.validUntil && (
              <p className="text-m text-red-600 mt-1">
                📅 Valid until: {route.validUntil}
              </p>
            )}
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
      <div className="max-w-7xl">
        {/* Header */}
        <div className="header mb-8">
          <div className="header-title">
            <Ship className="ship-icon" />
            <h1>Freight Calculator</h1>
          </div>
          {countryId && (
            <p className="header-subtitle">
              Region:
              {countryId === "usa"
                ? " United States"
                : countryId === "spain"
                ? " Spain"
                : countryId === "slovenia"
                ? " Slovenia"
                : " Belgium - Germany - Netherlands"}
            </p>
          )}
          <p className="header-mode-description">
            Selected factory:{" "}
            {selectedMillName ? selectedMillName : "No factory selected"}
          </p>
          {selectedFCAMode && (
            <p className="header-region-description">
              Selected mode:{" "}
              {localStorage.getItem("selectedFCAModeLabel") || selectedFCAMode}
            </p>
          )}
        </div>

        {/* Formulaire de recherche */}
        <div className="results-header">
          <h2 className="proposal-title">
            <Calculator className="card-title-icon" />
            Search for offers
          </h2>

          <div className="search-form-grid">
            {/* Origine */}
            <div>
              <label className="form-label">
                <span className="label-icon-text">
                  <MapPin className="mappin-icon" />
                  <span>Port of origin</span>
                </span>
              </label>

              <select
                className="form-select"
                value={formData.origin}
                onChange={(e) => handleInputChange("origin", e.target.value)}
              >
                <option value="">Select port of origin</option>
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
                  <span>Destination port</span>
                </span>
              </label>
              <select
                className="form-select"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange("destination", e.target.value)
                }
              >
                <option value="">Select destination port</option>
                {destinations.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {showCalculations && (
          <div className="space-y-6">
            {availableRoutes.length === 0 && (
              <div className="no-routes-message">
                <div className="no-routes-icon">⚠️</div>
                <h3 className="no-routes-title">No routes available</h3>
                <p className="no-routes-description">
                  No offers found for {formData.origin} / {formData.destination}
                  .
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
                        {availableRoutes.length} offer
                        {availableRoutes.length > 1 ? "s" : ""} available
                      </p>
                    </div>
                    {bestOffer && (
                      <div className="text-right">
                        <p className="text-xl font-semibold text-green-600 mb-2">
                          Best offer
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
                        <div className="carrier-info">
                          {carrierLogos[bestOffer.carrier] && (
                            <img
                              src={carrierLogos[bestOffer.carrier]}
                              alt={bestOffer.carrier}
                              className="carrier-logo"
                            />
                          )}
                          <span className="text-xs font-medium text-green-600 whitespace-nowrap">
                            {bestOffer.carrier}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Propositions */}
                <div className="proposals-grid">
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
