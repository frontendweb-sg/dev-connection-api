import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import { Request, Response, NextFunction } from 'express'
import { LoginBody } from '../types'
import { IUserDoc, User } from '../models/user'
import { AuthError, BadRequestError, NotFoundError } from '../errors'
import { Jwt, Password } from '../utils'
import { Mailer } from '../utils/mailer'
import { AppContent } from '../utils/content'

/**
 * Sign in controller
 * @param req
 * @param res
 * @param next
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as LoginBody
  try {
    const user = (await User.findOne({
      $or: [{ email }, { mobile: email }]
    }).select('+password')) as IUserDoc

    if (!user) {
      throw new NotFoundError(AppContent.noAccount)
    }

    const verify = Password.compare(password, user.password)
    if (!verify) throw new AuthError(AppContent.invalidPassword)

    const accessToken = Jwt.genToken({ email: user.email, id: user._id })
    return res.status(200).json({
      expireIn: 3600,
      accessToken,
      user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Sign up controller
 * @param req
 * @param res
 * @param next
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (await User.findOne({ email: req.body.email })) as IUserDoc
    if (user) throw new BadRequestError(AppContent.emailExisted)
    const newUser = new User(req.body)
    const result = await newUser.save()

    if (result && result.role !== 'admin') {
      const htmlFile = fs.readFileSync(path.join(__dirname, '..', `views/register.ejs`), 'utf-8')
      const template = ejs.compile(htmlFile)

      Mailer.sendMail({
        to: req.body.email,
        subject: AppContent.registration,
        text: `Welcome to ${newUser.firstname} ${newUser.lastname}`,
        html: template({
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          baseUrl: res.locals.baseUrl,
          token: Jwt.genToken({ email: req.body.email, id: newUser.id }, { expiresIn: '24h' })
        })
      })
    }
    return res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

/**
 * Email verification handler
 * @param req
 * @param res
 * @param next
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token

    const verify = Jwt.verifyToken(token) as any

    if (!verify) res.redirect(`${res.locals.clientUrl}auth/verify-email?message='token expire'`)

    await User.findByIdAndUpdate(verify.id, { $set: { emailVerify: true } }, { new: true })

    res.redirect(`${res.locals.clientUrl}auth/verify-email?verify=${verify.email}`)
  } catch (error) {
    res.redirect(`${res.locals.clientUrl}auth/verify-email?message='invalid token'`)
  }
}

/**
 * Forgot password
 * @param req
 * @param res
 * @param next
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (await User.findOne({ email: req.body.email })) as IUserDoc

    if (!user) throw new BadRequestError(AppContent.noAccount)

    const htmlFile = fs.readFileSync(
      path.join(__dirname, '..', `views/forgot-password.ejs`),
      'utf-8'
    )
    const template = ejs.compile(htmlFile)

    Mailer.sendMail({
      to: req.body.email,
      subject: AppContent.forgotPassword,
      text: `Hi ${user.firstname} ${user.lastname}`,
      html: template({
        firstname: user.firstname,
        lastname: user.lastname,
        baseUrl: res.locals.clientUrl,
        token: Jwt.genToken({ email: req.body.email, id: user.id }, { expiresIn: '24h' })
      })
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Reset password
 * @param req
 * @param res
 * @param next
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, token } = req.body
    const verify = Jwt.verifyToken(token) as any
    if (!verify) new AuthError(AppContent.invalidToken)

    const user = (await User.findById(verify.id)) as IUserDoc
    if (!user) throw new AuthError(AppContent.invalidToken)

    const result = await User.findByIdAndUpdate(
      verify.id,
      {
        $set: {
          password: Password.hash(password)
        }
      },
      { new: true }
    )

    return res.status(200).json({
      id: result?.id,
      message: AppContent.passwordUpdated
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Send verification code
 * @param req
 * @param res
 * @param next
 */
export const sendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    const user = (await User.findOne({ email })) as IUserDoc

    if (!user) throw new NotFoundError(AppContent.noAccount)

    const htmlFile = fs.readFileSync(
      path.join(__dirname, '..', `views/verification-code.ejs`),
      'utf-8'
    )
    const template = ejs.compile(htmlFile)

    Mailer.sendMail({
      to: req.body.email,
      subject: AppContent.forgotPassword,
      text: `Hi ${user.firstname} ${user.lastname}`,
      html: template({
        firstname: user.firstname,
        lastname: user.lastname,
        baseUrl: res.locals.baseUrl,
        token: Jwt.genToken({ email: req.body.email, id: user.id }, { expiresIn: '24h' })
      })
    })

    return res.status(200).json({
      message: AppContent.mailSent,
      email
    })
  } catch (error) {
    next(error)
  }
}
