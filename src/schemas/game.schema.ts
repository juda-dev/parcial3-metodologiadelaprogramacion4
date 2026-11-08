import { z } from 'zod';

// Esquema base para los datos de un videojuego (12 campos totales con id y timestamp)
export const createGameSchema = z.object({
  titulo: z
    .string({ required_error: 'El campo "titulo" es obligatorio' })
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres'),

  desarrollador: z
    .string({ required_error: 'El campo "desarrollador" es obligatorio' })
    .trim()
    .min(2, 'El desarrollador debe tener al menos 2 caracteres')
    .max(120, 'El desarrollador no puede exceder 120 caracteres'),

  genero: z
    .string({ required_error: 'El campo "genero" es obligatorio' })
    .trim()
    .min(2, 'El género debe tener al menos 2 caracteres')
    .max(60, 'El género no puede exceder 60 caracteres'),

  plataforma: z
    .string({ required_error: 'El campo "plataforma" es obligatorio' })
    .trim()
    .min(2, 'La plataforma debe tener al menos 2 caracteres')
    .max(100, 'La plataforma no puede exceder 100 caracteres'),

  anioLanzamiento: z
    .number({ required_error: 'El campo "anioLanzamiento" es obligatorio' })
    .int('El año de lanzamiento debe ser un número entero')
    .min(1970, 'El año debe ser posterior a 1970')
    .max(2035, 'El año no puede ser superior a 2035'),

  calificacion: z
    .number({ required_error: 'El campo "calificacion" es obligatorio' })
    .min(0, 'La calificación mínima es 0.0')
    .max(10, 'La calificación máxima es 10.0')
    .transform((val) => Math.round(val * 10) / 10),

  precio: z
    .number({ required_error: 'El campo "precio" es obligatorio' })
    .min(0, 'El precio no puede ser negativo')
    .transform((val) => Math.round(val * 100) / 100),

  descripcion: z
    .string({ required_error: 'El campo "descripcion" es obligatorio' })
    .trim()
    .min(5, 'La descripción debe tener al menos 5 caracteres'),

  imagenUrl: z
    .string({ required_error: 'El campo "imagenUrl" es obligatorio' })
    .trim()
    .url('El campo "imagenUrl" debe ser una URL válida')
    .max(500, 'La URL de la imagen no puede exceder 500 caracteres'),

  enStock: z
    .union([z.boolean(), z.number().int().min(0).max(1)])
    .default(true)
    .transform((val) => (typeof val === 'number' ? val === 1 : val))
});

// PUT requiere reemplazar el objeto completo
export const updateGameSchema = createGameSchema;

// PATCH permite actualizar uno o varios campos parcialmente
export const patchGameSchema = createGameSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar en PATCH'
  });

// Validación para el parámetro :id en las rutas
export const gameIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número entero positivo')
    .transform((val) => parseInt(val, 10))
});

// Validación de query params para filtrado y ordenamiento en GET /api/videojuegos
export const gameQuerySchema = z.object({
  genero: z.string().optional(),
  plataforma: z.string().optional(),
  search: z.string().optional(),
  minCalificacion: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined)),
  maxPrecio: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined)),
  sortBy: z
    .enum(['id', 'titulo', 'calificacion', 'precio', 'anioLanzamiento', 'creadoEn'])
    .optional()
    .default('id'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc')
});
