"use client";
/// <reference types="@types/google.maps" />
import { SimplifiedLaunch } from "@/types/spacex";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { format } from "date-fns";
import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

interface MapContentProps {
  launches: SimplifiedLaunch[];
  selectedLaunch?: SimplifiedLaunch | null;
}

export function MapContent({ launches, selectedLaunch }: MapContentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<
    { marker: google.maps.Marker; launch: SimplifiedLaunch }[]
  >([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markerClusterRef = useRef<MarkerClusterer | null>(null); // Guardamos instancia del cluster

  // Inicializa el mapa una sola vez
  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    console.log("Inicializando mapa...");

    // Resetear contenido por si acaso
    mapRef.current.innerHTML = "";

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 28.5623, lng: -80.5774 },
      zoom: 5,
    });

    infoWindowRef.current = new google.maps.InfoWindow();

    console.log("Mapa inicializado");
  }, []);

  // Crea/actualiza marcadores cuando cambian los lanzamientos
  // Dentro del useEffect que maneja los lanzamientos y selectedLaunch:

  useEffect(() => {
    if (!mapInstance.current) return;

    console.log("MapContent > launches:", launches);

    // Agregar marcadores que no existan
    const bounds = new google.maps.LatLngBounds();

    // Combinar lanzamientos + selectedLaunch (si no está en launches)
    const allToShow = launches.slice(); // copia los lanzamientos actuales
    if (selectedLaunch && !launches.find((l) => l.id === selectedLaunch.id)) {
      allToShow.push(selectedLaunch);
    }

    // Para cada lanzamiento a mostrar:
    allToShow.forEach((launch) => {
      // Si ya existe marcador para este launch, no crear otro
      const existing = markersRef.current.find(
        (m) => m.launch.id === launch.id
      );
      if (!existing) {
        if (
          !launch.launchpad.latitude ||
          !launch.launchpad.longitude ||
          isNaN(launch.launchpad.latitude) ||
          isNaN(launch.launchpad.longitude)
        )
          return;

        const marker = new google.maps.Marker({
          position: {
            lat: launch.launchpad.latitude,
            lng: launch.launchpad.longitude,
          },
          title: launch.name,
          map: mapInstance.current!,
        });

        const content = `
        <div style="font-family: Arial; font-size:14px">
          <h3>${launch.name}</h3>
          <p>Fecha: ${format(new Date(launch.date), "dd/MM/yyyy")}</p>
          <p style="color:${launch.success ? "green" : "red"}">
            Resultado: ${launch.success ? "Exitoso" : "Fallido"}
          </p>
          <p>Ubicación: ${launch.launchpad.name} (${
          launch.launchpad.locality
        }, ${launch.launchpad.region})</p>
        </div>
      `;

        marker.addListener("click", () => {
          infoWindowRef.current?.setContent(content);
          infoWindowRef.current?.open(mapInstance.current!, marker);
        });

        markersRef.current.push({ marker, launch });

        // Añadimos el nuevo marcador al cluster
        if (markerClusterRef.current) {
          markerClusterRef.current.addMarker(marker);
        }
      }
    });

    // Actualizar bounds para todos los marcadores
    markersRef.current.forEach(({ marker }) => {
      bounds.extend(marker.getPosition()!);
    });

    if (!bounds.isEmpty()) {
      mapInstance.current.fitBounds(bounds);
    }
  }, [launches, selectedLaunch]);

  // Centrar en el lanzamiento seleccionado
  useEffect(() => {
    if (!mapInstance.current || !selectedLaunch) return;

    console.log("Centrando mapa en:", selectedLaunch);

    const selectedMarker = markersRef.current.find(
      (m) => m.launch.id === selectedLaunch.id
    );

    if (selectedMarker) {
      const position = selectedMarker.marker.getPosition();
      if (position) {
        mapInstance.current.setCenter(position);
        mapInstance.current.setZoom(10); // ajusta el zoom que quieras
        infoWindowRef.current?.setContent(`<b>${selectedLaunch.name}</b>`);
        infoWindowRef.current?.open(mapInstance.current, selectedMarker.marker);
      }
    }
  }, [selectedLaunch]);

  return (
    <div className="col-span-5 p-6">
      <div
        ref={mapRef}
        className="w-full md:h-[calc(100vh-170px)] h-[calc(100vh-350px)]"
      />

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
    </div>
  );
}
