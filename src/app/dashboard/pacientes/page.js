"use client";

import { useEffect, useMemo, useState } from "react";
import {
  UserRound,
  Search,
  Phone,
  CalendarDays,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  FileText,
  X,
  Stethoscope,
  History,
} from "lucide-react";

function CardResumen({ titulo, valor, subtitulo, icono }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{titulo}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#1B3A5C]">
            {valor}
          </h2>

          {subtitulo && (
            <p className="mt-1 text-xs font-medium text-gray-400">
              {subtitulo}
            </p>
          )}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
          {icono}
        </div>
      </div>
    </div>
  );
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [resumen, setResumen] = useState({
    totalPacientes: 0,
    pacientesConCitas: 0,
    totalCitasRegistradas: 0,
    totalCitasAtendidas: 0,
    totalCitasPendientes: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/pacientes?search=${encodeURIComponent(search)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudieron cargar los pacientes");
      }

      setPacientes(data.pacientes || []);

      setResumen(
        data.resumen || {
          totalPacientes: 0,
          pacientesConCitas: 0,
          totalCitasRegistradas: 0,
          totalCitasAtendidas: 0,
          totalCitasPendientes: 0,
        }
      );
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const pacientesFiltrados = useMemo(() => {
    return pacientes;
  }, [pacientes]);

  const buscarPacientes = (e) => {
    e.preventDefault();
    cargarPacientes();
  };

  const abrirDetallePaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
  };

  const cerrarDetallePaciente = () => {
    setPacienteSeleccionado(null);
  };

  return (
    <div className="min-h-screen space-y-8 pb-10">
      {/* HEADER */}

      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-24 -translate-y-28 rounded-full bg-[#7AB5A0]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-16 translate-y-16 rounded-full bg-[#1B3A5C]/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7AB5A0]/15 px-4 py-2 text-sm font-semibold text-[#1B3A5C]">
              <Stethoscope className="h-4 w-4 text-[#7AB5A0]" />
              Seguimiento clínico de pacientes
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-[#1B3A5C] sm:text-4xl">
              Pacientes
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Consulta automáticamente el historial de cada paciente según las
              citas registradas en el sistema. El sistema compara nombre,
              apellido y teléfono para agrupar cada historial.
            </p>
          </div>

          <form
            onSubmit={buscarPacientes}
            className="w-full rounded-3xl bg-[#f4f7fa] p-4 lg:w-[390px]"
          >
            <label className="mb-2 block text-xs font-semibold text-[#1B3A5C]">
              Buscar paciente
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 shrink-0 text-[#1B3A5C]" />

              <input
                type="text"
                placeholder="Nombre, apellido o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1B3A5C] outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7AB5A0] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1B3A5C] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Buscar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* CARDS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <CardResumen
          titulo="Pacientes registrados"
          valor={resumen.totalPacientes}
          subtitulo="Agrupados desde citas"
          icono={<UserRound className="h-7 w-7" />}
        />

        <CardResumen
          titulo="Pacientes con citas"
          valor={resumen.pacientesConCitas}
          subtitulo="Con historial registrado"
          icono={<CalendarDays className="h-7 w-7" />}
        />

        <CardResumen
          titulo="Citas registradas"
          valor={resumen.totalCitasRegistradas}
          subtitulo="Historial acumulado"
          icono={<ClipboardList className="h-7 w-7" />}
        />

        <CardResumen
          titulo="Citas atendidas"
          valor={resumen.totalCitasAtendidas}
          subtitulo="Atenciones completadas"
          icono={<CheckCircle className="h-7 w-7" />}
        />
      </div>

      {/* TABLA */}

      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#1B3A5C]" />
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="py-20 text-center">
            <UserRound className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h3 className="text-xl font-semibold text-[#1B3A5C]">
              No hay pacientes registrados
            </h3>

            <p className="mt-2 text-gray-400">
              Cuando existan citas con nombre, apellido y teléfono, los
              pacientes aparecerán automáticamente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-black/5 bg-[#f4f7fa]">
                <tr>
                  <th className="px-6 py-4 text-left text-[#1B3A5C]">
                    Paciente
                  </th>
                  <th className="px-6 py-4 text-left text-[#1B3A5C]">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-[#1B3A5C]">
                    Total citas
                  </th>
                  <th className="px-6 py-4 text-left text-[#1B3A5C]">
                    Atendidas
                  </th>
                  <th className="px-6 py-4 text-left text-[#1B3A5C]">
                    Pendientes
                  </th>
                  <th className="px-6 py-4 text-left text-[#1B3A5C]">
                    Última cita
                  </th>
                  <th className="px-6 py-4 text-center text-[#1B3A5C]">
                    Historial
                  </th>
                </tr>
              </thead>

              <tbody>
                {pacientesFiltrados.map((paciente) => (
                  <tr
                    key={paciente._id}
                    className="border-b border-black/5 transition-all hover:bg-[#f9fbfc]"
                  >
                    <td className="px-6 py-5">
                      <h3 className="font-semibold text-[#1B3A5C]">
                        {paciente.nombreCompleto}
                      </h3>

                      <p className="text-sm text-gray-400">
                        Historial generado desde citas
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[#1B3A5C]">
                        <Phone className="h-4 w-4 text-[#7AB5A0]" />
                        {paciente.clientPhone}
                      </div>
                    </td>

                    <td className="px-6 py-5 font-semibold text-[#1B3A5C]">
                      {paciente.totalCitas}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-sm font-semibold text-[#1B3A5C]">
                        {paciente.citasAtendidas}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[#f4f7fa] px-3 py-1 text-sm font-semibold text-[#1B3A5C]">
                        {paciente.citasPendientes}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-500">
                      {paciente.ultimaCita}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => abrirDetallePaciente(paciente)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#1B3A5C] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#7AB5A0]"
                        >
                          <FileText className="h-4 w-4" />
                          Ver historial
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL HISTORIAL */}

      {pacienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-3 backdrop-blur-sm">
          <div className="flex max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl">
            <div className="relative shrink-0 border-b border-black/5 bg-[#f4f7fa] px-5 py-4">
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-12 rounded-full bg-[#7AB5A0]/20 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-xs font-semibold text-[#1B3A5C]">
                    Historial clínico
                  </span>

                  <h2 className="mt-2 text-xl font-semibold text-[#1B3A5C]">
                    {pacienteSeleccionado.nombreCompleto}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    {pacienteSeleccionado.clientPhone}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cerrarDetallePaciente}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1B3A5C] shadow-sm transition-all hover:bg-red-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {pacienteSeleccionado.historialClinico.length === 0 ? (
                <div className="py-16 text-center">
                  <CalendarDays className="mx-auto mb-4 h-14 w-14 text-gray-300" />

                  <h3 className="text-lg font-semibold text-[#1B3A5C]">
                    Sin historial de citas
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    Este paciente todavía no tiene citas registradas.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pacienteSeleccionado.historialClinico.map((item, index) => {
                    const estado = String(item.status || "").toLowerCase();

                    const colorEstado = estado.includes("atendida")
                      ? "bg-[#7AB5A0]/15 text-[#1B3A5C]"
                      : estado.includes("cancelada")
                      ? "bg-red-50 text-red-500"
                      : estado.includes("confirmada")
                      ? "bg-[#f4f7fa] text-[#1B3A5C]"
                      : "bg-[#f4f7fa] text-[#1B3A5C]";

                    const IconoEstado = estado.includes("atendida")
                      ? CheckCircle
                      : estado.includes("cancelada")
                      ? XCircle
                      : estado.includes("confirmada")
                      ? History
                      : Clock;

                    return (
                      <div
                        key={`${item.citaId}-${index}`}
                        className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <CalendarDays className="h-5 w-5 text-[#7AB5A0]" />

                              <h3 className="font-semibold text-[#1B3A5C]">
                                {item.dateFormatted} - {item.time}
                              </h3>
                            </div>

                            <p className="text-sm text-gray-400">
                              Motivo de consulta
                            </p>

                            <p className="mt-1 text-sm font-medium text-[#1B3A5C]">
                              {item.motivo}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold capitalize ${colorEstado}`}
                          >
                            <IconoEstado className="h-4 w-4" />
                            {item.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}