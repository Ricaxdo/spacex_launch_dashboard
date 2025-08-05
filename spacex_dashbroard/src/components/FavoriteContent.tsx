import { LaunchCard } from "@/components/LaunchCard";
import { SimplifiedLaunch } from "@/types/spacex";

interface FavoritesContentProps {
  favorites: SimplifiedLaunch[];
  onFeedback: (msg: string) => void;
  onSelectLaunch?: (id: string) => void; // Añadido
}

export function FavoritesContent({
  favorites,
  onFeedback,
  onSelectLaunch, // Recibimos
}: FavoritesContentProps) {
  return (
    <div className="col-span-5 md:col-span-4 p-6 overflow-y-visible md:overflow-y-auto md:h-full">
      {favorites.length === 0 ? (
        <p className="text-gray-500">
          No se encontraron favoritos con estos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((launch) => (
            <LaunchCard
              key={launch.id}
              launch={launch}
              isFavoriteView
              onFeedback={onFeedback}
              onSelectLaunch={onSelectLaunch} // Pasamos el callback
            />
          ))}
        </div>
      )}
    </div>
  );
}
