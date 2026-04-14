import "./globals.css";

export const metadata = {
  title: "Radient — Clínica Dental",
  description: "Sistema de gestión Clínica Dental Radient",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}