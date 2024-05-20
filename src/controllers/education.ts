import { Request, Response, NextFunction } from 'express'
import { Profile, type Education } from '../models/profile'
import { NotFoundError } from '../errors'

/**
 * Add Education
 * @param req
 * @param res
 * @param next
 */
export const addEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { profileId } = req.params
    const body = req.body as Education

    const profile = (await Profile.findById(profileId)) as Profile

    if (!profile) throw new NotFoundError('Profile not found!')

    const result = await Profile.findByIdAndUpdate(
      profileId,
      { $push: { education: body } },
      { new: true }
    )

    return res.status(201).send(result?.education)
  } catch (error) {
    next(error)
  }
}

/**
 * Update education
 * @param req
 * @param res
 * @param next
 */
export const updateEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileId = req.params.profileId
    const educationId = req.params.educationId
    const body = req.body as Education

    const filter = { _id: profileId, education: { _id: educationId } }
    const result = await Profile.findByIdAndUpdate(
      filter,
      { $set: { education: body } },
      { new: true }
    )

    return res.status(200).send(result?.education)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete education
 * @param req
 * @param res
 * @param next
 */
export const deleteEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileId = req.params.profileId
    const educationId = req.params.educationId

    const filter = { _id: profileId, education: { _id: educationId } }
    const result = await Profile.findByIdAndUpdate(
      filter,
      { $pull: { education: { _id: educationId } } },
      { new: true }
    )

    return res.status(200).send(result?.education)
  } catch (error) {
    next(error)
  }
}
