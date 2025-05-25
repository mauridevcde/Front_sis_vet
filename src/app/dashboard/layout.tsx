'use client';
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
  { name: "Logout", icon: Settings, href: "/logout" },
];

const teamItems = [
  { name: "Heroicons", initial: "H" },
  { name: "Tailwind Labs", initial: "T" },
  { name: "Workcation", initial: "W" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <div className="mt-6 px-4 text-sm text-gray-400">Your teams</div>
            <div className="mt-2 space-y-1 px-4">
              {teamItems.map(({ name, initial }) => (
                <div key={name} className="flex items-center space-x-3 py-1">
                  <div className="w-6 h-6 bg-gray-700 text-center rounded-full text-xs flex items-center justify-center">
                    {initial}
                  </div>
                  <span className="text-sm text-white">{name}</span>
                </div>
              ))}
            </div>
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
            <input
              type="text"
              placeholder="Search"
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405M19 13V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v7m4 4h-4m0 0H5l1.405-1.405"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <Image
                  src="/avatar.jpg"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  Tom Cook
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
