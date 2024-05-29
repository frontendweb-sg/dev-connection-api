import { Router } from 'express'
import { auth } from '../middleware/auth'
import { addPost, deletePost, getPost, getPosts, updatePost } from '../controllers/post'

const route = Router()

route.get('/', auth, getPosts)
route.get('/:postId', auth, getPost)
route.post('/', auth, addPost)
route.put('/:postId', auth, updatePost)
route.delete('/:postId', auth, deletePost)

export { route as postRoute }
