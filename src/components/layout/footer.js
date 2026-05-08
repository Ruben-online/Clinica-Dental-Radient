"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

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

        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Tu sonrisa es nuestra prioridad. Tecnología avanzada, atención
          personalizada.
        </p>

        <p className="text-gray-300 mb-4 text-sm md:text-base">
          Síguenos en nuestras redes sociales para más información,
          consejos dentales y novedades de la clínica.
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <Link
            href="https://facebook.com/Radientgt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Radient"
            className="
              w-11 h-11
              flex items-center justify-center
              rounded-full
              border border-gray-600
              text-gray-300
              hover:bg-white
              hover:text-black
              hover:border-white
              transition-all duration-300
            "
          >
            <FaFacebookF size={18} />
          </Link>

          <Link
            href="https://instagram.com/radientgt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Radient"
            className="
              w-11 h-11
              flex items-center justify-center
              rounded-full
              border border-gray-600
              text-gray-300
              hover:bg-white
              hover:text-black
              hover:border-white
              transition-all duration-300
            "
          >
            <FaInstagram size={18} />
          </Link>

          <Link
            href="https://wa.me/50230748500"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp de Radient"
            className="
              w-11 h-11
              flex items-center justify-center
              rounded-full
              border border-gray-600
              text-gray-300
              hover:bg-white
              hover:text-black
              hover:border-white
              transition-all duration-300
            "
          >
            <FaWhatsapp size={18} />
          </Link>

        </div>

        <p className="text-gray-400 text-sm">
          © 2026 Radient. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}