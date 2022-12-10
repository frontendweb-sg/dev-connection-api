import express from "express";
import { detail, getAll, deleted, deactivate } from "../controllers/user";
import { admin } from "../middleware/admin";
import { auth } from "../middleware/auth";

const route = express.Router();

route.get("/", [auth, admin], getAll);
route.get("/me", auth, detail);
route.put("/me/deactivate", auth, deactivate);
route.delete("/:userId", [auth, admin], deleted);

export { route as userRouter };
