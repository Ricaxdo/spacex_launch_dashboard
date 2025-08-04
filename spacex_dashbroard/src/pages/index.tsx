import { LaunchList } from "@/components/LaunchList";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { useLaunches } from "@/hooks/useLaunches";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  // Estado para filtros dinámicos
  const [filters, setFilters] = useState({
    rocket: "",
    success: undefined as boolean | undefined,
    search: "",
    startDate: "",
    endDate: "",
  });

  // Datos de API
  const { launches, filtersData, loading, error } = useLaunches(filters);

  // Saber si hay algún filtro activo
  const hasFilters = !!(
    filters.rocket ||
    filters.success !== undefined ||
    filters.search ||
    filters.startDate ||
    filters.endDate
  );

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid h-screen bg-gray-50 
      grid-cols-5 grid-rows-[auto_auto_1fr_auto] 
      md:grid-cols-[minmax(0,_1fr)_1fr_1fr_1fr_1fr] md:grid-rows-[auto_1fr_auto]`}
    >
      {/* Header */}
      <Topbar
        filters={filters}
        setFilters={setFilters}
        filtersData={filtersData}
        hasFilters={hasFilters}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="col-span-5 md:col-span-4 row-span-1 p-6 overflow-y-auto">
        {loading && (
          <p className="col-span-full text-center">Cargando lanzamientos...</p>
        )}
        {error && (
          <p className="col-span-full text-center text-red-500">
            Error al cargar datos
          </p>
        )}

        {/* Mensaje inicial si no hay filtros */}
        {!loading && !hasFilters && (
          <p className="col-span-full text-center text-gray-500 text-lg">
            Inicia una búsqueda para ver los lanzamientos.
          </p>
        )}

        {/* Mensaje si no hay resultados */}
        {!loading && hasFilters && launches.length === 0 && (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No se encontraron resultados para tu búsqueda.
          </p>
        )}

        {/* Lista de lanzamientos */}
        {launches.length > 0 && <LaunchList launches={launches} />}
      </main>

      {/* Footer */}
      <footer className="col-span-5 row-span-1 p-4 bg-white shadow text-center text-gray-600 border-t border-gray-200">
        © 2025 SpaceX. By Ricardo Castro
      </footer>
    </div>
  );
}
