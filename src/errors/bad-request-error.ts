import { type IError, CustomError } from "./custom-error";

/**
 * Not found
 */
export class BadRequestError extends CustomError {
    status = 400;
    constructor(public message: string = "Bad request!") {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
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
