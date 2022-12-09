import express from "express";
import {
    emailVerify,
    forgotPassword,
    signIn,
    signUp,
} from "../controllers/auth";
import { body, check } from "express-validator";
import { requestValidator } from "../middleware/request-validator";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { regExp } from "../utils/regexp";
const PasswordMessage =
    "Password must contain at least one uppercase, one lowercase, one digit and a symbol";

const route = express();

route.post(
    "/signup",
    [
        body("firstname", "First name is required").notEmpty(),
        body("lastname", "First name is required").notEmpty(),
        body("email", "Email is required")
            .isEmail()
            .custom(async (value) => {
                const isEmail = await User.findOne({ email: value });
                if (isEmail) {
                    throw new BadRequestError(
                        "Email is already existed with other account!"
                    );
                }
                return true;
            }),
        check("password", "Password is required!")
            .not()
            .isEmpty()
            .custom((value) => {
                if (!regExp.password.test(value)) {
                    throw new BadRequestError(PasswordMessage);
                }
                return true;
            })
            .isLength({ min: 8, max: 16 })
            .withMessage("Password must be between 8 to 16 char long"),
        check("mobile", "Mobile is required!")
            .not()
            .isEmpty()
            .custom(async (value) => {
                const isMobile = await User.findOne({ mobile: value });
                if (isMobile) {
                    throw new BadRequestError(
                        "Mobile is already existed with other account!"
                    );
                }
                return true;
            }),
    ],
    requestValidator,
    signUp
);
route.post(
    "/",
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password is required!")
            .not()
            .isEmpty()
            .isLength({ min: 8, max: 16 })
            .withMessage("Password must be between 8 to 16 char long"),
    ],
    requestValidator,
    signIn
);
route.post("/:token", forgotPassword);
route.post("/verify", emailVerify);

export { route as authRoute };
