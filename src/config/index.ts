import merge from "lodash/merge";

interface IConfig {
    URL: string;
    SECRET_KEY: string;
    EMAIL_API_KEY: string;
    MAILER_ID: string;
}
const globalConfig = {
    SECRET_KEY: process.env.SECRET_KEY,
    EMAIL_API_KEY: process.env.EMAIL_API_KEY,
    MAILER_ID: process.env.MAILER_ID,
};

const env = process.env.NODE_ENV || "development";
let defaultConfig = null;

switch (env) {
    case "prod":
    case "production":
        defaultConfig = {
            URL: "",
        };
        break;
    default:
        defaultConfig = {
            URL: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        };
        break;
}

const config = merge(defaultConfig, globalConfig) as IConfig;

export { config };
