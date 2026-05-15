import { connectDB } from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const db = await connectDB();
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "No file" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), "public", filename);

    await writeFile(filepath, buffer);

    const avatarUrl = `/${filename}`;

    await db.collection("usuarios").updateOne(
      { username: "admin" },
      {
        $set: {
          avatar: avatarUrl,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      avatar: avatarUrl,
    });
  } catch (error) {
    return Response.json(
      { error: "Upload error" },
      { status: 500 }
    );
  }
}