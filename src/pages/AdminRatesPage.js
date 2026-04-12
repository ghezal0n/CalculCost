import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Save, RotateCcw, ChevronRight, CheckCircle } from "lucide-react";
import { DEFAULT_RATES, getRates, saveRates, resetRates } from "./ratesConfig";
import "../assets/styles/AdminRatesPage.css";

// Human-readable field labels and their units
const FIELD_META = {
  thcOrigin: { label: "THC Origin", unit: "€" },
  containerPreCollection: { label: "Container Pre-collection", unit: "€" },
  stowage: { label: "Container discharge + stuffing", unit: "€" },
  preCarriageNiederauer: { label: "Pre Carriage Niederauer Mühle", unit: "€" },
  preCarriageDurenKreuzau: { label: "Pre Carriage Düren / Kreuzau", unit: "€" },
  preCarriageToAntwerp: { label: "Pre Carriage to Antwerp", unit: "€" },
  lashingAndSecuring: { label: "Lashing & Securing", unit: "€" },
  stuffingRate: { label: "Stuffing Rate (per ton)", unit: "€" },
  handlingInOutDrayage: { label: "Handling In/Out + Drayage", unit: "$" },
  drayagePortsOfAmerica: { label: "Drayage – Ports of America", unit: "$" },
  handlingInOutDrayagesChassis: {
    label: "Handling In/Out + Drayages + Chassis",
    unit: "$",
  },
  tonWeight: { label: "Ton Weight (per container)", unit: "T" },
};

// Which regions map to which transport mode selection (for breadcrumb)
const REGION_KEY_MAP = {
  "belgium-germany": ["antwerp", "hamburg"],
  spain: ["spain"],
  slovenia: ["koper"],
  italy: ["verzuolo"],
  usa: ["usa_savannah", "usa_new_orleans", "usa_houston"],
};

const AdminRatesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const countryId =
    location.state?.countryId ||
    localStorage.getItem("selectedCountryId") ||
    "belgium-germany";
  const selectedChoice =
    location.state?.selectedChoice || localStorage.getItem("selectedFCAMode");

  // Determine which rate sections to show based on countryId
  const relevantKeys = REGION_KEY_MAP[countryId] || ["antwerp"];

  const [rates, setRates] = useState(() => {
    const current = getRates();
    // Return only relevant sections
    const subset = {};
    relevantKeys.forEach((k) => {
      subset[k] = { ...current[k] };
    });
    return subset;
  });

  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (regionKey, field, value) => {
    setRates((prev) => ({
      ...prev,
      [regionKey]: {
        ...prev[regionKey],
        [field]: value === "" ? "" : Number(value),
      },
    }));
    setSaved(false);
    // Clear error
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${regionKey}_${field}`];
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    for (const regionKey of Object.keys(rates)) {
      for (const field of Object.keys(rates[regionKey])) {
        if (field === "label") continue;
        const v = rates[regionKey][field];
        if (v === "" || isNaN(v) || Number(v) < 0) {
          errs[`${regionKey}_${field}`] = "Invalid value";
        }
      }
    }
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Merge with full rates (other regions stay intact)
    const fullRates = getRates();
    for (const key of Object.keys(rates)) {
      fullRates[key] = { ...fullRates[key], ...rates[key] };
    }
    saveRates(fullRates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!window.confirm("Reset all rates to default values for this region?"))
      return;
    const subset = {};
    relevantKeys.forEach((k) => {
      subset[k] = { ...DEFAULT_RATES[k] };
    });
    setRates(subset);
    setSaved(false);
  };

  const handleResetAll = () => {
    if (!window.confirm("Reset ALL rates (all regions) to default values?"))
      return;
    resetRates();
    const current = getRates();
    const subset = {};
    relevantKeys.forEach((k) => {
      subset[k] = { ...current[k] };
    });
    setRates(subset);
    setSaved(false);
  };

  const getRegionLabel = () => {
    switch (countryId) {
      case "usa":
        return "United States";
      case "spain":
        return "Spain";
      case "slovenia":
        return "Slovenia";
      case "italy":
        return "Italy";
      default:
        return "Belgium – Germany – Netherlands";
    }
  };

  const getModeLabel = () => {
    switch (selectedChoice) {
      case "fca-mill-truck":
        return "FCA Mill by Truck";
      case "fca-mill-container":
        return "FCA Mill in Container";
      case "fca-port-truck":
        return "FCA Port by Truck";
      case "fca-port-container":
        return "FCA Port in Container";
      case "fob-container":
        return "FOB Container";
      default:
        return selectedChoice || "—";
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-top">
          <div className="admin-breadcrumb">
            <span className="breadcrumb-item" onClick={() => navigate("/")}>
              Mills
            </span>
            <ChevronRight size={14} />
            <span
              className="breadcrumb-item"
              onClick={() => navigate("/region")}
            >
              Regions
            </span>
            <ChevronRight size={14} />
            <span
              className="breadcrumb-item"
              onClick={() => navigate("/transport", { state: { countryId } })}
            >
              Transport
            </span>
            <ChevronRight size={14} />
            <span className="breadcrumb-current">Edit Rates</span>
          </div>
          <span className="admin-badge">ADMIN</span>
        </div>
        <h1 className="admin-title">Edit Fixed Rates</h1>
        <p className="admin-subtitle">
          <span className="region-chip">{getRegionLabel()}</span>
          {selectedChoice && (
            <span className="mode-chip">{getModeLabel()}</span>
          )}
        </p>
        <p className="admin-hint">
          Changes are applied immediately across the entire application after
          saving.
        </p>
      </div>

      {/* Sections */}
      <div className="admin-sections">
        {Object.keys(rates).map((regionKey) => {
          const section = rates[regionKey];
          const defaults = DEFAULT_RATES[regionKey] || {};
          const editableFields = Object.keys(section).filter(
            (f) => f !== "label" && FIELD_META[f]
          );

          return (
            <div key={regionKey} className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">
                  {DEFAULT_RATES[regionKey]?.label || regionKey}
                </h2>
              </div>

              <div className="admin-fields-grid">
                {editableFields.map((field) => {
                  const meta = FIELD_META[field];
                  const errorKey = `${regionKey}_${field}`;
                  const isChanged = section[field] !== defaults[field];
                  return (
                    <div
                      key={field}
                      className={`admin-field ${isChanged ? "changed" : ""}`}
                    >
                      <label className="admin-field-label">
                        {meta.label}
                        {isChanged && (
                          <span className="changed-dot" title="Modified" />
                        )}
                      </label>
                      <div className="admin-input-wrapper">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`admin-input ${
                            errors[errorKey] ? "input-error" : ""
                          }`}
                          value={section[field]}
                          onChange={(e) =>
                            handleChange(regionKey, field, e.target.value)
                          }
                        />
                        <span className="admin-input-unit">{meta.unit}</span>
                      </div>
                      {errors[errorKey] && (
                        <p className="field-error">{errors[errorKey]}</p>
                      )}
                      <p className="field-default">
                        Default: {defaults[field]} {meta.unit}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="admin-actions">
        <div className="admin-actions-left">
          <button className="btn-reset-region" onClick={handleReset}>
            <RotateCcw size={15} />
            Reset this region
          </button>
          <button className="btn-reset-all" onClick={handleResetAll}>
            Reset all regions
          </button>
        </div>
        <div className="admin-actions-right">
          {saved && (
            <span className="save-success">
              <CheckCircle size={16} />
              Saved!
            </span>
          )}
          <button className="btn-save" onClick={handleSave}>
            <Save size={16} />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRatesPage;
