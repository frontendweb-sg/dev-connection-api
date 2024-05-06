declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string
      NODE_ENV: 'development' | 'production'
      PORT?: string
      DATABASE_URI: string
      SECRET_KEY: string
      BREVO_SMTP: string
      BREVO_PORT: number
      MAILER_USER: string
      MAILER_USER_PASSWORD: string
    }
  }
}

export {}
