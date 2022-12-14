import express, { Router } from "express";
import {
    create,
    deleted,
    getAll,
    update,
    likePost,
    dislikePost,
    commentAdd,
    commentRemove,
} from "../controllers/post";
import { Uploader } from "../utils/multer";
import { requestValidator } from "../middleware/request-validator";
import { check } from "express-validator";
import { auth } from "../middleware/auth";

const route = express.Router();

const upload = Uploader("posts");

route.get("/", auth, getAll);

route.post(
    "/",
    upload.single("image"),
    [check("title", "title is required!").notEmpty()],
    requestValidator,
    auth,
    create
);

route.put(
    "/:postId",
    upload.single("image"),
    [check("title", "title is required!").notEmpty()],
    requestValidator,
    auth,
    update
);

route.delete("/:postId", auth, deleted);

route.put("/:postId/like", auth, likePost);
route.put("/:postId/dislike", auth, dislikePost);
route.put("/:postId/comment", auth, commentAdd);
route.delete("/:postId/comment/:commentId", commentRemove);

export { route as postRouter };
