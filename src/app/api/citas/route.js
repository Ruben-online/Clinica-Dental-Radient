import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const {
      clientName,
      clientLastName,
      clientPhone,
      date,
      time,
      reason, // 🆕 motivo de la cita
    } = await req.json();

    const db = await connectDB();

    // 🔒 Normalizar fecha para evitar duplicados raros
    const normalizedDate =
      typeof date === "string"
        ? date.split("T")[0]
        : date;

    // ❌ Validar si ya existe cita en ese horario
    const existingAppointment = await db
      .collection("citas")
      .findOne({
        date: normalizedDate,
        time,
      });

    if (existingAppointment) {
      return Response.json(
        { error: "Este horario ya está ocupado" },
        { status: 409 }
      );
    }

    // 🧠 Documento final de cita
    const newAppointment = {
      clientName,
      clientLastName,
      clientPhone,
      reason: reason || "", // 🆕 motivo opcional
      date: normalizedDate,
      time,
      status: "pendiente",
      createdAt: new Date(),
    };

    await db.collection("citas").insertOne(newAppointment);

    return Response.json({
      success: true,
      message: "Cita creada correctamente",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error al crear cita" },
      { status: 500 }
    );
  }
}

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