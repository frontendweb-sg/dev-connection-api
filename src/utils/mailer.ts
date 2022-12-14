import fs from "fs";
import path from "path";
import ejs from "ejs";
import nodemailer from "nodemailer";
import { config } from "../config";
import { BadRequestError } from "../errors/bad-request-error";
import { IUserDoc } from "../models/user";
const sgGrid = require("nodemailer-sendgrid-transport");

interface IMail {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}

interface mailerBody {
    local: string;
    email: string;
    token: string;
    templateName: string;
    user: IUserDoc;
}

export class Mailer {
    private _transport: nodemailer.Transporter;
    constructor() {
        this._transport = nodemailer.createTransport(
            sgGrid({
                auth: {
                    api_key: config.EMAIL_API_KEY,
                },
            })
            // {
            //     host: "smtp.mailtrap.io",
            //     port: 2525,
            //     auth: {
            //         user: config.MAIL_TRAP_USER,
            //         pass: config.MAIL_TRAP_PASS,
            //     },
            // }
        );
    }

    static container(body: mailerBody) {
        const { local, email, token, user, templateName } = body;
        const mailer = new Mailer();

        const readTemplate = fs.readFileSync(
            path.join(__dirname, "..", `views/${templateName}.ejs`),
            "utf-8"
        );
        const template = ejs.compile(readTemplate);

        mailer.send({
            to: email,
            from: config.MAILER_ID,
            subject: "Registration successfull",
            text: `Welcome to ${user.firstname} ${user.lastname}`,
            html: template({
                email: email,
                firstname: user.firstname,
                lastname: user.lastname,
                token: token,
                localURL: local,
            }),
        });
    }

    send(option: IMail) {
        this._transport.sendMail(option, (error) => {
            if (error) throw new BadRequestError(error.message);
            console.log("Mail sent!");
        });
    }
}
