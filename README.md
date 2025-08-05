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


## Docker(opcional)

docker build -t spacex-dashboard .
docker run -p 3000:3000 spacex-dashboard
