import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";

// app
const app = express();
const PORT = process.env.PORT || 3001;

// setting
app.set("title", "shopkart-api");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    morgan("dev");
    next();
  }
});

// catch all route and if not found throw error
app.get("*", function (req, res) {
  throw new Error("Route not found");
});

app.use(errorHandler);

// listen
const server = app.listen(PORT, () => {
  console.log(`Server is running on: localhost:${PORT}`);
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

function gracefulShutdown() {
  server.close(() => {
    process.exit(0);
  });
}

module.exports = app;
