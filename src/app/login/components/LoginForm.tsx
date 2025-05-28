import { loginRequest } from "@/app/_api/auth/login";
import { useAuthStore } from "@/app/_store/authStore";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const setToken = useAuthStore(
    (state: unknown) => (state as AuthStore).setAuthInfo
  );

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onMutate: () => {
      setCargando(true);
      setMensaje(""); // Limpiar mensaje
    },
    onSuccess: async (data) => {
      setMensaje("Iniciando sesión...");
      setToken(data.data);
      setTimeout(() => {
        setMensaje("");
        setCargando(false);
        router.push("/dashboard");
      }, 1000); // Espera 1 segundo mostrando el mensaje antes de redirigir
    },
    onError: () => {
      setMensaje(""); // Limpiar mensaje si hay error
      setCargando(false);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (dataForm) => {
    loginMutation.mutate(dataForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-linear-to-t from-[#101828] to-[#293844] p-10 rounded-xl shadow-md w-full max-w-sm flex flex-col items-center space-y-6">
        <Image src="/logo.png" alt="SisPET" width={120} height={120} />

        <form className="w-full space-y-4 " onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-white mb-1 ">Usuario</label>
            <input
              {...register("usuario", {
                required: "El usuario es obligatorio",
              })}
              type="text"
              className="w-full bg-white px-4 py-2 rounded-full outline-none text-gray-800"
              placeholder="Ingrese su usuario"
              disabled={cargando}
            />
            {errors.usuario && (
              <p className="text-red-500 text-sm mt-1 ">
                {errors.usuario.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Contraseña</label>
            <input
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              type="password"
              className="w-full px-4 bg-white py-2 rounded-full outline-none text-gray-800"
              placeholder="Ingrese su contraseña"
              disabled={cargando}
            />
            <span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </span>
          </div>

          {cargando ? (
            <button
              className="w-42 ml-16 mt-4 py-2 rounded-full bg-[#9C855F] text-white font-bold shadow-md transition"
              disabled
            >
              <Image
                src="/loading.svg"
                alt="Cargando"
                width={20}
                height={20}
                className="mx-auto"
              />
            </button>
          ) : (
            <button
              type="submit"
              className="w-42 ml-16 mt-4 py-2 rounded-full bg-[#9C855F] text-white font-bold shadow-md transition"
            >
              Iniciar Sesión
            </button>
          )}
          <br />
          {mensaje === "Iniciando sesión..." && (
            <div className="flex flex-col items-center justify-center mt-2">
              <Image
                src="/successLogin.gif"
                alt="Cargando"
                width={32}
                height={32}
                className="animate-bounce mb-2"
              />
              <span className="text-sm text-green-200 font-semibold animate-pulse">
                ✅Redirigiéndote al panel principal...
              </span>
            </div>
          )}
          <span className="text-red-400 text-sm flex justify-center ">
            {loginMutation.isError && "Usuario o contraseña incorrectos"}
          </span>
          <span className="text-white text-sm flex justify-center gap-1">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-[#9C855F] font-bold">
              Regístrate
            </a>
          </span>
        </form>
      </div>
    </div>
  );
}
