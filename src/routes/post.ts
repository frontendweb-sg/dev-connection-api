import express from "express";
import { create, deleted, getAll, update } from "../controllers/post";
import { Uploader } from "../utils/multer";
import { requestValidator } from "../middleware/request-validator";
import { check } from "express-validator";

const route = express.Router();

const upload = Uploader("posts");

route.get("/", getAll);

route.post(
    "/",
    upload.single("image"),
    [check("title", "title is required!").notEmpty()],
    requestValidator,
    create
);

route.put(
    "/:postId",
    upload.single("image"),
    [check("title", "title is required!").notEmpty()],
    requestValidator,
    update
);

route.delete("/:postId", deleted);

export { route as postRouter };
