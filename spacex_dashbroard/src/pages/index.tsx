import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";

//Componentes
import { FeedbackModal } from "@/components/FeedbackModal";
import { Header } from "@/components/Header";
import { LaunchCard } from "@/components/LaunchCard";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/Sidebar";

//Hooks
import { useFavorites } from "@/hooks/useFavorites";
import { useFilters } from "@/hooks/useFilters";
import { useLaunches } from "@/hooks/useLaunches";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [activeView, setActiveView] = useState<"launches" | "favorites">(
    "launches"
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const { favorites } = useFavorites();
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
  //Cargamos los datos de filtros
  const { filtersData } = useFilters();
  // Datos de API
  const {
    launches,
    loading,
    error,
    totalPages: apiTotalPages,
    totalDocs,
  } = useLaunches(filters, page, 9, true);
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
    md:grid-cols-[minmax(0,_1fr)_1fr_1fr_1fr_1fr] 
    md:grid-rows-[auto_1fr_auto] 
    overflow-y-auto md:overflow-y-hidden`}
    >
      <Header
        filters={filters}
        setFilters={setFilters}
        filtersData={filtersData}
        hasFilters={hasFilters}
      />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      {activeView === "launches" && (
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
          totalDocs={totalDocs}
          onFeedback={setFeedback}
        />
      )}

      {activeView === "favorites" && (
        <div className="col-span-5 md:col-span-4 p-6">
          <h2 className="text-2xl font-bold mb-4">Favoritos</h2>

          {favorites.length === 0 ? (
            <p className="text-gray-500">No tienes lanzamientos guardados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((launch) => (
                <LaunchCard
                  key={launch.id}
                  launch={launch}
                  isFavoriteView
                  onFeedback={setFeedback}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="col-span-5 row-span-1 p-4 bg-white shadow text-center text-gray-600 border-t border-gray-200">
        © 2025 SpaceX. By Ricardo Castro
      </footer>
      {feedback && (
        <FeedbackModal message={feedback} onClose={() => setFeedback(null)} />
      )}
    </div>
  );
}
