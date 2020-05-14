const Post = require('../../../models/Post');
const validatePostInput = require('../../../validation/post');

/**
 * Test endpoint
 * @param {Request} req 
 * @param {Response} res 
 */
const test = (req, res) => res.json({ msg: 'Posts Works' });

/**
 * Get a list of Posts
 * @param {Request} req 
 * @param {Response} res 
 */
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }).exec();
        res.json(posts);
    } catch (error) {
        res.status(404).json({ noPostFound: 'No posts found' })
    }
};

/**
 * Get a post by ID
 * @param {Request} req 
 * @param {Response} res 
 */
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).exec();
        res.json(post);
    } catch (error) {
        res.status(404).json({ noPostFound: 'No post found with that ID' });
    }
};

/**
 * Create a new Post
 * @param {Request} req 
 * @param {Response} res 
 */
const createPost = async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);
};

/**
 * Delete a post
 * @param {Request} req 
 * @param {Response} res 
 */
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).exec();
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
        }
        // Delete
        await post.remove().exec();
        res.json({ success: true });

    } catch (error) {
        res.status(404).json({ postnotfound: 'No post found' })
    }
};

/**
 * Like a post
 * @param {Request} req 
 * @param {Response} res 
 */
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' });
        }
        // Add user id to likes array
        post.likes.unshift({ user: req.user.id });
        const updatedPost = await post.save();
        res.json(updatedPost).exec();
    } catch (error) {
        res.status(404).json({ postnotfound: 'No post found' })
    }
};

/**
 * Unlike a post
 * @param {Request} req 
 * @param {Response} res 
 */
const unlikePost = async (req, res) => {
    try {
        const post = Post.findById(req.params.id).exec();
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this post' });
        }
        // Get remove index
        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
        // Splice out of array
        post.likes.splice(removeIndex, 1);
        // Save
        const updatedPost = await post.save();
        res.json(updatedPost)
    } catch (error) {
        res.status(404).json({ postnotfound: 'No post found' })
    }
};

/**
 * Add a new Comment
 * @param {Request} req 
 * @param {Response} res 
 */
const addComment = async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check Validation
    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }
    try {
        const post = Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        };
        // Add to comments array
        post.comments.unshift(newComment);
        // Save
        const updatedPost = await post.save();
        res.json(updatedPost)
    } catch (error) {
        res.status(404).json({ postnotfound: 'No post found' });
    }
};

/**
 * Delete a comment
 * @param {Request} req 
 * @param {Response} res 
 */
const deleteComment = async (req, res) => {
    const post = Post.findById(req.params.id).exec();
    try {
        if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({ commentnotexists: 'Comment does not exist' });
        }
        // Get remove index
        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
        // Splice comment out of array
        post.comments.splice(removeIndex, 1);
        const updatedPost = post.save();
        res.json(updatedPost)

    } catch (error) {
        res.status(404).json({ postnotfound: 'No post found' });
    }
};

module.exports = {
    test,
    getPosts,
    getPostById,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment
}
