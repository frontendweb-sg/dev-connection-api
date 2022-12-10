import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { sync } from "mkdirp";
import { Request } from "express";
import { regExp } from "./regexp";
import { BadRequestError } from "../errors/bad-request-error";

type Callback = (error: Error | null, filename: string) => void;

const filterFile = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!file.originalname.match(regExp.imgReg)) {
        return cb(
            new Error(
                "Please upload file in these formats (jpe?g|png|giff|jfif|pmp)"
            )
        );
    }
    return cb(null, true);
};

export const deleteFile = (folder: string, filename: string) => {
    const dir = path.join(__dirname, "..", "uploads", folder + "/" + filename);
    if (fs.existsSync(dir)) {
        return fs.unlinkSync(dir);
    }
    return new BadRequestError("Path does not exists");
};

export const Uploader = (dir: string, filter?: any) => {
    const disk = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: Callback
        ) => {
            const folder = path.join(__dirname, "..", "uploads/", dir);
            if (!fs.existsSync(folder)) sync(folder);
            cb(null, folder);
        },
        filename: (req: Request, file: Express.Multer.File, cb: Callback) => {
            const name = `${Date.now().toString()}-${file.originalname
                .replace(/\s+/, "-")
                .toLowerCase()}`;
            cb(null, name);
        },
    });

    return multer({
        storage: disk,
        fileFilter: filter ?? filterFile,
    });
};
