"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  Clock,
  Award,
  Shield,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function Home() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

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

  const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const today = new Date();
  const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isPastDate = (date) => {
    if (!date) return false;
    return date < todayNoTime;
  };

  const isSunday = (date) => {
    if (!date) return false;
    return date.getDay() === 0;
  };

  const formatSelectedDate = (date) => {
    if (!date) return "";
    return `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const resetBookingForm = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setClientName("");
    setClientLastName("");
    setClientPhone("");
  };

  const handleReserve = () => {
    if (!selectedDate || !selectedTime || !clientName || !clientLastName || !clientPhone) return;

    alert(
      `Cita seleccionada:
Nombre: ${clientName}
Apellido: ${clientLastName}
Teléfono: ${clientPhone}
Fecha: ${formatSelectedDate(selectedDate)}
Hora: ${selectedTime}`
    );

    setShowBookingModal(false);
    resetBookingForm();
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full bg-[var(--white-warm)]/95 backdrop-blur-sm z-50 border-b border-[var(--border)] shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/Radient.png"
                alt="Logo Radient"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <span
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-2xl text-[var(--charcoal)]"
            >
              Radient Clinica Dental
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#inicio"
              className="text-[var(--charcoal)] hover:text-[var(--mint)] transition-colors"
            >
              Inicio
            </a>
            <a
              href="#servicios"
              className="text-[var(--charcoal)] hover:text-[var(--mint)] transition-colors"
            >
              Servicios
            </a>
            <a
              href="#ubicacion"
              className="text-[var(--charcoal)] hover:text-[var(--mint)] transition-colors"
            >
              Ubicación
            </a>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[var(--mint)] text-white rounded-full hover:bg-[var(--navy)] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section id="inicio" className="pt-24 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-5xl md:text-7xl text-[var(--charcoal)] mb-6 leading-tight"
            >
              Tu sonrisa,
              <br />
              <span className="text-[var(--mint)]">nuestra pasión</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-[var(--navy)]/80 mb-8 max-w-md leading-relaxed"
            >
              Cuidado dental de excelencia con tecnología de vanguardia y un
              equipo comprometido con tu bienestar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-8 py-4 bg-[var(--mint)] text-white rounded-full hover:bg-[var(--navy)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Agenda tu Cita
              </button>

              <a
                href="#servicios"
                className="px-8 py-4 border-2 border-[var(--mint)] text-[var(--mint)] rounded-full hover:bg-[var(--mint)] hover:text-white transition-all duration-300"
              >
                Conoce Más
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1771270731007-5998fa136d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Clínica dental moderna"
                className="w-full h-[600px] object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -bottom-8 -left-2 md:-left-8 bg-[var(--navy)] text-white p-6 rounded-3xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8" />
                <div>
                  <div
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-3xl"
                  >
                    15+
                  </div>
                  <div className="text-sm opacity-90">Años de experiencia</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24 bg-[var(--white-warm)]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-4xl md:text-5xl text-[var(--charcoal)] mb-4"
            >
              Nuestros Servicios
            </h2>
            <p className="text-[var(--navy)]/80 text-lg max-w-2xl mx-auto">
              Ofrecemos una amplia gama de tratamientos dentales con alta
              calidad y atención personalizada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Smile,
                title: "Odontología General",
                description:
                  "Tratamientos preventivos y curativos para mantener tu salud bucal óptima.",
                delay: 0.1,
              },
              {
                icon: Shield,
                title: "Ortodoncia",
                description:
                  "Alineación dental con tecnología moderna y resultados confiables.",
                delay: 0.2,
              },
              {
                icon: Award,
                title: "Estética Dental",
                description:
                  "Blanqueamiento y diseño de sonrisa para mejorar tu imagen.",
                delay: 0.3,
              },
              {
                icon: Clock,
                title: "Urgencias 24/7",
                description:
                  "Atención inmediata para emergencias dentales en cualquier momento.",
                delay: 0.4,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: service.delay }}
                whileHover={{ y: -10 }}
                className="bg-[var(--cream)] p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-[var(--border)]"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--mint)] flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-xl text-[var(--charcoal)] mb-3"
                >
                  {service.title}
                </h3>
                <p className="text-[var(--navy)]/80 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="py-24 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1729162128021-f37dca3ff30d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Doctor"
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg mt-12">
                <img
                  src="https://images.unsplash.com/photo-1770134223774-13b735e29201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Equipo médico"
                  className="w-full h-72 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2
                style={{ fontFamily: "var(--font-heading)" }}
                className="text-4xl md:text-5xl text-[var(--charcoal)] mb-6"
              >
                Sobre Nosotros
              </h2>

              <p className="text-[var(--navy)]/80 text-lg mb-6 leading-relaxed">
                Con más de 15 años de experiencia, DentalCare es referente en
                odontología moderna y atención personalizada. Nuestro equipo
                está comprometido con tu bienestar y sonrisa.
              </p>

              <p className="text-[var(--navy)]/80 text-lg mb-8 leading-relaxed">
                Utilizamos tecnología de última generación y técnicas
                innovadoras para garantizar tratamientos efectivos, seguros y
                cómodos para cada paciente.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--mint)] mt-2"></div>
                  <div>
                    <div
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-xl text-[var(--charcoal)]"
                    >
                      5,000+
                    </div>
                    <div className="text-[var(--navy)]/80">
                      Pacientes felices
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--navy)] mt-2"></div>
                  <div>
                    <div
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-xl text-[var(--charcoal)]"
                    >
                      98%
                    </div>
                    <div className="text-[var(--navy)]/80">Satisfacción</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="py-24 bg-[var(--white-warm)]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-4xl md:text-5xl text-[var(--charcoal)] mb-4"
            >
              Encuéntranos
            </h2>
            <p className="text-[var(--navy)]/80 text-lg">
              Visítanos en nuestra clínica o contáctanos para más información.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden shadow-xl h-96"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.2207468043835!2d-91.50630172507726!3d14.537223185941627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858ec3b91ca7690d%3A0x7a85ae762341073f!2sRadient%20Cl%C3%ADnica%20Dental!5e1!3m2!1ses-419!2sgt!4v1776293841759!5m2!1ses-419!2sgt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Ubicación de DentalCare"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--mint)] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-xl text-[var(--charcoal)] mb-2"
                  >
                    Dirección
                  </h3>
                  <p className="text-[var(--navy)]/80 leading-relaxed">
                    Radient Clínica Dental
                    <br />
                    Quetzaltenango, Guatemala
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-xl text-[var(--charcoal)] mb-2"
                  >
                    Teléfono
                  </h3>
                  <p className="text-[var(--navy)]/80">
                    +502 0000-0000
                    <br />
                    +502 1111-1111
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--mint)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-xl text-[var(--charcoal)] mb-2"
                  >
                    Email
                  </h3>
                  <p className="text-[var(--navy)]/80">
                    info@radient.com
                    <br />
                    contacto@radient.com
                  </p>
                </div>
              </div>

              <div className="bg-[var(--cream)] p-6 rounded-2xl border border-[var(--border)]">
                <h3
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-xl text-[var(--charcoal)] mb-3"
                >
                  Horario de Atención
                </h3>
                <div className="space-y-2 text-[var(--navy)]/80">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal agenda */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-6xl bg-[var(--white-warm)] rounded-[2rem] shadow-2xl border border-[var(--border)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                <div>
                  <h2
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-3xl text-[var(--charcoal)]"
                  >
                    Agenda tu Cita
                  </h2>
                  <p className="text-[var(--navy)]/75 mt-1">
                    Selecciona una fecha, un horario y completa tus datos
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    resetBookingForm();
                  }}
                  className="w-11 h-11 rounded-full bg-[var(--cream)] hover:bg-[var(--mint)] hover:text-white transition-all duration-300 flex items-center justify-center text-[var(--charcoal)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-0">
                {/* Calendario */}
                <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--cream)]">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      className="w-11 h-11 rounded-full border border-[var(--border)] bg-white hover:bg-[var(--mint)] hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <h3
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-2xl text-[var(--charcoal)]"
                    >
                      {monthNames[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </h3>

                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      className="w-11 h-11 rounded-full border border-[var(--border)] bg-white hover:bg-[var(--mint)] hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-[var(--navy)]/70 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={index} className="h-12" />;
                      }

                      const disabled = isPastDate(date) || isSunday(date);
                      const selected = isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, todayNoTime);

                      return (
                        <button
                          key={index}
                          onClick={() => !disabled && setSelectedDate(date)}
                          disabled={disabled}
                          className={`h-12 rounded-2xl text-sm font-medium transition-all duration-300 border
                            ${
                              selected
                                ? "bg-[var(--mint)] text-white border-[var(--mint)] shadow-md"
                                : isToday
                                ? "bg-white text-[var(--charcoal)] border-[var(--mint)]"
                                : "bg-white text-[var(--charcoal)] border-[var(--border)]"
                            }
                            ${
                              disabled
                                ? "opacity-35 cursor-not-allowed"
                                : "hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)]"
                            }
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-sm text-[var(--navy)]/65 mt-5">
                    Los domingos y las fechas pasadas no están disponibles.
                  </p>
                </div>

                {/* Horarios */}
                <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                  <div className="mb-6">
                    <h3
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-2xl text-[var(--charcoal)] mb-2"
                    >
                      Horarios disponibles
                    </h3>
                    <p className="text-[var(--navy)]/75">
                      {selectedDate
                        ? `Fecha seleccionada: ${formatSelectedDate(selectedDate)}`
                        : "Selecciona primero una fecha en el calendario"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => selectedDate && setSelectedTime(time)}
                        disabled={!selectedDate}
                        className={`px-4 py-3 rounded-2xl border transition-all duration-300 text-sm font-medium
                          ${
                            selectedTime === time
                              ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                              : "bg-[var(--cream)] text-[var(--charcoal)] border-[var(--border)]"
                          }
                          ${
                            !selectedDate
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-[var(--mint)] hover:text-white hover:border-[var(--mint)]"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Datos del cliente */}
                <div className="p-6 md:p-8 bg-[var(--white-warm)]">
                  <div className="mb-6">
                    <h3
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-2xl text-[var(--charcoal)] mb-2"
                    >
                      Datos del cliente
                    </h3>
                    <p className="text-[var(--navy)]/75">
                      Completa la información para confirmar la cita
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nombre"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--cream)] text-[var(--charcoal)] outline-none focus:border-[var(--mint)]"
                    />

                    <input
                      type="text"
                      value={clientLastName}
                      onChange={(e) => setClientLastName(e.target.value)}
                      placeholder="Apellido"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--cream)] text-[var(--charcoal)] outline-none focus:border-[var(--mint)]"
                    />

                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Teléfono"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--cream)] text-[var(--charcoal)] outline-none focus:border-[var(--mint)]"
                    />
                  </div>

                  <div className="mt-8 bg-[var(--cream)] border border-[var(--border)] rounded-3xl p-5">
                    <h4
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-xl text-[var(--charcoal)] mb-3"
                    >
                      Resumen de tu cita
                    </h4>

                    <div className="space-y-2 text-[var(--navy)]/80">
                      <p>
                        <span className="font-semibold">Nombre:</span>{" "}
                        {clientName || "No ingresado"}
                      </p>
                      <p>
                        <span className="font-semibold">Apellido:</span>{" "}
                        {clientLastName || "No ingresado"}
                      </p>
                      <p>
                        <span className="font-semibold">Teléfono:</span>{" "}
                        {clientPhone || "No ingresado"}
                      </p>
                      <p>
                        <span className="font-semibold">Fecha:</span>{" "}
                        {selectedDate
                          ? formatSelectedDate(selectedDate)
                          : "No seleccionada"}
                      </p>
                      <p>
                        <span className="font-semibold">Hora:</span>{" "}
                        {selectedTime || "No seleccionada"}
                      </p>
                    </div>

                    <button
                      onClick={handleReserve}
                      disabled={
                        !selectedDate ||
                        !selectedTime ||
                        !clientName ||
                        !clientLastName ||
                        !clientPhone
                      }
                      className={`mt-5 w-full py-3 rounded-full font-medium transition-all duration-300
                        ${
                          selectedDate &&
                          selectedTime &&
                          clientName &&
                          clientLastName &&
                          clientPhone
                            ? "bg-[var(--mint)] text-white hover:bg-[var(--navy)] shadow-md"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Confirmar cita
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[var(--charcoal)] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/Radient Blanco.png"
                alt="Logo Radient"
                width={50}
                height={50}
              />
            </div>

            <span
              style={{ fontFamily: "var(--font-heading)" }}
              className="text-3xl"
            >
              Radient
            </span>
          </div>

          <p className="text-gray-300 mb-4">
            Tu sonrisa es nuestra prioridad. Tecnología avanzada, atención
            personalizada.
          </p>
          <p className="text-gray-400 text-sm">
            © 2026 Radient. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}