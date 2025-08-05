import { useFavorites } from "@/hooks/useFavorites";
import { SimplifiedLaunch } from "@/types/spacex";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface LaunchCardProps {
  launch: SimplifiedLaunch;
  isFavoriteView?: boolean;
  onFeedback?: (msg: string) => void;
}

export function LaunchCard({
  launch,
  isFavoriteView = false,
  onFeedback,
}: LaunchCardProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isAlreadyFavorite, setIsAlreadyFavorite] = useState(false);

  // Detectar si este launch ya está en favoritos
  useEffect(() => {
    setIsAlreadyFavorite(favorites.some((fav) => fav.id === launch.id));
  }, [favorites, launch.id]);

  const handleClick = () => {
    if (isFavoriteView) {
      onFeedback?.("Lanzamiento eliminado de favoritos");
      removeFavorite(launch.id);
    } else {
      onFeedback?.("Lanzamiento agregado a favoritos");
      setTimeout(() => addFavorite(launch), 10);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition self-start h-full flex flex-col relative">
      <h2 className="font-bold text-xl text-black flex-1">{launch.name}</h2>
      <div className="flex-1">
        <p className="text-gray-600">
          Fecha: {format(new Date(launch.date), "dd/MM/yyyy")}
        </p>
        <p className="text-gray-600">
          Cohete: {launch.rocket?.name ?? "Desconocido"}
        </p>
        <p className={launch.success ? "text-green-500" : "text-red-500"}>
          Resultado: {launch.success ? "Exitoso" : "Fallido"}
        </p>
        <p className="text-gray-500">
          Ubicación: {launch.launchpad?.name ?? "Desconocida"} (
          {launch.launchpad?.locality ?? "-"}, {launch.launchpad?.region ?? "-"}
          )
        </p>
      </div>
      <button
        onClick={handleClick}
        disabled={false}
        className={`mt-3 px-3 py-1 rounded-xl text-white ${
          isFavoriteView
            ? "bg-red-500 hover:bg-red-600"
            : isAlreadyFavorite
            ? "bg-green-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isFavoriteView
          ? "Eliminar de favoritos"
          : isAlreadyFavorite
          ? "Ya en favoritos"
          : "Agregar a favoritos"}
      </button>
    </div>
  );
}
