"use client";

import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import About from "@/components/home/about";
import Location from "@/components/home/location";
import Footer from "@/components/layout/footer";
import BookingModal from "@/components/home/booking-modal";
import { useMemo, useState } from "react";

export default function Home() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [bookingMessage, setBookingMessage] = useState("");

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

  const todayNoTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

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

    return `${date.getDate()} de ${
      monthNames[date.getMonth()]
    } de ${date.getFullYear()}`;
  };

  const resetBookingForm = () => {
    setSelectedDate(null);
    setSelectedTime("");
    setClientName("");
    setClientLastName("");
    setClientPhone("");
  };

  const handleReserve = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !clientName ||
      !clientLastName ||
      !clientPhone
    ) {
      return;
    }

    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          clientLastName,
          clientPhone,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingMessage(
          data.error || "Error al reservar cita"
        );

        return;
      }

      setBookingMessage(
        "Cita reservada correctamente. Nos pondremos en contacto contigo pronto."
      );

      resetBookingForm();
    } catch (error) {
      console.error(error);

      setBookingMessage("Error del servidor");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] overflow-x-hidden">
      <Navbar />

      <Hero setShowBookingModal={setShowBookingModal} />

      <Services />

      <About />

      <Location />

      <Footer />

      <BookingModal
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        clientName={clientName}
        setClientName={setClientName}
        clientLastName={clientLastName}
        setClientLastName={setClientLastName}
        clientPhone={clientPhone}
        setClientPhone={setClientPhone}
        calendarDays={calendarDays}
        weekDays={weekDays}
        monthNames={monthNames}
        availableTimes={availableTimes}
        isSameDay={isSameDay}
        isPastDate={isPastDate}
        isSunday={isSunday}
        formatSelectedDate={formatSelectedDate}
        resetBookingForm={resetBookingForm}
        handleReserve={handleReserve}
        todayNoTime={todayNoTime}
        bookingMessage={bookingMessage}
      />
    </div>
  );
}