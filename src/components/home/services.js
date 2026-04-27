"use client";

import { motion } from "framer-motion";
import { Smile, Clock, Award, Shield } from "lucide-react";

export default function Services() {
  const services = [
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
    {
      icon: Smile,
      title: "Limpieza Dental",
      description:
        "Eliminación de sarro y placa para mantener una sonrisa saludable.",
      delay: 0.5,
    },
    {
      icon: Shield,
      title: "Implantes Dentales",
      description:
        "Reemplazo de piezas dentales con soluciones duraderas y estéticas.",
      delay: 0.6,
    },
    {
      icon: Award,
      title: "Endodoncia",
      description:
        "Tratamientos de conducto para salvar dientes dañados.",
      delay: 0.7,
    },
    {
      icon: Clock,
      title: "Cirugía Dental",
      description:
        "Procedimientos quirúrgicos seguros con tecnología avanzada.",
      delay: 0.8,
    },
  ];

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
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
  );
}