import { useState } from "react";
import "../assets/styles/Freight.css";
import { useNavigate } from "react-router-dom";

const FreightPage = () => {
  const [currentPage, setCurrentPage] = useState();
  const navigate = useNavigate();
  const countries = [
    {
      id: "benelux-germany",
      name: "ANTWERP - HAMBURG - ROTTERDAM",
      clickable: true,
    },
    {
      id: "spain",
      name: "SPAIN",
      clickable: true,
    },
    {
      id: "usa",
      name: "USA",
      clickable: true,
    },
  ];

  const handleCountryClick = (country) => {
    if (country.clickable) {
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
            <h1>Sélectionnez votre région</h1>
          </div>

          <p className="app-subtitle">
            Choisissez une destination pour accéder aux options de transport
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
                    <span>Bientôt disponible</span>
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

export default FreightPage;
