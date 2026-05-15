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
  return String(valor || "").trim().toLowerCase();
}

async function buscarCita(db, citaId) {
  if (esObjectIdValido(citaId)) {
    const cita = await db.collection("citas").findOne({
      _id: new ObjectId(citaId),
    });

    if (cita) return cita;
  }

  return await db.collection("citas").findOne({
    _id: citaId,
  });
}

async function actualizarCita(db, citaId, datos) {
  if (esObjectIdValido(citaId)) {
    const resultado = await db.collection("citas").updateOne(
      {
        _id: new ObjectId(citaId),
      },
      datos
    );

    if (resultado.matchedCount > 0) return resultado;
  }

  return await db.collection("citas").updateOne(
    {
      _id: citaId,
    },
    datos
  );
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { citaId, montoAbonado } = body;

    if (!citaId) {
      return Response.json(
        {
          error: "No se recibió el ID de la cita",
        },
        { status: 400 }
      );
    }

    const abono = convertirNumero(montoAbonado);

    if (abono <= 0) {
      return Response.json(
        {
          error: "El monto abonado debe ser mayor a 0",
        },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const cita = await buscarCita(db, citaId);

    if (!cita) {
      return Response.json(
        {
          error: "No se encontró la cita",
        },
        { status: 404 }
      );
    }

    if (!cita.atencion) {
      return Response.json(
        {
          error: "Esta cita todavía no tiene una atención registrada",
        },
        { status: 400 }
      );
    }

    const montoCobrarActual = convertirNumero(cita.atencion.montoCobrar);
    const montoPagadoActual = convertirNumero(cita.atencion.montoPagado);
    const saldoPendienteActual = convertirNumero(cita.atencion.saldoPendiente);

    if (saldoPendienteActual <= 0) {
      return Response.json(
        {
          error: "Esta cita ya no tiene saldo pendiente",
        },
        { status: 400 }
      );
    }

    if (abono > saldoPendienteActual) {
      return Response.json(
        {
          error: "El abono no puede ser mayor al saldo pendiente",
          detalle: `Saldo pendiente actual: Q ${saldoPendienteActual.toFixed(
            2
          )}`,
        },
        { status: 400 }
      );
    }

    const nuevoMontoPagado = montoPagadoActual + abono;
    const nuevoSaldoPendiente = Math.max(montoCobrarActual - nuevoMontoPagado, 0);

    const abonoRegistrado = {
      monto: abono,
      fechaAbono: new Date(),
      saldoAnterior: saldoPendienteActual,
      saldoNuevo: nuevoSaldoPendiente,
    };

    const resultadoCita = await actualizarCita(db, citaId, {
      $set: {
        "atencion.montoPagado": nuevoMontoPagado,
        "atencion.saldoPendiente": nuevoSaldoPendiente,
        "atencion.deudaCancelada": nuevoSaldoPendiente === 0,
        updatedAt: new Date(),
      },
      $push: {
        "atencion.abonos": abonoRegistrado,
      },
    });

    if (resultadoCita.matchedCount === 0) {
      return Response.json(
        {
          error: "No se pudo actualizar la cita",
        },
        { status: 500 }
      );
    }

    const filtroPaciente = {
      nombreNormalizado: normalizarTexto(cita.clientName),
      apellidoNormalizado: normalizarTexto(cita.clientLastName),
      telefonoNormalizado: normalizarTexto(cita.clientPhone),
      "historial.citaId": String(cita._id),
    };

    await db.collection("pacientes").updateOne(filtroPaciente, {
      $set: {
        "historial.$.montoPagado": nuevoMontoPagado,
        "historial.$.saldoPendiente": nuevoSaldoPendiente,
        "historial.$.deudaCancelada": nuevoSaldoPendiente === 0,
        updatedAt: new Date(),
      },
      $push: {
        "historial.$.abonos": abonoRegistrado,
      },
    });

    return Response.json({
      success: true,
      message: "Abono registrado correctamente",
      abono: abonoRegistrado,
      montoPagado: nuevoMontoPagado,
      saldoPendiente: nuevoSaldoPendiente,
      deudaCancelada: nuevoSaldoPendiente === 0,
    });
  } catch (error) {
    console.error("Error al registrar abono:", error);

    return Response.json(
      {
        error: "Error al registrar el abono",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}