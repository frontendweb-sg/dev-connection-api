import { Request, Response, NextFunction } from "express";
import { AuthError } from "../errors/auth-error";
import { IUserDoc, User } from "../models/user";

/**
 * Admin middleware
 * @param req
 * @param res
 * @param next
 */
export const admin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(req.currentUser);
        const user = (await User.findById(req.currentUser._id)) as IUserDoc;

        if (!user) {
            throw new AuthError("Unauthorized access");
        }

        if (user.role !== "admin") {
            throw new AuthError(
                "You don't have enough permission to access this api"
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};
