export function Sidebar() {
  return (
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
  );
}
