import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ValidationError, BadRequestError, ConflictError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  
  let customError: AppError | undefined;

  // 1. Zod Validation Errors
  if (err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const errorMessages = issues.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`);
    customError = new ValidationError('Invalid input data', errorMessages);
  }

  // 2. Multer Upload Errors
  else if (err.name === 'MulterError') {
    customError = new BadRequestError(`Image Upload Error: ${err.message}`);
  }

  // 3. Sequelize Database Errors
  else if (err.name === 'SequelizeValidationError') {
    const issues = err.errors || [];
    const errorMessages = issues.map((e: any) => e.message);
    customError = new ValidationError('Database Validation Error', errorMessages);
  } 
  else if (err.name === 'SequelizeUniqueConstraintError') {
    const issues = err.errors || [];
    const errorMessages = issues.map((e: any) => e.message);
    customError = new ConflictError(`Duplicate field value entered: ${errorMessages.join(', ')}`);
  }
  else if (err.name === 'SequelizeDatabaseError') {
    // Note: Don't expose internal DB schema details in production
    customError = new BadRequestError('Invalid Database Operation');
  }

  // 4. Fallback to passed AppError
  else if (err instanceof AppError) {
    customError = err;
  }

  // Final Response Structure
  if (customError) {
    res.status(customError.statusCode).json({
      success: false,
      error: {
        name: customError.name,
        message: customError.message,
        ...(customError instanceof ValidationError && { details: customError.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  } else {
    // Unhandled / Unknown errors (500)
    console.error('ERROR 💥:', err);

    res.status(500).json({
      success: false,
      error: {
        name: 'InternalServerError',
        message: 'Something went wrong on the server',
        ...(process.env.NODE_ENV === 'development' && { details: err.message, stack: err.stack }),
      },
    });
  }
};
