declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      DATABASE_URI: string;
      SECRET_KEY: string;
    }
  }
}

export {};
