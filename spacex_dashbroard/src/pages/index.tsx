import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/Sidebar";
import { useLaunches } from "@/hooks/useLaunches";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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

  // Estados para paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Datos de API
  const {
    launches,
    filtersData,
    loading,
    error,
    totalPages: apiTotalPages,
  } = useLaunches(filters, page);

  // Actualizamos totalPages cada vez que cambien los datos
  useEffect(() => {
    if (apiTotalPages) setTotalPages(apiTotalPages);
  }, [apiTotalPages]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Saber si hay algún filtro activ
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
      <Header
        filters={filters}
        setFilters={setFilters}
        filtersData={filtersData}
        hasFilters={hasFilters}
      />
      <Sidebar />
      <MainContent
        filters={filters}
        setFilters={setFilters}
        filtersData={filtersData}
        launches={launches}
        hasFilters={hasFilters}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
      <footer className="col-span-5 row-span-1 p-4 bg-white shadow text-center text-gray-600 border-t border-gray-200">
        © 2025 SpaceX. By Ricardo Castro
      </footer>
    </div>
  );
}
