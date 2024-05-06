import { Request, Response, NextFunction } from 'express'
import { LoginBody } from '../types'
import { IUserDoc, User } from '../models/user'
import { AuthError, BadRequestError, NotFoundError } from '../errors'
import { Jwt, Password } from '../utils'
import { Mailer } from '../utils/mailer'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
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
      throw new NotFoundError('No account associated with us, please register!')
    }

    const verify = Password.compare(password, user.password)
    if (!verify) throw new AuthError('Invalid password!')

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
    if (user) throw new BadRequestError('Email already existed!')
    const newUser = new User(req.body)
    const result = await newUser.save()

    if (result && result.role !== 'admin') {
      const htmlFile = fs.readFileSync(path.join(__dirname, '..', `views/register.ejs`), 'utf-8')
      const template = ejs.compile(htmlFile)

      Mailer.sendMail({
        to: req.body.email,
        subject: 'Registraion',
        text: `Welcome to ${newUser.firstname} ${newUser.lastname}`,
        html: template({
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          baseUrl: res.locals.baseUrl,
          token: Jwt.genToken({ email: req.body.email, id: newUser.id })
        })
      })
    }
    return res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}
