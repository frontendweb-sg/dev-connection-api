import mongoose, { Document, Schema } from "mongoose";

const SKILL_TABLE_NAME = "skill";
interface ISkill {
    title: string;
    slug: string;
    active: boolean;
}

interface ISkillDoc extends Document<ISkill>, ISkill {}

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

const Skill = mongoose.model<ISkillDoc>(SKILL_TABLE_NAME, schema);
export { Skill, SKILL_TABLE_NAME, type ISkillDoc };
