declare module "overlapping-marker-spiderfier" {
  import type { Map, Marker } from "google.maps";

  export class OverlappingMarkerSpiderfier {
    constructor(
      map: Map,
      options?: {
        markersWontMove?: boolean;
        markersWontHide?: boolean;
        keepSpiderfied?: boolean;
      }
    );

    addMarker(marker: Marker): void;
    removeMarker(marker: Marker): void;
    clearMarkers(): void;

    addListener(event: "click", handler: (marker: Marker) => void): void;
    addListener(event: "spiderfy" | "unspiderfy", handler: () => void): void;

    spiderfy(): void;
    unspiderfy(): void;
  }

  export default OverlappingMarkerSpiderfier;
}
