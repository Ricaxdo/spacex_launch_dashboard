import { LaunchList } from "@/components/LaunchList";
import { MainContentProps } from "@/types/spacex";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export function MainContent({
  filters,
  setFilters,
  filtersData,
  launches,
  hasFilters,
  loading,
  error,
  page,
  totalPages,
  setPage,
  totalDocs,
  onFeedback,
  onSelectLaunch,
}: MainContentProps) {
  const [hasSearched, setHasSearched] = useState(false);
  return (
    <main
      className="col-span-5 md:col-span-4 row-span-1 p-6 
  md:overflow-y-auto md:h-full 
  overflow-y-visible"
    >
      {loading && page === 1 && (
        <div className="flex justify-center items-center h-100">
          <FaSpinner className="animate-spin text-orange-500" size={45} />
        </div>
      )}

      {error && (
        <p className="col-span-full text-center text-red-500">
          Error al cargar datos
        </p>
      )}

      {/* Pantalla de bienvenida si no hay filtros */}
      {!loading && !hasFilters && page === 1 && (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <h2 className="text-3xl font-bold text-gray-700">
            Bienvenido a SpaceX Launches
          </h2>
          <p className="text-gray-500 text-lg">
            Selecciona filtros o busca para comenzar
          </p>

          {/* Filtros scrolleables */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
            {/* Año */}
            <select
              className={`p-2 border rounded-md w-full max-h-30 overflow-y-auto ${
                filters.startDate ? "text-black" : "text-gray-500"
              }`}
              value={filters.startDate ? filters.startDate.split("-")[0] : ""}
              onChange={(e) => {
                const year = e.target.value;
                setFilters({
                  ...filters,
                  startDate: year ? `${year}-01-01` : "",
                  endDate: year ? `${year}-12-31` : "",
                });
              }}
            >
              <option value="">Seleccionar año</option>
              {filtersData.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Resultado */}
            <select
              className={`p-2 border rounded-md w-full ${
                filters.success === undefined ? "text-gray-500" : "text-black"
              }`}
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
              <option value="" disabled>
                Resultado
              </option>
              <option value="true">Exitoso</option>
              <option value="false">Fallido</option>
            </select>

            {/* Cohete */}
            <select
              className={`p-2 border rounded-md w-full ${
                filters.rocket === "" ? "text-gray-500" : "text-black"
              }`}
              value={filters.rocket}
              onChange={(e) =>
                setFilters({ ...filters, rocket: e.target.value })
              }
            >
              <option value="" disabled>
                Cohete
              </option>
              {filtersData.rockets.map((rocket) => (
                <option key={rocket.id} value={rocket.id}>
                  {rocket.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {hasFilters && hasSearched && !loading && launches.length === 0 && (
        <p className="col-span-full text-center text-gray-500 text-lg">
          No se encontraron resultados para tu búsqueda.
        </p>
      )}

      {/* Lista de lanzamientos */}
      {launches.length > 0 && (
        <>
          <LaunchList
            launches={launches}
            onFeedback={onFeedback}
            onSelectLaunch={onSelectLaunch}
          />

          {/* Info de cantidad y página */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Mostrando {launches.length} de {totalDocs} lanzamientos
          </p>

          {/* Botón de cargar más */}
          {page < totalPages && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Cargar más"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
