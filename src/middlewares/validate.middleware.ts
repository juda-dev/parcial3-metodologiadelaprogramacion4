import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Error de validación en los datos enviados',
          detalles: error.errors.map((e) => ({
            campo: e.path.join('.'),
            mensaje: e.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Parámetros de ruta inválidos',
          detalles: error.errors.map((e) => ({
            campo: e.path.join('.'),
            mensaje: e.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Parámetros de consulta (query) inválidos',
          detalles: error.errors.map((e) => ({
            campo: e.path.join('.'),
            mensaje: e.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};
