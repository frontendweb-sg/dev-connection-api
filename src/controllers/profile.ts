import { Request, Response, NextFunction } from 'express'
import { Gender, Profile, ProfileDoc } from '../models/profile'
import { BadRequestError, NotFoundError } from '../errors'
import mongoose, { MongooseError } from 'mongoose'

/**
 * Get logged in user profile
 * @param req
 * @param res
 * @param next
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId

    const profile = (await Profile.findOne({ user: userId })) as ProfileDoc
    if (!profile) throw new NotFoundError('No profile found')

    return res.status(200).send(profile)
  } catch (error) {
    next(error)
  }
}

/**
 * Add user profile
 * @param req
 * @param res
 * @param next
 */
export const addProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const profile = await Profile.findOne({ user: req.user?.id })
    if (profile) throw new BadRequestError('Profile already existed!')

    body.user = req.user?.id
    const newProfile = new Profile(body)
    await newProfile.save()

    return res.status(201).send(newProfile)
  } catch (error) {
    if (error instanceof MongooseError) {
      error = new BadRequestError(error.message)
    }
    next(error)
  }
}

/**
 * Update profile
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      company,
      designation,
      summary,
      hobbies,
      website,
      address,
      totalExp,
      noticeperiod,
      qualification,
      gitusername,
      languages,
      salary,
      social
    } = req.body as Profile
    const { profileId } = req.params

    const profile = (await Profile.findById(profileId)) as ProfileDoc
    if (profile) throw new BadRequestError('Profile not existed!, pelase create')

    const result = await Profile.findByIdAndUpdate(
      { user: req.user?.id, _id: profileId },
      {
        $set: {
          company,
          designation,
          summary,
          hobbies,
          website,
          address,
          totalExp,
          noticeperiod,
          languages,
          salary,
          social,
          qualification,
          gitusername
        }
      },
      { new: true }
    )

    return res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}
