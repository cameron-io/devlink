import express, { Router } from 'express'
import { validationResult } from 'express-validator'
import auth from '../middleware/auth'
import Post from '../models/Post'
import User from '../models/User'

const postsRouter: Router = express.Router()

// @route    POST api/posts
// @desc     Create a post
// @access   Private
postsRouter.post('/', auth, async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user: any = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            user: req.user.id,
        })

        const post = await newPost.save()

        res.json(post)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
postsRouter.get('/', auth, async (req: any, res: any) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
postsRouter.get('/:id', auth, async (req: any, res: any) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post)
    } catch (err: any) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('Server error')
    }
})

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
postsRouter.delete('/:id', auth, async (req: any, res: any) => {
    try {
        const post: any = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove()

        res.json({ msg: 'Post deleted' })
    } catch (err: any) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('Server error')
    }
})

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
postsRouter.put('/like/:id', auth, async (req: any, res: any) => {
    try {
        const post: any = await Post.findById(req.params.id)

        // Check if post is already liked
        if (
            post.likes.filter((like: any) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.json({ msg: 'Post already liked' })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
postsRouter.put('/unlike/:id', auth, async (req: any, res: any) => {
    try {
        const post: any = await Post.findById(req.params.id)

        // Check if post is already liked
        if (
            post.likes.filter((like: any) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.json({ msg: 'Post has not yet been liked' })
        }

        // Get remove index
        const removeIndex = post.likes
            .map((like: any) => like.user.toString())
            .indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
postsRouter.post('/comment/:id', auth, async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user: any = await User.findById(req.user.id).select('-password')
        const post: any = await Post.findById(req.params.id)

        const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user.id,
        }

        post.comments.unshift(newComment)

        await post.save()

        res.json(post.comments)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route    POST api/posts/comment/:id/:comment_id
// @desc     Delete a comment
// @access   Private
postsRouter.delete('/comment/:id/:comment_id', auth, async (req: any, res: any) => {
    try {
        const post: any = await Post.findById(req.params.id)

        // Pull out comments
        const comment: any = post.comments.find(
            (comment: any) => comment.id === req.params.comment_id
        )

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' })
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'User not authorized' })
        }

        // Get remove index
        const removeIndex = post.comments
            .map((comment: any) => comment.user.toString())
            .indexOf(req.user.id)

        post.comments.splice(removeIndex, 1)

        await post.save()

        res.json(post.comments)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

export default postsRouter
