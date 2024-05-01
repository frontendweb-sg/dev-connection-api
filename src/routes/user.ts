import { Router } from "express";
import { auth } from "../middleware/auth";

import { loggedInUser } from "../controllers/user";

const route = Router();

route.get("/me", auth, loggedInUser);

export { route as userRoute };
