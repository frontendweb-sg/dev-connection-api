import { Request, Response, NextFunction } from 'express'
import { IUser, User } from '../models/user'
import { AuthError } from '../errors'

/**
 * Logged in user
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const loggedInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (await User.findById(req.user?.id)) as IUser
    if (!user) throw new AuthError('Unauthorized access')
    return res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
