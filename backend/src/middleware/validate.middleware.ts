import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation échouée',
        details: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
      return;
    }
    req.body = result.data;
    next();
  };