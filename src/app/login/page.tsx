"use client";

import "../globals.css";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { loginRequest } from "../_api/auth/login";
import { useAuthStore } from "../_store/authStore";

type Inputs = {
  usuario: string;
  password: string;
};

interface AuthStore {
  token: string;
  nombre_apellido: string;
  id_usuario: number;
  id_rol: number;
  setAuthInfo: (profileAuth: AuthStore) => void;
  setLogout: () => void;
}

export default function Login() {
  const setToken = useAuthStore(
    (state: unknown) => (state as AuthStore).setAuthInfo
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // Aquí puedes manejar el envío del formulario

    const result = await loginRequest(data);
    //validar el resultado de la petición
    if (result.status !== 200) {
      console.error("Error al iniciar sesión", result);
      return;
    }
    // Si la petición fue exitosa, guardar el token en el store
    console.log("Login successful", result.data);
    setToken(result.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-linear-to-t from-[#101828] to-[#293844] p-10 rounded-xl shadow-md w-full max-w-sm flex flex-col items-center space-y-6">
        <Image src="/logo.png" alt="SisPET" width={120} height={120} />

        <form className="w-full space-y-4 " onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-white mb-1 ">User</label>
            <input
              {...register("usuario", {
                required: "El usuario es obligatorio",
              })}
              type="text"
              className="w-full bg-white px-4 py-2 rounded-full outline-none text-gray-800"
              placeholder="Ingrese su usuario"
            />
            {errors.usuario && (
              <p className="text-red-500 text-sm mt-1">
                {errors.usuario.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              {...register("password", {
                required: "La contraseña es obligatorio",
              })}
              type="password"
              className="w-full px-4 bg-white py-2 rounded-full outline-none text-gray-800"
              placeholder="Ingrese su contraseña"
            />
            <span>
              {errors.usuario && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.usuario.message}
                </p>
              )}
            </span>
          </div>
          <button
            type="submit"
            className="w-42 ml-16 mt-4 py-2 rounded-full bg-[#9C855F] text-white font-bold shadow-md hover:bg-[#8a7653] transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
