import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API as string, // Или ваш URL
});

const savedToken = localStorage.getItem("token");

if (savedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};
