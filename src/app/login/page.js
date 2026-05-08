"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/local.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(27, 58, 92, 0.55)" }}
      />

      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-10"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#7AB5A0" }}
          >
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2.1.8 3.8 1.5 5.2.7 1.3 1 2.8 1 4.3 0 1.4.4 3 1.5 4 .4.4.9.5 1.3.3.6-.3.7-1 .7-1.8 0-.7.5-1.4 1-1.4s1 .7 1 1.4c0 .8.1 1.5.7 1.8.4.2.9.1 1.3-.3 1.1-1 1.5-2.6 1.5-4 0-1.5.3-3 1-4.3C18.2 11.3 19 9.6 19 7.5 19 4.5 16.5 2 12 2z" />
            </svg>
          </div>

          <div>
            <p className="text-white text-lg font-medium">Radient</p>
            <p className="text-white/60 text-sm">
              Todo comienza con una sonrisa
            </p>
          </div>
        </div>

        <h2 className="text-white text-2xl font-medium mb-1">
          Iniciar sesión
        </h2>

        <p className="text-white/60 text-sm mb-8">
          Ingresa tus credenciales para acceder
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white/80 text-sm block mb-1.5">
              Correo electrónico
            </label>

            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none transition"
              placeholder="correo@ejemplo.com"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          </div>

          <div>
            <label className="text-white/80 text-sm block mb-1.5">
              Contraseña
            </label>

            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none transition"
              placeholder="••••••••"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/login/forgot-password"
              className="text-sm transition hover:opacity-80"
              style={{ color: "#7AB5A0" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ background: "#7AB5A0" }}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}