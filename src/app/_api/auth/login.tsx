import axios from "../axios";

interface LoginData {
  usuario: string;
  password: string;
}

export const loginRequest = async (data: LoginData) => {
  return await axios.post("auth/login", {
    usuario: data.usuario,
    password: data.password,
  });
};
