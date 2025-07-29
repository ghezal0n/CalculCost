import axios from 'axios';

export const login = async (email, password) => {
  const response = await axios.post('http://localhost:8080/api/auth/login', {
    email,
    password
  });
  return response.data.token; // Assure-toi que ton AuthResponse contient "token"
};
