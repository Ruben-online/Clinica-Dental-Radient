import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

function fechaISO(valor) {
  if (!valor) return "";

  if (valor instanceof Date) {
    return valor.toISOString().slice(0, 10);
  }

  const texto = String(valor);

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    return texto.slice(0, 10);
  }

  const fecha = new Date(texto);

  if (Number.isNaN(fecha.getTime())) {
    return "";
  }

  return fecha.toISOString().slice(0, 10);
}

function fechaLarga(valor) {
  const iso = fechaISO(valor);

  if (!iso) return "No registrada";

  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function obtenerNombrePaciente(cita) {
  const nombre =
    cita.nombre ||
    cita.nombrePaciente ||
    cita.name ||
    cita.paciente ||
    "";

  const apellido =
    cita.apellido ||
    cita.apellidos ||
    cita.apellidoPaciente ||
    cita.lastname ||
    "";

  const completo = `${nombre} ${apellido}`.trim();

  return completo || "Paciente no registrado";
}

function obtenerTelefono(cita) {
  return (
    cita.telefono ||
    cita.phone ||
    cita.celular ||
    cita.numeroTelefono ||
    "No registrado"
  );
}

function obtenerFechaCita(cita) {
  return (
    cita.fecha ||
    cita.fechaCita ||
    cita.date ||
    cita.dia ||
    cita.createdAt ||
    ""
  );
}

function obtenerHoraCita(cita) {
  return cita.hora || cita.horaCita || cita.time || cita.horario || "Sin hora";
}

function obtenerEstadoCita(cita) {
  const estado = String(cita.estado || cita.status || "pendiente")
    .toLowerCase()
    .trim();

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

function indiceDiaSemana(fecha) {
  const iso = fechaISO(fecha);

  if (!iso) return -1;

  const date = new Date(`${iso}T12:00:00`);
  const dia = date.getDay();

  return dia === 0 ? 6 : dia - 1;
}

function estaEntreFechas(fecha, inicio, fin) {
  const iso = fechaISO(fecha);

  if (!iso) return false;

  return iso >= inicio && iso <= fin;
}

function sumarPorDia(citas) {
  const dias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const resumen = dias.map((dia) => ({
    dia,
    total: 0,
    atendidas: 0,
    canceladas: 0,
    pendientes: 0,
    confirmadas: 0,
  }));

  citas.forEach((cita) => {
    const index = indiceDiaSemana(obtenerFechaCita(cita));

    if (index < 0) return;

    const estado = obtenerEstadoCita(cita);

    resumen[index].total += 1;

    if (estado === "atendida") resumen[index].atendidas += 1;
    if (estado === "cancelada") resumen[index].canceladas += 1;
    if (estado === "pendiente") resumen[index].pendientes += 1;
    if (estado === "confirmada") resumen[index].confirmadas += 1;
  });

  return resumen;
}

function obtenerDiaMasOcupado(citasPorDia) {
  const ordenados = [...citasPorDia].sort((a, b) => b.total - a.total);

  if (!ordenados[0] || ordenados[0].total === 0) {
    return "Sin movimiento";
  }

  return ordenados[0].dia;
}

function obtenerHorarioMasOcupado(citas) {
  const conteo = {};

  citas.forEach((cita) => {
    const hora = obtenerHoraCita(cita);
    conteo[hora] = (conteo[hora] || 0) + 1;
  });

  const ordenados = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

  if (!ordenados.length) {
    return "Sin horario registrado";
  }

  return ordenados[0][0];
}

function normalizarCita(cita) {
  return {
    id: String(cita._id),
    paciente: obtenerNombrePaciente(cita),
    telefono: obtenerTelefono(cita),
    fecha: fechaLarga(obtenerFechaCita(cita)),
    fechaISO: fechaISO(obtenerFechaCita(cita)),
    hora: obtenerHoraCita(cita),
    estado: obtenerEstadoCita(cita),
  };
}

function normalizarInsumo(insumo) {
  return {
    id: String(insumo._id),
    nombre: insumo.nombre || "Sin nombre",
    categoria: insumo.categoria || "Sin categoría",
    descripcion: insumo.descripcion || "Sin descripción",
    stock: Number(insumo.stock || 0),
    stockMinimo: Number(insumo.stockMinimo || 0),
    precioCompra: Number(insumo.precioCompra || 0),
    fechaIngreso: fechaLarga(insumo.fechaIngreso),
    fechaVencimiento: fechaLarga(insumo.fechaVencimiento),
    fechaVencimientoISO: fechaISO(insumo.fechaVencimiento),
  };
}

function diasParaVencer(fecha) {
  const iso = fechaISO(fecha);

  if (!iso) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencimiento = new Date(`${iso}T12:00:00`);
  vencimiento.setHours(0, 0, 0, 0);

  return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
}

async function obtenerDocumentos(db, posiblesNombres) {
  const colecciones = await db.listCollections({}, { nameOnly: true }).toArray();
  const nombresExistentes = new Set(colecciones.map((coleccion) => coleccion.name));

  const nombreColeccion =
    posiblesNombres.find((nombre) => nombresExistentes.has(nombre)) ||
    posiblesNombres[0];

  const documentos = await db.collection(nombreColeccion).find({}).toArray();

  return {
    nombreColeccion,
    documentos,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const hoy = new Date();
    const dia = hoy.getDay();
    const diferenciaLunes = dia === 0 ? -6 : 1 - dia;

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diferenciaLunes);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const inicioDefault = lunes.toISOString().slice(0, 10);
    const finDefault = domingo.toISOString().slice(0, 10);

    const inicio = searchParams.get("inicio") || inicioDefault;
    const fin = searchParams.get("fin") || finDefault;

    const db = await connectDB();

    const { documentos: citas } = await obtenerDocumentos(db, [
      "citas",
      "appointments",
      "reservas",
    ]);

    const { documentos: inventario } = await obtenerDocumentos(db, [
      "inventario",
      "productos",
      "insumos",
    ]);

    const citasSemana = citas.filter((cita) =>
      estaEntreFechas(obtenerFechaCita(cita), inicio, fin)
    );

    const citasNormalizadas = citasSemana
      .map(normalizarCita)
      .sort((a, b) => {
        if (a.fechaISO === b.fechaISO) {
          return String(a.hora).localeCompare(String(b.hora));
        }

        return a.fechaISO.localeCompare(b.fechaISO);
      });

    const citasPorDia = sumarPorDia(citasSemana);

    const totalCitas = citasSemana.length;
    const citasAtendidas = citasSemana.filter(
      (cita) => obtenerEstadoCita(cita) === "atendida"
    ).length;
    const citasCanceladas = citasSemana.filter(
      (cita) => obtenerEstadoCita(cita) === "cancelada"
    ).length;
    const citasPendientes = citasSemana.filter(
      (cita) => obtenerEstadoCita(cita) === "pendiente"
    ).length;
    const citasConfirmadas = citasSemana.filter(
      (cita) => obtenerEstadoCita(cita) === "confirmada"
    ).length;

    const inventarioNormalizado = inventario.map(normalizarInsumo);

    const insumosBajos = inventarioNormalizado.filter(
      (insumo) => Number(insumo.stock) <= Number(insumo.stockMinimo)
    );

    const insumosAgotados = inventarioNormalizado.filter(
      (insumo) => Number(insumo.stock) === 0
    );

    const proximosAVencer = inventarioNormalizado.filter((insumo) => {
      const dias = diasParaVencer(insumo.fechaVencimientoISO);
      return dias !== null && dias >= 0 && dias <= 30;
    });

    const alertas = [];

    if (insumosBajos.length > 0) {
      alertas.push(`Hay ${insumosBajos.length} insumo(s) con existencia baja.`);
    }

    if (insumosAgotados.length > 0) {
      alertas.push(`Hay ${insumosAgotados.length} insumo(s) sin existencia.`);
    }

    if (proximosAVencer.length > 0) {
      alertas.push(
        `Hay ${proximosAVencer.length} insumo(s) próximos a vencer.`
      );
    }

    if (citasCanceladas > 0) {
      alertas.push(`Se registraron ${citasCanceladas} cita(s) canceladas.`);
    }

    const recomendaciones = [];

    if (insumosAgotados.length > 0) {
      recomendaciones.push(
        "Revisar compras urgentes de insumos agotados para evitar afectar la atención clínica."
      );
    }

    if (insumosBajos.length > 0) {
      recomendaciones.push(
        "Programar reposición de insumos con existencia baja durante la semana."
      );
    }

    if (proximosAVencer.length > 0) {
      recomendaciones.push(
        "Priorizar el uso de insumos próximos a vencer para evitar pérdidas."
      );
    }

    if (totalCitas > 0) {
      recomendaciones.push(
        `Reforzar la atención en el día con más movimiento: ${obtenerDiaMasOcupado(
          citasPorDia
        )}.`
      );
    }

    return NextResponse.json({
      ok: true,
      rango: {
        inicio,
        fin,
      },
      resumen: {
        totalCitas,
        citasAtendidas,
        citasCanceladas,
        citasPendientes,
        citasConfirmadas,
        diaMasOcupado: obtenerDiaMasOcupado(citasPorDia),
        horarioMasOcupado: obtenerHorarioMasOcupado(citasSemana),
        totalInsumos: inventarioNormalizado.length,
        insumosBajos: insumosBajos.length,
        insumosAgotados: insumosAgotados.length,
        proximosAVencer: proximosAVencer.length,
      },
      citas: {
        porDia: citasPorDia,
        detalle: citasNormalizadas,
      },
      inventario: {
        insumosBajos,
        insumosAgotados,
        proximosAVencer,
      },
      alertas,
      recomendaciones,
    });
  } catch (error) {
    console.error("Error en reporte semanal:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Error al generar el reporte semanal",
      },
      { status: 500 }
    );
  }
}