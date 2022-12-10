import { type IError, CustomError } from "./custom-error";

/**
 * Not found
 */
export class DatabaseError extends CustomError {
    status = 500;
    constructor(public message: string = "Error connecting to database!") {
        super(message);
        Object.setPrototypeOf(this, DatabaseError.prototype);
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
