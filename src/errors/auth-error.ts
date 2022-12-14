import { type IError, CustomError } from "./custom-error";

/**
 * Not found
 */
export class AuthError extends CustomError {
    status = 401;
    constructor(public message: string = "Unauthrozied access!") {
        super(message);
        Object.setPrototypeOf(this, AuthError.prototype);
    }
    renderError(): IError[] {
        return [
            {
                message: this.message,
                field: this.name,
            },
        ];
    }
}
