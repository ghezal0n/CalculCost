import { useState, useEffect } from "react";
import "../assets/styles/Usine.css";
import { useNavigate, useLocation } from "react-router-dom";

const UsinePage = () => {
  const [currentPage, setCurrentPage] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const propositions = location.state?.propositions || [];

  const countries = [
    {
      id: "nm",
      name: "Niederauer Mühle",
      clickable: true,
    },
  ];

  const handleCountryClick = (country) => {
    if (country.clickable && country.id === "nm") {
      setCurrentPage("usine");
    }
  };

  useEffect(() => {
    if (currentPage === "usine") {
      navigate("/calcul", { state: { propositions } });
    }
  }, [currentPage, navigate, propositions]);

  return (
    <div className="app-container">
      <div className="main-container">
        <header className="app-header">
          <div className="header-title">
            <svg
              className="factory-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h1 className="app-title">Select your mill </h1>
          </div>
          <p className="app-subtitle">Choose a mill to access the calculator</p>
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

export default UsinePage;
