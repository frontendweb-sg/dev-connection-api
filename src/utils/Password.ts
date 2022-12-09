import bcrypt from "bcryptjs";

/**
 * Password class
 * 1. Generate hash password
 * 2. Compare password with hash password
 */
export class Password {
    static toHash(password: string) {
        return bcrypt.hashSync(password, 12);
    }
    static toCompare(password: string, hashPassword: string) {
        return bcrypt.compareSync(password, hashPassword);
    }
}
