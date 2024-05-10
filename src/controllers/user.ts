import { Request, Response, NextFunction } from 'express'
import { IUser, IUserDoc, User } from '../models/user'
import { AuthError } from '../errors'
import { AppContent } from '../utils/content'
import { Password } from '../utils'
import { Profile, ProfileDoc } from '../models/profile'

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
    if (!user) throw new AuthError(AppContent.unauthorizedAccess)
    return res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

/**
 * Logged in user profile
 * @param req
 * @param res
 * @param next
 */
export const loggedInUerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id

    const profie = (await Profile.findOne({ user: userId })) as ProfileDoc

    if (!profie) throw new AuthError('Unauthorized access')

    return res.status(200).send(profie)
  } catch (error) {
    next(error)
  }
}

/**
 * User
 * @param req
 * @param res
 * @param next
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    const { password } = req.body

    const user = (await User.findById(userId)) as IUserDoc

    if (!user) throw new AuthError('Unathorized access!')

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: Password.hash(password)
        }
      },
      { new: true }
    )

    return res.status(200).json({
      message: 'Password changed successfully',
      id: userId
    })
  } catch (error) {
    next(error)
  }
}
