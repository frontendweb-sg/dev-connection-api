import { Request, Response, NextFunction } from 'express'
import { Profile, type Employment } from '../models/profile'
import { NotFoundError } from '../errors'

/**
 * Add Employment
 * @param req
 * @param res
 * @param next
 */
export const addEmployment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileId = req.params.profileId
    const body = req.body as Employment

    const profile = (await Profile.findById(profileId)) as Profile

    if (!profile) throw new NotFoundError('Profile not found!')

    const result = await Profile.findByIdAndUpdate(
      profileId,
      { $push: { employment: body } },
      { new: true }
    )

    return res.status(201).send(result?.employment)
  } catch (error) {
    next(error)
  }
}

/**
 * Update employment
 * @param req
 * @param res
 * @param next
 */
export const updateEmployment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileId = req.params.profileId
    const employmentId = req.params.employmentId
    const body = req.body as Employment

    const filter = { _id: profileId, employment: { _id: employmentId } }
    const result = await Profile.findByIdAndUpdate(
      filter,
      { $set: { employment: body } },
      { new: true }
    )

    return res.status(200).send(result?.employment)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete employment
 * @param req
 * @param res
 * @param next
 */
export const deleteEmployment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileId = req.params.profileId
    const employmentId = req.params.employmentId

    const filter = { _id: profileId, employment: { _id: employmentId } }
    const result = await Profile.findByIdAndUpdate(
      filter,
      { $pull: { employment: { _id: employmentId } } },
      { new: true }
    )

    return res.status(200).send(result?.employment)
  } catch (error) {
    next(error)
  }
}
