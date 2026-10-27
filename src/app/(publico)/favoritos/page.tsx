import type { Metadata } from "next";
import { FavoritosView } from "@/components/favoritos-view";
import { getAgencias, getVehiculosVisibles } from "@/lib/catalog";

export const metadata: Metadata = { title: "Favoritos", robots: { index: false } };

export default async function FavoritosPage() {
  const [vehiculos, agencias] = await Promise.all([getVehiculosVisibles(), getAgencias()]);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Favoritos</h1>
      <p className="mt-1 text-muted">Se guardan en este teléfono. No hace falta registrarse.</p>
      <div className="mt-6">
        <FavoritosView vehiculos={vehiculos} agencias={agencias} />
      </div>
    </div>
  );
}
