import express from "express";
import { create, deleted, getAll, update } from "../controllers/skill";

const route = express.Router();

route.get("/", getAll);
route.post("/", create);
route.put("/:skillId", update);
route.delete("/:skillId", deleted);

export { route as skillRoute };
