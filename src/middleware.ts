import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("access_token")?.value;

  // Si el usuario intenta acceder a /login y ya tiene token válido, redirige a /
  if (request.nextUrl.pathname === "/login" && jwt && jwt !== "undefined") {
    try {
      await jwtVerify(jwt, new TextEncoder().encode(process.env.SecretJWT));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      // Si el token no es válido, deja pasar al login (no redirige)
    }
  }

  // Lógica actual para proteger el dashboard
  if (
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    if (!jwt || jwt === "undefined") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(jwt, new TextEncoder().encode(process.env.SecretJWT));
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Para otras rutas, continuar normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/login"],
};