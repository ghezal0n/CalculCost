import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./pages/RegistrePage";
import RegionPage from "./pages/RegionPage";
import TransportChoicePage from "./pages/TransportChoicePage";
import CalculPage from "./pages/CalculPage";
import HistoriquePage from "./pages/HistoriquePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./auth/LoginForm";
import UsinePage from "./pages/UsinePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegionPage />} />
        {/* <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/transport" element={<TransportChoicePage />} />
        <Route path="/usine" element={<UsinePage />} />
        <Route path="/calcul" element={<CalculPage />} />
        <Route path="/historique" element={<HistoriquePage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
