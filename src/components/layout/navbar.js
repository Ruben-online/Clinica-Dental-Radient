"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full bg-[var(--white-warm)]/95 backdrop-blur-sm z-50 border-b border-[var(--border)] shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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
              className="text-lg sm:text-2xl text-[var(--charcoal)]"
            >
              Radient Clinica Dental
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="text-[var(--charcoal)] hover:text-[var(--mint)] transition-colors">
              Inicio
            </a>
            <a href="#servicios" className="text-[var(--charcoal)] hover:text-[var(--mint)] transition-colors">
              Servicios
            </a>
            <a href="#ubicacion" className="text-[var(--charcoal)] hover:text-[var(--mint)] transition-colors">
              Ubicación
            </a>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[var(--mint)] text-white rounded-full hover:bg-[var(--navy)] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Iniciar Sesión
            </Link>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--cream)] flex items-center justify-center text-[var(--charcoal)] hover:bg-[var(--mint)] hover:text-white transition-all duration-300"
            aria-label="Abrir menú"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-4 bg-[var(--white-warm)] border border-[var(--border)] rounded-3xl shadow-lg p-4"
            >
              <div className="flex flex-col gap-3">
                <a
                  href="#inicio"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 rounded-2xl text-[var(--charcoal)] hover:bg-[var(--cream)] transition-all"
                >
                  Inicio
                </a>

                <a
                  href="#servicios"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 rounded-2xl text-[var(--charcoal)] hover:bg-[var(--cream)] transition-all"
                >
                  Servicios
                </a>

                <a
                  href="#ubicacion"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 rounded-2xl text-[var(--charcoal)] hover:bg-[var(--cream)] transition-all"
                >
                  Ubicación
                </a>

                <Link
                  href="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-3 bg-[var(--mint)] text-white rounded-2xl text-center hover:bg-[var(--navy)] transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}