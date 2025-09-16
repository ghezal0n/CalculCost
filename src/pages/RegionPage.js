import { useState } from "react";
import "../assets/styles/Region.css";
import { useNavigate } from "react-router-dom";

const RegionPage = () => {
  const [currentPage, setCurrentPage] = useState();
  const navigate = useNavigate();
  const countries = [
    {
      id: "belgium-germany",
      name: "Belgium - Germany - Netherlands",
      clickable: true,
    },
    {
      id: "spain",
      name: "Spain",
      clickable: true,
    },
    {
      id: "usa",
      name: "United States of America",
      clickable: true,
    },
    {
      id: "slovenia",
      name: "Slovenia",
      clickable: true,
    },
    {
      id: "italy",
      name: "Italy",
      clickable: false,
    },
    {
      id: "france",
      name: "France",
      clickable: false,
    },
  ];

  const handleCountryClick = (country) => {
    if (country.clickable) {
      // Sauvegarder le countryId dans localStorage pour la persistance

      localStorage.setItem("selectedCountryId", country.id);
      setCurrentPage("transport");
      navigate("/transport", { state: { countryId: country.id } });
    }
  };

  //   if (currentPage === "transport") {
  //     navigate("/transport");
  //   }

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
