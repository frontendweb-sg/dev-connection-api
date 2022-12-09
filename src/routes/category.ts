import express from "express";
import { create, deleted, getAll, update } from "../controllers/category";

const route = express.Router();

route.get("/", getAll);
route.post("/", create);
route.put("/:catId", update);
route.delete("/:catId", deleted);

export { route as categoryRoute };
