import express from "express";
import { create, deleted, getAll, update } from "../controllers/designation";

const route = express.Router();

route.get("/", getAll);
route.post("/", create);
route.put("/:designationId", update);
route.delete("/:designationId", deleted);

export { route as designationRoute };
