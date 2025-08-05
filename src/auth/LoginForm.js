import React, { useState } from 'react';
import '../assets/styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setSuccess('Connexion réussie !');
      navigate('/transport');
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo"></div>
      <div className="login-title">Connexion</div>
      <div className="login-subtitle">Accédez à votre compte</div>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className={`input-field ${error && !email ? 'error' : ''}`}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-input-container">
          <input
            className={`input-field password-input ${error && !password ? 'error' : ''}`}
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        <button className="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
      <div className="login-footer">
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>.
      </div>
    </div>
  );
};

export default LoginForm;