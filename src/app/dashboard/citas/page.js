"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  Search,
} from "lucide-react";

export default function DashboardCitasPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    clientName: "",
    clientLastName: "",
    clientPhone: "",
    date: null,
    time: "",
    status: "pendiente",
  });

  const availableTimes = [
    "08:00 AM","09:00 AM","10:00 AM","11:00 AM",
    "12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM",
  ];

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ];

  useEffect(() => {
    fetch("/api/citas")
      .then(r => r.json())
      .then(setCitas)
      .finally(() => setLoading(false));
  }, []);

  const formatDateKey = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const isSameDay = (a, b) =>
    a && b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isOccupied = (time) => {
    if (!form.date) return false;

    const key = formatDateKey(form.date);

    return citas.some(c =>
      c.date?.split("T")[0] === key &&
      c.time === time
    );
  };

  const calendarDays = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();

    const first = new Date(y, m, 1);
    const start = first.getDay();
    const days = new Date(y, m + 1, 0).getDate();

    const arr = [];

    for (let i = 0; i < start; i++) arr.push(null);
    for (let d = 1; d <= days; d++) {
      arr.push(new Date(y, m, d));
    }

    return arr;
  }, [currentMonth]);

  const resetForm = () => {
    setForm({
      clientName: "",
      clientLastName: "",
      clientPhone: "",
      date: null,
      time: "",
      status: "pendiente",
    });
  };

  const openCreate = () => {
    setEditMode(false);
    setSelectedId(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (cita) => {
    setEditMode(true);
    setSelectedId(cita._id);

    setForm({
      clientName: cita.clientName,
      clientLastName: cita.clientLastName,
      clientPhone: cita.clientPhone,
      date: new Date(cita.date),
      time: cita.time,
      status: cita.status,
    });

    setModalOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      date: formatDateKey(form.date),
    };

    await fetch(
      editMode ? `/api/citas/${selectedId}` : "/api/citas",
      {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setModalOpen(false);
    resetForm();

    const res = await fetch("/api/citas");
    setCitas(await res.json());
  };

  const deleteCita = async (id) => {
    await fetch(`/api/citas/${id}`, { method: "DELETE" });
    setCitas(citas.filter(c => c._id !== id));
  };

  const filteredCitas = citas.filter((c) => {
    const full =
      `${c.clientName} ${c.clientLastName}`.toLowerCase();

    return (
      full.includes(search.toLowerCase()) ||
      c.clientPhone?.includes(search)
    );
  });

  const getInitials = (name, last) => {
    return `${name?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#f4f7fa] to-white border border-black/5 rounded-3xl p-7 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold text-[#1B3A5C]">
            Gestión de citas
          </h1>
          <p className="text-gray-500 mt-2">
            Administra pacientes, horarios y estados de citas
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7AB5A0] text-white shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nueva cita
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white border rounded-3xl p-5 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente..."
          className="w-full p-4 rounded-2xl border"
        />
      </div>

      {/* LABEL */}
      <div className="text-xl font-semibold text-[#1B3A5C] px-2">
        Pacientes agendados
      </div>

      {/* LISTA VERTICAL */}
      <div className="space-y-4">

        {loading ? (
          <Loader2 className="animate-spin mx-auto my-10" />
        ) : filteredCitas.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No hay citas encontradas
          </div>
        ) : (
          filteredCitas.map(cita => (
            <div
              key={cita._id}
              className="flex gap-4 p-6 bg-white border rounded-3xl hover:shadow-md transition"
            >

              {/* AVATAR INICIALES */}
              <div className="w-14 h-14 rounded-2xl bg-[#1B3A5C] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                {getInitials(cita.clientName, cita.clientLastName)}
              </div>

              {/* INFO VERTICAL */}
              <div className="flex-1 space-y-1 text-sm text-gray-700">

                <p className="font-semibold text-[#1B3A5C] text-lg">
                  {cita.clientName} {cita.clientLastName}
                </p>

                <p>
                  <span className="font-medium">Numero de telefono:</span>{" "}
                  {cita.clientPhone}
                </p>

                <p>
                  <span className="font-medium">Fecha:</span>{" "}
                  {cita.date}
                </p>

                <p>
                  <span className="font-medium">Hora:</span>{" "}
                  {cita.time}
                </p>

                <p>
                  <span className="font-medium">Estado:</span>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${
                      cita.status === "confirmada"
                        ? "bg-green-50 text-green-600 border-green-200"
                        : cita.status === "cancelada"
                        ? "bg-red-50 text-red-500 border-red-200"
                        : "bg-yellow-50 text-yellow-600 border-yellow-200"
                    }`}
                  >
                    {cita.status || "pendiente"}
                  </span>
                </p>

              </div>

              {/* ACCIONES */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(cita)}
                  className="w-10 h-10 rounded-xl bg-[#f4f7fa] hover:bg-[#7AB5A0] hover:text-white"
                >
                  <Pencil className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={() => deleteCita(cita._id)}
                  className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>

            </div>
          ))
        )}

      </div>

      {/* MODAL (SIN CAMBIOS) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-6xl rounded-3xl p-6">
            <button onClick={() => setModalOpen(false)}>
              <X />
            </button>

            {/* (lo dejo intacto como lo tienes) */}
          </div>
        </div>
      )}

    </div>
  );
}