/**
 * Structured application error. Thrown from controllers/services and caught
 * by the centralized error middleware so responses are always consistent
 * and never leak stack traces to the client.
 */
export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(400, message, details);
  }
  static unauthorized(message = "Not authenticated") {
    return new ApiError(401, message);
  }
  static forbidden(message = "Not authorized") {
    return new ApiError(403, message);
  }
  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }
  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }
  static internal(message = "Something went wrong") {
    return new ApiError(500, message);
  }
}
