import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Stepper from "./components/Stepper";
import routes from "./auth/Routes";

function App() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    //Réveiller le backend Render au démarrage
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: "GET",
    }).catch(() => {});
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Stepper />
        <div style={{ padding: "2rem" }}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
