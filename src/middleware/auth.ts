import { Request, Response, NextFunction } from 'express'
import { Jwt } from '../utils/jwt'
import { AuthError } from '../errors'
import { AppContent } from '../utils/content'

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.get('Authorization')

  const token = header?.split(' ')[1]

  let verify
  try {
    verify = Jwt.verifyToken(token!) as any

    if (!verify) throw new AuthError(AppContent.invalidToken)

    req.user = verify

    next()
  } catch (error) {
    next(error)
  }
}
