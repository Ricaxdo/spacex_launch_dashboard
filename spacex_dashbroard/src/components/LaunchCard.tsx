import { useFavorites } from "@/hooks/useFavorites";
import { LaunchCardProps } from "@/types/spacex";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaRegHeart } from "react-icons/fa";

export function LaunchCard({
  launch,
  isFavoriteView = false,
  onFeedback,
  onSelectLaunch,
}: LaunchCardProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isAlreadyFavorite, setIsAlreadyFavorite] = useState(false);

  useEffect(() => {
    setIsAlreadyFavorite(favorites.some((fav) => fav.id === launch.id));
  }, [favorites, launch.id]);

  const handleFavoriteClick = () => {
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
      {/* Contenedor del título + botones */}
      <div className="flex flex-1 justify-between items-center mb-2">
        <h2 className="font-bold text-xl flex-1 text-black">{launch.name}</h2>

        <div className="flex space-x-3 px-1">
          {/* Botón favorito */}
          <button
            onClick={handleFavoriteClick}
            aria-label={
              isAlreadyFavorite
                ? "Eliminar de favoritos"
                : "Agregar a favoritos"
            }
            className="text-red-500 hover:text-red-600 focus:outline-none"
          >
            {isAlreadyFavorite ? (
              <FaHeart size={30} />
            ) : (
              <FaRegHeart size={30} />
            )}
          </button>

          {/* Botón ver ubicación */}
          <button
            onClick={() => onSelectLaunch?.(launch.id)}
            aria-label="Ver ubicación en el mapa"
            className="text-blue-600 hover:text-purple-700 focus:outline-none"
          >
            <FaMapMarkerAlt size={30} />
          </button>
        </div>
      </div>

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
    </div>
  );
}
