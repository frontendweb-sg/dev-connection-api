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
        const users = await User.find().sort({ insertAt: 1 });
        return res.status(200).send(users);
    } catch (error) {
        next(error);
    }
};

/**
 * Logged in user detail
 * @param req
 * @param res
 * @param next
 * @returns
 */
const detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.currentUser._id);
        return res.status(200).send(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * @param req
 * @param res
 * @param next
 */
const deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {}
};

const deactivate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

export { getAll, detail, deleted, deactivate };
