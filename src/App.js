import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./pages/RegistrePage";
import FreightPage from "./pages/FreightPage";
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
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/freight"
          element={
            <ProtectedRoute>
              <FreightPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transport"
          element={
            <ProtectedRoute>
              <TransportChoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usine"
          element={
            <ProtectedRoute>
              <UsinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calcul"
          element={
            <ProtectedRoute>
              <CalculPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historique"
          element={
            <ProtectedRoute>
              <HistoriquePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
