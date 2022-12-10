import mongoose, { Document, Schema } from "mongoose";
import { Status } from "../utils/enum";
import { CATEGORY_TABLE_NAME } from "./category";
import { USER_TABLE_NAME } from "./user";

const POST_TABLE_NAME = "post";
type TStatus = Status.approved | Status.pending | Status.rejected;

interface ILike {
    user: string;
    like: boolean;
}

interface IComment {
    user: string;
    comment: string;
    status: TStatus;
    insertAt: Date;
}

interface IPost {
    category: string;
    user: string;
    title: string;
    description: string;
    image: string;
    code?: string;
    likes?: ILike[];
    comments?: IComment[];
    active?: boolean;
}

interface IPostDoc extends Document<IPost>, IPost {}

const schema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: CATEGORY_TABLE_NAME,
        default: null,
    },
    user: { type: Schema.Types.ObjectId, ref: USER_TABLE_NAME, default: null },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    code: { type: String, default: null },
    likes: [
        {
            user: { type: Schema.Types.ObjectId, ref: USER_TABLE_NAME },
            active: { type: Boolean, default: false },
        },
    ],
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: USER_TABLE_NAME },
            comment: { type: String },
            status: { type: String, default: Status.pending, enum: Status },
        },
    ],
    active: { type: Boolean, default: true },
});

const Post = mongoose.model<IPostDoc>(POST_TABLE_NAME, schema);
export {
    Post,
    POST_TABLE_NAME,
    type IPostDoc,
    type ILike,
    type IComment,
    type TStatus,
};
