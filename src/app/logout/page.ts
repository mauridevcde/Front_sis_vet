"use client";
import { redirect } from "next/navigation";

export default function Page() {
  // Obtener la función de logout del store de autenticación

  // const logOut = useAuthStore((state) => state.setLogout);
  //eliminar el token del localStorage
  localStorage.removeItem("auth");
  // Llamar a la función de logout
  //eliminar una coockies
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //eliminar el token del localStorage
  localStorage.removeItem("auth");

  // Redirigir al usuario a la página de inicio o login
  redirect("/");
}
