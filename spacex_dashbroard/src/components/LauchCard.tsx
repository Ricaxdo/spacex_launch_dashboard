import { SimplifiedLaunch } from "@/types/spacex";
import { format } from "date-fns";

export function LaunchCard({ launch }: { launch: SimplifiedLaunch }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition self-start h-full flex flex-col">
      <h2 className="font-bold text-xl text-black flex-1">{launch.name}</h2>
      <div className="flex-1">
        <p className="text-gray-600">
          Fecha: {format(new Date(launch.date), "dd/MM/yyyy")}
        </p>
        <p className="text-gray-600">Cohete: {launch.rocket.name}</p>
        <p className={launch.success ? "text-green-500" : "text-red-500"}>
          Resultado: {launch.success ? "Exitoso" : "Fallido"}
        </p>
        <p className="text-gray-500">
          Ubicación: {launch.launchpad.name} ({launch.launchpad.locality},{" "}
          {launch.launchpad.region})
        </p>
      </div>
      <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        Agregar a favoritos
      </button>
    </div>
  );
}
