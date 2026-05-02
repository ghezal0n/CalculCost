import axios from "axios";

export const login = async (email, password) => {
  const response = await axios.post(
    "https://shipmate-backend-a8h8.onrender.com/api/auth/login",
    {
      email,
      password,
    },
  );
  return response.data.token;
};
