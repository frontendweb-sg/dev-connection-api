import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

/**
 * Request validation handler
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const requestValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        throw new RequestValidationError(result.array());
    }
    next();
};
