import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

/**
 * Get all users
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.currentUser);
        const users = await User.find().sort({ insertAt: 1 });
        return res.status(200).send(users);
    } catch (error) {
        next(error);
    }
};

export { getAll };
