import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/mongodb";

const COLLECTION_NAME = "inventario";

/* =========================
   OBTENER COLECCIÓN
========================= */

async function getInventarioCollection() {
  const connection = await connectDB();

  if (!connection) {
    throw new Error("No se pudo conectar a MongoDB");
  }

  if (typeof connection.collection === "function") {
    return connection.collection(COLLECTION_NAME);
  }

  if (typeof connection.db === "function") {
    const db = connection.db(process.env.MONGODB_DB || "radient");
    return db.collection(COLLECTION_NAME);
  }

  if (connection.db && typeof connection.db.collection === "function") {
    return connection.db.collection(COLLECTION_NAME);
  }

  if (
    connection.connection &&
    connection.connection.db &&
    typeof connection.connection.db.collection === "function"
  ) {
    return connection.connection.db.collection(COLLECTION_NAME);
  }

  throw new Error("La conexión a MongoDB no devolvió una base de datos válida");
}

/* =========================
   GET - OBTENER INVENTARIO
========================= */

export async function GET() {
  try {
    const collection = await getInventarioCollection();

    const productos = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      productos,
    });
  } catch (error) {
    console.error("Error al obtener inventario:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error al obtener el inventario clínico",
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST - AGREGAR INSUMO
========================= */

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      nombre,
      categoria,
      descripcion,
      stock,
      stockMinimo,
      precioCompra,
      fechaIngreso,
      fechaVencimiento,
    } = body;

    if (
      !nombre ||
      !categoria ||
      stock === undefined ||
      stockMinimo === undefined ||
      precioCompra === undefined ||
      !fechaIngreso
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan datos obligatorios del insumo clínico",
        },
        { status: 400 }
      );
    }

    const collection = await getInventarioCollection();

    const nuevoInsumo = {
      nombre,
      categoria,
      descripcion: descripcion || "",
      stock: Number(stock),
      stockMinimo: Number(stockMinimo),
      precioCompra: Number(precioCompra),
      fechaIngreso,
      fechaVencimiento: fechaVencimiento || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(nuevoInsumo);

    return NextResponse.json({
      ok: true,
      message: "Insumo clínico registrado correctamente",
    });
  } catch (error) {
    console.error("Error al registrar insumo:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error al registrar el insumo clínico",
      },
      { status: 500 }
    );
  }
}

/* =========================
   PUT - EDITAR INSUMO
========================= */

export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      id,
      nombre,
      categoria,
      descripcion,
      stock,
      stockMinimo,
      precioCompra,
      fechaIngreso,
      fechaVencimiento,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID del insumo no recibido",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID del insumo no válido",
        },
        { status: 400 }
      );
    }

    if (
      !nombre ||
      !categoria ||
      stock === undefined ||
      stockMinimo === undefined ||
      precioCompra === undefined ||
      !fechaIngreso
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan datos obligatorios para actualizar el insumo",
        },
        { status: 400 }
      );
    }

    const collection = await getInventarioCollection();

    const resultado = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          nombre,
          categoria,
          descripcion: descripcion || "",
          stock: Number(stock),
          stockMinimo: Number(stockMinimo),
          precioCompra: Number(precioCompra),
          fechaIngreso,
          fechaVencimiento: fechaVencimiento || "",
          updatedAt: new Date(),
        },
      }
    );

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Insumo no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Insumo clínico actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar insumo:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error al actualizar el insumo clínico",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE - ELIMINAR INSUMO
========================= */

export async function DELETE(req) {
  try {
    let id = null;

    try {
      const body = await req.json();
      id = body.id;
    } catch {
      const { searchParams } = new URL(req.url);
      id = searchParams.get("id");
    }

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID del insumo no recibido",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID del insumo no válido",
        },
        { status: 400 }
      );
    }

    const collection = await getInventarioCollection();

    const resultado = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Insumo no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Insumo eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar insumo:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error al eliminar el insumo clínico",
      },
      { status: 500 }
    );
  }
}