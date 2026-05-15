import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

function esObjectIdValido(id) {
  return id && ObjectId.isValid(String(id));
}

function convertirNumero(valor) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return 0;
  }

  return numero;
}

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase();
}

function obtenerCampoExistencia(insumo) {
  if (insumo.stock !== undefined) return "stock";
  if (insumo.existencia !== undefined) return "existencia";
  if (insumo.cantidad !== undefined) return "cantidad";
  if (insumo.quantity !== undefined) return "quantity";
  if (insumo.disponible !== undefined) return "disponible";
  if (insumo.available !== undefined) return "available";

  return "stock";
}

function obtenerExistencia(insumo) {
  const campo = obtenerCampoExistencia(insumo);
  return convertirNumero(insumo[campo]);
}

function obtenerNombreInsumo(insumo, respaldo = "") {
  return (
    insumo.nombre ||
    insumo.name ||
    insumo.producto ||
    insumo.insumo ||
    respaldo ||
    "Insumo sin nombre"
  );
}

async function buscarCita(db, citaId) {
  if (esObjectIdValido(citaId)) {
    const citaPorObjectId = await db.collection("citas").findOne({
      _id: new ObjectId(citaId),
    });

    if (citaPorObjectId) {
      return citaPorObjectId;
    }
  }

  return await db.collection("citas").findOne({
    _id: citaId,
  });
}

async function actualizarCita(db, citaId, datos) {
  if (esObjectIdValido(citaId)) {
    const resultadoObjectId = await db.collection("citas").updateOne(
      {
        _id: new ObjectId(citaId),
      },
      datos
    );

    if (resultadoObjectId.matchedCount > 0) {
      return resultadoObjectId;
    }
  }

  return await db.collection("citas").updateOne(
    {
      _id: citaId,
    },
    datos
  );
}

async function buscarInsumo(db, insumoId) {
  const colecciones = ["inventario", "insumos", "productos"];

  for (const nombreColeccion of colecciones) {
    const collection = db.collection(nombreColeccion);

    if (esObjectIdValido(insumoId)) {
      const porObjectId = await collection.findOne({
        _id: new ObjectId(insumoId),
      });

      if (porObjectId) {
        return {
          collection,
          nombreColeccion,
          insumo: porObjectId,
        };
      }
    }

    const porString = await collection.findOne({
      _id: insumoId,
    });

    if (porString) {
      return {
        collection,
        nombreColeccion,
        insumo: porString,
      };
    }

    const porId = await collection.findOne({
      id: insumoId,
    });

    if (porId) {
      return {
        collection,
        nombreColeccion,
        insumo: porId,
      };
    }

    const porInsumoId = await collection.findOne({
      insumoId,
    });

    if (porInsumoId) {
      return {
        collection,
        nombreColeccion,
        insumo: porInsumoId,
      };
    }
  }

  return null;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      citaId,
      detalleAtencion,
      montoCobrar,
      montoPagado,
      saldoPendiente,
      metodoPago,
      insumosUsados,
    } = body;

    if (!citaId) {
      return Response.json(
        {
          error: "No se recibió el ID de la cita",
        },
        { status: 400 }
      );
    }

    if (!detalleAtencion || !String(detalleAtencion).trim()) {
      return Response.json(
        {
          error: "Debes ingresar el detalle de la atención",
        },
        { status: 400 }
      );
    }

    const montoCobrarNumero = convertirNumero(montoCobrar);
    const montoPagadoNumero = convertirNumero(montoPagado);

    if (montoCobrarNumero < 0 || montoPagadoNumero < 0) {
      return Response.json(
        {
          error: "Los montos no pueden ser negativos",
        },
        { status: 400 }
      );
    }

    const saldoPendienteNumero =
      saldoPendiente !== undefined
        ? convertirNumero(saldoPendiente)
        : Math.max(montoCobrarNumero - montoPagadoNumero, 0);

    const db = await connectDB();

    const cita = await buscarCita(db, citaId);

    if (!cita) {
      return Response.json(
        {
          error: "No se encontró la cita",
          detalle: `ID recibido: ${citaId}`,
        },
        { status: 404 }
      );
    }

    const listaInsumos = Array.isArray(insumosUsados)
      ? insumosUsados
          .filter((item) => item.insumoId && convertirNumero(item.cantidad) > 0)
          .map((item) => ({
            insumoId: String(item.insumoId),
            nombre: item.nombre || "",
            cantidad: convertirNumero(item.cantidad),
          }))
      : [];

    const insumosParaHistorial = [];

    for (const item of listaInsumos) {
      const resultado = await buscarInsumo(db, item.insumoId);

      if (!resultado) {
        return Response.json(
          {
            error: "No se encontró el insumo en el inventario",
            detalle: `ID del insumo recibido: ${item.insumoId}. Revisa que el insumo exista en la colección inventario.`,
          },
          { status: 404 }
        );
      }

      const { collection, insumo } = resultado;

      const campoExistencia = obtenerCampoExistencia(insumo);
      const existenciaActual = obtenerExistencia(insumo);
      const cantidadUsada = convertirNumero(item.cantidad);

      if (existenciaActual < cantidadUsada) {
        return Response.json(
          {
            error: "No hay suficiente existencia",
            detalle: `Insumo: ${obtenerNombreInsumo(
              insumo,
              item.nombre
            )}. Disponible: ${existenciaActual}. Solicitado: ${cantidadUsada}.`,
          },
          { status: 400 }
        );
      }

      const existenciaNueva = existenciaActual - cantidadUsada;

      const resultadoUpdate = await collection.updateOne(
        {
          _id: insumo._id,
        },
        {
          $set: {
            [campoExistencia]: existenciaNueva,
            actualizadoEn: new Date(),
            updatedAt: new Date(),
          },
        }
      );

      if (resultadoUpdate.matchedCount === 0) {
        return Response.json(
          {
            error: "No se pudo actualizar el inventario",
            detalle: `No se pudo descontar el insumo ${obtenerNombreInsumo(
              insumo,
              item.nombre
            )}.`,
          },
          { status: 500 }
        );
      }

      insumosParaHistorial.push({
        insumoId: String(insumo._id),
        nombre: obtenerNombreInsumo(insumo, item.nombre),
        categoria: insumo.categoria || "",
        cantidad: cantidadUsada,
        campoExistencia,
        existenciaAnterior: existenciaActual,
        existenciaNueva,
      });
    }

    const atencion = {
      detalleAtencion: String(detalleAtencion).trim(),
      montoCobrar: montoCobrarNumero,
      montoPagado: montoPagadoNumero,
      saldoPendiente: saldoPendienteNumero,
      metodoPago: metodoPago || "efectivo",
      insumosUsados: insumosParaHistorial,
      fechaAtencion: new Date(),
    };

    const resultadoCita = await actualizarCita(db, citaId, {
      $set: {
        status: "atendida",
        atencion,
        updatedAt: new Date(),
      },
    });

    if (resultadoCita.matchedCount === 0) {
      return Response.json(
        {
          error: "No se pudo actualizar la cita",
          detalle: `La atención fue procesada, pero no se pudo marcar la cita como atendida. ID: ${citaId}`,
        },
        { status: 500 }
      );
    }

    const historialPaciente = {
      citaId: String(cita._id),
      fecha: cita.date || "",
      hora: cita.time || "",
      motivo: cita.motivo || "",
      estado: "atendida",
      detalleAtencion: atencion.detalleAtencion,
      montoCobrar: atencion.montoCobrar,
      montoPagado: atencion.montoPagado,
      saldoPendiente: atencion.saldoPendiente,
      metodoPago: atencion.metodoPago,
      insumosUsados: atencion.insumosUsados,
      fechaAtencion: atencion.fechaAtencion,
      creadoEn: new Date(),
    };

    await db.collection("pacientes").updateOne(
      {
        nombreNormalizado: normalizarTexto(cita.clientName),
        apellidoNormalizado: normalizarTexto(cita.clientLastName),
        telefonoNormalizado: normalizarTexto(cita.clientPhone),
      },
      {
        $setOnInsert: {
          clientName: cita.clientName || "",
          clientLastName: cita.clientLastName || "",
          clientPhone: cita.clientPhone || "",
          nombreNormalizado: normalizarTexto(cita.clientName),
          apellidoNormalizado: normalizarTexto(cita.clientLastName),
          telefonoNormalizado: normalizarTexto(cita.clientPhone),
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
          ultimaAtencion: atencion.fechaAtencion,
        },
        $push: {
          historial: historialPaciente,
        },
      },
      {
        upsert: true,
      }
    );

    return Response.json({
      success: true,
      message:
        "Atención registrada correctamente, inventario descontado e historial del paciente actualizado",
      atencion,
      historialPaciente,
    });
  } catch (error) {
    console.error("ERROR REAL AL GUARDAR ATENCIÓN:", error);

    return Response.json(
      {
        error: "Error al guardar la atención",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}