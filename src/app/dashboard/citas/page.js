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

  const today = new Date();
  const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

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
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paciente por nombre o teléfono..."
            className="w-full pl-12 p-4 rounded-2xl border focus:ring-2 focus:ring-[#7AB5A0]"
          />
        </div>
      </div>

      {/* LISTA (MEJORADA Y MÁS LEGIBLE) */}
      <div className="bg-white border rounded-3xl shadow-sm p-6 space-y-4">

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
              className="flex justify-between items-center p-5 rounded-2xl border hover:shadow-md transition bg-white"
            >

              {/* INFO (más limpio y legible) */}
              <div className="space-y-1">

                <p className="font-semibold text-[#1B3A5C] text-lg">
                  {cita.clientName} {cita.clientLastName}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  {cita.clientPhone}
                </div>

                <p className="text-xs text-gray-400">
                  📅 {cita.date} • 🕒 {cita.time}
                </p>

              </div>

              {/* ACCIONES */}
              <div className="flex gap-3">

                <button
                  onClick={() => openEdit(cita)}
                  className="w-11 h-11 rounded-xl bg-[#f4f7fa] hover:bg-[#7AB5A0] hover:text-white transition flex items-center justify-center"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteCita(cita._id)}
                  className="w-11 h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* MODAL (INTACTO) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">

            <div className="flex justify-between items-center px-7 py-5 border-b bg-gradient-to-r from-[#f4f7fa] to-white">

              <div>
                <h2 className="text-2xl font-semibold text-[#1B3A5C]">
                  {editMode ? "Editar cita" : "Nueva cita"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona fecha, hora y datos del paciente
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-red-100 flex items-center justify-center"
              >
                <X />
              </button>

            </div>

            <div className="grid lg:grid-cols-3">

              {/* CALENDARIO */}
              <div className="p-7 bg-[#f9fbfc] border-r">
                <div className="flex justify-between items-center mb-5">
                  <button onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                  }>
                    <ChevronLeft />
                  </button>

                  <h3 className="font-semibold text-[#1B3A5C]">
                    {monthNames[currentMonth.getMonth()]}
                  </h3>

                  <button onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                  }>
                    <ChevronRight />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} />;

                    const selected = form.date &&
                      isSameDay(d, form.date);

                    return (
                      <button
                        key={i}
                        onClick={() => setForm({ ...form, date: d })}
                        className={`h-12 rounded-xl border text-sm transition
                          ${selected
                            ? "bg-[#7AB5A0] text-white"
                            : "hover:bg-[#1B3A5C] hover:text-white"
                          }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HORARIOS */}
              <div className="p-7 border-r">
                <h3 className="font-semibold text-[#1B3A5C] mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horarios
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {availableTimes.map(time => (
                    <button
                      key={time}
                      disabled={isOccupied(time)}
                      onClick={() => setForm({ ...form, time })}
                      className={`p-3 rounded-xl border text-sm transition
                        ${form.time === time
                          ? "bg-[#1B3A5C] text-white"
                          : "hover:bg-[#7AB5A0] hover:text-white"
                        }
                        ${isOccupied(time) ? "opacity-30" : ""}
                      `}
                    >
                      {time}
                      {isOccupied(time) && (
                        <div className="text-[10px]">ocupado</div>
                      )}
                    </button>
                  ))}

                </div>
              </div>

              {/* FORM */}
              <div className="p-7 space-y-5">

                <h3 className="font-semibold text-[#1B3A5C] flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Datos del paciente
                </h3>

                <input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  value={form.clientLastName}
                  onChange={(e) => setForm({ ...form, clientLastName: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  value={form.clientPhone}
                  onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />

                <button
                  onClick={save}
                  className="w-full bg-[#7AB5A0] text-white py-3 rounded-2xl"
                >
                  {editMode ? "Actualizar cita" : "Crear cita"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}