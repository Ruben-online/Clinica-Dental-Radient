"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Package,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Wallet,
} from "lucide-react";

export default function DashboardCitasPage() {
  const [citas, setCitas] = useState([]);
  const [inventario, setInventario] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [savingAtencion, setSavingAtencion] = useState(false);
  const [savingAbono, setSavingAbono] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [atencionModalOpen, setAtencionModalOpen] = useState(false);
  const [citaAtender, setCitaAtender] = useState(null);

  const [abonoModalOpen, setAbonoModalOpen] = useState(false);
  const [citaAbonar, setCitaAbonar] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [search, setSearch] = useState("");

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const [form, setForm] = useState({
    clientName: "",
    clientLastName: "",
    clientPhone: "",
    motivo: "",
    date: null,
    time: "",
    status: "pendiente",
  });

  const [formAtencion, setFormAtencion] = useState({
    detalleAtencion: "",
    montoCobrar: "",
    montoPagado: "",
    metodoPago: "efectivo",
    insumosUsados: [],
  });

  const [formAbono, setFormAbono] = useState({
    montoAbonado: "",
  });

  const availableTimes = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "success",
        title: "",
        message: "",
      });
    }, 3500);
  };

  const obtenerIdInsumo = (insumo) => {
    return String(insumo?._id || insumo?.id || insumo?.insumoId || "");
  };

  const obtenerNombreInsumo = (insumo) => {
    return (
      insumo?.nombre ||
      insumo?.name ||
      insumo?.producto ||
      insumo?.insumo ||
      "Insumo sin nombre"
    );
  };

  const obtenerStockInsumo = (insumo) => {
    return Number(
      insumo?.stock ??
        insumo?.existencia ??
        insumo?.cantidad ??
        insumo?.quantity ??
        insumo?.disponible ??
        insumo?.available ??
        0
    );
  };

  const normalizarInventario = (data) => {
    let lista = [];

    if (Array.isArray(data)) {
      lista = data;
    } else if (Array.isArray(data?.data)) {
      lista = data.data;
    } else if (Array.isArray(data?.items)) {
      lista = data.items;
    } else if (Array.isArray(data?.insumos)) {
      lista = data.insumos;
    } else if (Array.isArray(data?.inventario)) {
      lista = data.inventario;
    } else if (Array.isArray(data?.productos)) {
      lista = data.productos;
    }

    return lista
      .map((item) => ({
        ...item,
        _id: obtenerIdInsumo(item),
        nombre: obtenerNombreInsumo(item),
        stock: obtenerStockInsumo(item),
      }))
      .filter((item) => item._id);
  };

  const cargarCitas = async () => {
    try {
      const res = await fetch("/api/citas");
      const data = await res.json();

      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCitas([]);
    }
  };

  const cargarInventario = async () => {
    try {
      setLoadingInventario(true);

      const res = await fetch("/api/inventario");
      const data = await res.json();

      const inventarioNormalizado = normalizarInventario(data);
      setInventario(inventarioNormalizado);
    } catch (error) {
      console.error(error);
      setInventario([]);
      showNotification(
        "error",
        "Error de inventario",
        "No se pudo cargar el inventario."
      );
    } finally {
      setLoadingInventario(false);
    }
  };

  useEffect(() => {
    cargarCitas().finally(() => setLoading(false));
  }, []);

  const formatDateKey = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isSunday = (date) => {
    return date.getDay() === 0;
  };

  const isPastTime = (time) => {
    if (!form.date) return false;

    const today = new Date();
    const selectedDate = new Date(form.date);

    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    if (!isToday) return false;

    const convertTo24 = (hour) => {
      const [timePart, modifier] = hour.split(" ");
      let [hours, minutes] = timePart.split(":");

      hours = parseInt(hours);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return {
        hours,
        minutes: parseInt(minutes),
      };
    };

    const selected = convertTo24(time);

    const nowHours = today.getHours();
    const nowMinutes = today.getMinutes();

    if (selected.hours < nowHours) return true;

    if (selected.hours === nowHours && selected.minutes <= nowMinutes) {
      return true;
    }

    return false;
  };

  const isOccupied = (time) => {
    if (!form.date) return false;

    const key = formatDateKey(form.date);

    return citas.some((c) => {
      const sameDate = c.date?.split("T")[0] === key;
      const sameTime = c.time === time;

      if (editMode && c._id === selectedId) return false;

      return sameDate && sameTime;
    });
  };

  const calendarDays = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();

    const first = new Date(y, m, 1);
    const start = first.getDay();
    const days = new Date(y, m + 1, 0).getDate();

    const arr = [];

    for (let i = 0; i < start; i++) arr.push(null);

    for (let d = 1; d <= days; d++) {
      arr.push(new Date(y, m, d));
    }

    return arr;
  }, [currentMonth]);

  const saldoPendiente = useMemo(() => {
    const cobrar = Number(formAtencion.montoCobrar || 0);
    const pagado = Number(formAtencion.montoPagado || 0);
    const saldo = cobrar - pagado;

    return saldo > 0 ? saldo : 0;
  }, [formAtencion.montoCobrar, formAtencion.montoPagado]);

  const saldoDespuesAbono = useMemo(() => {
    const saldoActual = Number(citaAbonar?.atencion?.saldoPendiente || 0);
    const abono = Number(formAbono.montoAbonado || 0);

    return Math.max(saldoActual - abono, 0);
  }, [citaAbonar, formAbono.montoAbonado]);

  const resetForm = () => {
    setForm({
      clientName: "",
      clientLastName: "",
      clientPhone: "",
      motivo: "",
      date: null,
      time: "",
      status: "pendiente",
    });
  };

  const resetFormAtencion = () => {
    setFormAtencion({
      detalleAtencion: "",
      montoCobrar: "",
      montoPagado: "",
      metodoPago: "efectivo",
      insumosUsados: [],
    });
  };

  const resetFormAbono = () => {
    setFormAbono({
      montoAbonado: "",
    });
  };

  const openCreate = () => {
    setEditMode(false);
    setSelectedId(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (cita) => {
    setEditMode(true);
    setSelectedId(cita._id);

    setForm({
      clientName: cita.clientName || "",
      clientLastName: cita.clientLastName || "",
      clientPhone: cita.clientPhone || "",
      motivo: cita.motivo || "",
      date: new Date(cita.date),
      time: cita.time || "",
      status: cita.status || "pendiente",
    });

    setModalOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      date: formatDateKey(form.date),
    };

    const response = await fetch(
      editMode ? `/api/citas/${selectedId}` : "/api/citas",
      {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showNotification(
        "error",
        "No se pudo guardar",
        data.error || "Ocurrió un error al guardar la cita."
      );
      return;
    }

    setModalOpen(false);
    resetForm();

    await cargarCitas();

    showNotification(
      "success",
      editMode ? "Cita actualizada" : "Cita creada",
      editMode
        ? "La cita fue actualizada correctamente."
        : "La cita fue creada correctamente."
    );
  };

  const updateCitaStatus = async (cita, newStatus) => {
    const payload = {
      clientName: cita.clientName,
      clientLastName: cita.clientLastName,
      clientPhone: cita.clientPhone,
      motivo: cita.motivo || "",
      date: cita.date?.split("T")[0] || cita.date,
      time: cita.time,
      status: newStatus,
    };

    const response = await fetch(`/api/citas/${cita._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      showNotification(
        "error",
        "No se pudo actualizar",
        data.error || "No se pudo actualizar el estado de la cita."
      );
      return;
    }

    await cargarCitas();

    showNotification(
      "success",
      "Estado actualizado",
      `La cita fue marcada como ${newStatus}.`
    );
  };

  const abrirFormularioAtencion = async (cita) => {
    setCitaAtender(cita);
    resetFormAtencion();
    setAtencionModalOpen(true);
    await cargarInventario();
  };

  const cerrarFormularioAtencion = () => {
    setAtencionModalOpen(false);
    setCitaAtender(null);
    resetFormAtencion();
  };

  const abrirFormularioAbono = (cita) => {
    setCitaAbonar(cita);
    resetFormAbono();
    setAbonoModalOpen(true);
  };

  const cerrarFormularioAbono = () => {
    setAbonoModalOpen(false);
    setCitaAbonar(null);
    resetFormAbono();
  };

  const agregarInsumoUsado = () => {
    setFormAtencion((prev) => ({
      ...prev,
      insumosUsados: [
        ...prev.insumosUsados,
        {
          insumoId: "",
          nombre: "",
          cantidad: "",
          stockDisponible: 0,
        },
      ],
    }));
  };

  const actualizarInsumoUsado = (index, campo, valor) => {
    setFormAtencion((prev) => {
      const copia = [...prev.insumosUsados];

      if (campo === "insumoId") {
        const insumo = inventario.find((item) => String(item._id) === valor);

        copia[index] = {
          ...copia[index],
          insumoId: valor,
          nombre: insumo?.nombre || "",
          cantidad: copia[index].cantidad || "",
          stockDisponible: Number(insumo?.stock || 0),
        };
      } else {
        copia[index] = {
          ...copia[index],
          [campo]: valor,
        };
      }

      return {
        ...prev,
        insumosUsados: copia,
      };
    });
  };

  const eliminarInsumoUsado = (index) => {
    setFormAtencion((prev) => ({
      ...prev,
      insumosUsados: prev.insumosUsados.filter((_, i) => i !== index),
    }));
  };

  const guardarAtencion = async () => {
    if (!citaAtender) {
      showNotification(
        "error",
        "Cita no encontrada",
        "No se encontró la cita seleccionada."
      );
      return;
    }

    if (!formAtencion.detalleAtencion.trim()) {
      showNotification(
        "error",
        "Campo obligatorio",
        "Debes ingresar el detalle de lo realizado en la cita."
      );
      return;
    }

    if (
      formAtencion.montoCobrar === "" ||
      Number(formAtencion.montoCobrar) < 0
    ) {
      showNotification(
        "error",
        "Monto inválido",
        "Debes ingresar correctamente el monto a cobrar."
      );
      return;
    }

    if (
      formAtencion.montoPagado === "" ||
      Number(formAtencion.montoPagado) < 0
    ) {
      showNotification(
        "error",
        "Pago inválido",
        "Debes ingresar correctamente el monto pagado por el paciente."
      );
      return;
    }

    for (const item of formAtencion.insumosUsados) {
      if (
        item.insumoId &&
        Number(item.cantidad) > Number(item.stockDisponible)
      ) {
        showNotification(
          "error",
          "Existencia insuficiente",
          `No hay suficiente existencia de ${item.nombre}.`
        );
        return;
      }
    }

    const insumosValidos = formAtencion.insumosUsados
      .filter((item) => item.insumoId && Number(item.cantidad) > 0)
      .map((item) => ({
        insumoId: item.insumoId,
        nombre: item.nombre,
        cantidad: Number(item.cantidad),
      }));

    const payload = {
      citaId: citaAtender._id,
      detalleAtencion: formAtencion.detalleAtencion,
      montoCobrar: Number(formAtencion.montoCobrar),
      montoPagado: Number(formAtencion.montoPagado),
      saldoPendiente,
      metodoPago: formAtencion.metodoPago,
      insumosUsados: insumosValidos,
    };

    try {
      setSavingAtencion(true);

      const response = await fetch("/api/citas/atender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (error) {
        console.error("Respuesta no JSON:", text);

        showNotification(
          "error",
          "Error de respuesta",
          "La API no devolvió una respuesta válida."
        );
        return;
      }

      if (!response.ok) {
        showNotification(
          "error",
          data.error || "No se pudo guardar",
          data.detalle || "No se pudo registrar la atención."
        );
        return;
      }

      await cargarCitas();
      await cargarInventario();

      showNotification(
        "success",
        "Atención guardada",
        "La cita fue marcada como atendida y el inventario fue descontado correctamente."
      );
    } catch (error) {
      console.error("Error al registrar la atención:", error);

      showNotification(
        "error",
        "Error al guardar",
        error.message || "Ocurrió un error al registrar la atención."
      );
    } finally {
      setSavingAtencion(false);
    }
  };

  const guardarAbono = async () => {
    if (!citaAbonar) {
      showNotification(
        "error",
        "Cita no encontrada",
        "No se encontró la cita seleccionada."
      );
      return;
    }

    const saldoPendienteActual = Number(
      citaAbonar?.atencion?.saldoPendiente || 0
    );
    const montoAbonado = Number(formAbono.montoAbonado || 0);

    if (montoAbonado <= 0) {
      showNotification(
        "error",
        "Monto inválido",
        "Debes ingresar un monto mayor a 0."
      );
      return;
    }

    if (montoAbonado > saldoPendienteActual) {
      showNotification(
        "error",
        "Abono mayor al saldo",
        `El abono no puede ser mayor al saldo pendiente de Q ${saldoPendienteActual.toFixed(
          2
        )}.`
      );
      return;
    }

    try {
      setSavingAbono(true);

      const response = await fetch("/api/citas/abonar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citaId: citaAbonar._id,
          montoAbonado,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification(
          "error",
          data.error || "No se pudo registrar el abono",
          data.detalle || "Ocurrió un error al guardar el abono."
        );
        return;
      }

      await cargarCitas();

      setCitaAbonar((prev) =>
        prev
          ? {
              ...prev,
              atencion: {
                ...prev.atencion,
                montoPagado: data.montoPagado,
                saldoPendiente: data.saldoPendiente,
                deudaCancelada: data.deudaCancelada,
              },
            }
          : prev
      );

      showNotification(
        "success",
        data.deudaCancelada ? "Deuda cancelada" : "Abono registrado",
        data.deudaCancelada
          ? "El saldo pendiente fue cancelado correctamente."
          : `El abono fue registrado. Saldo pendiente: Q ${Number(
              data.saldoPendiente || 0
            ).toFixed(2)}.`
      );

      resetFormAbono();

      if (data.deudaCancelada) {
        setTimeout(() => {
          cerrarFormularioAbono();
        }, 1200);
      }
    } catch (error) {
      console.error("Error al registrar abono:", error);

      showNotification(
        "error",
        "Error al registrar abono",
        error.message || "Ocurrió un error al registrar el abono."
      );
    } finally {
      setSavingAbono(false);
    }
  };

  const deleteCita = async (id) => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta cita?");

    if (!confirmDelete) return;

    const response = await fetch(`/api/citas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      showNotification(
        "error",
        "No se pudo eliminar",
        "Ocurrió un error al eliminar la cita."
      );
      return;
    }

    setCitas(citas.filter((c) => c._id !== id));

    showNotification(
      "success",
      "Cita eliminada",
      "La cita fue eliminada correctamente."
    );
  };

  const filteredCitas = citas.filter((c) => {
    const full = `${c.clientName} ${c.clientLastName}`.toLowerCase();

    return (
      full.includes(search.toLowerCase()) || c.clientPhone?.includes(search)
    );
  });

  const getInitials = (name, last) =>
    `${name?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-10">
      {notification.show && (
        <div className="fixed right-6 top-6 z-[9999]">
          <div
            className={`w-[360px] rounded-3xl border p-5 shadow-2xl backdrop-blur-md ${
              notification.type === "success"
                ? "border-[#7AB5A0]/30 bg-white text-[#1B3A5C]"
                : "border-red-200 bg-white text-red-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  notification.type === "success"
                    ? "bg-[#7AB5A0]/15 text-[#7AB5A0]"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>

              <div className="flex-1">
                <h3
                  className={`text-sm font-semibold ${
                    notification.type === "success"
                      ? "text-[#1B3A5C]"
                      : "text-red-500"
                  }`}
                >
                  {notification.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotification({
                    show: false,
                    type: "success",
                    title: "",
                    message: "",
                  })
                }
                className="rounded-xl p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#1B3A5C]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#f4f7fa] to-white border border-black/5 rounded-3xl p-7 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold text-[#1B3A5C]">
            Gestión de citas
          </h1>

          <p className="text-gray-500 mt-2">
            Administra pacientes, horarios y estados de citas
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7AB5A0] text-white"
        >
          <Plus className="w-5 h-5" />
          Nueva cita
        </button>
      </div>

      <div className="bg-white border rounded-3xl p-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente..."
          className="w-full p-4 rounded-2xl border"
        />
      </div>

      <div className="text-xl font-semibold text-[#1B3A5C] px-2">
        Pacientes agendados
      </div>

      <div className="space-y-4">
        {loading ? (
          <Loader2 className="animate-spin mx-auto my-10" />
        ) : filteredCitas.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No hay citas encontradas
          </div>
        ) : (
          filteredCitas.map((cita) => {
            const saldoPendienteCita = Number(
              cita.atencion?.saldoPendiente || 0
            );

            return (
              <div
                key={cita._id}
                className="flex gap-4 p-6 bg-white border rounded-3xl hover:shadow-md transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1B3A5C] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                  {getInitials(cita.clientName, cita.clientLastName)}
                </div>

                <div className="flex-1 text-sm text-gray-700 space-y-1">
                  <p className="font-semibold text-[#1B3A5C] text-lg">
                    {cita.clientName} {cita.clientLastName}
                  </p>

                  <p>
                    <span className="font-medium">Número de teléfono:</span>{" "}
                    {cita.clientPhone}
                  </p>

                  <p>
                    <span className="font-medium">Motivo:</span>{" "}
                    {cita.motivo || "No especificado"}
                  </p>

                  {cita.atencion?.detalleAtencion && (
                    <p>
                      <span className="font-medium">Atención realizada:</span>{" "}
                      {cita.atencion.detalleAtencion}
                    </p>
                  )}

                  {cita.atencion && (
                    <p>
                      <span className="font-medium">Pago:</span>{" "}
                      {Number(cita.atencion.montoPagado || 0).toFixed(2)} de{" "}
                      {Number(cita.atencion.montoCobrar || 0).toFixed(2)} —{" "}
                      {cita.atencion.metodoPago}
                    </p>
                  )}

                  {saldoPendienteCita > 0 && (
                    <p className="text-orange-600 font-medium">
                      Saldo pendiente: Q {saldoPendienteCita.toFixed(2)}
                    </p>
                  )}

                  {cita.atencion?.deudaCancelada && (
                    <p className="text-[#1B3A5C] font-medium">
                      Deuda cancelada
                    </p>
                  )}

                  <p>
                    <span className="font-medium">Fecha:</span> {cita.date}
                  </p>

                  <p>
                    <span className="font-medium">Hora:</span> {cita.time}
                  </p>

                  <p>
                    <span className="font-medium">Estado:</span>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-xs border capitalize ${
                        cita.status === "atendida"
                          ? "bg-[#7AB5A0]/15 text-[#1B3A5C] border-[#7AB5A0]/30"
                          : cita.status === "confirmada"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : cita.status === "cancelada"
                          ? "bg-red-50 text-red-500 border-red-200"
                          : "bg-yellow-50 text-yellow-600 border-yellow-200"
                      }`}
                    >
                      {cita.status || "pendiente"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {(!cita.status || cita.status === "pendiente") && (
                    <button
                      onClick={() => updateCitaStatus(cita, "confirmada")}
                      className="rounded-xl bg-[#7AB5A0]/15 px-3 py-2 text-xs font-semibold text-[#1B3A5C] transition hover:bg-[#7AB5A0] hover:text-white"
                    >
                      Confirmar
                    </button>
                  )}

                  {cita.status === "confirmada" && (
                    <>
                      <button
                        onClick={() => abrirFormularioAtencion(cita)}
                        className="rounded-xl bg-[#1B3A5C] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7AB5A0]"
                      >
                        Atendida
                      </button>

                      <button
                        onClick={() => updateCitaStatus(cita, "cancelada")}
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {saldoPendienteCita > 0 && (
                    <button
                      onClick={() => abrirFormularioAbono(cita)}
                      className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                    >
                      Abonar pendiente
                    </button>
                  )}

                  <button
                    onClick={() => openEdit(cita)}
                    className="w-10 h-10 rounded-xl bg-[#f4f7fa] hover:bg-[#7AB5A0] hover:text-white"
                  >
                    <Pencil className="w-4 h-4 mx-auto" />
                  </button>

                  <button
                    onClick={() => deleteCita(cita._id)}
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-7 py-5 border-b bg-gradient-to-r from-[#f4f7fa] to-white">
              <div>
                <h2 className="text-2xl font-semibold text-[#1B3A5C]">
                  {editMode ? "Editar cita" : "Nueva cita"}
                </h2>
              </div>

              <button onClick={() => setModalOpen(false)}>
                <X />
              </button>
            </div>

            <div className="grid lg:grid-cols-3">
              <div className="p-7 bg-[#f9fbfc] border-r">
                <div className="flex justify-between items-center mb-5">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1
                        )
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>

                  <h3 className="font-semibold text-[#1B3A5C] text-lg">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h3>

                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1
                        )
                      )
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className="text-center text-sm font-semibold text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} />;

                    const selected = form.date && isSameDay(d, form.date);
                    const sunday = isSunday(d);

                    return (
                      <button
                        key={i}
                        disabled={sunday}
                        onClick={() =>
                          setForm({
                            ...form,
                            date: d,
                          })
                        }
                        className={`h-12 rounded-xl border text-sm transition ${
                          sunday
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selected
                            ? "bg-[#7AB5A0] text-white border-[#7AB5A0]"
                            : "hover:bg-[#eef6f3]"
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 border-r">
                <h3 className="font-semibold text-[#1B3A5C] mb-4">
                  Horarios
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {availableTimes.map((time) => {
                    const occupied = isOccupied(time);
                    const selected = form.time === time;
                    const pastTime = isPastTime(time);

                    return (
                      <button
                        key={time}
                        disabled={occupied || pastTime}
                        onClick={() =>
                          setForm({
                            ...form,
                            time,
                          })
                        }
                        className={`p-3 border rounded-xl transition ${
                          occupied || pastTime
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selected
                            ? "bg-[#7AB5A0] text-white border-[#7AB5A0]"
                            : "hover:bg-[#eef6f3]"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 space-y-5">
                <h3 className="font-semibold text-[#1B3A5C]">
                  Datos del paciente
                </h3>

                <input
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientName: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Nombre"
                />

                <input
                  value={form.clientLastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientLastName: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Apellido"
                />

                <input
                  value={form.clientPhone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      clientPhone: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Teléfono"
                />

                <input
                  value={form.motivo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      motivo: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-xl"
                  placeholder="Motivo de la cita"
                />

                {editMode && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1B3A5C]">
                      Estado de la cita
                    </label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-xl text-[#1B3A5C] outline-none"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="atendida">Atendida</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={save}
                  className="w-full bg-[#7AB5A0] text-white py-3 rounded-2xl"
                >
                  {editMode ? "Actualizar cita" : "Crear cita"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {atencionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div
            className="flex w-full max-w-[540px] flex-col overflow-hidden rounded-[36px] bg-white shadow-2xl"
            style={{
              maxHeight: "620px",
              height: "auto",
            }}
          >
            <div className="shrink-0 flex items-start justify-between gap-4 border-b border-black/5 bg-gradient-to-r from-[#f4f7fa] to-white px-5 py-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#7AB5A0]/15 px-3 py-1 text-xs font-semibold text-[#1B3A5C]">
                  <ClipboardList className="h-4 w-4 text-[#7AB5A0]" />
                  Atención clínica
                </span>

                <h2 className="mt-2 text-xl font-semibold text-[#1B3A5C]">
                  Registrar atención
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {citaAtender?.clientName} {citaAtender?.clientLastName}
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormularioAtencion}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1B3A5C] shadow-sm transition hover:bg-red-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
              style={{
                maxHeight: "430px",
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1B3A5C]">
                    Detalle de lo realizado
                  </label>

                  <textarea
                    value={formAtencion.detalleAtencion}
                    onChange={(e) =>
                      setFormAtencion({
                        ...formAtencion,
                        detalleAtencion: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full resize-none rounded-[22px] border border-black/10 bg-[#f9fbfc] p-3 text-sm text-[#1B3A5C] outline-none transition focus:border-[#7AB5A0] focus:ring-4 focus:ring-[#7AB5A0]/20"
                    placeholder="Ej. Limpieza dental, restauración, revisión..."
                  />
                </div>

                <div className="rounded-[26px] border border-black/5 bg-[#f9fbfc] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#7AB5A0]" />

                        <h3 className="text-sm font-semibold text-[#1B3A5C]">
                          Insumos utilizados
                        </h3>
                      </div>

                      <p className="text-xs text-gray-400">
                        Agrega los insumos usados en la cita.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={agregarInsumoUsado}
                      className="inline-flex items-center gap-1 rounded-2xl bg-[#7AB5A0] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1B3A5C]"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar
                    </button>
                  </div>

                  {loadingInventario ? (
                    <div className="flex items-center justify-center rounded-[22px] bg-white py-5">
                      <Loader2 className="h-5 w-5 animate-spin text-[#1B3A5C]" />
                    </div>
                  ) : inventario.length === 0 ? (
                    <div className="rounded-[22px] border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-500">
                      No se encontraron insumos registrados.
                    </div>
                  ) : formAtencion.insumosUsados.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-black/10 bg-white px-4 py-4 text-center">
                      <Package className="mx-auto mb-1 h-6 w-6 text-gray-300" />

                      <p className="text-xs text-gray-400">
                        Aún no se agregaron insumos.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formAtencion.insumosUsados.map((item, index) => {
                        const cantidadMayor =
                          Number(item.cantidad || 0) >
                          Number(item.stockDisponible || 0);

                        return (
                          <div
                            key={index}
                            className="rounded-[22px] border border-black/5 bg-white p-3"
                          >
                            <div className="grid grid-cols-[1fr_80px_38px] gap-2">
                              <select
                                value={item.insumoId}
                                onChange={(e) =>
                                  actualizarInsumoUsado(
                                    index,
                                    "insumoId",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-2xl border border-black/10 bg-white p-2.5 text-xs text-[#1B3A5C] outline-none focus:border-[#7AB5A0]"
                              >
                                <option value="">Selecciona</option>

                                {inventario.map((insumo) => (
                                  <option key={insumo._id} value={insumo._id}>
                                    {insumo.nombre} — Stock: {insumo.stock}
                                  </option>
                                ))}
                              </select>

                              <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(e) =>
                                  actualizarInsumoUsado(
                                    index,
                                    "cantidad",
                                    e.target.value
                                  )
                                }
                                className={`w-full rounded-2xl border p-2.5 text-xs outline-none ${
                                  cantidadMayor
                                    ? "border-red-300 text-red-500"
                                    : "border-black/10 text-[#1B3A5C]"
                                }`}
                                placeholder="Cant."
                              />

                              <button
                                type="button"
                                onClick={() => eliminarInsumoUsado(index)}
                                className="flex h-9 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {item.insumoId && (
                              <div
                                className={`mt-2 flex items-center gap-1.5 rounded-2xl px-2 py-1.5 text-xs font-medium ${
                                  cantidadMayor
                                    ? "bg-red-50 text-red-500"
                                    : "bg-[#7AB5A0]/10 text-[#1B3A5C]"
                                }`}
                              >
                                {cantidadMayor ? (
                                  <AlertTriangle className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}

                                {cantidadMayor
                                  ? `Stock disponible: ${item.stockDisponible}`
                                  : `Disponible: ${item.stockDisponible}`}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-[26px] border border-black/5 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-[#7AB5A0]" />

                    <h3 className="text-sm font-semibold text-[#1B3A5C]">
                      Información de pago
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#1B3A5C]">
                        Monto a cobrar
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formAtencion.montoCobrar}
                        onChange={(e) =>
                          setFormAtencion({
                            ...formAtencion,
                            montoCobrar: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-black/10 bg-[#f9fbfc] p-2.5 text-sm text-[#1B3A5C] outline-none focus:border-[#7AB5A0]"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#1B3A5C]">
                        Monto pagado
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formAtencion.montoPagado}
                        onChange={(e) =>
                          setFormAtencion({
                            ...formAtencion,
                            montoPagado: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-black/10 bg-[#f9fbfc] p-2.5 text-sm text-[#1B3A5C] outline-none focus:border-[#7AB5A0]"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#1B3A5C]">
                        Saldo pendiente
                      </label>

                      <div
                        className={`rounded-2xl border p-2.5 text-sm font-semibold ${
                          saldoPendiente > 0
                            ? "border-red-100 bg-red-50 text-red-500"
                            : "border-[#7AB5A0]/20 bg-[#7AB5A0]/10 text-[#1B3A5C]"
                        }`}
                      >
                        {saldoPendiente.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#1B3A5C]">
                        Método de pago
                      </label>

                      <div className="relative">
                        <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7AB5A0]" />

                        <select
                          value={formAtencion.metodoPago}
                          onChange={(e) =>
                            setFormAtencion({
                              ...formAtencion,
                              metodoPago: e.target.value,
                            })
                          }
                          className="w-full rounded-2xl border border-black/10 bg-[#f9fbfc] py-2.5 pl-11 pr-4 text-sm text-[#1B3A5C] outline-none transition focus:border-[#7AB5A0] focus:ring-4 focus:ring-[#7AB5A0]/20"
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="tarjeta">Tarjeta</option>
                          <option value="deposito monetario">
                            Depósito monetario
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-[#7AB5A0]/20 bg-[#7AB5A0]/10 p-4">
                  <div className="grid grid-cols-4 gap-2 text-xs text-[#1B3A5C]">
                    <div>
                      <p className="text-gray-500">Insumos</p>
                      <p className="font-semibold">
                        {formAtencion.insumosUsados.length}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Cobro</p>
                      <p className="font-semibold">
                        {Number(formAtencion.montoCobrar || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Pagado</p>
                      <p className="font-semibold">
                        {Number(formAtencion.montoPagado || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Pendiente</p>
                      <p
                        className={`font-semibold ${
                          saldoPendiente > 0
                            ? "text-red-500"
                            : "text-[#1B3A5C]"
                        }`}
                      >
                        {saldoPendiente.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-black/5 bg-white px-5 py-4">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarFormularioAtencion}
                  className="rounded-2xl bg-[#f4f7fa] px-5 py-2.5 text-sm font-semibold text-[#1B3A5C] transition hover:bg-gray-200"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={guardarAtencion}
                  disabled={savingAtencion}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7AB5A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B3A5C] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingAtencion ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Guardar atención
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {abonoModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-[460px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="border-b border-black/5 bg-gradient-to-r from-[#f4f7fa] to-white px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    <Wallet className="h-4 w-4" />
                    Pago pendiente
                  </span>

                  <h2 className="mt-2 text-xl font-semibold text-[#1B3A5C]">
                    Registrar abono
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {citaAbonar?.clientName} {citaAbonar?.clientLastName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cerrarFormularioAbono}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1B3A5C] shadow-sm transition hover:bg-red-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="rounded-[24px] border border-orange-100 bg-orange-50 p-4">
                <p className="text-xs font-semibold text-orange-600">
                  Saldo pendiente actual
                </p>

                <p className="mt-1 text-2xl font-bold text-orange-600">
                  Q {Number(citaAbonar?.atencion?.saldoPendiente || 0).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1B3A5C]">
                  Monto abonado
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formAbono.montoAbonado}
                  onChange={(e) =>
                    setFormAbono({
                      ...formAbono,
                      montoAbonado: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-black/10 bg-[#f9fbfc] p-3 text-sm text-[#1B3A5C] outline-none transition focus:border-[#7AB5A0] focus:ring-4 focus:ring-[#7AB5A0]/20"
                  placeholder="Ej. 100.00"
                />
              </div>

              <div className="rounded-[24px] border border-black/5 bg-[#f9fbfc] p-4">
                <p className="text-xs font-semibold text-gray-400">
                  Saldo después del abono
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    saldoDespuesAbono > 0 ? "text-orange-600" : "text-[#1B3A5C]"
                  }`}
                >
                  Q {saldoDespuesAbono.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t border-black/5 bg-white px-5 py-4">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarFormularioAbono}
                  className="rounded-2xl bg-[#f4f7fa] px-5 py-2.5 text-sm font-semibold text-[#1B3A5C] transition hover:bg-gray-200"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={guardarAbono}
                  disabled={savingAbono}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7AB5A0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B3A5C] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingAbono ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Guardar abono
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