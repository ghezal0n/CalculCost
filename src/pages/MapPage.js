import React, { useState } from "react";
import { MapPin, Factory, X } from "lucide-react";

const MapPage = () => {
  const [selectedUsine, setSelectedUsine] = useState(null);

  // Données des usines avec leurs coordonnées
  const usines = [
    {
      id: "nm",
      name: "Niederauer Mühle",
      country: "Allemagne",
      lat: 50.8,
      lon: 6.2,
      description: "Usine de production de papier",
      capacity: "Capacité: 150,000 tonnes/an",
    },
    {
      id: "sp",
      name: "Smurfit Piteå",
      country: "Suède",
      lat: 65.3,
      lon: 21.5,
      description: "Usine de production de carton",
      capacity: "Capacité: 200,000 tonnes/an",
    },
  ];

  // Conversion des coordonnées géographiques en position SVG
  const getPosition = (lat, lon) => {
    // Projection Mercator simplifiée
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const handleUsineClick = (usine) => {
    setSelectedUsine(usine);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* En-tête */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Factory size={40} />
            Carte des Usines
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
            }}
          >
            {usines.length} usines disponibles dans le monde
          </p>
        </div>

        {/* Conteneur de la carte */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            position: "relative",
          }}
        >
          {/* Carte SVG */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%", // Ratio 16:9
              background: "#e8f4f8",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              }}
            >
              {/* Grille de fond */}
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#d0e8f0"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Continents simplifiés */}
              {/* Europe */}
              <ellipse
                cx="50"
                cy="35"
                rx="15"
                ry="10"
                fill="#c8e1cc"
                opacity="0.6"
              />
              {/* Amérique */}
              <ellipse
                cx="25"
                cy="45"
                rx="12"
                ry="20"
                fill="#c8e1cc"
                opacity="0.6"
              />
              {/* Asie */}
              <ellipse
                cx="70"
                cy="40"
                rx="18"
                ry="15"
                fill="#c8e1cc"
                opacity="0.6"
              />
              {/* Afrique */}
              <ellipse
                cx="48"
                cy="55"
                rx="10"
                ry="15"
                fill="#c8e1cc"
                opacity="0.6"
              />

              {/* Marqueurs des usines */}
              {usines.map((usine) => {
                const pos = getPosition(usine.lat, usine.lon);
                return (
                  <g key={usine.id}>
                    {/* Cercle de pulsation */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="2"
                      fill="#dc3545"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        from="2"
                        to="4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Marqueur principal */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="1.5"
                      fill="#dc3545"
                      stroke="white"
                      strokeWidth="0.3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleUsineClick(usine)}
                    />

                    {/* Icône usine */}
                    <g
                      transform={`translate(${pos.x - 1.5}, ${pos.y - 3})`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleUsineClick(usine)}
                    >
                      <rect
                        width="3"
                        height="2"
                        fill="white"
                        opacity="0.9"
                        rx="0.2"
                      />
                      <rect
                        x="0.5"
                        y="0.3"
                        width="0.6"
                        height="0.8"
                        fill="#dc3545"
                      />
                      <rect
                        x="1.9"
                        y="0.3"
                        width="0.6"
                        height="0.8"
                        fill="#dc3545"
                      />
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Légende */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#f8f9fa",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#dc3545",
                  border: "2px solid white",
                }}
              />
              <span style={{ fontSize: "0.9rem", color: "#495057" }}>
                Usine disponible
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <MapPin size={16} color="#28a745" />
              <span style={{ fontSize: "0.9rem", color: "#495057" }}>
                Cliquez sur un marqueur pour plus d'infos
              </span>
            </div>
          </div>
        </div>

        {/* Liste des usines */}
        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {usines.map((usine) => (
            <div
              key={usine.id}
              onClick={() => handleUsineClick(usine)}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border:
                  selectedUsine?.id === usine.id
                    ? "3px solid #dc3545"
                    : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "#dc3545",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Factory size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#212529",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {usine.name}
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    📍 {usine.country}
                  </p>
                  <p
                    style={{
                      color: "#495057",
                      fontSize: "0.85rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {usine.description}
                  </p>
                  <p
                    style={{
                      color: "#28a745",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {usine.capacity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de détails */}
        {selectedUsine && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
            onClick={() => setSelectedUsine(null)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "2rem",
                maxWidth: "500px",
                width: "100%",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedUsine(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <X size={24} color="#6c757d" />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    background: "#dc3545",
                    padding: "1rem",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Factory size={32} color="white" />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#212529",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {selectedUsine.name}
                  </h2>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                    }}
                  >
                    📍 {selectedUsine.country}
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "0.5rem",
                  }}
                >
                  Description
                </h3>
                <p
                  style={{
                    color: "#212529",
                    marginBottom: "1rem",
                  }}
                >
                  {selectedUsine.description}
                </p>

                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "0.5rem",
                  }}
                >
                  Capacité
                </h3>
                <p
                  style={{
                    color: "#28a745",
                    fontWeight: "600",
                  }}
                >
                  {selectedUsine.capacity}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: "0.75rem 1.5rem",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#c82333")}
                  onMouseLeave={(e) => (e.target.style.background = "#dc3545")}
                >
                  Sélectionner cette usine
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
