"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verified, setVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSearchUser = async (e) => {
    e.preventDefault();

    setError("");
    setQuestions([]);

    try {
      const res = await fetch("/api/security-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
      setError("Error del servidor");
    }
  };

  const handleAnswerChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleVerifyAnswers = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          answers,
          newPassword: "__temporary__",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setVerified(true);
    } catch (err) {
      console.error(err);
      setError("Error del servidor");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          answers,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Contraseña actualizada correctamente");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Error del servidor");
    }
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

        {!questions.length ? (
          <p className="text-white/60 text-sm mb-8">
            Ingresa tu usuario para continuar.
          </p>
        ) : !verified ? (
          <p className="text-white/60 text-sm mb-8">
            Por favor, responde las siguientes preguntas para verificar tu identidad.
          </p>
        ) : (
          <p className="text-white/60 text-sm mb-8">
            Ingresa tu nueva contraseña.
          </p>
        )}

        {!questions.length ? (
          <form onSubmit={handleSearchUser} className="space-y-5">
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Usuario
              </label>

              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </div>

            {error && (
              <p className="text-red-300 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ background: "#7AB5A0" }}
            >
              Continuar
            </button>
          </form>
        ) : !verified ? (
          <form onSubmit={handleVerifyAnswers} className="space-y-5">
            {questions.map((question, index) => (
              <div
                key={index}
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <p className="text-white text-sm mb-3">
                  {question}
                </p>

                <input
                  type="text"
                  required
                  placeholder="Tu respuesta"
                  value={answers[question] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question, e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              </div>
            ))}

            {error && (
              <p className="text-red-300 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ background: "#7AB5A0" }}
            >
              Verificar respuestas
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Nueva contraseña
              </label>

              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </div>

            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Confirmar contraseña
              </label>

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </div>

            {error && (
              <p className="text-red-300 text-sm">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-300 text-sm">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ background: "#7AB5A0" }}
            >
              Cambiar contraseña
            </button>
          </form>
        )}

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