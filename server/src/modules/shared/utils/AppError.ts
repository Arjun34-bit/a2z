export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    
    // Restore prototype chain for extending built-in Error in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Capture stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}
