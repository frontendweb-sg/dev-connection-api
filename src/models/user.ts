import mongoose, { Schema, Document } from "mongoose";
import { Password } from "../utils/password";
import { Media } from "../types";

export const USER_TABLE = "user";
export enum ERole {
  Admin = "admin",
  User = "user",
}

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  mobile: string;
  avatar: Media;
  role: string;
  emailVerify: boolean;
  provider: string;
  provider_id: string;
  expireToken: string;
  active: string;
}
export interface IUserDoc extends Document<IUser>, IUser {}

const schema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true, select: false },
    mobile: { type: String, required: true, trim: true, unique: true },
    avatar: {
      public_id: { type: String, default: null },
      url: { type: String, default: "" },
      resource_type: { type: String, default: "" },
      access_mode: { type: String, default: "" },
      folder: { type: String, default: "" },
      signature: { type: String, default: "" },
      version: { type: String, default: "" },
    },
    expireToken: { type: String, default: "" },
    provider: { type: String, default: "credential" },
    provider_id: { type: String, default: "" },
    role: { type: String, default: ERole.User, enum: ERole },
    active: { type: Boolean, default: true },
    emailVerify: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);
schema.virtual("id").get(function () {
  return this._id.toHexString();
});
schema.pre("save", function cb(done) {
  const password = this.get("password");
  if (this.isModified("password")) {
    this.set("password", Password.hash(password));
  }
  if (this.get("role") === "admin") this.set("emailVerify", true);
  done();
});

export const User = mongoose.model<IUserDoc>(USER_TABLE, schema);
