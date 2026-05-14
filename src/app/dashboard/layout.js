"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    section: "Principal",
    items: [{ label: "Inicio", href: "/dashboard", icon: "grid" }],
  },
  {
    section: "Gestión",
    items: [
      { label: "Pacientes", href: "/dashboard/pacientes", icon: "users" },
      { label: "Citas", href: "/dashboard/citas", icon: "calendar" },
      { label: "Inventario", href: "/dashboard/inventario", icon: "box" },
      { label: "Reportes", href: "/dashboard/reportes", icon: "chart" },
    ],
  },
  {
    section: "Sistema",
    items: [
      {
        label: "Configuración",
        href: "/dashboard/configuracion",
        icon: "settings",
      },
    ],
  },
];

const icons = {
  grid: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  ),
  box: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.51 15.5 0 12 0 8.5 0 6 2.51 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-4c2 0 4 1.22 4 2.64 0 1.39-2 3.36-4 5-2-1.64-4-3.61-4-5C8 3.22 10 2 12 2zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  ),
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const today = new Date().toLocaleDateString("es-GT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen bg-[#f4f7fa] overflow-hidden">
      {/* Sidebar */}
      <aside
        className="w-[300px] flex-shrink-0 flex flex-col"
        style={{ background: "#1B3A5C" }}
      >
        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/10 flex items-center gap-4">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: "52px", height: "52px" }}
          >
            <img
              src="/Radient%20Blanco.png"
              alt="Logo Radient"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-white text-lg font-medium">Radient</p>
            <p className="text-white/40 text-sm">
              Todo comienza con una sonrisa
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {navItems.map((group) => (
            <div key={group.section}>
              <p className="text-xs text-white/35 uppercase tracking-widest px-2 mb-2">
                {group.section}
              </p>

              {group.items.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base mb-1 transition-all ${
                      active
                        ? "text-white"
                        : "text-white/60 hover:text-white/90 hover:bg-white/8"
                    }`}
                    style={active ? { background: "#7AB5A0" } : {}}
                  >
                    {icons[item.icon]}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-white/8 cursor-pointer transition-all">
            <div
              className="rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
              style={{
                background: "#7AB5A0",
                width: "44px",
                height: "44px",
              }}
            >
              KE
            </div>

            <div>
              <p className="text-white/85 text-base font-medium">
                Dra. Katya Espinoza
              </p>
              <p className="text-white/40 text-sm">Administradora</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-black/8 px-8 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-medium" style={{ color: "#1B3A5C" }}>
            Panel de control
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-base text-gray-400 capitalize">
              {today}
            </span>

            <button
              className="rounded-lg border border-black/8 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"
              style={{ width: "44px", height: "44px" }}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>

            <button
              className="rounded-lg border border-black/8 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"
              style={{ width: "44px", height: "44px" }}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}