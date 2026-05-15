import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    const user = await db.collection("usuarios").findOne({
      username: "admin",
    });

    if (!user) {
      return Response.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({
      _id: user._id.toString(),
      username: user.username,
      avatar: user.avatar || "",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

/* =========================
   PATCH: cambiar username
========================= */
export async function PATCH(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const { username, password } = body;

    const user = await db.collection("usuarios").findOne({
      username: "admin",
    });

    if (!user) {
      return Response.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (password !== user.password) {
      return Response.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    await db.collection("usuarios").updateOne(
      { username: "admin" },
      {
        $set: {
          username,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Error actualizando usuario" },
      { status: 500 }
    );
  }
}