import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen bg-gray-50`}
    >
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md flex flex-col">
        <div className="p-6  border-b">
          <p className="text-2xl text-black font-bold">SpaceX Dashboard</p>
        </div>
        <nav className="flex flex-col gap-2 p-4 text-gray-700">
          <a href="#" className="p-2 rounded hover:bg-gray-100">
            Lanzamientos
          </a>
          <a href="#" className="p-2 rounded hover:bg-gray-100">
            Favoritos
          </a>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="p-4 bg-white shadow flex justify-between items-center">
          <h1 className="text-xl font-semibold">Lanzamientos</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar nombre de misión..."
              className="p-2 border rounded-md"
            />
            <select className="p-2 border rounded-md">
              <option>Año</option>
            </select>
            <select className="p-2 border rounded-md">
              <option>Resultado</option>
            </select>
            <select className="p-2 border rounded-md">
              <option>Cohete</option>
            </select>
          </div>
        </header>

        {/* Launch Cards */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="font-bold text-lg text-black">FalconSat</h2>
            <p className="text-gray-600">Fecha: 24/03/2006</p>
            <p className="text-red-500">Resultado: Fallido</p>
            <p className="text-gray-500">Ubicación: Kwajalein Atoll</p>
            <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Agregar a favoritos
            </button>
          </div>
        </main>

        {/* Map */}
        <section className="p-6">
          <div className="w-full h-96 bg-gray-200 rounded-lg shadow flex items-center justify-center">
            <p className="text-gray-500">Google Maps</p>
          </div>
        </section>
      </div>
    </div>
  );
}
