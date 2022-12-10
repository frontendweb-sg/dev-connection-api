import mongoose, { Document, Schema } from "mongoose";

const DESIGNATION_TABLE_NAME = "designation";
interface IDesignation {
    title: string;
    slug: string;
    active: boolean;
}

interface IDesignationDoc extends Document<IDesignation>, IDesignation {}

const schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
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

const Designation = mongoose.model<IDesignationDoc>(
    DESIGNATION_TABLE_NAME,
    schema
);
export { Designation, DESIGNATION_TABLE_NAME, type IDesignationDoc };
