import { Router } from 'express'
import { auth } from '../middleware/auth'

import { changePassword, loggedInUser } from '../controllers/user'

const route = Router()

route.get('/me', auth, loggedInUser)
route.post('/change-password', auth, changePassword)

export { route as userRoute }
