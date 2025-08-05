import { HeaderProps } from "@/types/spacex";

export function Header({
  filters,
  setFilters,
  filtersData,
  hasFilters,
  alwaysShowFilters = false,
  activeView,
}: HeaderProps & {
  alwaysShowFilters?: boolean;
  activeView?: "launches" | "favorites" | "map";
}) {
  const showFilters = hasFilters || alwaysShowFilters;

  // Oculta barra de búsqueda y filtros si estamos en vista "map"
  const showSearchAndFilters = activeView !== "map";

  return (
    <header className="col-span-5 row-span-1 bg-white shadow p-5 pb-3">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-[145px_auto_1fr] md:grid-rows-[auto_auto] lg:grid-cols-[145px_auto_1fr_auto_auto_auto] lg:grid-rows-1">
        <h1 className="flex items-center justify-center lg:justify-start text-3xl font-bold">
          SpaceX
        </h1>
        <h2 className="text-xl font-semibold flex items-center justify-center lg:justify-start">
          {activeView === "favorites"
            ? "Favoritos"
            : activeView === "map"
            ? "Mapas"
            : "Lanzamientos"}
        </h2>

        {/* Barra de búsqueda */}
        {showSearchAndFilters && (
          <div
            className={`flex items-end justify-center w-full transition-all h-10 ${
              showFilters ? "lg:justify-end" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Buscar nombre de misión..."
              className={`border rounded-md w-full transition-all h-full px-4 
              ${
                showFilters
                  ? "lg:max-w-[500px]"
                  : "max-w-xl text-center text-lg"
              } 
              ${filters.search ? "border-orange-500" : "border-gray-300"}
              focus:border-orange-500 focus:ring-2 focus:ring-orange-300 focus:outline-none`}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        )}

        {/* Filtros */}
        {showSearchAndFilters && showFilters && (
          <div className="md:col-span-full lg:col-span-auto grid grid-cols-1 [@media(min-width:400px)]:grid-cols-3 gap-2 lg:contents">
            {/* Aquí tus selects */}
            {/* Año */}
            <select
              className={`p-2 border rounded-md w-full lg:max-w-[150px] ${
                filters.startDate
                  ? "border-orange-500 text-black"
                  : "text-gray-500 border-gray-300"
              } focus:border-orange-500 focus:ring-2 focus:ring-orange-300 focus:outline-none`}
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
              <option value="">Año</option>
              {filtersData.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Resultado */}
            <select
              className={`p-2 border rounded-md w-full lg:max-w-[150px] ${
                filters.success !== undefined
                  ? "border-orange-500 text-black"
                  : "text-gray-500 border-gray-300"
              } focus:border-orange-500 focus:ring-2 focus:ring-orange-300 focus:outline-none`}
              value={
                filters.success === undefined
                  ? ""
                  : filters.success
                  ? "true"
                  : "false"
              }
              onChange={(e) => {
                const val = e.target.value;
                setFilters({
                  ...filters,
                  success: val === "" ? undefined : val === "true",
                });
              }}
            >
              <option value="">Resultado</option>
              <option value="true">Exitoso</option>
              <option value="false">Fallido</option>
            </select>

            {/* Cohete */}
            <select
              className={`p-2 border rounded-md w-full lg:max-w-[150px] ${
                filters.rocket
                  ? "border-orange-500 text-black"
                  : "border-gray-300 text-gray-500"
              } focus:border-orange-500 focus:ring-2 focus:ring-orange-300 focus:outline-none`}
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
        )}
      </div>
    </header>
  );
}
