"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Location() {
  return (
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.2207468043835!2d-91.50630172507726!3d14.537223185941627!2m3!1f0!3f0!0f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858ec3b91ca7690d%3A0x7a85ae762341073f!2sRadient%20Cl%C3%ADnica%20Dental!5e1!3m2!1ses-419!2sgt!4v1776293841759!5m2!1ses-419!2sgt"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Ubicación de clínica"
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
                  Mazatenango, Guatemala
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
                className="text-xl text-[var(--charcoal)] mb-4 flex items-center gap-2"
              >
                <Clock className="w-5 h-5 text-[var(--mint)]" />
                Horario de Atención
              </h3>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-semibold text-[var(--charcoal)]">
                      Lunes - Viernes:
                    </span>
                    <div className="text-[var(--navy)]/80 text-sm sm:text-base text-right">
                      <div>9:00 AM - 1:00 PM</div>
                      <div>2:00 PM - 6:00 PM</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--charcoal)]">
                      Sábado:
                    </span>
                    <span className="text-[var(--navy)]/80 text-sm sm:text-base">
                      8:00 AM - 1:00 PM
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--charcoal)]">
                      Domingo:
                    </span>
                    <span className="text-red-500 font-medium text-sm sm:text-base">
                      Cerrado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}