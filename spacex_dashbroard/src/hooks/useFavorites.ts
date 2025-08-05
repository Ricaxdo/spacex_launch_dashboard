import { SimplifiedLaunch } from "@/types/spacex";
import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<SimplifiedLaunch[]>([]);

  // Cargar favoritos desde localStorage
  const loadFavorites = () => {
    const stored = localStorage.getItem("favorites");
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();

    // Escuchar cambios externos (o internos)
    const handler = () => loadFavorites();
    window.addEventListener("storage", handler);
    // Limpia el listener al desmontar
    return () => window.removeEventListener("storage", handler);
  }, []);
  // Guarda favoritos en localStorage y dispara evento para sincronizar otros componentes
  const saveFavorites = (updated: SimplifiedLaunch[]) => {
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);

    // Disparar un evento manual para que otros componentes también sepan
    window.dispatchEvent(new Event("storage"));
  };
  // Agrega un favorito si no existe ya
  const addFavorite = (launch: SimplifiedLaunch) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === launch.id);
      if (exists) return prev;
      const updated = [...prev, launch];
      saveFavorites(updated);
      return updated;
    });
  };
  // Elimina favorito por id
  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav.id !== id);
      saveFavorites(updated);
      return updated;
    });
  };

  return { favorites, addFavorite, removeFavorite };
}
