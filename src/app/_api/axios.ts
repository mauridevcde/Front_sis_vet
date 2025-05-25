import { useAuthStore } from "@/app/_store/authStore";
import axios from "axios";

interface AuthState {
  token: string;
  nombre_apellido: string;
  id_usuario: number;
  id_rol: number;
  isAuth: boolean;
  setAuthInfo: (profileAuth: AuthState) => void;
  setLogout: () => void;
}

const authApi = axios.create({
  baseURL: "http://localhost:4000/",
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const token = (useAuthStore.getState() as AuthState).token; // con esto  puedo acceder al token

  if (!token) {
    return config;
  }

  config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});
export default authApi;
