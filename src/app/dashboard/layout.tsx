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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "../_store/authStore";

// interface LayoutProps {
//   children: ReactNode;
// }

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Team", icon: Users, href: "/dashboard/team" },
  { name: "Projects", icon: Folder, href: "/projects" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Reports", icon: PieChart, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Cerrar Sesión", icon: Settings, href: "/logout" },
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
  // recuperar datos del store de autenticación
  const { nombre_apellido, id_usuario, id_rol } = useAuthStore() as AuthStore;

  return (
    <div className="bg-gray-100">
      <div className="flex min-h-screen font-sans">
        <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
          <div>
            <div className="p-4 flex items-center text-lg font-bold">
              <span className="text-indigo-400">~</span>
              <span className="ml-2">Dashboard</span>
            </div>
            <nav className="mt-4 space-y-1">
              {navItems.map(({ name, icon: Icon, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="flex items-center px-4 py-2 hover:bg-gray-800 transition"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {name}
                </Link>
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

        <main className="flex-1 bg-white">
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <div className="w-1 px-3 py-2 bordertext-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <h1 className="text-xl font-semibold text-gray-800">
              Bienvenido al Dashboard
            </h1>
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
          <div className="p-6 min-h-[calc(100vh-4rem)] bg-gray-50 border-dashed border-2 border-gray-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
