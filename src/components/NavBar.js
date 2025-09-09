import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { path: "/", label: "Région" },
    { path: "/transport", label: "Transport" },
    { path: "/usine", label: "Usine" },
    { path: "/calcul", label: "Calcul" },
    { path: "/historique", label: "Historique" },
  ];

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Fermer le menu mobile quand on passe en desktop
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Composant SVG pour l'icône hamburger
  const MenuIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  // Composant SVG pour l'icône fermer
  const CloseIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const navStyles = {
    backgroundColor: "#343a40",
    padding: isMobile ? "1rem" : "1rem 2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "100vw",
    margin: 0,
    boxSizing: "border-box",
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    zIndex: 1000,
  };

  const containerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    position: "relative",
  };

  const logoStyles = {
    fontSize: isMobile ? "1.25rem" : "1.5rem",
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
    zIndex: 1001,
  };

  const desktopNavStyles = {
    display: isMobile ? "none" : "flex",
    listStyle: "none",
    margin: "0 auto",
    padding: 0,
    gap: "2rem",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const mobileMenuButtonStyles = {
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    minWidth: "44px", // Touch target minimum
    minHeight: "44px",
  };

  const mobileMenuOverlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    display: isMobile && isMobileMenuOpen ? "block" : "none",
    animation: isMobileMenuOpen ? "fadeIn 0.3s ease" : "fadeOut 0.3s ease",
  };

  const mobileMenuStyles = {
    position: "fixed",
    top: 0,
    right: isMobileMenuOpen ? 0 : "-100%",
    height: "100vh",
    width: "min(280px, 80vw)",
    backgroundColor: "#343a40",
    zIndex: 1002,
    transition: "right 0.3s ease-in-out",
    boxShadow: "-2px 0 10px rgba(0,0,0,0.3)",
    display: isMobile ? "flex" : "none",
    flexDirection: "column",
  };

  const mobileMenuHeaderStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid #495057",
    flexShrink: 0,
  };

  const mobileMenuContentStyles = {
    flex: 1,
    overflowY: "auto",
  };

  const mobileMenuListStyles = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const mobileMenuItemStyles = {
    borderBottom: "1px solid #495057",
  };

  const getLinkStyles = (isActive, isMobileLink = false) => ({
    textDecoration: "none",
    color: isActive ? "#ffc107" : "white",
    padding: isMobileLink ? "1rem 1.5rem" : "0.5rem 1rem",
    borderRadius: isMobileLink ? "0" : "4px",
    transition: "all 0.3s",
    fontWeight: isActive ? "bold" : "normal",
    display: "block",
    fontSize: isMobileLink ? "1.1rem" : "1rem",
    minHeight: isMobileLink ? "48px" : "auto",
    lineHeight: isMobileLink ? "48px" : "normal",
  });

  const handleLinkHover = (e, isActive) => {
    if (!isActive) {
      e.target.style.color = "#ffc107";
      if (isMobile) {
        e.target.style.backgroundColor = "#495057";
      }
    }
  };

  const handleLinkLeave = (e, isActive) => {
    if (!isActive) {
      e.target.style.color = "white";
      if (isMobile) {
        e.target.style.backgroundColor = "transparent";
      }
    }
  };

  const closeButtonStyles = {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "44px",
    minHeight: "44px",
    transition: "background-color 0.3s",
  };

  return (
    <>
      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          body.menu-open {
            overflow: hidden !important;
          }
        }
      `}</style>

      <nav style={navStyles}>
        <div style={containerStyles}>
          {/* Logo */}
          <Link to="/" style={logoStyles}>
            Shipmate
          </Link>

          {/* Navigation Desktop */}
          <ul style={desktopNavStyles}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={getLinkStyles(isActive)}
                    onMouseEnter={(e) => handleLinkHover(e, isActive)}
                    onMouseLeave={(e) => handleLinkLeave(e, isActive)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bouton Menu Mobile */}
          <button
            style={mobileMenuButtonStyles}
            onClick={toggleMobileMenu}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
            aria-label="Menu de navigation"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Overlay Mobile */}
      <div
        style={mobileMenuOverlayStyles}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Menu Mobile */}
      <div
        style={mobileMenuStyles}
        role="navigation"
        aria-label="Menu de navigation mobile"
      >
        <div style={mobileMenuHeaderStyles}>
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Navigation
          </span>
          <button
            style={closeButtonStyles}
            onClick={() => setIsMobileMenuOpen(false)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
            aria-label="Fermer le menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div style={mobileMenuContentStyles}>
          <ul style={mobileMenuListStyles}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} style={mobileMenuItemStyles}>
                  <Link
                    to={item.path}
                    style={getLinkStyles(isActive, true)}
                    onMouseEnter={(e) => handleLinkHover(e, isActive)}
                    onMouseLeave={(e) => handleLinkLeave(e, isActive)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
