import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const {
      clientName,
      clientLastName,
      clientPhone,
      date,
      time,
    } = await req.json();

    const db = await connectDB();

    const appointmentDate = new Date(date);

    const today = new Date();

    const sameDay =
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear();

    const timeMap = {
      "08:00 AM": 8,
      "09:00 AM": 9,
      "10:00 AM": 10,
      "11:00 AM": 11,
      "12:00 PM": 12,
      "02:00 PM": 14,
      "03:00 PM": 15,
      "04:00 PM": 16,
      "05:00 PM": 17,
    };

    const selectedHour = timeMap[time];

    if (sameDay && selectedHour <= today.getHours()) {
      return Response.json(
        {
          error: "Ese horario ya no está disponible",
        },
        {
          status: 400,
        }
      );
    }

    const newAppointment = {
      clientName,
      clientLastName,
      clientPhone,
      date,
      time,
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
      {
        error: "Error al crear cita",
      },
      {
        status: 500,
      }
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
      {
        error: "Error al obtener citas",
      },
      {
        status: 500,
      }
    );
  }
}