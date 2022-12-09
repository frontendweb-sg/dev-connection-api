import { ValidationError } from "express-validator";
import { type IError, CustomError } from "./custom-error";

/**
 * Request validation error
 */
export class RequestValidationError extends CustomError {
    status = 400;
    constructor(public errors: ValidationError[]) {
        super("Invalid request");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    renderError(): IError[] {
        return this.errors.map((error) => ({
            message: error.msg,
            field: error.param,
            status: this.status,
        }));
    }
}
