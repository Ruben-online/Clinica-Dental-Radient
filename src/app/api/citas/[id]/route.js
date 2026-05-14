import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* =========================
   PUT → actualizar cita completa
========================= */
export async function PUT(req, context) {
  try {
    const db = await connectDB();
    const data = await req.json();

    // ✅ FIX NEXTJS 16
    const { id } = await context.params;

    // Validar ObjectId
    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    // Validar horario ocupado
    const existingAppointment = await db.collection("citas").findOne({
      _id: { $ne: new ObjectId(id) },
      date: data.date,
      time: data.time,
    });

    if (existingAppointment) {
      return Response.json(
        {
          error: "Este horario ya está ocupado",
        },
        {
          status: 409,
        }
      );
    }

    const result = await db.collection("citas").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          clientName: data.clientName,
          clientLastName: data.clientLastName,
          clientPhone: data.clientPhone,
          motivo: data.motivo || "",
          date: data.date,
          time: data.time,
          status: data.status || "pendiente",
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Error al actualizar cita",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   PATCH → cambiar estado o reprogramar
========================= */
export async function PATCH(req, context) {
  try {
    const db = await connectDB();
    const data = await req.json();

    // ✅ FIX NEXTJS 16
    const { id } = await context.params;

    // Validar ObjectId
    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    // Validar horario ocupado
    if (data.date && data.time) {
      const existingAppointment = await db.collection("citas").findOne({
        _id: { $ne: new ObjectId(id) },
        date: data.date,
        time: data.time,
      });

      if (existingAppointment) {
        return Response.json(
          {
            error: "Este horario ya está ocupado",
          },
          {
            status: 409,
          }
        );
      }
    }

    const update = {};

    if (data.status) update.status = data.status;
    if (data.date) update.date = data.date;
    if (data.time) update.time = data.time;

    update.updatedAt = new Date();

    const result = await db.collection("citas").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: update,
      }
    );

    return Response.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Error al actualizar cita",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE → eliminar cita
========================= */
export async function DELETE(req, context) {
  try {
    const db = await connectDB();

    // ✅ FIX NEXTJS 16
    const { id } = await context.params;

    // Validar ObjectId
    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    const result = await db.collection("citas").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Error al eliminar cita",
      },
      {
        status: 500,
      }
    );
  }
}