# Dashboard de Lanzamientos de SpaceX

Aplicación web para visualizar, filtrar y gestionar lanzamientos espaciales de SpaceX usando la API pública oficial.  
Permite ver detalles, ubicaciones en Google Maps, buscar misiones y guardar favoritas en localStorage.

---

## Características principales

- **Consumo de la API de SpaceX:** Muestra todos los lanzamientos espaciales, detalles y resultados.
- **Filtros avanzados:**  
  - Por año  
  - Por resultado (éxito/fallo)  
  - Por cohete  
  - Búsqueda por nombre de misión
- **Mapa interactivo (Google Maps):** Visualiza sitios de lanzamiento y detalles al hacer click.
- **Favoritos:** Marca lanzamientos favoritos y gestiona tu lista en localStorage.
- **UI responsiva y moderna:** Diseño adaptable, modular y con animaciones suaves.

  
---

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/spacex-dashboard.git
   cd spacex-dashboard

2. **Instalar dependencias**
    ```bash
    npm install
    # o
    yarn install

3. Configurar tu API key de Google Maps
   ```bash
   Renombra .env.example a .env y agrega tu clave:
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave_aqui

4. Inicia la app en desarrollo
   ```bash
   npm run dev
   # o
   yarn dev

## Docker (opcional)
    docker build -t spacex-dashboard .
    docker run -p 3000:3000 spacex-dashboard


---

## Instrucciones de uso

1. Explorar views
   Al entrar a la web directamente podras buscar lanzamientos, podras checar tus lanzamientos favoritos y un mapa interactivo en un sidebar

2. Filtrar lanzamientos
   Utiliza los filtros para encontrar lanzamientos:
   Nombre de mision, Resultado, Cohete, Año

3. Gestionar lanzamientos favoritos
   Agrega tus lanzamientos favoritos con el icono 'like' para crear tu lista personal
   Accede a la seccion y ve detalles sobre ellos
   Elimina lanzamientos en cualquier momentos

4. Visualizacion en el mapa
   Accede a la ubicacion de cada lanzamientos con el icono 'maps'
   Haz clic en un marcador para ver su informacion

## Consideraciones
- **Clave de Google Maps API:** Necesitas obtener una clave desde Google Cloud Console y agregarla a tu archivo .env.
  - https://api.spacexdata.com/v4/launches
- **API pública de SpaceX:** No requiere autenticación adicional.
  - https://console.cloud.google.com/
- **localStorage:** Los favoritos se guardan localmente en tu navegador.
- **Rendimiento:** La aplicación usa lazy loading si hay muchos lanzamientos para asegurar una experiencia fluida.
