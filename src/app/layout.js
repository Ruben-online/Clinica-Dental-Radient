import "./globals.css";

export const metadata = {
  title: "DentalCare - Tu sonrisa, nuestra pasión",
  description: "Cuidado dental de excelencia con tecnología de vanguardia y un equipo comprometido con tu bienestar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
