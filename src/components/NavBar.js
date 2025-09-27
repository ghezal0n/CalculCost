import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoutIcon from "../assets/images/logout.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const shouldHideNavbar = location.state?.hideNavbar || false;

  if (shouldHideNavbar) {
    return null;
  }

  const allowedPaths = [
    "/",
    "/department",
    "/region",
    "/usine",
    "/transport",
    "/calcul",
    "/historique",
  ];

  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  const navItems = [
    { path: "/department", label: "Department" },
    { path: "/region", label: "Region" },
    { path: "/usine", label: "Usine" },
    { path: "/transport", label: "Transport" },
    { path: "/calcul", label: "Calcul" },
    { path: "/historique", label: "Historique" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    navigate("/login", { replace: true });
  };

  // icone hamburger
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

  // Composant SVG pour l'icône logout
  const LogoutIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ marginRight: "0.5rem" }}
    >
      <path d="m9 21 5-5-5-5"></path>
      <path d="M20 16v-2a4 4 0 0 0-4-4H4"></path>
      <path d="m15 10 5 5"></path>
      <path d="M4 21v-7a4 4 0 0 1 4-4h3"></path>
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

  const desktopRightSection = {
    display: isMobile ? "none" : "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const logoutButtonStyles = {
    display: "flex",
    alignItems: "center",
    background: "#dc3545",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s",
    minHeight: "36px",
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
    minWidth: "44px",
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

  const mobileMenuFooterStyles = {
    padding: "1rem",
    borderTop: "1px solid #495057",
    flexShrink: 0,
  };

  const mobileMenuListStyles = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const mobileMenuItemStyles = {
    borderBottom: "1px solid #495057",
  };

  const mobileLogoutButtonStyles = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dc3545",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.75rem 1rem",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s",
    minHeight: "48px",
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
      <style>
        {`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
  
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
  
      @media (max-width: 768px) {
        body.menu-open {
          overflow: hidden !important;
        }
      }
      `}
      </style>

      <nav style={navStyles}>
        <div style={containerStyles}>
          <Link to="/" style={logoStyles}>
            Shipmate
          </Link>

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

          <div style={desktopRightSection}>
            <span
              onClick={handleLogout}
              style={{
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffc107")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              <img
                src={logoutIcon}
                alt="Logout"
                style={{
                  width: "18px",
                  height: "18px",
                  filter: "brightness(0) saturate(100%) invert(100%)",
                }}
              />
              Déconnexion
            </span>
          </div>

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

      <div
        style={mobileMenuOverlayStyles}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

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

        <div style={mobileMenuFooterStyles}>
          <button
            style={mobileLogoutButtonStyles}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
            aria-label="Se déconnecter"
          >
            <LogoutIcon />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
