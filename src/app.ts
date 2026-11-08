import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import gameRoutes from './routes/game.routes.js';
import healthRoutes from './routes/health.routes.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

export function createApp(): Application {
  const app = express();

  // Middlewares de parseo y seguridad básica
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // Servir archivos estáticos del frontend (Interfaz Gráfica)
  const publicDir = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicDir));

  // Servir archivos de Postman para descarga directa
  const postmanDir = path.resolve(process.cwd(), 'postman');
  app.use('/postman', express.static(postmanDir));

  // Documentación Interactiva Swagger / OpenAPI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Rutas de la API REST
  app.use('/api/health', healthRoutes);
  app.use('/api/videojuegos', gameRoutes);

  // Manejador 404 para rutas no existentes
  app.use(notFoundHandler);

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}
