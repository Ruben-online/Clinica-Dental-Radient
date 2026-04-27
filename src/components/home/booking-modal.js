"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function BookingModal({
  showBookingModal,
  setShowBookingModal,
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  clientName,
  setClientName,
  clientLastName,
  setClientLastName,
  clientPhone,
  setClientPhone,
  calendarDays,
  weekDays,
  monthNames,
  availableTimes,
  isSameDay,
  isPastDate,
  isSunday,
  formatSelectedDate,
  resetBookingForm,
  handleReserve,
  todayNoTime,
}) {
  return (
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

              {/* Datos */}
              <div className="p-6 md:p-8 bg-[var(--white-warm)]">
                <div className="mb-6">
                  <h3 className="text-2xl text-[var(--charcoal)] mb-2">
                    Datos del cliente
                  </h3>
                </div>

                <div className="space-y-4">
                  <input value={clientName} onChange={(e)=>setClientName(e.target.value)} placeholder="Nombre" className="w-full px-4 py-3 rounded-2xl border"/>
                  <input value={clientLastName} onChange={(e)=>setClientLastName(e.target.value)} placeholder="Apellido" className="w-full px-4 py-3 rounded-2xl border"/>
                  <input value={clientPhone} onChange={(e)=>setClientPhone(e.target.value)} placeholder="Teléfono" className="w-full px-4 py-3 rounded-2xl border"/>
                </div>

                <button
                  onClick={handleReserve}
                  className="mt-6 w-full py-3 bg-[var(--mint)] text-white rounded-full"
                >
                  Confirmar cita
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}   