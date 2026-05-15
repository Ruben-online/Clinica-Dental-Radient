"use client";

import { useEffect, useState } from "react";

export default function ConfiguracionPage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPasswordFlow, setShowPasswordFlow] = useState(false);

  useEffect(() => {
    loadUser();
    loadUsers();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      setUser(data);
      setPreview(data.avatar || "");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/user/all");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadAvatar = async () => {
    if (!file || !user) return;

    setSaving(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user._id);

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        await loadUser();
        setFile(null);
        setPreview(data.avatar);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;

    await fetch(`/api/user/${id}`, {
      method: "DELETE",
    });

    loadUsers();
  };

  const openPasswordFlow = () => {
    setShowPasswordFlow(true);

    // 👉 aquí luego conectas tu sistema real de preguntas de seguridad
    // ejemplo:
    // await fetch("/api/security-question/start")
  };

  if (loading) {
    return <p className="p-10">Cargando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#1B3A5C]">
          Configuración
        </h1>

        <p className="text-gray-500">
          Usuario activo: <b>{user?.username}</b>
        </p>
      </div>

      {/* PERFIL */}
      <div className="bg-white border rounded-2xl p-6 space-y-6">

        <h2 className="text-xl font-semibold text-[#1B3A5C]">
          Perfil
        </h2>

        {/* AVATAR */}
        <div className="flex items-center gap-6">

          <img
            src={preview || "/Radient.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />

          {/* INPUT OCULTO */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label
            htmlFor="fileInput"
            className="px-4 py-2 bg-gray-200 rounded-xl cursor-pointer"
          >
            Seleccionar foto
          </label>
        </div>

        {/* BOTONES HORIZONTALES */}
        <div className="flex gap-3 pt-4">

          <button
            onClick={uploadAvatar}
            disabled={!file || saving}
            className="flex-1 px-4 py-2 bg-[#7AB5A0] text-white rounded-xl"
          >
            Cambiar foto
          </button>

          <button
            onClick={openPasswordFlow}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl"
          >
            Cambiar contraseña
          </button>

          <button
            className="flex-1 px-4 py-2 bg-[#1B3A5C] text-white rounded-xl"
          >
            Editar usuario
          </button>

        </div>
      </div>

      {/* GESTIÓN DE USUARIOS */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">

        <h2 className="text-xl font-semibold text-[#1B3A5C]">
          Usuarios
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-400">No hay usuarios registrados</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center border p-3 rounded-xl"
            >
              <div>
                <p className="font-semibold">{u.username}</p>
                <p className="text-xs text-gray-500">admin</p>
              </div>

              <button
                onClick={() => deleteUser(u._id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL PASSWORD FLOW */}
      {showPasswordFlow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[420px] space-y-4">

            <h3 className="text-lg font-semibold">
              Verificación de seguridad
            </h3>

            <p className="text-sm text-gray-500">
              Pendiente: Conectar sistema de verificación mediante preguntas (ya hecho en login)
            </p>

            <button
              onClick={() => setShowPasswordFlow(false)}
              className="w-full bg-gray-200 py-2 rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}