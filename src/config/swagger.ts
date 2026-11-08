import { config } from './env.js';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Gaming Hub - API REST Videojuegos',
    version: '1.0.0',
    description: `
API REST para la gestión de catálogo de videojuegos.  
Universidad Católica de Pereira - Metodología de la Programación IV  
Desarrollado por: Juan David Arboleda Vallecilla & Diego Diaz
    `,
    contact: {
      name: 'Juan David Arboleda Vallecilla & Diego Diaz',
      email: 'juan.arboleda@ucp.edu.co'
    }
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Actual'
    }
  ],
  tags: [
    { name: 'Videojuegos', description: 'Operaciones CRUD para la gestión de videojuegos' },
    { name: 'Sistema', description: 'Monitoreo de estado y metadata del servidor' }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verifica el estado de salud de la API',
        responses: {
          '200': {
            description: 'Servidor en línea y en correcto funcionamiento'
          }
        }
      }
    },
    '/api/videojuegos/stats': {
      get: {
        tags: ['Videojuegos'],
        summary: 'Obtiene estadísticas resumidas del catálogo',
        responses: {
          '200': {
            description: 'Métricas agregadas del catálogo'
          }
        }
      }
    },
    '/api/videojuegos/reset-seed': {
      post: {
        tags: ['Videojuegos'],
        summary: 'Restaura los datos de prueba iniciales',
        responses: {
          '200': {
            description: 'Base de datos reiniciada con datos semilla'
          }
        }
      }
    },
    '/api/videojuegos': {
      get: {
        tags: ['Videojuegos'],
        summary: 'Lista todos los videojuegos con filtros opcionales',
        parameters: [
          {
            name: 'genero',
            in: 'query',
            description: 'Filtrar por género (ej. RPG, Aventura, Acción)',
            schema: { type: 'string' }
          },
          {
            name: 'plataforma',
            in: 'query',
            description: 'Filtrar por plataforma (ej. PC, PS5, Switch)',
            schema: { type: 'string' }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Búsqueda por texto en título, desarrollador o descripción',
            schema: { type: 'string' }
          },
          {
            name: 'minCalificacion',
            in: 'query',
            description: 'Filtrar por calificación mínima (0 a 10)',
            schema: { type: 'number' }
          },
          {
            name: 'maxPrecio',
            in: 'query',
            description: 'Filtrar por precio máximo en USD',
            schema: { type: 'number' }
          },
          {
            name: 'sortBy',
            in: 'query',
            description: 'Campo de ordenamiento',
            schema: {
              type: 'string',
              enum: ['id', 'titulo', 'calificacion', 'precio', 'anioLanzamiento', 'creadoEn'],
              default: 'id'
            }
          },
          {
            name: 'order',
            in: 'query',
            description: 'Dirección del ordenamiento',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Listado de videojuegos obtenido exitosamente'
          }
        }
      },
      post: {
        tags: ['Videojuegos'],
        summary: 'Crea un nuevo videojuego (POST)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VideojuegoInput' },
              example: {
                titulo: 'Starfield',
                desarrollador: 'Bethesda Game Studios',
                genero: 'RPG Espacial',
                plataforma: 'PC / Xbox Series X',
                anioLanzamiento: 2023,
                calificacion: 8.7,
                precio: 69.99,
                descripcion: 'Explora más de 1000 planetas en una épica aventura de exploración interestelar.',
                imagenUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                enStock: true
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Videojuego creado satisfactoriamente'
          },
          '400': {
            description: 'Datos de entrada inválidos o faltantes'
          }
        }
      }
    },
    '/api/videojuegos/{id}': {
      get: {
        tags: ['Videojuegos'],
        summary: 'Obtiene el detalle de un videojuego por su ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico del videojuego',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'Videojuego encontrado' },
          '404': { description: 'Videojuego no encontrado' }
        }
      },
      put: {
        tags: ['Videojuegos'],
        summary: 'Reemplaza completamente un videojuego existente (PUT)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico del videojuego a reemplazar',
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VideojuegoInput' },
              example: {
                titulo: 'Elden Ring: Shadow of the Erdtree Edition',
                desarrollador: 'FromSoftware',
                genero: 'RPG de Acción',
                plataforma: 'PC / PS5 / Xbox Series X',
                anioLanzamiento: 2024,
                calificacion: 9.8,
                precio: 79.99,
                descripcion: 'Edición definitiva con la aclamada expansión en el Reino de las Sombras.',
                imagenUrl: 'https://images.unsplash.com/photo-1612287233261-2ef3e162d04a?auto=format&fit=crop&w=800&q=80',
                enStock: true
              }
            }
          }
        },
        responses: {
          '200': { description: 'Videojuego reemplazado exitosamente' },
          '400': { description: 'Datos inválidos' },
          '404': { description: 'Videojuego no encontrado' }
        }
      },
      patch: {
        tags: ['Videojuegos'],
        summary: 'Actualiza parcialmente uno o más campos de un videojuego (PATCH)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico del videojuego a modificar',
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VideojuegoPatchInput' },
              example: {
                precio: 49.99,
                calificacion: 9.9,
                enStock: false
              }
            }
          }
        },
        responses: {
          '200': { description: 'Campos modificados exitosamente' },
          '400': { description: 'Petición incorrecta o sin campos a modificar' },
          '404': { description: 'Videojuego no encontrado' }
        }
      },
      delete: {
        tags: ['Videojuegos'],
        summary: 'Elimina un videojuego de la base de datos (DELETE)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID numérico del videojuego a eliminar',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'Videojuego eliminado exitosamente' },
          '404': { description: 'Videojuego no encontrado' }
        }
      }
    }
  },
  components: {
    schemas: {
      VideojuegoInput: {
        type: 'object',
        required: [
          'titulo',
          'desarrollador',
          'genero',
          'plataforma',
          'anioLanzamiento',
          'calificacion',
          'precio',
          'descripcion',
          'imagenUrl'
        ],
        properties: {
          titulo: { type: 'string', minLength: 2, maxLength: 150 },
          desarrollador: { type: 'string', minLength: 2, maxLength: 120 },
          genero: { type: 'string', minLength: 2, maxLength: 60 },
          plataforma: { type: 'string', minLength: 2, maxLength: 100 },
          anioLanzamiento: { type: 'integer', minimum: 1970, maximum: 2035 },
          calificacion: { type: 'number', minimum: 0, maximum: 10 },
          precio: { type: 'number', minimum: 0 },
          descripcion: { type: 'string', minLength: 5 },
          imagenUrl: { type: 'string', format: 'uri' },
          enStock: { type: 'boolean', default: true }
        }
      },
      VideojuegoPatchInput: {
        type: 'object',
        properties: {
          titulo: { type: 'string', minLength: 2, maxLength: 150 },
          desarrollador: { type: 'string', minLength: 2, maxLength: 120 },
          genero: { type: 'string', minLength: 2, maxLength: 60 },
          plataforma: { type: 'string', minLength: 2, maxLength: 100 },
          anioLanzamiento: { type: 'integer', minimum: 1970, maximum: 2035 },
          calificacion: { type: 'number', minimum: 0, maximum: 10 },
          precio: { type: 'number', minimum: 0 },
          descripcion: { type: 'string', minLength: 5 },
          imagenUrl: { type: 'string', format: 'uri' },
          enStock: { type: 'boolean' }
        }
      }
    }
  }
};
