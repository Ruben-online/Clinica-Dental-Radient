import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  const db = await connectDB();

  const user = await db.collection("usuarios").findOne({
    email,
    password
  });

  if (!user) {
    return Response.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  return Response.json({ success: true });
}