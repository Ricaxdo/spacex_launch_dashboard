interface SidebarProps {
  activeView: "launches" | "favorites";
  setActiveView: (view: "launches" | "favorites") => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="bg-gray-200 shadow flex flex-col col-span-5 row-span-1 md:col-span-1 md:row-span-3 lg:py-8 md:py-4 p-2">
      <nav className="flex flex-col gap-2 px-4 text-gray-700 text-sm m:text-xl">
        <button
          onClick={() => setActiveView("launches")}
          className={`p-2 rounded-xl text-center md:text-left ${
            activeView === "launches"
              ? "bg-orange-200 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          Lanzamientos
        </button>
        <button
          onClick={() => setActiveView("favorites")}
          className={`p-2 rounded-xl text-center md:text-left ${
            activeView === "favorites"
              ? "bg-orange-200 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          Favoritos
        </button>
      </nav>
    </aside>
  );
}
