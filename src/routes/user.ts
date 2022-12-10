import express from "express";
import { getAll } from "../controllers/user";
import { auth } from "../middleware/auth";

const route = express.Router();

route.get("/", auth, getAll);

export { route as userRouter };
