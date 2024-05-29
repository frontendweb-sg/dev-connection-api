import { Request, Response, NextFunction } from 'express'
import { IPostDoc, Post } from '../models/post'
import { BadRequestError, NotFoundError } from '../errors'

/**
 * Get all posts
 * @param req
 * @param res
 * @param next
 */
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = (await Post.find()
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })
      .sort({
        createdAt: -1
      })) as IPostDoc[]

    return res.status(200).send(posts)
  } catch (error) {
    next(error)
  }
}

/**
 * Get post by id
 * @param req
 * @param res
 * @param next
 */
const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId
    const post = (await Post.findById(postId)
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })
      .sort({
        createdAt: -1
      })) as IPostDoc

    if (!post) throw new NotFoundError('Post not found!')

    return res.status(200).send(post)
  } catch (error) {
    next(error)
  }
}

/**
 * Add post
 * @param req
 * @param res
 * @param next
 */
const addPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    body.user = req.user?.id

    const newPost = new Post(body)

    const result = await newPost.save().then((res) => res.populate('user'))

    return res.status(201).send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * Update post
 * @param req
 * @param res
 * @param next
 */
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status

    if (status) return updatePostStatus(req, res, next)

    const postId = req.params.postId
    const body = req.body
    body.user = req.user?.id

    const result = (await Post.findOneAndUpdate(
      { _id: postId, user: req.user?.id }, // matcher
      { $set: body },
      { new: true }
    )
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })) as IPostDoc

    return res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

/**
 * Delete post
 * @param req
 * @param res
 * @param next
 */
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId

    const result = (await Post.findOneAndDelete(
      { _id: postId, user: req.user?.id } // matcher
    )) as IPostDoc

    if (!result) throw new BadRequestError('There is no post related to this id' + postId)

    return res.status(200).json({
      id: postId,
      message: 'Post deleted'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Post status constroller
 * @param req
 * @param res
 * @param next
 */
const updatePostStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId
    const status = req.query.status
    const result = (await Post.findOneAndUpdate(
      { _id: postId, user: req.user?.id }, // matcher
      { $set: { active: status === 'active' ? true : false } },
      { new: true }
    )
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })) as IPostDoc

    return res.status(200).send(result)
  } catch (error) {
    next(error)
  }
}

export { getPost, getPosts, addPost, deletePost, updatePost }
