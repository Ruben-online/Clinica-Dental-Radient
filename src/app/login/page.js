"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen flex">
      
      {/* LADO IZQUIERDO */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Clínica Dental
          </h1>

          <p className="text-lg text-blue-100">
            Plataforma de gestión clínica para el control de pacientes,
            citas e inventario en un solo lugar.
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">

        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm">
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Iniciar sesión
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            Ingresa tus credenciales para acceder
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div>
              <label className="text-sm text-gray-600">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Contraseña
              </label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Iniciar sesión
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}