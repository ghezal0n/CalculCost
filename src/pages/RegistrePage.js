import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/RegisterPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [showPwd, setShowPwd] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        email,
        username,
        password,
      });
      setMessage(
        "Compte créé avec succès. Vous pouvez maintenant vous connecter.",
      );
      setIsError(false);
    } catch (error) {
      setMessage("Erreur lors de l’inscription.");
      setIsError(true);
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo"></div>
      <div className="login-title">Créer un compte</div>
      <div className="login-subtitle">
        Inscrivez-vous pour accéder à l'application
      </div>

      {message && (
        <div className={isError ? "error-message" : "success-message"}>
          {message}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="input-field"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className="input-field"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPwd ? "text" : "password"}
          className="input-field"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="toggle-password" onClick={() => setShowPwd(!showPwd)}>
          {showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        </div>

        <button type="submit" className="submit-button">
          S'inscrire
        </button>
      </form>

      <div className="login-footer">
        Vous avez déjà un compte ? <a href="/login">Log in</a>.
      </div>
    </div>
  );
};

export default RegisterPage;
