"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function CitasPage() {
  const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(getToday());
  const [currentMonth, setCurrentMonth] = useState(getToday());
  const [selectedDate, setSelectedDate] = useState(getToday());

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

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  useEffect(() => {
    obtenerCitas();
  }, []);

  useEffect(() => {
    const updateToday = () => {
      const newToday = getToday();

      setToday((prev) => {
        const changed =
          prev.getDate() !== newToday.getDate() ||
          prev.getMonth() !== newToday.getMonth() ||
          prev.getFullYear() !== newToday.getFullYear();

        if (changed) {
          setCurrentMonth(newToday);
          setSelectedDate(newToday);
          return newToday;
        }

        return prev;
      });
    };

    const interval = setInterval(updateToday, 60000);
    return () => clearInterval(interval);
  }, []);

  const obtenerCitas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/citas");
      const data = await res.json();

      if (data.ok) {
        setCitas(data.citas);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isPastDate = (date) => date < today;
  const isSunday = (date) => date.getDay() === 0;

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  const citasPorFecha = useMemo(() => {
    const grouped = {};

    citas.forEach((cita) => {
      if (!grouped[cita.fecha]) {
        grouped[cita.fecha] = [];
      }

      grouped[cita.fecha].push(cita);
    });

    return grouped;
  }, [citas]);

  const selectedDateKey = formatDateKey(selectedDate);
  const citasDelDia = citasPorFecha[selectedDateKey] || [];

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div className="bg-[#f4f7fa] p-6 rounded-2xl border border-black/5 text-center">
        <h1 className="text-2xl font-semibold text-[#1B3A5C]">
          Bienvenido al sistema
        </h1>
        <p className="text-gray-500 mt-1">
          Aquí puedes visualizar las citas agendadas por día.
        </p>
      </div>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-[#1B3A5C]">
            Calendario de citas
          </h2>
          <p className="text-gray-500 mt-1">
            Selecciona una fecha para ver el resumen de citas del día.
          </p>
        </div>

        <button
          onClick={obtenerCitas}
          className="px-5 py-3 rounded-xl bg-[#7AB5A0] text-white hover:bg-[#1B3A5C] transition-all shadow-sm"
        >
          Actualizar citas
        </button>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        {/* Calendario */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                  )
                )
              }
              className="w-11 h-11 rounded-full bg-[#f4f7fa] text-[#1B3A5C] hover:bg-[#7AB5A0] hover:text-white transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#1B3A5C]">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h2>
              <p className="text-sm text-gray-400">
                El día de hoy se marca en azul
              </p>
            </div>

            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                )
              }
              className="w-11 h-11 rounded-full bg-[#f4f7fa] text-[#1B3A5C] hover:bg-[#7AB5A0] hover:text-white transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-3 mb-4">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index} className="min-h-[90px]" />;
                }

                const dateKey = formatDateKey(date);
                const dayCitas = citasPorFecha[dateKey] || [];
                const selected = isSameDay(date, selectedDate);
                const currentDay = isSameDay(date, today);
                const disabled = isPastDate(date) || isSunday(date);

                return (
                  <button
                    key={index}
                    onClick={() => !disabled && setSelectedDate(date)}
                    disabled={disabled}
                    className={`min-h-[90px] rounded-2xl border p-3 text-left transition-all
                      ${
                        selected
                          ? "bg-[#7AB5A0] text-white border-[#7AB5A0] shadow-md"
                          : currentDay
                          ? "bg-[#1B3A5C] text-white border-[#1B3A5C] shadow-md"
                          : "bg-[#f4f7fa] text-[#1B3A5C] border-black/5"
                      }
                      ${
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-[#7AB5A0] hover:text-white"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{date.getDate()}</span>

                      {currentDay && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-white/20 text-white">
                          Hoy
                        </span>
                      )}
                    </div>

                    {isSunday(date) && (
                      <p className="text-xs mt-2 opacity-70">Cerrado</p>
                    )}

                    {dayCitas.length > 0 && (
                      <div className="mt-3">
                        <p
                          className={`text-xs font-medium ${
                            selected || currentDay
                              ? "text-white"
                              : "text-[#1B3A5C]"
                          }`}
                        >
                          {dayCitas.length} cita
                          {dayCitas.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen del día */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#1B3A5C] text-white flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1B3A5C]">
                  Resumen de citas
                </h2>
                <p className="text-sm text-gray-400">
                  {selectedDate.toLocaleDateString("es-GT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-[#1B3A5C]">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
            ) : citasDelDia.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#f4f7fa] flex items-center justify-center mb-4">
                  <CalendarDays className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-[#1B3A5C] font-medium">
                  No hay citas agendadas
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Selecciona otra fecha en el calendario.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {citasDelDia.map((cita) => (
                  <div
                    key={cita._id}
                    className="rounded-2xl border border-black/5 bg-[#f4f7fa] p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#1B3A5C] text-white flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#1B3A5C]">
                          {cita.nombre || cita.clientName || "Paciente"}
                          {cita.apellido || cita.clientLastName
                            ? ` ${cita.apellido || cita.clientLastName}`
                            : ""}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {cita.telefono || cita.clientPhone || "Sin teléfono"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#1B3A5C]">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {cita.hora || "Sin hora"}
                      </span>
                    </div>

                    {cita.servicio && (
                      <p className="mt-2 text-sm text-gray-500">
                        Servicio: {cita.servicio}
                      </p>
                    )}

                    {cita.estado && (
                      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[#7AB5A0]/20 text-[#1B3A5C] text-xs font-medium">
                        {cita.estado}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}