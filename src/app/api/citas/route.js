import { connectDB } from "@/lib/mongodb";

/* =========================
   POST → Crear cita
========================= */
export async function POST(req) {
  try {
    const {
      clientName,
      clientLastName,
      clientPhone,
      date,
      time,
      motivo, // 👈 NUEVO CAMPO
    } = await req.json();

    const db = await connectDB();

    // Validar si ya existe una cita en ese horario
    const existingAppointment = await db.collection("citas").findOne({
      date,
      time,
    });

    if (existingAppointment) {
      return Response.json(
        { error: "Este horario ya está ocupado" },
        { status: 409 }
      );
    }

    const newAppointment = {
      clientName,
      clientLastName,
      clientPhone,
      date,
      time,
      motivo: motivo || "", // 👈 NUEVO CAMPO
      status: "pendiente",
      createdAt: new Date(),
    };

    await db.collection("citas").insertOne(newAppointment);

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error al crear cita" },
      { status: 500 }
    );
  }
}

/* =========================
   GET → Obtener citas
========================= */
export async function GET() {
  try {
    const db = await connectDB();

    const appointments = await db
      .collection("citas")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(appointments);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}