import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  const {
    username,
    answers,
    newPassword,
  } = await req.json();

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

  const securityQuestions = user.securityQuestions;

  for (const questionData of securityQuestions) {
    const question = questionData.question;
    const correctAnswer = questionData.answer;

    if (answers[question]) {
      const userAnswer = answers[question];

      if (
        userAnswer.trim().toLowerCase() !==
        correctAnswer.trim().toLowerCase()
      ) {
        return Response.json(
          { error: "Una o más respuestas son incorrectas" },
          { status: 401 }
        );
      }
    }
  }

  await db.collection("usuarios").updateOne(
    { username },
    {
      $set: {
        password: newPassword,
      },
    }
  );

  return Response.json({
    success: true,
  });
}