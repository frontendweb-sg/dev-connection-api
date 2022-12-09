import { type IError, CustomError } from "./custom-error";

/**
 * Not found
 */
export class NotFoundError extends CustomError {
    status = 404;
    constructor(public message: string = "Not found") {
        super(message);
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
