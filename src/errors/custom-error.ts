export interface IError {
    message?: string;
    field?: string;
    status?: number;
}
export abstract class CustomError extends Error {
    abstract status: number;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    abstract renderError(): IError[];
}
