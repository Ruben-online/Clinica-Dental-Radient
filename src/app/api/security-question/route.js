import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  const { username } = await req.json();

  const db = await connectDB();

  const user = await db.collection("usuarios").findOne({
    username,
  });

  if (!user) {
    return Response.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const shuffledQuestions = [...user.securityQuestions].sort(
    () => Math.random() - 0.5
  );

  const selectedQuestions = shuffledQuestions
    .slice(0, 4)
    .map((item) => item.question);

  return Response.json({
    questions: selectedQuestions,
  });
}