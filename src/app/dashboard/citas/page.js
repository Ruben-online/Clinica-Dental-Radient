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
    motivo: "",
    date: null,
    time: "",
    status: "pendiente",
  });

  const availableTimes = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  useEffect(() => {
    fetch("/api/citas")
      .then((r) => r.json())
      .then(setCitas)
      .finally(() => setLoading(false));
  }, []);

  const formatDateKey = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isSunday = (date) => {
    return date.getDay() === 0;
  };

  const isPastTime = (time) => {
    if (!form.date) return false;

    const today = new Date();

    const selectedDate = new Date(form.date);

    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    if (!isToday) return false;

    const convertTo24 = (hour) => {
      const [timePart, modifier] = hour.split(" ");
      let [hours, minutes] = timePart.split(":");

      hours = parseInt(hours);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return {
        hours,
        minutes: parseInt(minutes),
      };
    };

    const selected = convertTo24(time);

    const nowHours = today.getHours();
    const nowMinutes = today.getMinutes();

    if (selected.hours < nowHours) return true;

    if (
      selected.hours === nowHours &&
      selected.minutes <= nowMinutes
    ) {
      return true;
    }

    return false;
  };

  const isOccupied = (time) => {
    if (!form.date) return false;

    const key = formatDateKey(form.date);

    return citas.some((c) => {
      const sameDate = c.date?.split("T")[0] === key;
      const sameTime = c.time === time;

      if (editMode && c._id === selectedId) {
        return false;
      }

      return sameDate && sameTime;
    });
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
      motivo: "",
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
      motivo: cita.motivo || "",
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

    const response = await fetch(
      editMode ? `/api/citas/${selectedId}` : "/api/citas",
      {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Ocurrió un error");
      return;
    }

    setModalOpen(false);
    resetForm();

    const res = await fetch("/api/citas");
    setCitas(await res.json());
  };

  const deleteCita = async (id) => {
    const confirmDelete = confirm(
      "¿Seguro que deseas eliminar esta cita?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/citas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("No se pudo eliminar la cita");
      return;
    }

    setCitas(citas.filter((c) => c._id !== id));
  };

  const filteredCitas = citas.filter((c) => {
    const full =
      `${c.clientName} ${c.clientLastName}`.toLowerCase();

    return (
      full.includes(search.toLowerCase()) ||
      c.clientPhone?.includes(search)
    );
  });

  const getInitials = (name, last) =>
    `${name?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-10">
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
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7AB5A0] text-white"
        >
          <Plus className="w-5 h-5" />
          Nueva cita
        </button>
      </div>

      <div className="bg-white border rounded-3xl p-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente..."
          className="w-full p-4 rounded-2xl border"
        />
      </div>

      <div className="text-xl font-semibold text-[#1B3A5C] px-2">
        Pacientes agendados
      </div>

      <div className="space-y-4">
        {loading ? (
          <Loader2 className="animate-spin mx-auto my-10" />
        ) : filteredCitas.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No hay citas encontradas
          </div>
        ) : (
          filteredCitas.map((cita) => (
            <div
              key={cita._id}
              className="flex gap-4 p-6 bg-white border rounded-3xl hover:shadow-md transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1B3A5C] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                {getInitials(
                  cita.clientName,
                  cita.clientLastName
                )}
              </div>

              <div className="flex-1 text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-[#1B3A5C] text-lg">
                  {cita.clientName} {cita.clientLastName}
                </p>

                <p>
                  <span className="font-medium">
                    Numero de telefono:
                  </span>{" "}
                  {cita.clientPhone}
                </p>

                <p>
                  <span className="font-medium">Motivo:</span>{" "}
                  {cita.motivo || "No especificado"}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-7 py-5 border-b bg-gradient-to-r from-[#f4f7fa] to-white">
              <div>
                <h2 className="text-2xl font-semibold text-[#1B3A5C]">
                  {editMode ? "Editar cita" : "Nueva cita"}
                </h2>
              </div>

              <button onClick={() => setModalOpen(false)}>
                <X />
              </button>
            </div>

            <div className="grid lg:grid-cols-3">
              <div className="p-7 bg-[#f9fbfc] border-r">
                <div className="flex justify-between items-center mb-5">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1
                        )
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>

                  <h3 className="font-semibold text-[#1B3A5C] text-lg">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h3>

                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1
                        )
                      )
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className="text-center text-sm font-semibold text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} />;

                    const selected =
                      form.date && isSameDay(d, form.date);

                    const sunday = isSunday(d);

                    return (
                      <button
                        key={i}
                        disabled={sunday}
                        onClick={() =>
                          setForm({
                            ...form,
                            date: d,
                          })
                        }
                        className={`h-12 rounded-xl border text-sm transition ${
                          sunday
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selected
                            ? "bg-[#7AB5A0] text-white border-[#7AB5A0]"
                            : "hover:bg-[#eef6f3]"
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 border-r">
                <h3 className="font-semibold text-[#1B3A5C] mb-4">
                  Horarios
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {availableTimes.map((time) => {
                    const occupied = isOccupied(time);
                    const selected = form.time === time;
                    const pastTime = isPastTime(time);

                    return (
                      <button
                        key={time}
                        disabled={occupied || pastTime}
                        onClick={() =>
                          setForm({
                            ...form,
                            time,
                          })
                        }
                        className={`p-3 border rounded-xl transition ${
                          occupied || pastTime
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selected
                            ? "bg-[#7AB5A0] text-white border-[#7AB5A0]"
                            : "hover:bg-[#eef6f3]"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 space-y-5">
                <h3 className="font-semibold text-[#1B3A5C]">
                  Datos del paciente
                </h3>

                <input
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientName: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Nombre"
                />

                <input
                  value={form.clientLastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientLastName: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Apellido"
                />

                <input
                  value={form.clientPhone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientPhone: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Teléfono"
                />

                <input
                  value={form.motivo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      motivo: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Motivo de la cita"
                />

                <button
                  onClick={save}
                  className="w-full bg-[#7AB5A0] text-white py-3 rounded-2xl"
                >
                  {editMode
                    ? "Actualizar cita"
                    : "Crear cita"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}