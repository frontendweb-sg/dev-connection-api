import { NextFunction, Request, Response } from "express";
import { AuthError } from "../errors/auth-error";
import { Jwt } from "../utils/jwt";

/**
 * Auth middleware
 * @param req
 * @param res
 * @param next
 */

interface ICurentUser {
    _id: string;
    email: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.get("Authorization");
        console.log("token", token);
        if (!token) {
            throw new AuthError("Unauthorized access");
        }

        const verify = Jwt.verifyToken(token) as ICurentUser | void;
        console.log("verify", verify);
        if (!verify) {
            throw new AuthError("Unauthorized access");
        }

        req.currentUser = verify;

        next();
    } catch (error) {
        next(error);
    }
};
