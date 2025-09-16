import React, { useState, useEffect } from "react";
import { Ship, History, MapPin, Calendar, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/HistoriquePage.css";

const HistoriquePage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = localStorage.getItem("calculationHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        //trier par date recurente
        const sortedHistory = parsedHistory.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setHistory(sortedHistory);
      } catch (error) {
        console.error("Error loading history:", error);
        setHistory([]);
      }
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all history?")) {
      localStorage.removeItem("calculationHistory");
      setHistory([]);
    }
  };

  const deleteHistoryItem = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedHistory = history.filter((_, i) => i !== index);
      setHistory(updatedHistory);
      localStorage.setItem(
        "calculationHistory",
        JSON.stringify(updatedHistory)
      );
    }
  };

  const viewCalculation = (item) => {
    // Naviguer vers la page de calcul avec les paramètres sauvegardés
    navigate("/calcul", {
      state: {
        countryId: item.countryId,
        fromHistory: true,
        hideNavbar: true,
        historyData: {
          origin: item.origin,
          destination: item.destination,
          fcaMode: item.fcaMode,
        },
      },
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRegionName = (countryId) => {
    switch (countryId) {
      case "usa":
        return "United States";
      case "spain":
        return "Spain";
      case "slovenia":
        return "Slovenia";
      case "belgium-germany":
      default:
        return "Belgium - Germany - Netherlands";
    }
  };

  const getFCAModeLabel = (fcaMode) => {
    switch (fcaMode) {
      case "fca-mill-container":
        return "FCA Mill in Container";
      case "fca-port-container":
        return "FCA Port in Container";
      case "fca-mill-truck":
        return "FCA Mill by Truck";
      case "fob-container":
        return "FOB Container";
      case "fca-port-truck":
        return "FCA Port by Truck";
      default:
        return "Unspecified mode";
    }
  };

  return (
    <div className="main-container">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="header mb-8">
          <div className="header-title">
            <History className="ship-icon" />
            <h1>Consultation History</h1>
          </div>
          <p className="header-subtitle">
            Find your latest sea freight searches
          </p>
        </div>

        {/* Actions */}
        <div className="history-actions">
          <div className="history-stats">
            <p className="text-gray-600">
              {history.length} consultation{history.length > 1 ? "s" : ""} saved
              {history.length > 1 ? "s" : ""}
            </p>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="clear-history-btn">
              <Trash2 className="w-4 h-4" />
              Clear history
            </button>
          )}
        </div>

        {/* Liste de l'historique */}
        <div className="history-container">
          {history.length === 0 ? (
            <div className="no-history-message">
              <div className="no-history-icon">📋</div>
              <h3 className="no-history-title">No history available</h3>
              <p className="no-history-description">
                Your sea freight searches will appear here after performing
                calculations.
              </p>
              <button
                onClick={() => navigate("/calcul")}
                className="start-calculation-btn"
              >
                <Ship className="w-4 h-4" />
                Start a calculation
              </button>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((item, index) => (
                <div key={index} className="history-card">
                  <div className="history-card-header">
                    <div className="history-route">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="route-text">
                        {item.origin} → {item.destination}
                      </span>
                    </div>
                    <div className="history-actions-item">
                      <button
                        onClick={() => viewCalculation(item)}
                        className="view-btn"
                        title="View calculation"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(index)}
                        className="delete-btn"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="history-details">
                    <div className="history-detail-item">
                      <span className="detail-label">Region:</span>
                      <span className="detail-value">
                        {getRegionName(item.countryId)}
                      </span>
                    </div>
                    <div className="history-detail-item">
                      <span className="detail-label">FCA Mode:</span>
                      <span className="detail-value">
                        {getFCAModeLabel(item.fcaMode)}
                      </span>
                    </div>
                    <div className="history-detail-item">
                      <span className="detail-label">Offers found:</span>
                      <span className="detail-value">
                        {item.offersCount} offer
                        {item.offersCount > 1 ? "s" : ""}
                      </span>
                    </div>
                    {item.bestPrice && (
                      <div className="history-detail-item">
                        <span className="detail-label">Best price:</span>
                        <span className="detail-value best-price">
                          {item.bestPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {item.currency}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="history-footer">
                    <div className="history-timestamp">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriquePage;
