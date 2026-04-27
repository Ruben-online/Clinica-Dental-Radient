"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function Hero({ setShowBookingModal }) {
  return (
    <>
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
                src="Radient1.jpeg"
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
                  <div className="text-sm opacity-90">
                    Años de experiencia
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}