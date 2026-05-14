"use client";

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
  CheckCircle,
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

export default function InventarioView({ inventario }) {
  const {
    insumosFiltrados,
    loading,
    saving,
    deletingId,

    mensajeExito,
    mensajeError,

    search,
    setSearch,

    showModal,
    showDeleteModal,
    estaEditando,

    form,
    actualizarCampo,

    insumoAEliminar,

    totalInsumos,
    bajoStock,
    agotados,
    proximosVencer,

    abrirFormularioCrear,
    abrirFormularioEditar,
    cerrarModal,

    abrirConfirmacionEliminar,
    cerrarConfirmacionEliminar,
    confirmarEliminarInsumo,

    handleSubmitForm,
  } = inventario;

  return (
    <div className="min-h-screen space-y-8 pb-10">
      {/* HEADER */}

      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-7">
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-24 -translate-y-28 rounded-full bg-[#7AB5A0]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-16 translate-y-16 rounded-full bg-[#1B3A5C]/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7AB5A0]/15 px-4 py-2 text-sm font-semibold text-[#1B3A5C]">
              <Stethoscope className="h-4 w-4 text-[#7AB5A0]" />
              Gestión interna de clínica dental
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-[#1B3A5C] sm:text-4xl">
              Inventario clínico dental
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Administra de forma ordenada los insumos, medicamentos,
              instrumental y materiales utilizados en la atención diaria de los
              pacientes.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-3xl bg-[#f4f7fa] p-4 sm:w-auto sm:min-w-[260px]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
                <Package className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1B3A5C]">
                  Nuevo registro
                </p>
                <p className="text-xs text-gray-400">
                  Agrega insumos al inventario
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={abrirFormularioCrear}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7AB5A0] px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-[#1B3A5C]"
            >
              <Plus className="h-5 w-5" />
              Agregar insumo
            </button>
          </div>
        </div>
      </div>

      {/* MENSAJES */}

      {mensajeExito && !showModal && !showDeleteModal && (
        <div className="rounded-2xl border border-[#7AB5A0]/30 bg-[#7AB5A0]/10 px-5 py-4 text-sm font-semibold text-[#1B3A5C] shadow-sm">
          {mensajeExito}
        </div>
      )}

      {mensajeError && !showModal && !showDeleteModal && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
          {mensajeError}
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

              <h2 className="mt-2 text-3xl font-bold text-[#1B3A5C]">
                {bajoStock}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
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

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white">
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

      <div className="rounded-[2rem] border border-black/5 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-xs font-semibold text-[#1B3A5C]">
              Consulta rápida
            </div>

            <h3 className="text-2xl font-semibold text-[#1B3A5C]">
              Buscar insumos clínicos
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Encuentra rápidamente materiales dentales, medicamentos,
              instrumental o insumos registrados en la clínica.
            </p>
          </div>

          <div className="w-full xl:max-w-2xl">
            <div className="flex min-h-[4.75rem] items-center gap-4 rounded-[1.6rem] border border-black/5 bg-[#f4f7fa] px-5 py-3 shadow-sm transition-all focus-within:border-[#7AB5A0] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#7AB5A0]/20">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1B3A5C] shadow-sm">
                <Search className="h-5 w-5" />
              </div>

              <input
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full min-w-0 bg-transparent text-sm text-[#1B3A5C] outline-none placeholder:text-gray-400 sm:text-base"
              />

              {search && (
                <span className="hidden shrink-0 rounded-full bg-[#7AB5A0]/15 px-4 py-2 text-xs font-semibold text-[#1B3A5C] md:inline-flex">
                  {insumosFiltrados.length} resultado
                  {insumosFiltrados.length !== 1 && "s"}
                </span>
              )}
            </div>

            {search && (
              <div className="mt-3 flex md:hidden">
                <span className="rounded-full bg-[#7AB5A0]/15 px-4 py-2 text-xs font-semibold text-[#1B3A5C]">
                  {insumosFiltrados.length} resultado
                  {insumosFiltrados.length !== 1 && "s"} encontrado
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

                  const textoPrincipal = lowStock
                    ? "text-red-500"
                    : "text-[#1B3A5C]";

                  const textoSecundario = lowStock
                    ? "text-red-400"
                    : "text-gray-400";

                  const categoriaClase = lowStock
                    ? "rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-500"
                    : "rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-sm font-medium text-[#1B3A5C]";

                  return (
                    <tr
                      key={insumo._id}
                      className="border-b border-black/5 transition-all hover:bg-[#f9fbfc]"
                    >
                      <td className="px-6 py-5">
                        <h3 className={`font-semibold ${textoPrincipal}`}>
                          {insumo.nombre}
                        </h3>

                        <p className={`text-sm ${textoSecundario}`}>
                          {insumo.descripcion || "Sin descripción registrada"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className={categoriaClase}>
                          {insumo.categoria}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {lowStock && (
                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500"
                              title="Existencia baja"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${textoPrincipal}`}>
                                {insumo.stock}
                              </span>

                              {lowStock && (
                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                                  Bajo
                                </span>
                              )}
                            </div>

                            <p className={`text-xs ${textoSecundario}`}>
                              Mínimo: {insumo.stockMinimo}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className={`px-6 py-5 font-medium ${textoPrincipal}`}>
                        {Number(insumo.precioCompra || 0).toFixed(2)}
                      </td>

                      <td className={`px-6 py-5 ${textoPrincipal}`}>
                        {insumo.fechaIngreso
                          ? new Date(insumo.fechaIngreso).toLocaleDateString(
                              "es-GT"
                            )
                          : "No registrada"}
                      </td>

                      <td className={`px-6 py-5 ${textoPrincipal}`}>
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
                            title="Editar producto"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirConfirmacionEliminar(insumo)}
                            disabled={deletingId === insumo._id}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            title="Eliminar producto"
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
            <div className="relative shrink-0 border-b border-black/5 bg-[#f4f7fa] px-5 py-4">
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-12 rounded-full bg-[#7AB5A0]/20 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-xs font-semibold text-[#1B3A5C]">
                    Inventario dental
                  </span>

                  <h2 className="mt-2 text-xl font-semibold text-[#1B3A5C]">
                    {estaEditando ? "Editar producto" : "Agregar producto"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {estaEditando
                      ? "Modifica los datos del producto seleccionado."
                      : "Registra un nuevo producto para la clínica."}
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

            {mensajeExito && (
              <div className="shrink-0 border-b border-[#7AB5A0]/20 bg-[#ECF8F3] px-5 py-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#1B3A5C] shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7AB5A0]/20 text-[#1B3A5C]">
                    <CheckCircle className="h-5 w-5" />
                  </div>

                  <span>{mensajeExito}</span>
                </div>
              </div>
            )}

            {mensajeError && (
              <div className="shrink-0 border-b border-red-200 bg-red-50 px-5 py-3">
                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <span>{mensajeError}</span>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1B3A5C]">
                      Nombre del producto
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
                        Agregar producto
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 px-3 py-3 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl">
            <div className="relative border-b border-black/5 bg-[#f4f7fa] px-5 py-4">
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-12 rounded-full bg-red-200/40 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Confirmar eliminación
                  </span>

                  <h2 className="mt-2 text-xl font-semibold text-[#1B3A5C]">
                    Eliminar producto
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Esta acción eliminará el registro del inventario clínico.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cerrarConfirmacionEliminar}
                  disabled={Boolean(deletingId)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1B3A5C] shadow-sm transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {mensajeError && (
              <div className="border-b border-red-200 bg-red-50 px-5 py-3">
                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <span>{mensajeError}</span>
                </div>
              </div>
            )}

            <div className="px-5 py-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 className="h-7 w-7" />
              </div>

              <h3 className="text-center text-lg font-semibold leading-7 text-[#1B3A5C]">
                ¿Seguro que deseas eliminar{" "}
                <span className="text-red-500">
                  "{insumoAEliminar?.nombre || "este producto"}"
                </span>{" "}
                del inventario clínico?
              </h3>

              <p className="mt-3 text-center text-sm leading-6 text-gray-400">
                Si confirmas, el producto dejará de aparecer en la lista del
                inventario.
              </p>
            </div>

            <div className="border-t border-black/5 bg-white px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <button
                  type="button"
                  onClick={cerrarConfirmacionEliminar}
                  disabled={Boolean(deletingId)}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-[#f4f7fa] px-6 text-sm font-semibold text-[#1B3A5C] transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-36"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmarEliminarInsumo}
                  disabled={Boolean(deletingId)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-36"
                >
                  {deletingId ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                      <span className="font-semibold text-red-600">
                        Eliminando...
                      </span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-600">
                        Aceptar
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}