import { HTTPSTATUS, type HttpStatusCodeType } from "../config/http.config.js";
import type { ErrorCodeEnumType } from "../enums/error-code.enum.js";

export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode?: ErrorCodeEnumType | undefined;

    constructor(
        message: string,
        statusCode: HttpStatusCodeType = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        errorCode?: ErrorCodeEnumType
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
