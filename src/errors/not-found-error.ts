import { type IError, CustomError } from "./custom-error";

/**
 * Not found
 */
export class NotFoundError extends CustomError {
    status = 404;
    constructor(public message: string = "Not found") {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
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
