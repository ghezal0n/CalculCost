import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegistrePage';
import CalculPage from './pages/CalculPage';
import HistoriquePage from './pages/HistoriquePage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './auth/LoginForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/calcul"
          element={<ProtectedRoute><CalculPage /></ProtectedRoute>}
        />
        <Route
          path="/historique"
          element={<ProtectedRoute><HistoriquePage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
