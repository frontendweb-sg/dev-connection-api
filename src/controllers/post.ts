import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { ILike, IPostDoc, Post } from "../models/post";
import { deleteFile } from "../utils/multer";
import path from "path";
/**
 * Get all post
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().sort({ insertAt: 1 });
        return res.status(200).send(posts);
    } catch (error) {
        next(error);
    }
};

/**
 * Create post
 * @param req
 * @param res
 * @param next
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, code, category } = req.body;
        const image = req.file;

        const post = new Post({
            category,
            title,
            description,
            code,
            image: image?.filename,
        });

        const result = await post.save();
        return res.status(201).send(result);
    } catch (error) {
        deleteFile("posts", req.file?.filename!);
        next(error);
    }
};

/**
 * Update post
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.postId;

        const { title, description, code, category } = req.body;
        const image = req.file;

        const post = (await Post.findById(id)) as IPostDoc;
        if (!post) {
            deleteFile("posts", image?.filename!);
            throw new NotFoundError("Post not found!");
        }

        if (image) {
            deleteFile("posts", post.image);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    code,
                    category,
                    image: image ? image.filename : post.image,
                },
            },
            {
                new: true,
            }
        );

        return res.status(200).send(updatedPost);
    } catch (error) {
        deleteFile("posts", req.file?.filename!);
        next(error);
    }
};

/**
 * Delete post
 * @param req
 * @param res
 * @param next
 */
const deleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.postId;

        const post = (await Post.findById(id)) as IPostDoc;
        if (!post) {
            throw new NotFoundError("Post not found!");
        }

        const result = await Post.findByIdAndDelete(id);
        if (result) {
            deleteFile("posts", result.image);
        }

        return res.status(200).send({ _id: id });
    } catch (error) {
        next(error);
    }
};

/**
 * upload image
 * @param req
 * @param res
 * @param next
 */
const upload = async (req: Request, res: Response, next: NextFunction) => {};

/**
 * Like post
 * @param req
 * @param res
 * @param next
 */
const postLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.postId;
        // const userId = req.currentUser.userId;

        const post = (await Post.findById(id)) as IPostDoc;

        if (!post) {
            throw new NotFoundError("Post not found!");
        }

        const likes = post.likes as ILike[];
        // const like = likes.find((like: ILike) => like.user === userId);
    } catch (error) {
        next(error);
    }
};

/**
 * Comment controller
 * @param req
 * @param res
 * @param next
 */
const comment = async (req: Request, res: Response, next: NextFunction) => {};

export { getAll, create, update, deleted };
