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
      className={`${geistSans.className} ${geistMono.className} grid min-h-screen bg-gray-50 
  grid-cols-5 grid-rows-[auto_auto_1fr_50px] 
  md:grid-cols-[minmax(0,_1fr)_1fr_1fr_1fr_1fr] md:grid-rows-[auto_1fr_50px]`}
    >
      {/* Header */}
      <header className="col-span-5 row-span-1 bg-white shadow p-5">
        <div
          className="
      grid gap-3
      grid-cols-1
      md:grid-cols-[minmax(auto,145px)_auto_1fr] md:grid-rows-[auto_auto]
      lg:grid-cols-[minmax(auto,145px)_auto_1fr_auto_auto_auto] lg:grid-rows-1
      items-center
    "
        >
          <div className="flex items-center justify-center lg:justify-start">
            <h1 className="text-3xl font-bold">SpaceX</h1>
          </div>

          <h1 className="text-xl font-semibold flex items-center justify-center lg:justify-start">
            Lanzamientos
          </h1>
          <div className="flex items-center justify-center lg:justify-end w-full">
            <input
              type="text"
              placeholder="Buscar nombre de misión..."
              className="p-2 border rounded-md w-full lg:max-w-[400px]"
            />
          </div>

          <div className="md:col-span-full lg:col-span-auto grid grid-cols-1 [@media(min-width:400px)]:grid-cols-3 gap-2 lg:contents">
            <select className="p-2 border rounded-md w-full lg:w-[150px]">
              <option>Año</option>
            </select>
            <select className="p-2 border rounded-md w-full lg:w-[150px]">
              <option>Resultado</option>
            </select>
            <select className="p-2 border rounded-md w-full lg:w-[150px]">
              <option>Cohete</option>
            </select>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="bg-white shadow flex flex-col col-span-5 row-span-1 md:col-span-1 md:row-span-3">
        <nav className="flex flex-col gap-2 p-4 text-gray-700">
          <a
            href="#"
            className="p-2 rounded hover:bg-gray-100 text-center md:text-left"
          >
            Lanzamientos
          </a>
          <a
            href="#"
            className="p-2 rounded hover:bg-gray-100 text-center md:text-left"
          >
            Favoritos
          </a>
        </nav>
      </aside>

      {/* Content */}
      <main className="col-span-5 md:col-span-4 row-span-3 p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:auto-rows-[177px]">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition self-start">
          <h2 className="font-bold text-lg text-black">FalconSat</h2>
          <p className="text-gray-600">Fecha: 24/03/2006</p>
          <p className="text-red-500">Resultado: Fallido</p>
          <p className="text-gray-500">Ubicación: Kwajalein Atoll</p>
          <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Agregar a favoritos
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="col-span-5 row-span-1 p-4 bg-white shadow text-center text-gray-600 border-t border-gray-200">
        © 2025 SpaceX. By Ricardo Castro
      </footer>
    </div>
  );
}
