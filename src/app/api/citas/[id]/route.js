import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// EDITAR CITA
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const db = await connectDB();

    await db.collection("citas").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          clientName: body.clientName,
          clientLastName: body.clientLastName,
          clientPhone: body.clientPhone,
          date: body.date,
          time: body.time,
          status: body.status || "pendiente",
        },
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Error al actualizar cita" },
      { status: 500 }
    );
  }
}