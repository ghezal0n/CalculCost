import { useState, useEffect } from "react";
import "../assets/styles/Region.css";
import { useNavigate, useLocation } from "react-router-dom";

const RegionPage = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const countries = [
    {
      id: "belgium-germany",
      name: "Belgium - Germany - Netherlands",
      clickable: true,
    },
    { id: "spain", name: "Spain", clickable: true },
    { id: "usa", name: "United States of America", clickable: true },
    { id: "slovenia", name: "Slovenia", clickable: true },
    { id: "italy", name: "Italy", clickable: false },
    { id: "france", name: "France", clickable: false },
  ];

  // récupérer le département sélectionné depuis localStorage
  useEffect(() => {
    const storedDepartment = localStorage.getItem("selectedMillName");
    if (storedDepartment) {
      setSelectedDepartment(storedDepartment);
    }
  }, []);

  const getPropositionsForRegion = (regionId) => {
    if (regionId === "belgium-germany") {
      return [
        { id: "nm", name: "Niederauer Mühle", clickable: true },
        { id: "sp", name: "Smurfit Piteå", clickable: true },
        { id: "other", name: "Other", clickable: true },
      ];
    }
    return [];
  };

  const handleCountryClick = (country) => {
    if (!country.clickable) return;

    const propositions = getPropositionsForRegion(country.id);

    localStorage.setItem("selectedCountryId", country.id);

    if (propositions.length > 0) {
      navigate("/usine", { state: { countryId: country.id, propositions } });
    } else {
      navigate("/transport", { state: { countryId: country.id } });
    }
  };

  return (
    <div className="app-container">
      <div className="main-container">
        <header className="app-header">
          <div className="header-title">
            <svg
              className="globe-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.5 4 6 4 10s-1.5 7.5-4 10m0-20c-2.5 2.5-4 6-4 10s1.5 7.5 4 10m-8-10h16"
              />
            </svg>
            <h1>Select your loading port</h1>
          </div>
          <p className="app-subtitle">
            Choose a destination to access transport options
          </p>

          {selectedDepartment && (
            <p className="header-region-description">
              Selected department: {selectedDepartment}
            </p>
          )}
        </header>

        <ul className="countries-list">
          {countries.map((country) => (
            <li
              key={country.id}
              onClick={() => handleCountryClick(country)}
              className={`country-item ${
                country.clickable ? "clickable" : "disabled"
              }`}
            >
              <div className="item-content">
                <div className="item-header">
                  <h2
                    className={`country-name ${
                      country.clickable ? "active" : "inactive"
                    }`}
                  >
                    {country.name}
                  </h2>
                  {country.clickable && (
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

                {country.clickable && (
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

                {!country.clickable && (
                  <div className="coming-soon">
                    <span>Coming soon</span>
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

export default RegionPage;
