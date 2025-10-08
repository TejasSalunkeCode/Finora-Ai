// src/exceptions/unauthorized.exception.ts
export class UnauthorizedException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
    this.statusCode = 401;
  }
}
