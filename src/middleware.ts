// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("access_token")?.value;

  if (!jwt || jwt === "undefined") {
    // Si no hay token, redirigir a la página de inicio de sesión
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Si hay token, verificarlo
  try {
    await jwtVerify(jwt, new TextEncoder().encode(process.env.SecretJWT));
    return NextResponse.next();
  } catch {
    // Si el token no es válido, redirigir a la página de inicio de sesión
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si no es una ruta protegida, continuar con la solicitud
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
