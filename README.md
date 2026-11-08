# API REST - Catálogo de Videojuegos

API REST para la gestión y consulta de un catálogo de videojuegos, desarrollada con **Node.js**, **TypeScript** y **Express**. El sistema implementa las operaciones HTTP principales (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`), validación de esquemas con **Zod**, documentación interactiva con **Swagger (OpenAPI)** y una interfaz web para interacción directa con el servicio.

### Información Académica
- **Institución:** Universidad Católica de Pereira
- **Programa:** Ingeniería de Sistemas y Telecomunicaciones
- **Asignatura:** Metodología de la Programación IV
- **Docente:** Carlos Andrés Cortés
- **Integrantes:**
  - Juan David Arboleda Vallecilla
  - Diego Diaz

---

## Modelo de Datos

La entidad principal `videojuegos` contiene los siguientes campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `INTEGER` | Identificador único autoincremental (Primary Key) |
| `titulo` | `VARCHAR(150)` | Título comercial del videojuego |
| `desarrollador` | `VARCHAR(120)` | Estudio o empresa desarrolladora |
| `genero` | `VARCHAR(60)` | Género principal (RPG, Acción, Aventura, etc.) |
| `plataforma` | `VARCHAR(100)` | Plataformas disponibles (PC, PS5, Xbox, Switch) |
| `anioLanzamiento` | `INTEGER` | Año de publicación original |
| `calificacion` | `DECIMAL(3,1)` | Puntuación de 0.0 a 10.0 |
| `precio` | `DECIMAL(10,2)` | Precio de venta en USD |
| `descripcion` | `TEXT` | Sinopsis y características principales |
| `imagenUrl` | `VARCHAR(500)` | URL de la portada o arte oficial |
| `enStock` | `BOOLEAN` | Disponibilidad en inventario |
| `creadoEn` | `TIMESTAMP` | Fecha y hora de registro en el sistema |

---

## Endpoints de la API

La API responde en formato JSON y maneja códigos de estado HTTP estándar:

| Método | Ruta | Descripción | Código |
|:---:|---|---|:---:|
| `GET` | `/api/videojuegos` | Listar catálogo (admite filtros: `genero`, `minCalificacion`, `search`, `sortBy`, `order`) | `200` |
| `GET` | `/api/videojuegos/:id` | Obtener el detalle de un videojuego por su ID | `200` / `404` |
| `GET` | `/api/videojuegos/stats` | Estadísticas del catálogo (promedios, totales y géneros) | `200` |
| `POST` | `/api/videojuegos` | Crear un nuevo videojuego | `201` / `400` |
| `PUT` | `/api/videojuegos/:id` | Reemplazo completo de un videojuego existente | `200` / `404` |
| `PATCH` | `/api/videojuegos/:id` | Modificación parcial de uno o varios campos | `200` / `404` |
| `DELETE` | `/api/videojuegos/:id` | Eliminar un videojuego por su ID | `200` / `404` |
| `POST` | `/api/videojuegos/reset-seed` | Restaurar los datos semilla iniciales de prueba | `200` |
| `GET` | `/api/health` | Estado del servidor y metadatos de ejecución | `200` |
| `GET` | `/api/docs` | Documentación interactiva Swagger / OpenAPI | `200` |

---

## Instalación y Ejecución

### Requisitos previos
- Node.js (versión 20 o superior)
- npm

### Pasos

1. Clonar el repositorio e ingresar al directorio del proyecto:
   ```bash
   git clone https://github.com/juda-dev/parcial3-metodologiadelaprogramacion4.git
   cd parcial3-metodologiadelaprogramacion4
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar y ejecutar en modo producción:
   ```bash
   npm run build
   npm start
   ```

El servidor iniciará por defecto en `http://localhost:3000`.

---

## Base de Datos

El proyecto cuenta con un adaptador dual de persistencia:

- **SQLite (por defecto):** Utiliza el módulo nativo de Node.js (`node:sqlite`). Se inicializa de forma automática en `./data/videojuegos.sqlite` con datos semilla al primer arranque, sin necesidad de instalar o configurar servicios externos.
- **MySQL (opcional):** En la carpeta `database/` se incluyen los scripts `schema.sql` y `seed.sql`. Para activarlo, se define `DB_DIALECT=mysql` en el archivo `.env` junto con las credenciales de conexión (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).

---

## Pruebas con Postman

En el directorio `postman/` se encuentran los archivos necesarios para importar en Postman:

- `Parcial3_Videojuegos_API.postman_collection.json`: Colección con las peticiones configuradas para todos los métodos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) y pruebas de validación con aserciones automáticas.
- `Parcial3_Environment.postman_environment.json`: Entorno con la variable base `baseUrl = http://localhost:3000`.

---

## Interfaz Web

La aplicación incluye una interfaz gráfica servida en la raíz (`/`) que permite consultar el catálogo, filtrar en tiempo real, visualizar estadísticas y ejecutar las operaciones `POST`, `PUT`, `PATCH` y `DELETE` visualmente mediante modales con registro de la actividad HTTP.
