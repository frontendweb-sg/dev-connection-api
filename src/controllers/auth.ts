import { NextFunction, Request, Response } from "express";
import { AuthError } from "../errors/auth-error";
import { IUserDoc, User } from "../models/user";
import { Jwt } from "../utils/jwt";
import { Mailer } from "../utils/mailer";
import { Password } from "../utils/Password";

/**
 * Signup controller
 * @param req
 * @param res
 * @param next
 */
const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstname, lastname, email, password, mobile, role } = req.body;

        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            mobile,
            role,
        });

        const token = Jwt.getToken(newUser);
        Mailer.container({
            local: res.locals.localURL,
            email,
            token,
            templateName: "registration",
            user: newUser,
        });

        const result = (await newUser.save()) as IUserDoc;
        return res.send({
            success: true,
            message: "User signup successfull",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Signin controller
 * @param req
 * @param res
 * @param next
 */
const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = (await User.findOne({
            $or: [{ email: email }, { mobile: email }],
        })) as IUserDoc;

        if (!user) {
            throw new AuthError("User does not exists!");
        }

        const verify = Password.toCompare(password, user.password);
        if (!verify) {
            throw new AuthError("Password does not matched!");
        }

        const token = Jwt.getToken(user) as string;
        req.session.user = user;

        const expireTime = new Date(Date.now());
        expireTime.setHours(expireTime.getHours() + 1);

        return res.send({
            success: true,
            message: "User signup successfull",
            token: token,
            expireTime,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Forgot password controller
 * @param req
 * @param res
 * @param next
 */
const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

/**
 * Email verification
 * @param req
 * @param res
 * @param next
 */
const emailVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

// export methods
export { signIn, signUp, forgotPassword, emailVerify };
