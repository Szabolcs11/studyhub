export const API_URL = import.meta.env.VITE_API_URL as string;
export const APP_URL = import.meta.env.VITE_APP_URL as string;

export const ENDPOINTS = {
  AUTHENTICATE: API_URL + "auth/authenticate",
  LOGIN: API_URL + "auth/login",
  REGISTER: API_URL + "auth/register",
  LOGOUT: API_URL + "auth/logout",
};
