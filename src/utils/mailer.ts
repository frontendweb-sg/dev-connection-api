import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

export interface MailerBody {
  from?: string // sender address
  to: string // list of receivers
  subject: string // Subject line
  text?: string // plain text body
  html?: string // html body
}

const DEFAULT_MAILER_BODY: MailerBody = {
  from: process.env.MAILER_USER!,
  subject: 'User registration',
  to: '',
  text: '',
  html: ''
}
export class Mailer {
  private _transport: Transporter

  constructor() {
    console.log('dev env', process.env.NODE_ENV)
    this._transport = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_USER_PASSWORD
      }
    })
  }

  static async sendMail(body: MailerBody = DEFAULT_MAILER_BODY) {
    const mailer = new Mailer()

    try {
      await mailer._transport.sendMail({
        ...body,
        from: process.env.MAILER_USER
      })
      console.log('Mail sent!')
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      else console.log('mailer error', error)
    }
  }
}
