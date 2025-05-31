"use client";
import "./globals.css";

import "~lucide-static/font/Lucide.css";

export default function Example() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#2E8EC1" />
                <stop offset={1} stopColor="#8A7653" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              Mejora el control de tu Veterinaria con nuestro sistema de
              gestion.
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-gray-300">
              SisPet la mejor solucion para aquello que amas hacer.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="/login"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Iniciar Ahora
              </a>
              <a
                href="https://github.com/mauridevcde"
                className="text-sm/6 font-semibold text-white"
              >
                Leer Más <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              alt="App screenshot"
              src="https://static.vecteezy.com/system/resources/previews/006/470/429/non_2x/pet-shop-logo-design-template-modern-animal-icon-label-for-store-veterinary-clinic-hospital-shelter-business-services-flat-illustration-background-with-dog-cat-and-horse-free-vector.jpg"
              width={1824}
              height={1080}
              className="absolute  w-128 max-w-none rounded-md bg-orange-300/5 ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
