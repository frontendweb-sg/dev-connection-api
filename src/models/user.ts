import mongoose, { Document, Schema } from "mongoose";
import { Password } from "../utils/Password";

const USER_TABLE_NAME = "user";
interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    mobile: string;
    active: boolean;
    role: string;
    verify: boolean;
    token?: string;
    expireToken?: Date;
}

interface IUserDoc extends Document<IUser>, IUser {}

const schema = new Schema(
    {
        firstname: { type: String, required: true, trim: true },
        lastname: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true, trim: true },
        mobile: { type: String, required: true, unique: true },
        role: { type: String, default: "user", enum: ["admin", "user"] },
        verify: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
        token: { type: String, default: "" },
        expireToken: { type: Date, default: null },
    },
    {
        strict: true,
        timestamps: true,
        toJSON: {
            transform(doc, _ret) {
                delete _ret.__v;
            },
        },
    }
);

schema.pre("save", function cb(done) {
    if (this.isModified("password")) {
        const password = Password.toHash(this.get("password"));
        this.set("password", password);
    }
    const verify = this.get("role") === "admin" ? true : false;
    this.set("verify", verify);
    done();
});

const User = mongoose.model<IUserDoc>(USER_TABLE_NAME, schema);
export { User, USER_TABLE_NAME, type IUserDoc };
