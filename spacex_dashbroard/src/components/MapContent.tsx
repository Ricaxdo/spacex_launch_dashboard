"use client";
/// <reference types="@types/google.maps" />
import { SimplifiedLaunch } from "@/types/spacex";
import { Cluster, MarkerClusterer } from "@googlemaps/markerclusterer";
import { format } from "date-fns";
import Script from "next/script";
import OverlappingMarkerSpiderfier from "overlapping-marker-spiderfier";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const markerClusterRef = useRef<MarkerClusterer | null>(null);
  const omsRef = useRef<OverlappingMarkerSpiderfier | null>(null);
  const [OMS, setOMS] = useState<typeof OverlappingMarkerSpiderfier | null>(
    null
  );

  // Importar OMS dinámicamente solo en cliente y cuando google.maps esté cargado
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      import("overlapping-marker-spiderfier").then((mod) => {
        setOMS(() => mod.default);
      });
    }
  }, []);
  function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Inicializa el mapa una sola vez
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    mapRef.current.innerHTML = "";

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 28.5623, lng: -80.5774 },
      zoom: 5,
    });

    infoWindowRef.current = new google.maps.InfoWindow();

    // Inicializar OMS si ya fue importado
    if (OMS && mapInstance.current) {
      omsRef.current = new OMS(mapInstance.current, {
        markersWontMove: true,
        markersWontHide: true,
        keepSpiderfied: true,
      });
    }

    // Inicializar MarkerClusterer
    markerClusterRef.current = new MarkerClusterer({
      map: mapInstance.current,
    });

    // Listener para click en cluster para spiderfy
    markerClusterRef.current.addListener("clusterclick", (cluster: Cluster) => {
      if (!omsRef.current) return;

      // Unspiderfy previo si hay
      if (typeof omsRef.current.unspiderfy === "function") {
        omsRef.current.unspiderfy();
      }

      const markersInCluster = cluster.markers;

      markersInCluster.forEach((marker) => {
        omsRef.current!.addMarker(marker);
      });

      omsRef.current.spiderfy();
    });

    console.log("Mapa inicializado con OMS y MarkerClusterer");
  }, [OMS]);

  // Crear/actualizar marcadores cuando cambian los lanzamientos o selectedLaunch
  useEffect(() => {
    if (!mapInstance.current) return;

    const bounds = new google.maps.LatLngBounds();

    // Combina launches y selectedLaunch (si no está repetido)
    const allToShow = [...launches];
    if (selectedLaunch && !launches.find((l) => l.id === selectedLaunch.id)) {
      // Calcula los valores aleatorios y guárdalos en variables locales
      const randomLat =
        selectedLaunch.launchpad.latitude + random(-0.003, 0.003);
      const randomLng =
        selectedLaunch.launchpad.longitude + random(-0.003, 0.003);

      allToShow.push({
        ...selectedLaunch,
        launchpad: {
          ...selectedLaunch.launchpad,
          latitude: randomLat,
          longitude: randomLng,
        },
      });
    }

    // ---- Ajuste para superposición de marcadores ----
    // 1. Contamos cuántos hay en cada coordenada base
    const coordCount: Record<string, number> = {};
    const coordIndex: Record<string, number> = {};

    allToShow.forEach((l) => {
      if (
        l.launchpad.latitude == null ||
        l.launchpad.longitude == null ||
        isNaN(l.launchpad.latitude) ||
        isNaN(l.launchpad.longitude)
      )
        return;
      const key = `${l.launchpad.latitude.toFixed(
        5
      )},${l.launchpad.longitude.toFixed(5)}`;
      coordCount[key] = (coordCount[key] || 0) + 1;
    });

    // 2. Ajustamos coordenadas para los repetidos (espiral simple)
    const adjustedLaunches = allToShow.map((launch) => {
      let lat = launch.launchpad.latitude;
      let lng = launch.launchpad.longitude;

      if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return launch;

      const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      coordIndex[key] = (coordIndex[key] || 0) + 1;

      const count = coordCount[key];
      const index = coordIndex[key];

      if (count > 1) {
        const OFFSET_STEP = 0.001; // ≈111m
        const angle = ((index - 1) * 45 * Math.PI) / 180; // 0°, 45°, 90°, etc.
        const radius = OFFSET_STEP * (index - 1);
        lat = Math.round((lat + Math.cos(angle) * radius) * 100000) / 100000;
        lng = Math.round((lng + Math.sin(angle) * radius) * 100000) / 100000;
      }

      return {
        ...launch,
        launchpad: {
          ...launch.launchpad,
          latitude: lat,
          longitude: lng,
        },
      };
    });

    // Limpia los marcadores previos
    markersRef.current.forEach(({ marker }) => marker.setMap(null));
    markersRef.current = [];

    adjustedLaunches.forEach((launch) => {
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

      // Si usas MarkerClusterer:
      if (markerClusterRef.current) {
        markerClusterRef.current.addMarker(marker);
      }

      bounds.extend(marker.getPosition()!);
    });

    if (!bounds.isEmpty()) {
      mapInstance.current.fitBounds(bounds);
    }
  }, [launches, selectedLaunch]);

  // Centrar en el lanzamiento seleccionado
  useEffect(() => {
    if (!mapInstance.current || !selectedLaunch) return;

    const selectedMarker = markersRef.current.find(
      (m) => m.launch.id === selectedLaunch.id
    );

    if (selectedMarker) {
      const position = selectedMarker.marker.getPosition();
      if (position) {
        mapInstance.current.setCenter(position);
        mapInstance.current.setZoom(10);
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
