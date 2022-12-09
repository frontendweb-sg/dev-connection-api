import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Designation, IDesignationDoc } from "../models/designation";
import { slugname } from "../utils";
import { Status } from "../utils/enum";

/**
 * Get all designations
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = 10;
        const query = req.query;
        const data = (await Designation.find().sort({
            title: 1,
        })) as IDesignationDoc[];
        return res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};

/**
 * Create designation
 * @param req
 * @param res
 * @param next
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;

        const data = (await Designation.findOne({
            slug: title.toLowerCase(),
        })) as IDesignationDoc;

        if (data) {
            throw new BadRequestError("Designation already existed!");
        }

        const designation = new Designation({
            title,
            slug: slugname(title),
            description,
        });

        const result = await designation.save();
        return res.status(201).send(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Update designation
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.designationId;
        const status = req.query.status;
        if (status) {
            return activeInactive(req, res, next);
        }

        const { title, description } = req.body;
        const result = await Designation.findByIdAndUpdate(
            id,
            {
                $set: { title, slug: slugname(title), description },
            },
            { new: true }
        );

        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete designation
 * @param req
 * @param res
 * @param next
 */
const deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.designationId;

        // check designation existed
        const category = await Designation.findById(id);
        if (!category) throw new NotFoundError("Category not found!");

        await Designation.findByIdAndDelete(id);

        return res.status(200).send({ _id: id });
    } catch (error) {
        next(error);
    }
};

/**
 * Active / Inactive designation
 * @param req
 * @param res
 * @param next
 * @returns
 */
const activeInactive = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.designationId;

        // check designation existed
        const data = await Designation.findById(id);
        if (!data) throw new NotFoundError("Designation not found!");

        const status = req.query.status;
        const result = await Designation.findByIdAndUpdate(
            id,
            {
                $set: { active: status === Status.active ? true : false },
            },
            { new: true }
        );

        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

export { create, update, deleted, getAll };
