import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

/**
 * Error handler middleware
 * @param error
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(error);
    if (error instanceof CustomError) {
        return res.status(error.status).send({
            errors: error.renderError(),
        });
    }

    res.status(400).send({
        errors: {
            message: "Something went wrong!",
        },
    });
};
