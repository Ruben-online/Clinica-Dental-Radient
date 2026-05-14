import { connectDB } from "@/lib/mongodb";

/* =========================
   FUNCIONES AUXILIARES
========================= */

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizarTelefono(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function crearPacienteKey(nombre, apellido, telefono) {
  return `${normalizarTexto(nombre)}|${normalizarTexto(
    apellido
  )}|${normalizarTelefono(telefono)}`;
}

function formatearFecha(valor) {
  if (!valor) return "No registrada";

  const texto = String(valor);

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const fecha = new Date(`${texto}T12:00:00`);

    return fecha.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return texto;
  }

  return fecha.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function obtenerEstado(valor) {
  const estado = String(valor || "pendiente").toLowerCase().trim();

  if (
    estado.includes("atendida") ||
    estado.includes("atendido") ||
    estado.includes("finalizada") ||
    estado.includes("completada")
  ) {
    return "atendida";
  }

  if (
    estado.includes("cancelada") ||
    estado.includes("cancelado") ||
    estado.includes("rechazada")
  ) {
    return "cancelada";
  }

  if (
    estado.includes("confirmada") ||
    estado.includes("confirmado") ||
    estado.includes("reservada")
  ) {
    return "confirmada";
  }

  return "pendiente";
}

function obtenerNombre(cita) {
  return (
    cita.clientName ||
    cita.nombre ||
    cita.nombrePaciente ||
    cita.pacienteNombre ||
    ""
  );
}

function obtenerApellido(cita) {
  return (
    cita.clientLastName ||
    cita.apellido ||
    cita.apellidos ||
    cita.apellidoPaciente ||
    cita.pacienteApellido ||
    ""
  );
}

function obtenerTelefono(cita) {
  return (
    cita.clientPhone ||
    cita.telefono ||
    cita.phone ||
    cita.celular ||
    cita.numeroTelefono ||
    ""
  );
}

function obtenerFecha(cita) {
  return cita.date || cita.fecha || cita.fechaCita || cita.dia || "";
}

function obtenerHora(cita) {
  return cita.time || cita.hora || cita.horaCita || cita.horario || "Sin hora";
}

function obtenerMotivo(cita) {
  return (
    cita.motivo ||
    cita.motivoConsulta ||
    cita.descripcion ||
    cita.servicio ||
    cita.tratamiento ||
    "Consulta dental"
  );
}

function obtenerFechaOrden(cita) {
  const fecha = obtenerFecha(cita);
  const hora = obtenerHora(cita);

  return `${fecha || ""} ${hora || ""}`;
}

function ordenarHistorial(historial = []) {
  return [...historial].sort((a, b) => {
    const fechaA = `${a.date || ""} ${a.time || ""}`;
    const fechaB = `${b.date || ""} ${b.time || ""}`;

    return fechaB.localeCompare(fechaA);
  });
}

/* =========================
   GET → Obtener pacientes desde citas
========================= */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const db = await connectDB();

    const citas = await db
      .collection("citas")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const pacientesMap = new Map();

    citas.forEach((cita) => {
      const nombre = String(obtenerNombre(cita)).trim();
      const apellido = String(obtenerApellido(cita)).trim();
      const telefono = String(obtenerTelefono(cita)).trim();

      if (!nombre || !apellido || !telefono) {
        return;
      }

      const pacienteKey = crearPacienteKey(nombre, apellido, telefono);

      if (!pacientesMap.has(pacienteKey)) {
        pacientesMap.set(pacienteKey, {
          _id: pacienteKey,
          pacienteKey,
          clientName: nombre,
          clientLastName: apellido,
          clientPhone: telefono,
          nombreCompleto: `${nombre} ${apellido}`.trim(),
          telefonoBusqueda: normalizarTelefono(telefono),
          nombreBusqueda: normalizarTexto(nombre),
          apellidoBusqueda: normalizarTexto(apellido),
          historialClinico: [],
        });
      }

      const paciente = pacientesMap.get(pacienteKey);

      paciente.historialClinico.push({
        citaId: String(cita._id),
        date: obtenerFecha(cita),
        dateFormatted: formatearFecha(obtenerFecha(cita)),
        time: obtenerHora(cita),
        motivo: obtenerMotivo(cita),
        status: obtenerEstado(cita.status || cita.estado),
        createdAt: formatearFecha(cita.createdAt),
        fechaOrden: obtenerFechaOrden(cita),
      });
    });

    let pacientes = Array.from(pacientesMap.values()).map((paciente) => {
      const historialOrdenado = ordenarHistorial(paciente.historialClinico);

      const citasAtendidas = historialOrdenado.filter(
        (item) => item.status === "atendida"
      ).length;

      const citasPendientes = historialOrdenado.filter(
        (item) => item.status === "pendiente"
      ).length;

      const citasCanceladas = historialOrdenado.filter(
        (item) => item.status === "cancelada"
      ).length;

      const citasConfirmadas = historialOrdenado.filter(
        (item) => item.status === "confirmada"
      ).length;

      const ultimaCita = historialOrdenado[0];

      return {
        ...paciente,
        historialClinico: historialOrdenado,
        totalCitas: historialOrdenado.length,
        citasAtendidas,
        citasPendientes,
        citasCanceladas,
        citasConfirmadas,
        ultimaCita: ultimaCita
          ? `${ultimaCita.dateFormatted} - ${ultimaCita.time}`
          : "Sin citas",
        ultimaFechaOrden: ultimaCita ? ultimaCita.fechaOrden : "",
      };
    });

    if (search.trim()) {
      const texto = normalizarTexto(search);
      const telefono = normalizarTelefono(search);

      pacientes = pacientes.filter((paciente) => {
        const nombreCompleto = normalizarTexto(paciente.nombreCompleto);

        return (
          nombreCompleto.includes(texto) ||
          paciente.nombreBusqueda.includes(texto) ||
          paciente.apellidoBusqueda.includes(texto) ||
          paciente.telefonoBusqueda.includes(telefono)
        );
      });
    }

    pacientes.sort((a, b) => {
      return String(b.ultimaFechaOrden || "").localeCompare(
        String(a.ultimaFechaOrden || "")
      );
    });

    const totalPacientes = pacientes.length;

    const pacientesConCitas = pacientes.filter(
      (paciente) => paciente.totalCitas > 0
    ).length;

    const totalCitasRegistradas = pacientes.reduce(
      (total, paciente) => total + paciente.totalCitas,
      0
    );

    const totalCitasAtendidas = pacientes.reduce(
      (total, paciente) => total + paciente.citasAtendidas,
      0
    );

    const totalCitasPendientes = pacientes.reduce(
      (total, paciente) => total + paciente.citasPendientes,
      0
    );

    return Response.json({
      success: true,
      pacientes,
      resumen: {
        totalPacientes,
        pacientesConCitas,
        totalCitasRegistradas,
        totalCitasAtendidas,
        totalCitasPendientes,
      },
    });
  } catch (error) {
    console.error("Error al obtener pacientes:", error);

    return Response.json(
      {
        success: false,
        error: "Error al obtener pacientes",
      },
      { status: 500 }
    );
  }
}