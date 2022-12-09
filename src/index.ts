import * as dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { version } from "../package.json";
import { connectDb } from "./db";
import { errorHandler } from "./middleware/error-handler";
import { authRoute } from "./routes/auth";

console.log(process.env.NODE_ENV);
// App
const app = express();
const PORT = process.env.PORT || 4200;

// cookies config here

// cors config here

// configuration
app.set("title", "thesocial");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("upload"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === "development") {
        res.locals.localURL = "http://localhost:4200/api";
    } else {
        res.locals.localURL = "https://dev-connections-api.herokuapp.com";
    }
    next();
});

// route are here
app.use("/api/auth", authRoute);

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
