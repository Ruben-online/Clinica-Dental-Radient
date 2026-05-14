"use client";

import { useInventario } from "./useInventario";
import InventarioView from "./InventarioView";

export default function InventarioPage() {
  const inventario = useInventario();

  return <InventarioView inventario={inventario} />;
}