import mongoose, { Document, Schema } from "mongoose";

const CATEGORY_TABLE_NAME = "category";
interface ICategory {
    title: string;
    slug: string;
    description: string;
    active: boolean;
}

interface ICategoryDoc extends Document<ICategory>, ICategory {}

const schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String, default: "" },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, _ret) {
                delete _ret.__v;
            },
        },
    }
);

const Category = mongoose.model<ICategoryDoc>(CATEGORY_TABLE_NAME, schema);
export { Category, CATEGORY_TABLE_NAME, type ICategoryDoc };
