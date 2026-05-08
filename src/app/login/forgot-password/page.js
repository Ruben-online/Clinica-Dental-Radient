"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Si el correo existe en el sistema, recibirás instrucciones para recuperar tu contraseña."
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
        className="relative z-10 w-full max-w-md rounded-2xl p-10"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
        }}
      >
        <h2 className="text-white text-2xl font-medium mb-2">
          Recuperar contraseña
        </h2>

        <p className="text-white/60 text-sm mb-8">
          Ingresa tu correo electrónico y te enviaremos instrucciones.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/80 text-sm block mb-1.5">
              Correo electrónico
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ background: "#7AB5A0" }}
          >
            Enviar instrucciones
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm hover:opacity-80"
            style={{ color: "#7AB5A0" }}
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}