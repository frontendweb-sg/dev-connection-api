import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Category, ICategoryDoc } from "../models/category";
import { slugname } from "../utils";
import { Status } from "../utils/enum";

/**
 * Get all categories
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = 10;
        const query = req.query;
        const data = await Category.find().sort({ title: 1 });
        return res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};

/**
 * Create category
 * @param req
 * @param res
 * @param next
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;

        const isCategory = (await Category.findOne({
            slug: title.toLowerCase(),
        })) as ICategoryDoc;

        if (isCategory) {
            throw new BadRequestError("Category already existed!");
        }

        const category = new Category({
            title,
            slug: slugname(title),
            description,
        });

        const result = await category.save();
        return res.status(201).send(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Update category
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const catId = req.params.catId;
        const status = req.query.status;
        if (status) {
            return activeInactive(req, res, next);
        }

        const { title, description } = req.body;
        const result = await Category.findByIdAndUpdate(
            catId,
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
 * Delete category
 * @param req
 * @param res
 * @param next
 */
const deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const catId = req.params.catId;

        // check category existed
        const category = await Category.findById(catId);
        if (!category) throw new NotFoundError("Category not found!");

        const result = await Category.findByIdAndDelete(catId);

        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Active / Inactive category
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
        const catId = req.params.catId;

        // check category existed
        const category = await Category.findById(catId);
        if (!category) throw new NotFoundError("Category not found!");

        const status = req.query.status;
        const result = await Category.findByIdAndUpdate(
            catId,
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
