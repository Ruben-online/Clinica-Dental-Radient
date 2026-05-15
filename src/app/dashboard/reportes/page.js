"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  ClipboardList,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Loader2,
  Boxes,
  TrendingUp,
  Wallet,
  HandCoins,
  UsersRound,
  Phone,
} from "lucide-react";

function formatoInputFecha(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function obtenerSemanaActual() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diferenciaLunes = dia === 0 ? -6 : 1 - dia;

  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diferenciaLunes);

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);

  return {
    inicio: formatoInputFecha(lunes),
    fin: formatoInputFecha(domingo),
  };
}

function formatearMoneda(valor) {
  const numero = Number(valor || 0);
  return `Q ${numero.toFixed(2)}`;
}

function CardReporte({ titulo, valor, subtitulo, icono, alerta = false }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{titulo}</p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              alerta ? "text-red-500" : "text-[#1B3A5C]"
            }`}
          >
            {valor}
          </h2>

          {subtitulo && (
            <p className="mt-1 text-xs font-medium text-gray-400">
              {subtitulo}
            </p>
          )}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            alerta ? "bg-red-50 text-red-500" : "bg-[#1B3A5C] text-white"
          }`}
        >
          {icono}
        </div>
      </div>
    </div>
  );
}

export default function ReportesPage() {
  const semana = obtenerSemanaActual();

  const [inicio, setInicio] = useState(semana.inicio);
  const [fin, setFin] = useState(semana.fin);
  const [loading, setLoading] = useState(true);
  const [loadingEconomico, setLoadingEconomico] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [reporteEconomico, setReporteEconomico] = useState(null);
  const [error, setError] = useState("");

  const cargarReporteEconomico = async () => {
    try {
      setLoadingEconomico(true);

      const response = await fetch(
        `/api/reportes/economico?desde=${inicio}&hasta=${fin}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo cargar el reporte económico");
      }

      setReporteEconomico(data);
    } catch (error) {
      console.error(error);
      setReporteEconomico(null);
    } finally {
      setLoadingEconomico(false);
    }
  };

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/reportes/semanal?inicio=${inicio}&fin=${fin}`
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo generar el reporte semanal");
      }

      setReporte(data);

      await cargarReporteEconomico();
    } catch (error) {
      console.error(error);
      setReporte(null);
      setReporteEconomico(null);
      setError(error.message || "Error al cargar el reporte semanal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  return (
    <div className="min-h-screen space-y-8 pb-10">
      {/* HEADER */}

      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-24 -translate-y-28 rounded-full bg-[#7AB5A0]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-16 translate-y-16 rounded-full bg-[#1B3A5C]/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7AB5A0]/15 px-4 py-2 text-sm font-semibold text-[#1B3A5C]">
              <FileText className="h-4 w-4 text-[#7AB5A0]" />
              Control semanal de clínica dental
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-[#1B3A5C] sm:text-4xl">
              Reportes semanales
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Consulta el comportamiento semanal de citas, pacientes atendidos,
              insumos clínicos, productos agotados y alertas importantes para la
              administración de la clínica.
            </p>
          </div>

          {/* FILTROS */}

          <div className="w-full rounded-3xl bg-[#f4f7fa] p-4 xl:w-auto xl:min-w-[460px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#1B3A5C]">
                  Desde
                </label>

                <input
                  type="date"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  className="w-full rounded-xl border border-black/5 bg-white px-4 py-2.5 text-sm text-[#1B3A5C] outline-none focus:border-[#7AB5A0] focus:ring-4 focus:ring-[#7AB5A0]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#1B3A5C]">
                  Hasta
                </label>

                <input
                  type="date"
                  value={fin}
                  onChange={(e) => setFin(e.target.value)}
                  className="w-full rounded-xl border border-black/5 bg-white px-4 py-2.5 text-sm text-[#1B3A5C] outline-none focus:border-[#7AB5A0] focus:ring-4 focus:ring-[#7AB5A0]/20"
                />
              </div>
            </div>

            <div className="mt-4 flex w-full justify-center">
              <button
                type="button"
                onClick={cargarReporte}
                disabled={loading || loadingEconomico}
                className="flex w-full max-w-[280px] items-center justify-center gap-2 rounded-xl bg-[#7AB5A0] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1B3A5C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading || loadingEconomico ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-5 w-5" />
                    Actualizar reporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="flex items-center justify-center rounded-3xl border border-black/5 bg-white py-20 shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1B3A5C]" />

            <p className="mt-3 text-sm font-medium text-gray-400">
              Generando reporte semanal...
            </p>
          </div>
        </div>
      )}

      {!loading && reporte && (
        <>
          {/* RESUMEN PRINCIPAL */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <CardReporte
              titulo="Citas de la semana"
              valor={reporte.resumen.totalCitas}
              subtitulo="Total de citas registradas"
              icono={<CalendarDays className="h-7 w-7" />}
            />

            <CardReporte
              titulo="Citas atendidas"
              valor={reporte.resumen.citasAtendidas}
              subtitulo="Pacientes atendidos"
              icono={<CheckCircle className="h-7 w-7" />}
            />

            <CardReporte
              titulo="Citas canceladas"
              valor={reporte.resumen.citasCanceladas}
              subtitulo="Cancelaciones registradas"
              alerta={reporte.resumen.citasCanceladas > 0}
              icono={<XCircle className="h-7 w-7" />}
            />

            <CardReporte
              titulo="Horario más ocupado"
              valor={reporte.resumen.horarioMasOcupado}
              subtitulo={`Día con más citas: ${reporte.resumen.diaMasOcupado}`}
              icono={<Clock className="h-7 w-7" />}
            />
          </div>

          {/* RESUMEN INVENTARIO */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <CardReporte
              titulo="Insumos registrados"
              valor={reporte.resumen.totalInsumos}
              subtitulo="Total dentro del inventario"
              icono={<Boxes className="h-7 w-7" />}
            />

            <CardReporte
              titulo="Existencia baja"
              valor={reporte.resumen.insumosBajos}
              subtitulo="Requieren revisión"
              alerta={reporte.resumen.insumosBajos > 0}
              icono={<AlertTriangle className="h-7 w-7" />}
            />

            <CardReporte
              titulo="Sin existencia"
              valor={reporte.resumen.insumosAgotados}
              subtitulo="Compra urgente"
              alerta={reporte.resumen.insumosAgotados > 0}
              icono={<Package className="h-7 w-7" />}
            />

            <CardReporte
              titulo="Próximos a vencer"
              valor={reporte.resumen.proximosAVencer}
              subtitulo="Vencen en 30 días"
              alerta={reporte.resumen.proximosAVencer > 0}
              icono={<TrendingUp className="h-7 w-7" />}
            />
          </div>

          {/* REPORTE ECONÓMICO */}

          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
                <Wallet className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#1B3A5C]">
                  Reporte económico
                </h2>

                <p className="text-sm text-gray-400">
                  Ingresos previstos, recibidos y pendientes del rango
                  seleccionado
                </p>
              </div>
            </div>

            {!reporteEconomico ? (
              <p className="rounded-2xl bg-[#f4f7fa] px-4 py-4 text-sm font-semibold text-[#1B3A5C]">
                No se pudo cargar el reporte económico.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <CardReporte
                    titulo="Dinero previsto"
                    valor={formatearMoneda(
                      reporteEconomico.resumenEconomico?.dineroPrevisto
                    )}
                    subtitulo="Suma de montos asignados a citas atendidas"
                    icono={<TrendingUp className="h-7 w-7" />}
                  />

                  <CardReporte
                    titulo="Dinero recibido"
                    valor={formatearMoneda(
                      reporteEconomico.resumenEconomico?.dineroRecibido
                    )}
                    subtitulo="Pagos recibidos y abonos registrados"
                    icono={<HandCoins className="h-7 w-7" />}
                  />

                  <CardReporte
                    titulo="Dinero pendiente"
                    valor={formatearMoneda(
                      reporteEconomico.resumenEconomico?.dineroPendiente
                    )}
                    subtitulo="Total que falta por abonar"
                    alerta={
                      Number(
                        reporteEconomico.resumenEconomico?.dineroPendiente || 0
                      ) > 0
                    }
                    icono={<AlertTriangle className="h-7 w-7" />}
                  />

                  <CardReporte
                    titulo="Citas con pendiente"
                    valor={
                      reporteEconomico.resumenEconomico
                        ?.totalCitasConPendiente || 0
                    }
                    subtitulo="Pacientes que aún deben abonar"
                    alerta={
                      Number(
                        reporteEconomico.resumenEconomico
                          ?.totalCitasConPendiente || 0
                      ) > 0
                    }
                    icono={<UsersRound className="h-7 w-7" />}
                  />
                </div>

                <div className="mt-6 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
                  <div className="border-b border-black/5 bg-[#f4f7fa] px-6 py-5">
                    <h2 className="text-xl font-semibold text-[#1B3A5C]">
                      Pacientes con saldo pendiente
                    </h2>

                    <p className="text-sm text-gray-400">
                      Personas que tienen monto pendiente de pago
                    </p>
                  </div>

                  {reporteEconomico.pacientesPendientes.length === 0 ? (
                    <div className="py-12 text-center">
                      <CheckCircle className="mx-auto mb-4 h-12 w-12 text-[#7AB5A0]" />

                      <h3 className="text-lg font-semibold text-[#1B3A5C]">
                        No hay saldos pendientes
                      </h3>

                      <p className="mt-2 text-sm text-gray-400">
                        Todos los pacientes atendidos en este periodo han
                        cancelado su pago.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[950px]">
                        <thead className="border-b border-black/5">
                          <tr>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Paciente
                            </th>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Teléfono
                            </th>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Fecha
                            </th>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Motivo
                            </th>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Cobro
                            </th>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Pagado
                            </th>
                            <th className="px-6 py-4 text-left text-[#1B3A5C]">
                              Pendiente
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {reporteEconomico.pacientesPendientes.map((item) => (
                            <tr
                              key={item.citaId}
                              className="border-b border-black/5 transition-all hover:bg-[#f9fbfc]"
                            >
                              <td className="px-6 py-4 font-semibold text-[#1B3A5C]">
                                {item.paciente}
                              </td>

                              <td className="px-6 py-4 text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-[#7AB5A0]" />
                                  {item.telefono}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-gray-500">
                                {item.fecha} {item.hora}
                              </td>

                              <td className="px-6 py-4 text-gray-500">
                                {item.motivo}
                              </td>

                              <td className="px-6 py-4 font-semibold text-[#1B3A5C]">
                                {formatearMoneda(item.montoCobrar)}
                              </td>

                              <td className="px-6 py-4 font-semibold text-[#1B3A5C]">
                                {formatearMoneda(item.montoPagado)}
                              </td>

                              <td className="px-6 py-4 font-semibold text-red-500">
                                {formatearMoneda(item.saldoPendiente)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ALERTAS Y RECOMENDACIONES */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#1B3A5C]">
                    Alertas importantes
                  </h2>

                  <p className="text-sm text-gray-400">
                    Situaciones que requieren atención
                  </p>
                </div>
              </div>

              {reporte.alertas.length === 0 ? (
                <p className="rounded-2xl bg-[#7AB5A0]/10 px-4 py-4 text-sm font-semibold text-[#1B3A5C]">
                  No se detectaron alertas importantes esta semana.
                </p>
              ) : (
                <div className="space-y-3">
                  {reporte.alertas.map((alerta, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                    >
                      {alerta}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7AB5A0] text-white">
                  <ClipboardList className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#1B3A5C]">
                    Recomendaciones
                  </h2>

                  <p className="text-sm text-gray-400">
                    Acciones sugeridas para la clínica
                  </p>
                </div>
              </div>

              {reporte.recomendaciones.length === 0 ? (
                <p className="rounded-2xl bg-[#7AB5A0]/10 px-4 py-4 text-sm font-semibold text-[#1B3A5C]">
                  No hay recomendaciones especiales para esta semana.
                </p>
              ) : (
                <div className="space-y-3">
                  {reporte.recomendaciones.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-[#f4f7fa] px-4 py-3 text-sm font-medium text-[#1B3A5C]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CITAS POR DÍA */}

          <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="border-b border-black/5 bg-[#f4f7fa] px-6 py-5">
              <h2 className="text-xl font-semibold text-[#1B3A5C]">
                Citas por día
              </h2>

              <p className="text-sm text-gray-400">
                Distribución semanal de citas
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-black/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#1B3A5C]">
                      Día
                    </th>
                    <th className="px-6 py-4 text-left text-[#1B3A5C]">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-[#1B3A5C]">
                      Atendidas
                    </th>
                    <th className="px-6 py-4 text-left text-[#1B3A5C]">
                      Confirmadas
                    </th>
                    <th className="px-6 py-4 text-left text-[#1B3A5C]">
                      Pendientes
                    </th>
                    <th className="px-6 py-4 text-left text-[#1B3A5C]">
                      Canceladas
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reporte.citas.porDia.map((dia) => (
                    <tr
                      key={dia.dia}
                      className="border-b border-black/5 transition-all hover:bg-[#f9fbfc]"
                    >
                      <td className="px-6 py-4 font-semibold text-[#1B3A5C]">
                        {dia.dia}
                      </td>

                      <td className="px-6 py-4 text-[#1B3A5C]">
                        {dia.total}
                      </td>

                      <td className="px-6 py-4 text-[#1B3A5C]">
                        {dia.atendidas}
                      </td>

                      <td className="px-6 py-4 text-[#1B3A5C]">
                        {dia.confirmadas}
                      </td>

                      <td className="px-6 py-4 text-[#1B3A5C]">
                        {dia.pendientes}
                      </td>

                      <td className="px-6 py-4 text-red-500">
                        {dia.canceladas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETALLE DE CITAS */}

          <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="border-b border-black/5 bg-[#f4f7fa] px-6 py-5">
              <h2 className="text-xl font-semibold text-[#1B3A5C]">
                Pacientes de la semana
              </h2>

              <p className="text-sm text-gray-400">
                Detalle de citas registradas en el rango seleccionado
              </p>
            </div>

            {reporte.citas.detalle.length === 0 ? (
              <div className="py-16 text-center">
                <CalendarDays className="mx-auto mb-4 h-14 w-14 text-gray-300" />

                <h3 className="text-lg font-semibold text-[#1B3A5C]">
                  No hay citas registradas
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  No se encontraron citas dentro de esta semana.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="border-b border-black/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-[#1B3A5C]">
                        Paciente
                      </th>
                      <th className="px-6 py-4 text-left text-[#1B3A5C]">
                        Teléfono
                      </th>
                      <th className="px-6 py-4 text-left text-[#1B3A5C]">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-[#1B3A5C]">
                        Hora
                      </th>
                      <th className="px-6 py-4 text-left text-[#1B3A5C]">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reporte.citas.detalle.map((cita) => (
                      <tr
                        key={cita.id}
                        className="border-b border-black/5 transition-all hover:bg-[#f9fbfc]"
                      >
                        <td className="px-6 py-4 font-semibold text-[#1B3A5C]">
                          {cita.paciente}
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {cita.telefono}
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {cita.fecha}
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {cita.hora}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-xs font-semibold capitalize text-[#1B3A5C]">
                            {cita.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* INVENTARIO EN ALERTA */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1B3A5C]">
                Existencia baja
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-400">
                Insumos por debajo del mínimo
              </p>

              {reporte.inventario.insumosBajos.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No hay insumos con existencia baja.
                </p>
              ) : (
                <div className="space-y-3">
                  {reporte.inventario.insumosBajos.map((insumo) => (
                    <div
                      key={insumo.id}
                      className="rounded-2xl bg-red-50 px-4 py-3"
                    >
                      <p className="font-semibold text-red-500">
                        {insumo.nombre}
                      </p>

                      <p className="text-sm text-red-400">
                        Stock: {insumo.stock} / Mínimo: {insumo.stockMinimo}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1B3A5C]">
                Sin existencia
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-400">
                Insumos agotados
              </p>

              {reporte.inventario.insumosAgotados.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No hay insumos agotados.
                </p>
              ) : (
                <div className="space-y-3">
                  {reporte.inventario.insumosAgotados.map((insumo) => (
                    <div
                      key={insumo.id}
                      className="rounded-2xl bg-red-50 px-4 py-3"
                    >
                      <p className="font-semibold text-red-500">
                        {insumo.nombre}
                      </p>

                      <p className="text-sm text-red-400">
                        Categoría: {insumo.categoria}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1B3A5C]">
                Próximos a vencer
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-400">
                Insumos que vencen en 30 días
              </p>

              {reporte.inventario.proximosAVencer.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No hay insumos próximos a vencer.
                </p>
              ) : (
                <div className="space-y-3">
                  {reporte.inventario.proximosAVencer.map((insumo) => (
                    <div
                      key={insumo.id}
                      className="rounded-2xl bg-[#f4f7fa] px-4 py-3"
                    >
                      <p className="font-semibold text-[#1B3A5C]">
                        {insumo.nombre}
                      </p>

                      <p className="text-sm text-gray-400">
                        Vence: {insumo.fechaVencimiento}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}