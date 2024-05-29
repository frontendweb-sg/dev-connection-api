import { Request, Response, NextFunction } from 'express'

/**
 * Add comment
 * @param req
 * @param res
 * @param next
 */
const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId
    const body = req.body
  } catch (error) {
    next(error)
  }
}

/**
 * Delete comment
 * @param req
 * @param res
 * @param next
 */
const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error)
  }
}
