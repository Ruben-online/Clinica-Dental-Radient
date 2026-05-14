"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Search,
  AlertTriangle,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Boxes,
  Loader2,
  X,
  Save,
  Stethoscope,
} from "lucide-react";

const categoriasInventario = [
  "Material de bioseguridad",
  "Instrumental clínico",
  "Material restaurativo",
  "Medicamentos",
  "Material de ortodoncia",
  "Material de endodoncia",
  "Limpieza y desinfección",
  "Radiología dental",
  "Equipo y repuestos",
  "Otros insumos",
];

const initialForm = {
  nombre: "",
  categoria: "",
  descripcion: "",
  stock: "",
  stockMinimo: "",
  precioCompra: "",
  fechaIngreso: "",
  fechaVencimiento: "",
};

export default function InventarioPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [insumoEditandoId, setInsumoEditandoId] = useState(null);

  const [form, setForm] = useState(initialForm);

  const estaEditando = modoFormulario === "editar";

  /* =========================
     OBTENER INVENTARIO
  ========================= */

  useEffect(() => {
    obtenerInsumos();
  }, []);

  const leerJSON = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("La API no devolvió JSON válido");
    }
  };

  const mostrarMensaje = (mensaje) => {
    setMensajeExito(mensaje);

    setTimeout(() => {
      setMensajeExito("");
    }, 3000);
  };

  const obtenerInsumos = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/inventario");
      const data = await leerJSON(response);

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener inventario");
      }

      setInsumos(data.productos || []);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      alert("Error al cargar el inventario clínico");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MANEJO FORMULARIO
  ========================= */

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const formatearFechaInput = (fecha) => {
    if (!fecha) return "";
    return String(fecha).slice(0, 10);
  };

  const resetForm = () => {
    setForm({ ...initialForm });
    setModoFormulario("crear");
    setInsumoEditandoId(null);
  };

  const abrirFormularioCrear = () => {
    resetForm();
    setMensajeExito("");
    setShowModal(true);
  };

  const abrirFormularioEditar = (insumo) => {
    setMensajeExito("");
    setModoFormulario("editar");
    setInsumoEditandoId(insumo._id);

    setForm({
      nombre: insumo.nombre || "",
      categoria: insumo.categoria || "",
      descripcion: insumo.descripcion || "",
      stock: insumo.stock ?? "",
      stockMinimo: insumo.stockMinimo ?? "",
      precioCompra: insumo.precioCompra ?? "",
      fechaIngreso: formatearFechaInput(insumo.fechaIngreso),
      fechaVencimiento: formatearFechaInput(insumo.fechaVencimiento),
    });

    setShowModal(true);
  };

  const cerrarModal = () => {
    resetForm();
    setMensajeExito("");
    setShowModal(false);
  };

  const validarFormulario = () => {
    if (
      !form.nombre ||
      !form.categoria ||
      form.stock === "" ||
      form.stockMinimo === "" ||
      form.precioCompra === "" ||
      !form.fechaIngreso
    ) {
      alert("Completa los campos obligatorios del insumo clínico");
      return false;
    }

    return true;
  };

  /* =========================
     AGREGAR / EDITAR
  ========================= */

  const handleSubmitForm = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);

      const payload = {
        id: insumoEditandoId,
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        stock: Number(form.stock),
        stockMinimo: Number(form.stockMinimo),
        precioCompra: Number(form.precioCompra),
        fechaIngreso: form.fechaIngreso,
        fechaVencimiento: form.fechaVencimiento,
      };

      const response = await fetch("/api/inventario", {
        method: estaEditando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await leerJSON(response);

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar el insumo");
      }

      mostrarMensaje(
        estaEditando
          ? "Insumo actualizado correctamente"
          : "Insumo agregado correctamente"
      );

      obtenerInsumos();

      if (!estaEditando) {
        setForm({ ...initialForm });
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al guardar el insumo clínico");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     ELIMINAR
  ========================= */

  const handleDeleteInsumo = async (insumo) => {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar "${insumo.nombre}" del inventario clínico?`
    );

    if (!confirmar) return;

    try {
      setDeletingId(insumo._id);

      const response = await fetch("/api/inventario", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: insumo._id,
        }),
      });

      const data = await leerJSON(response);

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el insumo");
      }

      mostrarMensaje("Insumo eliminado correctamente");

      obtenerInsumos();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al eliminar el insumo clínico");
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     FILTROS Y ESTADÍSTICAS
  ========================= */

  const insumosFiltrados = useMemo(() => {
    return insumos.filter((insumo) => {
      const texto = `${insumo.nombre || ""} ${insumo.categoria || ""}`;
      return texto.toLowerCase().includes(search.toLowerCase());
    });
  }, [insumos, search]);

  const totalInsumos = insumos.length;

  const bajoStock = insumos.filter(
    (insumo) => Number(insumo.stock) <= Number(insumo.stockMinimo)
  ).length;

  const agotados = insumos.filter(
    (insumo) => Number(insumo.stock) === 0
  ).length;

  const proximosVencer = insumos.filter((insumo) => {
    if (!insumo.fechaVencimiento) return false;

    const hoy = new Date();
    const vencimiento = new Date(insumo.fechaVencimiento);
    const diferencia = (vencimiento - hoy) / (1000 * 60 * 60 * 24);

    return diferencia <= 30 && diferencia >= 0;
  }).length;

  return (
    <div className="min-h-screen space-y-8 pb-10">
      {/* HEADER */}

      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-[#f4f7fa] p-7">
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-20 -translate-y-28 rounded-full bg-[#7AB5A0]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#7AB5A0]">
              <Stethoscope className="h-4 w-4" />
              Gestión interna de clínica dental
            </p>

            <h1 className="text-3xl font-semibold text-[#1B3A5C]">
              Inventario clínico dental
            </h1>

            <p className="mt-2 max-w-3xl text-gray-500">
              Administra los insumos, medicamentos, instrumental y materiales
              utilizados en la atención diaria de los pacientes.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirFormularioCrear}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#7AB5A0] px-5 py-3 text-white shadow-sm transition-all hover:bg-[#1B3A5C]"
          >
            <Plus className="h-5 w-5" />
            Agregar insumo
          </button>
        </div>
      </div>

      {/* MENSAJE DE ÉXITO FUERA DEL MODAL */}

      {mensajeExito && !showModal && (
        <div className="rounded-2xl border border-[#7AB5A0]/30 bg-[#7AB5A0]/10 px-5 py-4 text-sm font-semibold text-[#1B3A5C] shadow-sm">
          {mensajeExito}
        </div>
      )}

      {/* CARDS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Insumos registrados</p>

              <h2 className="mt-2 text-3xl font-bold text-[#1B3A5C]">
                {totalInsumos}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
              <Boxes className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Existencia baja</p>

              <h2 className="mt-2 text-3xl font-bold text-red-500">
                {bajoStock}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white">
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Sin existencia</p>

              <h2 className="mt-2 text-3xl font-bold text-[#1B3A5C]">
                {agotados}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7AB5A0] text-white">
              <Package className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Próximos a vencer</p>

              <h2 className="mt-2 text-3xl font-bold text-[#1B3A5C]">
                {proximosVencer}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
              <CalendarDays className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* BUSCADOR */}

      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        <div className="absolute right-0 top-0 h-56 w-56 translate-x-24 -translate-y-24 rounded-full bg-[#7AB5A0]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-[#1B3A5C]">
              Buscar insumos clínicos
            </h3>

            <p className="mt-1 text-gray-400">
              Localiza materiales dentales, medicamentos, instrumental o insumos
              de uso diario.
            </p>
          </div>

          <div className="relative w-full lg:max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <Search className="h-5 w-5 text-[#1B3A5C]/50" />
            </div>

            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-transparent bg-[#f4f7fa] py-4 pl-[3.25rem] pr-36 text-[#1B3A5C] shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#7AB5A0] focus:ring-4 focus:ring-[#7AB5A0]/20"
            />

            {search && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="whitespace-nowrap rounded-full bg-[#7AB5A0]/15 px-4 py-2 text-xs font-semibold text-[#1B3A5C]">
                  {insumosFiltrados.length} resultado
                  {insumosFiltrados.length !== 1 && "s"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLA */}

      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#1B3A5C]" />
          </div>
        ) : insumosFiltrados.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h3 className="text-xl font-semibold text-[#1B3A5C]">
              No hay insumos registrados
            </h3>

            <p className="mt-2 text-gray-400">
              Agrega los materiales e insumos que utiliza la clínica.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-black/5 bg-[#f4f7fa]">
                <tr>
                  <th className="px-6 py-4 text-left">Insumo clínico</th>
                  <th className="px-6 py-4 text-left">Categoría</th>
                  <th className="px-6 py-4 text-left">Existencia</th>
                  <th className="px-6 py-4 text-left">Costo</th>
                  <th className="px-6 py-4 text-left">Ingreso</th>
                  <th className="px-6 py-4 text-left">Vencimiento</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {insumosFiltrados.map((insumo) => {
                  const lowStock =
                    Number(insumo.stock) <= Number(insumo.stockMinimo);

                  return (
                    <tr
                      key={insumo._id}
                      className="border-b border-black/5 transition-all hover:bg-[#f9fbfc]"
                    >
                      <td className="px-6 py-5">
                        <h3 className="font-semibold text-[#1B3A5C]">
                          {insumo.nombre}
                        </h3>

                        <p className="text-sm text-gray-400">
                          {insumo.descripcion || "Sin descripción registrada"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-sm font-medium text-[#1B3A5C]">
                          {insumo.categoria}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`font-bold ${
                            lowStock ? "text-red-500" : "text-[#1B3A5C]"
                          }`}
                        >
                          {insumo.stock}
                        </span>

                        <p className="text-xs text-gray-400">
                          Mínimo: {insumo.stockMinimo}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {Number(insumo.precioCompra || 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-5">
                        {insumo.fechaIngreso
                          ? new Date(insumo.fechaIngreso).toLocaleDateString(
                              "es-GT"
                            )
                          : "No registrada"}
                      </td>

                      <td className="px-6 py-5">
                        {insumo.fechaVencimiento
                          ? new Date(
                              insumo.fechaVencimiento
                            ).toLocaleDateString("es-GT")
                          : "No aplica"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => abrirFormularioEditar(insumo)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f7fa] text-[#1B3A5C] transition-all hover:bg-[#7AB5A0] hover:text-white"
                            title="Editar insumo"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteInsumo(insumo)}
                            disabled={deletingId === insumo._id}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            title="Eliminar insumo"
                          >
                            {deletingId === insumo._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL NUEVO / EDITAR */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-3 backdrop-blur-sm">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[86dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl"
          >
            {/* ENCABEZADO */}

            <div className="relative shrink-0 border-b border-black/5 bg-[#f4f7fa] px-5 py-4">
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-12 rounded-full bg-[#7AB5A0]/20 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-xs font-semibold text-[#1B3A5C]">
                    Inventario dental
                  </span>

                  <h2 className="mt-2 text-xl font-semibold text-[#1B3A5C]">
                    {estaEditando ? "Editar insumo" : "Agregar insumo"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {estaEditando
                      ? "Modifica los datos del insumo seleccionado."
                      : "Registra un nuevo insumo para la clínica."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1B3A5C] shadow-sm transition-all hover:bg-red-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* FORMULARIO */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {/* CAMPOS CON SCROLL INTERNO */}

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {mensajeExito && (
                  <div className="mb-4 rounded-xl border border-[#7AB5A0]/30 bg-[#7AB5A0]/10 px-4 py-3 text-sm font-semibold text-[#1B3A5C]">
                    {mensajeExito}
                  </div>
                )}

                <div className="space-y-3">
                  {/* NOMBRE */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                      Nombre del insumo
                    </label>

                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) =>
                        actualizarCampo("nombre", e.target.value)
                      }
                      placeholder="Ej. Guantes, anestesia, resina dental..."
                      className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all placeholder:text-gray-400 focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                    />
                  </div>

                  {/* CATEGORÍA */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                      Categoría clínica
                    </label>

                    <select
                      value={form.categoria}
                      onChange={(e) =>
                        actualizarCampo("categoria", e.target.value)
                      }
                      className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                    >
                      <option value="">Selecciona una categoría</option>

                      {categoriasInventario.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CANTIDADES */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                        Existencia
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) =>
                          actualizarCampo("stock", e.target.value)
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all placeholder:text-gray-400 focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                        Mínimo
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={form.stockMinimo}
                        onChange={(e) =>
                          actualizarCampo("stockMinimo", e.target.value)
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all placeholder:text-gray-400 focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                        Costo
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.precioCompra}
                        onChange={(e) =>
                          actualizarCampo("precioCompra", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all placeholder:text-gray-400 focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                      />
                    </div>
                  </div>

                  {/* FECHAS */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                        Fecha de ingreso
                      </label>

                      <input
                        type="date"
                        value={form.fechaIngreso}
                        onChange={(e) =>
                          actualizarCampo("fechaIngreso", e.target.value)
                        }
                        className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                        Fecha de vencimiento
                      </label>

                      <input
                        type="date"
                        value={form.fechaVencimiento}
                        onChange={(e) =>
                          actualizarCampo("fechaVencimiento", e.target.value)
                        }
                        className="w-full rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                      />
                    </div>
                  </div>

                  {/* DESCRIPCIÓN */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                      Descripción o uso clínico
                    </label>

                    <textarea
                      value={form.descripcion}
                      onChange={(e) =>
                        actualizarCampo("descripcion", e.target.value)
                      }
                      placeholder="Ej. Uso en limpieza, restauración o bioseguridad..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-black/5 bg-[#f8fafb] px-4 py-2.5 text-[#1B3A5C] outline-none transition-all placeholder:text-gray-400 focus:border-[#7AB5A0] focus:bg-white focus:ring-4 focus:ring-[#7AB5A0]/20"
                    />
                  </div>
                </div>
              </div>

              {/* BOTONES FIJOS ABAJO */}

              <div className="shrink-0 border-t border-black/5 bg-white px-5 py-3">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="rounded-xl bg-[#f4f7fa] px-5 py-2.5 font-medium text-[#1B3A5C] transition-all hover:bg-gray-200"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#7AB5A0] px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-[#1B3A5C] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Guardando...
                      </>
                    ) : estaEditando ? (
                      <>
                        <Save className="h-5 w-5" />
                        Guardar cambios
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Agregar insumo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}