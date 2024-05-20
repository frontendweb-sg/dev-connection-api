import { Router } from 'express'
import { auth } from '../middleware/auth'
import { addProfile, getProfile, updateProfile } from '../controllers/profile'
import { addEducation, deleteEducation, updateEducation } from '../controllers/education'

const route = Router()

route.get('/:userId', auth, getProfile)
route.post('/', auth, addProfile)
route.put('/:profileId', auth, updateProfile)

route.post('/:profileId/education', auth, addEducation)
route.put('/:profileId/education/:educationId', auth, updateEducation)
route.delete('/:profileId/education/:educationId', auth, deleteEducation)

export { route as profileRoute }
