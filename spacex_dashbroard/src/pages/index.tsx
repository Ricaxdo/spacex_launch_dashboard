import { Geist, Geist_Mono } from "next/font/google";
import { useCallback, useEffect, useState } from "react";

// Componentes
import { FavoritesContent } from "@/components/FavoriteContent";
import { FeedbackModal } from "@/components/FeedbackModal";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { MapContent } from "@/components/MapContent";
import { Sidebar } from "@/components/Sidebar";

// Hooks
import { useFavorites } from "@/hooks/useFavorites";
import { useFilters } from "@/hooks/useFilters";
import { useLaunches } from "@/hooks/useLaunches";

// Helper
import { SimplifiedLaunch } from "@/types/spacex";
import { filterLaunches } from "@/utils/filterLaunches";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  // Vista activa: lanzamientos, favoritos o mapa
  const [activeView, setActiveView] = useState<
    "launches" | "favorites" | "map"
  >("launches");

  // Mensaje de feedback para favoritos
  const [feedback, setFeedback] = useState<string | null>(null);

  // Favoritos del usuario (custom hook)
  const { favorites } = useFavorites();

  // Filtros
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

  // Paginación de lanzamientos
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Nuevo: lanzamiento seleccionado
  const [selectedLaunch, setSelectedLaunch] = useState<SimplifiedLaunch | null>(
    null
  );

  // Filtros generales
  const { filtersData } = useFilters();

  // Lanzamientos paginados
  const {
    launches: paginatedLaunches,
    loading,
    error,
    totalPages: apiTotalPages,
    totalDocs,
  } = useLaunches(launchFilters, page, 9, true);

  // Lanzamientos completos (para el mapa)
  const { launches: allLaunches } = useLaunches(
    { rocket: "", success: undefined, search: "", startDate: "", endDate: "" },
    1,
    9999,
    false,
    true
  );

  // Actualiza totalPages cuando cambia el valor desde la API
  useEffect(() => {
    if (apiTotalPages) setTotalPages(apiTotalPages);
  }, [apiTotalPages]);

  // Reinicia paginación al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [launchFilters]);

  // Cierra el modal de feedback
  const handleCloseFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  // Verifica si hay filtros activos
  const hasFilters = (filters: typeof launchFilters) =>
    !!(
      filters.rocket ||
      filters.success !== undefined ||
      filters.search ||
      filters.startDate ||
      filters.endDate
    );

  const filteredFavorites = filterLaunches(favorites, favoriteFilters);

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
      {/* Header con filtros y control de vistas */}
      <Header
        filters={currentFilters}
        setFilters={setCurrentFilters}
        filtersData={filtersData}
        hasFilters={hasFilters(currentFilters)}
        alwaysShowFilters={activeView === "favorites"}
        activeView={activeView}
        showFilters={!(activeView === "map" && window.innerWidth < 768)}
      />

      {/* Navegación lateral */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Vista de lanzamientos */}
      {activeView === "launches" && (
        <MainContent
          filters={launchFilters}
          setFilters={setLaunchFilters}
          filtersData={filtersData}
          launches={paginatedLaunches}
          hasFilters={hasFilters(launchFilters)}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          totalDocs={totalDocs}
          onFeedback={setFeedback}
          // Al seleccionar un lanzamiento: busca detalles y cambia a vista mapa
          onSelectLaunch={async (id) => {
            try {
              console.log("Fetching launch with id:", id);
              const res = await fetch(`/api/launches?id=${id}`);
              const data = await res.json();
              console.log("Launch fetched:", data);

              if (data.launches && data.launches.length > 0) {
                setSelectedLaunch(data.launches[0]); // Guardamos el lanzamiento seleccionado
                setActiveView("map");
              } else {
                console.warn("No launch found for this ID");
              }
            } catch (err) {
              console.error("Error fetching single launch:", err);
            }
          }}
        />
      )}

      {/* Vista de favoritos */}
      {activeView === "favorites" && (
        <FavoritesContent
          favorites={filteredFavorites}
          onFeedback={setFeedback}
          onSelectLaunch={async (id) => {
            try {
              console.log("Fetching launch with id:", id);
              const res = await fetch(`/api/launches?id=${id}`);
              const data = await res.json();
              console.log("Launch fetched:", data);

              if (data.launches && data.launches.length > 0) {
                setSelectedLaunch(data.launches[0]);
                setActiveView("map");
              } else {
                console.warn("No launch found for this ID");
              }
            } catch (err) {
              console.error("Error fetching single launch:", err);
            }
          }}
        />
      )}

      {/* Vista de mapa: solo visible si está activa */}
      <div
        className={`col-span-5 row-span-3 md:col-span-4 ${
          activeView === "map" ? "block" : "hidden"
        }`}
      >
        <MapContent launches={allLaunches} selectedLaunch={selectedLaunch} />
      </div>

      <footer className="col-span-5 row-span-1 p-4 bg-white shadow text-center text-gray-600 border-t border-gray-200">
        © 2025 SpaceX. By Ricardo Castro
      </footer>

      {feedback && (
        <FeedbackModal message={feedback} onClose={handleCloseFeedback} />
      )}
    </div>
  );
}
