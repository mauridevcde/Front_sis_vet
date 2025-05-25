"use client";

import "../globals.css";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";

type Inputs = {
  usuario: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Aquí puedes manejar el envío del formulario
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-linear-to-t from-[#101828] to-[#293844] p-10 rounded-xl shadow-md w-full max-w-sm flex flex-col items-center space-y-6">
        <Image
          src="/logo.png"
          alt="SisPET"
          width={120}
          height={120}
        />

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
