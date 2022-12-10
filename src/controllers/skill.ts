import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Skill, ISkillDoc } from "../models/skill";
import { slugname } from "../utils";
import { Status } from "../utils/enum";

/**
 * Get all skill
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = 10;
        const query = req.query;
        const data = (await Skill.find().sort({
            title: 1,
        })) as ISkillDoc[];
        return res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};

/**
 * Create skill
 * @param req
 * @param res
 * @param next
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;

        const data = (await Skill.findOne({
            slug: title.toLowerCase(),
        })) as ISkillDoc;

        if (data) {
            throw new BadRequestError("Skill already existed!");
        }

        const skill = new Skill({
            title,
            slug: slugname(title),
        });

        const result = await skill.save();
        return res.status(201).send(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Update skill
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.skillId;
        const status = req.query.status;
        if (status) {
            return activeInactive(req, res, next);
        }

        const { title } = req.body;
        const result = await Skill.findByIdAndUpdate(
            id,
            {
                $set: { title, slug: slugname(title) },
            },
            { new: true }
        );

        return res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete skill
 * @param req
 * @param res
 * @param next
 */
const deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.skillId;

        const skill = await Skill.findById(id);
        if (!skill) throw new NotFoundError("Skill not found!");

        await Skill.findByIdAndDelete(id);

        return res.status(200).send({ _id: id });
    } catch (error) {
        next(error);
    }
};

/**
 * Active / Inactive skill
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

        const data = await Skill.findById(id);
        if (!data) throw new NotFoundError("Skill not found!");

        const status = req.query.status;
        const result = await Skill.findByIdAndUpdate(
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
