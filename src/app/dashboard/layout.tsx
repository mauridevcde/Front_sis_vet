"use client";
import "../globals.css";

import {
  Home,
  Users,
  Folder,
  Calendar,
  FileText,
  PieChart,
  Settings,
  ChevronDown,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "../_store/authStore";
import { useState } from "react";

const navItems = [
  {
    name: "Inicio",
    icon: Home,
    icon2: ChevronDown,
    href: "/dashboard",
    btnDown: false,
  },
  {
    name: "Gestion Clientes",
    icon: Users,
    icon2: ChevronDown,
    href: "",
    btnDown: true,
    submenu: [{ name: "Clientes", href: "/dashboard/clientes" }],
  },
  {
    name: "Gestion Productos",
    icon: Folder,
    icon2: ChevronDown,
    href: "",
    btnDown: true,
    submenu: [
      { name: "Productos", href: "/dashboard/productos" },
      { name: "Proveedores", href: "/dashboard/proveedores" },
    ],
  },
  {
    name: "Gestion Mascotas",
    icon: Calendar,
    icon2: ChevronDown,
    href: "",
    btnDown: true,
    submenu: [
      { name: "Mascotas", href: "/dashboard/mascotas" },
      { name: "Categ. Mascotas", href: "/dashboard/categoriaMacotas" },
    ],
  },
  {
    name: "Gestion Clinica",
    icon: FileText,
    icon2: ChevronDown,
    href: "",
    btnDown: true,
    submenu: [
      { name: "Veterinarios", href: "/dashboard/veterinarios" },
      { name: "Cirugias", href: "/dashboard/cirugias" },
      { name: "Vacunas", href: "/dashboard/vacunas" },
      { name: "Consultas Clinicas", href: "/dashboard/consultasclinicas" },
      { name: "Registros Clinicos", href: "/dashboard/registrosclinicos" },
    ],
  },
  {
    name: "Gestion de Compras",
    icon: PieChart,
    icon2: ChevronDown,
    href: "",
    btnDown: true,
    submenu: [
      { name: "Realizar Compra", href: "/dashboard/compra" },
      { name: "Lista de Compras", href: "/dashboard/listacompras" },
    ],
  },
  {
    name: "Gestion de Ventas",
    icon: Settings,
    icon2: ChevronDown,
    href: "",
    btnDown: true,
    submenu: [
      { name: "Realizar Venta", href: "/dashboard/venta" },
      { name: "Lista de Ventas", href: "/dashboard/listaventas" },
    ],
  },
  {
    name: "Cerrar Sesión",
    icon: Settings,
    icon2: ChevronDown,
    href: "/logout",
    btnDown: false,
  },
];

interface AuthStore {
  nombre_apellido: string;
  id_usuario: number;
  id_rol: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { nombre_apellido, id_usuario, id_rol } = useAuthStore() as AuthStore;

  return (
    <div className="flex bg-white  w-full h-full   ">
      {/* Botón menú hamburguesa solo en móvil */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-900 text-white flex flex-col justify-between
          transition-transform duration-300 overflow-auto
          w-auto z-40 text-xs
          fixed top-0 left-0 h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:flex
        `}
      >
        <div>
          <div className="p-4 flex items-center text-xl font-bold">
            <span className="text-indigo-400">@</span>
            <span className="ml-2">Sis-Pet</span>
            {/* Botón cerrar menú en móvil */}
            <button
              className="md:hidden ml-auto"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-2 space-y-4">
            {navItems.map(({ name, icon: Icon, href, btnDown, submenu }) => (
              <div key={name}>
                {btnDown ? (
                  <button
                    type="button"
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-800 transition focus:outline-none cursor-pointer"
                    onClick={() => setOpenMenu(openMenu === name ? null : name)}
                  >
                    <Icon className="w-5 h-5 mr-4" />
                    {name}
                    <ChevronDown
                      className={`w-5 h-5 ml-auto transition-transform ${
                        openMenu === name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={href}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-800 transition focus:outline-none cursor-pointer"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-4" />
                    {name}
                  </Link>
                )}

                {/* Submenú */}
                {btnDown && openMenu === name && submenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {submenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded"
                        onClick={() => setSidebarOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="p-4">
          <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar el menú en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-2 bg-white w-auto  ml-0 transition-all duration-300">
        <header className="flex items-center justify-between px-6 py-4  bg-white shadow-md">
          <div className="w-1 px-3 py-2 bordertext-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
         
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {nombre_apellido || "Usuario Anónimo"}
              </span>
              <br />
              <span className="text-xs text-gray-500">
                ID: {id_usuario || "N/A"} - Rol: {id_rol || "N/A"}
              </span>
            </div>
          </div>
        </header>
        <div className="grid m-5 grid-cols-1 grid-rows-1 gap-4 justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
