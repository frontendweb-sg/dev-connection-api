import * as dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./doc/swagger.json";
import Session from "express-session";
import { version } from "../package.json";
import { connectDb } from "./db";
import { errorHandler } from "./middleware/error-handler";
import { authRoute } from "./routes/auth";
import { categoryRoute } from "./routes/category";
import { designationRoute } from "./routes/designation";
import { postRouter } from "./routes/post";
import { skillRoute } from "./routes/skill";
import { userRouter } from "./routes/user";
import { config } from "./config";
import { IUserDoc } from "./models/user";

declare module "express-session" {
    interface SessionData {
        user: IUserDoc;
    }
}
// App
const app = express();
const PORT = process.env.PORT || 4200;

// cors config here
// configuration
app.set("title", "thesocial");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("upload"));
app.use(express.static(path.join(__dirname, "..", "public")));

// cors
app.use(cors());

// session
app.use(
    Session({
        secret: config.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: true,
        },
        saveUninitialized: true,
        resave: false,
    })
);

// for production
if (app.get("env") === "production") {
    app.set("trust proxy", 1);
}

// local variables
app.use((req: Request, res: Response, next: NextFunction) => {
    if (app.get("env") === "development") {
        res.locals.localURL = "http://localhost:4200/api";
    } else {
        res.locals.localURL = "https://dev-vconnections-api.herokuapp.com";
    }
    next();
});

// route are here
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api/auth", authRoute);
app.use("/api/user", userRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/designation", designationRoute);
app.use("/api/skill", skillRoute);
app.use("/api/post", postRouter);

// api route
app.get("/api", (req: Request, res: Response, next: NextFunction) => {
    res.send({
        api: {
            message: "Api is running...",
            version: version,
        },
    });
});

if (app.get("env") === "development") {
    app.get(
        "/api/template",
        (req: Request, res: Response, next: NextFunction) => {
            res.render(path.join(__dirname, "views/registration.ejs"), {
                token: "User registration",
                firstname: "Pradeep ",
                lastname: "Kumar",
            });
        }
    );
}

// catch error
app.use(errorHandler);

// listen
app.listen(PORT, async () => {
    console.log("Server is running on port " + PORT);
    await connectDb();
});

export { app };
