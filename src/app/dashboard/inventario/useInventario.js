"use client";

import { useEffect, useMemo, useState } from "react";

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

export function useInventario() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [insumoEditandoId, setInsumoEditandoId] = useState(null);

  const [insumoAEliminar, setInsumoAEliminar] = useState(null);

  const [form, setForm] = useState(initialForm);

  const estaEditando = modoFormulario === "editar";
  const showDeleteModal = Boolean(insumoAEliminar);

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
    setMensajeError("");
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
      setMensajeError("Error al cargar el inventario clínico.");
    } finally {
      setLoading(false);
    }
  };

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (mensajeError) {
      setMensajeError("");
    }
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
    setMensajeError("");
    setShowModal(true);
  };

  const abrirFormularioEditar = (insumo) => {
    setMensajeExito("");
    setMensajeError("");
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
    setMensajeError("");
    setShowModal(false);
  };

  const abrirConfirmacionEliminar = (insumo) => {
    setMensajeExito("");
    setMensajeError("");
    setInsumoAEliminar(insumo);
  };

  const cerrarConfirmacionEliminar = () => {
    if (deletingId) return;

    setMensajeError("");
    setInsumoAEliminar(null);
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
      setMensajeExito("");
      setMensajeError(
        estaEditando
          ? "Debes completar los campos obligatorios antes de actualizar el producto."
          : "Debes completar los campos obligatorios antes de registrar el producto."
      );
      return false;
    }

    setMensajeError("");
    return true;
  };

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
        throw new Error(data.error || "Error al guardar el producto");
      }

      mostrarMensaje(
        estaEditando
          ? "Producto actualizado correctamente"
          : "Producto registrado correctamente"
      );

      obtenerInsumos();

      if (!estaEditando) {
        setForm({ ...initialForm });
      }
    } catch (error) {
      console.error(error);
      setMensajeExito("");
      setMensajeError(error.message || "Error al guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  const confirmarEliminarInsumo = async () => {
    if (!insumoAEliminar?._id) return;

    try {
      setDeletingId(insumoAEliminar._id);
      setMensajeError("");

      const response = await fetch("/api/inventario", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: insumoAEliminar._id,
        }),
      });

      const data = await leerJSON(response);

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar el producto");
      }

      setInsumoAEliminar(null);
      mostrarMensaje("Producto eliminado correctamente");

      obtenerInsumos();
    } catch (error) {
      console.error(error);
      setMensajeExito("");
      setMensajeError(error.message || "Error al eliminar el producto.");
    } finally {
      setDeletingId(null);
    }
  };

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

  return {
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
  };
}