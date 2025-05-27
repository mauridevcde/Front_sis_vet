import { create } from "zustand";
import { persist } from "zustand/middleware";

// interface AuthState {
//   token: string;
//   nombre_apellido: string;
//   id_usuario: number;
//   id_rol: number;
//   isAuth: boolean;
//   setAuthInfo: (profileAuth: AuthStore) => void;
//   setLogout: () => void;

// }

interface AuthStore {
  token: string;
  nombre_apellido: string;
  id_usuario: number;
  id_rol: number;
}



export const useAuthStore = create(
  persist(
    (set) => ({
      setAuthInfo: (profileAuth: AuthStore) =>
        set(() => ({
          token: profileAuth.token,
          nombre_apellido: profileAuth.nombre_apellido,
          id_usuario: profileAuth.id_usuario,
          id_rol: profileAuth.id_rol,
        })),
      setLogout: () =>
        set(() => ({
          token: "",
          nombre_apellido: "",
          id_usuario: 0,
          id_rol: 0,
        })),
    }),
    {
      name: "auth",
    }
  )
);
