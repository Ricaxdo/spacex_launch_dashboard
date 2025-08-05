import { SimplifiedLaunch } from "@/types/spacex";

interface MapViewProps {
  launches: SimplifiedLaunch[];
}

export function MapView({ launches }: MapViewProps) {
  return <div className="col-span-5 md:col-span-4 p-6"></div>;
}
