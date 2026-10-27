import { DemoBanner } from "@/components/demo-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#contenido" className="sr-only z-50 rounded bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-2 focus:top-2">
        Saltar al contenido
      </a>
      <DemoBanner />
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
