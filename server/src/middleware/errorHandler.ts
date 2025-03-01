import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware.
 * Captures errors from all parts of the application and sends a consistent response.
 */
export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  console.error(`Error: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

/**
 * Utility function to create custom errors with status codes.
 *
 * @param message - Error message to be displayed.
 * @param statusCode - HTTP status code associated with the error.
 * @returns A custom error object with a status code.
 */
export const createError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};
