import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  filters: {
    rocket: string;
    success: boolean | undefined;
    search: string;
    startDate: string;
    endDate: string;
  };
  setFilters: Dispatch<
    SetStateAction<{
      rocket: string;
      success: boolean | undefined;
      search: string;
      startDate: string;
      endDate: string;
    }>
  >;
  filtersData: { rockets: { id: string; name: string }[]; years: number[] };
  hasFilters: boolean;
}

export function Header({
  filters,
  setFilters,
  filtersData,
  hasFilters,
}: HeaderProps) {
  return (
    <header className="col-span-5 row-span-1 bg-white shadow p-5 pb-3">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-[145px_auto_1fr] md:grid-rows-[auto_auto] lg:grid-cols-[145px_auto_1fr_auto_auto_auto] lg:grid-rows-1">
        <h1 className="flex items-center justify-center lg:justify-start text-3xl font-bold">
          SpaceX
        </h1>
        <h2 className="text-xl font-semibold flex items-center justify-center lg:justify-start">
          Lanzamientos
        </h2>

        {/* Input siempre visible, cambia estilo según hasFilters */}
        <div
          className={`flex items-end justify-center w-full transition-all h-10 ${
            hasFilters ? "lg:justify-end" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Buscar nombre de misión..."
            className={`border rounded-md w-full transition-all h-full px-4 ${
              hasFilters ? "lg:max-w-[500px]" : "max-w-xl text-center text-lg"
            }`}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Filtros solo visibles si hay búsqueda o filtros */}
        {hasFilters && (
          <div className="md:col-span-full lg:col-span-auto grid grid-cols-1 [@media(min-width:400px)]:grid-cols-3 gap-2 lg:contents">
            <select
              className="p-2 border rounded-md w-full lg:max-w-[150px]"
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
        )}
      </div>
    </header>
  );
}
