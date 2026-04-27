"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-24 bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/DSC09999.png"
                alt="Doctor"
                className="w-full h-72 object-cover"
              />
            </div>

            <div className="rounded-3xl overflow-hidden shadow-lg mt-0 sm:mt-12">
              <img
                src="IMG_8387.png"
                alt="Equipo médico"
                className="w-full h-72 object-cover"
              />
            </div>

            <div className="rounded-3xl overflow-hidden shadow-lg mt-0 lg:mt-6">
              <img
                src="/IMG_5514.png"
                alt="Clínica dental"
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
              Con más de 15 años de experiencia, Radient es referente en
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
  );
}