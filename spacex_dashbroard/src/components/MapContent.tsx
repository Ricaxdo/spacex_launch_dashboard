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

  // Inicializa el mapa una sola vez
  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    console.log("Inicializando mapa...");

    // Si ya había mapa, lo destruimos (reset)
    mapRef.current.innerHTML = "";

    // Reinicializamos
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 28.5623, lng: -80.5774 },
      zoom: 5,
    });

    infoWindowRef.current = new google.maps.InfoWindow();

    console.log("Mapa y marcador reinicializados");
  }, []);

  // Crea/actualiza marcadores cuando cambian los lanzamientos
  useEffect(() => {
    if (!mapInstance.current) return;

    console.log("MapContent > launches:", launches);

    // Limpiar marcadores previos
    markersRef.current.forEach((m) => m.marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    // Si no hay lanzamientos pero hay uno seleccionado, lo agregamos
    const allMarkers =
      launches.length > 0 ? launches : selectedLaunch ? [selectedLaunch] : [];

    allMarkers
      .filter(
        (l) =>
          l.launchpad.latitude &&
          l.launchpad.longitude &&
          !isNaN(l.launchpad.latitude) &&
          !isNaN(l.launchpad.longitude)
      )
      .forEach((launch) => {
        const marker = new google.maps.Marker({
          position: {
            lat: launch.launchpad.latitude,
            lng: launch.launchpad.longitude,
          },
          title: launch.name,
          map: mapInstance.current!,
        });

        bounds.extend(marker.getPosition()!);

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
      });

    if (!bounds.isEmpty()) mapInstance.current.fitBounds(bounds);

    // Cluster de marcadores
    new MarkerClusterer({
      markers: markersRef.current.map((m) => m.marker),
      map: mapInstance.current,
    });
  }, [launches, selectedLaunch]);

  // Centrar en el lanzamiento seleccionado
  useEffect(() => {
    if (!mapInstance.current || !selectedLaunch) return;

    console.log("Centrando mapa en:", selectedLaunch);

    const selectedMarker = markersRef.current.find(
      (m) => m.launch.id === selectedLaunch.id
    );

    if (selectedMarker) {
      mapInstance.current.setCenter(selectedMarker.marker.getPosition()!);
      mapInstance.current.setZoom(10);
      infoWindowRef.current?.setContent(`<b>${selectedLaunch.name}</b>`);
      infoWindowRef.current?.open(mapInstance.current, selectedMarker.marker);
    }
  }, [selectedLaunch]);

  return (
    <div className="col-span-5 p-6">
      <div ref={mapRef} className="w-full h-[calc(100vh-100px)]" />

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
    </div>
  );
}
