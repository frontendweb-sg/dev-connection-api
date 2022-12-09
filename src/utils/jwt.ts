import JWT from "jsonwebtoken";
import { config } from "../config";
import { IUserDoc } from "../models/user";

/**
 * Jwt class
 * 1. Generate token
 * 2. Verify token
 */
export class Jwt {
    static getToken(user: IUserDoc) {
        return JWT.sign(
            { email: user.email, _id: user._id },
            config.SECRET_KEY,
            { expiresIn: "1h" }
        );
    }

    static verifyToken(token: string) {
        return JWT.verify(token, config.SECRET_KEY);
    }
}
