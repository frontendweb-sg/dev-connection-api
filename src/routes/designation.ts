import express from "express";
import { check } from "express-validator";
import { create, deleted, getAll, update } from "../controllers/designation";
import { admin } from "../middleware/admin";
import { auth } from "../middleware/auth";
import { requestValidator } from "../middleware/request-validator";

const route = express.Router();

route.get("/", auth, getAll);

route.post(
    "/",
    [check("title", "title is required!").notEmpty()],
    requestValidator,
    [auth, admin],
    create
);

route.put(
    "/:designationId",
    [check("title", "title is required!").notEmpty()],
    requestValidator,
    [auth, admin],
    update
);

route.delete("/:designationId", [auth, admin], deleted);

export { route as designationRoute };
