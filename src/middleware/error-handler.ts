import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/custom-error'
import { MulterError } from 'multer'
import { BadRequestError } from '../errors'
import { AppContent } from '../utils/content'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    error = new BadRequestError(AppContent.uploadImageMessage)
  }
  if (error instanceof CustomError) {
    return res.status(error.status).send({ errors: error.renderError() })
  }

  res.send({
    error: {
      message: AppContent.somthingWentWrong
    }
  })
}
