import { useLaunches } from "@/hooks/useLaunches";
import { format } from "date-fns";
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

  // Ahora recibimos launches y filtersData
  const { launches, filtersData, loading, error } = useLaunches(filters);

  // Saber si hay algún filtro activo
  const hasFilters =
    filters.rocket ||
    filters.success !== undefined ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid h-screen bg-gray-50 
  grid-cols-5 grid-rows-[auto_auto_1fr_auto] 
  md:grid-cols-[minmax(0,_1fr)_1fr_1fr_1fr_1fr] md:grid-rows-[auto_1fr_auto]`}
    >
      {/* Header */}
      <header className="col-span-5 row-span-1 bg-white shadow p-5">
        <div
          className="
      grid gap-3
      grid-cols-1
      md:grid-cols-[145px_auto_1fr] md:grid-rows-[auto_auto]
      lg:grid-cols-[145px_auto_1fr_auto_auto_auto] lg:grid-rows-1
    "
        >
          <h1 className="flex items-center justify-center lg:justify-start text-3xl font-bold">
            SpaceX
          </h1>

          <h2 className="text-xl font-semibold flex items-center justify-center lg:justify-start">
            Lanzamientos
          </h2>
          <div className="flex items-center justify-center lg:justify-end w-full">
            <input
              type="text"
              placeholder="Buscar nombre de misión..."
              className="p-2 border rounded-md w-full lg:max-w-[400px]"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-full lg:col-span-auto grid grid-cols-1 [@media(min-width:400px)]:grid-cols-3 gap-2 lg:contents">
            {/* Filtro Año dinámico (desde filtersData.years) */}
            <select
              className="p-2 border rounded-md w-full lg:max-w-[150px]"
              value={filters.startDate ? filters.startDate.split("-")[0] : ""} // <-- Año directo como string
              onChange={(e) => {
                const year = e.target.value;
                setFilters({
                  ...filters,
                  startDate: year ? `${year}-01-01` : "",
                  endDate: year ? `${year}-12-31` : "",
                });
              }}
            >
              <option value="">Año</option>
              {filtersData.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Filtro Resultado */}
            <select
              className="p-2 border rounded-md w-full lg:max-w-[150px]"
              value={
                filters.success === undefined
                  ? ""
                  : filters.success
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  success:
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true",
                })
              }
            >
              <option value="">Resultado</option>
              <option value="true">Exitoso</option>
              <option value="false">Fallido</option>
            </select>

            {/* Filtro Cohete dinámico (desde filtersData.rockets) */}
            <select
              className="p-2 border rounded-md w-full lg:max-w-[150px]"
              value={filters.rocket}
              onChange={(e) =>
                setFilters({ ...filters, rocket: e.target.value })
              }
            >
              <option value="">Cohete</option>
              {filtersData.rockets.map((rocket) => (
                <option key={rocket.id} value={rocket.id}>
                  {rocket.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="bg-white shadow flex flex-col col-span-5 row-span-1 md:col-span-1 md:row-span-3">
        <nav className="flex flex-col gap-2 p-4 text-gray-700">
          <a
            href="#"
            className="p-2 rounded hover:bg-gray-100 text-center md:text-left"
          >
            Lanzamientos
          </a>
          <a
            href="#"
            className="p-2 rounded hover:bg-gray-100 text-center md:text-left"
          >
            Favoritos
          </a>
        </nav>
      </aside>

      {/* Content */}
      <main className="col-span-5 md:col-span-4 row-span-1 p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:auto-rows-[260px] overflow-y-auto">
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

        {/* Mensaje si no hay resultados con filtros */}
        {!loading && hasFilters && launches.length === 0 && (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No se encontraron resultados para tu búsqueda.
          </p>
        )}

        {/* Lista de lanzamientos */}
        {launches.map((launch) => (
          <div
            key={launch.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition self-start h-full flex flex-col"
          >
            <h2 className="font-bold text-lg text-black flex-1">
              {launch.name}
            </h2>
            <div className="flex-1">
              <p className="text-gray-600">
                Fecha: {format(new Date(launch.date), "dd/MM/yyyy")}
              </p>
              <p className="text-gray-600">Cohete: {launch.rocket.name}</p>
              <p className={launch.success ? "text-green-500" : "text-red-500"}>
                Resultado: {launch.success ? "Exitoso" : "Fallido"}
              </p>
              <p className="text-gray-500">
                Ubicación: {launch.launchpad.name} ({launch.launchpad.locality},{" "}
                {launch.launchpad.region})
              </p>
            </div>
            <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Agregar a favoritos
            </button>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="col-span-5 row-span-1 p-4 bg-white shadow text-center text-gray-600 border-t border-gray-200">
        © 2025 SpaceX. By Ricardo Castro
      </footer>
    </div>
  );
}
