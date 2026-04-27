"use client";

import Image from "next/image";

export default function Footer() {
  return (
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
  );
}