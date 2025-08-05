import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";

//Componentes
import { FavoritesContent } from "@/components/FavoriteContent";
import { FeedbackModal } from "@/components/FeedbackModal";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/Sidebar";

//Hooks
import { useFavorites } from "@/hooks/useFavorites";
import { useFilters } from "@/hooks/useFilters";
import { useLaunches } from "@/hooks/useLaunches";

//Helper
import { filterLaunches } from "@/utils/filterLaunches";

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

  // Filtros para cada vista
  const [launchFilters, setLaunchFilters] = useState({
    rocket: "",
    success: undefined as boolean | undefined,
    search: "",
    startDate: "",
    endDate: "",
  });

  const [favoriteFilters, setFavoriteFilters] = useState({
    rocket: "",
    success: undefined as boolean | undefined,
    search: "",
    startDate: "",
    endDate: "",
  });

  // Estados para paginación (solo para lanzamientos)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //Cargamos los datos de filtros
  const { filtersData } = useFilters();

  // Datos de API para lanzamientos
  const {
    launches,
    loading,
    error,
    totalPages: apiTotalPages,
    totalDocs,
  } = useLaunches(launchFilters, page, 9, true);

  // Actualizamos totalPages cada vez que cambien los datos
  useEffect(() => {
    if (apiTotalPages) setTotalPages(apiTotalPages);
  }, [apiTotalPages]);

  useEffect(() => {
    setPage(1);
  }, [launchFilters]);

  // Saber si hay filtros aplicados
  const hasFilters = (filters: typeof launchFilters) =>
    !!(
      filters.rocket ||
      filters.success !== undefined ||
      filters.search ||
      filters.startDate ||
      filters.endDate
    );

  // Filtro aplicado a los favoritos usando helper
  const filteredFavorites = filterLaunches(favorites, favoriteFilters);

  // Determinar qué filtros usar según vista activa
  const currentFilters =
    activeView === "launches" ? launchFilters : favoriteFilters;
  const setCurrentFilters =
    activeView === "launches" ? setLaunchFilters : setFavoriteFilters;

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid h-screen bg-gray-50 
      grid-cols-5 grid-rows-[auto_auto_1fr_auto] 
      md:grid-cols-[minmax(0,_1fr)_1fr_1fr_1fr_1fr] 
      md:grid-rows-[auto_1fr_auto] 
      overflow-y-auto md:overflow-y-hidden`}
    >
      <Header
        filters={currentFilters}
        setFilters={setCurrentFilters}
        filtersData={filtersData}
        hasFilters={hasFilters(currentFilters)}
        alwaysShowFilters={activeView === "favorites"}
        activeView={activeView}
      />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {activeView === "launches" && (
        <MainContent
          filters={launchFilters}
          setFilters={setLaunchFilters}
          filtersData={filtersData}
          launches={launches}
          hasFilters={hasFilters(launchFilters)}
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
        <FavoritesContent
          favorites={filteredFavorites}
          filters={favoriteFilters}
          onFeedback={setFeedback}
        />
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
