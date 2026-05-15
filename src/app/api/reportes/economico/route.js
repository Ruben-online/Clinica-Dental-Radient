import { connectDB } from "@/lib/mongodb";

function convertirNumero(valor) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return 0;
  }

  return numero;
}

function normalizarFecha(fecha) {
  if (!fecha) return "";
  return String(fecha).split("T")[0];
}

function estaEnRango(fechaCita, desde, hasta) {
  const fecha = normalizarFecha(fechaCita);

  if (!fecha) return false;

  if (desde && fecha < desde) return false;
  if (hasta && fecha > hasta) return false;

  return true;
}

function obtenerNombrePaciente(cita) {
  const nombre = `${cita.clientName || ""} ${
    cita.clientLastName || ""
  }`.trim();

  return nombre || "Paciente no registrado";
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const desde = searchParams.get("desde") || "";
    const hasta = searchParams.get("hasta") || "";

    const db = await connectDB();

    const citas = await db
      .collection("citas")
      .find({
        status: "atendida",
        atencion: { $exists: true },
      })
      .sort({ date: -1, time: -1 })
      .toArray();

    const citasFiltradas = citas.filter((cita) =>
      estaEnRango(cita.date, desde, hasta)
    );

    let dineroPrevisto = 0;
    let dineroRecibido = 0;
    let dineroPendiente = 0;
    let totalCitasAtendidas = 0;
    let totalCitasConPendiente = 0;

    const pacientesPendientes = [];

    citasFiltradas.forEach((cita) => {
      const montoCobrar = convertirNumero(cita.atencion?.montoCobrar);
      const montoPagado = convertirNumero(cita.atencion?.montoPagado);
      const saldoPendiente = convertirNumero(cita.atencion?.saldoPendiente);

      dineroPrevisto += montoCobrar;
      dineroRecibido += montoPagado;
      dineroPendiente += saldoPendiente;
      totalCitasAtendidas += 1;

      if (saldoPendiente > 0) {
        totalCitasConPendiente += 1;

        pacientesPendientes.push({
          citaId: String(cita._id),
          paciente: obtenerNombrePaciente(cita),
          telefono: cita.clientPhone || "No registrado",
          fecha: normalizarFecha(cita.date),
          hora: cita.time || "",
          motivo: cita.motivo || "No especificado",
          montoCobrar,
          montoPagado,
          saldoPendiente,
          metodoPago: cita.atencion?.metodoPago || "No registrado",
        });
      }
    });

    return Response.json({
      success: true,
      filtro: {
        desde,
        hasta,
      },
      resumenEconomico: {
        totalCitasAtendidas,
        totalCitasConPendiente,
        dineroPrevisto,
        dineroRecibido,
        dineroPendiente,
      },
      pacientesPendientes,
    });
  } catch (error) {
    console.error("Error al generar reporte económico:", error);

    return Response.json(
      {
        success: false,
        error: "Error al generar reporte económico",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}